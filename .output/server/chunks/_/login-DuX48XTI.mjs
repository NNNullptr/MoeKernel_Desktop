import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { t as trpc } from "./router-DlVEEomJ.mjs";
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
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const TITLE_BAR_GRADIENT = "linear-gradient(180deg, #2e7bd4 0%, #1a5fb4 40%, #1e4fa0 60%, #2466c4 100%)";
function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const {
    mutate: login,
    isPending
  } = useMutation({
    ...trpc.auth.login.mutationOptions(),
    onSuccess: () => {
      navigate({
        to: "/admin"
      });
    },
    onError: (err) => {
      setErrorMsg(err.message ?? "登录失败，请重试。");
    }
  });
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setErrorMsg("");
    login({
      password
    });
  }, [login, password]);
  return /* @__PURE__ */ jsxs("div", { style: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(135deg, #003a7a 0%, #1a5fb4 50%, #0a2a5e 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      width: 340,
      borderRadius: 4,
      border: "2px solid #00378a",
      boxShadow: "4px 4px 12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: TITLE_BAR_GRADIENT,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 6px",
        userSelect: "none"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 6
        }, children: [
          /* @__PURE__ */ jsx("img", { src: "/favicon.png", alt: "", style: {
            width: 14,
            height: 14,
            imageRendering: "pixelated"
          } }),
          /* @__PURE__ */ jsx("span", { style: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.6)"
          }, children: "Administrator Login" })
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          width: 16,
          height: 14,
          background: "linear-gradient(180deg, #e05050 0%, #c02020 100%)",
          border: "1px solid #800000",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 9,
          fontWeight: "bold",
          cursor: "default",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)"
        }, children: "✕" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#ece9d8",
        padding: "18px 20px 16px"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: 40,
            height: 40,
            background: "linear-gradient(135deg, #2e7bd4, #1a3a8a)",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
            border: "1px solid #1a5fb4"
          }, children: "🔐" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: 13,
              fontWeight: "bold",
              color: "#003399",
              marginBottom: 2
            }, children: "管理员登录" }),
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: 11,
              color: "#555"
            }, children: "请输入管理员密码以继续" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            marginBottom: 12
          }, children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "admin-password", style: {
              display: "block",
              fontSize: 12,
              color: "#222",
              marginBottom: 4
            }, children: "密码：" }),
            /* @__PURE__ */ jsx("input", { id: "admin-password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), autoFocus: true, autoComplete: "current-password", style: {
              width: "100%",
              boxSizing: "border-box",
              padding: "3px 6px",
              fontSize: 13,
              border: "2px inset #aaa",
              background: "#fff",
              fontFamily: FONT,
              outline: "none"
            } })
          ] }),
          errorMsg && /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            background: "#fff4ce",
            border: "1px solid #e0a000",
            borderRadius: 2,
            padding: "6px 8px",
            marginBottom: 12
          }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: 16,
              lineHeight: 1,
              flexShrink: 0
            }, children: "⚠️" }),
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: 11,
              color: "#7a4900",
              lineHeight: 1.4
            }, children: errorMsg })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            justifyContent: "flex-end",
            gap: 6
          }, children: [
            /* @__PURE__ */ jsx(XpButton, { type: "submit", disabled: isPending, children: isPending ? "登录中…" : "确定" }),
            /* @__PURE__ */ jsx(XpButton, { type: "button", onClick: () => {
              setPassword("");
              setErrorMsg("");
            }, disabled: isPending, children: "清除" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      marginTop: 16,
      fontSize: 11,
      color: "rgba(255,255,255,0.5)",
      fontFamily: FONT
    }, children: "MoeKernel Administrator Console" })
  ] });
}
function XpButton({
  children,
  type = "button",
  onClick,
  disabled
}) {
  const [pressed, setPressed] = useState(false);
  return /* @__PURE__ */ jsx("button", { type, onClick, disabled, onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false), onMouseLeave: () => setPressed(false), style: {
    minWidth: 72,
    height: 23,
    padding: "0 10px",
    fontFamily: FONT,
    fontSize: 12,
    cursor: disabled ? "default" : "pointer",
    border: "2px solid",
    borderColor: pressed ? "#003399 #a0b8e0 #a0b8e0 #003399" : "#a0b8e0 #003399 #003399 #a0b8e0",
    background: disabled ? "#d4d0c8" : pressed ? "linear-gradient(180deg, #b8cce8 0%, #dce8f8 100%)" : "linear-gradient(180deg, #f0f4fc 0%, #dce8f8 40%, #c8daf0 100%)",
    color: disabled ? "#888" : "#000",
    boxShadow: pressed ? "none" : "1px 1px 0 rgba(255,255,255,0.8) inset",
    outline: "none"
  }, children });
}
export {
  AdminLoginPage as component
};
