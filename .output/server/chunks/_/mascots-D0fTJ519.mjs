import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { t as trpc, q as queryClient } from "./router-Dg4MpxXb.mjs";
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
function invalidateMascots() {
  queryClient.invalidateQueries({
    queryKey: trpc.settings.listAllMascots.queryOptions().queryKey
  });
  queryClient.invalidateQueries({
    queryKey: trpc.site.getMascots.queryOptions().queryKey
  });
}
function isUrl(src) {
  return src.startsWith("/") || src.startsWith("http") || src.startsWith("data:");
}
function SrcPreview({
  src,
  size,
  pixelated = false
}) {
  if (!src) {
    return /* @__PURE__ */ jsx("div", { style: {
      width: size,
      height: size,
      background: "#d8d0c8",
      border: "1px dashed #aaa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      color: "#888",
      flexShrink: 0
    }, children: "空" });
  }
  if (isUrl(src)) {
    return /* @__PURE__ */ jsx("img", { src, alt: "", style: {
      width: size,
      height: size,
      objectFit: "contain",
      flexShrink: 0,
      imageRendering: pixelated ? "pixelated" : "auto"
    }, onError: (e) => {
      e.currentTarget.style.opacity = "0.2";
    } });
  }
  return /* @__PURE__ */ jsx("div", { style: {
    width: size,
    height: size,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: Math.floor(size * 0.65),
    lineHeight: 1
  }, children: src });
}
function MascotsPage() {
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const {
    data: mascots = [],
    isPending
  } = useQuery({
    ...trpc.settings.listAllMascots.queryOptions(),
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
      marginBottom: 14
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 26
        }, children: "🐾" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { style: {
            margin: 0,
            fontSize: 15,
            color: "#003399",
            fontWeight: "bold"
          }, children: "桌宠管理" }),
          /* @__PURE__ */ jsx("p", { style: {
            margin: 0,
            fontSize: 11,
            color: "#555"
          }, children: isPending ? "加载中…" : `共 ${mascots.length} 只桌宠` })
        ] })
      ] }),
      /* @__PURE__ */ jsx(XpButton, { primary: true, onClick: () => setShowAdd(true), children: "✚ 添加桌宠" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#f0f4ff",
      border: "1px solid #a0b8e0",
      borderRadius: 2,
      padding: "6px 10px",
      marginBottom: 14,
      fontSize: 11,
      color: "#224",
      lineHeight: 1.6
    }, children: [
      "💡 ",
      /* @__PURE__ */ jsx("strong", { children: "侧边栏图标" }),
      "（iconSrc）显示在右侧面板的按钮上，点击后召唤桌宠；",
      /* @__PURE__ */ jsx("strong", { children: "桌宠精灵" }),
      "（petSrc）为出现在桌面上的图像，支持 GIF 动图。 路径填写 ",
      /* @__PURE__ */ jsx("code", { style: {
        background: "#e8eef8",
        padding: "0 3px"
      }, children: "/assets/pets/..." }),
      "或完整 URL，也可直接填写 Emoji（如 🐱）。"
    ] }),
    isPending ? /* @__PURE__ */ jsx("div", { style: {
      color: "#555",
      fontSize: 12
    }, children: "正在加载桌宠列表…" }) : mascots.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { onAdd: () => setShowAdd(true) }) : /* @__PURE__ */ jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
      gap: 12
    }, children: mascots.map((m) => /* @__PURE__ */ jsx(MascotCard, { mascot: m, onEdit: setEditTarget, onDelete: setDeleteTarget }, m.id)) }),
    editTarget && /* @__PURE__ */ jsx(MascotDialog, { mode: "edit", initial: editTarget, onClose: () => setEditTarget(null) }),
    deleteTarget && /* @__PURE__ */ jsx(DeleteDialog, { mascot: deleteTarget, onCancel: () => setDeleteTarget(null), onDeleted: () => setDeleteTarget(null) }),
    showAdd && /* @__PURE__ */ jsx(MascotDialog, { mode: "add", onClose: () => setShowAdd(false) })
  ] });
}
function MascotCard({
  mascot,
  onEdit,
  onDelete
}) {
  const [hovered, setHovered] = useState(false);
  return /* @__PURE__ */ jsxs("div", { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
    border: hovered ? "2px solid #6699cc" : "2px inset #aaa",
    borderRadius: 2,
    background: hovered ? "#f0f5fc" : "#f5f3ec",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "border-color 0.1s, background 0.1s"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#2a2a3a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 130,
      position: "relative",
      overflow: "hidden",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsx(SrcPreview, { src: mascot.petSrc, size: 110 }),
      /* @__PURE__ */ jsx("div", { style: {
        position: "absolute",
        top: 5,
        right: 5,
        background: "rgba(0,0,0,0.55)",
        borderRadius: 3,
        padding: 3,
        display: "flex"
      }, title: "侧边栏图标（iconSrc）", children: /* @__PURE__ */ jsx(SrcPreview, { src: mascot.iconSrc, size: 20, pixelated: true }) }),
      /* @__PURE__ */ jsxs("div", { style: {
        position: "absolute",
        bottom: 5,
        left: 5,
        background: "rgba(0,0,0,0.6)",
        color: "#cce",
        fontSize: 10,
        padding: "1px 5px",
        borderRadius: 2
      }, children: [
        mascot.size,
        "px"
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        position: "absolute",
        bottom: 5,
        right: 5,
        background: "rgba(0,0,0,0.6)",
        color: "#ccc",
        fontSize: 10,
        padding: "1px 5px",
        borderRadius: 2
      }, children: [
        "#",
        mascot.order
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      padding: "7px 8px 8px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#003",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }, title: mascot.label || "（无名称）", children: mascot.label || /* @__PURE__ */ jsx("span", { style: {
        color: "#999",
        fontStyle: "italic"
      }, children: "无名称" }) }),
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 10,
        color: "#888",
        fontFamily: "Consolas, monospace",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }, title: mascot.id, children: mascot.id }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 4,
        marginTop: 2
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { small: true, onClick: () => onEdit(mascot), style: {
          flex: 1
        }, children: "✏️ 编辑" }),
        /* @__PURE__ */ jsx(XpButton, { small: true, danger: true, onClick: () => onDelete(mascot), children: "🗑️" })
      ] })
    ] })
  ] });
}
function MascotDialog({
  mode,
  initial,
  onClose
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [iconSrc, setIconSrc] = useState(initial?.iconSrc ?? "");
  const [petSrc, setPetSrc] = useState(initial?.petSrc ?? "");
  const [size, setSize] = useState(String(initial?.size ?? 120));
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [errorMsg, setError] = useState("");
  const isValid = iconSrc.trim() && petSrc.trim();
  const {
    mutate: create,
    isPending: isCreating
  } = useMutation({
    ...trpc.settings.createMascot.mutationOptions(),
    onSuccess: () => {
      invalidateMascots();
      onClose();
    },
    onError: (err) => setError(err.message ?? "创建失败")
  });
  const {
    mutate: update,
    isPending: isUpdating
  } = useMutation({
    ...trpc.settings.updateMascot.mutationOptions(),
    onSuccess: () => {
      invalidateMascots();
      onClose();
    },
    onError: (err) => setError(err.message ?? "保存失败")
  });
  const isPending = isCreating || isUpdating;
  const handleSubmit = () => {
    if (!isValid) return;
    setError("");
    const parsedSize = parseInt(size) || 120;
    const parsedOrder = parseInt(order) || 0;
    if (mode === "add") {
      create({
        label: label.trim(),
        iconSrc: iconSrc.trim(),
        petSrc: petSrc.trim(),
        size: parsedSize,
        order: parsedOrder
      });
    } else {
      update({
        id: initial.id,
        label: label.trim(),
        iconSrc: iconSrc.trim(),
        petSrc: petSrc.trim(),
        size: parsedSize,
        order: parsedOrder
      });
    }
  };
  const titleText = mode === "add" ? "添加桌宠" : "编辑桌宠";
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
    width: 480,
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
      }, children: titleText })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "16px 20px 14px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        marginBottom: 14,
        padding: "10px 12px",
        background: "#2a2a3a",
        borderRadius: 3
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          textAlign: "center"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 10,
            color: "#8899bb",
            marginBottom: 4
          }, children: "桌宠精灵" }),
          /* @__PURE__ */ jsx("div", { style: {
            background: "#3a3a4e",
            border: "1px solid #555",
            borderRadius: 2,
            padding: 6
          }, children: /* @__PURE__ */ jsx(SrcPreview, { src: petSrc || initial?.petSrc || "", size: 80 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          textAlign: "center"
        }, children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 10,
            color: "#8899bb",
            marginBottom: 4
          }, children: "侧边栏图标" }),
          /* @__PURE__ */ jsx("div", { style: {
            background: "#3a3a4e",
            border: "1px solid #555",
            borderRadius: 2,
            padding: 6
          }, children: /* @__PURE__ */ jsx(SrcPreview, { src: iconSrc || initial?.iconSrc || "", size: 32, pixelated: true }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          color: "#8899bb",
          fontSize: 11,
          alignSelf: "center",
          lineHeight: 1.6
        }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "精灵尺寸：",
            parseInt(size) || 0,
            "px"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "排序：#",
            parseInt(order) || 0
          ] }),
          label && /* @__PURE__ */ jsxs("div", { children: [
            "名称：",
            label
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DlgField, { label: "名称", children: /* @__PURE__ */ jsx(DlgInput, { value: label, onChange: setLabel, placeholder: "桌宠昵称（可留空）" }) }),
      /* @__PURE__ */ jsx(DlgField, { label: "侧边栏图标 *", children: /* @__PURE__ */ jsx(DlgInput, { value: iconSrc, onChange: setIconSrc, placeholder: "/assets/pets/avatars/1.png 或 🐱" }) }),
      /* @__PURE__ */ jsx(DlgField, { label: "桌宠精灵 *", children: /* @__PURE__ */ jsx(DlgInput, { value: petSrc, onChange: setPetSrc, placeholder: "/assets/pets/sprites/1.gif 或 🐈" }) }),
      /* @__PURE__ */ jsx(DlgField, { label: "显示尺寸（px）", children: /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsx("input", { type: "number", min: 20, max: 400, value: size, onChange: (e) => setSize(e.target.value), style: {
          width: 70,
          padding: "3px 6px",
          fontSize: 12,
          border: "2px inset #aaa",
          background: "#fff",
          outline: "none",
          fontFamily: FONT
        } }),
        /* @__PURE__ */ jsx("input", { type: "range", min: 20, max: 400, step: 10, value: parseInt(size) || 120, onChange: (e) => setSize(e.target.value), style: {
          width: 120,
          cursor: "pointer"
        } })
      ] }) }),
      /* @__PURE__ */ jsxs(DlgField, { label: "排序", children: [
        /* @__PURE__ */ jsx("input", { type: "number", min: 0, value: order, onChange: (e) => setOrder(e.target.value), style: {
          width: 70,
          padding: "3px 6px",
          fontSize: 12,
          border: "2px inset #aaa",
          background: "#fff",
          outline: "none",
          fontFamily: FONT
        } }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: 11,
          color: "#777",
          marginLeft: 6
        }, children: "数字越小越靠前" })
      ] }),
      mode === "edit" && /* @__PURE__ */ jsxs("div", { style: {
        fontSize: 10,
        color: "#888",
        marginBottom: 8,
        fontFamily: "Consolas, monospace"
      }, children: [
        "ID: ",
        initial.id
      ] }),
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
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: handleSubmit, disabled: isPending || !isValid, primary: true, children: isPending ? mode === "add" ? "添加中…" : "保存中…" : mode === "add" ? "✚ 添加" : "💾 保存修改" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onClose, disabled: isPending, children: "取消" })
      ] })
    ] })
  ] }) });
}
function DeleteDialog({
  mascot,
  onCancel,
  onDeleted
}) {
  const {
    mutate: del,
    isPending
  } = useMutation({
    ...trpc.settings.deleteMascot.mutationOptions(),
    onSuccess: () => {
      invalidateMascots();
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
      }, children: "确认删除桌宠" })
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
        /* @__PURE__ */ jsx("div", { style: {
          background: "#3a3a4e",
          borderRadius: 4,
          padding: 8,
          flexShrink: 0
        }, children: /* @__PURE__ */ jsx(SrcPreview, { src: mascot.petSrc, size: 48 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 13,
            fontWeight: "bold",
            color: "#003",
            marginBottom: 4
          }, children: "确定要删除这只桌宠吗？" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 12,
            color: "#444",
            marginBottom: 6
          }, children: [
            mascot.label || "（无名称）",
            " — ",
            mascot.size,
            "px"
          ] }),
          /* @__PURE__ */ jsx("div", { style: {
            fontSize: 11,
            color: "#a00"
          }, children: "删除后该桌宠将从侧边栏消失，此操作无法撤销。" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(XpButton, { onClick: () => del({
          id: mascot.id
        }), disabled: isPending, danger: true, children: isPending ? "删除中…" : "删除" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: onCancel, disabled: isPending, children: "取消" })
      ] })
    ] })
  ] }) });
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
    }, children: "🐾" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 6
    }, children: "还没有任何桌宠" }),
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11,
      marginBottom: 16
    }, children: "添加你的第一只桌宠吧" }),
    /* @__PURE__ */ jsx(XpButton, { primary: true, onClick: onAdd, children: "✚ 添加桌宠" })
  ] });
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
      width: 96,
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
  placeholder
}) {
  return /* @__PURE__ */ jsx("input", { type: "text", value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    flex: 1,
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
  danger,
  small,
  style: extraStyle
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
    whiteSpace: "nowrap",
    ...extraStyle
  }, children });
}
export {
  MascotsPage as component
};
