/**
 * @file use-desktop-icons.ts
 * @description Custom hook for managing draggable desktop icons with responsive multi-column layout.
 *
 * How it works:
 * 1. Holds a `DesktopIconState[]` array — each icon has id, position (x, y), selected state,
 *    and `isCustomPos` flag to distinguish user-dragged icons from auto-arranged ones.
 * 2. `computePositions`: Calculates icon positions using a multi-column grid layout.
 *    - If viewportHeight is known (client-side), fills columns top-to-bottom, wrapping to the
 *      next column when no more rows fit. This prevents icons from overflowing off-screen.
 *    - If viewportHeight is unknown (SSR), falls back to a single tall column.
 *    - Icons marked `isCustomPos: true` are left in their user-dragged positions.
 * 3. `startDrag`: Called on pointerdown on an icon. Records pointer-to-icon offset,
 *    sets pointer capture, and attaches pointermove / pointerup listeners on the document.
 *    On pointer up, marks the icon as `isCustomPos: true`.
 * 4. `pointermove`: Updates icon position = pointer - offset, clamped within desktop bounds.
 * 5. Resize handler: Re-runs `computePositions` for non-custom icons (fixing layout), then
 *    clamps custom-positioned icons back inside the viewport. This prevents both stacking
 *    (from resize) and icons disappearing below the visible area.
 * 6. Mount effect: After first client render, recomputes layout with real `window.innerHeight`
 *    to fix the SSR mismatch where icons may be stacked in a single invisible column.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface DesktopIconDef {
  id: string;
  label: string;
  src: string;
}

export interface DesktopIconState extends DesktopIconDef {
  x: number;
  y: number;
  /** True if the user has manually dragged this icon to a custom position */
  isCustomPos: boolean;
}

/** Size of each icon cell (px) */
export const ICON_SIZE = 80;
/** Gap between icons (px) */
const ICON_GAP = 4;
/** Taskbar height (px) */
const TASKBAR_H = 30;
/** Desktop padding (px) */
const DESKTOP_PAD = 8;

/**
 * Compute icon positions using a multi-column auto-arrange layout.
 *
 * @param defs - The full list of icon definitions (ordered).
 * @param viewportHeight - Current viewport height. If undefined (SSR), uses a single column fallback.
 * @param existingIcons - Previously computed icon states. Custom-positioned icons are preserved as-is.
 * @returns A new array of `DesktopIconState` with updated positions.
 */
function computePositions(
  defs: DesktopIconDef[],
  viewportHeight?: number,
  existingIcons?: DesktopIconState[]
): DesktopIconState[] {
  // How many rows fit in one column
  const effectiveHeight = viewportHeight ?? 600;
  const gridHeight = effectiveHeight - TASKBAR_H - DESKTOP_PAD * 2;
  const maxRows = Math.max(1, Math.floor(gridHeight / (ICON_SIZE + ICON_GAP)));

  let autoIndex = 0;

  return defs.map((def) => {
    const existing = existingIcons?.find((ic) => ic.id === def.id);

    // Preserve user-dragged positions
    if (existing?.isCustomPos) {
      return { ...existing };
    }

    // Auto-arrange: fill column top-to-bottom, then wrap to next column
    const col = Math.floor(autoIndex / maxRows);
    const row = autoIndex % maxRows;
    autoIndex++;

    return {
      ...def,
      x: DESKTOP_PAD + col * (ICON_SIZE + ICON_GAP),
      y: DESKTOP_PAD + row * (ICON_SIZE + ICON_GAP),
      isCustomPos: false,
    };
  });
}

/**
 * Clamp a position so the icon stays within the desktop visible area.
 *
 * @param x - Proposed left position.
 * @param y - Proposed top position.
 * @param vw - Viewport width (defaults to window.innerWidth).
 * @param vh - Viewport height (defaults to window.innerHeight).
 */
function clampPos(
  x: number,
  y: number,
  vw = window.innerWidth,
  vh = window.innerHeight
): { x: number; y: number } {
  const maxX = vw - ICON_SIZE - DESKTOP_PAD;
  const maxY = vh - TASKBAR_H - ICON_SIZE - DESKTOP_PAD;
  return {
    x: Math.max(DESKTOP_PAD, Math.min(maxX, x)),
    y: Math.max(DESKTOP_PAD, Math.min(maxY, y)),
  };
}

export function useDesktopIcons(defs: DesktopIconDef[]) {
  // SSR-safe initial state: use single-column fallback (no window access)
  const [icons, setIcons] = useState<DesktopIconState[]>(() => computePositions(defs));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Track active drag: { iconId, offsetX, offsetY }
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);

  /**
   * After first client-side mount, recompute with real viewport height.
   * This fixes the SSR mismatch where all icons were stacked in a single tall column
   * and many were hidden below the taskbar (off-screen).
   */
  useEffect(() => {
    setIcons((prev) => computePositions(defs, window.innerHeight, prev));
    // Only runs once on mount — defs is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Begin dragging an icon. Called from the icon's onPointerDown.
   * Selects the icon and starts pointer capture drag.
   */
  const startDrag = useCallback((e: React.PointerEvent<HTMLElement>, iconId: string) => {
    // Left button only
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    // Select this icon
    setSelectedId(iconId);

    // Find current position
    const icon = icons.find((ic) => ic.id === iconId);
    if (!icon) return;

    dragRef.current = {
      id: iconId,
      ox: e.clientX - icon.x,
      oy: e.clientY - icon.y,
    };

    // Capture pointer so we receive events outside the element
    e.currentTarget.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const raw = { x: ev.clientX - dragRef.current.ox, y: ev.clientY - dragRef.current.oy };
      const clamped = clampPos(raw.x, raw.y);
      setIcons((prev) =>
        prev.map((ic) =>
          ic.id === dragRef.current?.id
            ? { ...ic, ...clamped }
            : ic
        )
      );
    };

    const onUp = () => {
      if (dragRef.current) {
        const movedId = dragRef.current.id;
        // Mark as custom position so resize won't reset it
        setIcons((prev) =>
          prev.map((ic) => (ic.id === movedId ? { ...ic, isCustomPos: true } : ic))
        );
        dragRef.current = null;
      }
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [icons]);

  /** Deselect all icons (call when clicking desktop background) */
  const deselectAll = useCallback(() => {
    setSelectedId(null);
  }, []);

  /** Select a specific icon by id */
  const selectIcon = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  // ── Resize handler ────────────────────────────────────────────────────────────
  // For non-custom icons: re-run computePositions with the new viewport height (fixes layout).
  // For custom icons: just clamp them back inside the new viewport boundaries (no stacking).
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      setIcons((prev) => {
        // Step 1: Re-arrange non-custom icons for the new viewport size
        const reflowed = computePositions(defs, vh, prev);

        // Step 2: Clamp custom-positioned icons if they're now out of bounds
        return reflowed.map((ic) => {
          if (!ic.isCustomPos) return ic;
          const clamped = clampPos(ic.x, ic.y, vw, vh);
          if (clamped.x === ic.x && clamped.y === ic.y) return ic;
          return { ...ic, ...clamped };
        });
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [defs]);

  return { icons, selectedId, startDrag, deselectAll, selectIcon };
}
