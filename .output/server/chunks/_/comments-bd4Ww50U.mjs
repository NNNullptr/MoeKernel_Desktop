import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { t as trpc, q as queryClient } from "./router-D8BejgbK.mjs";
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
const GISCUS_EMPTY = {
  repo: "",
  repoId: "",
  category: "",
  categoryId: "",
  mapping: "pathname",
  theme: "preferred_color_scheme",
  lang: "zh-CN"
};
const WALINE_EMPTY = {
  serverUrl: "",
  path: "",
  lang: "zh-CN"
};
function CommentsPage() {
  const [provider, setProvider] = useState("disabled");
  const [giscus, setGiscus] = useState(GISCUS_EMPTY);
  const [waline, setWaline] = useState(WALINE_EMPTY);
  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const {
    data: settings,
    isPending: isLoading
  } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0
  });
  useEffect(() => {
    if (settings && !initialized) {
      const p = settings["comment_provider"] ?? "disabled";
      setProvider(["giscus", "waline"].includes(p) ? p : "disabled");
      setGiscus({
        repo: settings["comment_giscus_repo"] ?? "",
        repoId: settings["comment_giscus_repo_id"] ?? "",
        category: settings["comment_giscus_category"] ?? "",
        categoryId: settings["comment_giscus_category_id"] ?? "",
        mapping: settings["comment_giscus_mapping"] ?? "pathname",
        theme: settings["comment_giscus_theme"] ?? "preferred_color_scheme",
        lang: settings["comment_giscus_lang"] ?? "zh-CN"
      });
      setWaline({
        serverUrl: settings["comment_waline_server_url"] ?? "",
        path: settings["comment_waline_path"] ?? "",
        lang: settings["comment_waline_lang"] ?? "zh-CN"
      });
      setInitialized(true);
    }
  }, [settings, initialized]);
  const {
    mutate: save,
    isPending: isSaving
  } = useMutation({
    ...trpc.settings.setBatch.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.site.getSettings.queryOptions().queryKey
      });
      setErrorMsg("");
      setShowSuccess(true);
    },
    onError: (err) => setErrorMsg(err.message ?? "保存失败，请重试")
  });
  const handleSave = useCallback(() => {
    save({
      comment_provider: provider,
      comment_giscus_repo: giscus.repo.trim(),
      comment_giscus_repo_id: giscus.repoId.trim(),
      comment_giscus_category: giscus.category.trim(),
      comment_giscus_category_id: giscus.categoryId.trim(),
      comment_giscus_mapping: giscus.mapping,
      comment_giscus_theme: giscus.theme,
      comment_giscus_lang: giscus.lang.trim(),
      comment_waline_server_url: waline.serverUrl.trim(),
      comment_waline_path: waline.path.trim(),
      comment_waline_lang: waline.lang.trim()
    });
  }, [save, provider, giscus, waline]);
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "20px 24px",
    fontFamily: FONT
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
        }, children: "评论系统" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#555"
        }, children: "选择评论方案并填写配置参数，保存后前台博客底部自动显示评论区" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { style: {
      fontSize: 12,
      color: "#555"
    }, children: "正在加载配置…" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Section, { title: "📦  评论方案", children: [
        /* @__PURE__ */ jsx(FieldRow, { label: "当前方案", children: /* @__PURE__ */ jsxs("select", { value: provider, onChange: (e) => setProvider(e.target.value), style: {
          padding: "3px 6px",
          fontSize: 12,
          fontFamily: FONT,
          border: "2px inset #aaa",
          background: "#fff",
          outline: "none",
          cursor: "pointer",
          minWidth: 180
        }, children: [
          /* @__PURE__ */ jsx("option", { value: "disabled", children: "🚫  关闭（不显示评论）" }),
          /* @__PURE__ */ jsx("option", { value: "giscus", children: "💬  Giscus（基于 GitHub Discussions）" }),
          /* @__PURE__ */ jsx("option", { value: "waline", children: "✍️  Waline（自部署评论服务）" })
        ] }) }),
        /* @__PURE__ */ jsx(ProviderBadge, { provider })
      ] }),
      provider === "giscus" && /* @__PURE__ */ jsxs(Section, { title: "⚙️  Giscus 配置", children: [
        /* @__PURE__ */ jsx(GiscusGuide, {}),
        /* @__PURE__ */ jsxs(FieldRow, { label: "repo *", children: [
          /* @__PURE__ */ jsx(XpInput, { value: giscus.repo, onChange: (v) => setGiscus((p) => ({
            ...p,
            repo: v
          })), placeholder: "owner/repo-name", width: 280 }),
          /* @__PURE__ */ jsx(Hint, { children: "GitHub 仓库路径，格式：用户名/仓库名" })
        ] }),
        /* @__PURE__ */ jsxs(FieldRow, { label: "repo-id *", children: [
          /* @__PURE__ */ jsx(XpInput, { value: giscus.repoId, onChange: (v) => setGiscus((p) => ({
            ...p,
            repoId: v
          })), placeholder: "R_kgDO...", width: 280, mono: true }),
          /* @__PURE__ */ jsx(Hint, { children: "仓库 ID，在 giscus.app 生成脚本中获取" })
        ] }),
        /* @__PURE__ */ jsxs(FieldRow, { label: "category *", children: [
          /* @__PURE__ */ jsx(XpInput, { value: giscus.category, onChange: (v) => setGiscus((p) => ({
            ...p,
            category: v
          })), placeholder: "Announcements", width: 200 }),
          /* @__PURE__ */ jsx(Hint, { children: "Discussion 分类名称" })
        ] }),
        /* @__PURE__ */ jsxs(FieldRow, { label: "category-id *", children: [
          /* @__PURE__ */ jsx(XpInput, { value: giscus.categoryId, onChange: (v) => setGiscus((p) => ({
            ...p,
            categoryId: v
          })), placeholder: "DIC_kwDO...", width: 280, mono: true }),
          /* @__PURE__ */ jsx(Hint, { children: "分类 ID，在 giscus.app 生成脚本中获取" })
        ] }),
        /* @__PURE__ */ jsx(FieldRow, { label: "页面映射", children: /* @__PURE__ */ jsx(XpSelect, { value: giscus.mapping, onChange: (v) => setGiscus((p) => ({
          ...p,
          mapping: v
        })), options: [{
          value: "pathname",
          label: "pathname（推荐）"
        }, {
          value: "url",
          label: "url"
        }, {
          value: "title",
          label: "title"
        }, {
          value: "og:title",
          label: "og:title"
        }] }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "主题", children: /* @__PURE__ */ jsx(XpSelect, { value: giscus.theme, onChange: (v) => setGiscus((p) => ({
          ...p,
          theme: v
        })), options: [{
          value: "preferred_color_scheme",
          label: "跟随系统（推荐）"
        }, {
          value: "light",
          label: "light"
        }, {
          value: "dark",
          label: "dark"
        }, {
          value: "dark_dimmed",
          label: "dark_dimmed"
        }, {
          value: "transparent_dark",
          label: "transparent_dark"
        }] }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "语言", children: /* @__PURE__ */ jsx(XpInput, { value: giscus.lang, onChange: (v) => setGiscus((p) => ({
          ...p,
          lang: v
        })), placeholder: "zh-CN", width: 100 }) })
      ] }),
      provider === "waline" && /* @__PURE__ */ jsxs(Section, { title: "⚙️  Waline 配置", children: [
        /* @__PURE__ */ jsx(WalineGuide, {}),
        /* @__PURE__ */ jsxs(FieldRow, { label: "Server URL *", children: [
          /* @__PURE__ */ jsx(XpInput, { value: waline.serverUrl, onChange: (v) => setWaline((p) => ({
            ...p,
            serverUrl: v
          })), placeholder: "https://waline.example.com", width: 320 }),
          /* @__PURE__ */ jsx(Hint, { children: "Waline 服务端地址（需自行部署）" })
        ] }),
        /* @__PURE__ */ jsx(FieldRow, { label: "path", children: /* @__PURE__ */ jsx(XpInput, { value: waline.path, onChange: (v) => setWaline((p) => ({
          ...p,
          path: v
        })), placeholder: "留空则自动使用页面路径", width: 280 }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "语言", children: /* @__PURE__ */ jsx(XpInput, { value: waline.lang, onChange: (v) => setWaline((p) => ({
          ...p,
          lang: v
        })), placeholder: "zh-CN", width: 100 }) })
      ] }),
      /* @__PURE__ */ jsx(Section, { title: "🔑  存储的配置 Key（site_settings 表）", children: /* @__PURE__ */ jsx(KeyPreview, { provider, giscus, waline }) }),
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
        gap: 8,
        marginTop: 4
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: handleSave, disabled: isSaving, primary: true, children: isSaving ? "保存中…" : "💾  保存配置" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: () => setInitialized(false), disabled: isSaving, children: "重置" })
      ] })
    ] }),
    showSuccess && /* @__PURE__ */ jsx(SuccessDialog, { onClose: () => setShowSuccess(false) })
  ] });
}
function ProviderBadge({
  provider
}) {
  const map = {
    disabled: {
      color: "#a00",
      bg: "#fff0f0",
      border: "#fca0a0",
      text: "🚫  评论区已关闭，博客页面底部不显示任何评论组件"
    },
    giscus: {
      color: "#005c00",
      bg: "#f0fff0",
      border: "#80c080",
      text: "✅  评论将由 Giscus 提供，数据存储于 GitHub Discussions"
    },
    waline: {
      color: "#003a7a",
      bg: "#f0f4ff",
      border: "#a0b8e0",
      text: "✅  评论将由 Waline 提供，数据存储于你的自部署服务"
    }
  }[provider];
  return /* @__PURE__ */ jsx("div", { style: {
    marginTop: 8,
    padding: "6px 10px",
    background: map.bg,
    border: `1px solid ${map.border}`,
    borderRadius: 2,
    fontSize: 11,
    color: map.color
  }, children: map.text });
}
function KeyPreview({
  provider,
  giscus,
  waline
}) {
  const rows = [["comment_provider", provider], ...provider === "giscus" ? [["comment_giscus_repo", giscus.repo || "（未填）"], ["comment_giscus_repo_id", giscus.repoId || "（未填）"], ["comment_giscus_category", giscus.category || "（未填）"], ["comment_giscus_category_id", giscus.categoryId || "（未填）"], ["comment_giscus_mapping", giscus.mapping], ["comment_giscus_theme", giscus.theme], ["comment_giscus_lang", giscus.lang || "zh-CN"]] : [], ...provider === "waline" ? [["comment_waline_server_url", waline.serverUrl || "（未填）"], ["comment_waline_path", waline.path || "（自动）"], ["comment_waline_lang", waline.lang || "zh-CN"]] : []];
  return /* @__PURE__ */ jsx("div", { style: {
    background: "#fff",
    border: "2px inset #aaa",
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: 11,
    lineHeight: 1.7,
    padding: "6px 10px"
  }, children: rows.map(([k, v]) => /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    gap: 8
  }, children: [
    /* @__PURE__ */ jsx("span", { style: {
      color: "#2060b8",
      minWidth: 240,
      flexShrink: 0
    }, children: k }),
    /* @__PURE__ */ jsx("span", { style: {
      color: "#333"
    }, children: "=" }),
    /* @__PURE__ */ jsx("span", { style: {
      color: v.startsWith("（") ? "#aaa" : "#060",
      wordBreak: "break-all"
    }, children: v })
  ] }, k)) });
}
function GiscusGuide() {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#f8f8f0",
    border: "1px solid #c8c080",
    borderRadius: 2,
    padding: "8px 10px",
    marginBottom: 12,
    fontSize: 11,
    color: "#444",
    lineHeight: 1.7
  }, children: [
    "📋 ",
    /* @__PURE__ */ jsx("strong", { children: "如何获取 repo-id 和 category-id：" }),
    /* @__PURE__ */ jsx("br", {}),
    "1. 在 GitHub 仓库中开启 Discussions 功能",
    /* @__PURE__ */ jsx("br", {}),
    "2. 访问 ",
    /* @__PURE__ */ jsx("code", { style: {
      background: "#eee",
      padding: "0 3px"
    }, children: "giscus.app" }),
    "， 输入仓库名后自动生成配置脚本",
    /* @__PURE__ */ jsx("br", {}),
    "3. 从脚本中复制 ",
    /* @__PURE__ */ jsx("code", { style: {
      background: "#eee",
      padding: "0 3px"
    }, children: "data-repo-id" }),
    " 和",
    " ",
    /* @__PURE__ */ jsx("code", { style: {
      background: "#eee",
      padding: "0 3px"
    }, children: "data-category-id" }),
    " 的值粘贴到此处"
  ] });
}
function WalineGuide() {
  return /* @__PURE__ */ jsxs("div", { style: {
    background: "#f8f8f0",
    border: "1px solid #c8c080",
    borderRadius: 2,
    padding: "8px 10px",
    marginBottom: 12,
    fontSize: 11,
    color: "#444",
    lineHeight: 1.7
  }, children: [
    "📋 ",
    /* @__PURE__ */ jsx("strong", { children: "如何部署 Waline 服务端：" }),
    /* @__PURE__ */ jsx("br", {}),
    "推荐使用 Vercel 一键部署 + LeanCloud 存储数据（免费）。",
    /* @__PURE__ */ jsx("br", {}),
    "访问 ",
    /* @__PURE__ */ jsx("code", { style: {
      background: "#eee",
      padding: "0 3px"
    }, children: "waline.js.org/guide/get-started" }),
    " 查看完整教程， 部署完成后将服务地址填入下方 Server URL。"
  ] });
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
    zIndex: 9999,
    fontFamily: FONT
  }, children: /* @__PURE__ */ jsxs("div", { style: {
    width: 340,
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
      }, children: "评论系统" })
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
          }, children: "配置已保存" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }, children: [
            "评论系统配置已写入数据库。",
            /* @__PURE__ */ jsx("br", {}),
            "前台博客页面刷新后即可看到评论区（Phase 4 接入后生效）。"
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
    gap: 8,
    marginBottom: 9,
    flexWrap: "wrap"
  }, children: [
    /* @__PURE__ */ jsxs("label", { style: {
      fontSize: 12,
      color: "#222",
      width: 108,
      flexShrink: 0
    }, children: [
      label,
      "："
    ] }),
    children
  ] });
}
function Hint({
  children
}) {
  return /* @__PURE__ */ jsx("span", { style: {
    fontSize: 10,
    color: "#888",
    marginLeft: 4
  }, children });
}
function XpInput({
  value,
  onChange,
  placeholder,
  width = 260,
  mono = false
}) {
  return /* @__PURE__ */ jsx("input", { type: "text", value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    width,
    padding: "3px 6px",
    fontSize: 12,
    fontFamily: mono ? 'Consolas, "Courier New", monospace' : FONT,
    border: "2px inset #aaa",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box"
  } });
}
function XpSelect({
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsx("select", { value, onChange: (e) => onChange(e.target.value), style: {
    padding: "3px 6px",
    fontSize: 12,
    fontFamily: FONT,
    border: "2px inset #aaa",
    background: "#fff",
    outline: "none",
    cursor: "pointer"
  }, children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) });
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
export {
  CommentsPage as component
};
