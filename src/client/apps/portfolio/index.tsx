/**
 * @file portfolio/index.tsx
 * @description My Portfolio 应用 — Windows XP Explorer 风格的作品展示文件夹
 *
 * ═══════════════════════════════════════════════════════════════════
 *  📖 使用指南 — 如何定制你的 Portfolio
 * ═══════════════════════════════════════════════════════════════════
 *
 * 【1. 如何修改背景图片】
 *    找到下方 PORTFOLIO_CONFIG.background.imageUrl，填入你的图片路径。
 *    图片建议放在 public/assets/portfolio/ 目录下，
 *    路径写法示例：imageUrl: '/assets/portfolio/my-bg.jpg'
 *    如果不想要背景图，将 imageUrl 设为空字符串 ''。
 *
 * 【2. 如何调节背景图默认透明度】
 *    修改 PORTFOLIO_CONFIG.background.defaultOpacity（范围 0~1）。
 *    0 = 完全透明（看不见），1 = 完全不透明，推荐 0.15~0.35。
 *    用户也可以通过顶部工具栏的拉杆实时调节。
 *
 * 【3. 如何修改左侧面板颜色】
 *    找到 PORTFOLIO_CONFIG.sidebar.background，填入任意合法的 CSS background 值，例如：
 *    - 纯色：'#c8daf5'
 *    - 渐变：'linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)'  （原始 XP 蓝）
 *    - 紫色系：'linear-gradient(180deg,#e8dcfc 0%,#c8b0f8 100%)'
 *    - 绿色系：'linear-gradient(180deg,#d0f0dc 0%,#a0d8b8 100%)'
 *
 * 【4. 如何修改左侧面板文字内容】
 *    - sidebar.tasksTitle    ：第一个分组的标题文字
 *    - sidebar.taskItems     ：任务列表，每项包含 icon(emoji) 和 text(显示文字)
 *    - sidebar.detailsTitle  ：第二个分组（Details）的标题文字
 *    - sidebar.owner         ：Details 里显示的所有者名字
 *
 * 【5. 如何添加一张新的作品图片】
 *    在下方 PORTFOLIO_ITEMS 数组中添加一个新对象，格式如下：
 *
 *    {
 *      id: 'p7',                              // 唯一 ID，不能重复，建议 p1, p2, p3...
 *      title: '我的新作品',                    // 显示在卡片下方和灯箱中的作品名称
 *      category: 'UI Design',                 // 分类标签（会自动出现在顶部 Tab 中，无需手动添加）
 *      fileName: 'my-new-work.png',           // 图片文件名（图片放在 public/assets/portfolio/ 目录下）
 *      description: '这是一段作品描述文字。',   // 点击大图后，灯箱里展示的详情描述
 *      year: '2025',                          // 年份，显示在卡片 hover 时
 *    }
 *
 *    然后把对应图片文件（例如 my-new-work.png）放入：
 *    public/assets/portfolio/my-new-work.png
 *
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';

// ─── 字体常量 ────────────────────────────────────────────────────────────────
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ═══════════════════════════════════════════════════════════════════
//  ✏️ PORTFOLIO_CONFIG — 在这里修改所有外观配置
// ═══════════════════════════════════════════════════════════════════
const PORTFOLIO_CONFIG = {
  background: {
    // 背景图路径。例如 '/assets/portfolio/bg.jpg'。设为 '' 则无背景图。
    imageUrl: '',
    // 默认透明度 (0~1)。用户可以通过顶部滑块实时调整。
    defaultOpacity: 0.2,
  },

  sidebar: {
    // 左侧面板背景色。填入任意合法的 CSS background 值：
    // 原始 XP 蓝色渐变：'linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)'
    // 紫色渐变：       'linear-gradient(180deg,#e8dcfc 0%,#c4b0f8 100%)'
    // 纯色：           '#c8daf5'
    background: 'linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)',

    // 分隔线和边框颜色（与 background 配套调整）
    borderColor: '#c8c8c8',

    // 文字标题颜色（分组标题）
    titleColor: '#767676',

    // 任务链接文字颜色
    linkColor: '#0033aa',

    // ── "File and Folder Tasks" 区域 ─────────────────────────────
    tasksTitle: 'File and Folder Tasks',
    taskItems: [
      { icon: '📁', text: 'Make new folder' },
      { icon: '📤', text: 'Publish to Web' },
      { icon: '📧', text: 'E-mail items' },
    ],

    // ── "Details" 区域 ────────────────────────────────────────────
    detailsTitle: 'Details',
    // Details 区域中显示的"拥有者"姓名
    owner: 'Portfolio Owner',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
//  📂 PORTFOLIO_ITEMS — 在这里添加/删除你的作品
// ═══════════════════════════════════════════════════════════════════
interface PortfolioItem {
  /** 唯一 ID（建议 p1, p2, p3...） */
  id: string;
  /** 作品名称，显示在卡片底部和灯箱中 */
  title: string;
  /** 分类标签，会自动出现在顶部 Tab（无需手动添加类别） */
  category: string;
  /** 文件名（放在 public/assets/portfolio/ 目录下） */
  fileName: string;
  /** 点击大图后灯箱中显示的详情描述 */
  description: string;
  /** 年份 */
  year: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'XP Desktop UI',
    category: 'Web Design',
    fileName: 'xp-desktop.webp',
    description: '一个完整的 Windows XP 风格桌面 UI，包括图标、任务栏和窗口管理系统。',
    year: '2024',
  },
  {
    id: 'p2',
    title: 'Retro Music App',
    category: 'UI Design',
    fileName: 'retro-music.png',
    description: 'Winamp 2.x 风格音乐播放器，支持真实 HTML5 音频引擎和复古界面。',
    year: '2024',
  },
  {
    id: 'p3',
    title: 'Pixel Art Series',
    category: 'Illustration',
    fileName: 'pixel-art.png',
    description: '一组像素风格的插画作品，灵感来源于 90 年代 16 位游戏美学。',
    year: '2023',
  },
  {
    id: 'p4',
    title: 'Chat Application',
    category: 'Full-Stack',
    fileName: 'chat-app.png',
    description: '全栈即时通讯应用，基于 WebSocket 实现实时消息推送，仿 MSN Messenger 风格。',
    year: '2023',
  },
  {
    id: 'p5',
    title: 'Portfolio v1',
    category: 'Web Design',
    fileName: 'portfolio-v1.png',
    description: '我的第一版个人作品集网站，采用极简黑白设计风格。',
    year: '2022',
  },
  {
    id: 'p6',
    title: 'Icon Pack',
    category: 'Illustration',
    fileName: 'icon-pack.png',
    description: '一套包含 80+ 图标的 XP 风格图标包，支持 32px/64px 两种规格。',
    year: '2022',
  },
];

// ─── 辅助函数：根据 fileName 生成图片 URL ────────────────────────────────────
function getImageUrl(fileName: string): string {
  return `/assets/portfolio/${fileName}`;
}

// ─── 图片预览 Lightbox ────────────────────────────────────────────────────────
interface LightboxProps {
  item: PortfolioItem;
  onClose: () => void;
}

/**
 * 图片灯箱组件 — 点击图片后在窗口内部弹出，显示大图 + 详情 + 关闭按钮。
 * 使用绝对定位覆盖整个 Portfolio 窗口（不是全屏），z-index 高于内容区。
 */
function Lightbox({ item, onClose }: LightboxProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        padding: '24px',
      }}
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: '3px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '2px 8px',
          cursor: 'pointer',
          fontFamily: FONT,
          lineHeight: 1.4,
        }}
      >
        ✕ Close
      </button>

      {/* 大图容器 */}
      <div
        style={{
          maxWidth: '80%',
          maxHeight: '65%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getImageUrl(item.fileName)}
          alt={item.title}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '3px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            border: '2px solid rgba(255,255,255,0.15)',
          }}
          onError={(e) => {
            // 图片加载失败时显示占位符
            const target = e.currentTarget;
            target.style.width = '320px';
            target.style.height = '200px';
            target.style.background = '#1a2a4a';
            target.style.objectFit = 'none';
            target.alt = '图片未找到 — 请将图片放入 public/assets/portfolio/';
          }}
        />
      </div>

      {/* 作品信息 */}
      <div
        style={{ textAlign: 'center', maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', marginBottom: '6px' }}>
          {item.title}
        </div>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(49,106,197,0.5)',
            border: '1px solid rgba(100,160,255,0.4)',
            borderRadius: '3px',
            padding: '1px 8px',
            fontSize: '11px',
            color: '#9ec8ff',
            marginBottom: '10px',
          }}
        >
          {item.category} · {item.year}
        </div>
        <div style={{ color: '#bcd0f0', fontSize: '12px', lineHeight: 1.7 }}>
          {item.description}
        </div>
      </div>
    </div>
  );
}

// ─── 顶部工具栏 ───────────────────────────────────────────────────────────────
interface ToolbarProps {
  opacity: number;
  onOpacityChange: (v: number) => void;
  showBgControl: boolean;
}

function ExplorerToolbar({ opacity, onOpacityChange, showBgControl }: ToolbarProps) {
  return (
    <div
      style={{
        background: '#ece9d8',
        borderBottom: '1px solid #aca899',
        fontFamily: FONT,
        fontSize: '12px',
        flexShrink: 0,
      }}
    >
      {/* 菜单栏 */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '2px 4px',
          borderBottom: '1px solid #aca899',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '2px' }}>
          {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
            <button
              key={m}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px 6px',
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '12px',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* 背景透明度控制 — 仅在有背景图时显示 */}
        {showBgControl && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              paddingRight: '8px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#555', whiteSpace: 'nowrap' }}>
              🖼 BG Opacity
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={opacity}
              onChange={(e) => onOpacityChange(Number(e.target.value))}
              style={{ width: '80px', cursor: 'pointer', accentColor: '#5a5a5a' }}
              title={`背景透明度：${Math.round(opacity * 100)}%`}
            />
            <span style={{ fontSize: '10px', color: '#333', minWidth: '28px' }}>
              {Math.round(opacity * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* 地址栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 6px',
        }}
      >
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid #999',
            padding: '1px 6px',
            fontSize: '12px',
            borderRadius: '2px',
          }}
        >
          C:\Users\Portfolio\My Works
        </div>
      </div>
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────
/**
 * PortfolioApp — Portfolio 文件夹主组件
 *
 * 渲染层次（从底到顶）：
 * 1. 背景图层（absolute，z-index 0）
 * 2. 内容区（z-index 1）：工具栏 + 分类 Tab + 左侧边栏 + 图片网格
 * 3. Lightbox 覆盖层（absolute，z-index 100，仅点击图片后显示）
 */
export function PortfolioApp() {
  // 当前选中的分类 Tab
  const [activeCategory, setActiveCategory] = useState('All');
  // 当前鼠标悬停的卡片 ID
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // 当前点击查看大图的作品（null = 关闭灯箱）
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  // 背景图透明度（由顶部滑块控制）
  const [bgOpacity, setBgOpacity] = useState<number>(PORTFOLIO_CONFIG.background.defaultOpacity);

  // 从 PORTFOLIO_ITEMS 自动提取唯一分类（不写死，新增作品自动更新 Tab 列表）
  const categories = useMemo(() => {
    const cats = Array.from(new Set(PORTFOLIO_ITEMS.map((i) => i.category)));
    return ['All', ...cats];
  }, []);

  // 按分类过滤作品列表
  const filtered =
    activeCategory === 'All'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((p) => p.category === activeCategory);

  const { sidebar } = PORTFOLIO_CONFIG;
  const hasBackground = PORTFOLIO_CONFIG.background.imageUrl.length > 0;

  return (
    <div
      style={{
        position: 'relative', // 必须，用于 absolute 子元素定位
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      {/* ── 背景图层（z-index 0，不拦截鼠标事件） ─────────────────────────── */}
      {hasBackground && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            backgroundImage: `url(${PORTFOLIO_CONFIG.background.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgOpacity,
          }}
        />
      )}

      {/* ── 内容区（z-index 1，覆盖在背景图上） ───────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 工具栏 */}
        <ExplorerToolbar
          opacity={bgOpacity}
          onOpacityChange={setBgOpacity}
          showBgControl={hasBackground}
        />

        {/* 分类 Tab 栏 */}
        <div
          style={{
            background: '#ece9d8',
            padding: '6px 8px 0 8px',
            borderBottom: '1px solid #aca899',
            display: 'flex',
            alignItems: 'flex-end',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: '2px',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background:
                  activeCategory === cat
                    ? 'linear-gradient(180deg,#fff 0%,#ece9d8 100%)'
                    : 'linear-gradient(180deg,#d4d0c8 0%,#c0bdb5 100%)',
                border: '1px solid #aca899',
                borderBottom:
                  activeCategory === cat ? '1px solid #ece9d8' : '1px solid #aca899',
                borderRadius: '3px 3px 0 0',
                padding: '3px 12px',
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '11px',
                fontWeight: activeCategory === cat ? 'bold' : 'normal',
                color: activeCategory === cat ? '#767676' : '#333',
                marginRight: '2px',
                position: 'relative',
                bottom: activeCategory === cat ? '-1px' : '0',
                zIndex: activeCategory === cat ? 1 : 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 主区域：左侧边栏 + 图片网格 */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* ── 左侧任务面板 ────────────────────────────────────────────────── */}
          <div
            style={{
              width: '150px',
              flexShrink: 0,
              // 颜色由 PORTFOLIO_CONFIG.sidebar.background 控制
              background: sidebar.background,
              borderRight: `1px solid ${sidebar.borderColor}`,
              padding: '12px 8px',
              overflowY: 'auto',
            }}
          >
            {/* File and Folder Tasks 标题 */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: sidebar.titleColor,
                marginBottom: '8px',
                borderBottom: `1px solid ${sidebar.borderColor}`,
                paddingBottom: '4px',
              }}
            >
              {sidebar.tasksTitle}
            </div>

            {/* 任务列表 */}
            {sidebar.taskItems.map((t) => (
              <div
                key={t.text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 2px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: sidebar.linkColor,
                  borderRadius: '2px',
                }}
              >
                <span>{t.icon}</span>
                <span style={{ textDecoration: 'underline' }}>{t.text}</span>
              </div>
            ))}

            {/* Details 标题 */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: sidebar.titleColor,
                margin: '14px 0 8px',
                borderBottom: `1px solid ${sidebar.borderColor}`,
                paddingBottom: '4px',
              }}
            >
              {sidebar.detailsTitle}
            </div>

            {/* Details 内容 */}
            <div style={{ fontSize: '10px', color: '#333', lineHeight: 1.7 }}>
              <div>
                <strong>Items:</strong> {filtered.length}
              </div>
              <div>
                <strong>Type:</strong> Portfolio
              </div>
              <div>
                <strong>Owner:</strong> {sidebar.owner}
              </div>
            </div>
          </div>

          {/* ── 图片网格 ─────────────────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))',
              gap: '14px',
              alignContent: 'flex-start',
              background: hasBackground ? 'transparent' : '#fff',
            }}
          >
            {filtered.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  color: '#888',
                  fontSize: '12px',
                  paddingTop: '40px',
                }}
              >
                此分类暂无作品。请在 PORTFOLIO_ITEMS 中添加。
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setLightboxItem(item)}
                  style={{
                    border:
                      hoveredId === item.id ? '2px solid #5a5a5a' : '2px solid #d0d8e8',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#f5f8ff',
                    boxShadow:
                      hoveredId === item.id
                        ? '0 2px 8px rgba(49,106,197,0.25)'
                        : '0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'border-color 0.15s,box-shadow 0.15s',
                  }}
                >
                  {/* 缩略图区域 */}
                  <div
                    style={{
                      position: 'relative',
                      height: '90px',
                      background: '#e8eef8',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={getImageUrl(item.fileName)}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        // 图片路径错误时显示占位文字
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.placeholder')) {
                          const ph = document.createElement('div');
                          ph.className = 'placeholder';
                          ph.style.cssText =
                            'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;color:#8899aa;text-align:center;padding:4px;';
                          ph.textContent = '图片未找到\n请放入\nassets/portfolio/';
                          parent.appendChild(ph);
                        }
                      }}
                    />

                    {/* Hover 覆盖层 */}
                    {hoveredId === item.id && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(49,106,197,0.75)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: '0 4px',
                          }}
                        >
                          {item.title}
                        </span>
                        <span style={{ color: '#c8deff', fontSize: '10px' }}>
                          {item.year}
                        </span>
                        <span
                          style={{
                            color: '#fff',
                            fontSize: '10px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '2px',
                            padding: '1px 5px',
                            marginTop: '2px',
                          }}
                        >
                          🔍 点击查看
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 卡片底部信息 */}
                  <div
                    style={{
                      padding: '6px 8px',
                      borderTop: '1px solid #d0d8e8',
                      background: hasBackground ? 'rgba(245,248,255,0.9)' : '#f5f8ff',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#767676',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '1px' }}>
                      {item.category}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 状态栏 */}
        <div
          style={{
            background: '#ece9d8',
            borderTop: '1px solid #aca899',
            padding: '2px 10px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '11px', color: '#333' }}>
            {filtered.length} object(s)
          </span>
        </div>
      </div>

      {/* ── 灯箱覆盖层（z-index 100，点击图片后弹出） ──────────────────────── */}
      {lightboxItem !== null && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
