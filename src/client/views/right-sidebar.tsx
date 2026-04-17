/**
 * @file right-sidebar.tsx
 * @description Windows XP / classic style right-side pet launcher sidebar.
 *
 * How it works:
 * 1. Fixed to the right edge of the screen, above the taskbar (bottom: 30px).
 * 2. Styled with a solid light-gray gradient matching the XP Classic/Silver theme,
 *    replacing the previous Frutiger Aero frosted-glass look.
 * 3. Renders a vertical list of pet icon buttons — one per PetDef.
 * 4. Each button shows the pet's icon (image or emoji) and a tooltip on hover.
 * 5. Active pets (those currently on the desktop) show an XP-blue dot indicator.
 * 6. Clicking a button calls onToggle(petId) which parent uses to add/remove the pet.
 * 7. Button states mirror XP classic buttons:
 *    - Default: transparent background
 *    - Hovered: slightly lighter gray highlight with raised bevel
 *    - Active (pet on desktop): inset/depressed shadow with darker background
 */

import { useState } from 'react';
import type { PetDef } from './desktop-pet';

interface RightSidebarProps {
  pets: PetDef[];
  /** Set of pet IDs currently active on the desktop */
  activePetIds: Set<string>;
  /** Toggle a pet on/off the desktop */
  onToggle: (petId: string) => void;
}

/**
 * Right-docked sidebar with a Windows XP Classic / Silver theme.
 * Uses a horizontal gradient (left-to-right) to simulate a cylindrical 3-D
 * surface matching the XP taskbar aesthetic, but in light gray tones.
 */
export function RightSidebar({ pets, activePetIds, onToggle }: RightSidebarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 30, // above taskbar
        width: 34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        paddingTop: 6,
        paddingBottom: 6,
        background: 'linear-gradient(90deg, var(--xp-gradient))',
        borderLeft: '1px solid rgb(136, 136, 136)',
        boxShadow: '#f0f0f0 1px 0 1px inset',
        zIndex: 9000,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'none',
      }}
    >
      {pets.map((pet) => (
        <PetButton
          key={pet.id}
          pet={pet}
          active={activePetIds.has(pet.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

// ── Individual pet launcher button ────────────────────────────────────────────

interface PetButtonProps {
  pet: PetDef;
  active: boolean;
  onToggle: (id: string) => void;
}

/**
 * A single sidebar button for one pet.
 *
 * Visual states (XP Classic button behaviour):
 * - Default:  no background, no border — blends into sidebar
 * - Hovered:  pale gray raised tile with white top-left bevel lines
 * - Active pet on desktop: slightly darker background with an inset shadow
 *   (the "pressed" appearance), plus the XP-blue dot indicator at bottom-right
 *
 * Tooltip appears to the left on hover, with a simple XP-style dark frame.
 */
function PetButton({ pet, active, onToggle }: PetButtonProps) {
  const [hovered, setHovered] = useState(false);
  const isImage = pet.iconSrc.startsWith('http') || pet.iconSrc.startsWith('/');

  /**
   * Determine button background & box-shadow based on state.
   * active  → depressed / inset shadow, slightly darker fill
   * hovered → raised bevel (top-left white, bottom-right dark)
   * default → transparent
   */
  const getBtnStyle = (): React.CSSProperties => {
    if (active) {
      return {
        background: 'linear-gradient(135deg, #c0c0c0, #d4d4d4)',
        boxShadow:
          'inset 1px 1px 2px rgba(0,0,0,0.35), inset -1px -1px 1px rgba(255,255,255,0.6)',
        border: '1px solid #a0a0a0',
      };
    }
    if (hovered) {
      return {
        background: 'linear-gradient(135deg, #f8f8f8, #e8e8e8)',
        boxShadow:
          'inset -1px -1px 1px rgba(0,0,0,0.2), inset 1px 1px 1px rgba(255,255,255,0.9)',
        border: '1px solid #b0b0b0',
      };
    }
    return {
      background: 'transparent',
      boxShadow: 'none',
      border: '1px solid transparent',
    };
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        title={pet.label}
        onClick={(e) => { e.stopPropagation(); onToggle(pet.id); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 28,
          height: 28,
          borderRadius: 3,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          overflow: 'hidden',
          transition: 'background 0.1s ease, box-shadow 0.1s ease',
          // Spread the base button styles (background, boxShadow, border)
          ...getBtnStyle(),
        }}
      >
        {isImage ? (
          <img
            src={pet.iconSrc}
            alt={pet.label}
            draggable={false}
            style={{
              width: 20,
              height: 20,
              objectFit: 'contain',
              pointerEvents: 'none',
              imageRendering: 'pixelated',
              // Slightly muted when active (depressed) to reinforce pressed feel
              opacity: active ? 0.88 : 1,
            }}
          />
        ) : (
          <span style={{ fontSize: 16, lineHeight: 1, pointerEvents: 'none' }}>
            {pet.iconSrc}
          </span>
        )}
      </button>

      {/* Hover tooltip — appears to the left of the button */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            right: 32,
            top: '50%',
            transform: 'translateY(-50%)',
            // XP-style tooltip: pale yellow with a dark border
            background: '#ffffe1',
            border: '1px solid #767676',
            borderRadius: 2,
            padding: '2px 7px',
            whiteSpace: 'nowrap',
            color: '#000000',
            fontSize: 11,
            fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
            fontWeight: 'normal',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
            zIndex: 9100,
          }}
        >
          {pet.label}
          {/* Arrow pointing right */}
          <span
            style={{
              position: 'absolute',
              right: -5,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
              borderLeft: '5px solid #767676',
            }}
          />
          {/* Inner arrow fill */}
          <span
            style={{
              position: 'absolute',
              right: -3,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '3px solid transparent',
              borderBottom: '3px solid transparent',
              borderLeft: '4px solid #ffffe1',
            }}
          />
        </div>
      )}

      {/* XP blue active indicator dot — kept as-is */}
      {active && (
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #7ef, #18bbff)',
            border: '1px solid rgba(0,100,200,0.6)',
            boxShadow: '0 0 4px rgba(24,187,255,0.8)',
          }}
        />
      )}
    </div>
  );
}
