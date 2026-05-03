import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
function invalidateIcons() {
  queryClient.invalidateQueries({
    queryKey: trpc.settings.listAllIcons.queryOptions().queryKey
  });
  queryClient.invalidateQueries({
    queryKey: trpc.site.getDesktopIcons.queryOptions().queryKey
  });
}
function IconsPage() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const {
    data: icons = [],
    isPending
  } = useQuery({
    ...trpc.settings.listAllIcons.queryOptions(),
    staleTime: 0
  });
  const visibleCount = icons.filter((i) => i.visible).length;
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
      marginBottom: 14
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 26
        }, children: "🖥️" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { style: {
            margin: 0,
            fontSize: 15,
            color: "#003399",
            fontWeight: "bold"
          }, children: "桌面图标管理" }),
          /* @__PURE__ */ jsx("p", { style: {
            margin: 0,
            fontSize: 11,
            color: "#555"
          }, children: isPending ? "加载中…" : `共 ${icons.length} 个图标，${visibleCount} 个可见，${icons.length - visibleCount} 个已隐藏` })
        ] })
      ] }),
      /* @__PURE__ */ jsx(XpButton, { primary: true, onClick: () => setShowAdd(true), children: "✚ 添加图标" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#f0f4ff",
      border: "1px solid #a0b8e0",
      borderRadius: 2,
      padding: "6px 10px",
      marginBottom: 12,
      fontSize: 11,
      color: "#224",
      lineHeight: 1.6
    }, children: [
      "💡 ",
      /* @__PURE__ */ jsx("strong", { children: "图标 ID" }),
      " 须与 ",
      /* @__PURE__ */ jsx("code", { style: {
        background: "#e8eef8",
        padding: "0 3px"
      }, children: "APP_REGISTRY" }),
      " 中的键名完全一致（如",
      " ",
      /* @__PURE__ */ jsx("code", { style: {
        background: "#e8eef8",
        padding: "0 3px"
      }, children: "myComputer" }),
      "、",
      /* @__PURE__ */ jsx("code", { style: {
        background: "#e8eef8",
        padding: "0 3px"
      }, children: "blog" }),
      "）， 否则点击图标时无法打开对应窗口。直接勾选/取消 ",
      /* @__PURE__ */ jsx("strong", { children: "显示" }),
      " 复选框即时生效， 修改名称/路径/排序后需点击「保存」。"
    ] }),
    isPending ? /* @__PURE__ */ jsx("div", { style: {
      color: "#555",
      fontSize: 12
    }, children: "正在加载图标列表…" }) : icons.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { onAdd: () => setShowAdd(true) }) : /* @__PURE__ */ jsx(IconTable, { icons, onDelete: setDeleteTarget }),
    deleteTarget && /* @__PURE__ */ jsx(DeleteDialog, { icon: deleteTarget, onCancel: () => setDeleteTarget(null), onDeleted: () => setDeleteTarget(null) }),
    showAdd && /* @__PURE__ */ jsx(AddDialog, { onClose: () => setShowAdd(false) })
  ] });
}
const GRID = "38px 44px 110px 1fr 1.6fr 54px 136px";
function IconTable({
  icons,
  onDelete
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    border: "2px inset #aaa",
    background: "#fff",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: GRID,
      background: "linear-gradient(180deg,#ddd 0%,#c8c8c8 100%)",
      borderBottom: "1px solid #aaa",
      userSelect: "none"
    }, children: ["显示", "预览", "ID", "名称", "图标路径", "排序", "操作"].map((col) => /* @__PURE__ */ jsx("div", { style: {
      padding: "3px 6px",
      fontSize: 11,
      fontWeight: "bold",
      color: "#222",
      borderRight: "1px solid #bbb"
    }, children: col }, col)) }),
    icons.map((icon, idx) => /* @__PURE__ */ jsx(IconRow, { icon, striped: idx % 2 === 1, onDelete }, icon.id))
  ] });
}
function IconRow({
  icon,
  striped,
  onDelete
}) {
  const [label, setLabel] = useState(icon.label);
  const [src, setSrc] = useState(icon.src);
  const [order, setOrder] = useState(String(icon.order));
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!saving) {
      setLabel(icon.label);
      setSrc(icon.src);
      setOrder(String(icon.order));
    }
  }, [icon.label, icon.src, icon.order]);
  const parsedOrder = parseInt(order) || 0;
  const isDirty = label.trim() !== icon.label || src.trim() !== icon.src || parsedOrder !== icon.order;
  const {
    mutate: save,
    isPending: isSaving
  } = useMutation({
    ...trpc.settings.updateIcon.mutationOptions(),
    onMutate: () => setSaving(true),
    onSettled: () => setSaving(false),
    onSuccess: invalidateIcons
  });
  const {
    mutate: toggleVis,
    isPending: isToggling
  } = useMutation({
    ...trpc.settings.updateIcon.mutationOptions(),
    onSuccess: invalidateIcons
  });
  const rowBg = icon.visible ? striped ? "#f0f0f0" : "#fff" : striped ? "#f8f4f4" : "#fdf8f8";
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "grid",
    gridTemplateColumns: GRID,
    background: rowBg,
    borderBottom: "1px solid #e8e8e8",
    opacity: icon.visible ? 1 : 0.72
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "5px"
    }, children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: icon.visible, onChange: () => toggleVis({
      id: icon.id,
      visible: !icon.visible
    }), disabled: isToggling, title: icon.visible ? "点击隐藏" : "点击显示", style: {
      width: 14,
      height: 14,
      cursor: isToggling ? "wait" : "pointer"
    } }) }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px"
    }, children: /* @__PURE__ */ jsx("img", { src: src || icon.src, alt: "", style: {
      width: 28,
      height: 28,
      objectFit: "contain",
      imageRendering: "pixelated"
    }, onError: (e) => {
      e.currentTarget.style.opacity = "0.2";
    } }) }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "5px 6px",
      fontSize: 11,
      color: "#555",
      display: "flex",
      alignItems: "center",
      fontFamily: 'Consolas, "Courier New", monospace',
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }, title: icon.id, children: icon.id }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "3px 5px",
      display: "flex",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsx(RowInput, { value: label, onChange: setLabel, placeholder: "显示名称" }) }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "3px 5px",
      display: "flex",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsx(RowInput, { value: src, onChange: setSrc, placeholder: "图标路径或 URL" }) }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: "3px 5px",
      display: "flex",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsx("input", { type: "number", min: 0, value: order, onChange: (e) => setOrder(e.target.value), style: {
      width: 44,
      padding: "3px 4px",
      fontSize: 12,
      border: "2px inset #aaa",
      background: "#fff",
      outline: "none",
      fontFamily: FONT,
      boxSizing: "border-box"
    } }) }),
    /* @__PURE__ */ jsxs("div", { style: {
      padding: "3px 5px",
      display: "flex",
      alignItems: "center",
      gap: 4
    }, children: [
      /* @__PURE__ */ jsx(XpButton, { small: true, primary: true, disabled: !isDirty || isSaving || !label.trim() || !src.trim(), onClick: () => save({
        id: icon.id,
        label: label.trim(),
        src: src.trim(),
        order: parsedOrder
      }), children: isSaving ? "…" : "保存" }),
      /* @__PURE__ */ jsx(XpButton, { small: true, danger: true, onClick: () => onDelete(icon), children: "删除" })
    ] })
  ] });
}
function EmptyState({
  onAdd
}) {
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
    }, children: "🖥️" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 6
    }, children: "桌面没有图标" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11,
      marginBottom: 16
    }, children: "还未添加任何桌面图标" }),
    /* @__PURE__ */ jsx(XpButton, { primary: true, onClick: onAdd, children: "✚ 添加第一个图标" })
  ] });
}
function DeleteDialog({
  icon,
  onCancel,
  onDeleted
}) {
  const {
    mutate: del,
    isPending
  } = useMutation({
    ...trpc.settings.deleteIcon.mutationOptions(),
    onSuccess: () => {
      invalidateIcons();
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
          }, children: "确定要删除这个桌面图标吗？" }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #ccc",
            padding: "5px 8px",
            borderRadius: 2,
            marginBottom: 6
          }, children: [
            /* @__PURE__ */ jsx("img", { src: icon.src, alt: "", style: {
              width: 20,
              height: 20,
              objectFit: "contain",
              imageRendering: "pixelated",
              flexShrink: 0
            }, onError: (e) => {
              e.currentTarget.style.opacity = "0.2";
            } }),
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: 12,
              color: "#222"
            }, children: icon.label }),
            /* @__PURE__ */ jsx("code", { style: {
              fontSize: 10,
              color: "#888",
              marginLeft: "auto"
            }, children: icon.id })
          ] }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 11,
            color: "#a00"
          }, children: "删除后桌面将不再显示该图标快捷方式（不影响应用本身）。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: () => del({
          id: icon.id
        }), disabled: isPending, danger: true, children: isPending ? "删除中…" : "删除" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onCancel, disabled: isPending, children: "取消" })
      ] })
    ] })
  ] }) });
}
function AddDialog({
  onClose
}) {
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [src, setSrc] = useState("");
  const [visible, setVisible] = useState(true);
  const [errorMsg, setError] = useState("");
  const isValid = id.trim() && label.trim() && src.trim();
  const {
    mutate: create,
    isPending
  } = useMutation({
    ...trpc.settings.createIcon.mutationOptions(),
    onSuccess: () => {
      invalidateIcons();
      onClose();
    },
    onError: (err) => setError(err.message ?? "创建失败，请重试")
  });
  const handleCreate = () => {
    if (!isValid) return;
    setError("");
    create({
      id: id.trim(),
      label: label.trim(),
      src: src.trim(),
      visible
    });
  };
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
    width: 420,
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
      }, children: "添加桌面图标" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "16px 20px 14px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        background: "#fff8dc",
        border: "1px solid #c8a000",
        borderRadius: 2,
        padding: "5px 8px",
        marginBottom: 12,
        fontSize: 11,
        color: "#664400",
        lineHeight: 1.5
      }, children: [
        "⚠️ ID 须与 APP_REGISTRY 键名一致，否则点击无法打开窗口。",
        /* @__PURE__ */ jsx("br", {}),
        "常用 ID：",
        /* @__PURE__ */ jsx("code", { children: "myComputer" }),
        " · ",
        /* @__PURE__ */ jsx("code", { children: "blog" }),
        " · ",
        /* @__PURE__ */ jsx("code", { children: "aboutme" }),
        " · ",
        /* @__PURE__ */ jsx("code", { children: "contact" }),
        " 等"
      ] }),
      /* @__PURE__ */ jsx(DlgField, { label: "图标 ID *", children: /* @__PURE__ */ jsx(DlgInput, { value: id, onChange: setId, placeholder: "如 myComputer / blog", mono: true }) }),
      /* @__PURE__ */ jsx(DlgField, { label: "显示名称 *", children: /* @__PURE__ */ jsx(DlgInput, { value: label, onChange: setLabel, placeholder: "桌面上显示的名称" }) }),
      /* @__PURE__ */ jsx(DlgField, { label: "图标路径 *", children: /* @__PURE__ */ jsx(DlgInput, { value: src, onChange: setSrc, placeholder: "/assets/icons/xxx.png 或完整 URL" }) }),
      src.trim() && /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
        marginLeft: 90
      }, children: [
        /* @__PURE__ */ jsx("img", { src: src.trim(), alt: "", style: {
          width: 32,
          height: 32,
          objectFit: "contain",
          imageRendering: "pixelated",
          border: "1px solid #ccc",
          background: "#fff",
          padding: 2
        }, onError: (e) => {
          e.currentTarget.style.opacity = "0.2";
        } }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 11,
          color: "#666"
        }, children: "图标预览" })
      ] }),
      /* @__PURE__ */ jsx(DlgField, { label: "默认显示", children: /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: visible, onChange: (e) => setVisible(e.target.checked), style: {
          width: 14,
          height: 14,
          cursor: "pointer"
        } }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 12,
          color: "#333"
        }, children: visible ? "显示在桌面" : "默认隐藏" })
      ] }) }),
      errorMsg && /* @__PURE__ */ jsxs("div", { style: {
        background: "#fff4ce",
        border: "1px solid #e0a000",
        borderRadius: 2,
        padding: "5px 8px",
        marginBottom: 10,
        fontSize: 11,
        color: "#7a4900"
      }, children: [
        "⚠️ ",
        errorMsg
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6,
        marginTop: 4
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: handleCreate, disabled: isPending || !isValid, primary: true, children: isPending ? "添加中…" : "✚ 添加" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onClose, disabled: isPending, children: "取消" })
      ] })
    ] })
  ] }) });
}
function DlgField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10
  }, children: [
    /* @__PURE__ */ jsxs("label", { style: {
      fontSize: 12,
      color: "#222",
      width: 82,
      flexShrink: 0
    }, children: [
      label,
      "："
    ] }),
    children
  ] });
}
function DlgInput({
  value,
  onChange,
  placeholder,
  mono = false
}) {
  return /* @__PURE__ */ jsx("input", { type: "text", value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    flex: 1,
    padding: "3px 6px",
    fontSize: 12,
    fontFamily: mono ? 'Consolas, "Courier New", monospace' : FONT,
    border: "2px inset #aaa",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box"
  } });
}
function RowInput({
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsx("input", { type: "text", value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    width: "100%",
    padding: "2px 5px",
    fontSize: 11,
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
  IconsPage as component
};
