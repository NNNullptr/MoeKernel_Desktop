import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { t as trpc } from "./router-D8BejgbK.mjs";
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
const DEFAULT_LINKS = [{
  id: "github",
  name: "GitHub",
  url: "https://github.com/NNNullptr",
  iconSrc: "/assets/icons/github.png",
  emoji: ""
}, {
  id: "twitter",
  name: "Twitter",
  url: "https://x.com/NNNullptr",
  iconSrc: "/assets/icons/twitter.png",
  emoji: ""
}];
function newItem() {
  return {
    id: `link-${Date.now()}`,
    name: "",
    url: "",
    iconSrc: "",
    emoji: "🌐"
  };
}
function ContactAdminPage() {
  const qc = useQueryClient();
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [linksInited, setLinksInited] = useState(false);
  const [showLinksOk, setShowLinksOk] = useState(false);
  const [linksErr, setLinksErr] = useState("");
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.15);
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
    if (!linksInited) {
      const raw = settings["contact_content"];
      if (raw) {
        try {
          setLinks(JSON.parse(raw));
        } catch {
        }
      }
      setLinksInited(true);
    }
    if (!bgInited) {
      setBgUrl(settings["contact_bg_url"] ?? "");
      const rawOp = settings["contact_bg_opacity"];
      setBgOpacity(rawOp ? parseFloat(rawOp) : 0.15);
      setBgInited(true);
    }
  }, [settings, linksInited, bgInited]);
  const invalidateFront = useCallback(() => {
    void qc.invalidateQueries({
      queryKey: trpc.site.getSettings.queryOptions().queryKey
    });
  }, [qc]);
  const {
    mutate: saveLinks,
    isPending: isSavingLinks
  } = useMutation(trpc.settings.setBatch.mutationOptions({
    onSuccess: () => {
      invalidateFront();
      setLinksErr("");
      setShowLinksOk(true);
    },
    onError: (err) => setLinksErr(err.message ?? "保存失败，请重试")
  }));
  const handleSaveLinks = useCallback(() => {
    const cleaned = links.map((l) => ({
      ...l,
      name: l.name.trim(),
      url: l.url.trim(),
      iconSrc: l.iconSrc.trim(),
      emoji: l.emoji.trim()
    }));
    saveLinks({
      contact_content: JSON.stringify(cleaned)
    });
  }, [saveLinks, links]);
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
      contact_bg_url: bgUrl.trim(),
      contact_bg_opacity: String(bgOpacity)
    });
  }, [saveBg, bgUrl, bgOpacity]);
  const updateItem = (idx, patch) => setLinks((prev) => prev.map((l, i) => i === idx ? {
    ...l,
    ...patch
  } : l));
  const deleteItem = (idx) => setLinks((prev) => prev.filter((_, i) => i !== idx));
  const addItem = () => setLinks((prev) => [...prev, newItem()]);
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
      }, children: "📬" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: {
          margin: 0,
          fontSize: 15,
          color: "#003399",
          fontWeight: "bold"
        }, children: "联系方式设置" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#555"
        }, children: "管理前台 Contact Me 窗口的社交链接与背景图，保存后前台即时生效" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { style: {
      color: "#555",
      fontSize: 12,
      marginTop: 16
    }, children: "正在加载设置…" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Section, { title: "🔗  社交链接列表", children: [
        links.length === 0 && /* @__PURE__ */ jsx("p", { style: {
          fontSize: 11,
          color: "#888",
          margin: "8px 0"
        }, children: '暂无链接，点击"添加"新建一条。' }),
        links.map((item, idx) => /* @__PURE__ */ jsx(LinkRow, { item, idx, onChange: (patch) => updateItem(idx, patch), onDelete: () => deleteItem(idx) }, item.id)),
        /* @__PURE__ */ jsx("div", { style: {
          marginTop: 10
        }, children: /* @__PURE__ */ jsx(XpButton, { onClick: addItem, children: "＋ 添加链接" }) })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "💡  说明", children: /* @__PURE__ */ jsxs("ul", { style: {
        margin: "4px 0",
        paddingLeft: 20,
        fontSize: 11,
        color: "#555",
        lineHeight: 1.8
      }, children: [
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("b", { children: "图标 URL" }),
          "：填写本地路径（如 ",
          /* @__PURE__ */ jsx("code", { children: "/assets/icons/github.png" }),
          "）或外链 URL。"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("b", { children: "Emoji 备用" }),
          "：当图标 URL 为空时显示此 Emoji。"
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("b", { children: "链接" }),
          "：邮件地址请填写 ",
          /* @__PURE__ */ jsx("code", { children: "mailto:xxx@example.com" }),
          "。"
        ] })
      ] }) }),
      linksErr && /* @__PURE__ */ jsx(ErrorBar, { msg: linksErr }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginBottom: 20
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: handleSaveLinks, disabled: isSavingLinks, primary: true, children: isSavingLinks ? "保存中…" : "💾  保存链接" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: () => setLinksInited(false), disabled: isSavingLinks, children: "重置" })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "🎨  外观设置（全局默认背景）", children: [
        /* @__PURE__ */ jsx("p", { style: {
          margin: "0 0 10px",
          fontSize: 11,
          color: "#555"
        }, children: "保存后前台 Contact Me 窗口打开时默认显示此背景。" }),
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
            background: "#fff"
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
              padding: "12px 16px",
              display: "flex",
              gap: 12,
              flexWrap: "wrap"
            }, children: ["G", "T", "Q"].map((c) => /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3
            }, children: [
              /* @__PURE__ */ jsx("div", { style: {
                width: 24,
                height: 24,
                background: "#d4d0c8",
                border: "1px solid #aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#555"
              }, children: c }),
              /* @__PURE__ */ jsx("div", { style: {
                fontSize: 7,
                color: "#333",
                fontFamily: FONT
              }, children: "Link" })
            ] }, c)) })
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
    showLinksOk && /* @__PURE__ */ jsx(SuccessDialog, { title: "联系方式设置", message: "链接已保存。", detail: "前台 Contact Me 窗口重新打开后即可看到最新效果。", onClose: () => setShowLinksOk(false) }),
    showBgOk && /* @__PURE__ */ jsx(SuccessDialog, { title: "联系方式设置", message: "外观设置已保存。", detail: "重新打开 Contact Me 窗口即可看到背景效果。", onClose: () => setShowBgOk(false) })
  ] });
}
function LinkRow({
  item,
  idx,
  onChange,
  onDelete
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    border: "1px solid #c8c0b0",
    borderRadius: 2,
    padding: "10px 12px",
    marginBottom: 8,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 6
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }, children: [
      /* @__PURE__ */ jsxs("span", { style: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#555"
      }, children: [
        "链接 #",
        idx + 1
      ] }),
      /* @__PURE__ */ jsx(XpButton, { onClick: onDelete, children: /* @__PURE__ */ jsx("span", { style: {
        color: "#990000"
      }, children: "✕ 删除" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "80px 1fr",
      rowGap: 5,
      columnGap: 8,
      alignItems: "center",
      fontSize: 12
    }, children: [
      /* @__PURE__ */ jsx("label", { style: {
        color: "#333"
      }, children: "显示名称：" }),
      /* @__PURE__ */ jsx(XpInput, { value: item.name, onChange: (v) => onChange({
        name: v
      }), placeholder: "如：GitHub" }),
      /* @__PURE__ */ jsx("label", { style: {
        color: "#333"
      }, children: "跳转链接：" }),
      /* @__PURE__ */ jsx(XpInput, { value: item.url, onChange: (v) => onChange({
        url: v
      }), placeholder: "https://... 或 mailto:..." }),
      /* @__PURE__ */ jsx("label", { style: {
        color: "#333"
      }, children: "图标 URL：" }),
      /* @__PURE__ */ jsx(XpInput, { value: item.iconSrc, onChange: (v) => onChange({
        iconSrc: v
      }), placeholder: "/assets/icons/xxx.png 或留空" }),
      /* @__PURE__ */ jsx("label", { style: {
        color: "#333"
      }, children: "Emoji 备用：" }),
      /* @__PURE__ */ jsx(XpInput, { value: item.emoji, onChange: (v) => onChange({
        emoji: v
      }), placeholder: "🌐" }),
      /* @__PURE__ */ jsx("label", { style: {
        color: "#333"
      }, children: "ID（唯一）：" }),
      /* @__PURE__ */ jsx(XpInput, { value: item.id, onChange: (v) => onChange({
        id: v
      }), placeholder: "唯一字符串" })
    ] }),
    (item.iconSrc || item.emoji) && /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 2
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 11,
        color: "#666"
      }, children: "预览：" }),
      item.iconSrc ? /* @__PURE__ */ jsx("img", { src: item.iconSrc, alt: item.name, style: {
        width: 28,
        height: 28,
        objectFit: "contain"
      }, onError: (e) => {
        e.currentTarget.style.opacity = "0.3";
      } }) : /* @__PURE__ */ jsx("span", { style: {
        fontSize: 22
      }, children: item.emoji }),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 12,
        color: "#444"
      }, children: item.name })
    ] })
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
  placeholder
}) {
  return /* @__PURE__ */ jsx("input", { type: "text", value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    width: "100%",
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
  ContactAdminPage as component
};
