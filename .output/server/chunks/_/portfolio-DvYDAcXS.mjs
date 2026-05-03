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
const EMPTY_FORM = {
  title: "",
  description: "",
  techStack: "",
  link: "",
  imageUrl: "",
  category: "",
  order: 0,
  visible: true
};
function PortfolioAdminPage() {
  const qc = useQueryClient();
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.2);
  const [bgInit, setBgInit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showEditor, setShowEditor] = useState(false);
  const [confirmDelId, setConfirmDelId] = useState(null);
  const listQueryKey = trpc.portfolio.listAll.queryOptions().queryKey;
  const {
    data: items = [],
    isLoading
  } = useQuery({
    ...trpc.portfolio.listAll.queryOptions(),
    staleTime: 0
  });
  const {
    data: settings
  } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0
  });
  useEffect(() => {
    if (settings && !bgInit) {
      setBgUrl(settings["portfolio_bg_url"] ?? "");
      const raw = settings["portfolio_bg_opacity"];
      setBgOpacity(raw ? parseFloat(raw) : 0.2);
      setBgInit(true);
    }
  }, [settings, bgInit]);
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
  const handleSaveAppearance = useCallback(() => {
    saveAppearance({
      portfolio_bg_url: bgUrl.trim(),
      portfolio_bg_opacity: String(bgOpacity)
    });
  }, [saveAppearance, bgUrl, bgOpacity]);
  const {
    mutate: createItem
  } = useMutation(trpc.portfolio.create.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: listQueryKey
      });
      closeEditor();
    }
  }));
  const {
    mutate: updateItem
  } = useMutation(trpc.portfolio.update.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: listQueryKey
      });
      closeEditor();
    }
  }));
  const {
    mutate: deleteItem
  } = useMutation(trpc.portfolio.delete.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: listQueryKey
      });
      setConfirmDelId(null);
    }
  }));
  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowEditor(true);
  }
  function openEdit(item) {
    setEditId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      techStack: item.techStack,
      link: item.link ?? "",
      imageUrl: item.imageUrl,
      category: item.category,
      order: item.order,
      visible: item.visible
    });
    setShowEditor(true);
  }
  function closeEditor() {
    setShowEditor(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }
  function handleSubmit() {
    const payload = {
      ...form,
      link: form.link?.trim() || void 0
    };
    if (editId) {
      updateItem({
        id: editId,
        ...payload
      });
    } else {
      createItem(payload);
    }
  }
  function setField(key, val) {
    setForm((f) => ({
      ...f,
      [key]: val
    }));
  }
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
      }, children: "🗂️" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: {
          margin: 0,
          fontSize: 15,
          color: "#003399",
          fontWeight: "bold"
        }, children: "作品集管理" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#555"
        }, children: "管理作品条目、技术栈标签，并配置作品集窗口全局默认背景" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "📋  作品条目管理", children: [
      /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: 10
      }, children: /* @__PURE__ */ jsx(XpButton, { onClick: openCreate, primary: true, children: "➕ 新增作品" }) }),
      isLoading ? /* @__PURE__ */ jsx("div", { style: {
        fontSize: 12,
        color: "#666",
        padding: "8px 0"
      }, children: "加载中…" }) : items.length === 0 ? /* @__PURE__ */ jsx("div", { style: {
        fontSize: 12,
        color: "#888",
        padding: "8px 0"
      }, children: "暂无作品条目。点击「新增作品」添加第一个。" }) : /* @__PURE__ */ jsx("div", { style: {
        maxHeight: 400,
        overflowY: "auto"
      }, children: items.map((item) => /* @__PURE__ */ jsx(ItemRow, { item, confirmingDelete: confirmDelId === item.id, onEdit: () => openEdit(item), onDeleteRequest: () => setConfirmDelId(item.id), onDeleteConfirm: () => deleteItem({
        id: item.id
      }), onDeleteCancel: () => setConfirmDelId(null) }, item.id)) })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "🎨  外观设置（全局默认背景）", children: [
      /* @__PURE__ */ jsx("p", { style: {
        margin: "0 0 10px",
        fontSize: 11,
        color: "#555"
      }, children: "保存后前台作品集窗口打开时默认显示此背景。" }),
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
          }, children: "示例作品卡片" }) })
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
      }, children: /* @__PURE__ */ jsx(XpButton, { onClick: handleSaveAppearance, disabled: isSaving, primary: true, children: isSaving ? "保存中…" : "💾  保存外观" }) })
    ] }),
    showEditor && /* @__PURE__ */ jsx(EditorDialog, { editId, form, setField, onSubmit: handleSubmit, onCancel: closeEditor }),
    showSuccess && /* @__PURE__ */ jsx(SuccessDialog, { onClose: () => setShowSuccess(false) })
  ] });
}
function ItemRow({
  item,
  confirmingDelete,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel
}) {
  const tags = item.techStack.split(",").map((t) => t.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
    padding: "7px 8px",
    background: item.visible ? "#fff" : "#f5f5f5",
    border: `1px solid ${item.visible ? "#d4d0c8" : "#b8b8b8"}`,
    borderRadius: 2,
    marginBottom: 5
  }, children: [
    item.imageUrl ? /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.title, style: {
      width: 48,
      height: 36,
      objectFit: "cover",
      border: "1px solid #ccc",
      borderRadius: 2,
      flexShrink: 0
    }, onError: (e) => {
      e.currentTarget.style.display = "none";
    } }) : /* @__PURE__ */ jsx("div", { style: {
      width: 48,
      height: 36,
      background: "#e8eef8",
      border: "1px dashed #b0b8c8",
      borderRadius: 2,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16
    }, children: "🖼️" }),
    /* @__PURE__ */ jsxs("div", { style: {
      flex: 1,
      minWidth: 0
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginBottom: 2
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#003c7e",
          fontFamily: FONT
        }, children: item.title }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10,
          color: "#fff",
          background: "#5a7fb5",
          borderRadius: 2,
          padding: "0 5px",
          lineHeight: "16px"
        }, children: item.category || "无分类" }),
        !item.visible && /* @__PURE__ */ jsx("span", { style: {
          fontSize: 10,
          color: "#888",
          background: "#e0e0e0",
          borderRadius: 2,
          padding: "0 5px",
          lineHeight: "16px"
        }, children: "已隐藏" }),
        /* @__PURE__ */ jsxs("span", { style: {
          fontSize: 10,
          color: "#999"
        }, children: [
          "排序 ",
          item.order
        ] })
      ] }),
      item.description && /* @__PURE__ */ jsx("div", { style: {
        fontSize: 11,
        color: "#555",
        fontFamily: FONT,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 360,
        lineHeight: 1.4
      }, children: item.description }),
      tags.length > 0 && /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        marginTop: 3
      }, children: tags.map((t) => /* @__PURE__ */ jsx("span", { style: {
        fontSize: 10,
        color: "#336",
        background: "#e8ecf8",
        border: "1px solid #c8d0e8",
        borderRadius: 2,
        padding: "0 4px"
      }, children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: 4,
      flexShrink: 0,
      alignItems: "center"
    }, children: [
      /* @__PURE__ */ jsx(ActionBtn, { onClick: onEdit, children: "✏️ 编辑" }),
      confirmingDelete ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(ActionBtn, { onClick: onDeleteConfirm, danger: true, children: "确认删除" }),
        /* @__PURE__ */ jsx(ActionBtn, { onClick: onDeleteCancel, children: "取消" })
      ] }) : /* @__PURE__ */ jsx(ActionBtn, { onClick: onDeleteRequest, danger: true, children: "🗑️ 删除" })
    ] })
  ] });
}
function EditorDialog({
  editId,
  form,
  setField,
  onSubmit,
  onCancel
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
    width: 540,
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
      }, children: editId ? "编辑作品" : "新增作品" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "14px 18px"
    }, children: [
      /* @__PURE__ */ jsx(EditorField, { label: "标题 *", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.title, onChange: (e) => setField("title", e.target.value), style: inputStyle, placeholder: "作品名称" }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "分类", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.category, onChange: (e) => setField("category", e.target.value), style: inputStyle, placeholder: "如：Web Design / Full-Stack / Illustration" }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "图片 URL", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.imageUrl, onChange: (e) => setField("imageUrl", e.target.value), style: inputStyle, placeholder: "https://example.com/work.jpg" }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "项目链接", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.link ?? "", onChange: (e) => setField("link", e.target.value), style: inputStyle, placeholder: "https://github.com/... （留空则不显示）" }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "技术栈", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.techStack, onChange: (e) => setField("techStack", e.target.value), style: inputStyle, placeholder: "React, TypeScript, Drizzle（逗号分隔）" }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "描述", children: /* @__PURE__ */ jsx("textarea", { value: form.description, onChange: (e) => setField("description", e.target.value), rows: 3, style: {
        ...inputStyle,
        resize: "vertical",
        height: "auto",
        width: 360
      }, placeholder: "作品详情描述，灯箱中显示" }) }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 24,
        marginBottom: 10
      }, children: [
        /* @__PURE__ */ jsx(EditorField, { label: "排序", children: /* @__PURE__ */ jsx("input", { type: "number", value: form.order, onChange: (e) => setField("order", parseInt(e.target.value, 10) || 0), style: {
          ...inputStyle,
          width: 70
        } }) }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 6
        }, children: /* @__PURE__ */ jsxs("label", { style: {
          fontSize: 12,
          color: "#222"
        }, children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.visible, onChange: (e) => setField("visible", e.target.checked), style: {
            marginRight: 4
          } }),
          "显示（visible）"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 4
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: onCancel, children: "取消" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onSubmit, primary: true, disabled: !form.title.trim(), children: editId ? "💾 保存" : "➕ 创建" })
      ] })
    ] })
  ] }) });
}
const inputStyle = {
  width: 360,
  padding: "3px 6px",
  fontSize: 12,
  fontFamily: FONT,
  border: "2px inset #aaa",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box"
};
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
function EditorField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8
  }, children: [
    /* @__PURE__ */ jsxs("label", { style: {
      fontSize: 12,
      color: "#222",
      width: 72,
      flexShrink: 0,
      paddingTop: 4
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
      }, children: "作品集管理" })
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
            "重新打开作品集窗口即可看到效果。"
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
  PortfolioAdminPage as component
};
