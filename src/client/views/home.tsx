/**
 * @file home.tsx
 * @description Main Windows XP desktop page component.
 *
 * Responsibilities:
 * 1. Renders the XP desktop wallpaper (absolute-positioned icons) and taskbar.
 * 2. Manages `isStartMenuOpen` state — toggled by the Start button.
 * 3. Closes the Start Menu + deselects icons when the user clicks the desktop background.
 * 4. Maintains a live clock in the system tray (updated every second).
 * 5. Manages `openWindows` array — each entry stores id, title, icon, x, y, width, height, zIndex, minimized.
 * 6. Uses `useDesktopIcons` hook for icon drag, selection, and responsive clamping.
 * 7. Single-click selects an icon; double-click opens the corresponding XpWindow.
 * 8. Taskbar shows a button for each open window; clicking it toggles minimize/restore.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { StartMenu } from './start-menu';
import { XpWindow } from './xp-window';
import type { WindowState } from './xp-window';
import { useDesktopIcons, ICON_SIZE } from '@/hooks/use-desktop-icons';
import { RightSidebar } from './right-sidebar';
import { DesktopPet } from './desktop-pet';
// ── Config imports — edit these files to customize the desktop ──────────────
import { WALLPAPER_URL, WINDOWS_LOGO_URL, SYSTEM_TRAY_ICONS } from '@/client/config/theme.config';
import { DESKTOP_ICON_DEFS } from '@/client/config/icons.config';
import { PET_DEFS } from '@/client/config/pets.config';
// ── App Registry — single source of truth for all window apps ───────────────
import { APP_REGISTRY } from '@/client/apps/registry';

/** Format a Date into "H:MM AM/PM" like the real XP clock */
function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

/**
 * Dynamically renders the correct app component for a given window id.
 * Looks up the APP_REGISTRY — no more manual switch/if chains.
 * To add a new app, register it in `src/client/apps/registry.ts`.
 */
function WindowContent({ id }: { id: string }) {
  const app = APP_REGISTRY[id];
  if (app) {
    const { AppComponent } = app;
    return <AppComponent />;
  }
  return (
    <div style={{ padding: '20px', fontFamily: '"Trebuchet MS", Tahoma, sans-serif', fontSize: '13px' }}>
      <p>Content for <strong>{id}</strong> coming soon!</p>
    </div>
  );
}

export function HomePage() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [clockTime, setClockTime] = useState(() => formatTime(new Date()));
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  /** Set of pet IDs currently visible on the desktop */
  const [activePetIds, setActivePetIds] = useState<Set<string>>(new Set());
  const zCounter = useRef(100);

  // ── Desktop icons drag + selection state ────────────────────────────────────
  const { icons, selectedId, startDrag, deselectAll, selectIcon } = useDesktopIcons(DESKTOP_ICON_DEFS);

  // ── Double-click detection ───────────────────────────────────────────────────
  // We track single vs. double-click manually: if same icon clicked within 350ms → double-click
  const lastClick = useRef<{ id: string; time: number } | null>(null);

  // Update clock every second
  useEffect(() => {
    const id = setInterval(() => setClockTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  // Toggle start menu
  const handleStartButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  // Close start menu + deselect icons when clicking the desktop background
  const handleDesktopClick = useCallback(() => {
    if (isStartMenuOpen) setIsStartMenuOpen(false);
    deselectAll();
  }, [isStartMenuOpen, deselectAll]);

  // Handle start menu item clicks — open the corresponding window
  const handleMenuItemClick = useCallback((id: string) => {
    setIsStartMenuOpen(false);
    openWindow(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Window management helpers ──────────────────────────────────────────────

  /** Open a window by icon id (or bring to front if already open) */
  const openWindow = useCallback((iconId: string) => {
    const app = APP_REGISTRY[iconId];
    if (!app) return;

    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === iconId);
      if (existing) {
        const maxZ = zCounter.current + 1;
        zCounter.current = maxZ;
        return prev.map((w) =>
          w.id === iconId ? { ...w, minimized: false, zIndex: maxZ } : w
        );
      }
      const offset = (prev.length % 8) * 22;
      const newZ = ++zCounter.current;
      const newWin: WindowState = {
        id: iconId,
        title: app.title,
        icon: app.icon,
        x: 80 + offset,
        y: 40 + offset,
        width: app.defaultWidth,
        height: app.defaultHeight,
        zIndex: newZ,
        minimized: false,
      };
      return [...prev, newWin];
    });
  }, []);

  // ── Listen for cross-component "open window" events ────────────────────────
  // Blog articles (and any future in-window app) dispatch:
  //   window.dispatchEvent(new CustomEvent('xp-open-window', { detail: appId }))
  // This handler catches those events and opens the corresponding window,
  // enabling "window inside a window" navigation without prop drilling.
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id) openWindow(id);
    };
    window.addEventListener('xp-open-window', handler);
    return () => window.removeEventListener('xp-open-window', handler);
  }, [openWindow]);

  /**
   * Handle icon click:
   * - Always select the icon.
   * - If same icon clicked within 350ms → double-click → open window.
   */
  const handleIconClick = useCallback((iconId: string) => {
    selectIcon(iconId);
    const now = Date.now();
    if (lastClick.current?.id === iconId && now - lastClick.current.time < 350) {
      lastClick.current = null;
      openWindow(iconId);
    } else {
      lastClick.current = { id: iconId, time: now };
    }
  }, [openWindow, selectIcon]);

  /** Bring window to front */
  const handleWindowFocus = useCallback((id: string) => {
    const newZ = ++zCounter.current;
    setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, zIndex: newZ } : w));
  }, []);

  /** Close a window */
  const handleWindowClose = useCallback((id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  /** Minimize a window */
  const handleWindowMinimize = useCallback((id: string) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  /** Update window position after drag */
  const handlePositionChange = useCallback((id: string, x: number, y: number) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, x, y } : w));
  }, []);

  /** Update window position AND size after a resize drag */
  const handleSizeChange = useCallback((id: string, x: number, y: number, width: number, height: number) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? { ...w, x, y, width, height } : w));
  }, []);

  /**
   * Toggle a pet on / off the desktop.
   * If the pet is already active, remove it; otherwise add it.
   */
  const handlePetToggle = useCallback((petId: string) => {
    setActivePetIds((prev) => {
      const next = new Set(prev);
      if (next.has(petId)) {
        next.delete(petId);
      } else {
        next.add(petId);
      }
      return next;
    });
  }, []);

  /** Called when user clicks the × on a DesktopPet */
  const handlePetDismiss = useCallback((petId: string) => {
    setActivePetIds((prev) => {
      const next = new Set(prev);
      next.delete(petId);
      return next;
    });
  }, []);

  /** Taskbar button: toggle minimize / restore */
  const handleTaskbarBtn = useCallback((id: string) => {
    setOpenWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (!win) return prev;
      if (win.minimized) {
        const newZ = ++zCounter.current;
        return prev.map((w) => w.id === id ? { ...w, minimized: false, zIndex: newZ } : w);
      }
      return prev.map((w) => w.id === id ? { ...w, minimized: true } : w);
    });
  }, []);

  return (
    <>
      <div key="1" id="root" onClick={handleDesktopClick}>
        <div
          className="_desktop_1d92e_1"
          style={{
            backgroundImage: `url("${WALLPAPER_URL}")`,
            position: 'relative',
          }}
        >
          {/* ── Desktop icon area (above taskbar) ── */}
          <div
            style={{
              position: 'absolute',
              inset: '0 0 30px 0',
              overflow: 'hidden',
            }}
          >
            {icons.map((icon) => (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                src={icon.src}
                x={icon.x}
                y={icon.y}
                selected={selectedId === icon.id}
                onPointerDown={(e) => startDrag(e, icon.id)}
                onClick={() => handleIconClick(icon.id)}
              />
            ))}
          </div>

          <div id="xp-webamp-host" style={{ inset: '0px 0px 30px', pointerEvents: 'none', position: 'fixed' }} />
        </div>

        {/* ── Taskbar ── */}
        <div className="_taskbar_oqlpl_1" data-taskbar="true">
          {/* Start Button */}
          <button
            data-start-button="true"
            onClick={handleStartButtonClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '100%',
              padding: '0 10px 0 6px',
              background: isStartMenuOpen
                ? 'linear-gradient(180deg, #1a6a1a 0%, #228b22 50%, #2ea52e 100%)'
                : 'linear-gradient(180deg, #3cb84a 0%, #28a035 40%, #1e8c2a 100%)',
              border: 'none',
              borderRight: '1px solid #1a6e1a',
              borderRadius: '0 12px 12px 0',
              cursor: 'pointer',
              boxShadow: isStartMenuOpen
                ? 'inset 1px 1px 3px rgba(0,0,0,0.5)'
                : '1px 0 3px rgba(0,0,0,0.3)',
              minWidth: '96px',
              fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
              letterSpacing: '0.5px',
              flexShrink: 0,
            }}
          >
            <img
              src={WINDOWS_LOGO_URL}
              alt="Windows"
              style={{ width: '20px', height: '20px', objectFit: 'contain' }}
            />
            <span>start</span>
          </button>

          {/* ── Open Window Buttons in Taskbar ── */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 4px',
              overflow: 'hidden',
            }}
          >
            {openWindows.map((win) => (
              <TaskbarWindowBtn
                key={win.id}
                win={win}
                onClick={() => handleTaskbarBtn(win.id)}
              />
            ))}
          </div>

          {/* System tray */}
          <div className="_system-tray_oqlpl_86">
            {SYSTEM_TRAY_ICONS.map((iconUrl, i) => (
              <div key={i} className="_system-tray-item-wrapper_oqlpl_147">
                <div className="_system-tray-item_oqlpl_100" style={{ backgroundImage: `url("${iconUrl}")` }} />
              </div>
            ))}
            <div className="_time_oqlpl_108">{clockTime}</div>
          </div>
        </div>

        {/* Overlay for dimming */}
        <div
          style={{
            backgroundColor: 'rgb(0,0,0)',
            inset: '0px',
            opacity: '0',
            pointerEvents: 'none',
            position: 'fixed',
            transition: 'opacity 500ms ease-in-out',
            zIndex: '99998',
          }}
        />
      </div>

      {/* ── XP Windows — rendered outside #root to avoid z-index issues ── */}
      {openWindows.map((win) => (
        <XpWindow
          key={win.id}
          win={win}
          onFocus={handleWindowFocus}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onPositionChange={handlePositionChange}
          onSizeChange={handleSizeChange}
        >
          <WindowContent id={win.id} />
        </XpWindow>
      ))}

      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu
          onItemClick={handleMenuItemClick}
          onLogOff={() => setIsStartMenuOpen(false)}
          onTurnOff={() => setIsStartMenuOpen(false)}
        />
      )}

      {/* ── Right Sidebar pet launcher ── */}
      <RightSidebar
        pets={PET_DEFS}
        activePetIds={activePetIds}
        onToggle={handlePetToggle}
      />

      {/* ── Active desktop pets ── */}
      {PET_DEFS.filter((p) => activePetIds.has(p.id)).map((pet) => (
        <DesktopPet
          key={pet.id}
          pet={pet}
          onDismiss={handlePetDismiss}
        />
      ))}

      <iframe
        key="3"
        height="1"
        width="1"
        style={{ border: 'none', left: '0px', position: 'absolute', top: '0px', visibility: 'hidden' }}
      />
      <div key="5" id="_r_0_" data-base-ui-portal="" data-slot="toast-portal-anchored">
        <div tabIndex={-1} role="region" aria-live="polite" aria-atomic={false} aria-relevant="additions text" aria-label="Notifications" data-slot="toast-viewport-anchored" className="outline-none" />
      </div>
      <div key="6" id="_r_1_" data-base-ui-portal="" data-slot="toast-portal">
        <div
          tabIndex={-1}
          role="region"
          aria-live="polite"
          aria-atomic={false}
          aria-relevant="additions text"
          aria-label="Notifications"
          data-position="bottom-right"
          data-slot="toast-viewport"
          className="fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)] data-[position*=top]:top-(--toast-inset) data-[position*=bottom]:bottom-(--toast-inset) data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset) data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2"
        />
      </div>
    </>
  );
}

// ── Desktop Icon Component ─────────────────────────────────────────────────────

interface DesktopIconProps {
  id: string;
  label: string;
  src: string;
  x: number;
  y: number;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClick: () => void;
}

/**
 * A single draggable desktop icon.
 * - Absolute positioned at (x, y).
 * - Shows a semi-transparent dark blue highlight when selected.
 * - Pointer events are handled via the parent hook (useDesktopIcons).
 */
function DesktopIcon({ id, label, src, x, y, selected, onPointerDown, onClick }: DesktopIconProps) {
  return (
    <div
      data-icon-id={id}
      onPointerDown={onPointerDown}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: ICON_SIZE,
        height: ICON_SIZE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '4px',
        padding: '4px',
        borderRadius: '2px',
        boxSizing: 'border-box',
        cursor: 'default',
        touchAction: 'none',
        // Selection highlight: semi-transparent dark blue overlay
        background: selected ? 'rgba(0, 60, 160, 0.45)' : 'transparent',
        border: selected ? '1px dotted rgba(255,255,255,0.7)' : '1px solid transparent',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <img
        alt={label}
        src={src}
        draggable={false}
        style={{
          width: '45px',
          height: '45px',
          objectFit: 'contain',
          pointerEvents: 'none',
          // Slight blue tint overlay when selected (via CSS filter)
          filter: selected ? 'brightness(0.85) saturate(1.2)' : 'none',
        }}
      />
      <span
        style={{
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
          fontSize: '11px',
          textAlign: 'center',
          wordBreak: 'break-word',
          maxWidth: '76px',
          padding: '1px 3px',
          lineHeight: '1.2',
          fontFamily: 'MSSS, Tahoma, "Trebuchet MS", Arial, sans-serif',
          // When selected: blue background on the label text (XP style)
          background: selected ? 'rgba(10, 58, 138, 0.8)' : 'transparent',
          borderRadius: '1px',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Taskbar window button ──────────────────────────────────────────────────────

const TASKBAR_FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

/**
 * A button in the taskbar representing an open window.
 * Highlighted when the window is active (not minimized).
 */
function TaskbarWindowBtn({ win, onClick }: { win: WindowState; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const active = !win.minimized;

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        height: '22px',
        padding: '0 8px',
        minWidth: '120px',
        maxWidth: '160px',
        background: active
          ? hovered
            ? 'linear-gradient(180deg, #6fa8e8 0%, #3a72c8 100%)'
            : 'linear-gradient(180deg, #4a85d4 0%, #2060b8 100%)'
          : hovered
            ? 'linear-gradient(180deg, #5090d8 0%, #2858a8 100%)'
            : 'linear-gradient(180deg, #3070c0 0%, #184898 100%)',
        border: active ? '1px solid #a0c4f8' : '1px solid #4870b0',
        borderRadius: '3px',
        boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.3)' : 'none',
        cursor: 'pointer',
        fontFamily: TASKBAR_FONT,
        fontSize: '11px',
        fontWeight: active ? 'bold' : 'normal',
        color: '#fff',
        textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <img src={win.icon} alt="" style={{ width: '14px', height: '14px', objectFit: 'contain', flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{win.title}</span>
    </button>
  );
}
