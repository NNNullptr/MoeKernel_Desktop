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
const EMPTY_FORM = {
  title: "",
  artist: "",
  src: "",
  bvid: "",
  cover: "",
  type: "audio",
  order: 0,
  visible: true
};
function MediaAdminPage() {
  const qc = useQueryClient();
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.3);
  const [bgInit, setBgInit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showEditor, setShowEditor] = useState(false);
  const [confirmDelId, setConfirmDelId] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const listQueryKey = trpc.media.listAll.queryOptions().queryKey;
  const {
    data: tracks = [],
    isLoading
  } = useQuery({
    ...trpc.media.listAll.queryOptions(),
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
      setBgUrl(settings["winamp_bg_url"] ?? "");
      const raw = settings["winamp_bg_opacity"];
      setBgOpacity(raw ? parseFloat(raw) : 0.3);
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
      winamp_bg_url: bgUrl.trim(),
      winamp_bg_opacity: String(bgOpacity)
    });
  }, [saveAppearance, bgUrl, bgOpacity]);
  const {
    mutate: createTrack
  } = useMutation(trpc.media.create.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: listQueryKey
      });
      closeEditor();
    }
  }));
  const {
    mutate: updateTrack
  } = useMutation(trpc.media.update.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: listQueryKey
      });
      closeEditor();
    }
  }));
  const {
    mutate: deleteTrack
  } = useMutation(trpc.media.delete.mutationOptions({
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: listQueryKey
      });
      setConfirmDelId(null);
    }
  }));
  function openCreate(defaultType = "audio") {
    setEditId(null);
    setForm({
      ...EMPTY_FORM,
      type: defaultType
    });
    setShowEditor(true);
  }
  function openEdit(track) {
    setEditId(track.id);
    setForm({
      title: track.title,
      artist: track.artist,
      src: track.src,
      bvid: track.bvid ?? "",
      cover: track.cover,
      type: track.type,
      order: track.order,
      visible: track.visible
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
      bvid: form.bvid?.trim() || void 0
    };
    if (editId) {
      updateTrack({
        id: editId,
        ...payload
      });
    } else {
      createTrack(payload);
    }
  }
  function setField(key, val) {
    setForm((f) => ({
      ...f,
      [key]: val
    }));
  }
  const filteredTracks = filterType === "all" ? tracks : tracks.filter((t) => t.type === filterType);
  const audioCount = tracks.filter((t) => t.type === "audio").length;
  const videoCount = tracks.filter((t) => t.type === "video").length;
  const bilibiliCount = tracks.filter((t) => t.type === "bilibili").length;
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
      }, children: "🎵" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: {
          margin: 0,
          fontSize: 15,
          color: "#003399",
          fontWeight: "bold"
        }, children: "媒体库管理" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#555"
        }, children: "管理 Winamp 音频与 Media Player 视频曲目，并配置 Winamp 默认背景" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "📋  曲目管理", children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          gap: 4
        }, children: [["all", `全部 (${tracks.length})`], ["audio", `🎵 音频 (${audioCount})`], ["video", `🎬 视频 (${videoCount})`], ["bilibili", `📺 B站 (${bilibiliCount})`]].map(([type, label]) => /* @__PURE__ */ jsx("button", { onClick: () => setFilterType(type), style: {
          padding: "2px 10px",
          fontSize: 11,
          fontFamily: FONT,
          background: filterType === type ? "linear-gradient(to bottom, #c8daf0, #a8c0e8)" : "linear-gradient(to bottom, #f4f4f0, #dbd9d0)",
          border: `1px solid ${filterType === type ? "#6090c8" : "#aca899"}`,
          borderRadius: 2,
          cursor: "pointer",
          color: filterType === type ? "#003399" : "#333",
          fontWeight: filterType === type ? "bold" : "normal"
        }, children: label }, type)) }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          gap: 6
        }, children: [
          /* @__PURE__ */ jsx(XpButton, { onClick: () => openCreate("audio"), children: "🎵 新增音频" }),
          /* @__PURE__ */ jsx(XpButton, { onClick: () => openCreate("video"), children: "🎬 新增视频" }),
          /* @__PURE__ */ jsx(XpButton, { onClick: () => openCreate("bilibili"), children: "📺 新增B站" })
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsx("div", { style: {
        fontSize: 12,
        color: "#666",
        padding: "8px 0"
      }, children: "加载中…" }) : filteredTracks.length === 0 ? /* @__PURE__ */ jsx("div", { style: {
        fontSize: 12,
        color: "#888",
        padding: "8px 0"
      }, children: "暂无曲目。点击上方按钮添加。" }) : /* @__PURE__ */ jsxs("div", { style: {
        maxHeight: 380,
        overflowY: "auto"
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "grid",
          gridTemplateColumns: "24px 80px 1fr 120px 60px 60px 80px",
          gap: 6,
          padding: "4px 8px",
          background: "#d4d0c8",
          borderRadius: 2,
          fontSize: 11,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 2
        }, children: [
          /* @__PURE__ */ jsx("span", { children: "#" }),
          /* @__PURE__ */ jsx("span", { children: "类型" }),
          /* @__PURE__ */ jsx("span", { children: "标题 / 来源" }),
          /* @__PURE__ */ jsx("span", { children: "艺术家" }),
          /* @__PURE__ */ jsx("span", { children: "排序" }),
          /* @__PURE__ */ jsx("span", { children: "可见" }),
          /* @__PURE__ */ jsx("span", { children: "操作" })
        ] }),
        filteredTracks.map((track, idx) => /* @__PURE__ */ jsx(TrackRow, { track, index: idx + 1, confirmingDelete: confirmDelId === track.id, onEdit: () => openEdit(track), onDeleteRequest: () => setConfirmDelId(track.id), onDeleteConfirm: () => deleteTrack({
          id: track.id
        }), onDeleteCancel: () => setConfirmDelId(null) }, track.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { title: "🎨  Winamp 外观设置（全局默认背景）", children: [
      /* @__PURE__ */ jsx("p", { style: {
        margin: "0 0 10px",
        fontSize: 11,
        color: "#555"
      }, children: "保存后前台 Winamp 播放器打开时默认显示此背景。" }),
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
            padding: "10px",
            color: "#464646",
            fontSize: 12,
            fontWeight: "bold"
          }, children: "🎵 示例歌曲名" })
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
function TrackRow({
  track,
  index,
  confirmingDelete,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel
}) {
  const typeBadge = {
    audio: {
      label: "🎵 音频",
      bg: "#e8f4e8",
      color: "#1a6a1a"
    },
    video: {
      label: "🎬 视频",
      bg: "#e8eef8",
      color: "#1a3a8a"
    },
    bilibili: {
      label: "📺 B站",
      bg: "#fce8e8",
      color: "#8a1a1a"
    }
  };
  const badge = typeBadge[track.type];
  const sourceHint = track.type === "bilibili" ? track.bvid || "—" : track.src ? track.src.split("/").at(-1) ?? track.src : "—";
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "grid",
    gridTemplateColumns: "24px 80px 1fr 120px 60px 60px 80px",
    gap: 6,
    alignItems: "center",
    padding: "5px 8px",
    background: track.visible ? "#fff" : "#f5f5f5",
    border: `1px solid ${track.visible ? "#d4d0c8" : "#b8b8b8"}`,
    borderRadius: 2,
    marginBottom: 3
  }, children: [
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 11,
      color: "#999"
    }, children: index }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 10,
      padding: "1px 5px",
      borderRadius: 2,
      background: badge.bg,
      color: badge.color,
      border: `1px solid ${badge.color}44`,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }, children: badge.label }),
    /* @__PURE__ */ jsxs("div", { style: {
      minWidth: 0
    }, children: [
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#003c7e",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }, children: track.title }),
      /* @__PURE__ */ jsx("div", { style: {
        fontSize: 10,
        color: "#888",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }, children: sourceHint })
    ] }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 11,
      color: "#555",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }, children: track.artist || "—" }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 11,
      color: "#666",
      textAlign: "center"
    }, children: track.order }),
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 14,
      textAlign: "center"
    }, children: track.visible ? "✅" : "🚫" }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: 3
    }, children: [
      /* @__PURE__ */ jsx(ActionBtn, { onClick: onEdit, children: "✏️" }),
      confirmingDelete ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(ActionBtn, { onClick: onDeleteConfirm, danger: true, children: "✓" }),
        /* @__PURE__ */ jsx(ActionBtn, { onClick: onDeleteCancel, children: "✕" })
      ] }) : /* @__PURE__ */ jsx(ActionBtn, { onClick: onDeleteRequest, danger: true, children: "🗑️" })
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
  const isBilibili = form.type === "bilibili";
  const isAudio = form.type === "audio";
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
      }, children: editId ? "编辑曲目" : "新增曲目" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: "#ece9d8",
      padding: "14px 18px"
    }, children: [
      /* @__PURE__ */ jsx(EditorField, { label: "类型", children: /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        gap: 8
      }, children: ["audio", "video", "bilibili"].map((t) => /* @__PURE__ */ jsxs("label", { style: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        cursor: "pointer"
      }, children: [
        /* @__PURE__ */ jsx("input", { type: "radio", name: "track-type", value: t, checked: form.type === t, onChange: () => setField("type", t) }),
        t === "audio" ? "🎵 音频" : t === "video" ? "🎬 视频 MP4" : "📺 B站视频"
      ] }, t)) }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "标题 *", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.title, onChange: (e) => setField("title", e.target.value), style: inputStyle, placeholder: "曲目名称" }) }),
      isAudio && /* @__PURE__ */ jsx(EditorField, { label: "艺术家", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.artist, onChange: (e) => setField("artist", e.target.value), style: inputStyle, placeholder: "歌手 / 演奏者名称" }) }),
      !isBilibili && /* @__PURE__ */ jsx(EditorField, { label: isAudio ? "音频 URL" : "视频 URL", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.src, onChange: (e) => setField("src", e.target.value), style: inputStyle, placeholder: isAudio ? "/assets/tracks/song.mp3 或 https://..." : "/assets/video/clip.mp4 或 https://..." }) }),
      isBilibili && /* @__PURE__ */ jsx(EditorField, { label: "BV 号", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.bvid ?? "", onChange: (e) => setField("bvid", e.target.value), style: inputStyle, placeholder: "BV1xxxxxxxxx（从 B站视频页 URL 获取）" }) }),
      /* @__PURE__ */ jsx(EditorField, { label: "封面 URL", children: /* @__PURE__ */ jsx("input", { type: "text", value: form.cover, onChange: (e) => setField("cover", e.target.value), style: inputStyle, placeholder: "/assets/covers/cover.jpg 或 https://...（可留空）" }) }),
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
      isBilibili && /* @__PURE__ */ jsx("div", { style: {
        fontSize: 10,
        color: "#666",
        background: "#f0eee8",
        border: "1px solid #d0ccc0",
        borderRadius: 2,
        padding: "4px 8px",
        marginBottom: 10
      }, children: "💡 B站模式下，Play/Pause/快进/快退按钮将置灰（浏览器跨域限制），用户直接点击画面控制。" }),
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
    padding: "2px 6px",
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
      }, children: "媒体库管理" })
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
          }, children: "Winamp 外观已保存" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }, children: [
            "背景设置已写入数据库。",
            /* @__PURE__ */ jsx("br", {}),
            "重新打开 Winamp 窗口即可看到效果。"
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
  MediaAdminPage as component
};
