import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, useRouterState, Outlet, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { t as trpc } from "./router-DHJpsL0Z.mjs";
import "@trpc/client";
import "@trpc/server/observable";
import "superjson";
import "@trpc/tanstack-react-query";
import "@trpc/server/adapters/fetch";
import "@trpc/server";
import "jose";
import "zod";
import "bcryptjs";
import "drizzle-orm";
import "nanoid";
import "drizzle-orm/libsql";
import "@libsql/client/http";
import "drizzle-orm/sqlite-core";
import "node:crypto";
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const NAV_ITEMS = [{
  icon: "🎨",
  label: "主题设置",
  href: "/admin/theme"
}, {
  icon: "📝",
  label: "博客管理",
  href: "/admin/blog"
}, {
  icon: "🖼️",
  label: "图标管理",
  href: "/admin/icons"
}, {
  icon: "🐾",
  label: "桌宠管理",
  href: "/admin/mascots"
}, {
  icon: "💬",
  label: "留言板",
  href: "/admin/chatbox"
}, {
  icon: "🗂️",
  label: "作品集",
  href: "/admin/portfolio"
}, {
  icon: "🎵",
  label: "媒体库",
  href: "/admin/media"
}, {
  icon: "📬",
  label: "联系设置",
  href: "/admin/contact"
}, {
  icon: "👤",
  label: "关于设置",
  href: "/admin/about"
}, {
  icon: "📄",
  label: "文档管理",
  href: "/admin/documents"
}];
function VerifyingScreen() {
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #003a7a 0%, #1a5fb4 50%, #0a2a5e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    background: "#ece9d8",
    border: "2px solid #00378a",
    borderRadius: 4,
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "4px 4px 12px rgba(0,0,0,0.5)"
  }, children: [
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 24
    }, children: "⏳" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#003399",
        marginBottom: 3
      }, children: "正在验证身份..." }),
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 11,
        color: "#666"
      }, children: "请稍候" })
    ] })
  ] }) });
}
function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const {
    data: authData,
    isPending
  } = useQuery({
    ...trpc.auth.verify.queryOptions(),
    staleTime: 0,
    refetchOnWindowFocus: true
  });
  useEffect(() => {
    if (!isPending && authData?.authenticated === false) {
      navigate({
        to: "/admin/login"
      });
    }
  }, [isPending, authData, navigate]);
  if (isPending || !authData) return /* @__PURE__ */ jsx(VerifyingScreen, {});
  if (!authData.authenticated) return /* @__PURE__ */ jsx(VerifyingScreen, {});
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    background: "#d4d0c8",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT
  }, children: [
    /* @__PURE__ */ jsx(TitleBar, {}),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      display: "flex",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx(Sidebar, { currentPath: pathname }),
      /* @__PURE__ */ jsx("main", { style: {
        flex: 1,
        overflow: "auto",
        background: "#fff",
        border: "2px inset #aaa",
        margin: "4px 6px 6px 0"
      }, children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
function TitleBar() {
  const navigate = useNavigate();
  const {
    mutate: logout
  } = useMutation({
    ...trpc.auth.logout.mutationOptions(),
    onSuccess: () => {
      navigate({
        to: "/admin/login"
      });
    }
  });
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "linear-gradient(180deg, #2e7bd4 0%, #1a5fb4 40%, #1e4fa0 60%, #2466c4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3px 6px",
    userSelect: "none",
    flexShrink: 0
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }, children: [
      /* @__PURE__ */ jsx("img", { src: "/favicon.png", alt: "", style: {
        width: 16,
        height: 16,
        imageRendering: "pixelated"
      } }),
      /* @__PURE__ */ jsx("span", { style: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0,0,0,0.6)"
      }, children: "MoeKernel — 管理后台" })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: () => logout(), style: {
      background: "linear-gradient(180deg, #f0f4fc 0%, #dce8f8 40%, #c8daf0 100%)",
      border: "1px solid #6090c0",
      borderRadius: 2,
      padding: "1px 10px",
      fontSize: 11,
      fontFamily: FONT,
      cursor: "pointer",
      color: "#000"
    }, children: "退出登录" })
  ] });
}
function Sidebar({
  currentPath
}) {
  return /* @__PURE__ */ jsxs("nav", { style: {
    width: 160,
    flexShrink: 0,
    background: "linear-gradient(180deg, #3a78d0 0%, #2060b8 100%)",
    display: "flex",
    flexDirection: "column",
    margin: "4px 0 6px 6px",
    border: "2px outset #5090d8",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      padding: "10px 10px 6px",
      color: "#fff",
      fontSize: 11,
      fontWeight: "bold",
      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
      borderBottom: "1px solid rgba(255,255,255,0.2)",
      marginBottom: 4
    }, children: "控制面板" }),
    NAV_ITEMS.map(({
      icon,
      label,
      href
    }) => {
      const isActive = currentPath === href || currentPath.startsWith(href + "/");
      return /* @__PURE__ */ jsxs(Link, { to: href, style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        color: "#fff",
        textDecoration: "none",
        fontSize: 12,
        fontFamily: FONT,
        background: isActive ? "rgba(255,255,255,0.25)" : "transparent",
        borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
        transition: "background 0.1s"
      }, onMouseEnter: (e) => {
        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.12)";
      }, onMouseLeave: (e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 14,
          lineHeight: 1
        }, children: icon }),
        /* @__PURE__ */ jsx("span", { children: label })
      ] }, href);
    }),
    /* @__PURE__ */ jsx("div", { style: {
      flex: 1
    } }),
    /* @__PURE__ */ jsxs("a", { href: "/", target: "_blank", rel: "noopener noreferrer", style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 10px",
      color: "rgba(255,255,255,0.7)",
      textDecoration: "none",
      fontSize: 11,
      borderTop: "1px solid rgba(255,255,255,0.15)"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 13
      }, children: "🌐" }),
      /* @__PURE__ */ jsx("span", { children: "查看前台" })
    ] })
  ] });
}
export {
  AdminLayout as component
};
