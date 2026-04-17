/**
 * @file blog/index.tsx
 * @description 博客文件夹组件 — Windows XP 资源管理器风格的博客入口，支持文章分类过滤。
 *
 * ════════════════════════════════════════════════════════════════
 *  💡 使用说明
 * ════════════════════════════════════════════════════════════════
 *
 * 本组件展示所有博客文章的图标网格（与 My Computer 布局一致）。
 * 点击任意文章图标时，通过 CustomEvent 通知桌面主视图（home.tsx）
 * 打开对应文章的独立阅读器窗口。
 *
 * 事件通信机制：
 *   window.dispatchEvent(
 *     new CustomEvent('xp-open-window', { detail: post.id })
 *   )
 *   home.tsx 的 useEffect 中监听该事件，调用 openWindow(post.id) 打开新窗口。
 *   这样实现了「窗口内开新窗口」，无需 prop drilling。
 *
 * 分类系统：
 *   系统自动从 BLOG_POSTS 的 category 字段中提取所有不重复的分类，
 *   在顶部渲染 XP 风格 Tab 标签栏，点击分类即可过滤文章列表。
 *   "全部" 标签始终显示，选中时展示所有文章。
 *
 * 如何新增文章：
 *   只需在 blog.config.ts 的 BLOG_POSTS 数组中添加新条目（含 category），
 *   本组件会自动渲染新增的文章图标和分类标签，无需修改本文件。
 * ════════════════════════════════════════════════════════════════
 *
 * 实现逻辑：
 * 1. 从 BLOG_POSTS 读取所有文章配置，useMemo 自动提取分类列表。
 * 2. useState 管理当前激活的分类（activeCategory），默认为 '全部'。
 * 3. useMemo 根据 activeCategory 过滤文章列表。
 * 4. 渲染顶部工具栏 → 分类 Tab 栏 → 左侧面板 + 文章网格。
 * 5. 点击 ArticleTile 时 dispatch 'xp-open-window' 事件，由 home.tsx 监听打开窗口。
 */

import { useState, useMemo } from 'react';
import { BLOG_POSTS } from '@/client/config/blog.config';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const ALL_LABEL = '全部';

// ── 子组件：XP 资源管理器工具栏 ─────────────────────────────────────────────

/** XP 资源管理器工具栏（菜单栏 + 地址栏） */
function ExplorerToolbar({ address }: { address: string }) {
  return (
    <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', fontFamily: FONT, fontSize: '12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: '2px', padding: '2px 4px', borderBottom: '1px solid #aca899' }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button key={m} style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}>{m}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}>
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #999', padding: '1px 6px', fontSize: '12px', borderRadius: '2px' }}>
          {address}
        </div>
      </div>
    </div>
  );
}

// ── 子组件：分类 Tab 栏 ───────────────────────────────────────────────────────

interface CategoryTabBarProps {
  /** 所有可用分类标签（含"全部"） */
  categories: string[];
  /** 当前激活的分类 */
  activeCategory: string;
  /** 切换分类时的回调 */
  onSelect: (category: string) => void;
}

/**
 * XP 风格的分类 Tab 标签栏。
 * 激活的 Tab 呈白色（模拟前景页面效果），非激活 Tab 呈 XP 灰色按钮风格。
 */
function CategoryTabBar({ categories, activeCategory, onSelect }: CategoryTabBarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '2px',
      padding: '4px 8px 0 8px',
      background: '#ece9d8',
      borderBottom: '1px solid #aca899',
      flexShrink: 0,
      overflowX: 'auto',
    }}>
      {categories.map((cat) => {
        const isActive = cat === activeCategory;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              fontFamily: FONT,
              fontSize: '11px',
              padding: '3px 12px 4px 12px',
              cursor: 'pointer',
              border: '1px solid #aca899',
              borderBottom: isActive ? '1px solid #fff' : '1px solid #aca899',
              borderRadius: '4px 4px 0 0',
              background: isActive
                ? '#fff'
                : 'linear-gradient(180deg, #f0ede4 0%, #dedad0 100%)',
              color: isActive ? '#000' : '#444',
              fontWeight: isActive ? 'bold' : 'normal',
              position: 'relative',
              zIndex: isActive ? 1 : 0,
              marginBottom: isActive ? '-1px' : '0',
              whiteSpace: 'nowrap',
              outline: 'none',
              boxShadow: isActive ? 'none' : 'inset 0 -1px 0 #aca899',
              transition: 'background 0.1s',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ── 子组件：文章图标块 ───────────────────────────────────────────────────────

/**
 * 可点击的文章图标块。
 * 点击时 dispatch 'xp-open-window' 事件，由 home.tsx 监听后打开对应窗口。
 */
function ArticleTile({ icon, label, postId }: { icon: string; label: string; postId: string }) {
  const [hov, setHov] = useState(false);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('xp-open-window', { detail: postId }));
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '4px', width: '88px', cursor: 'pointer',
        background: hov ? '#5a5a5a' : 'transparent',
        borderRadius: '4px', padding: '8px 4px',
        userSelect: 'none',
      }}
    >
      <img src={icon} alt={label} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
      <span style={{
        fontSize: '11px', fontFamily: FONT,
        color: hov ? '#fff' : '#000',
        textAlign: 'center', wordBreak: 'break-word', lineHeight: '1.3',
      }}>
        {label}
      </span>
    </div>
  );
}

// ── 主组件 ───────────────────────────────────────────────────────────────────

/**
 * BlogFolderApp — 博客文件夹主组件
 *
 * 渲染 XP 资源管理器风格的文章列表，支持分类过滤：
 * - 顶部工具栏 + 地址栏
 * - 分类 Tab 标签栏（自动从 BLOG_POSTS 提取分类）
 * - 左侧任务面板（显示当前分类名称和文章数量）
 * - 主内容区：Flex wrap 图标网格，根据激活分类动态过滤
 */
export function BlogFolderApp() {
  // ── 分类状态 ──────────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);

  // 从 BLOG_POSTS 自动提取所有不重复的分类，并在最前面插入"全部"
  const categories = useMemo<string[]>(() => {
    const unique = Array.from(new Set(BLOG_POSTS.map((p) => p.category).filter(Boolean)));
    return [ALL_LABEL, ...unique];
  }, []);

  // 根据当前分类过滤文章列表
  const filteredPosts = useMemo(() => {
    if (activeCategory === ALL_LABEL) return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // 地址栏路径文字
  const addressPath = activeCategory === ALL_LABEL
    ? 'My Blog'
    : `My Blog > ${activeCategory}`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>

      {/* 顶部工具栏 */}
      <ExplorerToolbar address={addressPath} />

      {/* 分类 Tab 栏 */}
      <CategoryTabBar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* 左侧任务栏 + 主内容区 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* 左侧任务面板（XP Explorer 风格蓝色侧边栏） */}
        <div style={{
          width: '160px',
          background: 'linear-gradient(180deg, #edeff3 0%, #f0f0f0 100%)',
          borderRight: '1px solid #cecece',
          padding: '12px 8px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* 当前分类信息 */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 'bold', color: '#0a2a70',
              fontFamily: FONT, marginBottom: '6px',
              borderBottom: '1px solid #7a9bd4', paddingBottom: '4px',
            }}>
              Blog Tasks
            </div>
            {/* 全部文章链接 */}
            <div
              onClick={() => setActiveCategory(ALL_LABEL)}
              style={{
                fontSize: '11px', color: '#1a3a90', fontFamily: FONT,
                lineHeight: '2', cursor: 'pointer',
                textDecoration: activeCategory === ALL_LABEL ? 'none' : 'underline',
                fontWeight: activeCategory === ALL_LABEL ? 'bold' : 'normal',
              }}
            >
              全部文章 ({BLOG_POSTS.length})
            </div>
            {/* 各分类快捷链接 */}
            {categories.filter((c) => c !== ALL_LABEL).map((cat) => {
              const count = BLOG_POSTS.filter((p) => p.category === cat).length;
              const isActive = activeCategory === cat;
              return (
                <div
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    fontSize: '11px', color: '#1a3a90', fontFamily: FONT,
                    lineHeight: '2', cursor: 'pointer',
                    textDecoration: isActive ? 'none' : 'underline',
                    fontWeight: isActive ? 'bold' : 'normal',
                  }}
                >
                  {cat} ({count})
                </div>
              );
            })}
          </div>

          {/* 当前分类说明 */}
          <div>
            <div style={{
              fontSize: '11px', fontWeight: 'bold', color: '#0a2a70',
              fontFamily: FONT, marginBottom: '6px',
              borderBottom: '1px solid #7a9bd4', paddingBottom: '4px',
            }}>
              Details
            </div>
            <div style={{ fontSize: '10px', color: '#333', fontFamily: FONT, lineHeight: '1.6' }}>
              {activeCategory === ALL_LABEL
                ? `共 ${BLOG_POSTS.length} 篇文章`
                : `${activeCategory} 分类下共 ${filteredPosts.length} 篇文章`}
            </div>
            <div style={{ fontSize: '10px', color: '#555', fontFamily: FONT, lineHeight: '1.6', marginTop: '4px' }}>
              点击文章图标即可在新窗口中打开阅读。
            </div>
          </div>
        </div>

        {/* 文章图标网格 */}
        <div style={{
          flex: 1, padding: '16px',
          display: 'flex', flexWrap: 'wrap',
          alignContent: 'flex-start', gap: '16px',
          background: '#fff', overflowY: 'auto',
        }}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <ArticleTile
                key={post.id}
                icon={post.icon}
                label={post.title}
                postId={post.id}
              />
            ))
          ) : (
            <div style={{
              color: '#888', fontSize: '12px', fontFamily: FONT,
              width: '100%', textAlign: 'center', paddingTop: '40px',
            }}>
              该分类下暂无文章
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
