import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useEffect, Suspense, lazy } from "react";
import { q as queryClient, t as trpc } from "./router-DlVEEomJ.mjs";
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
const EMPTY = {
  title: "",
  category: "",
  icon: "",
  backgroundImage: "",
  bgOpacity: 1,
  order: 0,
  content: ""
};
function NewBlogPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errorMsg, setErrorMsg] = useState("");
  const set = useCallback((k, v) => {
    setForm((prev) => ({
      ...prev,
      [k]: v
    }));
  }, []);
  const isValid = form.title.trim() && form.content.trim() && form.category.trim() && form.icon.trim();
  const {
    mutate: create,
    isPending
  } = useMutation({
    ...trpc.blog.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.list.queryOptions().queryKey
      });
      queryClient.invalidateQueries({
        queryKey: trpc.site.getBlogPosts.queryOptions().queryKey
      });
      navigate({
        to: "/admin/blog"
      });
    },
    onError: (err) => setErrorMsg(err.message ?? "发布失败，请重试")
  });
  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    setErrorMsg("");
    create({
      title: form.title.trim(),
      category: form.category.trim(),
      icon: form.icon.trim(),
      backgroundImage: form.backgroundImage.trim(),
      bgOpacity: form.bgOpacity,
      order: form.order,
      content: form.content
    });
  }, [create, form, isValid]);
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
          }, children: "新建文章" }),
          /* @__PURE__ */ jsx("p", { style: {
            margin: 0,
            fontSize: 11,
            color: "#555"
          }, children: "撰写并发布一篇新博客文章" })
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
      /* @__PURE__ */ jsx(XpButton, { onClick: handleSubmit, disabled: isPending || !isValid, primary: true, children: isPending ? "发布中…" : "🚀  发布文章" }),
      /* @__PURE__ */ jsx("a", { href: "/admin/blog", style: {
        textDecoration: "none"
      }, children: /* @__PURE__ */ jsx(XpButton, { disabled: isPending, children: "取消" }) })
    ] })
  ] });
}
function EditorArea({
  value,
  onChange
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) {
    return /* @__PURE__ */ jsx("div", { style: {
      height: 400,
      background: "#f8f8f0",
      border: "2px inset #aaa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#888",
      fontSize: 12
    }, children: "编辑器加载中…" });
  }
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { style: {
    height: 400,
    background: "#f8f8f0",
    border: "2px inset #aaa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontSize: 12
  }, children: "编辑器加载中…" }), children: /* @__PURE__ */ jsx("div", { "data-color-mode": "light", style: {
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
  NewBlogPage as component
};
