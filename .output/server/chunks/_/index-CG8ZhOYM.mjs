import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { t as trpc, q as queryClient } from "./router-DHJpsL0Z.mjs";
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
function BlogListPage() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const {
    data: posts = [],
    isPending
  } = useQuery({
    ...trpc.blog.list.queryOptions(),
    staleTime: 0
  });
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
      marginBottom: 16
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 26
        }, children: "📝" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { style: {
            margin: 0,
            fontSize: 15,
            color: "#003399",
            fontWeight: "bold"
          }, children: "博客管理" }),
          /* @__PURE__ */ jsx("p", { style: {
            margin: 0,
            fontSize: 11,
            color: "#555"
          }, children: isPending ? "加载中…" : `共 ${posts.length} 篇文章` })
        ] })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/admin/blog/new", style: {
        textDecoration: "none"
      }, children: /* @__PURE__ */ jsx(XpButton, { primary: true, children: "✚ 新建文章" }) })
    ] }),
    isPending ? /* @__PURE__ */ jsx("div", { style: {
      color: "#555",
      fontSize: 12
    }, children: "正在加载文章列表…" }) : posts.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : /* @__PURE__ */ jsx(PostTable, { posts, onDelete: setDeleteTarget }),
    deleteTarget && /* @__PURE__ */ jsx(DeleteDialog, { post: deleteTarget, onCancel: () => setDeleteTarget(null), onDeleted: () => setDeleteTarget(null) })
  ] });
}
function PostTable({
  posts,
  onDelete
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    border: "2px inset #aaa",
    background: "#fff",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "1fr 80px 110px 48px 120px",
      background: "linear-gradient(180deg,#ddd 0%,#c8c8c8 100%)",
      borderBottom: "1px solid #aaa",
      userSelect: "none"
    }, children: ["标题", "分类", "创建时间", "排序", "操作"].map((col) => /* @__PURE__ */ jsx("div", { style: {
      padding: "3px 8px",
      fontSize: 11,
      fontWeight: "bold",
      color: "#222",
      borderRight: "1px solid #bbb"
    }, children: col }, col)) }),
    posts.map((post, idx) => /* @__PURE__ */ jsx(PostRow, { post, striped: idx % 2 === 1, onDelete }, post.id))
  ] });
}
function PostRow({
  post,
  striped,
  onDelete
}) {
  const [hovered, setHovered] = useState(false);
  const bg = hovered ? "#cce8ff" : striped ? "#f0f0f0" : "#fff";
  const createdStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }) : "—";
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "grid",
    gridTemplateColumns: "1fr 80px 110px 48px 120px",
    background: bg,
    borderBottom: "1px solid #e8e8e8",
    transition: "background 0.05s"
  }, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), children: [
    /* @__PURE__ */ jsxs("div", { style: {
      padding: "5px 8px",
      display: "flex",
      alignItems: "center",
      gap: 6,
      minWidth: 0
    }, children: [
      /* @__PURE__ */ jsx("img", { src: post.icon, alt: "", style: {
        width: 16,
        height: 16,
        objectFit: "contain",
        flexShrink: 0,
        imageRendering: "pixelated"
      }, onError: (e) => {
        e.currentTarget.style.visibility = "hidden";
      } }),
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 12,
        color: "#000",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }, children: post.title })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "5px 8px",
      fontSize: 12,
      color: "#444",
      display: "flex",
      alignItems: "center"
    }, children: post.category }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "5px 8px",
      fontSize: 11,
      color: "#666",
      display: "flex",
      alignItems: "center"
    }, children: createdStr }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "5px 8px",
      fontSize: 12,
      color: "#666",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: post.order }),
    /* @__PURE__ */ jsxs("div", { style: {
      padding: "3px 6px",
      display: "flex",
      alignItems: "center",
      gap: 4
    }, children: [
      /* @__PURE__ */ jsx("a", { href: `/admin/blog/${post.id}`, style: {
        textDecoration: "none"
      }, children: /* @__PURE__ */ jsx(XpButton, { small: true, children: "✏️ 编辑" }) }),
      /* @__PURE__ */ jsx(XpButton, { small: true, danger: true, onClick: () => onDelete(post), children: "🗑️ 删除" })
    ] })
  ] });
}
function EmptyState() {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 0",
    color: "#888",
    border: "2px inset #aaa",
    background: "#fff"
  }, children: [
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 48,
      marginBottom: 12,
      opacity: 0.5
    }, children: "📂" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 4
    }, children: "文件夹为空" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11
    }, children: "还没有任何博客文章，点击「新建文章」开始写作" })
  ] });
}
function DeleteDialog({
  post,
  onCancel,
  onDeleted
}) {
  const {
    mutate: del,
    isPending
  } = useMutation({
    ...trpc.blog.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.list.queryOptions().queryKey
      });
      queryClient.invalidateQueries({
        queryKey: trpc.site.getBlogPosts.queryOptions().queryKey
      });
      onDeleted();
    }
  });
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
      }, children: "确认删除" })
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
        }, children: "⚠️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 13,
            fontWeight: "bold",
            color: "#003",
            marginBottom: 6
          }, children: "确定要永久删除这篇文章吗？" }),
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
            post.title
          ] }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 11,
            color: "#a00"
          }, children: "此操作无法撤销，文章内容将被永久删除。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: () => del({
          id: post.id
        }), disabled: isPending, danger: true, children: isPending ? "删除中…" : "删除" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onCancel, disabled: isPending, children: "取消" })
      ] })
    ] })
  ] }) });
}
function XpButton({
  children,
  onClick,
  disabled,
  primary,
  danger,
  small
}) {
  const [pressed, setPressed] = useState(false);
  const bg = disabled ? "#d4d0c8" : pressed ? "linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)" : danger ? "linear-gradient(180deg,#fce8e8 0%,#f0c0c0 100%)" : primary ? "linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)" : "linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)";
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, disabled, onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false), onMouseLeave: () => setPressed(false), style: {
    height: small ? 20 : 24,
    padding: small ? "0 7px" : "0 12px",
    fontFamily: FONT,
    fontSize: small ? 11 : 12,
    cursor: disabled ? "default" : "pointer",
    border: "2px solid",
    borderColor: pressed ? "#003399 #a0b8e0 #a0b8e0 #003399" : danger ? "#a00000 #f0a0a0 #f0a0a0 #a00000" : "#a0b8e0 #003399 #003399 #a0b8e0",
    background: bg,
    color: disabled ? "#888" : danger ? "#8b0000" : "#000",
    boxShadow: pressed ? "none" : "1px 1px 0 rgba(255,255,255,0.8) inset",
    outline: "none",
    fontWeight: primary ? "bold" : "normal",
    whiteSpace: "nowrap"
  }, children });
}
export {
  BlogListPage as component
};
