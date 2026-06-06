import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { t as trpc } from "./router-DHJpsL0Z.mjs";
import "@tanstack/react-router";
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
const DEFAULT_ABOUT = {
  name: "NNNullptr",
  title: "简介一段",
  location: "null",
  avatarSrc: "/assets/avatarSrc.jpg",
  markdownContent: "## 标题\n\n欢迎访问，随便写几句\n"
};
function AboutAdminPage() {
  const qc = useQueryClient();
  const [config, setConfig] = useState(DEFAULT_ABOUT);
  const [contentInited, setContentInited] = useState(false);
  const [showContentOk, setShowContentOk] = useState(false);
  const [contentErr, setContentErr] = useState("");
  const [bgUrl, setBgUrl] = useState("/assets/wallpapers/bg2.jpg");
  const [bgOpacity, setBgOpacity] = useState(0.5);
  const [bgInited, setBgInited] = useState(false);
  const [showBgOk, setShowBgOk] = useState(false);
  const [bgErr, setBgErr] = useState("");
  const {
    data: settings,
    isPending: isLoading
  } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0
  });
  useEffect(() => {
    if (!settings) return;
    if (!contentInited) {
      const raw = settings["about_content"];
      if (raw) {
        try {
          setConfig(JSON.parse(raw));
        } catch {
        }
      }
      setContentInited(true);
    }
    if (!bgInited) {
      setBgUrl(settings["about_bg_url"] ?? "/assets/wallpapers/bg2.jpg");
      const rawOp = settings["about_bg_opacity"];
      setBgOpacity(rawOp ? parseFloat(rawOp) : 0.5);
      setBgInited(true);
    }
  }, [settings, contentInited, bgInited]);
  const invalidateFront = useCallback(() => {
    void qc.invalidateQueries({
      queryKey: trpc.site.getSettings.queryOptions().queryKey
    });
  }, [qc]);
  const {
    mutate: saveContent,
    isPending: isSavingContent
  } = useMutation(trpc.settings.setBatch.mutationOptions({
    onSuccess: () => {
      invalidateFront();
      setContentErr("");
      setShowContentOk(true);
    },
    onError: (err) => setContentErr(err.message ?? "保存失败，请重试")
  }));
  const handleSaveContent = useCallback(() => {
    saveContent({
      about_content: JSON.stringify(config)
    });
  }, [saveContent, config]);
  const {
    mutate: saveBg,
    isPending: isSavingBg
  } = useMutation(trpc.settings.setBatch.mutationOptions({
    onSuccess: () => {
      invalidateFront();
      setBgErr("");
      setShowBgOk(true);
    },
    onError: (err) => setBgErr(err.message ?? "保存失败，请重试")
  }));
  const handleSaveBg = useCallback(() => {
    saveBg({
      about_bg_url: bgUrl.trim(),
      about_bg_opacity: String(bgOpacity)
    });
  }, [saveBg, bgUrl, bgOpacity]);
  const update = (patch) => setConfig((prev) => ({
    ...prev,
    ...patch
  }));
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
      }, children: "👤" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: {
          margin: 0,
          fontSize: 15,
          color: "#003399",
          fontWeight: "bold"
        }, children: "关于我设置" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#555"
        }, children: "管理前台 About Me 窗口的个人简介与背景图，保存后前台即时生效" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { style: {
      color: "#555",
      fontSize: 12,
      marginTop: 16
    }, children: "正在加载设置…" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Section, { title: "📋  基本信息", children: [
        /* @__PURE__ */ jsx(FieldRow, { label: "昵称", children: /* @__PURE__ */ jsx(XpInput, { value: config.name, onChange: (v) => update({
          name: v
        }), placeholder: "NNNullptr" }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "职位/简介", children: /* @__PURE__ */ jsx(XpInput, { value: config.title, onChange: (v) => update({
          title: v
        }), placeholder: "前端开发者 / 学生" }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "位置", children: /* @__PURE__ */ jsx(XpInput, { value: config.location, onChange: (v) => update({
          location: v
        }), placeholder: "null" }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "头像 URL", children: /* @__PURE__ */ jsx(XpInput, { value: config.avatarSrc, onChange: (v) => update({
          avatarSrc: v
        }), placeholder: "/assets/avatarSrc.jpg 或外链", width: 380 }) }),
        config.avatarSrc && /* @__PURE__ */ jsx("div", { style: {
          marginLeft: 90,
          marginBottom: 4
        }, children: /* @__PURE__ */ jsx("img", { src: config.avatarSrc, alt: "头像预览", style: {
          width: 48,
          height: 48,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #aaa"
        }, onError: (e) => {
          e.currentTarget.style.opacity = "0.3";
        } }) })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "📝  Markdown 内容（中间滚动区）", children: [
        /* @__PURE__ */ jsxs("p", { style: {
          margin: "0 0 6px",
          fontSize: 11,
          color: "#555"
        }, children: [
          "支持标准 Markdown 语法：## 标题、**加粗**、- 列表、",
          ">",
          " 引用等。"
        ] }),
        /* @__PURE__ */ jsx("textarea", { value: config.markdownContent, onChange: (e) => update({
          markdownContent: e.target.value
        }), rows: 14, spellCheck: false, style: {
          width: "100%",
          boxSizing: "border-box",
          padding: "6px 8px",
          fontSize: 12,
          fontFamily: 'Consolas, "Courier New", monospace',
          border: "2px inset #aaa",
          background: "#fff",
          resize: "vertical",
          outline: "none",
          lineHeight: 1.6
        } })
      ] }),
      contentErr && /* @__PURE__ */ jsx(ErrorBar, { msg: contentErr }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginBottom: 20
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: handleSaveContent, disabled: isSavingContent, primary: true, children: isSavingContent ? "保存中…" : "💾  保存内容" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: () => setContentInited(false), disabled: isSavingContent, children: "重置" })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "🎨  外观设置（全局默认背景）", children: [
        /* @__PURE__ */ jsx("p", { style: {
          margin: "0 0 10px",
          fontSize: 11,
          color: "#555"
        }, children: "保存后前台 About Me 窗口打开时默认显示此背景。" }),
        /* @__PURE__ */ jsx(FieldRow, { label: "背景图 URL", children: /* @__PURE__ */ jsx("input", { type: "text", value: bgUrl, onChange: (e) => setBgUrl(e.target.value), placeholder: "https://example.com/bg.jpg  或 /assets/wallpapers/...  或留空不显示", style: {
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
            background: "linear-gradient(160deg,#f0f0f0,#fafafa)"
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
              padding: "10px 10px"
            }, children: /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              gap: 6,
              alignItems: "center",
              background: "rgba(255,255,255,0.65)",
              borderRadius: 2,
              padding: "4px 6px"
            }, children: [
              /* @__PURE__ */ jsx("div", { style: {
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#b8b8b8",
                flexShrink: 0
              } }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { style: {
                  fontSize: 8,
                  fontWeight: "bold",
                  color: "#767676"
                }, children: "NNNullptr" }),
                /* @__PURE__ */ jsx("div", { style: {
                  fontSize: 7,
                  color: "#888"
                }, children: "前端开发者" })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(FieldRow, { label: `透明度 ${Math.round(bgOpacity * 100)}%`, children: /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 100, value: Math.round(bgOpacity * 100), onChange: (e) => setBgOpacity(parseInt(e.target.value, 10) / 100), style: {
          width: 200
        } }) }),
        bgErr && /* @__PURE__ */ jsx(ErrorBar, { msg: bgErr }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 8
        }, children: /* @__PURE__ */ jsx(XpButton, { onClick: handleSaveBg, disabled: isSavingBg, primary: true, children: isSavingBg ? "保存中…" : "💾  保存外观" }) })
      ] })
    ] }),
    showContentOk && /* @__PURE__ */ jsx(SuccessDialog, { title: "关于我设置", message: "内容已写入数据库。", detail: "前台 About Me 窗口重新打开后即可看到最新效果。", onClose: () => setShowContentOk(false) }),
    showBgOk && /* @__PURE__ */ jsx(SuccessDialog, { title: "关于我设置", message: "外观设置已保存。", detail: "重新打开 About Me 窗口即可看到背景效果。", onClose: () => setShowBgOk(false) })
  ] });
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
function ErrorBar({
  msg
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
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
    }, children: msg })
  ] });
}
function XpInput({
  value,
  onChange,
  placeholder,
  width = 320
}) {
  return /* @__PURE__ */ jsx("input", { type: "text", value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    width,
    padding: "3px 6px",
    fontSize: 12,
    fontFamily: FONT,
    border: "2px inset #aaa",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box"
  } });
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
  title,
  message,
  detail,
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
      }, children: title })
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
          }, children: message }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }, children: detail })
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
  AboutAdminPage as component
};
