/**
 * @file use-window-drag.ts
 * @description Custom React hook for dragging a floating window by its title bar.
 *
 * How it works:
 * 1. On `pointerdown` on the title bar, record the offset between pointer and window top-left corner.
 * 2. On `pointermove` on the document, compute new position = pointer - initial offset,
 *    clamped so the window never leaves the viewport.
 * 3. On `pointerup`, release the pointer capture and clean up listeners.
 * 4. The hook returns an `onPointerDown` handler to attach to the title bar element.
 */

import { useCallback, useRef } from 'react';

export interface DragPosition {
  x: number;
  y: number;
}

interface UseWindowDragOptions {
  /** Current window position */
  position: DragPosition;
  /** Called with the new position while dragging */
  onPositionChange: (pos: DragPosition) => void;
  /** Called when drag starts (to bring window to front) */
  onDragStart?: () => void;
}

/**
 * Attaches pointer-based drag logic to a title bar element.
 * Returns a `handleTitlePointerDown` to spread onto the title bar div.
 */
export function useWindowDrag({ position, onPositionChange, onDragStart }: UseWindowDragOptions) {
  // Store the offset between pointer position and window origin at drag start
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);

  const handleTitlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only drag on primary button (left click)
      if (e.button !== 0) return;
      // Don't drag when clicking window control buttons
      if ((e.target as HTMLElement).closest('[data-window-btn]')) return;

      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);

      dragOffset.current = {
        dx: e.clientX - position.x,
        dy: e.clientY - position.y,
      };

      onDragStart?.();

      const taskbarHeight = 30;

      const onMove = (ev: PointerEvent) => {
        if (!dragOffset.current) return;
        const newX = ev.clientX - dragOffset.current.dx;
        const newY = ev.clientY - dragOffset.current.dy;
        // Clamp within viewport — keep at least 40px of title bar visible
        const clampedX = Math.max(-200, Math.min(window.innerWidth - 40, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - taskbarHeight - 30, newY));
        onPositionChange({ x: clampedX, y: clampedY });
      };

      const onUp = () => {
        dragOffset.current = null;
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [position, onPositionChange, onDragStart]
  );

  return { handleTitlePointerDown };
}
