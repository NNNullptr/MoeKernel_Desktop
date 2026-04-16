/**
 * @file xp-window.tsx
 * @description Reusable Windows XP-style floating window component with resize support.
 *
 * How it works:
 * 1. Renders a fixed-position container at (x, y) with a given width/height.
 * 2. Title bar: XP blue gradient, app icon, title, minimize/maximize/close buttons.
 * 3. Uses `useWindowDrag` to handle title bar pointer drag — calls onPositionChange.
 * 4. Clicking anywhere on the window calls onFocus to raise its z-index.
 * 5. Maximize toggles between stored size/position and fullscreen (minus taskbar).
 * 6. ResizeHandle components are placed on all 8 edges/corners — they use pointer events
 *    to compute delta movement and update both position and size via onSizeChange / onPositionChange.
 */

import React, { useState, useCallback, useRef } from 'react';
import { useWindowDrag } from '@/hooks/use-window-drag';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const MIN_W = 200;
const MIN_H = 120;

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
}

interface XpWindowProps {
  win: WindowState;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onSizeChange: (id: string, x: number, y: number, w: number, h: number) => void;
  children: React.ReactNode;
}

/** Resize direction type for the 8 handles */
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

/** Cursor mapping for each resize direction */
const CURSOR_MAP: Record<ResizeDir, string> = {
  n: 'n-resize', s: 's-resize',
  e: 'e-resize', w: 'w-resize',
  nw: 'nw-resize', ne: 'ne-resize',
  sw: 'sw-resize', se: 'se-resize',
};

/** Handle thickness */
const HANDLE_PX = 5;

/**
 * Resize handle component placed at each edge / corner of the window.
 * On pointer down, listens for pointer move globally to compute size / position deltas.
 */
function ResizeHandle({
  dir, win, onSizeChange, onFocus,
}: {
  dir: ResizeDir;
  win: WindowState;
  onSizeChange: (id: string, x: number, y: number, w: number, h: number) => void;
  onFocus: (id: string) => void;
}) {
  const startRef = useRef<{ px: number; py: number; x: number; y: number; w: number; h: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus(win.id);
    startRef.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y, w: win.width, h: win.height };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [win, onFocus]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const start = startRef.current;
    if (!start) return;

    const dx = e.clientX - start.px;
    const dy = e.clientY - start.py;

    let { x, y, w, h } = start;

    // Horizontal
    if (dir.includes('e')) w = Math.max(MIN_W, start.w + dx);
    if (dir.includes('w')) {
      const newW = Math.max(MIN_W, start.w - dx);
      x = start.x + (start.w - newW);
      w = newW;
    }
    // Vertical
    if (dir.includes('s')) h = Math.max(MIN_H, start.h + dy);
    if (dir.includes('n')) {
      const newH = Math.max(MIN_H, start.h - dy);
      y = start.y + (start.h - newH);
      h = newH;
    }

    onSizeChange(win.id, x, y, w, h);
  }, [dir, win.id, onSizeChange]);

  const handlePointerUp = useCallback(() => {
    startRef.current = null;
  }, []);

  // Positioning style for each of the 8 handles
  const style: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    cursor: CURSOR_MAP[dir],
  };

  const h = HANDLE_PX;
  if (dir === 'n')  Object.assign(style, { top: 0, left: h, right: h, height: h });
  if (dir === 's')  Object.assign(style, { bottom: 0, left: h, right: h, height: h });
  if (dir === 'e')  Object.assign(style, { top: h, right: 0, bottom: h, width: h });
  if (dir === 'w')  Object.assign(style, { top: h, left: 0, bottom: h, width: h });
  if (dir === 'nw') Object.assign(style, { top: 0, left: 0, width: h, height: h });
  if (dir === 'ne') Object.assign(style, { top: 0, right: 0, width: h, height: h });
  if (dir === 'sw') Object.assign(style, { bottom: 0, left: 0, width: h, height: h });
  if (dir === 'se') Object.assign(style, { bottom: 0, right: 0, width: h, height: h });

  return (
    <div
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
}

export function XpWindow({ win, onFocus, onClose, onMinimize, onPositionChange, onSizeChange, children }: XpWindowProps) {
  const [maximized, setMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState({ x: win.x, y: win.y, w: win.width, h: win.height });

  const handlePositionChange = useCallback(
    (pos: { x: number; y: number }) => onPositionChange(win.id, pos.x, pos.y),
    [win.id, onPositionChange]
  );

  const { handleTitlePointerDown } = useWindowDrag({
    position: { x: win.x, y: win.y },
    onPositionChange: handlePositionChange,
    onDragStart: () => onFocus(win.id),
  });

  const handleMaximize = useCallback(() => {
    if (!maximized) {
      setPreMaxState({ x: win.x, y: win.y, w: win.width, h: win.height });
      onPositionChange(win.id, 0, 0);
    } else {
      onSizeChange(win.id, preMaxState.x, preMaxState.y, preMaxState.w, preMaxState.h);
    }
    setMaximized((v) => !v);
  }, [maximized, win, preMaxState, onPositionChange, onSizeChange]);

  if (win.minimized) return null;

  const taskbarH = 30;
  const style: React.CSSProperties = maximized
    ? { position: 'fixed', left: 0, top: 0, width: 'calc(100vw - 34px)', height: `calc(100vh - ${taskbarH}px)`, zIndex: win.zIndex }
    : { position: 'fixed', left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.3)',
        border: '2px solid var(--xp-chrome-border-dark)',
        borderRadius: '6px 6px 0 0',
        overflow: 'hidden',
        fontFamily: FONT,
        userSelect: 'none',
      }}
      onPointerDown={() => onFocus(win.id)}
    >
      {/* Resize handles — only when not maximized */}
      {!maximized && (['n','s','e','w','nw','ne','sw','se'] as ResizeDir[]).map((dir) => (
        <ResizeHandle key={dir} dir={dir} win={win} onSizeChange={onSizeChange} onFocus={onFocus} />
      ))}

      {/* Title Bar */}
      <div
        onPointerDown={handleTitlePointerDown}
        style={{
          background: 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 45%, #b8b8b8 55%, #c0c0c0 100%)',
          padding: '3px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'move',
          flexShrink: 0,
          minHeight: '28px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        <img src={win.icon} alt={win.title} style={{ width: '16px', height: '16px', objectFit: 'contain', flexShrink: 0 }} />
        <span style={{ flex: 1, color: '#000', fontSize: '12px', fontWeight: 'bold', textShadow: '1px 1px 1px rgba(255,255,255,0.4)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {win.title}
        </span>
        {/* Window control buttons */}
        <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }} data-window-btn>
          <WinBtn label="_" title="Minimize" color="#c8c8c8" textColor="#000" onClick={() => onMinimize(win.id)} />
          <WinBtn label={maximized ? '❐' : '□'} title="Maximize" color="#c8c8c8" textColor="#000" onClick={handleMaximize} />
          <WinBtn label="✕" title="Close" color="#d93b3b" hoverColor="#f05050" onClick={() => onClose(win.id)} />
        </div>
      </div>

      {/* Window body */}
      <div style={{ flex: 1, background: '#fff', overflow: 'auto', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

/** XP-style title bar button (minimize / maximize / close) */
function WinBtn({ label, title, color, hoverColor, textColor, onClick }: { label: string; title: string; color: string; hoverColor?: string; textColor?: string; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  const idleTop = textColor === '#000' ? '#f4f4f4' : '#ff9a9a';
  return (
    <button
      data-window-btn
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '21px', height: '21px',
        background: hovered
          ? `linear-gradient(180deg, ${hoverColor ?? color} 0%, ${color} 100%)`
          : `linear-gradient(180deg, ${idleTop} 0%, ${color} 100%)`,
        border: '1px solid var(--xp-chrome-border)',
        borderRadius: '3px',
        color: textColor ?? '#fff',
        fontSize: '11px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1,
        fontFamily: FONT,
        flexShrink: 0,
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}
