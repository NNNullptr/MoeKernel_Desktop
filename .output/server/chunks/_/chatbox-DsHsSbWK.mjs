import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { t as trpc } from "./router-DlVEEomJ.mjs";
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
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ChatboxAdminPage() {
  const qc = useQueryClient();
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.15);
  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const msgQueryKey = trpc.chatbox.listMessages.queryOptions({
    limit: 100
  }).queryKey;
  const {
    data,
    isLoading: msgLoading
  } = useQuery({
    ...trpc.chatbox.listMessages.queryOptions({
      limit: 100
    }),
    staleTime: 0
  });
  const {
    data: settings
  } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0
  });
  useEffect(() => {
    if (settings && !initialized) {
      setBgUrl(settings["chatbox_bg_url"] ?? "");
      const raw = settings["chatbox_bg_opacity"];
      setBgOpacity(raw ? parseFloat(raw) : 0.15);
      setInitialized(true);
    }
  }, [settings, initialized]);
  const {
    mutate: deleteMsg
  } = useMutation(trpc.chatbox.deleteMessage.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: msgQueryKey
      });
    }
  }));
  const {
    mutate: togglePin
  } = useMutation(trpc.chatbox.togglePin.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: msgQueryKey
      });
    }
  }));
  const {
    mutate: saveAppearance,
    isPending: isSaving
  } = useMutation(trpc.settings.setBatch.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: trpc.site.getSettings.queryOptions().queryKey
      });
      setErrorMsg("");
      setShowSuccess(true);
    },
    onError: (err) => setErrorMsg(err.message ?? "保存失败，请重试")
  }));
  const handleSave = useCallback(() => {
    saveAppearance({
      chatbox_bg_url: bgUrl.trim(),
      chatbox_bg_opacity: String(bgOpacity)
    });
  }, [saveAppearance, bgUrl, bgOpacity]);
  const allMessages = [...data?.pinned ?? [], ...data?.items ?? []];
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "20px 24px",
    fontFamily: FONT,
    position: "relative"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: "2px solid #2060b8",
      paddingBottom: 10,
      marginBottom: 18
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 28
      }, children: "💬" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: {
          margin: 0,
          fontSize: 15,
          color: "#003399",
          fontWeight: "bold"
        }, children: "ChatBox 留言板管理" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#555"
        }, children: "管理访客留言、设置置顶，并配置留言板全局默认背景" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Section, { title: "📋  留言管理", children: msgLoading ? /* @__PURE__ */ jsx("div", { style: {
      fontSize: 12,
      color: "#666",
      padding: "8px 0"
    }, children: "加载中…" }) : allMessages.length === 0 ? /* @__PURE__ */ jsx("div", { style: {
      fontSize: 12,
      color: "#888",
      padding: "8px 0"
    }, children: "暂无留言" }) : /* @__PURE__ */ jsx("div", { style: {
      maxHeight: 360,
      overflowY: "auto"
    }, children: allMessages.map((msg) => /* @__PURE__ */ jsx(MessageRow, { msg, onDelete: () => deleteMsg({
      id: msg.id
    }), onTogglePin: () => togglePin({
      id: msg.id
    }) }, msg.id)) }) }),
    /* @__PURE__ */ jsxs(Section, { title: "🎨  外观设置（全局默认背景）", children: [
      /* @__PURE__ */ jsx("p", { style: {
        margin: "0 0 10px",
        fontSize: 11,
        color: "#555"
      }, children: "保存后前台 ChatBox 窗口打开时默认显示此背景。用户仍可通过「🎨 背景」按钮临时覆盖。" }),
      /* @__PURE__ */ jsx(FieldRow, { label: "背景图 URL", children: /* @__PURE__ */ jsx("input", { type: "text", value: bgUrl, onChange: (e) => setBgUrl(e.target.value), placeholder: "https://example.com/bg.jpg  或留空不显示背景", style: {
        width: 420,
        padding: "3px 6px",
        fontSize: 12,
        fontFamily: FONT,
        border: "2px inset #aaa",
        background: "#fff",
        outline: "none",
        boxSizing: "border-box"
      } }) }),
      bgUrl && /* @__PURE__ */ jsxs("div", { style: {
        marginBottom: 10,
        marginLeft: 86
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 11,
          color: "#666",
          marginBottom: 4
        }, children: "效果预览：" }),
        /* @__PURE__ */ jsxs("div", { style: {
          width: 200,
          height: 120,
          position: "relative",
          overflow: "hidden",
          border: "2px inset #888",
          background: "#f0ede8"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: bgOpacity
          } }),
          /* @__PURE__ */ jsx("div", { style: {
            position: "relative",
            zIndex: 1,
            padding: "8px 6px"
          }, children: /* @__PURE__ */ jsx("div", { style: {
            background: "#fff",
            border: "1px solid #d4d0c8",
            borderRadius: 2,
            padding: "4px 6px",
            fontSize: 10,
            color: "#333",
            fontFamily: FONT
          }, children: "示例留言气泡" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(FieldRow, { label: `透明度 ${Math.round(bgOpacity * 100)}%`, children: /* @__PURE__ */ jsx("input", { type: "range", min: 5, max: 100, value: Math.round(bgOpacity * 100), onChange: (e) => setBgOpacity(parseInt(e.target.value, 10) / 100), style: {
        width: 200
      } }) }),
      errorMsg && /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff4ce",
        border: "1px solid #e0a000",
        borderRadius: 2,
        padding: "6px 10px",
        marginBottom: 12
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 16
        }, children: "⚠️" }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 11,
          color: "#7a4900"
        }, children: errorMsg })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 8
      }, children: /* @__PURE__ */ jsx(XpButton, { onClick: handleSave, disabled: isSaving, primary: true, children: isSaving ? "保存中…" : "💾  保存外观" }) })
    ] }),
    showSuccess && /* @__PURE__ */ jsx(SuccessDialog, { onClose: () => setShowSuccess(false) })
  ] });
}
function MessageRow({
  msg,
  onDelete,
  onTogglePin
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    padding: "7px 8px",
    background: msg.isPinned ? "#fffbe6" : "#fff",
    border: `1px solid ${msg.isPinned ? "#f0c040" : "#d4d0c8"}`,
    borderRadius: 2,
    marginBottom: 5
  }, children: [
    msg.isPinned && /* @__PURE__ */ jsx("span", { style: {
      fontSize: 12,
      flexShrink: 0,
      marginTop: 2
    }, children: "📌" }),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      minWidth: 0
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 3
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#003c7e",
          fontFamily: FONT
        }, children: msg.name }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10,
          color: "#999"
        }, children: formatDate(msg.createdAt) })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 11,
        color: "#333",
        fontFamily: FONT,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.5
      }, children: msg.content })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: 4,
      flexShrink: 0,
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ jsx(ActionBtn, { onClick: onTogglePin, children: msg.isPinned ? "📌取消" : "📌置顶" }),
      confirmDelete ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(ActionBtn, { onClick: () => {
          onDelete();
          setConfirmDelete(false);
        }, danger: true, children: "确认删除" }),
        /* @__PURE__ */ jsx(ActionBtn, { onClick: () => setConfirmDelete(false), children: "取消" })
      ] }) : /* @__PURE__ */ jsx(ActionBtn, { onClick: () => setConfirmDelete(true), danger: true, children: "🗑️删除" })
    ] })
  ] });
}
function ActionBtn({
  children,
  onClick,
  danger
}) {
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, style: {
    padding: "2px 7px",
    fontSize: 11,
    fontFamily: FONT,
    background: danger ? "linear-gradient(to bottom, #fde8e8, #f8d0d0)" : "linear-gradient(to bottom, #f4f4f0, #dbd9d0)",
    border: `1px solid ${danger ? "#c07070" : "#aca899"}`,
    cursor: "pointer",
    borderRadius: 2,
    color: danger ? "#8b0000" : "#000",
    whiteSpace: "nowrap"
  }, children });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("fieldset", { style: {
    border: "2px groove #b0a890",
    borderRadius: 2,
    padding: "6px 12px 12px",
    marginBottom: 16,
    background: "#f5f3ec"
  }, children: [
    /* @__PURE__ */ jsx("legend", { style: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#003",
      padding: "0 6px",
      background: "#f5f3ec"
    }, children: title }),
    children
  ] });
}
function FieldRow({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 8
  }, children: [
    /* @__PURE__ */ jsxs("label", { style: {
      fontSize: 12,
      color: "#222",
      width: 76,
      flexShrink: 0
    }, children: [
      label,
      "："
    ] }),
    children
  ] });
}
function XpButton({
  children,
  onClick,
  disabled,
  primary
}) {
  const [pressed, setPressed] = useState(false);
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, disabled, onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false), onMouseLeave: () => setPressed(false), style: {
    minWidth: primary ? 100 : 72,
    height: 24,
    padding: "0 12px",
    fontFamily: FONT,
    fontSize: 12,
    cursor: disabled ? "default" : "pointer",
    border: "2px solid",
    borderColor: pressed ? "#003399 #a0b8e0 #a0b8e0 #003399" : "#a0b8e0 #003399 #003399 #a0b8e0",
    background: disabled ? "#d4d0c8" : pressed ? "linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)" : primary ? "linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)" : "linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)",
    color: disabled ? "#888" : "#000",
    boxShadow: pressed ? "none" : "1px 1px 0 rgba(255,255,255,0.8) inset",
    outline: "none",
    fontWeight: primary ? "bold" : "normal"
  }, children });
}
function SuccessDialog({
  onClose
}) {
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    width: 320,
    border: "2px solid #00378a",
    borderRadius: 4,
    boxShadow: "4px 4px 12px rgba(0,0,0,0.5)",
    overflow: "hidden",
    fontFamily: FONT
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      background: "linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 8px"
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
        textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
      }, children: "ChatBox 管理" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "18px 20px 14px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 18
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 36,
          lineHeight: 1
        }, children: "✅" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 13,
            fontWeight: "bold",
            color: "#003",
            marginBottom: 4
          }, children: "外观设置已保存" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }, children: [
            "背景设置已写入数据库。",
            /* @__PURE__ */ jsx("br", {}),
            "重新打开 ChatBox 窗口即可看到效果。"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        justifyContent: "flex-end"
      }, children: /* @__PURE__ */ jsx(XpButton, { onClick: onClose, primary: true, children: "确定" }) })
    ] })
  ] }) });
}
export {
  ChatboxAdminPage as component
};
