import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { R as Route, t as trpc, q as queryClient } from "./router-D8BejgbK.mjs";
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
const MDEditor = lazy(() => import("./index.mjs").then((m) => ({
  default: m.default
})));
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function EditBlogPage() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [initialized, setInit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setSuccess] = useState(false);
  const {
    data: posts,
    isPending: isLoading
  } = useQuery({
    ...trpc.blog.list.queryOptions(),
    staleTime: 0
  });
  const post = posts?.find((p) => p.id === id);
  useEffect(() => {
    if (post && !initialized) {
      setForm({
        title: post.title,
        category: post.category,
        icon: post.icon,
        backgroundImage: post.backgroundImage ?? "",
        bgOpacity: post.bgOpacity ?? 1,
        order: post.order ?? 0,
        content: post.content
      });
      setInit(true);
    }
  }, [post, initialized]);
  const set = useCallback((k, v) => {
    setForm((prev) => prev ? {
      ...prev,
      [k]: v
    } : prev);
  }, []);
  const isValid = form && form.title.trim() && form.content.trim() && form.category.trim() && form.icon.trim();
  const {
    mutate: update,
    isPending: isSaving
  } = useMutation({
    ...trpc.blog.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.list.queryOptions().queryKey
      });
      queryClient.invalidateQueries({
        queryKey: trpc.site.getBlogPosts.queryOptions().queryKey
      });
      setErrorMsg("");
      setSuccess(true);
    },
    onError: (err) => setErrorMsg(err.message ?? "保存失败，请重试")
  });
  const handleSave = useCallback(() => {
    if (!isValid || !form) return;
    setErrorMsg("");
    update({
      id,
      title: form.title.trim(),
      category: form.category.trim(),
      icon: form.icon.trim(),
      backgroundImage: form.backgroundImage.trim(),
      bgOpacity: form.bgOpacity,
      order: form.order,
      content: form.content
    });
  }, [update, id, form, isValid]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { style: {
      padding: "20px 24px",
      fontFamily: FONT,
      fontSize: 12,
      color: "#555"
    }, children: "正在加载文章数据…" });
  }
  if (!isLoading && !post) {
    return /* @__PURE__ */ jsxs("div", { style: {
      padding: "20px 24px",
      fontFamily: FONT
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#fff4ce",
        border: "1px solid #e0a000",
        borderRadius: 2,
        padding: "12px 16px",
        maxWidth: 480
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 32
        }, children: "⚠️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 13,
            fontWeight: "bold",
            color: "#7a4900",
            marginBottom: 4
          }, children: "文章不存在" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 11,
            color: "#7a4900"
          }, children: [
            "找不到 id 为 ",
            /* @__PURE__ */ jsx("code", { children: id }),
            " 的文章，可能已被删除。"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        marginTop: 12
      }, children: /* @__PURE__ */ jsx("a", { href: "/admin/blog", style: {
        textDecoration: "none"
      }, children: /* @__PURE__ */ jsx(XpButton, { children: "← 返回列表" }) }) })
    ] });
  }
  if (!form) return null;
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "20px 24px",
    fontFamily: FONT
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "2px solid #2060b8",
      paddingBottom: 10,
      marginBottom: 18
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 26
        }, children: "✏️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { style: {
            margin: 0,
            fontSize: 15,
            color: "#003399",
            fontWeight: "bold"
          }, children: "编辑文章" }),
          /* @__PURE__ */ jsx("p", { style: {
            margin: 0,
            fontSize: 11,
            color: "#555"
          }, children: post?.title ?? id })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/admin/blog", style: {
        textDecoration: "none"
      }, children: /* @__PURE__ */ jsx(XpButton, { children: "← 返回列表" }) })
    ] }),
    /* @__PURE__ */ jsx(Section, { title: "📄  基本信息", children: /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px 24px"
    }, children: [
      /* @__PURE__ */ jsx(Field, { label: "标题 *", children: /* @__PURE__ */ jsx(XpInput, { value: form.title, onChange: (v) => set("title", v), placeholder: "文章标题" }) }),
      /* @__PURE__ */ jsx(Field, { label: "分类 *", children: /* @__PURE__ */ jsx(XpInput, { value: form.category, onChange: (v) => set("category", v), placeholder: "技术 / 生活 / 随笔" }) }),
      /* @__PURE__ */ jsxs(Field, { label: "排序", children: [
        /* @__PURE__ */ jsx(XpInput, { value: String(form.order), onChange: (v) => set("order", parseInt(v) || 0), placeholder: "0", width: 80 }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 11,
          color: "#888",
          marginLeft: 6
        }, children: "数字越小越靠前" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "🖼️  视觉设置", children: /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: 24,
      flexWrap: "wrap"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        flex: "1 1 300px"
      }, children: [
        /* @__PURE__ */ jsx(Field, { label: "图标 URL *", children: /* @__PURE__ */ jsx(XpInput, { value: form.icon, onChange: (v) => set("icon", v), placeholder: "/assets/icons/Blog.png", width: 300 }) }),
        /* @__PURE__ */ jsx(Field, { label: "背景图 URL", children: /* @__PURE__ */ jsx(XpInput, { value: form.backgroundImage, onChange: (v) => set("backgroundImage", v), placeholder: "/assets/wallpapers/bg4.jpg （留空则无背景）", width: 300 }) }),
        /* @__PURE__ */ jsx(Field, { label: "背景不透明度", children: /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 10
        }, children: [
          /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 1, step: 0.05, value: form.bgOpacity, onChange: (e) => set("bgOpacity", parseFloat(e.target.value)), style: {
            width: 160,
            cursor: "pointer"
          } }),
          /* @__PURE__ */ jsxs("span", { style: {
            fontSize: 12,
            minWidth: 32,
            color: "#333"
          }, children: [
            (form.bgOpacity * 100).toFixed(0),
            "%"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(VisualPreview, { icon: form.icon, bg: form.backgroundImage, opacity: form.bgOpacity })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "📝  文章内容 *", children: /* @__PURE__ */ jsx(EditorArea, { value: form.content, onChange: (v) => set("content", v) }) }),
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
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }, children: [
      !isValid && /* @__PURE__ */ jsx("span", { style: {
        fontSize: 11,
        color: "#888",
        alignSelf: "center",
        marginRight: 8
      }, children: "* 标题、分类、图标、内容为必填项" }),
      /* @__PURE__ */ jsx(XpButton, { onClick: handleSave, disabled: isSaving || !isValid, primary: true, children: isSaving ? "保存中…" : "💾  保存修改" }),
      /* @__PURE__ */ jsx("a", { href: "/admin/blog", style: {
        textDecoration: "none"
      }, children: /* @__PURE__ */ jsx(XpButton, { disabled: isSaving, children: "取消" }) })
    ] }),
    showSuccess && /* @__PURE__ */ jsx(SuccessDialog, { title: form.title, onClose: () => setSuccess(false), onBack: () => navigate({
      to: "/admin/blog"
    }) })
  ] });
}
function EditorArea({
  value,
  onChange
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const placeholder = /* @__PURE__ */ jsx("div", { style: {
    height: 400,
    background: "#f8f8f0",
    border: "2px inset #aaa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: 12
  }, children: "编辑器加载中…" });
  if (!isMounted) return placeholder;
  return /* @__PURE__ */ jsx(Suspense, { fallback: placeholder, children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", style: {
    border: "2px inset #aaa"
  }, children: /* @__PURE__ */ jsx(MDEditor, { value, onChange: (v) => onChange(v ?? ""), height: 400, preview: "live", style: {
    fontFamily: 'Consolas, "Courier New", monospace'
  } }) }) });
}
function VisualPreview({
  icon,
  bg,
  opacity
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    flexShrink: 0
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11,
      color: "#666",
      marginBottom: 6
    }, children: "卡片预览" }),
    /* @__PURE__ */ jsxs("div", { style: {
      width: 160,
      height: 90,
      border: "2px inset #aaa",
      borderRadius: 2,
      overflow: "hidden",
      position: "relative",
      background: "#333"
    }, children: [
      bg && /* @__PURE__ */ jsx("img", { src: bg, alt: "", style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity
      }, onError: (e) => {
        e.currentTarget.style.display = "none";
      } }),
      icon && /* @__PURE__ */ jsx("img", { src: icon, alt: "", style: {
        position: "absolute",
        bottom: 6,
        right: 6,
        width: 28,
        height: 28,
        objectFit: "contain",
        imageRendering: "pixelated",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))"
      }, onError: (e) => {
        e.currentTarget.style.display = "none";
      } }),
      !bg && !icon && /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: 10
      }, children: "填写 URL 后预览" })
    ] })
  ] });
}
function SuccessDialog({
  title,
  onClose,
  onBack
}) {
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontFamily: FONT
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    width: 360,
    border: "2px solid #00378a",
    borderRadius: 4,
    boxShadow: "4px 4px 12px rgba(0,0,0,0.5)",
    overflow: "hidden"
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
      }, children: "博客管理" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "18px 20px 14px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 18
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 36,
          lineHeight: 1,
          flexShrink: 0
        }, children: "✅" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 13,
            fontWeight: "bold",
            color: "#003",
            marginBottom: 4
          }, children: "文章已更新" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 12,
            color: "#222",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "4px 8px",
            borderRadius: 2,
            marginBottom: 6
          }, children: [
            "📄 ",
            title
          ] }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }, children: "修改已写入数据库，前台阅读器刷新后即可看到最新内容。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: onClose, primary: true, children: "继续编辑" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onBack, children: "返回列表" })
      ] })
    ] })
  ] }) });
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
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap"
  }, children: [
    /* @__PURE__ */ jsxs("label", { style: {
      fontSize: 12,
      color: "#222",
      width: 104,
      flexShrink: 0
    }, children: [
      label,
      "："
    ] }),
    children
  ] });
}
function XpInput({
  value,
  onChange,
  placeholder,
  width = 240
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
    minWidth: primary ? 110 : 72,
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
    fontWeight: primary ? "bold" : "normal",
    whiteSpace: "nowrap"
  }, children });
}
export {
  EditBlogPage as component
};
