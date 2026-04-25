import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_layout/')({
  component: AdminDashboard,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

function AdminDashboard() {
  return (
    <div style={{ padding: '24px 28px', fontFamily: FONT }}>
      {/* 页面标题行 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '2px solid #2060b8',
        paddingBottom: 10, marginBottom: 20,
      }}>
        <span style={{ fontSize: 24 }}>🖥️</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 16, color: '#003399', fontWeight: 'bold' }}>
            管理后台
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: '#666' }}>
            欢迎回来，管理员
          </p>
        </div>
      </div>

      {/* 快速入口卡片 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {QUICK_LINKS.map(({ icon, label, desc, href }) => (
          <a
            key={href}
            href={href}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              width: 200,
              padding: '12px 14px',
              background: 'linear-gradient(180deg, #f8f8f0 0%, #ece9d8 100%)',
              border: '1px solid #b0a890',
              borderRadius: 3,
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 'bold', color: '#003399', marginBottom: 3 }}>
                {label}
              </div>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 1.4 }}>
                {desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

const QUICK_LINKS = [
  { icon: '🎨', label: '主题设置',   href: '/admin/theme',    desc: '修改壁纸、Logo 和托盘图标' },
  { icon: '📝', label: '博客管理',   href: '/admin/blog',     desc: '新建、编辑、删除博客文章' },
  { icon: '🖼️', label: '图标管理',   href: '/admin/icons',    desc: '控制桌面图标显示与顺序' },
  { icon: '🐾', label: '吉祥物管理', href: '/admin/mascots',  desc: '管理桌宠列表' },
  { icon: '💬', label: '评论系统',   href: '/admin/comments', desc: '配置评论提供商参数' },
] as const;
