/**
 * @file desktop-pet.tsx
 * @description A draggable desktop pet / widget that floats above all windows.
 *
 * How it works:
 * 1. Absolutely positioned at (x, y) with a very high z-index (9999) to float above XP windows.
 * 2. onPointerDown: Records the pointer offset from the pet's top-left corner and starts drag.
 *    Uses setPointerCapture so the pet keeps receiving events even if the pointer leaves it.
 * 3. onPointerMove: Updates position = pointer - offset, clamped within viewport bounds.
 * 4. onPointerUp: Releases capture, pet stays at its final position.
 * 5. Renders petSrc as a <img> (supports GIF and static images) or an emoji if no valid URL.
 * 6. A tiny close button (×) appears in the top-right corner to dismiss the pet.
 *
 * PetDef shape:
 *   - iconSrc: Shown in the right sidebar launcher (emoji or small image)
 *   - petSrc:  Shown on the desktop — can be .gif, .png, .webp, emoji, or any URL
 */

import { useState, useRef, useCallback } from 'react';

/** Desktop pet definition — used to configure each pet in the sidebar and on the desktop */
export interface PetDef {
  /** Unique identifier */
  id: string;
  /** Display label shown below the pet and on the sidebar tooltip */
  label: string;
  /** Icon shown in the right sidebar launcher button — emoji or image URL */
  iconSrc: string;
  /** Actual pet graphic shown on the desktop — supports GIF, PNG, WEBP, emoji, or any URL */
  petSrc: string;
  /** Width/height of the desktop pet image in pixels (default: 80) */
  size?: number;
}

interface DesktopPetProps {
  pet: PetDef;
  /** Called when the user clicks the × dismiss button */
  onDismiss: (id: string) => void;
}

const TASKBAR_H = 30;

/** Check if a string looks like an image URL (starts with http, https, or /) */
function isImageUrl(src: string): boolean {
  return src.startsWith('http') || src.startsWith('/');
}

/**
 * Single draggable desktop pet component.
 * Spawns near the right sidebar by default and can be dragged freely.
 */
export function DesktopPet({ pet, onDismiss }: DesktopPetProps) {
  // Initial spawn position: upper-right area, offset slightly from the sidebar
  const [pos, setPos] = useState({ x: window.innerWidth - 160, y: 80 + Math.random() * 200 });
  const dragRef = useRef<{ ox: number; oy: number } | null>(null);
  const petSize = pet.size ?? 80;

  /** Start dragging — record offset from pointer to pet origin */
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      ox: e.clientX - pos.x,
      oy: e.clientY - pos.y,
    };
  }, [pos]);

  /** Move pet, clamped within the viewport */
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const rawX = e.clientX - dragRef.current.ox;
    const rawY = e.clientY - dragRef.current.oy;
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - petSize - 8, rawX)),
      y: Math.max(0, Math.min(window.innerHeight - TASKBAR_H - petSize - 8, rawY)),
    });
  }, [petSize]);

  /** End drag */
  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const petIsImage = isImageUrl(pet.petSrc);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        cursor: dragRef.current ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(pet.id); }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
          border: '1px solid #991b1b',
          color: '#fff',
          fontSize: '9px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          padding: 0,
          zIndex: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        ×
      </button>

      {/* Pet image (supports GIF/PNG/WEBP) or emoji */}
      {petIsImage ? (
        <img
          src={pet.petSrc}
          alt={pet.label}
          draggable={false}
          style={{
            width: petSize,
            height: petSize,
            objectFit: 'contain',
            pointerEvents: 'none',
            // Don't pixelate GIFs — only use pixelated for pixel-art icons
            imageRendering: 'auto',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: petSize * 0.7,
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
            pointerEvents: 'none',
          }}
        >
          {pet.petSrc}
        </div>
      )}

      {/* Label tooltip beneath pet */}
      <span
        style={{
          color: '#fff',
          fontSize: '10px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
          fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
          background: 'rgba(0,0,60,0.55)',
          padding: '1px 4px',
          borderRadius: 2,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        {pet.label}
      </span>
    </div>
  );
}
