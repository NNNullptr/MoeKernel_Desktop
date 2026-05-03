import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import React, { useEffect, useState, useRef, useMemo, useCallback, useTransition } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { t as trpc } from "./router-D8BejgbK.mjs";
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
import "node:crypto";
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
  { id: "chatbox", label: "ChatBox", src: "/assets/icons/MSN.png" },
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
const WALLPAPER_URL = "/assets/wallpapers/wallpaper.jpg";
const WINDOWS_LOGO_URL = "https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico";
const SYSTEM_TRAY_ICONS = [
  "https://static.step1.dev/g9nbov/assets/f41de3abce9a.png",
  "https://static.step1.dev/g9nbov/assets/cff960cc7c15.png",
  "https://static.step1.dev/g9nbov/assets/a52bbbc23e20.png",
  "/assets/icons/tray/icon1.png",
  "/assets/icons/tray/icon2.png"
];
const DEFAULT_CONTACT = [
  { id: "github", name: "GitHub", url: "https://github.com/NNNullptr", iconSrc: "/assets/icons/github.png", emoji: "" },
  { id: "twitter", name: "Twitter", url: "https://x.com/NNNullptr", iconSrc: "/assets/icons/twitter.png", emoji: "" }
];
const DEFAULT_ABOUT = {
  name: "NNNullptr",
  title: "简介一段",
  location: "null",
  avatarSrc: "/assets/avatarSrc.jpg",
  markdownContent: "## 标题\n\n欢迎访问，随便写几句\n"
};
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function useSiteSettings() {
  const { data } = useQuery({
    ...trpc.site.getSettings.queryOptions(),
    staleTime: 0,
    refetchOnWindowFocus: true
  });
  const trayIconsRaw = data?.system_tray_icons;
  const trayIcons = trayIconsRaw ? JSON.parse(trayIconsRaw) : SYSTEM_TRAY_ICONS;
  const rawChatboxOpacity = data?.chatbox_bg_opacity;
  const rawPortfolioOpacity = data?.portfolio_bg_opacity;
  const rawWinampOpacity = data?.winamp_bg_opacity;
  const rawAboutOpacity = data?.about_bg_opacity;
  const rawContactOpacity = data?.contact_bg_opacity;
  return {
    isLoaded: !!data,
    wallpaperUrl: data?.wallpaper_url ?? WALLPAPER_URL,
    logoUrl: data?.windows_logo_url ?? WINDOWS_LOGO_URL,
    systemTrayIcons: trayIcons,
    chatboxBgUrl: data?.chatbox_bg_url ?? "",
    chatboxBgOpacity: rawChatboxOpacity ? parseFloat(rawChatboxOpacity) : 0.15,
    portfolioBgUrl: data?.portfolio_bg_url ?? "",
    portfolioBgOpacity: rawPortfolioOpacity ? parseFloat(rawPortfolioOpacity) : 0.2,
    winampBgUrl: data?.winamp_bg_url ?? "",
    winampBgOpacity: rawWinampOpacity ? parseFloat(rawWinampOpacity) : 0.3,
    aboutBgUrl: data?.about_bg_url ?? "/assets/wallpapers/bg2.jpg",
    aboutBgOpacity: rawAboutOpacity ? parseFloat(rawAboutOpacity) : 0.5,
    contactBgUrl: data?.contact_bg_url ?? "",
    contactBgOpacity: rawContactOpacity ? parseFloat(rawContactOpacity) : 0.15,
    contactLinks: safeParse(data?.contact_content, DEFAULT_CONTACT),
    aboutConfig: safeParse(data?.about_content, DEFAULT_ABOUT),
    // ── Phase 7：站点身份信息 ──────────────────────────────────────────────────
    siteTitle: data?.site_title ?? "NNNullptr",
    siteDescription: data?.site_description ?? "NNNullptr",
    siteAuthor: data?.site_author ?? "NNNullptr",
    siteUsername: data?.site_username ?? "NNNullptr",
    siteAvatarUrl: data?.site_avatar_url ?? "/assets/avatarSrc.jpg",
    siteRole: data?.site_role ?? "Software Developer",
    siteBrand: data?.site_brand ?? "MoeKernel",
    bootSubtitle: data?.boot_subtitle ?? "Welcome"
  };
}
const FONT$e = '"Trebuchet MS", Tahoma, Arial, sans-serif';
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
  const settings = useSiteSettings();
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
    fontFamily: FONT$e,
    fontSize: "13px",
    userSelect: "none",
    border: "1px solid var(--xp-chrome-border-dark)",
    borderBottom: "none"
  }, onClick: (e) => e.stopPropagation(), "data-cid": "v9hh7_vo", children: [
    /* @__PURE__ */ jsxs("div", { style: {
      background: "linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 50%, #a8a8a8 100%)",
      padding: "8px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderBottom: "2px solid #888"
    }, children: [
      /* @__PURE__ */ jsx("img", { src: settings.siteAvatarUrl, alt: settings.siteUsername, style: {
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
      }, children: settings.siteUsername })
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
  }, "data-cid": "fUeBq6sd" });
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
    fontFamily: FONT$e,
    fontWeight: highlighted ? "bold" : "normal"
  }, "data-cid": "TM9-VgG3", children: [
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
    fontFamily: FONT$e
  }, "data-cid": "Mn6Qy-zS", children: [
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
    fontFamily: FONT$e,
    fontWeight: "bold"
  }, "data-cid": "lBxQjZPJ", children: [
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
    fontFamily: FONT$e,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.4)"
  }, "data-cid": "N70q1Kx0", children: [
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
const FONT$d = '"Trebuchet MS", Tahoma, Arial, sans-serif';
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
  return /* @__PURE__ */ jsx("div", { style, onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, "data-cid": "rNcIlbLU" });
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
    fontFamily: FONT$d,
    userSelect: "none"
  }, onPointerDown: () => onFocus(win.id), "data-cid": "2dv6J-Uq", children: [
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
    fontFamily: FONT$d,
    flexShrink: 0,
    padding: 0
  }, "data-cid": "9-WkXLCe", children: label });
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
  }, "data-cid": "xah_-nCL", children: pets.map((pet) => /* @__PURE__ */ jsx(PetButton, { pet, active: activePetIds.has(pet.id), onToggle }, pet.id)) });
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
  }, "data-cid": "LrSBc3kg", children: [
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
  }, "data-cid": "GCt-2GQ1", children: [
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
const FONT$c = '"Trebuchet MS", Tahoma, Arial, sans-serif';
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
    fontFamily: FONT$c,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "-dhsxDIL", children: [
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
      fontFamily: FONT$c,
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
        fontFamily: FONT$c,
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
  }, "data-cid": "VOaV4O2v" });
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
  }, "data-cid": "4WXK3eKI", children: [
    preview,
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "11px",
      fontFamily: FONT$c,
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
  }, "data-cid": "MZbR9em_", children: [
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
          return /* @__PURE__ */ jsx(FileTile, { label: item.name, iconSrc: item.icon ?? "/assets/icons/Games.png", onClick: () => setCurrentPath((p) => [...p, item.name]), "data-cid": "cLt3cvrI" }, item.name);
        }
        const fileType = inferFileType(item.name);
        const url = getPublicUrl([...currentPath, item.name]);
        return /* @__PURE__ */ jsx(FileTile, { label: item.name, imageSrc: fileType === "image" ? url : void 0, videoSrc: fileType === "video" ? url : void 0, iconSrc: fileType === "audio" ? "/assets/icons/Media.png" : item.icon ?? DEFAULT_FILE_ICON, onClick: () => handleFileClick(item), "data-cid": "tX8PWdFf" }, item.name);
      }),
      items.length === 0 && /* @__PURE__ */ jsx("span", { style: {
        color: "#888",
        fontSize: "12px",
        fontFamily: FONT$c
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
const FONT$b = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function ExplorerToolbar$3({
  address,
  canGoBack,
  onBack
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$b,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "QCa0ImsI", children: [
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
      fontFamily: FONT$b,
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
        fontFamily: FONT$b,
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
      "data-cid": "Drbp_TaH",
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
          fontFamily: FONT$b,
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
  }, "data-cid": "h6kv6E1K", children: [
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
          fontFamily: FONT$b
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
          fontFamily: FONT$b,
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
const SKILLS = [{
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
}];
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
const FONT$a = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function AboutMeApp() {
  const {
    aboutConfig,
    aboutBgUrl,
    aboutBgOpacity
  } = useSiteSettings();
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT$a,
    overflow: "hidden",
    background: "linear-gradient(160deg,#f0f0f0 0%,#fafafa 100%)"
  }, "data-cid": "0dACxiIG", children: [
    /* @__PURE__ */ jsx("style", { children: MARKDOWN_STYLES }),
    aboutBgUrl && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      backgroundImage: `url(${aboutBgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: aboutBgOpacity,
      pointerEvents: "none"
    } }),
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
        aboutConfig.avatarSrc ? /* @__PURE__ */ jsx("img", { src: aboutConfig.avatarSrc, alt: "avatar", style: {
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #5a5a5a",
          flexShrink: 0
        } }) : /* @__PURE__ */ jsx("div", { style: {
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,#5a5a5a,#b8b8b8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          flexShrink: 0,
          border: "2px solid #5a5a5a"
        }, children: "👤" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "17px",
            fontWeight: "bold",
            color: "#767676"
          }, children: aboutConfig.name }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "12px",
            color: "#5a5a5a",
            marginTop: "2px"
          }, children: aboutConfig.title }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            color: "#666",
            marginTop: "5px"
          }, children: aboutConfig.location })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        overflowY: "auto",
        padding: "14px 20px 10px"
      }, children: /* @__PURE__ */ jsx("div", { className: "about-md", children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: aboutConfig.markdownContent }) }) }),
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
        }, children: SKILLS.map((skill) => /* @__PURE__ */ jsx("span", { style: {
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
const FONT$9 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function ExplorerToolbar$2({
  address
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$9,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "zXGu5O-U", children: [
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
  }, "data-cid": "BwzRFtGV", children: [
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
    }, children: emoji || "🌐" }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "11px",
      fontFamily: FONT$9,
      color: hov ? "#fff" : "#000",
      textAlign: "center",
      wordBreak: "break-word"
    }, children: name })
  ] });
}
function ContactApp() {
  const {
    contactLinks,
    contactBgUrl,
    contactBgOpacity,
    isLoaded
  } = useSiteSettings();
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }, "data-cid": "1mvwj34M", children: [
    contactBgUrl && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      backgroundImage: `url(${contactBgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: contactBgOpacity,
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsx(ExplorerToolbar$2, { address: "Contact Me" }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        padding: "16px",
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        gap: "20px",
        background: contactBgUrl ? "transparent" : "#fff",
        overflowY: "auto"
      }, children: !isLoaded ? /* @__PURE__ */ jsx("span", { style: {
        fontSize: 12,
        color: "#888",
        fontFamily: FONT$9
      }, children: "加载中…" }) : contactLinks.length === 0 ? /* @__PURE__ */ jsx("span", { style: {
        fontSize: 12,
        color: "#888",
        fontFamily: FONT$9
      }, children: "暂无联系方式" }) : contactLinks.map((item) => /* @__PURE__ */ jsx(ContactTile, { name: item.name, url: item.url, iconSrc: item.iconSrc, emoji: item.emoji }, item.id)) })
    ] })
  ] });
}
const THEME = {
  bgColor: "#ffffffff",
  textColor: "#464646ff",
  subTextColor: "#7a7678ff",
  progressColor: "#ee9cc1ff",
  progressBg: "#f5ecf2ff",
  btnBg: "#fafafa",
  btnBorder: "#fafafa",
  btnText: "#ee9cc1ff",
  btnActiveBg: "#fafafa"
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
  const {
    data: rawTracks = []
  } = useQuery({
    ...trpc.media.list.queryOptions(),
    staleTime: 3e4
  });
  const {
    winampBgUrl,
    winampBgOpacity,
    isLoaded: settingsLoaded
  } = useSiteSettings();
  const [bgInit, setBgInit] = useState(false);
  const [bgImage, setBgImage] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.3);
  useEffect(() => {
    if (settingsLoaded && !bgInit) {
      setBgImage(winampBgUrl);
      setBgOpacity(winampBgOpacity);
      setBgInit(true);
    }
  }, [settingsLoaded, winampBgUrl, winampBgOpacity, bgInit]);
  const dbSongs = rawTracks.filter((t) => t.type === "audio").map((t) => ({
    id: t.id,
    coverSrc: t.cover,
    title: t.title,
    artist: t.artist,
    audioSrc: t.src
  }));
  const [songs] = useState(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === "audio") {
      return [{
        id: "__pending__",
        coverSrc: "/assets/icons/Media.png",
        title: pending.title,
        artist: "Unknown",
        audioSrc: pending.url
      }];
    }
    return [];
  });
  const allSongs = [...songs, ...dbSongs];
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragVal, setDragVal] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const song = allSongs[trackIdx] ?? {
    coverSrc: "",
    title: "No Track",
    artist: "---",
    audioSrc: ""
  };
  const progress = duration > 0 ? current / duration * 100 : 0;
  const autoPlayRef = useRef(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setCurrent(0);
    setDuration(0);
    if (autoPlayRef.current && song.audioSrc) {
      void audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      setPlaying(false);
    }
    autoPlayRef.current = false;
  }, [trackIdx]);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !song.audioSrc) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
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
  const handleEnded = useCallback(() => {
    if (allSongs.length === 0) return;
    autoPlayRef.current = true;
    setTrackIdx((i) => (i + 1) % allSongs.length);
  }, [allSongs.length]);
  const prev = () => {
    if (allSongs.length === 0) return;
    autoPlayRef.current = playing;
    setTrackIdx((i) => (i - 1 + allSongs.length) % allSongs.length);
    setCurrent(0);
  };
  const next = () => {
    if (allSongs.length === 0) return;
    autoPlayRef.current = playing;
    setTrackIdx((i) => (i + 1) % allSongs.length);
    setCurrent(0);
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
    background: THEME.bgColor,
    color: THEME.textColor,
    fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
    userSelect: "none",
    position: "relative",
    overflow: "hidden"
  }, "data-cid": "n-wNPNpy", children: [
    /* @__PURE__ */ jsx("audio", { ref: audioRef, src: song.audioSrc || void 0, onTimeUpdate: () => {
      if (!dragging && audioRef.current) setCurrent(audioRef.current.currentTime);
    }, onLoadedMetadata: () => {
      if (audioRef.current) setDuration(audioRef.current.duration);
    }, onEnded: handleEnded }),
    bgImage && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: bgOpacity,
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
          border: `2px solid ${THEME.btnBorder}`,
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
            color: THEME.textColor,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            letterSpacing: "0.5px"
          }, children: song.title }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "13px",
            color: THEME.subTextColor,
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
              color: THEME.textColor,
              fontFamily: '"Courier New", monospace',
              letterSpacing: "1px"
            }, children: formatTime$1(current) }),
            /* @__PURE__ */ jsxs("span", { style: {
              fontSize: "11px",
              color: THEME.subTextColor
            }, children: [
              "/ ",
              formatTime$1(duration)
            ] }),
            /* @__PURE__ */ jsx("span", { style: {
              marginLeft: "auto",
              fontSize: "10px",
              color: THEME.subTextColor,
              background: THEME.btnBg,
              border: `1px solid ${THEME.btnBorder}`,
              borderRadius: "3px",
              padding: "1px 6px"
            }, children: allSongs.length > 0 ? `${trackIdx + 1} / ${allSongs.length}` : "—" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        padding: "0 16px 10px"
      }, children: /* @__PURE__ */ jsxs("div", { ref: progressRef, onPointerDown: onProgressPointerDown, onPointerMove: onProgressPointerMove, onPointerUp: onProgressPointerUp, style: {
        height: "10px",
        background: THEME.progressBg,
        borderRadius: "5px",
        cursor: "pointer",
        position: "relative",
        border: `1px solid ${THEME.btnBorder}`
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: `${displayProgress}%`,
          height: "100%",
          background: THEME.progressColor,
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
          background: THEME.progressColor,
          border: `2px solid ${THEME.textColor}`,
          boxShadow: "0 0 4px rgba(0,0,0,0.5)"
        } })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px 14px",
        borderTop: `1px solid ${THEME.btnBorder}`
      }, children: [
        /* @__PURE__ */ jsx(CtrlBtn, { title: "上一首", onClick: prev, children: "⏮" }),
        /* @__PURE__ */ jsx(CtrlBtn, { title: playing ? "暂停" : "播放", active: playing, onClick: togglePlay, children: playing ? "⏸" : "▶" }),
        /* @__PURE__ */ jsx(CtrlBtn, { title: "停止", onClick: stop, children: "⏹" }),
        /* @__PURE__ */ jsx(CtrlBtn, { title: "下一首", onClick: next, children: "⏭" })
      ] })
    ] })
  ] });
}
function CtrlBtn({
  children,
  onClick,
  active = false,
  title
}) {
  const [hov, setHov] = useState(false);
  return /* @__PURE__ */ jsx("button", { title, onClick, onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), style: {
    background: active || hov ? THEME.btnActiveBg : THEME.btnBg,
    color: THEME.btnText,
    border: `1px solid ${THEME.btnBorder}`,
    borderRadius: "5px",
    padding: "7px 14px",
    cursor: "pointer",
    fontSize: "16px",
    minWidth: "42px",
    transition: "background 0.15s",
    boxShadow: active ? `0 0 8px ${THEME.btnActiveBg}88` : "none"
  }, "data-cid": "65Bvw6i9", children });
}
const FONT$8 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
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
    fontFamily: FONT$8
  }, "data-cid": "1m8pY-Fi", children: [
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
        fontFamily: FONT$8,
        fontSize: "12px"
      } }),
      /* @__PURE__ */ jsx("button", { onClick: send, style: {
        background: "#5a5a5a",
        color: "#fff",
        border: "none",
        padding: "0 16px",
        cursor: "pointer",
        fontFamily: FONT$8,
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
  }, title: "Paint", "data-cid": "ERlAr4u5" });
}
const readmeContent = "# 🖥️ MoeKernel_Desktop — Windows XP 风格个人桌面系统\n\n> 一个以 Windows XP / Y2K 梦幻核美学为主题的交互式个人桌面系统。  \n> 访客将像操作一台复古 PC 一样浏览你的作品、文章与个人信息。  \n> 所有内容均可通过 **管理后台** 在线编辑，无需触碰代码。\n\n---\n\n## 📸 项目简介\n\n**MoeKernel_Desktop** 是一个运行在浏览器里的 Windows XP 风格个人主页系统，模拟了一套完整的 XP 桌面操作体验：\n\n- 🖱️ 可拖拽的桌面图标（多列自动排布 + 自由拖拽 + 边界钳制）\n- 🪟 多窗口管理（可拖拽、8 方向缩放、最小化/关闭/任务栏）\n- 🟢 Luna 风格开始菜单（程序 + 地点两列布局）\n- 🕐 系统托盘实时时钟\n- 🐾 可拖拽桌宠，浮于所有窗口之上（右侧边栏一键召唤）\n- ✨ Boot → Login 两阶段欢迎动画（每个会话仅播放一次）\n- 🔧 **全栈 CMS 后台**：`/admin` 可视化管理所有内容，DB 驱动，静态配置兜底\n\n---\n\n## 🛠️ 技术栈\n\n| 层级 | 技术 |\n|------|------|\n| 框架 | React 19、TanStack Start（SSR）、TanStack Router |\n| 样式 | Tailwind CSS v4、CSS Variables（OKLCH）、Inline CSS（XP 主题） |\n| 组件库 | shadcn/ui（Radix UI 底层） |\n| Markdown | react-markdown + remark-gfm |\n| 客户端数据 | TanStack React Query v5、tRPC v11 Options Proxy |\n| 服务端 API | tRPC on H3（Nitro）、Node.js 20 |\n| 数据库 | Turso（libSQL / SQLite 云端）、Drizzle ORM |\n| 鉴权 | JWT（jose HS256）、httpOnly Cookie |\n| 构建 | Vite 7、Nitro（node-server preset）、TypeScript 5.9 |\n| 表单验证 | React Hook Form + Zod v4 |\n| 进程管理 | PM2（Cluster 模式） |\n| 部署 | Ubuntu 云服务器 + Nginx 反代 + Cloudflare CDN |\n\n---\n\n## 🪟 内置应用一览\n\n| 应用 | 说明 |\n|------|------|\n| 📁 博客系统 | XP 资源管理器风格，支持分类过滤 Tab + Markdown 阅读器 |\n| 🗂️ 作品集 | 卡片网格 + 动态分类 Tab + 灯箱图片预览 + 技术栈标签 |\n| 🎵 Winamp | 复古 Winamp 2.x UI + HTML5 Audio 真实播放引擎 |\n| 🎬 视频播放器 | B站 iframe 嵌入 + 本地/直链 mp4 双引擎 |\n| 💬 ChatBox 留言板 | 访客公开留言 + 置顶 + IP 限流（60s/次）|\n| 📄 文档窗口 | 通用 Markdown 查看器（Resume 是第一个实例），支持自定义背景图 |\n| 👤 关于我 | 头像 + 个人介绍 + Markdown 正文，后台可配置 |\n| 📬 联系方式 | XP 资源管理器风格，社交链接列表，后台可配置 |\n| 🖥️ 我的电脑 | 静态文件树映射 `public/assets/`，支持图片/视频/音频预览 |\n| 🎮 游戏文件夹 | iframe 沙盒游戏启动器，支持本地 H5 游戏 |\n| 💅 MSN Messenger | Bot 自动回复 + 表情包 |\n| 🎨 MS Paint | 铅笔/橡皮/填充 + 调色板画板 |\n\n---\n\n## ⚙️ 管理后台功能\n\n访问 `/admin` 登录后，可通过可视化界面管理所有内容：\n\n| 后台页面 | 可管理内容 |\n|---------|-----------|\n| 🎨 主题设置 | 壁纸 URL、顶栏 Logo、系统托盘图标列表 |\n| 📝 博客管理 | 文章增删改、Markdown 编辑器（MDEditor）、背景图 |\n| 🖼️ 图标管理 | 桌面图标显示/隐藏、名称/路径/排序内联编辑 |\n| 🐾 桌宠管理 | 桌宠增删改、精灵图/图标预览、尺寸调节 |\n| 💬 留言板 | 删除留言、置顶/取消置顶、背景外观设置 |\n| 🗂️ 作品集 | 条目增删改（卡片弹窗）、背景外观设置 |\n| 🎵 媒体库 | 音频/视频/Bilibili 曲目增删改排序 |\n| 📬 联系设置 | 社交链接列表增删改（图标/名称/URL） |\n| 👤 关于设置 | 基本信息 + Markdown 正文编辑 |\n| 📄 文档管理 | 文档窗口增删改（标题/内容/背景图/排序/可见性） |\n\n---\n\n## 📁 项目目录结构\n\n```\nMoeKernel/\n├── public/                         # 静态资源（直接替换你的素材）\n│   └── assets/\n│       ├── wallpapers/             # 桌面壁纸 (.webp / .jpg)\n│       ├── icons/                  # 应用图标 (.png / .ico)\n│       │   └── tray/               # 系统托盘小图标 (16–20px)\n│       └── pets/\n│           ├── avatars/            # 桌宠侧栏按钮图标 (推荐 22px)\n│           └── sprites/            # 桌宠本体图像 (推荐 .gif 动图)\n│\n├── src/\n│   ├── client/                     # 前端代码\n│   │   ├── apps/                   # 各桌面应用（每个应用独立文件夹）\n│   │   │   ├── registry.ts         # 应用注册中心（APP_REGISTRY）\n│   │   │   ├── blog/               # 博客系统（文件夹视图 + Markdown 阅读器）\n│   │   │   ├── resume/             # 通用 Markdown 文档查看器\n│   │   │   ├── portfolio/          # 作品集（卡片 + 灯箱）\n│   │   │   ├── winamp/             # Winamp 音乐播放器\n│   │   │   ├── video-player/       # 视频播放器（B站/mp4 双引擎）\n│   │   │   ├── chatbox/            # ChatBox 留言板\n│   │   │   ├── about-me/           # 关于我\n│   │   │   ├── contact/            # 联系方式\n│   │   │   ├── my-computer/        # 我的电脑（文件树导航）\n│   │   │   ├── games-folder/       # 游戏文件夹\n│   │   │   ├── msn/                # MSN Messenger\n│   │   │   └── paint/              # MS Paint 画板\n│   │   │\n│   │   ├── config/                 # 静态兜底配置（DB 无数据时使用）\n│   │   │   ├── theme.config.ts     # 壁纸、Logo、托盘图标\n│   │   │   ├── icons.config.ts     # 桌面图标列表\n│   │   │   ├── pets.config.ts      # 桌宠列表\n│   │   │   └── blog.config.ts      # 博客文章列表（含 .md 静态导入）\n│   │   │\n│   │   ├── hooks/                  # 自定义 React Hooks\n│   │   │   ├── use-desktop-icons.ts  # 图标拖拽、选中、自动排布\n│   │   │   ├── use-site-config.ts    # DB 设置读取（含静态 Fallback）\n│   │   │   └── use-window-drag.ts    # 窗口拖拽\n│   │   │\n│   │   └── views/                  # 页面级视图组件\n│   │       ├── home.tsx            # 🖥️ XP 桌面主组件（内核）\n│   │       ├── xp-window.tsx       # 可拖拽/可缩放 XP 窗口\n│   │       ├── start-menu.tsx      # 开始菜单（Luna 风格）\n│   │       ├── welcome-guard.tsx   # Boot → Login 欢迎动画\n│   │       ├── right-sidebar.tsx   # 右侧桌宠启动栏\n│   │       └── desktop-pet.tsx     # 可拖拽桌宠\n│   │\n│   ├── routes/                     # 文件路由（路径即 URL）\n│   │   ├── __root.tsx              # 根布局（HTML Shell）\n│   │   ├── index.tsx               # / → XP 桌面主页\n│   │   ├── api/trpc.$.ts           # tRPC HTTP 端点（catch-all）\n│   │   └── admin/                  # 管理后台路由\n│   │       ├── login.tsx           # /admin/login 登录页\n│   │       ├── _layout.tsx         # 后台布局（JWT 鉴权守卫）\n│   │       └── _layout/            # 后台各功能页\n│   │           ├── index.tsx       # /admin 仪表盘\n│   │           ├── theme.tsx       # /admin/theme\n│   │           ├── blog/           # /admin/blog（列表 + 新建 + 编辑）\n│   │           ├── icons.tsx       # /admin/icons\n│   │           ├── mascots.tsx     # /admin/mascots\n│   │           ├── chatbox.tsx     # /admin/chatbox\n│   │           ├── portfolio.tsx   # /admin/portfolio\n│   │           ├── media.tsx       # /admin/media\n│   │           ├── contact.tsx     # /admin/contact\n│   │           ├── about.tsx       # /admin/about\n│   │           └── documents.tsx   # /admin/documents\n│   │\n│   └── server/                     # 服务端代码\n│       ├── env.ts                  # 环境变量校验（启动时 fail-fast）\n│       ├── db/\n│       │   ├── client.ts           # Drizzle + Turso HTTP 连接\n│       │   ├── schema.ts           # 7 张数据表定义\n│       │   └── seed.ts             # 初始数据填充脚本\n│       └── trpc/\n│           ├── router.ts           # 主路由（注册所有子路由）\n│           ├── procedure.ts        # publicProcedure / adminProcedure\n│           └── routes/             # 各功能路由\n│               ├── site.ts         # 公开读取接口\n│               ├── auth.ts         # 登录 / 登出 / 验证\n│               ├── settings.ts     # 站点设置 CRUD\n│               ├── blog.ts         # 博客文章 CRUD\n│               ├── documents.ts    # 文档窗口 CRUD\n│               ├── chatbox.ts      # 留言板 CRUD\n│               ├── portfolio.ts    # 作品集 CRUD\n│               └── media.ts        # 媒体库 CRUD\n│\n├── ecosystem.config.cjs            # PM2 进程管理配置\n├── drizzle.config.ts               # Drizzle Kit 配置\n└── package.json\n```\n\n---\n\n## 🏗️ 核心架构\n\n### 微内核 + 插件层 + CMS 三层架构\n\n```\n┌─────────────────────────────────────────────────────────┐\n│              Turso 云端数据库（7 张表）                    │\n│  site_settings / blog_posts / desktop_icons / mascots   │\n│  chat_messages / portfolio_items / media_tracks         │\n│  documents                                              │\n└───────────────────────────┬─────────────────────────────┘\n                            │ tRPC + Drizzle ORM\n┌───────────────────────────▼─────────────────────────────┐\n│                  tRPC 服务端路由层                        │\n│  site（公开读）/ auth / settings / blog / documents      │\n│  chatbox / portfolio / media                            │\n└────────────────┬────────────────────────────────────────┘\n                 │ TanStack Query + tRPC Client\n     ┌───────────┴───────────┐\n     │                       │\n┌────▼────────────┐   ┌──────▼────────────────────────────┐\n│  /admin 后台    │   │    / 前台（XP 桌面）               │\n│  10 个管理页面  │   │  内核层 home.tsx                   │\n│  可视化 CRUD    │   │  窗口管理·图标拖拽·任务栏·桌宠系统 │\n└─────────────────┘   └──────────────┬─────────────────────┘\n                                     │ APP_REGISTRY 查找\n                          ┌──────────▼──────────────────────┐\n                          │    注册中心 registry.ts          │\n                          │  静态 App + 动态文档窗口          │\n                          └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┘\n                            博客 简历 作品 音乐 视频 留言 ...\n```\n\n### 数据库表结构\n\n| 表名 | 用途 |\n|------|------|\n| `site_settings` | 壁纸/Logo/托盘/About/Contact 等所有 key-value 配置 |\n| `blog_posts` | 博客文章（含 Markdown 正文） |\n| `desktop_icons` | 桌面图标列表（可隐藏/排序） |\n| `mascots` | 桌宠列表（图标/精灵图/尺寸） |\n| `chat_messages` | ChatBox 留言（含 IP 哈希限流） |\n| `portfolio_items` | 作品集条目 |\n| `media_tracks` | 音频/视频/Bilibili 媒体库 |\n| `documents` | 通用文档窗口（Markdown + 背景图） |\n\n---\n\n## 🚀 部署教程（新手向）\n\n### 前置条件\n\n在开始之前，确保你的机器上已安装：\n\n- **Node.js 20+**：[https://nodejs.org](https://nodejs.org)（选 LTS 版本）\n- **pnpm**：安装好 Node.js 后执行 `npm install -g pnpm`\n- **Git**：[https://git-scm.com](https://git-scm.com)\n\n验证安装：\n\n```bash\nnode -v    # 应输出 v20.x.x 或更高\npnpm -v    # 应输出 9.x.x 或更高\ngit --version\n```\n\n---\n\n### 第一步：获取代码\n\n```bash\ngit clone https://github.com/你的用户名/MoeKernel_Desktop.git\ncd MoeKernel_Desktop\npnpm install\n```\n\n---\n\n### 第二步：创建 Turso 数据库\n\nTurso 是本项目使用的云端 SQLite 数据库，有免费套餐，无需信用卡。\n\n**1. 注册账号**\n\n前往 [https://turso.tech](https://turso.tech) 注册（支持 GitHub 一键登录）。\n\n**2. 安装 Turso CLI**\n\n```bash\n# macOS / Linux\ncurl -sSfL https://get.tur.so/install.sh | bash\n\n# Windows（PowerShell）\nirm https://get.tur.so/install.ps1 | iex\n```\n\n**3. 登录并创建数据库**\n\n```bash\nturso auth login          # 打开浏览器完成授权\n\nturso db create moekernel # 创建数据库（名字可以自定义）\n```\n\n**4. 获取数据库地址和 Token**\n\n```bash\nturso db show moekernel   # 复制 URL 字段（格式：libsql://...turso.io）\nturso db tokens create moekernel   # 复制输出的 Token 字符串\n```\n\n> 💡 这两个值分别对应环境变量 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN`，妥善保存。\n\n---\n\n### 第三步：配置环境变量\n\n在项目根目录创建 `.env` 文件：\n\n```bash\n# macOS / Linux\ncp .env.example .env   # 如果有示例文件\n\n# 或直接新建\ntouch .env\n```\n\n用文本编辑器打开 `.env`，填入以下内容：\n\n```env\n# ── 数据库（必填）──────────────────────────────\nTURSO_DATABASE_URL=libsql://你的数据库名.turso.io\nTURSO_AUTH_TOKEN=你从上一步复制的Token\n\n# ── 后台管理密码（必填）───────────────────────\n# 这是登录 /admin 时使用的密码，自行设置一个强密码\nADMIN_PASSWORD=你的管理后台密码\n\n# ── JWT 签名密钥（必填）───────────────────────\n# 用于签发管理员登录 Cookie，必须 ≥ 32 个字符的随机字符串\n# 生成示例（在终端运行）：node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"\nJWT_SECRET=至少32位的随机字符串\n\n# ── 可选配置 ──────────────────────────────────\n# 生产环境设为 production（影响 Cookie Secure 属性）\nNODE_ENV=development\n\n# 跨子域名共享 Cookie 时填写，如 .yoursite.com；单域名留空\n# COOKIE_DOMAIN=\n```\n\n> ⚠️ **`.env` 文件绝对不要提交到 Git！** 确认 `.gitignore` 里包含 `.env`。\n\n---\n\n### 第四步：初始化数据库表结构\n\n```bash\npnpm db:push\n```\n\n这条命令会把 `src/server/db/schema.ts` 中定义的 8 张表推送到 Turso 云端。  \n成功后在终端看到各表名即完成。\n\n**（可选）填充初始数据：**\n\n```bash\npnpm db:seed\n```\n\n这会把 `src/client/config/` 里的静态配置数据（图标/桌宠/博客文章等）写入数据库作为初始内容。\n\n---\n\n### 第五步：本地开发验证\n\n```bash\npnpm dev\n```\n\n打开浏览器访问：\n- `http://localhost:3000` — XP 桌面前台\n- `http://localhost:3000/admin` — 管理后台（用 `.env` 中的 `ADMIN_PASSWORD` 登录）\n\n确认以下功能正常：\n- [x] 桌面正常渲染，图标可双击打开窗口\n- [x] `/admin/login` 输入密码后跳转后台\n- [x] 后台保存内容后，前台刷新显示新内容\n\n---\n\n### 第六步：构建生产版本\n\n```bash\npnpm build\n```\n\n构建产物在 `.output/` 目录下：\n- `.output/server/index.mjs` — 服务端入口\n- `.output/public/` — 静态资源文件\n\n---\n\n### 第七步：服务器部署（Ubuntu + PM2 + Nginx）\n\n> 以下步骤需要一台运行 Ubuntu 20.04+ 的云服务器（阿里云/腾讯云/Vultr 等均可）。\n\n#### 7.1 服务器安装 Node.js\n\n```bash\n# 使用 NodeSource 安装 Node.js 20\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt-get install -y nodejs\n\n# 安装 pnpm 和 PM2\nnpm install -g pnpm pm2\n```\n\n#### 7.2 上传代码到服务器\n\n**方式 A：Git 拉取（推荐）**\n\n```bash\n# 在服务器上\ngit clone https://github.com/你的用户名/MoeKernel_Desktop.git /www/moekernel\ncd /www/moekernel\npnpm install\n```\n\n**方式 B：通过宝塔面板上传**\n\n在宝塔文件管理器上传项目压缩包，解压到 `/www/moekernel/`，然后在终端执行 `pnpm install`。\n\n#### 7.3 在服务器上创建 .env 文件\n\n```bash\ncd /www/moekernel\nnano .env   # 或 vim .env\n```\n\n填入与本地相同的环境变量，但修改以下值：\n\n```env\nNODE_ENV=production\nTURSO_DATABASE_URL=libsql://你的数据库名.turso.io\nTURSO_AUTH_TOKEN=你的Token\nADMIN_PASSWORD=你的管理密码\nJWT_SECRET=至少32位随机字符串\n```\n\n#### 7.4 构建并启动服务\n\n```bash\ncd /www/moekernel\npnpm build              # 构建生产版本\nmkdir -p logs           # PM2 日志目录\npm2 start ecosystem.config.cjs   # 启动服务（监听 3000 端口）\npm2 save                # 保存进程列表\npm2 startup             # 生成开机自启命令（按提示执行输出的命令）\n```\n\n验证是否启动成功：\n\n```bash\npm2 status              # 应看到 moekernel 状态为 online\ncurl http://localhost:3000   # 应返回 HTML 页面\n```\n\n#### 7.5 配置 Nginx 反向代理\n\n```bash\nsudo nano /etc/nginx/sites-available/moekernel\n```\n\n粘贴以下配置（将 `your-domain.com` 替换为你的域名）：\n\n```nginx\nserver {\n    listen 80;\n    server_name your-domain.com www.your-domain.com;\n\n    location / {\n        proxy_pass         http://127.0.0.1:3000;\n        proxy_http_version 1.1;\n        proxy_set_header   Upgrade $http_upgrade;\n        proxy_set_header   Connection 'upgrade';\n        proxy_set_header   Host $host;\n        proxy_set_header   X-Real-IP $remote_addr;\n        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header   X-Forwarded-Proto $scheme;\n        proxy_cache_bypass $http_upgrade;\n    }\n}\n```\n\n启用配置：\n\n```bash\nsudo ln -s /etc/nginx/sites-available/moekernel /etc/nginx/sites-enabled/\nsudo nginx -t              # 检查配置语法\nsudo systemctl reload nginx\n```\n\n> 🔔 **宝塔面板用户**：在「网站」→「添加站点」→「反向代理」中填入目标 URL `http://127.0.0.1:3000` 即可，无需手动编辑 nginx.conf。\n\n---\n\n### 第八步：配置 Cloudflare（可选但推荐）\n\n使用 Cloudflare 可获得免费 CDN、DDoS 防护和自动 HTTPS。\n\n#### 8.1 添加域名到 Cloudflare\n\n1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)\n2. 点击「Add a Site」，输入你的域名\n3. 按提示将域名的 NS 服务器改为 Cloudflare 提供的地址（在域名注册商处修改）\n\n#### 8.2 关键设置（必须正确，否则登录 Cookie 会失效）\n\n**SSL/TLS 加密模式：**  \n进入「SSL/TLS」→「Overview」→ 选择 **Full (Strict)**  \n⚠️ 不能选 Flexible，否则 HTTPS 请求到服务器时变成 HTTP，导致 `Secure Cookie` 无法写入，管理员无法登录。\n\n**API 缓存绕过（必须设置）：**  \n进入「Rules」→「Page Rules」→「Create Page Rule」：\n- URL 匹配：`your-domain.com/api/trpc/*`\n- 设置：Cache Level → **Bypass**\n\n这样 tRPC API 请求不会被 Cloudflare 缓存，保证数据实时性。\n\n#### 8.3 申请 SSL 证书（若不用 Cloudflare）\n\n如果不使用 Cloudflare，可用 Certbot 申请免费 Let's Encrypt 证书：\n\n```bash\nsudo apt install certbot python3-certbot-nginx\nsudo certbot --nginx -d your-domain.com -d www.your-domain.com\n# 按提示操作，自动修改 Nginx 配置并续期\n```\n\n---\n\n### 第九步：首次登录后台配置内容\n\n1. 浏览器访问 `https://your-domain.com/admin`\n2. 输入 `.env` 中设置的 `ADMIN_PASSWORD` 登录\n3. 按需配置各项内容：\n   - **主题设置**：替换壁纸 URL、Logo 图片、托盘图标\n   - **文档管理**：创建 ID 为 `resume` 的文档，填入你的简历 Markdown 内容\n   - **博客管理**：添加你的第一篇博客文章\n   - **关于设置**：填写个人信息和 Markdown 简介\n   - **联系设置**：配置你的社交媒体链接\n\n---\n\n### 更新部署\n\n当代码有更新时，在服务器上执行：\n\n```bash\ncd /www/moekernel\ngit pull\npnpm install           # 如果依赖有变化\npnpm build             # 重新构建\npm2 reload moekernel   # 热重载（零停机）\n```\n\n如果数据库 schema 有变更（新增表/字段）：\n\n```bash\npnpm db:push           # 在重启前执行\n```\n\n---\n\n## 🖥️ WelcomeGuard 欢迎动画\n\n文件：`src/client/views/welcome-guard.tsx`\n\n首次进入时自动播放 Boot → Login 两阶段动画，同一会话内刷新不重复播放。\n\n| 需要修改的内容 | 搜索关键词 |\n|--------------|-----------|\n| Boot 用户名大字 | `MoeKernel`（BootStage 内） |\n| Boot 副标题 | `>Welcome<` |\n| Login 左侧用户名 | `MoeKernel`（LoginStage 左栏） |\n| Login 右侧头像图片 | `src=\"/assets/avatarSrc.jpg\"` |\n| Login 右侧用户名 | `NNNullptr`（LoginStage 右栏） |\n\n**调试命令（浏览器 Console）：**\n\n```js\n// 重新播放欢迎流程\nsessionStorage.removeItem('xp:welcomed'); location.reload();\n\n// 跳过欢迎流程\nsessionStorage.setItem('xp:welcomed', '1'); location.reload();\n```\n\n---\n\n## ✏️ 如何添加新桌面应用\n\n只需 3 步，完全不触碰内核代码：\n\n**第一步：** 创建应用组件\n\n```tsx\n// src/client/apps/your-app/index.tsx\nexport function YourApp() {\n  return <div>你的应用内容</div>;\n}\n```\n\n**第二步：** 注册到应用中心（`src/client/apps/registry.ts`）\n\n```typescript\nimport { YourApp } from './your-app';\n\nexport const APP_REGISTRY = {\n  // ...现有应用\n  yourApp: {\n    id: 'yourApp',\n    title: '你的应用',\n    icon: '/assets/icons/your-icon.png',\n    defaultWidth: 500,\n    defaultHeight: 400,\n    AppComponent: YourApp,\n  },\n};\n```\n\n**第三步：** 在管理后台「图标管理」添加桌面图标，或直接编辑 `src/client/config/icons.config.ts`：\n\n```typescript\n{ id: 'yourApp', label: '你的应用', src: '/assets/icons/your-icon.png' }\n```\n\n完成！应用自动出现在桌面，双击图标即可打开。\n\n---\n\n## 🗂️ 路由映射\n\n| URL 路径 | 说明 |\n|----------|------|\n| `/` | XP 桌面主页面 |\n| `/api/trpc/*` | tRPC API 端点 |\n| `/admin/login` | 管理后台登录页 |\n| `/admin` | 管理后台仪表盘 |\n| `/admin/theme` | 主题设置 |\n| `/admin/blog` | 博客管理 |\n| `/admin/icons` | 图标管理 |\n| `/admin/mascots` | 桌宠管理 |\n| `/admin/chatbox` | 留言板管理 |\n| `/admin/portfolio` | 作品集管理 |\n| `/admin/media` | 媒体库管理 |\n| `/admin/contact` | 联系设置 |\n| `/admin/about` | 关于设置 |\n| `/admin/documents` | 文档窗口管理 |\n\n---\n\n## 🔧 常用开发命令\n\n```bash\npnpm dev          # 启动开发服务器（localhost:3000）\npnpm build        # 构建生产版本\npnpm lint         # TypeScript 类型检查\n\npnpm db:push      # 推送 schema 变更到 Turso（建表/加字段）\npnpm db:seed      # 填充初始数据到数据库\npnpm db:studio    # 打开 Drizzle Studio（本地 DB 可视化界面）\n```\n\n---\n\n## 📂 静态资源目录\n\n| 目录 | 用途 | 推荐格式 |\n|------|------|---------|\n| `public/assets/wallpapers/` | 桌面壁纸 | `.webp`、`.jpg` |\n| `public/assets/icons/` | 应用 & 快捷方式图标 | `.png`、`.ico` |\n| `public/assets/icons/tray/` | 系统托盘小图标 | `.png`（16–20px）|\n| `public/assets/pets/avatars/` | 桌宠侧栏按钮图标 | `.png`（22px）|\n| `public/assets/pets/sprites/` | 桌宠本体图像 | `.gif`（动图）|\n\n---\n\n## 📝 版本历史\n\n| 版本 | 主要内容 |\n|------|---------|\n| V1–V5 | 开始菜单、多窗口管理、桌面图标拖拽、桌宠系统基础框架 |\n| V6–V9 | 8 方向窗口缩放、10 个内置应用、配置文件架构规范化 |\n| V10 | **微内核+插件层**架构重构，统一应用注册中心 |\n| V11–V17 | 右侧边栏 XP Classic 风格重构、各应用配置驱动重构 |\n| V18–V21 | 视频播放器双引擎、Games Folder 配置化、My Computer 文件预览 |\n| V22–V23 | **博客系统**：XP 资源管理器文件夹 + Markdown 阅读器 + 分类 Tab |\n| V24–V25 | 最大化窗口修复、**WelcomeGuard** Boot→Login 欢迎动画 |\n| V26–V30 | My Computer 文件树导航、Start 菜单双侧联动、正式命名 MoeKernel_Desktop |\n| **Full-Stack** | **全栈化改造**：Turso 数据库 + tRPC 服务端 + Drizzle ORM + JWT 鉴权 |\n| Phase 0–1 | 基础设施搭建：8 张表建表、tRPC 数据层（site/auth/settings/blog 路由） |\n| Phase 2 | 前端组件数据源切换至 DB，静态配置退为 Fallback |\n| Phase 3 | 管理后台 UI：10 个后台页面，完整 CRUD |\n| Phase 4 | **ChatBox 留言板**：独立数据表 + 皮肤系统 + IP 限流 |\n| Phase 5 | **Portfolio / Media / Contact / About** 全栈化 |\n| Phase 6 | **通用文档窗口管理系统**：documents 表 + 动态桌面图标 + 后台编辑器 |\n";
const FALLBACK = {
  content: readmeContent,
  bgUrl: "",
  bgOpacity: 0.12,
  title: "README.md"
};
const FONT$7 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const XP_BLUE$1 = "#5a5a5a";
const XP_DARK_BLUE$1 = "#767676";
const markdownComponents$1 = {
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
  hr: () => /* @__PURE__ */ jsx("hr", { style: {
    border: "none",
    borderTop: `1px solid #d0d8f0`,
    margin: "16px 0"
  } }),
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
  a: ({
    href,
    children
  }) => /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noopener noreferrer", style: {
    color: XP_BLUE$1,
    textDecoration: "underline",
    fontSize: "12px"
  }, children }),
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
function ResumeApp({
  documentId
}) {
  const {
    data: docs = []
  } = useQuery({
    ...trpc.site.getDocuments.queryOptions(),
    staleTime: 0,
    refetchOnMount: "always"
  });
  const doc = docs.find((d) => d.id === documentId);
  const isFound = doc !== void 0;
  const content = isFound ? doc.content : FALLBACK.content;
  const bgUrl = isFound ? doc.bgUrl : FALLBACK.bgUrl;
  const bgOpacity = isFound ? doc.bgOpacity : FALLBACK.bgOpacity;
  const title = isFound ? doc.title : FALLBACK.title;
  const hasBg = Boolean(bgUrl);
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: FONT$7
  }, "data-cid": "GGG7IaOS", children: [
    hasBg && /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${bgUrl})`,
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
          fontFamily: FONT$7,
          fontSize: "12px"
        }, children: m }, m)),
        /* @__PURE__ */ jsxs("span", { style: {
          marginLeft: "auto",
          fontSize: "11px",
          color: "#888"
        }, children: [
          title,
          " — 只读"
        ] })
      ] }),
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
      }, children: /* @__PURE__ */ jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], components: markdownComponents$1, children: content }) }) })
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
const FONT$6 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function VideoPlayerApp() {
  const {
    data: rawTracks = []
  } = useQuery({
    ...trpc.media.list.queryOptions(),
    staleTime: 3e4
  });
  const dbVideos = rawTracks.filter((t) => t.type === "video" || t.type === "bilibili").map((t) => {
    if (t.type === "bilibili") {
      return {
        type: "bilibili",
        title: t.title,
        bvid: t.bvid ?? "",
        cover: t.cover
      };
    }
    return {
      type: "mp4",
      title: t.title,
      src: t.src,
      cover: t.cover
    };
  });
  const [pendingVideo] = useState(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === "video") {
      return {
        type: "mp4",
        title: pending.title,
        src: pending.url,
        cover: ""
      };
    }
    return null;
  });
  const videoList = pendingVideo ? [pendingVideo, ...dbVideos] : dbVideos;
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
  }, [currentIndex, isStopped, isMp4]);
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
    const video = videoRef.current;
    if (!isMp4 || !video) return;
    if (!isFinite(video.duration) || video.duration === 0) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };
  const handleSeekForward = () => {
    const video = videoRef.current;
    if (!isMp4 || !video) return;
    if (!isFinite(video.duration) || video.duration === 0) return;
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
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
    fontFamily: FONT$6,
    userSelect: "none"
  }, "data-cid": "rTOFZJQD", children: [
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
      fontFamily: FONT$6,
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
            fontFamily: FONT$6
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
        fontFamily: FONT$6
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
        fontFamily: FONT$6
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
        fontFamily: FONT$6
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
        }, "data-cid": "N7bw8ig-", children: iconStr }, id);
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
        fontFamily: FONT$6
      }, children: isStopped ? "已停止" : isPlaying ? `▶ 正在播放 — ${currentVideo?.title ?? ""}` : `⏸ 已暂停 — ${currentVideo?.title ?? ""}` }),
      /* @__PURE__ */ jsxs("span", { style: {
        fontSize: "10px",
        color: VIDEO_CONFIG.statusBarText,
        fontFamily: FONT$6
      }, children: [
        isBilibili ? "Bilibili Player" : "HTML5 Player",
        " | HD"
      ] })
    ] })
  ] });
}
const FONT$5 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const SIDEBAR = {
  background: "linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)",
  borderColor: "#c8c8c8",
  titleColor: "#767676",
  linkColor: "#0033aa",
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
  detailsTitle: "Details",
  owner: "Portfolio Owner"
};
function Lightbox({
  item,
  onClose
}) {
  const tags = item.techStack.split(",").map((t) => t.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    background: "rgba(0,0,0,0.82)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT$5,
    padding: "24px"
  }, onClick: onClose, "data-cid": "33SbtfrO", children: [
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
      fontFamily: FONT$5,
      lineHeight: 1.4
    }, children: "✕ Close" }),
    item.imageUrl && /* @__PURE__ */ jsx("div", { style: {
      maxWidth: "80%",
      maxHeight: "60%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px"
    }, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.title, style: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      borderRadius: "3px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      border: "2px solid rgba(255,255,255,0.15)"
    } }) }),
    /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      maxWidth: "560px"
    }, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("div", { style: {
        color: "#fff",
        fontSize: "15px",
        fontWeight: "bold",
        marginBottom: "6px"
      }, children: item.title }),
      item.category && /* @__PURE__ */ jsx("div", { style: {
        display: "inline-block",
        background: "rgba(49,106,197,0.5)",
        border: "1px solid rgba(100,160,255,0.4)",
        borderRadius: "3px",
        padding: "1px 8px",
        fontSize: "11px",
        color: "#9ec8ff",
        marginBottom: "10px"
      }, children: item.category }),
      item.description && /* @__PURE__ */ jsx("div", { style: {
        color: "#bcd0f0",
        fontSize: "12px",
        lineHeight: 1.7,
        marginBottom: "10px"
      }, children: item.description }),
      tags.length > 0 && /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "center",
        marginBottom: 12
      }, children: tags.map((t) => /* @__PURE__ */ jsx("span", { style: {
        fontSize: 10,
        color: "#c8deff",
        background: "rgba(40,80,160,0.55)",
        border: "1px solid rgba(100,160,255,0.35)",
        borderRadius: 3,
        padding: "1px 7px"
      }, children: t }, t)) }),
      item.link && /* @__PURE__ */ jsx("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), style: {
        display: "inline-block",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: 3,
        color: "#fff",
        fontSize: 11,
        padding: "3px 14px",
        textDecoration: "none",
        fontFamily: FONT$5
      }, children: "🔗 查看项目" })
    ] })
  ] });
}
function ExplorerToolbar$1() {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$5,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "GK95gqIq", children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      gap: "2px",
      padding: "2px 4px",
      borderBottom: "1px solid #aca899",
      alignItems: "center"
    }, children: ["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => /* @__PURE__ */ jsx("button", { style: {
      background: "none",
      border: "none",
      padding: "2px 6px",
      cursor: "pointer",
      fontFamily: FONT$5,
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
      }, children: "C:\\Users\\Portfolio\\My Works" })
    ] })
  ] });
}
function PortfolioApp() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);
  const {
    data: items = [],
    isLoading
  } = useQuery({
    ...trpc.portfolio.list.queryOptions(),
    staleTime: 3e4
  });
  const {
    portfolioBgUrl,
    portfolioBgOpacity
  } = useSiteSettings();
  const hasBackground = portfolioBgUrl.length > 0;
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ["All", ...cats];
  }, [items]);
  const filtered = activeCategory === "All" ? items : items.filter((p) => p.category === activeCategory);
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT$5,
    overflow: "hidden"
  }, "data-cid": "k2koB3MK", children: [
    hasBackground && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      backgroundImage: `url(${portfolioBgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: portfolioBgOpacity
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }, children: [
      /* @__PURE__ */ jsx(ExplorerToolbar$1, {}),
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
        fontFamily: FONT$5,
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
          background: SIDEBAR.background,
          borderRight: `1px solid ${SIDEBAR.borderColor}`,
          padding: "12px 8px",
          overflowY: "auto"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: SIDEBAR.titleColor,
            marginBottom: "8px",
            borderBottom: `1px solid ${SIDEBAR.borderColor}`,
            paddingBottom: "4px"
          }, children: SIDEBAR.tasksTitle }),
          SIDEBAR.taskItems.map((t) => /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "3px 2px",
            cursor: "pointer",
            fontSize: "11px",
            color: SIDEBAR.linkColor,
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
            color: SIDEBAR.titleColor,
            margin: "14px 0 8px",
            borderBottom: `1px solid ${SIDEBAR.borderColor}`,
            paddingBottom: "4px"
          }, children: SIDEBAR.detailsTitle }),
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
              SIDEBAR.owner
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
        }, children: isLoading ? /* @__PURE__ */ jsx("div", { style: {
          gridColumn: "1 / -1",
          textAlign: "center",
          color: "#888",
          fontSize: "12px",
          paddingTop: "40px"
        }, children: "加载中…" }) : filtered.length === 0 ? /* @__PURE__ */ jsx("div", { style: {
          gridColumn: "1 / -1",
          textAlign: "center",
          color: "#888",
          fontSize: "12px",
          paddingTop: "40px"
        }, children: "此分类暂无作品。" }) : filtered.map((item) => /* @__PURE__ */ jsxs("div", { onMouseEnter: () => setHoveredId(item.id), onMouseLeave: () => setHoveredId(null), onClick: () => setLightboxItem(item), style: {
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
            item.imageUrl ? /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.title, style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            } }) : /* @__PURE__ */ jsx("div", { style: {
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              color: "#b0b8c8"
            }, children: "🖼️" }),
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
            item.category && /* @__PURE__ */ jsx("div", { style: {
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
const FONT$4 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
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
    fontFamily: FONT$4
  }, "data-cid": "WsvGUVaA", children: [
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
        fontFamily: FONT$4,
        fontSize: "12px",
        border: "1px solid #aca899",
        background: "#d4d0c8",
        borderRadius: 2,
        cursor: "pointer"
      }, children: "+ Zoom In" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setZoom((z) => Math.max(z - 25, 25)), style: {
        padding: "1px 8px",
        fontFamily: FONT$4,
        fontSize: "12px",
        border: "1px solid #aca899",
        background: "#d4d0c8",
        borderRadius: 2,
        cursor: "pointer"
      }, children: "− Zoom Out" }),
      /* @__PURE__ */ jsx("button", { onClick: () => setZoom(100), style: {
        padding: "1px 8px",
        fontFamily: FONT$4,
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
      fontFamily: FONT$4
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
const FONT$3 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const ALL_LABEL = "全部";
function ExplorerToolbar({
  address
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    borderBottom: "1px solid #aca899",
    fontFamily: FONT$3,
    fontSize: "12px",
    flexShrink: 0
  }, "data-cid": "YdmNWTa-", children: [
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
      fontFamily: FONT$3,
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
  }, "data-cid": "uWWWueMV", children: categories.map((cat) => {
    const isActive = cat === activeCategory;
    return /* @__PURE__ */ jsx("button", { onClick: () => onSelect(cat), style: {
      fontFamily: FONT$3,
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
    }, "data-cid": "N22AwnNp", children: cat }, cat);
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
  }, "data-cid": "7r91_Ynz", children: [
    /* @__PURE__ */ jsx("img", { src: icon, alt: label, style: {
      width: "48px",
      height: "48px",
      objectFit: "contain"
    } }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: "11px",
      fontFamily: FONT$3,
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
  }, "data-cid": "yuewYbDM", children: [
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
            fontFamily: FONT$3,
            marginBottom: "6px",
            borderBottom: "1px solid #7a9bd4",
            paddingBottom: "4px"
          }, children: "Blog Tasks" }),
          /* @__PURE__ */ jsxs("div", { onClick: () => setActiveCategory(ALL_LABEL), style: {
            fontSize: "11px",
            color: "#1a3a90",
            fontFamily: FONT$3,
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
              fontFamily: FONT$3,
              lineHeight: "2",
              cursor: "pointer",
              textDecoration: isActive ? "none" : "underline",
              fontWeight: isActive ? "bold" : "normal"
            }, "data-cid": "81vtc6hc", children: [
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
            fontFamily: FONT$3,
            marginBottom: "6px",
            borderBottom: "1px solid #7a9bd4",
            paddingBottom: "4px"
          }, children: "Details" }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "10px",
            color: "#333",
            fontFamily: FONT$3,
            lineHeight: "1.6"
          }, children: isLoading && !dbPosts ? "正在同步..." : activeCategory === ALL_LABEL ? `共 ${posts.length} 篇文章` : `${activeCategory} 分类下共 ${filteredPosts.length} 篇文章` }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: "10px",
            color: "#555",
            fontFamily: FONT$3,
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
        fontFamily: FONT$3,
        width: "100%",
        textAlign: "center",
        paddingTop: "40px"
      }, children: "该分类下暂无文章" }) })
    ] })
  ] });
}
const XP_BLUE = "#5a5a5a";
const XP_DARK_BLUE = "#767676";
const FONT$2 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
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
  }, "data-cid": "zclWa_iF", children: [
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
      fontFamily: FONT$2
    }, "data-cid": "URnCfTCf", children: /* @__PURE__ */ jsx("span", { style: {
      color: "#888",
      fontSize: "12px"
    }, children: "正在加载文章内容..." }) });
  }
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: FONT$2
  }, "data-cid": "c8oIyZC9", children: [
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
          fontFamily: FONT$2,
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
const FONT$1 = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function MessageBubble({
  msg
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "relative",
    background: msg.isPinned ? "#fffbe6" : "#ffffff",
    border: `1px solid ${msg.isPinned ? "#f0c040" : "#d4d0c8"}`,
    borderRadius: "3px",
    padding: "7px 10px 7px 10px",
    marginBottom: "5px"
  }, "data-cid": "Tef4_ptY", children: [
    msg.isPinned && /* @__PURE__ */ jsx("span", { style: {
      position: "absolute",
      top: "5px",
      right: "8px",
      fontSize: "10px",
      color: "#b8820a",
      fontFamily: FONT$1,
      display: "flex",
      alignItems: "center",
      gap: "2px",
      background: "#fef3b0",
      padding: "1px 5px",
      borderRadius: "2px",
      border: "1px solid #f0c040"
    }, children: "📌 置顶" }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      marginBottom: "4px",
      paddingRight: msg.isPinned ? "52px" : "0"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontWeight: "bold",
        fontSize: "12px",
        color: "#003c7e",
        fontFamily: FONT$1
      }, children: msg.name }),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "10px",
        color: "#999",
        fontFamily: FONT$1
      }, children: formatDate(msg.createdAt) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: "12px",
      color: "#1a1a1a",
      fontFamily: FONT$1,
      lineHeight: "1.55",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word"
    }, children: msg.content })
  ] });
}
function BgPanel({
  bgUrlInput,
  setBgUrlInput,
  bgOpacity,
  setBgOpacity,
  hasBg,
  onApply,
  onClear,
  onClose
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "absolute",
    top: "58px",
    right: "6px",
    zIndex: 20,
    background: "#ece9d8",
    border: "2px solid #aca899",
    padding: "10px 12px",
    width: "230px",
    boxShadow: "3px 3px 6px rgba(0,0,0,0.25)",
    fontFamily: FONT$1
  }, "data-cid": "dYueCRMw", children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: "11px",
        fontWeight: "bold",
        color: "#000"
      }, children: "背景图片设置" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: {
        fontSize: "11px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#555",
        padding: "0 2px"
      }, children: "✕" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: "11px",
      marginBottom: "3px",
      color: "#000"
    }, children: "图片 URL：" }),
    /* @__PURE__ */ jsx("input", { value: bgUrlInput, onChange: (e) => setBgUrlInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && onApply(), placeholder: "粘贴图片链接后回车", style: {
      width: "100%",
      fontSize: "11px",
      padding: "2px 5px",
      border: "1px solid #7f9db9",
      fontFamily: FONT$1,
      boxSizing: "border-box",
      marginBottom: "6px"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: "4px",
      marginBottom: "10px"
    }, children: [
      /* @__PURE__ */ jsx("button", { onClick: onApply, style: {
        flex: 1,
        fontSize: "11px",
        padding: "2px 0",
        fontFamily: FONT$1,
        background: "linear-gradient(to bottom, #f4f4f0, #dbd9d0)",
        border: "1px solid #aca899",
        cursor: "pointer"
      }, children: "应用" }),
      hasBg && /* @__PURE__ */ jsx("button", { onClick: onClear, style: {
        flex: 1,
        fontSize: "11px",
        padding: "2px 0",
        fontFamily: FONT$1,
        background: "linear-gradient(to bottom, #f4f4f0, #dbd9d0)",
        border: "1px solid #aca899",
        cursor: "pointer"
      }, children: "清除" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      fontSize: "11px",
      marginBottom: "3px",
      color: "#000"
    }, children: [
      "背景透明度：",
      Math.round(bgOpacity * 100),
      "%"
    ] }),
    /* @__PURE__ */ jsx("input", { type: "range", min: 5, max: 100, value: Math.round(bgOpacity * 100), onChange: (e) => setBgOpacity(parseInt(e.target.value, 10) / 100), style: {
      width: "100%"
    } })
  ] });
}
function ChatBoxApp() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rateLimitSec, setRateLimitSec] = useState(0);
  const [bgUrl, setBgUrl] = useState("");
  const [bgUrlInput, setBgUrlInput] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.15);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [bgInitialized, setBgInitialized] = useState(false);
  const listRef = useRef(null);
  const queryClient = useQueryClient();
  const {
    isLoaded: settingsLoaded,
    chatboxBgUrl,
    chatboxBgOpacity
  } = useSiteSettings();
  useEffect(() => {
    if (settingsLoaded && !bgInitialized) {
      setBgUrl(chatboxBgUrl);
      setBgUrlInput(chatboxBgUrl);
      setBgOpacity(chatboxBgOpacity);
      setBgInitialized(true);
    }
  }, [settingsLoaded, chatboxBgUrl, chatboxBgOpacity, bgInitialized]);
  const queryKey = trpc.chatbox.listMessages.queryOptions({
    limit: 50
  }).queryKey;
  const {
    data,
    isLoading
  } = useQuery({
    ...trpc.chatbox.listMessages.queryOptions({
      limit: 50
    }),
    refetchInterval: 3e4,
    refetchOnWindowFocus: true
  });
  const mutation = useMutation(trpc.chatbox.createMessage.mutationOptions({
    onSuccess: () => {
      setContent("");
      void queryClient.invalidateQueries({
        queryKey
      });
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = 0;
      });
    },
    onError: (err) => {
      const match = err.message.match(/(\d+)\s*秒/);
      setRateLimitSec(match?.[1] !== void 0 ? parseInt(match[1], 10) : 60);
    }
  }));
  useEffect(() => {
    if (rateLimitSec <= 0) return;
    const id = setTimeout(() => setRateLimitSec((s) => Math.max(0, s - 1)), 1e3);
    return () => clearTimeout(id);
  }, [rateLimitSec]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || mutation.isPending || rateLimitSec > 0) return;
    mutation.mutate({
      name: name.trim(),
      content: content.trim()
    });
  };
  const applyBg = () => {
    setBgUrl(bgUrlInput.trim());
    setShowBgPanel(false);
  };
  const clearBg = () => {
    setBgUrl("");
    setBgUrlInput("");
  };
  const pinned = data?.pinned ?? [];
  const regular = data?.items ?? [];
  const allMessages = [...pinned, ...regular];
  const isSendDisabled = mutation.isPending || !name.trim() || !content.trim() || rateLimitSec > 0;
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    fontFamily: FONT$1,
    overflow: "hidden",
    background: "#f0ede8"
  }, "data-cid": "4jCga8CN", children: [
    bgUrl && /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      inset: 0,
      zIndex: 0,
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: bgOpacity,
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 2,
      flexShrink: 0,
      background: "#ece9d8",
      borderBottom: "2px solid #aca899"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "2px 4px",
        borderBottom: "1px solid #d4d0c8"
      }, children: [
        ["文件(F)", "编辑(E)", "查看(V)", "帮助(H)"].map((m) => /* @__PURE__ */ jsx("span", { style: {
          padding: "1px 6px",
          fontSize: "11px",
          cursor: "default",
          color: "#000",
          userSelect: "none"
        }, children: m }, m)),
        /* @__PURE__ */ jsx("div", { style: {
          flex: 1
        } }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowBgPanel((v) => !v), style: {
          padding: "1px 8px",
          fontSize: "11px",
          fontFamily: FONT$1,
          background: showBgPanel ? "linear-gradient(to bottom, #dbd9d0, #c8c6bc)" : "linear-gradient(to bottom, #f4f4f0, #dbd9d0)",
          border: "1px solid #aca899",
          cursor: "pointer",
          borderRadius: "2px",
          color: "#000"
        }, children: "🎨 背景" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        padding: "2px 6px",
        gap: "6px"
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: "11px",
          color: "#444",
          whiteSpace: "nowrap"
        }, children: "地址(D)" }),
        /* @__PURE__ */ jsx("div", { style: {
          flex: 1,
          background: "#fff",
          border: "1px solid #7f9db9",
          padding: "1px 6px",
          fontSize: "11px",
          color: "#5a5a5a"
        }, children: "💬 留言板 / ChatBox" })
      ] })
    ] }),
    showBgPanel && /* @__PURE__ */ jsx(BgPanel, { bgUrlInput, setBgUrlInput, bgOpacity, setBgOpacity, hasBg: !!bgUrl, onApply: applyBg, onClear: clearBg, onClose: () => setShowBgPanel(false) }),
    /* @__PURE__ */ jsxs("div", { ref: listRef, style: {
      flex: 1,
      overflowY: "auto",
      padding: "8px 10px",
      position: "relative",
      zIndex: 1
    }, children: [
      isLoading && /* @__PURE__ */ jsx("div", { style: {
        textAlign: "center",
        padding: "28px 0",
        fontSize: "12px",
        color: "#666"
      }, children: "正在连接留言板..." }),
      !isLoading && allMessages.length === 0 && /* @__PURE__ */ jsxs("div", { style: {
        textAlign: "center",
        padding: "36px 20px",
        fontSize: "12px",
        color: "#888",
        lineHeight: "2"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: "28px",
          marginBottom: "6px"
        }, children: "💬" }),
        "还没有留言，来第一个吧！"
      ] }),
      allMessages.map((msg) => /* @__PURE__ */ jsx(MessageBubble, { msg }, msg.id)),
      data?.nextCursor && /* @__PURE__ */ jsx("div", { style: {
        textAlign: "center",
        fontSize: "11px",
        color: "#888",
        padding: "6px 0"
      }, children: "── 仅显示最新 50 条留言 ──" })
    ] }),
    rateLimitSec > 0 && /* @__PURE__ */ jsxs("div", { style: {
      position: "relative",
      zIndex: 2,
      flexShrink: 0,
      background: "#fff3cd",
      border: "1px solid #ffc107",
      borderLeft: "4px solid #ffc107",
      margin: "0 8px 4px",
      padding: "5px 10px",
      borderRadius: "2px",
      fontSize: "11px",
      color: "#856404",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    }, children: [
      /* @__PURE__ */ jsx("span", { children: "⚠️" }),
      /* @__PURE__ */ jsxs("span", { children: [
        "请休息一会再留言（剩余",
        " ",
        /* @__PURE__ */ jsx("strong", { children: rateLimitSec }),
        " 秒）"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      flexShrink: 0,
      position: "relative",
      zIndex: 2,
      background: "#ece9d8",
      borderTop: "2px solid #aca899",
      padding: "7px 10px 8px"
    }, children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "5px"
      }, children: [
        /* @__PURE__ */ jsx("label", { style: {
          fontSize: "11px",
          color: "#000",
          whiteSpace: "nowrap",
          minWidth: "36px"
        }, children: "昵称：" }),
        /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), maxLength: 20, placeholder: "你的昵称（最多 20 字）", style: {
          flex: 1,
          fontSize: "11px",
          padding: "2px 5px",
          border: "1px solid #7f9db9",
          fontFamily: FONT$1,
          outline: "none"
        } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: "6px",
        alignItems: "flex-end"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          flex: 1
        }, children: [
          /* @__PURE__ */ jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), maxLength: 500, placeholder: "留言内容（最多 500 字）", rows: 2, style: {
            width: "100%",
            fontSize: "11px",
            padding: "3px 5px",
            border: "1px solid #7f9db9",
            fontFamily: FONT$1,
            resize: "none",
            lineHeight: "1.45",
            boxSizing: "border-box",
            outline: "none"
          } }),
          /* @__PURE__ */ jsxs("div", { style: {
            textAlign: "right",
            fontSize: "10px",
            color: content.length > 450 ? "#c0392b" : "#999",
            marginTop: "1px"
          }, children: [
            content.length,
            " / 500"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSendDisabled, style: {
          padding: "0 14px",
          height: "42px",
          marginBottom: "18px",
          fontSize: "11px",
          fontFamily: FONT$1,
          background: isSendDisabled ? "#d4d0c8" : "linear-gradient(to bottom, #f4f4f0, #dbd9d0)",
          border: "2px outset #d4d0c8",
          cursor: isSendDisabled ? "not-allowed" : "pointer",
          color: isSendDisabled ? "#888" : "#000",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          flexShrink: 0
        }, children: mutation.isPending ? "发送中..." : "发  送" })
      ] })
    ] }) })
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
    // Phase 6：通过闭包传入 documentId，让 ResumeApp 从 documents 表按 id 取内容
    AppComponent: () => React.createElement(ResumeApp, { documentId: "resume" })
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
  // ── Phase 4：留言板 ───────────────────────────────────────────────────────
  chatbox: {
    id: "chatbox",
    title: "ChatBox - 留言板",
    icon: "/assets/icons/MSN.png",
    defaultWidth: 520,
    defaultHeight: 540,
    AppComponent: ChatBoxApp
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
const DOC_FALLBACK_ICON = "/assets/icons/file.png";
function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}
function WindowContent({
  id,
  documents
}) {
  const app = APP_REGISTRY[id];
  if (app) {
    const {
      AppComponent
    } = app;
    return /* @__PURE__ */ jsx(AppComponent, { "data-cid": "MAWuHXGn" });
  }
  if (documents.some((d) => d.id === id)) {
    return /* @__PURE__ */ jsx(ResumeApp, { documentId: id, "data-cid": "IGHH_ZCz" });
  }
  return /* @__PURE__ */ jsx("div", { style: {
    padding: "20px",
    fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
    fontSize: "13px"
  }, "data-cid": "5QYmm69A", children: /* @__PURE__ */ jsxs("p", { children: [
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
    data: rawDocuments
  } = useQuery({
    ...trpc.site.getDocuments.queryOptions(),
    staleTime: 0,
    refetchOnMount: "always"
  });
  const documents = useMemo(() => rawDocuments ?? [], [rawDocuments]);
  const dynamicDocuments = useMemo(() => documents.filter((doc) => !APP_REGISTRY[doc.id]), [documents]);
  const allIconDefs = useMemo(() => [...iconDefs, ...dynamicDocuments.map((doc) => ({
    id: doc.id,
    label: doc.title,
    src: doc.iconSrc || DOC_FALLBACK_ICON
  }))], [iconDefs, dynamicDocuments]);
  const {
    icons,
    selectedId,
    startDrag,
    deselectAll,
    selectIcon
  } = useDesktopIcons(allIconDefs);
  const lastClick = useRef(null);
  const documentsRef = useRef(documents);
  documentsRef.current = documents;
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
    const doc = !app ? documentsRef.current.find((d) => d.id === iconId) : void 0;
    if (!app && !doc) return;
    const winTitle = app?.title ?? doc.title;
    const winIcon = app?.icon ?? (doc.iconSrc || DOC_FALLBACK_ICON);
    const winWidth = app?.defaultWidth ?? 700;
    const winHeight = app?.defaultHeight ?? 560;
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
        title: winTitle,
        icon: winIcon,
        x: 80 + offset,
        y: 40 + offset,
        width: winWidth,
        height: winHeight,
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
    /* @__PURE__ */ jsxs("div", { id: "root", onClick: handleDesktopClick, "data-cid": "PzTd-uer", children: [
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
    openWindows.map((win) => /* @__PURE__ */ jsx(XpWindow, { win, onFocus: handleWindowFocus, onClose: handleWindowClose, onMinimize: handleWindowMinimize, onPositionChange: handlePositionChange, onSizeChange: handleSizeChange, children: /* @__PURE__ */ jsx(WindowContent, { id: win.id, documents }) }, win.id)),
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
  }, "data-cid": "sWnd8e-L", children: [
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
  }, "data-cid": "Wr_t8zpw", children: [
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
  onDone,
  identity
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
  }, "data-cid": "UHolvlWN", children: [
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
      }, children: identity.brand }),
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
    }, children: identity.subtitle }),
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
  onEnter,
  identity
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
  }, "data-cid": "c8e-KAIH", children: [
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
          }, children: identity.brand }),
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
        }, children: identity.role }),
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
        /* @__PURE__ */ jsx("img", { src: identity.avatarUrl, alt: identity.username, style: {
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
          }, children: identity.username }),
          /* @__PURE__ */ jsx("div", { style: {
            color: "#ddd",
            fontSize: 12,
            textShadow: "1px 1px 2px rgba(0,0,0,0.4)"
          }, children: identity.role })
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
  const settings = useSiteSettings();
  const identity = {
    brand: settings.siteBrand,
    subtitle: settings.bootSubtitle,
    username: settings.siteUsername,
    avatarUrl: settings.siteAvatarUrl,
    role: settings.siteRole
  };
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
    stage === "boot" && /* @__PURE__ */ jsx(BootStage, { onDone: () => setStage("login"), identity }),
    stage === "login" && /* @__PURE__ */ jsx(LoginStage, { onEnter: enterDesktop, identity })
  ] });
}
function SiteHead() {
  const settings = useSiteSettings();
  useEffect(() => {
    if (!settings.isLoaded) return;
    document.title = settings.siteTitle;
    const setMeta = (selector, content) => {
      document.querySelector(selector)?.setAttribute("content", content);
    };
    setMeta('meta[name="description"]', settings.siteDescription);
    setMeta('meta[name="author"]', settings.siteAuthor);
    setMeta('meta[property="og:title"]', settings.siteTitle);
    setMeta('meta[property="og:description"]', settings.siteDescription);
    setMeta('meta[property="article:author"]', settings.siteAuthor);
    setMeta('meta[name="twitter:title"]', settings.siteTitle);
    setMeta('meta[name="twitter:description"]', settings.siteDescription);
  }, [settings.isLoaded, settings.siteTitle, settings.siteDescription, settings.siteAuthor]);
  return null;
}
function Home() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SiteHead, {}),
    /* @__PURE__ */ jsx(WelcomeGuard, { children: /* @__PURE__ */ jsx(HomePage, {}) })
  ] });
}
export {
  Home as component
};
