import { jsxs, jsx } from "react/jsx-runtime";
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
function AdminDashboard() {
  return /* @__PURE__ */ jsxs("div", { style: {
    padding: "24px 28px",
    fontFamily: FONT
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderBottom: "2px solid #2060b8",
      paddingBottom: 10,
      marginBottom: 20
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 24
      }, children: "🖥️" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { style: {
          margin: 0,
          fontSize: 16,
          color: "#003399",
          fontWeight: "bold"
        }, children: "管理后台" }),
        /* @__PURE__ */ jsx("p", { style: {
          margin: 0,
          fontSize: 11,
          color: "#666"
        }, children: "欢迎回来，管理员" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }, children: QUICK_LINKS.map(({
      icon,
      label,
      desc,
      href
    }) => /* @__PURE__ */ jsxs("a", { href, style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      width: 200,
      padding: "12px 14px",
      background: "linear-gradient(180deg, #f8f8f0 0%, #ece9d8 100%)",
      border: "1px solid #b0a890",
      borderRadius: 3,
      textDecoration: "none",
      color: "inherit",
      boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
      cursor: "pointer"
    }, children: [
      /* @__PURE__ */ jsx("span", { style: {
        fontSize: 22,
        lineHeight: 1,
        flexShrink: 0
      }, children: icon }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 12,
          fontWeight: "bold",
          color: "#003399",
          marginBottom: 3
        }, children: label }),
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: 11,
          color: "#666",
          lineHeight: 1.4
        }, children: desc })
      ] })
    ] }, href)) })
  ] });
}
const QUICK_LINKS = [{
  icon: "🎨",
  label: "主题设置",
  href: "/admin/theme",
  desc: "修改壁纸、Logo 和托盘图标"
}, {
  icon: "📝",
  label: "博客管理",
  href: "/admin/blog",
  desc: "新建、编辑、删除博客文章"
}, {
  icon: "🖼️",
  label: "图标管理",
  href: "/admin/icons",
  desc: "控制桌面图标显示与顺序"
}, {
  icon: "🐾",
  label: "吉祥物管理",
  href: "/admin/mascots",
  desc: "管理桌宠列表"
}, {
  icon: "💬",
  label: "评论系统",
  href: "/admin/comments",
  desc: "配置评论提供商参数"
}];
export {
  AdminDashboard as component
};
