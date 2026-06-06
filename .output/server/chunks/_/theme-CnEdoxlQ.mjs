import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
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
function ThemePage() {
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [trayIconsText, setTrayIconsText] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteAuthor, setSiteAuthor] = useState("");
  const [siteBrand, setSiteBrand] = useState("");
  const [bootSubtitle, setBootSubtitle] = useState("");
  const [siteRole, setSiteRole] = useState("");
  const [siteUsername, setSiteUsername] = useState("");
  const [siteAvatarUrl, setSiteAvatarUrl] = useState("");
  const [identityInitialized, setIdentityInitialized] = useState(false);
  const [identitySuccess, setIdentitySuccess] = useState(false);
  const [identityError, setIdentityError] = useState("");
  const {
    data: settings,
    isPending: isLoading
  } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0
  });
  useEffect(() => {
    if (settings && !initialized) {
      setWallpaperUrl(settings["wallpaper_url"] ?? "");
      setLogoUrl(settings["windows_logo_url"] ?? "");
      const raw = settings["system_tray_icons"];
      const icons = raw ? (() => {
        try {
          return JSON.parse(raw);
        } catch {
          console.warn("[theme] system_tray_icons 字段 JSON 解析失败，已回退为空数组。原始值：", raw);
          return [];
        }
      })() : [];
      setTrayIconsText(icons.join("\n"));
      setInitialized(true);
    }
  }, [settings, initialized]);
  useEffect(() => {
    if (settings && !identityInitialized) {
      setSiteTitle(settings["site_title"] ?? "");
      setSiteDescription(settings["site_description"] ?? "");
      setSiteAuthor(settings["site_author"] ?? "");
      setSiteBrand(settings["site_brand"] ?? "");
      setBootSubtitle(settings["boot_subtitle"] ?? "");
      setSiteRole(settings["site_role"] ?? "");
      setSiteUsername(settings["site_username"] ?? "");
      setSiteAvatarUrl(settings["site_avatar_url"] ?? "");
      setIdentityInitialized(true);
    }
  }, [settings, identityInitialized]);
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
    onError: (err) => {
      setErrorMsg(err.message ?? "保存失败，请重试");
    }
  });
  const {
    mutate: saveIdentity,
    isPending: isSavingIdentity
  } = useMutation({
    ...trpc.settings.setBatch.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.site.getSettings.queryOptions().queryKey
      });
      setIdentityError("");
      setIdentitySuccess(true);
    },
    onError: (err) => {
      setIdentityError(err.message ?? "保存失败，请重试");
    }
  });
  const handleSave = useCallback(() => {
    const trayIcons = trayIconsText.split("\n").map((s) => s.trim()).filter(Boolean);
    save({
      wallpaper_url: wallpaperUrl.trim(),
      windows_logo_url: logoUrl.trim(),
      system_tray_icons: JSON.stringify(trayIcons)
    });
  }, [save, wallpaperUrl, logoUrl, trayIconsText]);
  const handleSaveIdentity = useCallback(() => {
    saveIdentity({
      site_title: siteTitle.trim(),
      site_description: siteDescription.trim(),
      site_author: siteAuthor.trim(),
      site_brand: siteBrand.trim(),
      boot_subtitle: bootSubtitle.trim(),
      site_role: siteRole.trim(),
      site_username: siteUsername.trim(),
      site_avatar_url: siteAvatarUrl.trim()
    });
  }, [saveIdentity, siteTitle, siteDescription, siteAuthor, siteBrand, bootSubtitle, siteRole, siteUsername, siteAvatarUrl]);
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "20px 24px",
    fontFamily: FONT,
    position: "relative"
  }, children: [
    /* @__PURE__ */ jsx(PageHeader, {}),
    isLoading ? /* @__PURE__ */ jsx("div", { style: {
      color: "#555",
      fontSize: 12,
      marginTop: 16
    }, children: "正在加载设置…" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Section, { title: "🖼️  桌面壁纸", children: [
        /* @__PURE__ */ jsx(FieldRow, { label: "图片 URL", children: /* @__PURE__ */ jsx(XpInput, { value: wallpaperUrl, onChange: setWallpaperUrl, placeholder: "https://example.com/wallpaper.jpg 或 /assets/wallpapers/...", width: 420 }) }),
        /* @__PURE__ */ jsx(ImagePreview, { src: wallpaperUrl, aspect: "16/9", maxWidth: 280, label: "壁纸预览" })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "🪟  Windows Logo（左下角图标）", children: [
        /* @__PURE__ */ jsx(FieldRow, { label: "图标 URL", children: /* @__PURE__ */ jsx(XpInput, { value: logoUrl, onChange: setLogoUrl, placeholder: "https://example.com/logo.ico 或 /assets/...", width: 420 }) }),
        /* @__PURE__ */ jsx(ImagePreview, { src: logoUrl, aspect: "1/1", maxWidth: 48, label: "Logo 预览" })
      ] }),
      /* @__PURE__ */ jsxs(Section, { title: "📌  系统托盘图标", children: [
        /* @__PURE__ */ jsx("p", { style: {
          margin: "0 0 8px",
          fontSize: 11,
          color: "#555"
        }, children: "每行一个图片 URL，从左到右依次显示在任务栏右侧。" }),
        /* @__PURE__ */ jsx("textarea", { value: trayIconsText, onChange: (e) => setTrayIconsText(e.target.value), rows: 6, spellCheck: false, style: {
          width: "100%",
          boxSizing: "border-box",
          padding: "4px 6px",
          fontSize: 12,
          fontFamily: 'Consolas, "Courier New", monospace',
          border: "2px inset #aaa",
          background: "#fff",
          resize: "vertical",
          outline: "none"
        } }),
        /* @__PURE__ */ jsx(TrayPreview, { text: trayIconsText })
      ] }),
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
        /* @__PURE__ */ jsx(XpButton, { onClick: handleSave, disabled: isSaving, primary: true, children: isSaving ? "保存中…" : "💾  保存设置" }),
        /* @__PURE__ */ jsx(XpButton, { onClick: () => setInitialized(false), disabled: isSaving, children: "重置" })
      ] }),
      /* @__PURE__ */ jsx("div", { style: {
        marginTop: 24
      }, children: /* @__PURE__ */ jsxs(Section, { title: "🪪  站点身份信息", children: [
        /* @__PURE__ */ jsx("p", { style: {
          margin: "0 0 10px",
          fontSize: 11,
          color: "#555"
        }, children: "配置浏览器标签页标题、欢迎屏内容与开始菜单显示信息，保存后前台刷新生效。" }),
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 11,
          fontWeight: "bold",
          color: "#444",
          margin: "8px 0 6px",
          borderBottom: "1px solid #d0d0c0",
          paddingBottom: 3
        }, children: "网页信息" }),
        /* @__PURE__ */ jsx(FieldRow, { label: "站点标题", children: /* @__PURE__ */ jsx(XpInput, { value: siteTitle, onChange: setSiteTitle, placeholder: "NNNullptr", width: 340 }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "站点描述", children: /* @__PURE__ */ jsx(XpInput, { value: siteDescription, onChange: setSiteDescription, placeholder: "个人主页描述文字", width: 340 }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "作者署名", children: /* @__PURE__ */ jsx(XpInput, { value: siteAuthor, onChange: setSiteAuthor, placeholder: "NNNullptr", width: 340 }) }),
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 11,
          fontWeight: "bold",
          color: "#444",
          margin: "14px 0 6px",
          borderBottom: "1px solid #d0d0c0",
          paddingBottom: 3
        }, children: "欢迎屏 & 开始菜单" }),
        /* @__PURE__ */ jsx(FieldRow, { label: "品牌大字", children: /* @__PURE__ */ jsx(XpInput, { value: siteBrand, onChange: setSiteBrand, placeholder: "MoeKernel（Boot/Login 左栏大字）", width: 340 }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "Boot 副标题", children: /* @__PURE__ */ jsx(XpInput, { value: bootSubtitle, onChange: setBootSubtitle, placeholder: "Welcome", width: 340 }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "角色/头衔", children: /* @__PURE__ */ jsx(XpInput, { value: siteRole, onChange: setSiteRole, placeholder: "Software Developer", width: 340 }) }),
        /* @__PURE__ */ jsx(FieldRow, { label: "用户名", children: /* @__PURE__ */ jsx(XpInput, { value: siteUsername, onChange: setSiteUsername, placeholder: "NNNullptr（Login 右栏 + Start 菜单）", width: 340 }) }),
        /* @__PURE__ */ jsxs(FieldRow, { label: "头像图片 URL", children: [
          /* @__PURE__ */ jsx(XpInput, { value: siteAvatarUrl, onChange: setSiteAvatarUrl, placeholder: "/assets/avatarSrc.jpg 或 https://...", width: 300 }),
          siteAvatarUrl && /* @__PURE__ */ jsx("img", { src: siteAvatarUrl, alt: "头像预览", onError: (e) => {
            e.currentTarget.style.opacity = "0.3";
          }, style: {
            width: 40,
            height: 40,
            objectFit: "cover",
            border: "2px solid #aaa",
            borderRadius: 2,
            flexShrink: 0
          } })
        ] }),
        identityError && /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fff4ce",
          border: "1px solid #e0a000",
          borderRadius: 2,
          padding: "6px 10px",
          marginBottom: 10
        }, children: [
          /* @__PURE__ */ jsx("span", { style: {
            fontSize: 16
          }, children: "⚠️" }),
          /* @__PURE__ */ jsx("span", { style: {
            fontSize: 11,
            color: "#7a4900"
          }, children: identityError })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 8
        }, children: [
          /* @__PURE__ */ jsx(XpButton, { onClick: handleSaveIdentity, disabled: isSavingIdentity, primary: true, children: isSavingIdentity ? "保存中…" : "💾  保存身份信息" }),
          /* @__PURE__ */ jsx(XpButton, { onClick: () => setIdentityInitialized(false), disabled: isSavingIdentity, children: "重置" })
        ] })
      ] }) })
    ] }),
    (showSuccess || identitySuccess) && /* @__PURE__ */ jsx(SuccessDialog, { onClose: () => {
      setShowSuccess(false);
      setIdentitySuccess(false);
    } })
  ] });
}
function PageHeader() {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderBottom: "2px solid #2060b8",
    paddingBottom: 10,
    marginBottom: 18
  }, children: [
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 28
    }, children: "🎨" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { style: {
        margin: 0,
        fontSize: 15,
        color: "#003399",
        fontWeight: "bold"
      }, children: "主题设置" }),
      /* @__PURE__ */ jsx("p", { style: {
        margin: 0,
        fontSize: 11,
        color: "#555"
      }, children: "修改壁纸、Logo 与托盘图标，保存后前台即时生效" })
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
function XpInput({
  value,
  onChange,
  placeholder,
  width = 320
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
function ImagePreview({
  src,
  aspect,
  maxWidth,
  label
}) {
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [src]);
  const isUrl = src.startsWith("http") || src.startsWith("/");
  return /* @__PURE__ */ jsxs("div", { style: {
    marginTop: 6,
    marginBottom: 4
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      fontSize: 11,
      color: "#666",
      marginBottom: 4
    }, children: label }),
    /* @__PURE__ */ jsx("div", { style: {
      width: maxWidth,
      aspectRatio: aspect,
      background: "#c8c8c8",
      border: "2px inset #888",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0
    }, children: isUrl && !broken ? /* @__PURE__ */ jsx("img", { src, alt: label, onError: () => setBroken(true), style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    } }) : /* @__PURE__ */ jsx("span", { style: {
      fontSize: 10,
      color: "#888"
    }, children: src ? broken ? "加载失败" : "…" : "（未填写）" }) })
  ] });
}
function TrayPreview({
  text
}) {
  const icons = text.split("\n").map((s) => s.trim()).filter(Boolean);
  if (icons.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { style: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    gap: 4
  }, children: [
    /* @__PURE__ */ jsx("span", { style: {
      fontSize: 11,
      color: "#666",
      marginRight: 4
    }, children: "预览：" }),
    icons.map((url, i) => /* @__PURE__ */ jsx("img", { src: url, alt: "", style: {
      width: 18,
      height: 18,
      objectFit: "contain",
      imageRendering: "pixelated"
    }, onError: (e) => {
      e.currentTarget.style.opacity = "0.3";
    } }, i))
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
      }, children: "主题设置" })
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
          }, children: "设置已保存" }),
          /* @__PURE__ */ jsxs("div", { style: {
            fontSize: 11,
            color: "#555",
            lineHeight: 1.5
          }, children: [
            "主题设置已成功写入数据库。",
            /* @__PURE__ */ jsx("br", {}),
            "前台页面刷新后即可看到最新效果。"
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
  ThemePage as component
};
