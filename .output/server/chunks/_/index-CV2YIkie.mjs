import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, useCallback, useTransition, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { t as trpc } from "./router-hJJcat4C.mjs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@tanstack/react-router";
import "@trpc/client";
import "@trpc/server/observable";
import "superjson";
import "@trpc/tanstack-react-query";
import "@trpc/server/adapters/fetch";
import "@trpc/server";
import "jose";
import "zod";
import "drizzle-orm";
import "nanoid";
import "drizzle-orm/libsql";
import "@libsql/client/http";
import "drizzle-orm/sqlite-core";
const DESKTOP_ICON_DEFS = [
  { id: "myComputer", label: "My Computer", src: "/assets/icons/My Computer.png" },
  { id: "resume", label: "Resume", src: "/assets/icons/Resume.png" },
  { id: "aboutme", label: "About Me", src: "/assets/icons/About.png" },
  { id: "contact", label: "Contact Me", src: "/assets/icons/Contact.png" },
  { id: "webamp", label: "Winamp", src: "/assets/icons/Winamp.png" },
  { id: "paint", label: "Paint", src: "/assets/icons/Paint.png" },
  { id: "gamesFolder", label: "Games", src: "/assets/icons/Games.png" },
  // { id: 'msn', label: 'MSN Messenger', src: '/assets/icons/MSN.png' },
  { id: "video", label: "Media Player", src: "/assets/icons/Media.png" },
  { id: "portfolio", label: "My Portfolio", src: "/assets/icons/Portfolio.png" },
  { id: "blog", label: "My Blog", src: "/assets/icons/Blog.png" },
  { id: "recycleBin", label: "Recycle Bin", src: "/assets/icons/Recycle.png" }
];
const DEFAULT_FILE_ICON = "/assets/icons/file.png";
const IMAGE_EXTS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "webp", "gif", "ico", "bmp", "svg"]);
const VIDEO_EXTS = /* @__PURE__ */ new Set(["mp4", "webm", "mov", "avi"]);
const AUDIO_EXTS = /* @__PURE__ */ new Set(["mp3", "ogg", "wav", "flac", "aac"]);
function inferFileType(name) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXTS.has(ext)) return "image";
  if (VIDEO_EXTS.has(ext)) return "video";
  if (AUDIO_EXTS.has(ext)) return "audio";
  return "other";
}
function getPublicUrl(pathSegments) {
  return "/assets/" + pathSegments.join("/");
}
let _pendingViewFile = null;
function setPendingViewFile(f) {
  _pendingViewFile = f;
}
function consumePendingViewFile() {
  const f = _pendingViewFile;
  _pendingViewFile = null;
  return f;
}
const FILE_SYSTEM = [
  {
    name: "icons",
    type: "folder",
    children: [
      { name: "file.png", type: "file" },
      { name: "My Computer.png", type: "file" },
      { name: "Resume.png", type: "file" },
      { name: "About.png", type: "file" },
      { name: "Contact.png", type: "file" },
      { name: "Winamp.png", type: "file" },
      { name: "Paint.png", type: "file" },
      { name: "Games.png", type: "file" },
      { name: "MSN.png", type: "file" },
      { name: "Media.png", type: "file" },
      { name: "Portfolio.png", type: "file" },
      { name: "Blog.png", type: "file" },
      { name: "Recycle.png", type: "file" },
      { name: "github.png", type: "file" },
      { name: "twitter.png", type: "file" },
      { name: "blog2.png", type: "file" },
      { name: "tray", type: "folder", children: [
        { name: "icon1.png", type: "file" },
        { name: "icon2.png", type: "file" }
      ] }
    ]
  },
  {
    name: "wallpapers",
    type: "folder",
    children: [
      { name: "wallpaper.jpg", type: "file" },
      { name: "wallpaper1.jpg", type: "file" },
      { name: "wallpaper2.jpg", type: "file" },
      { name: "bg1.jpg", type: "file" },
      { name: "bg2.jpg", type: "file" },
      { name: "bg3.jpg", type: "file" },
      { name: "bg4.jpg", type: "file" },
      { name: "bg5.jpg", type: "file" },
      { name: "bg6.jpg", type: "file" },
      { name: "bg7.jpg", type: "file" },
      { name: "bg8.jpg", type: "file" }
    ]
  },
  {
    name: "video",
    type: "folder",
    children: [
      { name: "1.mp4", type: "file" },
      { name: "1.webp", type: "file" }
    ]
  },
  {
    name: "tracks",
    type: "folder",
    children: [
      { name: "Tatara.mp3", type: "file" }
    ]
  },
  {
    name: "covers",
    type: "folder",
    children: [
      { name: "cover1.jpg", type: "file" },
      { name: "cover2.jpg", type: "file" }
    ]
  },
  {
    name: "pets",
    type: "folder",
    children: [
      { name: "avatars", type: "folder", children: [] },
      { name: "sprites", type: "folder", children: [] }
    ]
  },
  { name: "portfolio", type: "folder", children: [] }
];
let _pendingInitialPath = [];
function setPendingInitialPath(path) {
  _pendingInitialPath = path;
}
function consumePendingInitialPath() {
  const path = _pendingInitialPath;
  _pendingInitialPath = [];
  return path;
}
const FONT$c = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const PROGRAMS = DESKTOP_ICON_DEFS.filter((def) => def.id !== "recycleBin").map((def) => ({
  id: def.id,
  icon: def.src,
  label: def.label,
  highlight: def.id === "resume"
}));
const PLACES = FILE_SYSTEM.filter((item) => item.type === "folder").slice(0, 5);
function StartMenu({
  onItemClick,
  onLogOff,
  onTurnOff
}) {
  const handleFolderClick = (folderName) => {
    setPendingInitialPath([folderName]);
    window.dispatchEvent(new CustomEvent("xp-navigate-mycomputer", {
      detail: [folderName]
    }));
    onItemClick?.("myComputer");
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "fixed",
    bottom: "30px",
    left: "0px",
    width: "460px",
    zIndex: 1e4,
    boxShadow: "4px -4px 16px rgba(0,0,0,0.6)",
    borderRadius: "8px 8px 0 0",
    overflow: "hidden",
    fontFamily: FONT$c,
    fontSize: "13px",
    userSelect: "none",
    border: "1px solid var(--xp-chrome-border-dark)",
    borderBottom: "none"
  }, onClick: (e) => e.stopPropagation(), "data-cid": "gPmwMcgt", children: [
    /* @__PURE__ */ jsxs("div", { style: {
      background: "linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 50%, #a8a8a8 100%)",
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderBottom: "2px solid #888"
    }, children: [
      /* @__PURE__ */ jsx("img", { src: "https://static.step1.dev/g9nbov/assets/58721f37b0c0.png", alt: "User", style: {
        width: "50px",
        height: "50px",
        border: "2px solid #b8b8b8",
        borderRadius: "2px",
        objectFit: "cover",
        background: "#fff"
      } }),
      /* @__PURE__ */ jsx("span", { style: {
        color: "#000",
        fontWeight: "bold",
        fontSize: "15px",
        textShadow: "1px 1px 3px rgba(255,255,255,0.5)"
      }, children: "NNNullptr" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      height: "400px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        flex: 1,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: "4px"
      }, children: [
        PROGRAMS.map((prog, idx) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
          idx === 1 && /* @__PURE__ */ jsx(Divider, { color: "#d4d0c8" }),
          /* @__PURE__ */ jsx(ProgramBtn, { icon: prog.icon, label: prog.label, highlighted: prog.highlight, onClick: () => onItemClick?.(prog.id) })
        ] }, prog.id)),
        /* @__PURE__ */ jsxs("div", { style: {
          marginTop: "auto"
        }, children: [
          /* @__PURE__ */ jsx(Divider, { color: "#d4d0c8" }),
          /* @__PURE__ */ jsx(AllProgramsBtn, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        width: "210px",
        background: "linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)",
        borderLeft: "1px solid #a0a0a0",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: "6px"
      }, children: PLACES.map((place) => /* @__PURE__ */ jsx(PlaceBtn, { icon: place.icon ?? DEFAULT_FILE_ICON, label: place.name, onClick: () => handleFolderClick(place.name) }, place.name)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%)",
      borderTop: "2px solid #888",
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
      padding: "6px 12px"
    }, children: [
      /* @__PURE__ */ jsx(FooterBtn, { label: "Log Off", emoji: "\\uD83D\\uDD13", onClick: onLogOff }),
      /* @__PURE__ */ jsx(FooterBtn, { label: "Turn Off Computer", emoji: "\\u23FB", onClick: onTurnOff })
    ] })
  ] });
}
function Divider({
  color
}) {
  return /* @__PURE__ */ jsx("hr", { style: {
    border: "none",
    borderTop: `1px solid ${color}`,
    margin: "4px 8px"
  }, "data-cid": "JKM5OcGE" });
}
function ProgramBtn({
  icon,
  label,
  highlighted,
  onClick
}) {
  const [hovered, setHovered] = React.useState(false);
  const active = highlighted || hovered;
  return /* @__PURE__ */ jsxs("button", { onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 12px",
    background: active ? "var(--xp-chrome-highlight)" : "transparent",
    color: "#000",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    width: "100%",
    fontSize: "13px",
    fontFamily: FONT$c,
    fontWeight: highlighted ? "bold" : "normal"
  }, "data-cid": "p62FctG3", children: [
    /* @__PURE__ */ jsx("img", { src: icon, alt: label, style: {
      width: "32px",
      height: "32px",
      objectFit: "contain",
      flexShrink: 0
    } }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function PlaceBtn({
  icon,
  label,
  onClick
}) {
  const [hovered, setHovered] = React.useState(false);
  return /* @__PURE__ */ jsxs("button", { onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    background: hovered ? "var(--xp-chrome-highlight)" : "transparent",
    color: "#000",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    width: "100%",
    fontSize: "13px",
    fontFamily: FONT$c
  }, "data-cid": "2xnG7zmt", children: [
    /* @__PURE__ */ jsx("img", { src: icon, alt: label, style: {
      width: "28px",
      height: "28px",
      objectFit: "contain",
      flexShrink: 0
    } }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function AllProgramsBtn() {
  const [hovered, setHovered] = React.useState(false);
  return /* @__PURE__ */ jsxs("button", { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 12px",
    background: hovered ? "var(--xp-chrome-highlight)" : "transparent",
    color: "#000",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontSize: "13px",
    fontFamily: FONT$c,
    fontWeight: "bold"
  }, "data-cid": "PRw3eFeu", children: [
    /* @__PURE__ */ jsx("span", { children: "All Programs" }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "10px"
    }, children: "►" })
  ] });
}
function FooterBtn({
  label,
  emoji,
  onClick
}) {
  const [hovered, setHovered] = React.useState(false);
  return /* @__PURE__ */ jsxs("button", { onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    background: hovered ? "linear-gradient(180deg,#ececec 0%,#bcbcbc 100%)" : "linear-gradient(180deg,#d8d8d8 0%,#a8a8a8 100%)",
    border: "1px solid #888",
    borderRadius: "4px",
    color: "#000",
    fontSize: "12px",
    fontFamily: FONT$c,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.4)"
  }, "data-cid": "o7u_DWvX", children: [
    /* @__PURE__ */ jsx("span", { children: emoji }),
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function useWindowDrag({ position, onPositionChange, onDragStart }) {
  const dragOffset = useRef(null);
  const handleTitlePointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      if (e.target.closest("[data-window-btn]")) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragOffset.current = {
        dx: e.clientX - position.x,
        dy: e.clientY - position.y
      };
      onDragStart?.();
      const taskbarHeight = 30;
      const onMove = (ev) => {
        if (!dragOffset.current) return;
        const newX = ev.clientX - dragOffset.current.dx;
        const newY = ev.clientY - dragOffset.current.dy;
        const clampedX = Math.max(-200, Math.min(window.innerWidth - 40, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - taskbarHeight - 30, newY));
        onPositionChange({ x: clampedX, y: clampedY });
      };
      const onUp = () => {
        dragOffset.current = null;
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [position, onPositionChange, onDragStart]
  );
  return { handleTitlePointerDown };
}
const FONT$b = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const MIN_W = 200;
const MIN_H = 120;
const CURSOR_MAP = {
  n: "n-resize",
  s: "s-resize",
  e: "e-resize",
  w: "w-resize",
  nw: "nw-resize",
  ne: "ne-resize",
  sw: "sw-resize",
  se: "se-resize"
};
const HANDLE_PX = 5;
function ResizeHandle({
  dir,
  win,
  onSizeChange,
  onFocus
}) {
  const startRef = useRef(null);
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus(win.id);
    startRef.current = {
      px: e.clientX,
      py: e.clientY,
      x: win.x,
      y: win.y,
      w: win.width,
      h: win.height
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [win, onFocus]);
  const handlePointerMove = useCallback((e) => {
    const start = startRef.current;
    if (!start) return;
    const dx = e.clientX - start.px;
    const dy = e.clientY - start.py;
    let {
      x,
      y,
      w,
      h: h2
    } = start;
    if (dir.includes("e")) w = Math.max(MIN_W, start.w + dx);
    if (dir.includes("w")) {
      const newW = Math.max(MIN_W, start.w - dx);
      x = start.x + (start.w - newW);
      w = newW;
    }
    if (dir.includes("s")) h2 = Math.max(MIN_H, start.h + dy);
    if (dir.includes("n")) {
      const newH = Math.max(MIN_H, start.h - dy);
      y = start.y + (start.h - newH);
      h2 = newH;
    }
    onSizeChange(win.id, x, y, w, h2);
  }, [dir, win.id, onSizeChange]);
  const handlePointerUp = useCallback(() => {
    startRef.current = null;
  }, []);
  const style = {
    position: "absolute",
    zIndex: 10,
    cursor: CURSOR_MAP[dir]
  };
  const h = HANDLE_PX;
  if (dir === "n") Object.assign(style, {
    top: 0,
    left: h,
    right: h,
    height: h
  });
  if (dir === "s") Object.assign(style, {
    bottom: 0,
    left: h,
    right: h,
    height: h
  });
  if (dir === "e") Object.assign(style, {
    top: h,
    right: 0,
    bottom: h,
    width: h
  });
  if (dir === "w") Object.assign(style, {
    top: h,
    left: 0,
    bottom: h,
    width: h
  });
  if (dir === "nw") Object.assign(style, {
    top: 0,
    left: 0,
    width: h,
    height: h
  });
  if (dir === "ne") Object.assign(style, {
    top: 0,
    right: 0,
    width: h,
    height: h
  });
  if (dir === "sw") Object.assign(style, {
    bottom: 0,
    left: 0,
    width: h,
    height: h
  });
  if (dir === "se") Object.assign(style, {
    bottom: 0,
    right: 0,
    width: h,
    height: h
  });
  return /* @__PURE__ */ jsx("div", { style, onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, "data-cid": "Ezn4w_an" });
}
function XpWindow({
  win,
  onFocus,
  onClose,
  onMinimize,
  onPositionChange,
  onSizeChange,
  children
}) {
  const [maximized, setMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState({
    x: win.x,
    y: win.y,
    w: win.width,
    h: win.height
  });
  const handlePositionChange = useCallback((pos) => onPositionChange(win.id, pos.x, pos.y), [win.id, onPositionChange]);
  const {
    handleTitlePointerDown
  } = useWindowDrag({
    position: {
      x: win.x,
      y: win.y
    },
    onPositionChange: handlePositionChange,
    onDragStart: () => onFocus(win.id)
  });
  const handleMaximize = useCallback(() => {
    if (!maximized) {
      setPreMaxState({
        x: win.x,
        y: win.y,
        w: win.width,
        h: win.height
      });
      onPositionChange(win.id, 0, 0);
    } else {
      onSizeChange(win.id, preMaxState.x, preMaxState.y, preMaxState.w, preMaxState.h);
    }
    setMaximized((v) => !v);
  }, [maximized, win, preMaxState, onPositionChange, onSizeChange]);
  if (win.minimized) return null;
  const taskbarH = 30;
  const style = maximized ? {
    position: "fixed",
    left: 0,
    top: 0,
    width: "calc(100vw - 34px)",
    height: `calc(100vh - ${taskbarH}px)`,
    zIndex: win.zIndex
  } : {
    position: "fixed",
    left: win.x,
    top: win.y,
    width: win.width,
    height: win.height,
    zIndex: win.zIndex
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    ...style,
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 2px 8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.3)",
    border: "2px solid var(--xp-chrome-border-dark)",
    borderRadius: "6px 6px 0 0",
    overflow: "hidden",
    fontFamily: FONT$b,
    userSelect: "none"
  }, onPointerDown: () => onFocus(win.id), "data-cid": "6dfBUmzW", children: [
    !maximized && ["n", "s", "e", "w", "nw", "ne", "sw", "se"].map((dir) => /* @__PURE__ */ jsx(ResizeHandle, { dir, win, onSizeChange, onFocus }, dir)),
    /* @__PURE__ */ jsxs("div", { onPointerDown: handleTitlePointerDown, style: {
      background: "linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 45%, #b8b8b8 55%, #c0c0c0 100%)",
      padding: "3px 4px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      cursor: "move",
      flexShrink: 0,
      minHeight: "28px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)"
    }, children: [
      /* @__PURE__ */ jsx("img", { src: win.icon, alt: win.title, style: {
        width: "16px",
        height: "16px",
        objectFit: "contain",
        flexShrink: 0
      } }),
      /* @__PURE__ */ jsx("span", { style: {
        flex: 1,
        color: "#000",
        fontSize: "12px",
        fontWeight: "bold",
        textShadow: "1px 1px 1px rgba(255,255,255,0.4)",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
      }, children: win.title }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: "2px",
        flexShrink: 0
      }, "data-window-btn": true, children: [
        /* @__PURE__ */ jsx(WinBtn, { label: "_", title: "Minimize", color: "#c8c8c8", textColor: "#000", onClick: () => onMinimize(win.id) }),
        /* @__PURE__ */ jsx(WinBtn, { label: maximized ? "❐" : "□", title: "Maximize", color: "#c8c8c8", textColor: "#000", onClick: handleMaximize }),
        /* @__PURE__ */ jsx(WinBtn, { label: "✕", title: "Close", color: "#d93b3b", hoverColor: "#f05050", onClick: () => onClose(win.id) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      flex: 1,
      background: "#fff",
      overflow: "auto",
      position: "relative"
    }, children })
  ] });
}
function WinBtn({
  label,
  title,
  color,
  hoverColor,
  textColor,
  onClick
}) {
  const [hovered, setHovered] = React.useState(false);
  const idleTop = textColor === "#000" ? "#f4f4f4" : "#ff9a9a";
  return /* @__PURE__ */ jsx("button", { "data-window-btn": true, title, onClick: (e) => {
    e.stopPropagation();
    onClick();
  }, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    width: "21px",
    height: "21px",
    background: hovered ? `linear-gradient(180deg, ${hoverColor ?? color} 0%, ${color} 100%)` : `linear-gradient(180deg, ${idleTop} 0%, ${color} 100%)`,
    border: "1px solid var(--xp-chrome-border)",
    borderRadius: "3px",
    color: textColor ?? "#fff",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    fontFamily: FONT$b,
    flexShrink: 0,
    padding: 0
  }, "data-cid": "Zj4Q4mDb", children: label });
}
const ICON_SIZE = 80;
const ICON_GAP = 4;
const TASKBAR_H$1 = 30;
const DESKTOP_PAD = 8;
function computePositions(defs, viewportHeight, existingIcons) {
  const effectiveHeight = viewportHeight ?? 600;
  const gridHeight = effectiveHeight - TASKBAR_H$1 - DESKTOP_PAD * 2;
  const maxRows = Math.max(1, Math.floor(gridHeight / (ICON_SIZE + ICON_GAP)));
  let autoIndex = 0;
  return defs.map((def) => {
    const existing = existingIcons?.find((ic) => ic.id === def.id);
    if (existing?.isCustomPos) {
      return { ...existing };
    }
    const col = Math.floor(autoIndex / maxRows);
    const row = autoIndex % maxRows;
    autoIndex++;
    return {
      ...def,
      x: DESKTOP_PAD + col * (ICON_SIZE + ICON_GAP),
      y: DESKTOP_PAD + row * (ICON_SIZE + ICON_GAP),
      isCustomPos: false
    };
  });
}
function clampPos(x, y, vw = window.innerWidth, vh = window.innerHeight) {
  const maxX = vw - ICON_SIZE - DESKTOP_PAD;
  const maxY = vh - TASKBAR_H$1 - ICON_SIZE - DESKTOP_PAD;
  return {
    x: Math.max(DESKTOP_PAD, Math.min(maxX, x)),
    y: Math.max(DESKTOP_PAD, Math.min(maxY, y))
  };
}
function useDesktopIcons(defs) {
  const [icons, setIcons] = useState(() => computePositions(defs));
  const [selectedId, setSelectedId] = useState(null);
  const dragRef = useRef(null);
  useEffect(() => {
    setIcons((prev) => computePositions(defs, window.innerHeight, prev));
  }, [defs]);
  const startDrag = useCallback((e, iconId) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(iconId);
    const icon = icons.find((ic) => ic.id === iconId);
    if (!icon) return;
    dragRef.current = {
      id: iconId,
      ox: e.clientX - icon.x,
      oy: e.clientY - icon.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    const onMove = (ev) => {
      if (!dragRef.current) return;
      const raw = { x: ev.clientX - dragRef.current.ox, y: ev.clientY - dragRef.current.oy };
      const clamped = clampPos(raw.x, raw.y);
      setIcons(
        (prev) => prev.map(
          (ic) => ic.id === dragRef.current?.id ? { ...ic, ...clamped } : ic
        )
      );
    };
    const onUp = () => {
      if (dragRef.current) {
        const movedId = dragRef.current.id;
        setIcons(
          (prev) => prev.map((ic) => ic.id === movedId ? { ...ic, isCustomPos: true } : ic)
        );
        dragRef.current = null;
      }
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, [icons]);
  const deselectAll = useCallback(() => {
    setSelectedId(null);
  }, []);
  const selectIcon = useCallback((id) => {
    setSelectedId(id);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setIcons((prev) => {
        const reflowed = computePositions(defs, vh, prev);
        return reflowed.map((ic) => {
          if (!ic.isCustomPos) return ic;
          const clamped = clampPos(ic.x, ic.y, vw, vh);
          if (clamped.x === ic.x && clamped.y === ic.y) return ic;
          return { ...ic, ...clamped };
        });
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [defs]);
  return { icons, selectedId, startDrag, deselectAll, selectIcon };
}
function RightSidebar({
  pets,
  activePetIds,
  onToggle
}) {
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    right: 0,
    top: 0,
    bottom: 30,
    // above taskbar
    width: 34,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    paddingTop: 6,
    paddingBottom: 6,
    background: "linear-gradient(90deg, var(--xp-gradient))",
    borderLeft: "1px solid rgb(136, 136, 136)",
    boxShadow: "#f0f0f0 1px 0 1px inset",
    zIndex: 9e3,
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "none"
  }, "data-cid": "_OMP6MQB", children: pets.map((pet) => /* @__PURE__ */ jsx(PetButton, { pet, active: activePetIds.has(pet.id), onToggle }, pet.id)) });
}
function PetButton({
  pet,
  active,
  onToggle
}) {
  const [hovered, setHovered] = useState(false);
  const isImage = pet.iconSrc.startsWith("http") || pet.iconSrc.startsWith("/");
  const getBtnStyle = () => {
    if (active) {
      return {
        background: "linear-gradient(135deg, #c0c0c0, #d4d4d4)",
        boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.35), inset -1px -1px 1px rgba(255,255,255,0.6)",
        border: "1px solid #a0a0a0"
      };
    }
    if (hovered) {
      return {
        background: "linear-gradient(135deg, #f8f8f8, #e8e8e8)",
        boxShadow: "inset -1px -1px 1px rgba(0,0,0,0.2), inset 1px 1px 1px rgba(255,255,255,0.9)",
        border: "1px solid #b0b0b0"
      };
    }
    return {
      background: "transparent",
      boxShadow: "none",
      border: "1px solid transparent"
    };
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    flexShrink: 0
  }, "data-cid": "2XmcuX5O", children: [
    /* @__PURE__ */ jsx("button", { title: pet.label, onClick: (e) => {
      e.stopPropagation();
      onToggle(pet.id);
    }, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
      width: 28,
      height: 28,
      borderRadius: 3,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      overflow: "hidden",
      transition: "background 0.1s ease, box-shadow 0.1s ease",
      // Spread the base button styles (background, boxShadow, border)
      ...getBtnStyle()
    }, children: isImage ? /* @__PURE__ */ jsx("img", { src: pet.iconSrc, alt: pet.label, draggable: false, style: {
      width: 20,
      height: 20,
      objectFit: "contain",
      pointerEvents: "none",
      imageRendering: "pixelated",
      // Slightly muted when active (depressed) to reinforce pressed feel
      opacity: active ? 0.88 : 1
    } }) : /* @__PURE__ */ jsx("span", { style: {
      fontSize: 16,
      lineHeight: 1,
      pointerEvents: "none"
    }, children: pet.iconSrc }) }),
    hovered && /* @__PURE__ */ jsxs("div", { style: {
      position: "absolute",
      right: 32,
      top: "50%",
      transform: "translateY(-50%)",
      // XP-style tooltip: pale yellow with a dark border
      background: "#ffffe1",
      border: "1px solid #767676",
      borderRadius: 2,
      padding: "2px 7px",
      whiteSpace: "nowrap",
      color: "#000000",
      fontSize: 11,
      fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
      fontWeight: "normal",
      boxShadow: "1px 1px 3px rgba(0,0,0,0.25)",
      pointerEvents: "none",
      zIndex: 9100
    }, children: [
      pet.label,
      /* @__PURE__ */ jsx("span", { style: {
        position: "absolute",
        right: -5,
        top: "50%",
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "4px solid transparent",
        borderBottom: "4px solid transparent",
        borderLeft: "5px solid #767676"
      } }),
      /* @__PURE__ */ jsx("span", { style: {
        position: "absolute",
        right: -3,
        top: "50%",
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "3px solid transparent",
        borderBottom: "3px solid transparent",
        borderLeft: "4px solid #ffffe1"
      } })
    ] }),
    active && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%, #7ef, #18bbff)",
      border: "1px solid rgba(0,100,200,0.6)",
      boxShadow: "0 0 4px rgba(24,187,255,0.8)"
    } })
  ] });
}
const TASKBAR_H = 30;
function isImageUrl(src) {
  return src.startsWith("http") || src.startsWith("/");
}
function DesktopPet({
  pet,
  onDismiss
}) {
  const [pos, setPos] = useState({
    x: window.innerWidth - 160,
    y: 80 + Math.random() * 200
  });
  const dragRef = useRef(null);
  const petSize = pet.size ?? 80;
  const handlePointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      ox: e.clientX - pos.x,
      oy: e.clientY - pos.y
    };
  }, [pos]);
  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const rawX = e.clientX - dragRef.current.ox;
    const rawY = e.clientY - dragRef.current.oy;
    setPos({
      x: Math.max(0, Math.min(window.innerWidth - petSize - 8, rawX)),
      y: Math.max(0, Math.min(window.innerHeight - TASKBAR_H - petSize - 8, rawY))
    });
  }, [petSize]);
  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);
  const petIsImage = isImageUrl(pet.petSrc);
  return /* @__PURE__ */ jsxs("div", { onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, style: {
    position: "fixed",
    left: pos.x,
    top: pos.y,
    zIndex: 9999,
    cursor: dragRef.current ? "grabbing" : "grab",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px"
  }, "data-cid": "yRejqS3P", children: [
    /* @__PURE__ */ jsx("button", { onClick: (e) => {
      e.stopPropagation();
      onDismiss(pet.id);
    }, onPointerDown: (e) => e.stopPropagation(), style: {
      position: "absolute",
      top: -8,
      right: -8,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "linear-gradient(180deg, #f87171 0%, #dc2626 100%)",
      border: "1px solid #991b1b",
      color: "#fff",
      fontSize: "9px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      padding: 0,
      zIndex: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.4)"
    }, children: "×" }),
    petIsImage ? /* @__PURE__ */ jsx("img", { src: pet.petSrc, alt: pet.label, draggable: false, style: {
      width: petSize,
      height: petSize,
      objectFit: "contain",
      pointerEvents: "none",
      // Don't pixelate GIFs — only use pixelated for pixel-art icons
      imageRendering: "auto",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
    } }) : /* @__PURE__ */ jsx("div", { style: {
      fontSize: petSize * 0.7,
      lineHeight: 1,
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
      pointerEvents: "none"
    }, children: pet.petSrc }),
    /* @__PURE__ */ jsx("span", { style: {
      color: "#fff",
      fontSize: "10px",
      textShadow: "1px 1px 2px rgba(0,0,0,0.9)",
      fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
      background: "rgba(0,0,60,0.55)",
      padding: "1px 4px",
      borderRadius: 2,
      whiteSpace: "nowrap",
      pointerEvents: "none"
    }, children: pet.label })
  ] });
}
const WALLPAPER_URL = "/assets/wallpapers/wallpaper.jpg";
const WINDOWS_LOGO_URL = "https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico";
const SYSTEM_TRAY_ICONS = [
  "https://static.step1.dev/g9nbov/assets/f41de3abce9a.png",
  "https://static.step1.dev/g9nbov/assets/cff960cc7c15.png",
  "https://static.step1.dev/g9nbov/assets/a52bbbc23e20.png",
  "/assets/icons/tray/icon1.png",
  "/assets/icons/tray/icon2.png"
];
function useSiteSettings() {
  const { data } = useQuery({
    ...trpc.site.getSettings.queryOptions(),
    staleTime: 0,
    refetchOnWindowFocus: true
  });
  console.log("[useSiteSettings] API Data:", data);
  const trayIconsRaw = data?.system_tray_icons;
  const trayIcons = trayIconsRaw ? JSON.parse(trayIconsRaw) : SYSTEM_TRAY_ICONS;
  return {
    wallpaperUrl: data?.wallpaper_url ?? WALLPAPER_URL,
    logoUrl: data?.windows_logo_url ?? WINDOWS_LOGO_URL,
    systemTrayIcons: trayIcons
  };
}
const PET_DEFS = [
  {
    id: "pet_1",
    label: " ",
    iconSrc: "/assets/pets/avatars/1.png",
    petSrc: "/assets/pets/sprites/20.png",
    size: 140
  },
  {
    id: "pet_2",
    label: " ",
    iconSrc: "/assets/pets/avatars/5.png",
    petSrc: "/assets/pets/sprites/21.png",
    size: 120
  },
  {
    id: "pet_3",
    label: " ",
    iconSrc: "/assets/pets/avatars/3.png",
    petSrc: "/assets/pets/sprites/1.gif",
    size: 150
  },
  {
    id: "pet_4",
    label: " ",
    iconSrc: "/assets/pets/avatars/4.png",
    petSrc: "/assets/pets/sprites/2.gif",
    size: 200
  },
  {
    id: "pet_5",
    label: " ",
    iconSrc: "/assets/pets/avatars/6.png",
    petSrc: "/assets/pets/sprites/3.gif",
    size: 220
  },
  {
    id: "pet_6",
    label: " ",
    iconSrc: "/assets/pets/avatars/7.png",
    petSrc: "/assets/pets/sprites/4.gif",
    size: 260
  },
  {
    id: "pet_7",
    label: " ",
    iconSrc: "/assets/pets/avatars/8.png",
    petSrc: "/assets/pets/sprites/5.png",
    size: 150
  },
  {
    id: "pet_8",
    label: " ",
    iconSrc: "/assets/pets/avatars/9.png",
    petSrc: "/assets/pets/sprites/6.gif",
    size: 220
  },
  {
    id: "pet_9",
    label: " ",
    iconSrc: "/assets/pets/avatars/10.png",
    petSrc: "/assets/pets/sprites/7.gif",
    size: 150
  },
  {
    id: "pet_10",
    label: " ",
    iconSrc: "/assets/pets/avatars/11.png",
    petSrc: "/assets/pets/sprites/8.gif",
    size: 200
  },
  {
    id: "pet_11",
    label: " ",
    iconSrc: "/assets/pets/avatars/12.png",
    petSrc: "/assets/pets/sprites/9.gif",
    size: 250
  },
  {
    id: "pet_12",
    label: " ",
    iconSrc: "/assets/pets/avatars/13.png",
    petSrc: "/assets/pets/sprites/10.png",
    size: 120
  },
  {
    id: "pet_13",
    label: " ",
    iconSrc: "/assets/pets/avatars/14.png",
    petSrc: "/assets/pets/sprites/11.png",
    size: 180
  },
  {
    id: "pet_14",
    label: " ",
    iconSrc: "/assets/pets/avatars/15.png",
    petSrc: "/assets/pets/sprites/12.gif",
    size: 180
  },
  {
    id: "pet_15",
    label: " ",
    iconSrc: "/assets/pets/avatars/16.png",
    petSrc: "/assets/pets/sprites/13.gif",
    size: 190
  },
  {
    id: "pet_16",
    label: " ",
    iconSrc: "/assets/pets/avatars/17.png",
    petSrc: "/assets/pets/sprites/14.gif",
    size: 230
  },
  {
    id: "pet_17",
    label: " ",
    iconSrc: "/assets/pets/avatars/18.png",
    petSrc: "/assets/pets/sprites/15.png",
    size: 200
  },
  {
    id: "pet_18",
    label: " ",
    iconSrc: "/assets/pets/avatars/19.png",
    petSrc: "/assets/pets/sprites/16.png",
    size: 200
  },
  {
    id: "pet_19",
    label: " ",
    iconSrc: "/assets/pets/avatars/20.png",
    petSrc: "/assets/pets/sprites/17.gif",
    size: 210
  },
  {
    id: "pet_20",
    label: " ",
    iconSrc: "/assets/pets/avatars/21.png",
    petSrc: "/assets/pets/sprites/18.png",
    size: 220
  },
  {
    id: "pet_21",
    label: " ",
    iconSrc: "/assets/pets/avatars/22.png",
    petSrc: "/assets/pets/sprites/19.png",
    size: 210
  },
  {
    id: "pet_22",
    label: " ",
    iconSrc: "/assets/pets/avatars/23.png",
    petSrc: "/assets/pets/sprites/22.png",
    size: 165
  },
  {
    id: "pet_23",
    label: " ",
    iconSrc: "/assets/pets/avatars/24.png",
    petSrc: "/assets/pets/sprites/23.png",
    size: 150
  },
  {
    id: "pet_24",
    label: " ",
    iconSrc: "/assets/pets/avatars/25.png",
    petSrc: "/assets/pets/sprites/24.png",
    size: 120
  },
  {
    id: "pet_25",
    label: " ",
    iconSrc: "/assets/pets/avatars/26.png",
    petSrc: "/assets/pets/sprites/25.png",
    size: 200
  },
  {
    id: "pet_26",
    label: " ",
    iconSrc: "/assets/pets/avatars/27.png",
    petSrc: "/assets/pets/sprites/26.png",
    size: 180
  },
  {
    id: "pet_27",
    label: " ",
    iconSrc: "/assets/pets/avatars/28.png",
    petSrc: "/assets/pets/sprites/28.gif",
    size: 250
  },
  {
    id: "pet_28",
    label: " ",
    iconSrc: "/assets/pets/avatars/2.png",
    petSrc: "/assets/pets/sprites/27.png",
    size: 180
  }
  // ──────────────────────────────────────────────────────────────────
  // ADD NEW PETS BELOW THIS LINE
  // Copy the template above and fill in your own id, label, and image paths.
  // ──────────────────────────────────────────────────────────────────
];
const FONT$a = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function getItemsAt(path, tree) {
  if (path.length === 0) return tree;
  const [head, ...rest] = path;
  const folder = tree.find((item) => item.name === head && item.type === "folder");
  if (!folder || !folder.children) return [];
  return getItemsAt(rest, folder.children);
}
function ExplorerToolbar$4({
  address,
  onBack,
  canGoBack
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$a,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "6ZLlSW6a", children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      gap: "2px",
      padding: "2px 4px",
      borderBottom: "1px solid #aca899"
    }, children: ["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
      background: "none",
      border: "none",
      padding: "2px 6px",
      cursor: "pointer",
      fontFamily: FONT$a,
      fontSize: "12px"
    }, children: m }, m)) }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "3px 6px"
    }, children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, disabled: !canGoBack, style: {
        background: canGoBack ? "#d4d0c8" : "#e8e8e4",
        border: "1px solid #aca899",
        borderRadius: "2px",
        padding: "1px 8px",
        cursor: canGoBack ? "pointer" : "default",
        fontFamily: FONT$a,
        fontSize: "11px",
        color: canGoBack ? "#000" : "#aaa"
      }, children: "← Back" }),
      /* @__PURE__ */ jsx("span", { style: {
        color: "#555",
        fontSize: "11px"
      }, children: "Address" }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #999",
        padding: "1px 6px",
        fontSize: "12px",
        borderRadius: "2px"
      }, children: address })
    ] })
  ] });
}
function VideoThumb({
  src
}) {
  return /* @__PURE__ */ jsx("video", { src, muted: true, preload: "metadata", style: {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: 2,
    display: "block"
  }, onLoadedMetadata: (e) => {
    e.currentTarget.currentTime = 1;
  }, "data-cid": "K5chiRZb" });
}
function FileTile({
  label,
  onClick,
  imageSrc,
  videoSrc,
  iconSrc
}) {
  const [hov, setHov] = useState(false);
  let preview;
  if (imageSrc) {
    preview = /* @__PURE__ */ jsx("img", { src: imageSrc, alt: label, style: {
      width: 48,
      height: 48,
      objectFit: "cover",
      borderRadius: 2,
      border: "1px solid #ccc"
    } });
  } else if (videoSrc) {
    preview = /* @__PURE__ */ jsx(VideoThumb, { src: videoSrc });
  } else {
    preview = /* @__PURE__ */ jsx("img", { src: iconSrc ?? DEFAULT_FILE_ICON, alt: label, style: {
      width: 48,
      height: 48,
      objectFit: "contain"
    } });
  }
  return /* @__PURE__ */ jsxs("div", { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), onClick, style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    width: "80px",
    cursor: onClick ? "pointer" : "default",
    background: hov ? "#5a5a5a" : "transparent",
    borderRadius: "4px",
    padding: "8px 4px"
  }, "data-cid": "UBtFweLv", children: [
    preview,
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "11px",
      fontFamily: FONT$a,
      color: hov ? "#fff" : "#000",
      textAlign: "center",
      wordBreak: "break-word"
    }, children: label })
  ] });
}
function MyComputerApp() {
  const [currentPath, setCurrentPath] = useState(() => consumePendingInitialPath());
  useEffect(() => {
    const handler = (e) => {
      setCurrentPath(e.detail);
    };
    window.addEventListener("xp-navigate-mycomputer", handler);
    return () => window.removeEventListener("xp-navigate-mycomputer", handler);
  }, []);
  const items = getItemsAt(currentPath, FILE_SYSTEM);
  const address = currentPath.length === 0 ? "My Computer" : "My Computer > " + currentPath.join(" > ");
  const handleFileClick = (item) => {
    const fileType = inferFileType(item.name);
    const url = getPublicUrl([...currentPath, item.name]);
    if (fileType === "image") {
      setPendingViewFile({
        type: "image",
        url,
        title: item.name
      });
      window.dispatchEvent(new CustomEvent("xp-open-window", {
        detail: "imageViewer"
      }));
    } else if (fileType === "video") {
      setPendingViewFile({
        type: "video",
        url,
        title: item.name
      });
      window.dispatchEvent(new CustomEvent("xp-open-window", {
        detail: "video"
      }));
    } else if (fileType === "audio") {
      setPendingViewFile({
        type: "audio",
        url,
        title: item.name
      });
      window.dispatchEvent(new CustomEvent("xp-open-window", {
        detail: "webamp"
      }));
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  }, "data-cid": "3jEx_lDy", children: [
    /* @__PURE__ */ jsx(ExplorerToolbar$4, { address, onBack: () => setCurrentPath((p) => p.slice(0, -1)), canGoBack: currentPath.length > 0 }),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      padding: "16px",
      display: "flex",
      flexWrap: "wrap",
      alignContent: "flex-start",
      gap: "20px",
      background: "#fff",
      overflowY: "auto"
    }, children: [
      items.map((item) => {
        if (item.type === "folder") {
          return /* @__PURE__ */ jsx(FileTile, { label: item.name, iconSrc: item.icon ?? "/assets/icons/Games.png", onClick: () => setCurrentPath((p) => [...p, item.name]), "data-cid": "NLAo9Wgj" }, item.name);
        }
        const fileType = inferFileType(item.name);
        const url = getPublicUrl([...currentPath, item.name]);
        return /* @__PURE__ */ jsx(FileTile, { label: item.name, imageSrc: fileType === "image" ? url : void 0, videoSrc: fileType === "video" ? url : void 0, iconSrc: fileType === "audio" ? "/assets/icons/Media.png" : item.icon ?? DEFAULT_FILE_ICON, onClick: () => handleFileClick(item), "data-cid": "cgyN1ZAs" }, item.name);
      }),
      items.length === 0 && /* @__PURE__ */ jsx("span", { style: {
        color: "#888",
        fontSize: "12px",
        fontFamily: FONT$a
      }, children: "This folder is empty." })
    ] })
  ] });
}
const GAMES_LIST = [
  // ── 示范游戏 1：扫雷（在线，itch.io 开源版）──────────────────────────────
  /*  {
      id: 'minesweeper',
      title: 'Minesweeper',
      icon: '💣',
      description: '经典扫雷，左键揭格，右键插旗',
      // itch.io 上的开源扫雷，允许 iframe 嵌入
      url: 'https://kayernyc.itch.io/minesweeper',
    },
    // ── 示范游戏 2：2048（在线）──────────────────────────────────────────────
    {
      id: '2048',
      title: '2048',
      icon: '🔢',
      description: '滑动方块，合并数字到 2048',
      url: 'https://play2048.co/',
    },
    // ── 示范游戏 3：贪吃蛇（在线）───────────────────────────────────────────
    {
      id: 'snake',
      title: 'Snake',
      icon: '🐍',
      description: '经典贪吃蛇，用方向键控制',
      url: 'https://www.google.com/fbx?fbx=snake_arcade',
    },
    */
  // ── 示范游戏 4：Tetris（在线，GitHub Pages）──────────────────────────────
  {
    id: "tetris",
    title: "Tetris",
    icon: "🟦",
    description: "开源俄罗斯方块",
    url: "https://chvin.github.io/react-tetris/"
  },
  // ── 示范游戏 5：Pacman（在线）────────────────────────────────────────────
  {
    id: "pacman",
    title: "Pac-Man",
    icon: "👾",
    description: "经典吃豆人，用方向键操控",
    url: "https://freepacman.org/"
  },
  // ── 示范游戏 6：Minecraft（本地）─────────────────────────────────────────────
  {
    id: "minecraft",
    title: "Minecraft",
    icon: "🟩",
    // Emoji fallback
    iconSrc: "/assets/icons/MC.png",
    // The correct path to use as iconSrc!
    description: "MC",
    url: "/games/minecraft/index.html"
  }
  // ──────────────────────────────────────────────────────────────────────────
  // 💡 在此处继续添加游戏，参考文件顶部的使用步骤说明
  // ──────────────────────────────────────────────────────────────────────────
];
const FONT$9 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function ExplorerToolbar$3({
  address,
  canGoBack,
  onBack
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$9,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "wJIHg8iW", children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      gap: "2px",
      padding: "2px 4px",
      borderBottom: "1px solid #aca899"
    }, children: ["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
      background: "none",
      border: "none",
      padding: "2px 6px",
      cursor: "pointer",
      fontFamily: FONT$9,
      fontSize: "12px"
    }, children: m }, m)) }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "3px 6px"
    }, children: [
      /* @__PURE__ */ jsx("button", { onClick: onBack, disabled: !canGoBack, title: "Back", style: {
        background: canGoBack ? "linear-gradient(to bottom, #f0f0f0, #d0d0d0)" : "#e8e8e0",
        border: canGoBack ? "1px solid #888" : "1px solid #bbb",
        borderRadius: "3px",
        padding: "1px 8px",
        cursor: canGoBack ? "pointer" : "default",
        fontFamily: FONT$9,
        fontSize: "12px",
        color: canGoBack ? "#000" : "#aaa",
        display: "flex",
        alignItems: "center",
        gap: "3px",
        flexShrink: 0
      }, children: "◀ Back" }),
      /* @__PURE__ */ jsx("span", { style: {
        color: "#555",
        fontSize: "11px",
        flexShrink: 0
      }, children: "Address" }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #999",
        padding: "1px 6px",
        fontSize: "12px",
        borderRadius: "2px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }, children: address })
    ] })
  ] });
}
function FolderTile({
  game,
  onClick
}) {
  const [hov, setHov] = useState(false);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      title: game.description,
      onMouseEnter: () => setHov(true),
      onMouseLeave: () => setHov(false),
      onDoubleClick: () => onClick(game),
      onClick: () => onClick(game),
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        width: "80px",
        cursor: "pointer",
        background: hov ? "#5a5a5a" : "transparent",
        borderRadius: "4px",
        padding: "8px 4px",
        userSelect: "none"
      },
      "data-cid": "NWsQCKMF",
      children: [
        game.iconSrc ? /* @__PURE__ */ jsx("img", { src: game.iconSrc, alt: game.title, style: {
          width: "36px",
          height: "36px",
          objectFit: "contain",
          filter: hov ? "brightness(1.2)" : "none"
        } }) : /* @__PURE__ */ jsx("span", { style: {
          fontSize: "36px",
          lineHeight: 1,
          filter: hov ? "brightness(1.2)" : "none"
        }, children: game.icon }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: "11px",
          fontFamily: FONT$9,
          color: hov ? "#fff" : "#000",
          textAlign: "center",
          wordBreak: "break-word",
          lineHeight: 1.3
        }, children: game.title })
      ]
    }
  );
}
function GamesFolderApp() {
  const [playingGame, setPlayingGame] = useState(null);
  const handleLaunch = (game) => {
    setPlayingGame(game);
  };
  const handleBack = () => {
    setPlayingGame(null);
  };
  const address = playingGame ? `C:\\Games\\${playingGame.title}.exe` : "C:\\Games";
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    overflow: "hidden"
  }, "data-cid": "Dz2F4RCl", children: [
    /* @__PURE__ */ jsx(ExplorerToolbar$3, { address, canGoBack: playingGame !== null, onBack: handleBack }),
    playingGame === null ? (
      // ── 文件夹视图：游戏图标网格 ────────────────────────────────────────
      /* @__PURE__ */ jsxs("div", { style: {
        flex: 1,
        padding: "16px",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        gap: "12px",
        background: "#fff",
        overflowY: "auto"
      }, children: [
        GAMES_LIST.map((game) => /* @__PURE__ */ jsx(FolderTile, { game, onClick: handleLaunch }, game.id)),
        /* @__PURE__ */ jsx("div", { style: {
          width: "100%",
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: "1px solid #e0e0e0",
          fontSize: "10px",
          color: "#999",
          fontFamily: FONT$9
        } })
      ] })
    ) : (
      // ── 游戏视图：全屏 iframe 沙盒 ──────────────────────────────────────
      /* @__PURE__ */ jsxs("div", { style: {
        flex: 1,
        position: "relative",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a2e",
          color: "#888",
          fontFamily: FONT$9,
          fontSize: "13px",
          zIndex: 0
        }, children: [
          "⏳ Loading ",
          playingGame.title,
          "..."
        ] }),
        /* @__PURE__ */ jsx(
          "iframe",
          {
            src: playingGame.url,
            title: playingGame.title,
            allow: "fullscreen",
            sandbox: "allow-scripts allow-same-origin allow-forms allow-pointer-lock",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              zIndex: 1
            }
          },
          playingGame.id
        )
      ] })
    )
  ] });
}
const ABOUT_CONFIG = {
  // 头像图片路径。填写 public/assets/ 下的路径，如 "/assets/avatar.png"。
  // 留空字符串 "" 则显示默认 Emoji 占位符。
  avatarSrc: "/assets/avatarSrc.jpg",
  // 背景图片路径。填写 public/assets/wallpapers/ 下的路径。
  bgImageSrc: "/assets/wallpapers/bg2.jpg",
  // 背景图初始透明度（0.0 ~ 1.0）。0 = 完全透明，1 = 完全不透明。
  bgOpacity: 0.5,
  // 个人基础信息
  name: "NNNullptr",
  title: "简介一段",
  location: "null",
  // 中间滚动区 Markdown 内容。支持标准 Markdown 语法。
  markdownContent: `
## 标题

欢迎访问，随便写几句
---

##标题
示例

---

## 嗯

efefgbfgg

> "名言" — 名人
  `,
  // 技能标签数组。每个标签可以单独设置背景色和文字颜色。
  skills: [{
    name: "React",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "TypeScript",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "Tailwind CSS",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "Node.js",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "tRPC",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "Figma",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "CSS Animations",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }, {
    name: "WebGL",
    bgColor: "#f46fa43f",
    textColor: "#ffffff"
  }]
};
const MARKDOWN_STYLES = `
  .about-md h2 { font-size: 13px; font-weight: bold; color: #767676; margin: 14px 0 6px; border-bottom: 1px solid #c5d8f8; padding-bottom: 3px; }
  .about-md p  { font-size: 12px; color: #333; line-height: 1.75; margin: 0 0 8px; }
  .about-md ul { padding-left: 18px; margin: 0 0 8px; }
  .about-md li { font-size: 12px; color: #333; line-height: 1.8; list-style-type: disc; }
  .about-md strong { color: #767676; }
  .about-md hr { border: none; border-top: 1px solid #f0f0f0; margin: 10px 0; }
  .about-md blockquote { border-left: 3px solid #5a5a5a; margin: 8px 0; padding: 4px 10px; background: #fafafa; border-radius: 0 4px 4px 0; }
  .about-md blockquote p { font-size: 11px; color: #555; font-style: italic; margin: 0; }
`;
const FONT$8 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function AboutMeApp() {
  const [bgOpacity, setBgOpacity] = useState(ABOUT_CONFIG.bgOpacity);
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT$8,
    overflow: "hidden",
    background: "linear-gradient(160deg,#f0f0f0 0%,#fafafa 100%)"
  }, "data-cid": "fJe3OJtY", children: [
    /* @__PURE__ */ jsx("style", { children: MARKDOWN_STYLES }),
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      backgroundImage: `url(${ABOUT_CONFIG.bgImageSrc})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: bgOpacity,
      pointerEvents: "none",
      transition: "opacity 0.2s"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "absolute",
      top: "10px",
      right: "12px",
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "rgba(255,255,255,0.75)",
      borderRadius: "12px",
      padding: "3px 10px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "10px",
        color: "#555"
      }, children: "BG" }),
      /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 1, step: 0.05, value: bgOpacity, onChange: (e) => setBgOpacity(parseFloat(e.target.value)), style: {
        width: "72px",
        accentColor: "#5a5a5a",
        cursor: "pointer"
      } })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        flexShrink: 0,
        padding: "16px 20px 12px",
        borderBottom: "1px solid #c5d8f8",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(4px)"
      }, children: /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: "16px",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsx("img", { src: ABOUT_CONFIG.avatarSrc, alt: "avatar", style: {
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #5a5a5a",
          flexShrink: 0
        } }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "17px",
            fontWeight: "bold",
            color: "#767676"
          }, children: ABOUT_CONFIG.name }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "12px",
            color: "#5a5a5a",
            marginTop: "2px"
          }, children: ABOUT_CONFIG.title }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            color: "#666",
            marginTop: "5px"
          }, children: ABOUT_CONFIG.location })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        overflowY: "auto",
        padding: "14px 20px 10px"
      }, children: /* @__PURE__ */ jsx("div", { className: "about-md", children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: ABOUT_CONFIG.markdownContent }) }) }),
      /* @__PURE__ */ jsxs("div", { style: {
        flexShrink: 0,
        padding: "10px 20px 14px",
        borderTop: "1px solid #c5d8f8",
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(4px)"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: "11px",
          fontWeight: "bold",
          color: "#767676",
          marginBottom: "7px",
          letterSpacing: "0.5px"
        }, children: "🛠 SKILLS" }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          flexWrap: "wrap",
          gap: "5px"
        }, children: ABOUT_CONFIG.skills.map((skill) => /* @__PURE__ */ jsx("span", { style: {
          background: skill.bgColor,
          color: skill.textColor,
          borderRadius: "4px",
          padding: "3px 9px",
          fontSize: "11px",
          fontWeight: "bold",
          letterSpacing: "0.3px"
        }, children: skill.name }, skill.name)) })
      ] })
    ] })
  ] });
}
const CONTACT_CONFIG = [
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/NNNullptr",
    // 把 github.png 放到 public/assets/icons/social/github.png 后替换下方路径
    iconSrc: "/assets/icons/github.png",
    emoji: ""
  },
  {
    id: "twitter",
    name: "Twitter",
    url: "https://x.com/NNNullptr",
    // 把 twitter.png 放到 public/assets/icons/social/twitter.png 后替换下方路径
    iconSrc: "/assets/icons/twitter.png",
    emoji: ""
  }
  // ── 在这里添加更多平台 ──
  // {
  //   id:      'instagram',
  //   name:    'Instagram',
  //   url:     'https://instagram.com',
  //   iconSrc: '/assets/icons/social/instagram.png',
  //   emoji:   '📸',
  // },
];
const FONT$7 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function ExplorerToolbar$2({
  address
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$7,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "ZfR4PiAj", children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      gap: "2px",
      padding: "2px 4px",
      borderBottom: "1px solid #aca899"
    }, children: ["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
      background: "none",
      border: "none",
      padding: "2px 6px",
      cursor: "pointer",
      fontFamily: FONT$7,
      fontSize: "12px"
    }, children: m }, m)) }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "3px 6px"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        color: "#555",
        fontSize: "11px"
      }, children: "Address" }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #999",
        padding: "1px 6px",
        fontSize: "12px",
        borderRadius: "2px"
      }, children: address })
    ] })
  ] });
}
function ContactTile({
  name,
  url,
  iconSrc,
  emoji
}) {
  const [hov, setHov] = useState(false);
  return /* @__PURE__ */ jsxs("a", { href: url, target: "_blank", rel: "noopener noreferrer", onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    width: "80px",
    cursor: "pointer",
    background: hov ? "#5a5a5a" : "transparent",
    borderRadius: "4px",
    padding: "8px 4px",
    textDecoration: "none"
  }, "data-cid": "nDDgssQZ", children: [
    iconSrc ? /* @__PURE__ */ jsx("img", { src: iconSrc, alt: name, style: {
      width: "48px",
      height: "48px",
      objectFit: "contain"
    } }) : /* @__PURE__ */ jsx("div", { style: {
      width: "48px",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "32px"
    }, children: emoji }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "11px",
      fontFamily: FONT$7,
      color: hov ? "#fff" : "#000",
      textAlign: "center",
      wordBreak: "break-word"
    }, children: name })
  ] });
}
function ContactApp() {
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  }, "data-cid": "KSxwGaPb", children: [
    /* @__PURE__ */ jsx(ExplorerToolbar$2, { address: "Contact Me" }),
    /* @__PURE__ */ jsx("div", { style: {
      flex: 1,
      padding: "16px",
      display: "flex",
      flexWrap: "wrap",
      alignContent: "flex-start",
      gap: "20px",
      background: "#fff",
      overflowY: "auto"
    }, children: CONTACT_CONFIG.map((item) => /* @__PURE__ */ jsx(ContactTile, { name: item.name, url: item.url, iconSrc: item.iconSrc, emoji: item.emoji }, item.id)) })
  ] });
}
const SONG_LIST = [
  {
    coverSrc: "/assets/covers/cover1.jpg",
    // 替换为 '/assets/covers/song1.jpg'
    title: "Tatara",
    artist: "Hatsune Miku",
    audioSrc: "/assets/tracks/Tatara.mp3"
    // 替换为 '/assets/tracks/triple-baka.mp3'
  },
  {
    coverSrc: "/assets/covers/cover2.jpg",
    // 替换为 '/assets/covers/song2.jpg'
    title: "世界で一番おひめさま",
    artist: "Hatsune Miku",
    audioSrc: "/assets/tracks/Tatara.mp3"
    // 替换为 '/assets/tracks/world-is-mine.mp3'
  }
  // ── 在此继续添加歌曲 ──
  // {
  //   coverSrc:  '/assets/covers/my-song.jpg',
  //   title:     '歌曲名',
  //   artist:    '歌手名',
  //   audioSrc:  '/assets/tracks/my-song.mp3',
  // },
];
const WINAMP_CONFIG = {
  // 背景图设置（留空 '' 则不显示背景图片）
  bgImage: "/assets/wallpapers/bg3.jpg",
  // 例：'/assets/wallpapers/winamp-bg.jpg'
  bgOpacity: 0.3,
  // 背景图透明度 0.0（全透明）~ 1.0（不透明）
  // 配色方案
  bgColor: "#ffffffff",
  // 播放器整体背景色
  textColor: "#464646ff",
  // 主文字颜色（歌曲名）
  subTextColor: "#7a7678ff",
  // 副文字颜色（歌手名、时间）
  progressColor: "#ee9cc1ff",
  // 进度条填充色
  progressBg: "#f5ecf2ff",
  // 进度条轨道背景色
  btnBg: "#fafafa",
  // 按钮默认背景色
  btnBorder: "#fafafa",
  // 按钮边框色
  btnText: "#ee9cc1ff",
  // 按钮图标/文字色
  btnActiveBg: "#fafafa"
  // 播放按钮激活时的背景色
};
function formatTime$1(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
const DEFAULT_COVER_STYLE = {
  background: "linear-gradient(135deg, #2a2a5a 0%, #6644cc 50%, #aa44aa 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "36px"
};
function WinampApp() {
  const cfg = WINAMP_CONFIG;
  const [songs] = useState(() => {
    const base = SONG_LIST;
    const pending = consumePendingViewFile();
    if (pending?.type === "audio") {
      return [{
        coverSrc: "/assets/icons/Media.png",
        title: pending.title,
        artist: "Unknown",
        audioSrc: pending.url
      }, ...base];
    }
    return [...base];
  });
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragVal, setDragVal] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const song = songs[trackIdx] ?? {
    coverSrc: "",
    title: "No Track",
    artist: "---",
    audioSrc: ""
  };
  const progress = duration > 0 ? current / duration * 100 : 0;
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setCurrent(0);
    setDuration(0);
    if (playing && song.audioSrc) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [trackIdx]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && song.audioSrc) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, song.audioSrc]);
  const handleEnded = useCallback(() => {
    setTrackIdx((i) => (i + 1) % songs.length);
    setPlaying(true);
  }, [songs.length]);
  const prev = () => {
    setTrackIdx((i) => (i - 1 + songs.length) % songs.length);
    setCurrent(0);
  };
  const next = () => {
    setTrackIdx((i) => (i + 1) % songs.length);
    setCurrent(0);
  };
  const stop = () => {
    setPlaying(false);
    setCurrent(0);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  const calcRatio = (e) => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  };
  const onProgressPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setDragVal(calcRatio(e) * 100);
  };
  const onProgressPointerMove = (e) => {
    if (!dragging) return;
    setDragVal(calcRatio(e) * 100);
  };
  const onProgressPointerUp = (e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    const ratio = calcRatio(e);
    if (audioRef.current && isFinite(duration)) {
      audioRef.current.currentTime = ratio * duration;
    }
  };
  const displayProgress = dragging ? dragVal : progress;
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: cfg.bgColor,
    color: cfg.textColor,
    fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
    userSelect: "none",
    position: "relative",
    overflow: "hidden"
  }, "data-cid": "C2wO-ALg", children: [
    /* @__PURE__ */ jsx("audio", { ref: audioRef, src: song.audioSrc || void 0, onTimeUpdate: () => {
      if (!dragging && audioRef.current) setCurrent(audioRef.current.currentTime);
    }, onLoadedMetadata: () => {
      if (audioRef.current) setDuration(audioRef.current.duration);
    }, onEnded: handleEnded }),
    cfg.bgImage && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${cfg.bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: cfg.bgOpacity,
      pointerEvents: "none",
      zIndex: 0
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: "14px",
        padding: "14px 16px 10px",
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: "100px",
          height: "100px",
          flexShrink: 0,
          border: `2px solid ${cfg.btnBorder}`,
          borderRadius: "4px",
          overflow: "hidden",
          ...song.coverSrc ? {} : DEFAULT_COVER_STYLE
        }, children: song.coverSrc ? /* @__PURE__ */ jsx("img", { src: song.coverSrc, alt: song.title, style: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block"
        } }) : /* @__PURE__ */ jsx("span", { children: "🎵" }) }),
        /* @__PURE__ */ jsxs("div", { style: {
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "15px",
            fontWeight: "bold",
            color: cfg.textColor,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            letterSpacing: "0.5px"
          }, children: song.title }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "13px",
            color: cfg.subTextColor,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }, children: song.artist }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            gap: "6px",
            alignItems: "center",
            marginTop: "2px"
          }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: "12px",
              color: cfg.textColor,
              fontFamily: '"Courier New", monospace',
              letterSpacing: "1px"
            }, children: formatTime$1(current) }),
            /* @__PURE__ */ jsxs("span", { style: {
              fontSize: "11px",
              color: cfg.subTextColor
            }, children: [
              "/ ",
              formatTime$1(duration)
            ] }),
            /* @__PURE__ */ jsxs("span", { style: {
              marginLeft: "auto",
              fontSize: "10px",
              color: cfg.subTextColor,
              background: cfg.btnBg,
              border: `1px solid ${cfg.btnBorder}`,
              borderRadius: "3px",
              padding: "1px 6px"
            }, children: [
              trackIdx + 1,
              " / ",
              songs.length
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        padding: "0 16px 10px"
      }, children: /* @__PURE__ */ jsxs("div", { ref: progressRef, onPointerDown: onProgressPointerDown, onPointerMove: onProgressPointerMove, onPointerUp: onProgressPointerUp, style: {
        height: "10px",
        background: cfg.progressBg,
        borderRadius: "5px",
        cursor: "pointer",
        position: "relative",
        border: `1px solid ${cfg.btnBorder}`
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: `${displayProgress}%`,
          height: "100%",
          background: cfg.progressColor,
          borderRadius: "5px",
          transition: dragging ? "none" : "width 0.1s linear"
        } }),
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: `${displayProgress}%`,
          transform: "translate(-50%, -50%)",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: cfg.progressColor,
          border: `2px solid ${cfg.textColor}`,
          boxShadow: "0 0 4px rgba(0,0,0,0.5)"
        } })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px 14px",
        borderTop: `1px solid ${cfg.btnBorder}`,
        background: "transparent"
      }, children: [
        /* @__PURE__ */ jsx(CtrlBtn, { cfg, title: "上一首", onClick: prev, children: "⏮" }),
        /* @__PURE__ */ jsx(CtrlBtn, { cfg, title: "播放", active: playing && true, onClick: () => setPlaying(true), children: "▶" }),
        /* @__PURE__ */ jsx(CtrlBtn, { cfg, title: "暂停", active: !playing, onClick: () => setPlaying(false), children: "⏸" }),
        /* @__PURE__ */ jsx(CtrlBtn, { cfg, title: "停止", onClick: stop, children: "⏹" }),
        /* @__PURE__ */ jsx(CtrlBtn, { cfg, title: "下一首", onClick: next, children: "⏭" })
      ] })
    ] })
  ] });
}
function CtrlBtn({
  children,
  cfg,
  onClick,
  active = false,
  title
}) {
  const [hov, setHov] = useState(false);
  return /* @__PURE__ */ jsx("button", { title, onClick, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), style: {
    background: active ? cfg.btnActiveBg : hov ? cfg.btnActiveBg : cfg.btnBg,
    color: cfg.btnText,
    border: `1px solid ${cfg.btnBorder}`,
    borderRadius: "5px",
    padding: "7px 14px",
    cursor: "pointer",
    fontSize: "16px",
    minWidth: "42px",
    transition: "background 0.15s",
    boxShadow: active ? `0 0 8px ${cfg.btnActiveBg}88` : "none"
  }, "data-cid": "TdxGlqCE", children });
}
const FONT$6 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const BOT_REPLIES = ["lol, totally!", "omg really?? 😮", "brb, mom is calling", "that is so cool!!", "i was just thinking the same thing :)", "lmao xD", "k gtg, ttyl!! ✌️", "did u see that new movie?", "my asl is 16/f/usa lol", "...busy?"];
function nowStr() {
  const d = /* @__PURE__ */ new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m} ${d.getHours() >= 12 ? "PM" : "AM"}`;
}
function MsnApp() {
  const [messages, setMessages] = useState([{
    from: "them",
    text: "heyyy, whats up! :)",
    time: "3:41 PM"
  }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  const send = useCallback(() => {
    if (!input.trim()) return;
    setMessages((m) => [...m, {
      from: "me",
      text: input.trim(),
      time: nowStr()
    }]);
    setInput("");
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setMessages((m) => [...m, {
        from: "them",
        text: reply,
        time: nowStr()
      }]);
    }, 800 + Math.random() * 1200);
  }, [input]);
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    fontFamily: FONT$6
  }, "data-cid": "IzzHJu8a", children: [
    /* @__PURE__ */ jsxs("div", { style: {
      background: "linear-gradient(180deg,#0078d7,#004fa3)",
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "#ffce00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        flexShrink: 0
      }, children: "😊" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: {
          color: "#fff",
          fontSize: "13px",
          fontWeight: "bold"
        }, children: "XP_Buddy (Online)" }),
        /* @__PURE__ */ jsx("div", { style: {
          color: "#c8deff",
          fontSize: "11px"
        }, children: "💬 Chatting on MSN Messenger" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { ref: scrollRef, style: {
      flex: 1,
      overflowY: "auto",
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      background: "#f5f9ff"
    }, children: messages.map((msg, i) => /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: msg.from === "me" ? "flex-end" : "flex-start"
    }, children: [
      /* @__PURE__ */ jsxs("span", { style: {
        fontSize: "10px",
        color: "#999",
        marginBottom: "2px"
      }, children: [
        msg.from === "me" ? "Me" : "XP_Buddy",
        " • ",
        msg.time
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        background: msg.from === "me" ? "#5a5a5a" : "#fff",
        color: msg.from === "me" ? "#fff" : "#000",
        border: msg.from === "me" ? "none" : "1px solid #d0d8e8",
        borderRadius: "8px",
        padding: "6px 10px",
        fontSize: "12px",
        maxWidth: "75%",
        wordBreak: "break-word"
      }, children: msg.text })
    ] }, i)) }),
    /* @__PURE__ */ jsx("div", { style: {
      background: "#ece9d8",
      borderTop: "1px solid #ccc",
      padding: "4px 8px",
      display: "flex",
      gap: "6px"
    }, children: ["😊", "😂", "😎", "❤️", "👋"].map((e) => /* @__PURE__ */ jsx("button", { onClick: () => setInput((v) => v + e), style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      padding: "2px"
    }, children: e }, e)) }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      borderTop: "2px solid #5a5a5a",
      background: "#fff"
    }, children: [
      /* @__PURE__ */ jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && send(), placeholder: "Type a message...", style: {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "8px 12px",
        fontFamily: FONT$6,
        fontSize: "12px"
      } }),
      /* @__PURE__ */ jsx("button", { onClick: send, style: {
        background: "#5a5a5a",
        color: "#fff",
        border: "none",
        padding: "0 16px",
        cursor: "pointer",
        fontFamily: FONT$6,
        fontSize: "12px",
        fontWeight: "bold"
      }, children: "Send" })
    ] })
  ] });
}
function PaintApp() {
  return /* @__PURE__ */ jsx("iframe", { src: "/assets/jspaint-master/index.html", style: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block"
  }, title: "Paint", "data-cid": "Z6Cq2rcN" });
}
const readmeContent = "# 🖥️ MoeKernel_Desktop — Windows XP 风格个人桌面系统\n\n> 一个以 Windows XP / Y2K 梦幻核美学为主题的交互式个人桌面系统。访客将像操作一台复古 PC 一样浏览作品与信息。\n\n---\n\n## 📸 项目简介\n\n**MoeKernel_Desktop** 是一个运行在浏览器中的 Windows XP 风格个人桌面系统，模拟了一套完整的 XP 操作系统体验：\n\n- 可拖拽的桌面图标与墙纸背景（多列自动排布 + 自由拖拽 + 边界钳制）\n- 带 Luna 风格的开始菜单（程序 + 地点两列布局）\n- 系统托盘实时时钟\n- 可拖拽、可 8 方向调整大小的多窗口管理系统（最小化 / 最大化 / 关闭）\n- 右侧 XP Classic 风格宠物启动侧边栏（亮灰色渐变 + 内嵌浮雕按钮风格）\n- 可拖拽的桌面宠物（桌宠），浮于所有窗口之上（z-index 9999）\n- **配置驱动型应用**：所有应用顶部均有 `CONFIG` 对象，无需改组件逻辑即可定制内容\n- **博客系统**：XP 资源管理器风格博客文件夹 + Markdown 文章阅读器 + 分类过滤 Tab 栏\n\n---\n\n## 🛠️ 技术栈\n\n| 层级 | 技术 |\n|------|------|\n| 框架 | React 19、TanStack Start（SSR）、TanStack Router |\n| 样式 | Tailwind CSS v4、CSS Variables（OKLCH 色彩空间）、Inline CSS（XP 主题） |\n| 组件库 | shadcn/ui（Radix UI 底层） |\n| Markdown | react-markdown + remark-gfm（博客、简历阅读器）|\n| 客户端数据 | TanStack React Query v5、tRPC v11 Options Proxy |\n| 服务端 | tRPC on H3、Deno Edge Function |\n| 构建工具 | Vite 7、Nitro、TypeScript 5.9 |\n| 表单验证 | React Hook Form + Zod v4 |\n| 数据序列化 | SuperJSON |\n\n---\n\n## 📁 项目目录结构\n\n```\n项目根目录/\n├── public/                         # 静态资源（可直接替换你的素材）\n│   ├── assets/\n│   │   ├── wallpapers/             # 桌面壁纸 (.webp / .jpg / .png)\n│   │   ├── icons/                  # 应用图标 (.png / .ico)\n│   │   │   └── tray/               # 系统托盘小图标 (16–20px)\n│   │   └── pets/                   # 桌宠素材\n│   │       ├── avatars/            # 侧栏按钮图标 (推荐 22px)\n│   │       └── sprites/            # 桌宠本体图像 (推荐 .gif 动图)\n│   └── home/styles/                # XP 主题 CSS 文件（勿随意修改）\n│\n├── src/\n│   ├── client/                     # 客户端代码\n│   │   ├── apps/                   # ★ 插件层 — 每个桌面应用一个独立文件夹\n│   │   │   ├── registry.ts         # 应用注册中心（OsApp 接口 + APP_REGISTRY）\n│   │   │   ├── my-computer/        # 我的电脑（驱动器网格）\n│   │   │   ├── games-folder/       # 游戏文件夹（可配置 H5 游戏启动器）\n│   │   │   ├── about-me/           # 关于我（配置驱动，含背景图层）\n│   │   │   ├── contact/            # 联系方式（XP 资源管理器风格）\n│   │   │   ├── winamp/             # Winamp 音乐播放器（HTML5 Audio 真实引擎）\n│   │   │   ├── msn/                # MSN Messenger（Bot 自动回复 + 表情包）\n│   │   │   ├── paint/              # MS Paint 画板（铅笔/橡皮/填充 + 调色板）\n│   │   │   ├── resume/             # 通用 Markdown 文档查看器（含背景图层）\n│   │   │   ├── video-player/       # 双引擎视频播放器（B站 iframe + 原生 mp4）\n│   │   │   ├── portfolio/          # 作品集文件夹（分类 Tab + 灯箱预览）\n│   │   │   └── blog/               # 博客系统\n│   │   │       ├── index.tsx       # 博客文件夹（XP 资源管理器 + 分类 Tab 过滤）\n│   │   │       ├── viewer.tsx      # 博客文章 Markdown 阅读器\n│   │   │       └── posts/          # 静态 .md 文章文件\n│   │   │\n│   │   ├── config/                 # ★ 个性化配置文件 — 改这里来定制内容\n│   │   │   ├── theme.config.ts     # 壁纸URL、Windows Logo、系统托盘图标\n│   │   │   ├── icons.config.ts     # 桌面快捷图标列表（DESKTOP_ICON_DEFS）\n│   │   │   ├── pets.config.ts      # 桌宠列表（PET_DEFS）\n│   │   │   └── blog.config.ts      # 博客文章列表（BLOG_POSTS）\n│   │   │\n│   │   ├── trpc/                   # tRPC 客户端配置（勿修改）\n│   │   └── views/                  # 页面级视图组件\n│   │       ├── home.tsx            # 🖥️ XP 桌面主组件（内核）\n│   │       ├── xp-window.tsx       # 可拖拽/可 8 方向缩放的 XP 窗口组件\n│   │       ├── start-menu.tsx      # 开始菜单（Luna 风格）\n│   │       ├── right-sidebar.tsx   # 右侧桌宠启动栏（XP Classic 亮灰风格）\n│   │       └── desktop-pet.tsx     # 桌宠组件（可拖拽，浮层 z-index 9999）\n│   │\n│   ├── hooks/                      # 自定义 React Hooks\n│   │   ├── use-desktop-icons.ts    # 桌面图标拖拽、选中、自动排布逻辑\n│   │   ├── use-window-drag.ts      # 窗口拖拽（指针事件捕获）\n│   │   └── use-mobile.ts           # 移动端检测（768px 断点）\n│   │\n│   ├── routes/                     # 文件路由（路径即URL）\n│   │   ├── __root.tsx              # 根布局（HTML Shell、全局CSS注入）\n│   │   ├── index.tsx               # 主路由 / → 渲染 HomePage\n│   │   └── api/trpc.$.ts           # tRPC HTTP 端点（catch-all）\n│   │\n│   └── server/                     # 服务端代码（tRPC procedures）\n│\n├── docs/                           # 项目文档（AI 记忆系统）\n├── package.json\n└── tsconfig.json\n```\n\n---\n\n## 🏗️ 核心架构设计\n\n### 微内核 + 插件层架构\n\n本项目采用**微内核 + 插件层**的架构模式，将桌面操作系统内核逻辑与各窗口应用彻底解耦：\n\n```\n┌─────────────────────────────────────────────────────────────────┐\n│                      内核层 (home.tsx)                           │\n│  窗口管理 · 图标拖拽 · 任务栏 · 开始菜单 · 桌宠系统              │\n│  + xp-open-window CustomEvent 监听器（博客窗口内开新窗口）        │\n└───────────────────────┬─────────────────────────────────────────┘\n                        │ 通过 APP_REGISTRY 查找\n┌───────────────────────▼─────────────────────────────────────────┐\n│                   注册中心 (registry.ts)                          │\n│   APP_REGISTRY: Record<id, OsApp>  ← 单一数据源                  │\n│   + 启动时自动注册 BLOG_POSTS 每篇文章为独立 OsApp                │\n└──┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬───────────┘\n   │    │    │    │    │    │    │    │    │    │    │\n  MC  Games  Me  Contact Winamp MSN Paint Resume Video Portfolio Blog\n  插件  插件  插件  插件   插件  插件  插件   插件   插件   插件   插件\n```\n\n### OsApp 接口规范\n\n每个桌面应用必须实现以下接口：\n\n```typescript\ninterface OsApp {\n  id: string;           // 唯一标识符，需与 icons.config.ts 中的 id 一致\n  title: string;        // 窗口标题栏 & 任务栏显示名\n  icon: string;         // 16–32px 标题栏图标 URL\n  defaultWidth: number; // 窗口默认宽度（像素）\n  defaultHeight: number;// 窗口默认高度（像素）\n  AppComponent: React.ComponentType; // 窗口内容组件\n}\n```\n\n### 配置驱动型应用\n\n所有应用均在文件顶部暴露配置对象，直接修改即可定制：\n\n| 应用 | 配置对象 | 可定制内容 |\n|------|---------|-----------|\n| About Me | `ABOUT_CONFIG` | 头像、背景图+透明度、个人信息、技能标签、Markdown 正文 |\n| Winamp | `WINAMP_CONFIG` + `SONG_LIST` | 主题配色、歌曲列表（标题/艺术家/音源/封面） |\n| Video Player | `VIDEO_CONFIG` + `VIDEO_LIST` | 主题配色、视频列表（B站BV号 或 mp4 URL） |\n| Portfolio | `PORTFOLIO_CONFIG` + `PORTFOLIO_ITEMS` | 侧栏颜色、背景图、作品条目 |\n| Contact | `CONTACT_CONFIG` | 联系方式链接（图标、标签、href、颜色） |\n| Games | `GAMES_LIST` | 游戏条目（标题、图标、URL，支持 /public/games/ 本地游戏） |\n| Blog | `BLOG_POSTS`（blog.config.ts）| 文章列表（id、标题、图标、分类、.md 文件导入） |\n| Resume/README | `DOC_CONFIG` | Markdown 文件、背景图+透明度 |\n\n---\n\n## 🖥️ WelcomeGuard 欢迎动画\n\n文件：`src/client/views/welcome-guard.tsx`\n\n首次进入时自动播放 Boot → Login 两阶段动画，同一会话内刷新不重复播放。\n\n**修改文字内容：** 文件顶部有完整索引注释，按注释搜索关键词即可定位：\n\n| 需要修改的内容 | 搜索关键词 |\n|--------------|-----------|\n| Boot 用户名大字 | `MoeKernel`（BootStage 内） |\n| Boot 红色 xp 后缀 | `>xp<`（BootStage 内 `<span>` 红色斜体） |\n| Boot 副标题 | `>Welcome<` |\n| Boot 持续时间 | `setTimeout(onDone, 3000)` 中的毫秒数 |\n| Login 左侧用户名 | `MoeKernel`（LoginStage 左栏） |\n| Login 左侧角色说明 | `>Software Developer<`（左栏） |\n| Login 左侧引导语 | `>To begin, click your user name<` |\n| Login 右侧头像图片 | `src=\"/assets/avatarSrc.jpg\"` |\n| Login 右侧头像卡用户名 | `NNNullptr`（LoginStage 右栏头像卡） |\n| Login 右侧头像卡角色 | `>Software Developer<`（右栏） |\n| 底部 Restart 按钮 | `>Restart<` |\n\n**调试命令（浏览器 console）：**\n```js\n// 重新播放欢迎流程\nsessionStorage.removeItem('xp:welcomed'); location.reload();\n\n// 跳过欢迎流程\nsessionStorage.setItem('xp:welcomed', '1'); location.reload();\n```\n\n---\n\n## ✏️ 如何添加新应用\n\n只需 3 步，完全不触碰内核代码：\n\n**第一步：** 创建应用组件\n```\nsrc/client/apps/your-app/index.tsx\n```\n```tsx\nexport function YourApp() {\n  return <div>你的应用内容</div>;\n}\n```\n\n**第二步：** 在注册中心登记（`src/client/apps/registry.ts`）\n```typescript\nimport { YourApp } from './your-app';\n\nexport const APP_REGISTRY = {\n  // ...现有应用\n  yourApp: {\n    id: 'yourApp',\n    title: '你的应用',\n    icon: '/assets/icons/your-icon.png',\n    defaultWidth: 500,\n    defaultHeight: 400,\n    AppComponent: YourApp,\n  },\n};\n```\n\n**第三步：** 添加桌面图标（`src/client/config/icons.config.ts`）\n```typescript\nexport const DESKTOP_ICON_DEFS = [\n  // ...现有图标\n  { id: 'yourApp', label: '你的应用', src: '/assets/icons/your-icon.png' },\n];\n```\n\n完成！应用将自动出现在桌面，双击图标即可打开。\n\n---\n\n## 📝 如何添加博客文章\n\n**第一步：** 在 `src/client/apps/blog/posts/` 创建 `.md` 文件\n\n**第二步：** 在 `src/client/config/blog.config.ts` 添加条目：\n```typescript\nimport rawMyPost from '../apps/blog/posts/my-post.md?raw';\n\nexport const BLOG_POSTS: BlogPost[] = [\n  // ...现有文章\n  {\n    id: 'blog-my-post',    // 必须以 'blog-' 开头\n    title: '我的新文章',\n    icon: '图标URL',\n    category: '技术',      // 分类标签（自动出现在 Tab 栏）\n    raw: rawMyPost,\n  },\n];\n```\n\n完成！文章自动出现在博客文件夹，并动态注册为独立阅读器窗口。\n\n---\n\n## 🎨 个性化定制\n\n### 替换壁纸\n```typescript\n// src/client/config/theme.config.ts\nexport const WALLPAPER_URL = '/assets/wallpapers/your-wallpaper.jpg';\n```\n\n### 添加/修改桌宠\n```typescript\n// src/client/config/pets.config.ts\nexport const PET_DEFS: PetDef[] = [\n  {\n    id: 'my-pet',\n    name: '我的宠物',\n    iconSrc: '/assets/pets/avatars/icon.png',  // 侧栏按钮图标\n    petSrc: '/assets/pets/sprites/sprite.gif', // 桌面宠物图像（支持 GIF）\n  },\n];\n```\n\n---\n\n## 🚀 本地开发\n\n```bash\n# 安装依赖\npnpm install\n\n# 启动开发服务器\npnpm dev\n\n# 类型检查\npnpm lint\n\n# 构建生产版本\npnpm build\n```\n\n---\n\n## 📂 静态资源目录\n\n将你自己的素材放入 `public/assets/` 对应子目录，然后在配置文件中引用路径即可：\n\n| 目录 | 用途 | 推荐格式 |\n|------|------|---------|\n| `public/assets/wallpapers/` | 桌面壁纸 | `.webp`、`.jpg` |\n| `public/assets/icons/` | 应用 & 快捷方式图标 | `.png`、`.ico` |\n| `public/assets/icons/tray/` | 系统托盘小图标 | `.png`（16–20px）|\n| `public/assets/pets/avatars/` | 桌宠侧栏按钮图标 | `.png`（22px）|\n| `public/assets/pets/sprites/` | 桌宠本体图像 | `.gif`（动图）|\n\n---\n\n## 🗂️ 路由映射\n\n| URL 路径 | 文件 | 说明 |\n|----------|------|------|\n| `/` | `routes/index.tsx` | XP 桌面主页面 |\n| `/api/trpc/*` | `routes/api/trpc.$.ts` | tRPC API 端点 |\n| `*` | `routes/__root.tsx` | 根布局（HTML Shell）|\n\n---\n\n## 📝 开发历史摘要\n\n| 版本 | 主要内容 |\n|------|---------|\n| V1 | 开始菜单、Luna 风格 Start 按钮、系统托盘实时时钟 |\n| V2 | 多窗口管理系统（可拖拽、最小化/最大化/关闭、任务栏按钮）|\n| V3 | 桌面图标自由拖拽、单击选中、双击打开、边界自动钳制 |\n| V4 | 修复图标重叠与小屏消失问题，多列自动排布算法 |\n| V5 | 右侧桌宠启动栏（Frutiger Aero 风格）、可拖拽桌宠 |\n| V6 | 窗口 8 方向调整大小、桌宠图标/图像分离（iconSrc + petSrc）|\n| V7 | 10 个窗口应用完整内容（Winamp、MSN、Paint、简历等）|\n| V8 | 新增视频播放器（Bilibili 嵌入）和作品集文件夹窗口 |\n| V9 | 配置文件架构重构，静态资源目录规范化 |\n| V10 | **微内核+插件层**架构重构，10 个独立应用模块 + 统一注册中心 |\n| V11 | 右侧边栏视觉重构 → XP Classic 亮灰渐变风格（取代 Frutiger Aero）|\n| V12 | Resume 重构为通用 Markdown 文档查看器，支持背景图层 + 透明度滑块 |\n| V13 | About Me 配置驱动重构（ABOUT_CONFIG）+ 固定技能页脚 + 背景图层 |\n| V14 | Contact 重构为 XP 资源管理器界面（含菜单栏 + 地址栏）|\n| V15 | Winamp 升级为 HTML5 Audio 真实播放引擎 + Winamp 2.x 复古 UI |\n| V16 | Winamp 窗口默认尺寸修复（350×230）|\n| V17 | Portfolio 配置驱动重构 + 动态分类 Tab + 灯箱图片预览 |\n| V18 | 删除 \"Help Me Clippy\" 桌面快捷方式 |\n| V19–V20 | Video Player 双引擎升级（B站 iframe + 原生 mp4 真实控制）|\n| V21 | Games Folder 配置化重构 + iframe 沙盒游戏视图切换 |\n| V22–V23 | **博客系统**：XP 资源管理器博客文件夹 + Markdown 阅读器 + 分类过滤 Tab |\n| V24 | 修复最大化窗口被右侧边栏遮挡（`calc(100vw - 34px)`）|\n| V25 | **WelcomeGuard 入口保护**：Boot（银色胶囊进度条）→ Login（银灰主题头像卡）两阶段欢迎动画，sessionStorage 控制每会话仅播放一次 |\n| V26 | **My Computer 重构**：静态文件树映射 `public/assets/`，文件夹导航（地址栏 + Back 按钮），默认图标 `file.png` 支持逐项覆盖 |\n| V27 | **Start 菜单双侧联动**：左侧程序列表自动同步 `DESKTOP_ICON_DEFS`，右侧文件夹列表来自 `FILE_SYSTEM`（最多 5 行），点击定位 My Computer 对应目录 |\n| V28 | **修复 Deno Deploy 生产部署**：将 `preset: 'deno-deploy'` 移入 `nitro()` 插件配置，解决客户端 JS/CSS 资源 500/404 导致桌面不可交互的问题 |\n| V29 | **My Computer 文件预览**：图片缩略图、视频帧缩略图，点击文件自动打开对应窗口（图片→ImageViewer、mp4→VideoPlayer、mp3→Winamp），新增 `inferFileType` / `getPublicUrl` / Pending File Store |\n| V30 | **项目正式命名为 MoeKernel_Desktop**：更新 README 标题与项目简介 |\n\n";
const DOC_CONFIG = {
  /** 要展示的 Markdown 文本内容。默认读取项目根目录的 README.md */
  content: readmeContent,
  /**
   * 文档背景图路径（相对于 public/ 目录，例如 '/assets/wallpapers/bliss.webp'）
   * 留空字符串 "" 则使用纯白背景，无任何图片。
   * 推荐将图片放置于 public/assets/ 目录下。
   */
  backgroundImage: "",
  /**
   * 背景图透明度，范围 0.0（完全透明，等同于无背景图）到 1.0（完全不透明）
   * 推荐范围 0.05 – 0.25，既有视觉层次感，又不影响文字辨读。
   */
  backgroundOpacity: 0.12,
  /** 文档正文字体，与 XP 主题保持一致 */
  fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif'
};
const XP_BLUE$1 = "#5a5a5a";
const XP_DARK_BLUE$1 = "#767676";
const markdownComponents$1 = {
  // 标题
  h1: ({
    children
  }) => /* @__PURE__ */ jsx("h1", { style: {
    fontSize: "20px",
    fontWeight: "bold",
    color: XP_DARK_BLUE$1,
    borderBottom: `2px solid ${XP_BLUE$1}`,
    paddingBottom: "8px",
    marginBottom: "16px",
    marginTop: "24px"
  }, children }),
  h2: ({
    children
  }) => /* @__PURE__ */ jsx("h2", { style: {
    fontSize: "15px",
    fontWeight: "bold",
    color: XP_BLUE$1,
    borderBottom: `1px solid #d0d8f0`,
    paddingBottom: "4px",
    marginBottom: "12px",
    marginTop: "20px",
    letterSpacing: "0.5px"
  }, children }),
  h3: ({
    children
  }) => /* @__PURE__ */ jsx("h3", { style: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#1a4fa0",
    marginBottom: "8px",
    marginTop: "16px"
  }, children }),
  h4: ({
    children
  }) => /* @__PURE__ */ jsx("h4", { style: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "6px",
    marginTop: "12px"
  }, children }),
  // 段落
  p: ({
    children
  }) => /* @__PURE__ */ jsx("p", { style: {
    fontSize: "12px",
    lineHeight: 1.8,
    color: "#333",
    marginBottom: "10px",
    marginTop: 0
  }, children }),
  // 有序/无序列表
  ul: ({
    children
  }) => /* @__PURE__ */ jsx("ul", { style: {
    fontSize: "12px",
    color: "#333",
    marginBottom: "10px",
    paddingLeft: "20px",
    lineHeight: 1.8
  }, children }),
  ol: ({
    children
  }) => /* @__PURE__ */ jsx("ol", { style: {
    fontSize: "12px",
    color: "#333",
    marginBottom: "10px",
    paddingLeft: "20px",
    lineHeight: 1.8
  }, children }),
  li: ({
    children
  }) => /* @__PURE__ */ jsx("li", { style: {
    marginBottom: "3px"
  }, children }),
  // 行内代码 & 代码块
  code: ({
    children,
    className
  }) => {
    const isBlock = className?.startsWith("language-");
    return isBlock ? /* @__PURE__ */ jsx("code", { style: {
      display: "block",
      background: "#e8edf8",
      border: "1px solid #c5d0e8",
      borderRadius: "3px",
      padding: "10px 14px",
      fontSize: "11px",
      fontFamily: '"Courier New", monospace',
      color: "#767676",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      lineHeight: 1.7,
      marginBottom: "10px"
    }, children }) : /* @__PURE__ */ jsx("code", { style: {
      background: "#e8edf8",
      border: "1px solid #c5d0e8",
      borderRadius: "2px",
      padding: "1px 5px",
      fontSize: "11px",
      fontFamily: '"Courier New", monospace',
      color: "#767676"
    }, children });
  },
  pre: ({
    children
  }) => /* @__PURE__ */ jsx("pre", { style: {
    margin: "0 0 10px 0",
    background: "none",
    padding: 0
  }, children }),
  // 引用块
  blockquote: ({
    children
  }) => /* @__PURE__ */ jsx("blockquote", { style: {
    borderLeft: `3px solid ${XP_BLUE$1}`,
    margin: "0 0 10px 0",
    paddingLeft: "12px",
    color: "#555",
    fontStyle: "italic",
    background: "#f0f4fb"
  }, children }),
  // 分割线
  hr: () => /* @__PURE__ */ jsx("hr", { style: {
    border: "none",
    borderTop: `1px solid #d0d8f0`,
    margin: "16px 0"
  } }),
  // 粗体 & 斜体
  strong: ({
    children
  }) => /* @__PURE__ */ jsx("strong", { style: {
    color: XP_DARK_BLUE$1,
    fontWeight: "bold"
  }, children }),
  em: ({
    children
  }) => /* @__PURE__ */ jsx("em", { style: {
    color: "#444",
    fontStyle: "italic"
  }, children }),
  // 链接
  a: ({
    href,
    children
  }) => /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", style: {
    color: XP_BLUE$1,
    textDecoration: "underline",
    fontSize: "12px"
  }, children }),
  // 图片（放置于 public/assets/ 目录，使用绝对路径引用）
  img: ({
    src,
    alt
  }) => /* @__PURE__ */ jsx("img", { src, alt: alt ?? "", style: {
    maxWidth: "100%",
    borderRadius: "4px",
    border: `1px solid #d0d8f0`,
    margin: "8px 0",
    display: "block",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
  } }),
  // 表格（remark-gfm 提供 GFM 表格支持）
  table: ({
    children
  }) => /* @__PURE__ */ jsx("div", { style: {
    overflowX: "auto",
    marginBottom: "12px"
  }, children: /* @__PURE__ */ jsx("table", { style: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: "11px"
  }, children }) }),
  thead: ({
    children
  }) => /* @__PURE__ */ jsx("thead", { style: {
    background: "#dbe4f5"
  }, children }),
  th: ({
    children
  }) => /* @__PURE__ */ jsx("th", { style: {
    border: `1px solid #c5d0e8`,
    padding: "5px 10px",
    textAlign: "left",
    fontWeight: "bold",
    color: XP_DARK_BLUE$1
  }, children }),
  td: ({
    children
  }) => /* @__PURE__ */ jsx("td", { style: {
    border: `1px solid #d8dfe8`,
    padding: "4px 10px",
    color: "#333"
  }, children }),
  tr: ({
    children
  }) => /* @__PURE__ */ jsx("tr", { style: {
    background: "transparent"
  }, children })
};
function OpacityControl$1({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "absolute",
    top: "38px",
    right: "10px",
    zIndex: 20,
    background: "rgba(236,233,216,0.92)",
    border: "1px solid #aca899",
    borderRadius: "3px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    color: "#555",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
  }, "data-cid": "DySnQIRY", children: [
    /* @__PURE__ */ jsx("span", { style: {
      whiteSpace: "nowrap"
    }, children: "背景透明度" }),
    /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 100, value: Math.round(value * 100), onChange: (e) => onChange(Number(e.target.value) / 100), style: {
      width: "70px",
      cursor: "pointer",
      accentColor: XP_BLUE$1
    } }),
    /* @__PURE__ */ jsxs("span", { style: {
      minWidth: "28px"
    }, children: [
      Math.round(value * 100),
      "%"
    ] })
  ] });
}
function ResumeApp() {
  const [bgOpacity, setBgOpacity] = useState(DOC_CONFIG.backgroundOpacity);
  const hasBg = Boolean(DOC_CONFIG.backgroundImage);
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: DOC_CONFIG.fontFamily
  }, "data-cid": "c2KNtDVc", children: [
    hasBg && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${DOC_CONFIG.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: bgOpacity,
      zIndex: 0
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 10,
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#ece9d8",
        borderBottom: "1px solid #aca899",
        padding: "4px 10px",
        display: "flex",
        gap: "2px",
        flexShrink: 0,
        alignItems: "center"
      }, children: [
        ["File", "Edit", "View", "Format", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
          background: "none",
          border: "none",
          padding: "2px 8px",
          cursor: "pointer",
          fontFamily: DOC_CONFIG.fontFamily,
          fontSize: "12px"
        }, children: m }, m)),
        /* @__PURE__ */ jsx("span", { style: {
          marginLeft: "auto",
          fontSize: "11px",
          color: "#888",
          paddingRight: "90px"
        }, children: "MoeKernel_Desktop / README.md — 只读" })
      ] }),
      hasBg && /* @__PURE__ */ jsx(OpacityControl$1, { value: bgOpacity, onChange: setBgOpacity }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        overflowY: "auto",
        padding: "12px",
        background: hasBg ? "transparent" : "#f0ede4"
      }, children: /* @__PURE__ */ jsx("div", { style: {
        maxWidth: "680px",
        margin: "0 auto 12px auto",
        padding: "32px 40px",
        background: hasBg ? "rgba(255,255,255,0.88)" : "#fff",
        minHeight: "600px",
        boxShadow: "0 0 12px rgba(0,0,0,0.15)",
        backdropFilter: hasBg ? "blur(2px)" : "none"
      }, children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], components: markdownComponents$1, children: DOC_CONFIG.content }) }) })
    ] })
  ] });
}
const VIDEO_CONFIG = {
  bgColor: "#1a1a1a",
  menuBarBg: "#ece9d8",
  menuBarBorder: "#aca899",
  nowPlayingGradientStart: "#2a2a2a",
  nowPlayingGradientMid: "#505050",
  nowPlayingAccentColor: "#cccccc",
  nowPlayingTitleColor: "#ffffff",
  transportBgTop: "#2a2a2a",
  transportBgBottom: "#1a1a1a",
  transportBorder: "#444444",
  buttonBgTop: "#555555",
  buttonBgBottom: "#333333",
  buttonBorder: "#666666",
  buttonColor: "#dddddd",
  buttonHoverBg: "#808080",
  // 置灰按钮（bilibili模式下禁用的按钮）
  buttonDisabledBg: "#2a2a2a",
  buttonDisabledColor: "#555555",
  buttonDisabledBorder: "#3a3a3a",
  progressTrackBg: "#333333",
  progressTrackBorder: "#555555",
  progressFillStart: "#a0a0a0",
  progressFillEnd: "#c0c0c0",
  // 进度条可拖拽滑块颜色
  progressThumbColor: "#c0c0c0",
  volumeFillColor: "#a0a0a0",
  statusBarBg: "#111111",
  statusBarText: "#666666",
  statusBarBorder: "#333333",
  stoppedBg: "#000000",
  stoppedTextColor: "#555555"
};
const VIDEO_LIST = [
  {
    type: "bilibili",
    title: "おちゃめ機能",
    bvid: "BV1sx411c7sB",
    cover: ""
  },
  {
    type: "bilibili",
    title: "河蟹你全家【原版】",
    bvid: "BV1xx411c7BF",
    cover: ""
  },
  {
    type: "mp4",
    title: "リリリリ★バーニングナイトを踊ってみた",
    src: "/assets/video/1.mp4",
    // 放在 public/assets/ 下的文件
    cover: "/assets/video/1.webp"
  }
  // ── mp4 示例（取消注释并填入真实 src 即可启用）──
  // {
  //   type: 'mp4',
  //   title: 'My Portfolio Showreel',
  //   src: '/assets/showreel.mp4',  // 放在 public/assets/ 下的文件
  //   cover: '/assets/showreel-cover.jpg',
  // },
];
const FONT$5 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function VideoPlayerApp() {
  const [videoList, setVideoList] = useState(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === "video") {
      return [{
        type: "mp4",
        title: pending.title,
        src: pending.url,
        cover: ""
      }, ...VIDEO_LIST];
    }
    return [...VIDEO_LIST];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const currentVideo = videoList[currentIndex];
  const isBilibili = currentVideo?.type === "bilibili";
  const isMp4 = currentVideo?.type === "mp4";
  const iframeSrc = isBilibili && currentVideo ? `https://player.bilibili.com/player.html?bvid=${currentVideo.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0` : "";
  const mp4Src = isMp4 && currentVideo ? currentVideo.src : "";
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress(video.currentTime / video.duration);
        setDuration(video.duration);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, isStopped]);
  const switchTo = useCallback((index) => {
    setCurrentIndex(index);
    setIsStopped(false);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, []);
  const handlePlay = () => {
    if (isStopped) {
      setIsStopped(false);
      setIsPlaying(true);
      if (isMp4) {
        setTimeout(() => videoRef.current?.play(), 100);
      }
      return;
    }
    if (isMp4) {
      videoRef.current?.play();
    }
    setIsPlaying(true);
  };
  const handlePause = () => {
    if (isMp4) {
      videoRef.current?.pause();
    }
    setIsPlaying(false);
  };
  const handleStop = () => {
    if (isMp4 && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsStopped(true);
    setIsPlaying(false);
    setProgress(0);
  };
  const handleSeekBack = () => {
    if (isMp4 && videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };
  const handleSeekForward = () => {
    if (isMp4 && videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10);
    }
  };
  const handlePrev = () => switchTo((currentIndex - 1 + videoList.length) % videoList.length);
  const handleNext = () => switchTo((currentIndex + 1) % videoList.length);
  const handleProgressClick = (e) => {
    if (!isMp4 || !videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * (videoRef.current.duration || 0);
  };
  const transportButtons = [{
    id: "prev",
    icon: "⏮",
    label: "上一个",
    handler: handlePrev
  }, {
    id: "seekback",
    icon: "⏪",
    label: "快退10秒",
    handler: handleSeekBack,
    disabledOnBilibili: true
  }, {
    id: "playpause",
    icon: () => isPlaying ? "⏸" : "▶",
    label: isPlaying ? "暂停" : "播放",
    handler: isPlaying ? handlePause : handlePlay,
    disabledOnBilibili: true
  }, {
    id: "seekfwd",
    icon: "⏩",
    label: "快进10秒",
    handler: handleSeekForward,
    disabledOnBilibili: true
  }, {
    id: "next",
    icon: "⏭",
    label: "下一个",
    handler: handleNext
  }, {
    id: "stop",
    icon: "⏹",
    label: "停止",
    handler: handleStop
  }];
  const formatTime2 = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: VIDEO_CONFIG.bgColor,
    fontFamily: FONT$5,
    userSelect: "none"
  }, "data-cid": "NEHM67rH", children: [
    /* @__PURE__ */ jsx("div", { style: {
      background: VIDEO_CONFIG.menuBarBg,
      borderBottom: `1px solid ${VIDEO_CONFIG.menuBarBorder}`,
      flexShrink: 0
    }, children: /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      padding: "2px 4px"
    }, children: ["File", "View", "Play", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
      background: "none",
      border: "none",
      padding: "2px 8px",
      cursor: "default",
      fontFamily: FONT$5,
      fontSize: "12px"
    }, children: m }, m)) }) }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: `linear-gradient(90deg, ${VIDEO_CONFIG.nowPlayingGradientStart} 0%, ${VIDEO_CONFIG.nowPlayingGradientMid} 60%, ${VIDEO_CONFIG.nowPlayingGradientStart} 100%)`,
      padding: "4px 10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexShrink: 0,
      borderBottom: "1px solid #000"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "11px",
        color: VIDEO_CONFIG.nowPlayingAccentColor,
        fontWeight: "bold",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap"
      }, children: "▶ NOW PLAYING" }),
      /* @__PURE__ */ jsxs("span", { style: {
        fontSize: "11px",
        color: VIDEO_CONFIG.nowPlayingTitleColor,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        flex: 1
      }, children: [
        currentVideo?.title ?? "— No Video —",
        /* @__PURE__ */ jsxs("span", { style: {
          marginLeft: "8px",
          opacity: 0.5,
          fontSize: "10px"
        }, children: [
          "[",
          currentIndex + 1,
          "/",
          videoList.length,
          "]"
        ] })
      ] }),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "9px",
        padding: "1px 5px",
        borderRadius: "2px",
        background: isBilibili ? "#cc3333" : "#336633",
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "0.5px"
      }, children: isBilibili ? "BILIBILI" : "MP4" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      position: "relative",
      background: "#000",
      overflow: "hidden"
    }, children: [
      isStopped ? (
        /* 停止状态：封面/占位画面 */
        /* @__PURE__ */ jsxs("div", { style: {
          position: "absolute",
          inset: 0,
          background: VIDEO_CONFIG.stoppedBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }, children: [
          currentVideo?.cover ? /* @__PURE__ */ jsx("img", { src: currentVideo.cover, alt: "cover", style: {
            maxWidth: "60%",
            maxHeight: "60%",
            opacity: 0.5,
            borderRadius: "4px"
          } }) : /* @__PURE__ */ jsx("span", { style: {
            fontSize: "48px",
            opacity: 0.3
          }, children: "⏹" }),
          /* @__PURE__ */ jsx("span", { style: {
            color: VIDEO_CONFIG.stoppedTextColor,
            fontSize: "12px",
            fontFamily: FONT$5
          }, children: "已停止 — 点击 ▶ 播放" })
        ] })
      ) : isBilibili ? (
        /* bilibili iframe 模式 */
        /* @__PURE__ */ jsx("iframe", { ref: iframeRef, src: iframeSrc, title: "Bilibili Video Player", scrolling: "no", frameBorder: "0", allowFullScreen: true, allow: "autoplay; fullscreen", style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none"
        } }, `bilibili-${currentVideo && "bvid" in currentVideo ? currentVideo.bvid : currentIndex}`)
      ) : (
        /* mp4 原生 video 模式 */
        /* @__PURE__ */ jsx("video", { ref: videoRef, src: mp4Src, style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "#000"
        }, onPlay: () => setIsPlaying(true), onPause: () => setIsPlaying(false) }, `mp4-${currentIndex}`)
      ),
      isBilibili && !isStopped && /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        bottom: "6px",
        right: "8px",
        background: "rgba(0,0,0,0.6)",
        color: "#aaa",
        fontSize: "9px",
        padding: "2px 6px",
        borderRadius: "2px",
        pointerEvents: "none",
        fontFamily: FONT$5
      }, children: "B站模式：直接点击画面控制" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: VIDEO_CONFIG.transportBgBottom,
      padding: "4px 10px 2px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "9px",
        color: "#777",
        minWidth: "30px",
        fontFamily: FONT$5
      }, children: isMp4 && !isStopped ? formatTime2(progress * duration) : "0:00" }),
      /* @__PURE__ */ jsxs("div", { onClick: handleProgressClick, style: {
        flex: 1,
        height: "8px",
        background: VIDEO_CONFIG.progressTrackBg,
        borderRadius: "4px",
        border: `1px solid ${VIDEO_CONFIG.progressTrackBorder}`,
        position: "relative",
        cursor: isMp4 && !isStopped ? "pointer" : "default"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: `${(isStopped ? 0 : progress) * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${VIDEO_CONFIG.progressFillStart}, ${VIDEO_CONFIG.progressFillEnd})`,
          borderRadius: "4px",
          transition: isMp4 ? "none" : "width 0.3s"
        } }),
        isMp4 && !isStopped && /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          top: "50%",
          left: `${progress * 100}%`,
          transform: "translate(-50%, -50%)",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: VIDEO_CONFIG.progressThumbColor,
          border: "1px solid #fff",
          boxShadow: "0 0 3px rgba(0,0,0,0.5)"
        } })
      ] }),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "9px",
        color: "#777",
        minWidth: "30px",
        textAlign: "right",
        fontFamily: FONT$5
      }, children: isMp4 && duration > 0 ? formatTime2(duration) : "--:--" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: `linear-gradient(180deg, ${VIDEO_CONFIG.transportBgTop} 0%, ${VIDEO_CONFIG.transportBgBottom} 100%)`,
      borderTop: `2px solid ${VIDEO_CONFIG.transportBorder}`,
      padding: "5px 10px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      flexShrink: 0
    }, children: [
      transportButtons.map(({
        id,
        icon,
        handler,
        label,
        disabledOnBilibili
      }) => {
        const isDisabled = isBilibili && disabledOnBilibili === true;
        const iconStr = typeof icon === "function" ? icon() : icon;
        return /* @__PURE__ */ jsx("button", { title: isDisabled ? `${label}（B站模式不可用）` : label, onClick: isDisabled ? void 0 : handler, disabled: isDisabled, style: {
          background: isDisabled ? VIDEO_CONFIG.buttonDisabledBg : `linear-gradient(180deg, ${VIDEO_CONFIG.buttonBgTop}, ${VIDEO_CONFIG.buttonBgBottom})`,
          border: `1px solid ${isDisabled ? VIDEO_CONFIG.buttonDisabledBorder : VIDEO_CONFIG.buttonBorder}`,
          borderRadius: "3px",
          color: isDisabled ? VIDEO_CONFIG.buttonDisabledColor : VIDEO_CONFIG.buttonColor,
          fontSize: "14px",
          padding: "2px 8px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          opacity: isDisabled ? 0.45 : 1,
          transition: "background 0.1s"
        }, onMouseEnter: (e) => {
          if (!isDisabled) {
            e.currentTarget.style.background = VIDEO_CONFIG.buttonHoverBg;
          }
        }, onMouseLeave: (e) => {
          if (!isDisabled) {
            e.currentTarget.style.background = `linear-gradient(180deg, ${VIDEO_CONFIG.buttonBgTop}, ${VIDEO_CONFIG.buttonBgBottom})`;
          }
        }, "data-cid": "paeOXwbB", children: iconStr }, id);
      }),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "10px",
        color: "#aaa",
        marginLeft: "4px"
      }, children: "🔊" }),
      /* @__PURE__ */ jsx("div", { style: {
        width: "50px",
        height: "5px",
        background: "#444",
        borderRadius: "3px",
        border: "1px solid #555"
      }, children: /* @__PURE__ */ jsx("div", { style: {
        width: "70%",
        height: "100%",
        background: VIDEO_CONFIG.volumeFillColor,
        borderRadius: "3px"
      } }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: VIDEO_CONFIG.statusBarBg,
      padding: "2px 10px",
      borderTop: `1px solid ${VIDEO_CONFIG.statusBarBorder}`,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "10px",
        color: VIDEO_CONFIG.statusBarText,
        fontFamily: FONT$5
      }, children: isStopped ? "已停止" : isPlaying ? `▶ 正在播放 — ${currentVideo?.title ?? ""}` : `⏸ 已暂停 — ${currentVideo?.title ?? ""}` }),
      /* @__PURE__ */ jsxs("span", { style: {
        fontSize: "10px",
        color: VIDEO_CONFIG.statusBarText,
        fontFamily: FONT$5
      }, children: [
        isBilibili ? "Bilibili Player" : "HTML5 Player",
        " | HD"
      ] })
    ] })
  ] });
}
const FONT$4 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const PORTFOLIO_CONFIG = {
  background: {
    // 背景图路径。例如 '/assets/portfolio/bg.jpg'。设为 '' 则无背景图。
    imageUrl: "",
    // 默认透明度 (0~1)。用户可以通过顶部滑块实时调整。
    defaultOpacity: 0.2
  },
  sidebar: {
    // 左侧面板背景色。填入任意合法的 CSS background 值：
    // 原始 XP 蓝色渐变：'linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)'
    // 紫色渐变：       'linear-gradient(180deg,#e8dcfc 0%,#c4b0f8 100%)'
    // 纯色：           '#c8daf5'
    background: "linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)",
    // 分隔线和边框颜色（与 background 配套调整）
    borderColor: "#c8c8c8",
    // 文字标题颜色（分组标题）
    titleColor: "#767676",
    // 任务链接文字颜色
    linkColor: "#0033aa",
    // ── "File and Folder Tasks" 区域 ─────────────────────────────
    tasksTitle: "File and Folder Tasks",
    taskItems: [{
      icon: "📁",
      text: "Make new folder"
    }, {
      icon: "📤",
      text: "Publish to Web"
    }, {
      icon: "📧",
      text: "E-mail items"
    }],
    // ── "Details" 区域 ────────────────────────────────────────────
    detailsTitle: "Details",
    // Details 区域中显示的"拥有者"姓名
    owner: "Portfolio Owner"
  }
};
const PORTFOLIO_ITEMS = [{
  id: "p1",
  title: "XP Desktop UI",
  category: "Web Design",
  fileName: "xp-desktop.webp",
  description: "一个完整的 Windows XP 风格桌面 UI，包括图标、任务栏和窗口管理系统。",
  year: "2024"
}, {
  id: "p2",
  title: "Retro Music App",
  category: "UI Design",
  fileName: "retro-music.png",
  description: "Winamp 2.x 风格音乐播放器，支持真实 HTML5 音频引擎和复古界面。",
  year: "2024"
}, {
  id: "p3",
  title: "Pixel Art Series",
  category: "Illustration",
  fileName: "pixel-art.png",
  description: "一组像素风格的插画作品，灵感来源于 90 年代 16 位游戏美学。",
  year: "2023"
}, {
  id: "p4",
  title: "Chat Application",
  category: "Full-Stack",
  fileName: "chat-app.png",
  description: "全栈即时通讯应用，基于 WebSocket 实现实时消息推送，仿 MSN Messenger 风格。",
  year: "2023"
}, {
  id: "p5",
  title: "Portfolio v1",
  category: "Web Design",
  fileName: "portfolio-v1.png",
  description: "我的第一版个人作品集网站，采用极简黑白设计风格。",
  year: "2022"
}, {
  id: "p6",
  title: "Icon Pack",
  category: "Illustration",
  fileName: "icon-pack.png",
  description: "一套包含 80+ 图标的 XP 风格图标包，支持 32px/64px 两种规格。",
  year: "2022"
}];
function getImageUrl(fileName) {
  return `/assets/portfolio/${fileName}`;
}
function Lightbox({
  item,
  onClose
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    background: "rgba(0,0,0,0.82)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT$4,
    padding: "24px"
  }, onClick: onClose, "data-cid": "aQuep6if", children: [
    /* @__PURE__ */ jsx("button", { onClick: onClose, style: {
      position: "absolute",
      top: "12px",
      right: "14px",
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.35)",
      borderRadius: "3px",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "bold",
      padding: "2px 8px",
      cursor: "pointer",
      fontFamily: FONT$4,
      lineHeight: 1.4
    }, children: "✕ Close" }),
    /* @__PURE__ */ jsx("div", { style: {
      maxWidth: "80%",
      maxHeight: "65%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px"
    }, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx("img", { src: getImageUrl(item.fileName), alt: item.title, style: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      borderRadius: "3px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      border: "2px solid rgba(255,255,255,0.15)"
    }, onError: (e) => {
      const target = e.currentTarget;
      target.style.width = "320px";
      target.style.height = "200px";
      target.style.background = "#1a2a4a";
      target.style.objectFit = "none";
      target.alt = "图片未找到 — 请将图片放入 public/assets/portfolio/";
    } }) }),
    /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      maxWidth: "520px"
    }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("div", { style: {
        color: "#fff",
        fontSize: "15px",
        fontWeight: "bold",
        marginBottom: "6px"
      }, children: item.title }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "inline-block",
        background: "rgba(49,106,197,0.5)",
        border: "1px solid rgba(100,160,255,0.4)",
        borderRadius: "3px",
        padding: "1px 8px",
        fontSize: "11px",
        color: "#9ec8ff",
        marginBottom: "10px"
      }, children: [
        item.category,
        " · ",
        item.year
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        color: "#bcd0f0",
        fontSize: "12px",
        lineHeight: 1.7
      }, children: item.description })
    ] })
  ] });
}
function ExplorerToolbar$1({
  opacity,
  onOpacityChange,
  showBgControl
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$4,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "ReMCTDVT", children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: "2px",
      padding: "2px 4px",
      borderBottom: "1px solid #aca899",
      alignItems: "center",
      justifyContent: "space-between"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        gap: "2px"
      }, children: ["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
        background: "none",
        border: "none",
        padding: "2px 6px",
        cursor: "pointer",
        fontFamily: FONT$4,
        fontSize: "12px"
      }, children: m }, m)) }),
      showBgControl && /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        paddingRight: "8px"
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: "10px",
          color: "#555",
          whiteSpace: "nowrap"
        }, children: "🖼 BG Opacity" }),
        /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 1, step: 0.01, value: opacity, onChange: (e) => onOpacityChange(Number(e.target.value)), style: {
          width: "80px",
          cursor: "pointer",
          accentColor: "#5a5a5a"
        }, title: `背景透明度：${Math.round(opacity * 100)}%` }),
        /* @__PURE__ */ jsxs("span", { style: {
          fontSize: "10px",
          color: "#333",
          minWidth: "28px"
        }, children: [
          Math.round(opacity * 100),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "3px 6px"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        color: "#555",
        fontSize: "11px"
      }, children: "Address" }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #999",
        padding: "1px 6px",
        fontSize: "12px",
        borderRadius: "2px"
      }, children: "C:\\Users\\Portfolio\\My Works" })
    ] })
  ] });
}
function PortfolioApp() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [bgOpacity, setBgOpacity] = useState(PORTFOLIO_CONFIG.background.defaultOpacity);
  const categories = useMemo(() => {
    const cats = Array.from(new Set(PORTFOLIO_ITEMS.map((i) => i.category)));
    return ["All", ...cats];
  }, []);
  const filtered = activeCategory === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter((p) => p.category === activeCategory);
  const {
    sidebar
  } = PORTFOLIO_CONFIG;
  const hasBackground = PORTFOLIO_CONFIG.background.imageUrl.length > 0;
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    // 必须，用于 absolute 子元素定位
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT$4,
    overflow: "hidden"
  }, "data-cid": "JY_eXBW8", children: [
    hasBackground && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      backgroundImage: `url(${PORTFOLIO_CONFIG.background.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: bgOpacity
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsx(ExplorerToolbar$1, { opacity: bgOpacity, onOpacityChange: setBgOpacity, showBgControl: hasBackground }),
      /* @__PURE__ */ jsx("div", { style: {
        background: "#ece9d8",
        padding: "6px 8px 0 8px",
        borderBottom: "1px solid #aca899",
        display: "flex",
        alignItems: "flex-end",
        flexShrink: 0,
        flexWrap: "wrap",
        gap: "2px"
      }, children: categories.map((cat) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveCategory(cat), style: {
        background: activeCategory === cat ? "linear-gradient(180deg,#fff 0%,#ece9d8 100%)" : "linear-gradient(180deg,#d4d0c8 0%,#c0bdb5 100%)",
        border: "1px solid #aca899",
        borderBottom: activeCategory === cat ? "1px solid #ece9d8" : "1px solid #aca899",
        borderRadius: "3px 3px 0 0",
        padding: "3px 12px",
        cursor: "pointer",
        fontFamily: FONT$4,
        fontSize: "11px",
        fontWeight: activeCategory === cat ? "bold" : "normal",
        color: activeCategory === cat ? "#767676" : "#333",
        marginRight: "2px",
        position: "relative",
        bottom: activeCategory === cat ? "-1px" : "0",
        zIndex: activeCategory === cat ? 1 : 0
      }, children: cat }, cat)) }),
      /* @__PURE__ */ jsxs("div", { style: {
        flex: 1,
        display: "flex",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          width: "150px",
          flexShrink: 0,
          // 颜色由 PORTFOLIO_CONFIG.sidebar.background 控制
          background: sidebar.background,
          borderRight: `1px solid ${sidebar.borderColor}`,
          padding: "12px 8px",
          overflowY: "auto"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: sidebar.titleColor,
            marginBottom: "8px",
            borderBottom: `1px solid ${sidebar.borderColor}`,
            paddingBottom: "4px"
          }, children: sidebar.tasksTitle }),
          sidebar.taskItems.map((t) => /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "3px 2px",
            cursor: "pointer",
            fontSize: "11px",
            color: sidebar.linkColor,
            borderRadius: "2px"
          }, children: [
            /* @__PURE__ */ jsx("span", { children: t.icon }),
            /* @__PURE__ */ jsx("span", { style: {
              textDecoration: "underline"
            }, children: t.text })
          ] }, t.text)),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: sidebar.titleColor,
            margin: "14px 0 8px",
            borderBottom: `1px solid ${sidebar.borderColor}`,
            paddingBottom: "4px"
          }, children: sidebar.detailsTitle }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: "10px",
            color: "#333",
            lineHeight: 1.7
          }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Items:" }),
              " ",
              filtered.length
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Type:" }),
              " Portfolio"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { children: "Owner:" }),
              " ",
              sidebar.owner
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
          gap: "14px",
          alignContent: "flex-start",
          background: hasBackground ? "transparent" : "#fff"
        }, children: filtered.length === 0 ? /* @__PURE__ */ jsx("div", { style: {
          gridColumn: "1 / -1",
          textAlign: "center",
          color: "#888",
          fontSize: "12px",
          paddingTop: "40px"
        }, children: "此分类暂无作品。请在 PORTFOLIO_ITEMS 中添加。" }) : filtered.map((item) => /* @__PURE__ */ jsxs("div", { onMouseEnter: () => setHoveredId(item.id), onMouseLeave: () => setHoveredId(null), onClick: () => setLightboxItem(item), style: {
          border: hoveredId === item.id ? "2px solid #5a5a5a" : "2px solid #d0d8e8",
          borderRadius: "4px",
          overflow: "hidden",
          cursor: "pointer",
          background: "#f5f8ff",
          boxShadow: hoveredId === item.id ? "0 2px 8px rgba(49,106,197,0.25)" : "0 1px 3px rgba(0,0,0,0.08)",
          transition: "border-color 0.15s,box-shadow 0.15s"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            position: "relative",
            height: "90px",
            background: "#e8eef8",
            overflow: "hidden"
          }, children: [
            /* @__PURE__ */ jsx("img", { src: getImageUrl(item.fileName), alt: item.title, style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }, onError: (e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".placeholder")) {
                const ph = document.createElement("div");
                ph.className = "placeholder";
                ph.style.cssText = "width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;color:#8899aa;text-align:center;padding:4px;";
                ph.textContent = "图片未找到\n请放入\nassets/portfolio/";
                parent.appendChild(ph);
              }
            } }),
            hoveredId === item.id && /* @__PURE__ */ jsxs("div", { style: {
              position: "absolute",
              inset: 0,
              background: "rgba(49,106,197,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "4px"
            }, children: [
              /* @__PURE__ */ jsx("span", { style: {
                color: "#fff",
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center",
                padding: "0 4px"
              }, children: item.title }),
              /* @__PURE__ */ jsx("span", { style: {
                color: "#c8deff",
                fontSize: "10px"
              }, children: item.year }),
              /* @__PURE__ */ jsx("span", { style: {
                color: "#fff",
                fontSize: "10px",
                background: "rgba(0,0,0,0.3)",
                borderRadius: "2px",
                padding: "1px 5px",
                marginTop: "2px"
              }, children: "🔍 点击查看" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            padding: "6px 8px",
            borderTop: "1px solid #d0d8e8",
            background: hasBackground ? "rgba(245,248,255,0.9)" : "#f5f8ff"
          }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: "11px",
              fontWeight: "bold",
              color: "#767676",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }, children: item.title }),
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: "10px",
              color: "#666",
              marginTop: "1px"
            }, children: item.category })
          ] })
        ] }, item.id)) })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        background: "#ece9d8",
        borderTop: "1px solid #aca899",
        padding: "2px 10px",
        flexShrink: 0
      }, children: /* @__PURE__ */ jsxs("span", { style: {
        fontSize: "11px",
        color: "#333"
      }, children: [
        filtered.length,
        " object(s)"
      ] }) })
    ] }),
    lightboxItem !== null && /* @__PURE__ */ jsx(Lightbox, { item: lightboxItem, onClose: () => setLightboxItem(null) })
  ] });
}
const FONT$3 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function ImageViewerApp() {
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("Image Viewer");
  const [zoom, setZoom] = useState(100);
  useEffect(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === "image") {
      setImageUrl(pending.url);
      setTitle(pending.title);
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#2b2b2b",
    fontFamily: FONT$3
  }, "data-cid": "8PCmlZwu", children: [
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      borderBottom: "1px solid #aca899",
      padding: "3px 6px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setZoom((z) => Math.min(z + 25, 400)), style: {
        padding: "1px 8px",
        fontFamily: FONT$3,
        fontSize: "12px",
        border: "1px solid #aca899",
        background: "#d4d0c8",
        borderRadius: 2,
        cursor: "pointer"
      }, children: "+ Zoom In" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setZoom((z) => Math.max(z - 25, 25)), style: {
        padding: "1px 8px",
        fontFamily: FONT$3,
        fontSize: "12px",
        border: "1px solid #aca899",
        background: "#d4d0c8",
        borderRadius: 2,
        cursor: "pointer"
      }, children: "− Zoom Out" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setZoom(100), style: {
        padding: "1px 8px",
        fontFamily: FONT$3,
        fontSize: "12px",
        border: "1px solid #aca899",
        background: "#d4d0c8",
        borderRadius: 2,
        cursor: "pointer"
      }, children: "1:1" }),
      /* @__PURE__ */ jsxs("span", { style: {
        color: "#555",
        fontSize: "11px",
        marginLeft: 4
      }, children: [
        zoom,
        "%"
      ] }),
      /* @__PURE__ */ jsx("span", { style: {
        flex: 1
      } }),
      /* @__PURE__ */ jsx("span", { style: {
        color: "#555",
        fontSize: "11px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: 200
      }, children: title })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      flex: 1,
      overflow: "auto",
      display: "flex",
      alignItems: zoom <= 100 ? "center" : "flex-start",
      justifyContent: zoom <= 100 ? "center" : "flex-start",
      padding: 12,
      background: "#1e1e1e"
    }, children: imageUrl ? /* @__PURE__ */ jsx("img", { src: imageUrl, alt: title, style: {
      maxWidth: zoom <= 100 ? "100%" : "none",
      maxHeight: zoom <= 100 ? "100%" : "none",
      width: zoom !== 100 ? `${zoom}%` : void 0,
      objectFit: "contain",
      display: "block",
      imageRendering: zoom > 200 ? "pixelated" : "auto",
      boxShadow: "0 2px 16px rgba(0,0,0,0.6)"
    } }) : /* @__PURE__ */ jsxs("div", { style: {
      color: "#666",
      fontSize: "13px",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 40,
        marginBottom: 12
      }, children: "🖼" }),
      "No image selected.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 11,
        color: "#444"
      }, children: "Open an image from My Computer." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { style: {
      background: "#ece9d8",
      borderTop: "1px solid #aca899",
      padding: "2px 8px",
      fontSize: "11px",
      color: "#555",
      flexShrink: 0,
      fontFamily: FONT$3
    }, children: imageUrl ? title : "Ready" })
  ] });
}
const post1Content = '# Hello World\n\n欢迎来到我的博客！这是第一篇文章，也是一个新的开始。\n\n## 关于这个博客\n\n这个博客嵌入在一个 **Windows XP 风格**的桌面系统中。你现在看到的这个窗口，就像是在 2003 年打开一个文本文档一样。\n\n## 为什么选择 XP 风格？\n\nWindows XP 是很多人童年的记忆。那个时代的互联网充满了**探索感**——你不知道下一个链接会通向哪里，每一个网页都是独一无二的手工作品。\n\n> "The best time to plant a tree was 20 years ago. The second best time is now."\n\n我希望用这种复古的形式，带来一点不一样的阅读体验。\n\n## 技术栈\n\n这个网站使用了：\n\n```\nReact 19 + TanStack Start\nTailwind CSS v4\ntRPC v11\nMarkdown + remark-gfm\n```\n\n感谢你的到来，后续会有更多内容更新！\n';
const post2Content = "文章直接写markdown格式就好\n";
const BLOG_POSTS = [
  {
    id: "blog-hello-world",
    title: "Hello World",
    icon: "/assets/icons/Blog.png",
    backgroundImage: "/assets/wallpapers/bg4.jpg",
    bgOpacity: 1,
    content: post1Content,
    category: "技术"
  },
  {
    id: "blog-xp-memories",
    title: "1 Day",
    icon: "/assets/icons/blog2.png",
    backgroundImage: "/assets/wallpapers/bg5.jpg",
    bgOpacity: 1,
    content: post2Content,
    category: "生活"
  }
];
const FONT$2 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const ALL_LABEL = "全部";
function ExplorerToolbar({
  address
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$2,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "oLTc_jJn", children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      gap: "2px",
      padding: "2px 4px",
      borderBottom: "1px solid #aca899"
    }, children: ["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
      background: "none",
      border: "none",
      padding: "2px 6px",
      cursor: "pointer",
      fontFamily: FONT$2,
      fontSize: "12px"
    }, children: m }, m)) }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "3px 6px"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        color: "#555",
        fontSize: "11px"
      }, children: "Address" }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        background: "#fff",
        border: "1px solid #999",
        padding: "1px 6px",
        fontSize: "12px",
        borderRadius: "2px"
      }, children: address })
    ] })
  ] });
}
function CategoryTabBar({
  categories,
  activeCategory,
  onSelect
}) {
  return /* @__PURE__ */ jsx("div", { style: {
    display: "flex",
    alignItems: "flex-end",
    gap: "2px",
    padding: "4px 8px 0 8px",
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    flexShrink: 0,
    overflowX: "auto"
  }, "data-cid": "aUgFWHOS", children: categories.map((cat) => {
    const isActive = cat === activeCategory;
    return /* @__PURE__ */ jsx("button", { onClick: () => onSelect(cat), style: {
      fontFamily: FONT$2,
      fontSize: "11px",
      padding: "3px 12px 4px 12px",
      cursor: "pointer",
      border: "1px solid #aca899",
      borderBottom: isActive ? "1px solid #fff" : "1px solid #aca899",
      borderRadius: "4px 4px 0 0",
      background: isActive ? "#fff" : "linear-gradient(180deg, #f0ede4 0%, #dedad0 100%)",
      color: isActive ? "#000" : "#444",
      fontWeight: isActive ? "bold" : "normal",
      position: "relative",
      zIndex: isActive ? 1 : 0,
      marginBottom: isActive ? "-1px" : "0",
      whiteSpace: "nowrap",
      outline: "none",
      boxShadow: isActive ? "none" : "inset 0 -1px 0 #aca899",
      transition: "background 0.1s"
    }, "data-cid": "1kDR-Bjo", children: cat }, cat);
  }) });
}
function ArticleTile({
  icon,
  label,
  postId
}) {
  const [hov, setHov] = useState(false);
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("xp-open-window", {
      detail: {
        id: postId,
        title: label,
        icon
      }
    }));
  };
  return /* @__PURE__ */ jsxs("div", { onClick: handleClick, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    width: "88px",
    cursor: "pointer",
    background: hov ? "#5a5a5a" : "transparent",
    borderRadius: "4px",
    padding: "8px 4px",
    userSelect: "none"
  }, "data-cid": "U9THT5l8", children: [
    /* @__PURE__ */ jsx("img", { src: icon, alt: label, style: {
      width: "48px",
      height: "48px",
      objectFit: "contain"
    } }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "11px",
      fontFamily: FONT$2,
      color: hov ? "#fff" : "#000",
      textAlign: "center",
      wordBreak: "break-word",
      lineHeight: "1.3"
    }, children: label })
  ] });
}
function BlogFolderApp() {
  const [activeCategory, setActiveCategory] = useState(ALL_LABEL);
  const {
    data: dbPosts,
    isLoading
  } = useQuery({
    ...trpc.site.getBlogPosts.queryOptions(),
    staleTime: 0,
    refetchOnWindowFocus: true
  });
  const posts = dbPosts ?? BLOG_POSTS;
  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
    return [ALL_LABEL, ...unique];
  }, [posts]);
  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL_LABEL) return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);
  const addressPath = activeCategory === ALL_LABEL ? "My Blog" : `My Blog > ${activeCategory}`;
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  }, "data-cid": "xpgYBKTb", children: [
    /* @__PURE__ */ jsx(ExplorerToolbar, { address: addressPath }),
    /* @__PURE__ */ jsx(CategoryTabBar, { categories, activeCategory, onSelect: setActiveCategory }),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      display: "flex",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        width: "160px",
        background: "linear-gradient(180deg, #edeff3 0%, #f0f0f0 100%)",
        borderRight: "1px solid #cecece",
        padding: "12px 8px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: "#0a2a70",
            fontFamily: FONT$2,
            marginBottom: "6px",
            borderBottom: "1px solid #7a9bd4",
            paddingBottom: "4px"
          }, children: "Blog Tasks" }),
          /* @__PURE__ */ jsxs("div", { onClick: () => setActiveCategory(ALL_LABEL), style: {
            fontSize: "11px",
            color: "#1a3a90",
            fontFamily: FONT$2,
            lineHeight: "2",
            cursor: "pointer",
            textDecoration: activeCategory === ALL_LABEL ? "none" : "underline",
            fontWeight: activeCategory === ALL_LABEL ? "bold" : "normal"
          }, children: [
            "全部文章 (",
            posts.length,
            ")"
          ] }),
          categories.filter((c) => c !== ALL_LABEL).map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            return /* @__PURE__ */ jsxs("div", { onClick: () => setActiveCategory(cat), style: {
              fontSize: "11px",
              color: "#1a3a90",
              fontFamily: FONT$2,
              lineHeight: "2",
              cursor: "pointer",
              textDecoration: isActive ? "none" : "underline",
              fontWeight: isActive ? "bold" : "normal"
            }, "data-cid": "ligZAd-n", children: [
              cat,
              " (",
              count,
              ")"
            ] }, cat);
          })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: "#0a2a70",
            fontFamily: FONT$2,
            marginBottom: "6px",
            borderBottom: "1px solid #7a9bd4",
            paddingBottom: "4px"
          }, children: "Details" }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "10px",
            color: "#333",
            fontFamily: FONT$2,
            lineHeight: "1.6"
          }, children: isLoading && !dbPosts ? "正在同步..." : activeCategory === ALL_LABEL ? `共 ${posts.length} 篇文章` : `${activeCategory} 分类下共 ${filteredPosts.length} 篇文章` }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "10px",
            color: "#555",
            fontFamily: FONT$2,
            lineHeight: "1.6",
            marginTop: "4px"
          }, children: "点击文章图标即可在新窗口中打开阅读。" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        padding: "16px",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        gap: "16px",
        background: "#fff",
        overflowY: "auto"
      }, children: filteredPosts.length > 0 ? filteredPosts.map((post) => /* @__PURE__ */ jsx(ArticleTile, { icon: post.icon, label: post.title, postId: post.id }, post.id)) : /* @__PURE__ */ jsx("div", { style: {
        color: "#888",
        fontSize: "12px",
        fontFamily: FONT$2,
        width: "100%",
        textAlign: "center",
        paddingTop: "40px"
      }, children: "该分类下暂无文章" }) })
    ] })
  ] });
}
const XP_BLUE = "#5a5a5a";
const XP_DARK_BLUE = "#767676";
const FONT$1 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const markdownComponents = {
  h1: ({
    children
  }) => /* @__PURE__ */ jsx("h1", { style: {
    fontSize: "20px",
    fontWeight: "bold",
    color: XP_DARK_BLUE,
    borderBottom: `2px solid ${XP_BLUE}`,
    paddingBottom: "8px",
    marginBottom: "16px",
    marginTop: "24px"
  }, children }),
  h2: ({
    children
  }) => /* @__PURE__ */ jsx("h2", { style: {
    fontSize: "15px",
    fontWeight: "bold",
    color: XP_BLUE,
    borderBottom: `1px solid #d0d8f0`,
    paddingBottom: "4px",
    marginBottom: "12px",
    marginTop: "20px",
    letterSpacing: "0.5px"
  }, children }),
  h3: ({
    children
  }) => /* @__PURE__ */ jsx("h3", { style: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#1a4fa0",
    marginBottom: "8px",
    marginTop: "16px"
  }, children }),
  p: ({
    children
  }) => /* @__PURE__ */ jsx("p", { style: {
    fontSize: "12px",
    lineHeight: 1.8,
    color: "#333",
    marginBottom: "10px",
    marginTop: 0
  }, children }),
  ul: ({
    children
  }) => /* @__PURE__ */ jsx("ul", { style: {
    fontSize: "12px",
    color: "#333",
    marginBottom: "10px",
    paddingLeft: "20px",
    lineHeight: 1.8
  }, children }),
  ol: ({
    children
  }) => /* @__PURE__ */ jsx("ol", { style: {
    fontSize: "12px",
    color: "#333",
    marginBottom: "10px",
    paddingLeft: "20px",
    lineHeight: 1.8
  }, children }),
  li: ({
    children
  }) => /* @__PURE__ */ jsx("li", { style: {
    marginBottom: "3px"
  }, children }),
  code: ({
    children,
    className
  }) => {
    const isBlock = className?.startsWith("language-");
    return isBlock ? /* @__PURE__ */ jsx("code", { style: {
      display: "block",
      background: "#e8edf8",
      border: "1px solid #c5d0e8",
      borderRadius: "3px",
      padding: "10px 14px",
      fontSize: "11px",
      fontFamily: '"Courier New", monospace',
      color: XP_DARK_BLUE,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      lineHeight: 1.7,
      marginBottom: "10px"
    }, children }) : /* @__PURE__ */ jsx("code", { style: {
      background: "#e8edf8",
      border: "1px solid #c5d0e8",
      borderRadius: "2px",
      padding: "1px 5px",
      fontSize: "11px",
      fontFamily: '"Courier New", monospace',
      color: XP_DARK_BLUE
    }, children });
  },
  pre: ({
    children
  }) => /* @__PURE__ */ jsx("pre", { style: {
    margin: "0 0 10px 0",
    background: "none",
    padding: 0
  }, children }),
  blockquote: ({
    children
  }) => /* @__PURE__ */ jsx("blockquote", { style: {
    borderLeft: `3px solid ${XP_BLUE}`,
    margin: "0 0 10px 0",
    paddingLeft: "12px",
    color: "#555",
    fontStyle: "italic",
    background: "#f0f4fb"
  }, children }),
  hr: () => /* @__PURE__ */ jsx("hr", { style: {
    border: "none",
    borderTop: "1px solid #d0d8f0",
    margin: "16px 0"
  } }),
  strong: ({
    children
  }) => /* @__PURE__ */ jsx("strong", { style: {
    color: XP_DARK_BLUE,
    fontWeight: "bold"
  }, children }),
  em: ({
    children
  }) => /* @__PURE__ */ jsx("em", { style: {
    color: "#444",
    fontStyle: "italic"
  }, children }),
  a: ({
    href,
    children
  }) => /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", style: {
    color: XP_BLUE,
    textDecoration: "underline",
    fontSize: "12px"
  }, children }),
  img: ({
    src,
    alt
  }) => /* @__PURE__ */ jsx("img", { src, alt: alt ?? "", style: {
    maxWidth: "100%",
    borderRadius: "4px",
    border: "1px solid #d0d8f0",
    margin: "8px 0",
    display: "block",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
  } }),
  table: ({
    children
  }) => /* @__PURE__ */ jsx("div", { style: {
    overflowX: "auto",
    marginBottom: "12px"
  }, children: /* @__PURE__ */ jsx("table", { style: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: "11px"
  }, children }) }),
  thead: ({
    children
  }) => /* @__PURE__ */ jsx("thead", { style: {
    background: "#dbe4f5"
  }, children }),
  th: ({
    children
  }) => /* @__PURE__ */ jsx("th", { style: {
    border: "1px solid #c5d0e8",
    padding: "5px 10px",
    textAlign: "left",
    fontWeight: "bold",
    color: XP_DARK_BLUE
  }, children }),
  td: ({
    children
  }) => /* @__PURE__ */ jsx("td", { style: {
    border: "1px solid #d8dfe8",
    padding: "4px 10px",
    color: "#333"
  }, children }),
  tr: ({
    children
  }) => /* @__PURE__ */ jsx("tr", { style: {
    background: "transparent"
  }, children })
};
function OpacityControl({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "absolute",
    top: "38px",
    right: "10px",
    zIndex: 20,
    background: "rgba(236,233,216,0.92)",
    border: "1px solid #aca899",
    borderRadius: "3px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "10px",
    color: "#555",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
  }, "data-cid": "kNUvVxxz", children: [
    /* @__PURE__ */ jsx("span", { style: {
      whiteSpace: "nowrap"
    }, children: "背景透明度" }),
    /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 100, value: Math.round(value * 100), onChange: (e) => onChange(Number(e.target.value) / 100), style: {
      width: "70px",
      cursor: "pointer",
      accentColor: XP_BLUE
    } }),
    /* @__PURE__ */ jsxs("span", { style: {
      minWidth: "28px"
    }, children: [
      Math.round(value * 100),
      "%"
    ] })
  ] });
}
function BlogPostViewer({
  postId
}) {
  const {
    data: dbPosts
  } = useQuery({
    ...trpc.site.getBlogPosts.queryOptions(),
    staleTime: 6e4
  });
  const post = dbPosts?.find((p) => p.id === postId) ?? BLOG_POSTS.find((p) => p.id === postId);
  const [bgOpacity, setBgOpacity] = useState(post?.bgOpacity ?? 1);
  const hasBg = Boolean(post?.backgroundImage);
  if (!post) {
    return /* @__PURE__ */ jsx("div", { style: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      fontFamily: FONT$1
    }, "data-cid": "yd7Gqo9m", children: /* @__PURE__ */ jsx("span", { style: {
      color: "#888",
      fontSize: "12px"
    }, children: "正在加载文章内容..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: FONT$1
  }, "data-cid": "IN8djznK", children: [
    hasBg && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${post.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: bgOpacity,
      zIndex: 0
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 10,
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#ece9d8",
        borderBottom: "1px solid #aca899",
        padding: "4px 10px",
        display: "flex",
        gap: "2px",
        flexShrink: 0,
        alignItems: "center"
      }, children: [
        ["File", "Edit", "View", "Format", "Help"].map((m) => /* @__PURE__ */ jsx("button", { type: "button", style: {
          background: "none",
          border: "none",
          padding: "2px 8px",
          cursor: "pointer",
          fontFamily: FONT$1,
          fontSize: "12px"
        }, children: m }, m)),
        /* @__PURE__ */ jsxs("span", { style: {
          marginLeft: "auto",
          fontSize: "11px",
          color: "#888",
          paddingRight: hasBg ? "100px" : "10px"
        }, children: [
          post.title,
          " — 只读"
        ] })
      ] }),
      hasBg && /* @__PURE__ */ jsx(OpacityControl, { value: bgOpacity, onChange: setBgOpacity }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        overflowY: "auto",
        padding: "12px",
        background: hasBg ? "transparent" : "#f0ede4"
      }, children: /* @__PURE__ */ jsx("div", { style: {
        maxWidth: "680px",
        margin: "0 auto 12px auto",
        padding: "32px 40px",
        // 💡 提示：如需修改覆盖在背景图上方的白色文本块透明度，更改下方 rgba(255,255,255,0) 中的 0 即可（0 代表完全透明，1 代表完全不透明）
        background: hasBg ? "rgba(255,255,255,0)" : "#fff",
        minHeight: "400px",
        boxShadow: "0 0 12px rgba(0,0,0,0.15)",
        backdropFilter: hasBg ? "blur(2px)" : "none"
      }, children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], components: markdownComponents, children: post.content }) }) })
    ] })
  ] });
}
const APP_REGISTRY = {
  myComputer: {
    id: "myComputer",
    title: "My Computer",
    icon: "https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png",
    defaultWidth: 640,
    defaultHeight: 480,
    AppComponent: MyComputerApp
  },
  gamesFolder: {
    id: "gamesFolder",
    title: "Games",
    icon: "https://static.step1.dev/g9nbov/assets/37d3eab6367b.png",
    defaultWidth: 620,
    defaultHeight: 460,
    AppComponent: GamesFolderApp
  },
  aboutme: {
    id: "aboutme",
    title: "About Me",
    icon: "https://static.step1.dev/g9nbov/assets/58721f37b0c0.png",
    defaultWidth: 500,
    defaultHeight: 400,
    AppComponent: AboutMeApp
  },
  contact: {
    id: "contact",
    title: "Contact Me",
    icon: "https://static.step1.dev/g9nbov/assets/e225895b1c27.png",
    defaultWidth: 400,
    defaultHeight: 380,
    AppComponent: ContactApp
  },
  webamp: {
    id: "webamp",
    title: "Winamp",
    icon: "https://static.step1.dev/g9nbov/assets/da0d359368d3.png",
    defaultWidth: 350,
    defaultHeight: 230,
    AppComponent: WinampApp
  },
  msn: {
    id: "msn",
    title: "MSN Messenger",
    icon: "https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png",
    defaultWidth: 340,
    defaultHeight: 500,
    AppComponent: MsnApp
  },
  paint: {
    id: "paint",
    title: "Paint",
    icon: "https://static.step1.dev/g9nbov/assets/035b30cba825.png",
    defaultWidth: 700,
    defaultHeight: 500,
    AppComponent: PaintApp
  },
  resume: {
    id: "resume",
    title: "README.md",
    icon: "https://static.step1.dev/g9nbov/assets/bb426464f8be.ico",
    defaultWidth: 700,
    defaultHeight: 560,
    AppComponent: ResumeApp
  },
  video: {
    id: "video",
    title: "Windows Media Player",
    icon: "https://static.step1.dev/g9nbov/assets/da0d359368d3.png",
    defaultWidth: 680,
    defaultHeight: 520,
    AppComponent: VideoPlayerApp
  },
  portfolio: {
    id: "portfolio",
    title: "My Portfolio",
    icon: "https://static.step1.dev/g9nbov/assets/37d3eab6367b.png",
    defaultWidth: 780,
    defaultHeight: 560,
    AppComponent: PortfolioApp
  },
  imageViewer: {
    id: "imageViewer",
    title: "Image Viewer",
    icon: "/assets/icons/file.png",
    defaultWidth: 640,
    defaultHeight: 500,
    AppComponent: ImageViewerApp
  },
  // ── Blog folder — opens the blog article grid ────────────────────────────
  blog: {
    id: "blog",
    title: "My Blog",
    icon: "https://static.step1.dev/g9nbov/assets/37d3eab6367b.png",
    defaultWidth: 640,
    defaultHeight: 460,
    AppComponent: BlogFolderApp
  }
};
BLOG_POSTS.forEach((post) => {
  APP_REGISTRY[post.id] = {
    id: post.id,
    title: post.title,
    icon: post.icon,
    defaultWidth: 700,
    defaultHeight: 560,
    // Capture post in closure — each article gets its own viewer instance
    AppComponent: () => React.createElement(BlogPostViewer, { postId: post.id })
  };
});
function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}
function WindowContent({
  id
}) {
  const app = APP_REGISTRY[id];
  if (app) {
    const {
      AppComponent
    } = app;
    return /* @__PURE__ */ jsx(AppComponent, { "data-cid": "wFawLFHy" });
  }
  return /* @__PURE__ */ jsx("div", { style: {
    padding: "20px",
    fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
    fontSize: "13px"
  }, "data-cid": "N7SMTt39", children: /* @__PURE__ */ jsxs("p", { children: [
    "Content for ",
    /* @__PURE__ */ jsx("strong", { children: id }),
    " coming soon!"
  ] }) });
}
function HomePage() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [clockTime, setClockTime] = useState(() => formatTime(/* @__PURE__ */ new Date()));
  const [openWindows, setOpenWindows] = useState([]);
  const [activePetIds, setActivePetIds] = useState(/* @__PURE__ */ new Set());
  const zCounter = useRef(100);
  const settings = useSiteSettings();
  const {
    data: dbIcons
  } = useQuery({
    ...trpc.site.getDesktopIcons.queryOptions(),
    staleTime: 6e4
  });
  const iconDefs = dbIcons ?? DESKTOP_ICON_DEFS;
  const {
    data: dbMascots
  } = useQuery({
    ...trpc.site.getMascots.queryOptions(),
    staleTime: 6e4
  });
  const petDefs = dbMascots ?? PET_DEFS;
  const {
    icons,
    selectedId,
    startDrag,
    deselectAll,
    selectIcon
  } = useDesktopIcons(iconDefs);
  const lastClick = useRef(null);
  useEffect(() => {
    const id = setInterval(() => setClockTime(formatTime(/* @__PURE__ */ new Date())), 1e3);
    return () => clearInterval(id);
  }, []);
  const handleStartButtonClick = useCallback((e) => {
    e.stopPropagation();
    setIsStartMenuOpen((prev) => !prev);
  }, []);
  const handleDesktopClick = useCallback(() => {
    if (isStartMenuOpen) setIsStartMenuOpen(false);
    deselectAll();
  }, [isStartMenuOpen, deselectAll]);
  const handleMenuItemClick = useCallback((id) => {
    setIsStartMenuOpen(false);
    openWindow(id);
  }, []);
  const openWindow = useCallback((iconId) => {
    const app = APP_REGISTRY[iconId];
    if (!app) return;
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === iconId);
      if (existing) {
        const maxZ = zCounter.current + 1;
        zCounter.current = maxZ;
        return prev.map((w) => w.id === iconId ? {
          ...w,
          minimized: false,
          zIndex: maxZ
        } : w);
      }
      const offset = prev.length % 8 * 22;
      const newZ = ++zCounter.current;
      const newWin = {
        id: iconId,
        title: app.title,
        icon: app.icon,
        x: 80 + offset,
        y: 40 + offset,
        width: app.defaultWidth,
        height: app.defaultHeight,
        zIndex: newZ,
        minimized: false
      };
      return [...prev, newWin];
    });
  }, []);
  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail;
      if (!detail) return;
      const id = typeof detail === "string" ? detail : detail.id;
      if (!id) return;
      if (!APP_REGISTRY[id] && typeof detail === "object") {
        const {
          title,
          icon
        } = detail;
        APP_REGISTRY[id] = {
          id,
          title,
          icon,
          defaultWidth: 700,
          defaultHeight: 560,
          AppComponent: () => React.createElement(BlogPostViewer, {
            postId: id
          })
        };
      }
      openWindow(id);
    };
    window.addEventListener("xp-open-window", handler);
    return () => window.removeEventListener("xp-open-window", handler);
  }, [openWindow]);
  const handleIconClick = useCallback((iconId) => {
    selectIcon(iconId);
    const now = Date.now();
    if (lastClick.current?.id === iconId && now - lastClick.current.time < 350) {
      lastClick.current = null;
      openWindow(iconId);
    } else {
      lastClick.current = {
        id: iconId,
        time: now
      };
    }
  }, [openWindow, selectIcon]);
  const handleWindowFocus = useCallback((id) => {
    const newZ = ++zCounter.current;
    setOpenWindows((prev) => prev.map((w) => w.id === id ? {
      ...w,
      zIndex: newZ
    } : w));
  }, []);
  const handleWindowClose = useCallback((id) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);
  const handleWindowMinimize = useCallback((id) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? {
      ...w,
      minimized: true
    } : w));
  }, []);
  const handlePositionChange = useCallback((id, x, y) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? {
      ...w,
      x,
      y
    } : w));
  }, []);
  const handleSizeChange = useCallback((id, x, y, width, height) => {
    setOpenWindows((prev) => prev.map((w) => w.id === id ? {
      ...w,
      x,
      y,
      width,
      height
    } : w));
  }, []);
  const handlePetToggle = useCallback((petId) => {
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
  const handlePetDismiss = useCallback((petId) => {
    setActivePetIds((prev) => {
      const next = new Set(prev);
      next.delete(petId);
      return next;
    });
  }, []);
  const handleTaskbarBtn = useCallback((id) => {
    setOpenWindows((prev) => {
      const win = prev.find((w) => w.id === id);
      if (!win) return prev;
      if (win.minimized) {
        const newZ = ++zCounter.current;
        return prev.map((w) => w.id === id ? {
          ...w,
          minimized: false,
          zIndex: newZ
        } : w);
      }
      return prev.map((w) => w.id === id ? {
        ...w,
        minimized: true
      } : w);
    });
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { id: "root", onClick: handleDesktopClick, "data-cid": "Ckvl4ndw", children: [
      /* @__PURE__ */ jsxs("div", { className: "_desktop_1d92e_1", style: {
        backgroundImage: `url("${settings.wallpaperUrl}")`,
        position: "relative"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          position: "absolute",
          inset: "0 0 30px 0",
          overflow: "hidden"
        }, children: icons.map((icon) => /* @__PURE__ */ jsx(DesktopIcon, { id: icon.id, label: icon.label, src: icon.src, x: icon.x, y: icon.y, selected: selectedId === icon.id, onPointerDown: (e) => startDrag(e, icon.id), onClick: () => handleIconClick(icon.id) }, icon.id)) }),
        /* @__PURE__ */ jsx("div", { id: "xp-webamp-host", style: {
          inset: "0px 0px 30px",
          pointerEvents: "none",
          position: "fixed"
        } })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "_taskbar_oqlpl_1", "data-taskbar": "true", children: [
        /* @__PURE__ */ jsxs("button", { "data-start-button": "true", onClick: handleStartButtonClick, style: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
          height: "100%",
          padding: "0 10px 0 6px",
          background: isStartMenuOpen ? "linear-gradient(180deg, #1a6a1a 0%, #228b22 50%, #2ea52e 100%)" : "linear-gradient(180deg, #3cb84a 0%, #28a035 40%, #1e8c2a 100%)",
          border: "none",
          borderRight: "1px solid #1a6e1a",
          borderRadius: "0 12px 12px 0",
          cursor: "pointer",
          boxShadow: isStartMenuOpen ? "inset 1px 1px 3px rgba(0,0,0,0.5)" : "1px 0 3px rgba(0,0,0,0.3)",
          minWidth: "96px",
          fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
          fontSize: "14px",
          fontWeight: "bold",
          fontStyle: "italic",
          // 复刻真实 WinXP Start 按钮的 Trebuchet MS Bold Italic 字样
          color: "#ffffff",
          textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
          letterSpacing: "0.5px",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ jsx("img", { src: settings.logoUrl, alt: "Windows", style: {
            width: "20px",
            height: "20px",
            objectFit: "contain"
          } }),
          /* @__PURE__ */ jsx("span", { children: "start" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "3px",
          padding: "2px 4px",
          overflow: "hidden"
        }, children: openWindows.map((win) => /* @__PURE__ */ jsx(TaskbarWindowBtn, { win, onClick: () => handleTaskbarBtn(win.id) }, win.id)) }),
        /* @__PURE__ */ jsxs("div", { className: "_system-tray_oqlpl_86", children: [
          settings.systemTrayIcons.map((iconUrl, i) => /* @__PURE__ */ jsx("div", { className: "_system-tray-item-wrapper_oqlpl_147", children: /* @__PURE__ */ jsx("div", { className: "_system-tray-item_oqlpl_100", style: {
            backgroundImage: `url("${iconUrl}")`
          } }) }, i)),
          /* @__PURE__ */ jsx("div", { className: "_time_oqlpl_108", children: clockTime })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        backgroundColor: "rgb(0,0,0)",
        inset: "0px",
        opacity: "0",
        pointerEvents: "none",
        position: "fixed",
        transition: "opacity 500ms ease-in-out",
        zIndex: "99998"
      } })
    ] }, "1"),
    openWindows.map((win) => /* @__PURE__ */ jsx(XpWindow, { win, onFocus: handleWindowFocus, onClose: handleWindowClose, onMinimize: handleWindowMinimize, onPositionChange: handlePositionChange, onSizeChange: handleSizeChange, children: /* @__PURE__ */ jsx(WindowContent, { id: win.id }) }, win.id)),
    isStartMenuOpen && /* @__PURE__ */ jsx(StartMenu, { onItemClick: handleMenuItemClick, onLogOff: () => setIsStartMenuOpen(false), onTurnOff: () => setIsStartMenuOpen(false) }),
    /* @__PURE__ */ jsx(RightSidebar, { pets: petDefs, activePetIds, onToggle: handlePetToggle }),
    petDefs.filter((p) => activePetIds.has(p.id)).map((pet) => /* @__PURE__ */ jsx(DesktopPet, { pet, onDismiss: handlePetDismiss }, pet.id)),
    /* @__PURE__ */ jsx("iframe", { height: "1", width: "1", style: {
      border: "none",
      left: "0px",
      position: "absolute",
      top: "0px",
      visibility: "hidden"
    } }, "3"),
    /* @__PURE__ */ jsx("div", { id: "_r_0_", "data-base-ui-portal": "", "data-slot": "toast-portal-anchored", children: /* @__PURE__ */ jsx("div", { tabIndex: -1, role: "region", "aria-live": "polite", "aria-atomic": false, "aria-relevant": "additions text", "aria-label": "Notifications", "data-slot": "toast-viewport-anchored", className: "outline-none" }) }, "5"),
    /* @__PURE__ */ jsx("div", { id: "_r_1_", "data-base-ui-portal": "", "data-slot": "toast-portal", children: /* @__PURE__ */ jsx("div", { tabIndex: -1, role: "region", "aria-live": "polite", "aria-atomic": false, "aria-relevant": "additions text", "aria-label": "Notifications", "data-position": "bottom-right", "data-slot": "toast-viewport", className: "fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)] data-[position*=top]:top-(--toast-inset) data-[position*=bottom]:bottom-(--toast-inset) data-[position*=left]:left-(--toast-inset) data-[position*=right]:right-(--toast-inset) data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2" }) }, "6")
  ] });
}
function DesktopIcon({
  id,
  label,
  src,
  x,
  y,
  selected,
  onPointerDown,
  onClick
}) {
  return /* @__PURE__ */ jsxs("div", { "data-icon-id": id, onPointerDown, onClick: (e) => {
    e.stopPropagation();
    onClick();
  }, style: {
    position: "absolute",
    left: x,
    top: y,
    width: ICON_SIZE,
    height: ICON_SIZE,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "4px",
    padding: "4px",
    borderRadius: "2px",
    boxSizing: "border-box",
    cursor: "default",
    touchAction: "none",
    // Selection highlight: semi-transparent neutral grey overlay
    background: selected ? "var(--xp-selection-overlay)" : "transparent",
    border: selected ? "1px dotted rgba(255,255,255,0.7)" : "1px solid transparent",
    userSelect: "none",
    WebkitUserSelect: "none"
  }, "data-cid": "nDpW-6QJ", children: [
    /* @__PURE__ */ jsx("img", { alt: label, src, draggable: false, style: {
      width: "45px",
      height: "45px",
      objectFit: "contain",
      pointerEvents: "none",
      // Slight blue tint overlay when selected (via CSS filter)
      filter: selected ? "brightness(0.85) saturate(1.2)" : "none"
    } }),
    /* @__PURE__ */ jsx("span", { style: {
      color: "#fff",
      textShadow: "1px 1px 2px rgba(0,0,0,0.9)",
      fontSize: "11px",
      textAlign: "center",
      wordBreak: "break-word",
      maxWidth: "76px",
      padding: "1px 3px",
      lineHeight: "1.2",
      fontFamily: 'MSSS, Tahoma, "Trebuchet MS", Arial, sans-serif',
      // When selected: dark grey background on the label text (XP Classic)
      background: selected ? "var(--xp-selection-label-bg)" : "transparent",
      borderRadius: "1px"
    }, children: label })
  ] });
}
const TASKBAR_FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function TaskbarWindowBtn({
  win,
  onClick
}) {
  const [hovered, setHovered] = useState(false);
  const active = !win.minimized;
  return /* @__PURE__ */ jsxs("button", { onClick: (e) => {
    e.stopPropagation();
    onClick();
  }, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    height: "22px",
    padding: "0 8px",
    minWidth: "120px",
    maxWidth: "160px",
    background: active ? hovered ? "linear-gradient(180deg, #ececec 0%, #c0c0c0 100%)" : "linear-gradient(180deg, #e0e0e0 0%, #b8b8b8 100%)" : hovered ? "linear-gradient(180deg, #d8d8d8 0%, #a8a8a8 100%)" : "linear-gradient(180deg, #c8c8c8 0%, #a0a0a0 100%)",
    border: active ? "1px solid #888" : "1px solid #767676",
    borderRadius: "3px",
    boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.6)" : "none",
    cursor: "pointer",
    fontFamily: TASKBAR_FONT,
    fontSize: "11px",
    fontWeight: active ? "bold" : "normal",
    color: "#000",
    textShadow: "1px 1px 1px rgba(255,255,255,0.4)",
    overflow: "hidden",
    flexShrink: 0
  }, "data-cid": "u-AmVFSs", children: [
    /* @__PURE__ */ jsx("img", { src: win.icon, alt: "", style: {
      width: "14px",
      height: "14px",
      objectFit: "contain",
      flexShrink: 0
    } }),
    /* @__PURE__ */ jsx("span", { style: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }, children: win.title })
  ] });
}
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const LOGO_URL = "https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico";
const EXIT_MS = 700;
function BootStage({
  onDone
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3e3);
    return () => clearTimeout(t);
  }, [onDone]);
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    background: "#000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT
  }, "data-cid": "ZK6SFnct", children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes xpBoot {
          from { transform: translateX(-100px); }
          to   { transform: translateX(280px); }
        }
      ` }),
    /* @__PURE__ */ jsx("img", { src: LOGO_URL, alt: "Windows", style: {
      width: 64,
      height: 64,
      marginBottom: 24,
      imageRendering: "pixelated"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4,
      marginBottom: 6
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold"
      }, children: "MoeKernel" }),
      /* @__PURE__ */ jsx("span", { style: {
        color: "#c0392b",
        fontSize: 28,
        fontStyle: "italic",
        fontWeight: "bold"
      }, children: "xp" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      color: "#ccc",
      fontSize: 14,
      marginBottom: 80
    }, children: "Welcome" }),
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      bottom: "22%",
      width: 280,
      height: 16,
      border: "2px solid #2a2a2a",
      borderRadius: 999,
      background: "#000",
      overflow: "hidden"
    }, children: /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      height: "100%",
      animation: "xpBoot 1.4s linear infinite"
    }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx("div", { style: {
      width: 24,
      height: "80%",
      borderRadius: 999,
      flexShrink: 0,
      background: "linear-gradient(180deg, #ffffff 0%, #d0d0d0 50%, #888 100%)"
    } }, i)) }) })
  ] });
}
function LoginStage({
  onEnter
}) {
  const [hovered, setHovered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [, startTransition] = useTransition();
  const handleLogin = () => {
    new Audio("/startup.mp3").play().catch(() => {
    });
    setExiting(true);
    setTimeout(() => {
      startTransition(() => onEnter());
    }, EXIT_MS);
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT,
    // GPU 加速：提前提升合成层，避免动画触发重绘
    willChange: "transform, opacity",
    // 退出时 scale down + fade out；初始无 transition 防止首帧抖动
    transform: exiting ? "scale(0.94)" : "scale(1)",
    opacity: exiting ? 0 : 1,
    transition: exiting ? `transform ${EXIT_MS}ms ease-in, opacity ${EXIT_MS}ms ease-in` : "none",
    pointerEvents: exiting ? "none" : "auto"
  }, "data-cid": "vmIMor2L", children: [
    /* @__PURE__ */ jsx("div", { style: {
      height: 80,
      background: "#3a3a3a",
      flexShrink: 0
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      background: "linear-gradient(180deg, #c8c8c8 0%, #a8a8a8 50%, #888 100%)",
      display: "flex"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        borderRight: "1px solid #999"
      }, children: [
        /* @__PURE__ */ jsx("img", { src: LOGO_URL, alt: "Windows", style: {
          width: 72,
          height: 72,
          imageRendering: "pixelated",
          marginBottom: 8
        } }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "baseline",
          gap: 4
        }, children: [
          /* @__PURE__ */ jsx("span", { style: {
            color: "#fff",
            fontSize: 32,
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
          }, children: "MoeKernel" }),
          /* @__PURE__ */ jsx("span", { style: {
            color: "#c0392b",
            fontSize: 24,
            fontStyle: "italic",
            fontWeight: "bold"
          }, children: "xp" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          color: "#eee",
          fontSize: 13,
          textShadow: "1px 1px 2px rgba(0,0,0,0.4)"
        }, children: "Software Developer" }),
        /* @__PURE__ */ jsx("div", { style: {
          color: "#ddd",
          fontSize: 12,
          marginTop: 16,
          textShadow: "1px 1px 2px rgba(0,0,0,0.4)"
        }, children: "To begin, click your user name" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }, children: /* @__PURE__ */ jsxs("div", { onClick: handleLogin, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 20px",
        borderRadius: 6,
        cursor: "pointer",
        background: hovered ? "rgba(255,255,255,0.15)" : "transparent",
        transition: "background 0.15s"
      }, children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/avatarSrc.jpg", alt: "NNNullptr", style: {
          width: 80,
          height: 80,
          border: "2px solid #fff",
          borderRadius: 4,
          objectFit: "cover"
        } }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)"
          }, children: "NNNullptr" }),
          /* @__PURE__ */ jsx("div", { style: {
            color: "#ddd",
            fontSize: 12,
            textShadow: "1px 1px 2px rgba(0,0,0,0.4)"
          }, children: "Software Developer" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      height: 60,
      background: "#3a3a3a",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      padding: "0 20px"
    }, children: /* @__PURE__ */ jsxs("button", { onClick: () => window.location.reload(), style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "linear-gradient(180deg, #d0d0d0 0%, #a0a0a0 100%)",
      border: "1px solid #888",
      borderRadius: 4,
      padding: "4px 12px",
      cursor: "pointer",
      fontFamily: FONT,
      fontSize: 12,
      color: "#000"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 16
      }, children: "⟳" }),
      /* @__PURE__ */ jsx("span", { children: "Restart" })
    ] }) })
  ] });
}
function WelcomeGuard({
  children
}) {
  const [stage, setStage] = useState("init");
  useEffect(() => {
    const welcomed = sessionStorage.getItem("xp:welcomed") === "1";
    setStage(welcomed ? "desktop" : "boot");
  }, []);
  const enterDesktop = () => {
    sessionStorage.setItem("xp:welcomed", "1");
    setStage("desktop");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    children,
    stage === "boot" && /* @__PURE__ */ jsx(BootStage, { onDone: () => setStage("login") }),
    stage === "login" && /* @__PURE__ */ jsx(LoginStage, { onEnter: enterDesktop })
  ] });
}
function Home() {
  return /* @__PURE__ */ jsx(WelcomeGuard, { children: /* @__PURE__ */ jsx(HomePage, {}) });
}
export {
  Home as component
};
