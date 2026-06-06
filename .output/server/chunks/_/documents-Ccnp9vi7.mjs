import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, Suspense, lazy } from "react";
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
const MDEditor = lazy(() => import("./index.mjs").then((m) => ({
  default: m.default
})));
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function invalidateDocs() {
  queryClient.invalidateQueries({
    queryKey: trpc.documents.list.queryOptions().queryKey
  });
  queryClient.invalidateQueries({
    queryKey: trpc.site.getDocuments.queryOptions().queryKey
  });
}
function DocumentsPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [showNewOk, setShowNewOk] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [info, setInfo] = useState({
    title: "",
    iconSrc: "",
    order: 0,
    visible: true
  });
  const [content, setContent] = useState("");
  const [appearance, setAppearance] = useState({
    bgUrl: "",
    bgOpacity: 0.12
  });
  const [infoOk, setInfoOk] = useState(false);
  const [infoErr, setInfoErr] = useState("");
  const [contOk, setContOk] = useState(false);
  const [contErr, setContErr] = useState("");
  const [appOk, setAppOk] = useState(false);
  const [appErr, setAppErr] = useState("");
  const {
    data: docs = [],
    isPending
  } = useQuery({
    ...trpc.documents.list.queryOptions(),
    staleTime: 0
  });
  const selectedDoc = docs.find((d) => d.id === selectedId);
  useEffect(() => {
    if (!selectedDoc || selectedId === loadedId) return;
    setInfo({
      title: selectedDoc.title,
      iconSrc: selectedDoc.iconSrc,
      order: selectedDoc.order,
      visible: selectedDoc.visible
    });
    setContent(selectedDoc.content);
    setAppearance({
      bgUrl: selectedDoc.bgUrl,
      bgOpacity: selectedDoc.bgOpacity
    });
    setLoadedId(selectedId);
    setInfoOk(false);
    setInfoErr("");
    setContOk(false);
    setContErr("");
    setAppOk(false);
    setAppErr("");
  }, [selectedId, selectedDoc, loadedId]);
  const {
    mutate: createDoc,
    isPending: isCreating
  } = useMutation(trpc.documents.create.mutationOptions({
    onSuccess: (created) => {
      invalidateDocs();
      if (created) setSelectedId(created.id);
      setLoadedId(null);
      setShowNewOk(true);
      setTimeout(() => setShowNewOk(false), 2e3);
    }
  }));
  const {
    mutate: saveInfo,
    isPending: isSavingInfo
  } = useMutation(trpc.documents.update.mutationOptions({
    onSuccess: () => {
      invalidateDocs();
      setInfoOk(true);
      setInfoErr("");
      setTimeout(() => setInfoOk(false), 2500);
    },
    onError: (e) => {
      setInfoErr(e.message ?? "保存失败");
      setInfoOk(false);
    }
  }));
  const {
    mutate: saveContent,
    isPending: isSavingCont
  } = useMutation(trpc.documents.update.mutationOptions({
    onSuccess: () => {
      invalidateDocs();
      setContOk(true);
      setContErr("");
      setTimeout(() => setContOk(false), 2500);
    },
    onError: (e) => {
      setContErr(e.message ?? "保存失败");
      setContOk(false);
    }
  }));
  const {
    mutate: saveAppearance,
    isPending: isSavingApp
  } = useMutation(trpc.documents.update.mutationOptions({
    onSuccess: () => {
      invalidateDocs();
      setAppOk(true);
      setAppErr("");
      setTimeout(() => setAppOk(false), 2500);
    },
    onError: (e) => {
      setAppErr(e.message ?? "保存失败");
      setAppOk(false);
    }
  }));
  const [deleteTarget, setDeleteTarget] = useState(null);
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    height: "100%",
    fontFamily: FONT,
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      width: 220,
      flexShrink: 0,
      borderRight: "2px inset #aaa",
      display: "flex",
      flexDirection: "column",
      background: "#f5f3ec",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        padding: "10px 10px 6px",
        borderBottom: "1px solid #ccc",
        background: "#ece9d8",
        flexShrink: 0
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 13,
          fontWeight: "bold",
          color: "#003399",
          marginBottom: 6
        }, children: "📄 文档管理" }),
        /* @__PURE__ */ jsx(XpButton, { primary: true, onClick: () => setShowNewDialog(true), children: "✚ 新建文档" }),
        showNewOk && /* @__PURE__ */ jsx("div", { style: {
          fontSize: 11,
          color: "#006400",
          marginTop: 4
        }, children: "✅ 已创建，请编辑内容" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        flex: 1,
        overflowY: "auto"
      }, children: isPending ? /* @__PURE__ */ jsx("div", { style: {
        padding: 12,
        fontSize: 11,
        color: "#888"
      }, children: "加载中…" }) : docs.length === 0 ? /* @__PURE__ */ jsxs("div", { style: {
        padding: 12,
        fontSize: 11,
        color: "#888",
        textAlign: "center"
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 28,
          marginBottom: 6
        }, children: "📂" }),
        "暂无文档，点击「新建文档」开始"
      ] }) : docs.map((doc) => {
        const isSelected = doc.id === selectedId;
        return /* @__PURE__ */ jsxs("div", { onClick: () => setSelectedId(doc.id), style: {
          padding: "7px 10px",
          cursor: "pointer",
          background: isSelected ? "#cce8ff" : "transparent",
          borderLeft: isSelected ? "3px solid #003399" : "3px solid transparent",
          borderBottom: "1px solid #e0ddd5",
          display: "flex",
          alignItems: "center",
          gap: 7
        }, children: [
          doc.iconSrc ? /* @__PURE__ */ jsx("img", { src: doc.iconSrc, alt: "", style: {
            width: 16,
            height: 16,
            objectFit: "contain",
            imageRendering: "pixelated",
            flexShrink: 0
          }, onError: (e) => {
            e.currentTarget.style.visibility = "hidden";
          } }) : /* @__PURE__ */ jsx("span", { style: {
            fontSize: 14,
            flexShrink: 0
          }, children: "📄" }),
          /* @__PURE__ */ jsxs("div", { style: {
            minWidth: 0
          }, children: [
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: 12,
              color: "#000",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }, children: doc.title }),
            /* @__PURE__ */ jsxs("div", { style: {
              fontSize: 10,
              color: doc.visible ? "#006400" : "#888"
            }, children: [
              doc.visible ? "● 可见" : "○ 隐藏",
              " · 排序 ",
              doc.order
            ] })
          ] })
        ] }, doc.id);
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      flex: 1,
      overflowY: "auto",
      padding: "16px 20px"
    }, children: !selectedId ? /* @__PURE__ */ jsx(EmptyEditor, {}) : !selectedDoc && !isPending ? /* @__PURE__ */ jsx("div", { style: {
      fontSize: 12,
      color: "#888",
      padding: 20
    }, children: "文档不存在或已被删除。" }) : !selectedDoc ? null : /* @__PURE__ */ jsxs(Fragment, { children: [
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
            fontSize: 22
          }, children: "✏️" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { style: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#003399"
            }, children: selectedDoc.title }),
            /* @__PURE__ */ jsxs("div", { style: {
              fontSize: 10,
              color: "#888",
              fontFamily: "monospace"
            }, children: [
              "id: ",
              selectedDoc.id
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(XpButton, { danger: true, onClick: () => setDeleteTarget(selectedDoc), children: "🗑️ 删除文档" })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "📄  文档信息", children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 24px"
        }, children: [
          /* @__PURE__ */ jsx(Field, { label: "标题 *", children: /* @__PURE__ */ jsx(XpInput, { value: info.title, onChange: (v) => setInfo((p) => ({
            ...p,
            title: v
          })), placeholder: "文档标题（将显示在窗口标题栏）", width: 280 }) }),
          /* @__PURE__ */ jsx(Field, { label: "图标 URL", children: /* @__PURE__ */ jsx(XpInput, { value: info.iconSrc, onChange: (v) => setInfo((p) => ({
            ...p,
            iconSrc: v
          })), placeholder: "/assets/icons/file.png", width: 280 }) }),
          /* @__PURE__ */ jsxs(Field, { label: "排序", children: [
            /* @__PURE__ */ jsx(XpInput, { value: String(info.order), onChange: (v) => setInfo((p) => ({
              ...p,
              order: parseInt(v) || 0
            })), placeholder: "0", width: 80 }),
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: 11,
              color: "#888",
              marginLeft: 6
            }, children: "数字越小越靠前" })
          ] }),
          /* @__PURE__ */ jsx(Field, { label: "可见性", children: /* @__PURE__ */ jsxs("label", { style: {
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            fontSize: 12
          }, children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: info.visible, onChange: (e) => setInfo((p) => ({
              ...p,
              visible: e.target.checked
            })) }),
            info.visible ? "前台可见" : "已隐藏（前台不显示）"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(SaveRow, { onSave: () => saveInfo({
          id: selectedId,
          title: info.title.trim() || "未命名",
          iconSrc: info.iconSrc.trim(),
          order: info.order,
          visible: info.visible
        }), isPending: isSavingInfo, ok: infoOk, err: infoErr, disabled: !info.title.trim() })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "📝  Markdown 内容", children: [
        /* @__PURE__ */ jsx(EditorArea, { value: content, onChange: setContent }),
        /* @__PURE__ */ jsx("div", { style: {
          marginTop: 8
        }, children: /* @__PURE__ */ jsx(SaveRow, { onSave: () => saveContent({
          id: selectedId,
          content
        }), isPending: isSavingCont, ok: contOk, err: contErr }) })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "🖼️  外观设置", children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "flex-start"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            flex: "1 1 280px"
          }, children: [
            /* @__PURE__ */ jsx(Field, { label: "背景图 URL", children: /* @__PURE__ */ jsx(XpInput, { value: appearance.bgUrl, onChange: (v) => setAppearance((p) => ({
              ...p,
              bgUrl: v
            })), placeholder: "/assets/wallpapers/bg2.jpg（留空则纯白背景）", width: 300 }) }),
            /* @__PURE__ */ jsx(Field, { label: "背景不透明度", children: /* @__PURE__ */ jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 10
            }, children: [
              /* @__PURE__ */ jsx("input", { type: "range", min: 0, max: 1, step: 0.05, value: appearance.bgOpacity, onChange: (e) => setAppearance((p) => ({
                ...p,
                bgOpacity: parseFloat(e.target.value)
              })), style: {
                width: 160,
                cursor: "pointer"
              } }),
              /* @__PURE__ */ jsxs("span", { style: {
                fontSize: 12,
                minWidth: 32,
                color: "#333"
              }, children: [
                (appearance.bgOpacity * 100).toFixed(0),
                "%"
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(AppearancePreview, { bgUrl: appearance.bgUrl, bgOpacity: appearance.bgOpacity, iconSrc: info.iconSrc, title: info.title })
        ] }),
        /* @__PURE__ */ jsx(SaveRow, { onSave: () => saveAppearance({
          id: selectedId,
          bgUrl: appearance.bgUrl.trim(),
          bgOpacity: appearance.bgOpacity
        }), isPending: isSavingApp, ok: appOk, err: appErr })
      ] })
    ] }) }),
    showNewDialog && /* @__PURE__ */ jsx(NewDocDialog, { isPending: isCreating, onCreate: (title, customId) => {
      createDoc({
        title,
        customId: customId || void 0,
        content: "",
        iconSrc: "",
        bgUrl: "",
        bgOpacity: 0.12,
        order: 0,
        visible: true
      });
      setShowNewDialog(false);
    }, onCancel: () => setShowNewDialog(false) }),
    deleteTarget && /* @__PURE__ */ jsx(DeleteDialog, { doc: deleteTarget, onCancel: () => setDeleteTarget(null), onDeleted: () => {
      setDeleteTarget(null);
      setSelectedId(null);
      setLoadedId(null);
    } })
  ] });
}
function NewDocDialog({
  isPending,
  onCreate,
  onCancel
}) {
  const [title, setTitle] = useState("新建文档");
  const [customId, setCustomId] = useState("");
  const idHint = customId.trim() ? `将使用 ID: ${customId.trim()}` : "留空则自动生成 doc-xxxxx";
  const isValidId = !customId.trim() || /^[a-zA-Z0-9_-]+$/.test(customId.trim());
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
    width: 400,
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
      }, children: "新建文档" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "16px 18px 14px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        marginBottom: 12
      }, children: [
        /* @__PURE__ */ jsx("label", { style: {
          fontSize: 12,
          color: "#222",
          display: "block",
          marginBottom: 4
        }, children: "文档标题 *" }),
        /* @__PURE__ */ jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), autoFocus: true, style: {
          width: "100%",
          padding: "3px 6px",
          fontSize: 12,
          fontFamily: FONT,
          border: "2px inset #aaa",
          background: "#fff",
          outline: "none",
          boxSizing: "border-box"
        } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        marginBottom: 6
      }, children: [
        /* @__PURE__ */ jsxs("label", { style: {
          fontSize: 12,
          color: "#222",
          display: "block",
          marginBottom: 4
        }, children: [
          "自定义 ID ",
          /* @__PURE__ */ jsx("span", { style: {
            color: "#888",
            fontWeight: "normal"
          }, children: "（可选）" })
        ] }),
        /* @__PURE__ */ jsx("input", { type: "text", value: customId, onChange: (e) => setCustomId(e.target.value), placeholder: "例如：resume（用于对接前台固定入口）", style: {
          width: "100%",
          padding: "3px 6px",
          fontSize: 12,
          fontFamily: FONT,
          border: `2px inset ${isValidId ? "#aaa" : "#c00"}`,
          background: "#fff",
          outline: "none",
          boxSizing: "border-box"
        } }),
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 10,
          color: isValidId ? "#666" : "#c00",
          marginTop: 3
        }, children: isValidId ? idHint : "ID 只能包含字母、数字、- 和 _" })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#fff8dc",
        border: "1px solid #e0c000",
        borderRadius: 2,
        padding: "6px 10px",
        fontSize: 11,
        color: "#6a4f00",
        marginBottom: 14,
        lineHeight: 1.5
      }, children: [
        "💡 前台 ",
        /* @__PURE__ */ jsx("strong", { children: "Resume 窗口" }),
        "固定对接 ID 为 ",
        /* @__PURE__ */ jsx("code", { style: {
          fontFamily: "monospace",
          background: "#fffbe0",
          padding: "0 3px"
        }, children: "resume" }),
        " 的文档。 如需让简历窗口展示数据库内容，请将此处 ID 填写为 ",
        /* @__PURE__ */ jsx("code", { style: {
          fontFamily: "monospace",
          background: "#fffbe0",
          padding: "0 3px"
        }, children: "resume" }),
        "。"
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { primary: true, disabled: !title.trim() || !isValidId || isPending, onClick: () => onCreate(title.trim(), customId.trim()), children: isPending ? "创建中…" : "✚ 创建" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onCancel, disabled: isPending, children: "取消" })
      ] })
    ] })
  ] }) });
}
function EmptyEditor() {
  return /* @__PURE__ */ jsxs("div", { style: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    userSelect: "none"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 56,
      marginBottom: 16,
      opacity: 0.35
    }, children: "📄" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 4
    }, children: "请从左侧选择文档" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11
    }, children: "或点击「✚ 新建文档」创建第一个文档窗口" })
  ] });
}
function EditorArea({
  value,
  onChange
}) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const placeholder = /* @__PURE__ */ jsx("div", { style: {
    height: 360,
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
  }, children: /* @__PURE__ */ jsx(MDEditor, { value, onChange: (v) => onChange(v ?? ""), height: 360, preview: "live", style: {
    fontFamily: 'Consolas, "Courier New", monospace'
  } }) }) });
}
function AppearancePreview({
  bgUrl,
  bgOpacity,
  iconSrc,
  title
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    flexShrink: 0
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11,
      color: "#666",
      marginBottom: 6
    }, children: "窗口预览" }),
    /* @__PURE__ */ jsxs("div", { style: {
      width: 200,
      border: "2px solid #003399",
      borderRadius: 3,
      overflow: "hidden",
      boxShadow: "2px 2px 6px rgba(0,0,0,0.3)"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 100%)",
        padding: "3px 6px",
        display: "flex",
        alignItems: "center",
        gap: 5
      }, children: [
        iconSrc ? /* @__PURE__ */ jsx("img", { src: iconSrc, alt: "", style: {
          width: 12,
          height: 12,
          imageRendering: "pixelated"
        }, onError: (e) => {
          e.currentTarget.style.display = "none";
        } }) : /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10
        }, children: "📄" }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10,
          color: "#fff",
          fontWeight: "bold",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1
        }, children: title || "未命名" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        background: "#ece9d8",
        borderBottom: "1px solid #aca899",
        padding: "2px 4px",
        fontSize: 9,
        color: "#555"
      }, children: "File  Edit  View  Help" }),
      /* @__PURE__ */ jsxs("div", { style: {
        height: 90,
        position: "relative",
        background: bgUrl ? "#333" : "#f0ede4",
        overflow: "hidden"
      }, children: [
        bgUrl && /* @__PURE__ */ jsx("img", { src: bgUrl, alt: "", style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: bgOpacity
        }, onError: (e) => {
          e.currentTarget.style.display = "none";
        } }),
        /* @__PURE__ */ jsxs("div", { style: {
          position: "absolute",
          inset: 0,
          padding: "6px 8px",
          background: bgUrl ? "rgba(255,255,255,0.82)" : "transparent",
          margin: "6px",
          boxShadow: bgUrl ? "0 0 4px rgba(0,0,0,0.2)" : "none"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            height: 5,
            background: "#c5d0e8",
            borderRadius: 2,
            marginBottom: 4,
            width: "70%"
          } }),
          /* @__PURE__ */ jsx("div", { style: {
            height: 4,
            background: "#e8e8e8",
            borderRadius: 2,
            marginBottom: 3,
            width: "90%"
          } }),
          /* @__PURE__ */ jsx("div", { style: {
            height: 4,
            background: "#e8e8e8",
            borderRadius: 2,
            marginBottom: 3,
            width: "80%"
          } }),
          /* @__PURE__ */ jsx("div", { style: {
            height: 4,
            background: "#e8e8e8",
            borderRadius: 2,
            width: "60%"
          } })
        ] })
      ] })
    ] }),
    !bgUrl && !iconSrc && /* @__PURE__ */ jsx("div", { style: {
      fontSize: 10,
      color: "#aaa",
      marginTop: 4,
      textAlign: "center"
    }, children: "填写 URL 后预览" })
  ] });
}
function SaveRow({
  onSave,
  isPending,
  ok,
  err,
  disabled = false
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 12
  }, children: [
    /* @__PURE__ */ jsx(XpButton, { onClick: onSave, disabled: isPending || disabled, primary: true, children: isPending ? "保存中…" : "💾  保存此区域" }),
    ok && /* @__PURE__ */ jsx("span", { style: {
      fontSize: 11,
      color: "#006400"
    }, children: "✅ 已保存" }),
    err && /* @__PURE__ */ jsxs("span", { style: {
      fontSize: 11,
      color: "#a00"
    }, children: [
      "⚠️ ",
      err
    ] })
  ] });
}
function DeleteDialog({
  doc,
  onCancel,
  onDeleted
}) {
  const {
    mutate: del,
    isPending
  } = useMutation(trpc.documents.delete.mutationOptions({
    onSuccess: () => {
      invalidateDocs();
      onDeleted();
    }
  }));
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
    width: 380,
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
          }, children: "确定要永久删除这个文档吗？" }),
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
            doc.title
          ] }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 11,
            color: "#a00"
          }, children: "此操作无法撤销，文档内容将被永久删除。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: () => del({
          id: doc.id
        }), disabled: isPending, danger: true, children: isPending ? "删除中…" : "删除" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onCancel, disabled: isPending, children: "取消" })
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
      width: 96,
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
  primary,
  danger
}) {
  const [pressed, setPressed] = useState(false);
  const bg = disabled ? "#d4d0c8" : pressed ? "linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)" : danger ? "linear-gradient(180deg,#fce8e8 0%,#f0c0c0 100%)" : primary ? "linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)" : "linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)";
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, disabled, onMouseDown: () => setPressed(true), onMouseUp: () => setPressed(false), onMouseLeave: () => setPressed(false), style: {
    height: 24,
    padding: "0 12px",
    fontFamily: FONT,
    fontSize: 12,
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
  DocumentsPage as component
};
