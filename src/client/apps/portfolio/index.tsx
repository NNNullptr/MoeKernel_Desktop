/**
 * @file portfolio/index.tsx
 * @description My Portfolio 应用 — Windows XP Explorer 风格的作品展示文件夹
 *
 * 数据源：trpc.portfolio.list（仅返回 visible=true 的条目，按 order 升序）
 * 背景设置：通过管理后台 /admin/portfolio 配置，前台自动读取。
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';
import { useSiteSettings } from '@/client/hooks/use-site-config';

// ─── 字体常量 ────────────────────────────────────────────────────────────────
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ─── 左侧面板配置（纯前端，不入库）─────────────────────────────────────────
const SIDEBAR = {
  background:   'linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)',
  borderColor:  '#c8c8c8',
  titleColor:   '#767676',
  linkColor:    '#0033aa',
  tasksTitle:   'File and Folder Tasks',
  taskItems:    [
    { icon: '📁', text: 'Make new folder' },
    { icon: '📤', text: 'Publish to Web' },
    { icon: '📧', text: 'E-mail items' },
  ],
  detailsTitle: 'Details',
  owner:        'Portfolio Owner',
} as const;

// ─── DB 返回的作品类型 ────────────────────────────────────────────────────────
type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  techStack: string;
  link: string | null;
  imageUrl: string;
  category: string;
  order: number;
  visible: boolean;
};

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const tags = item.techStack.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT, padding: '24px',
      }}
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '12px', right: '14px',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: '3px', color: '#fff', fontSize: '14px',
          fontWeight: 'bold', padding: '2px 8px', cursor: 'pointer',
          fontFamily: FONT, lineHeight: 1.4,
        }}
      >
        ✕ Close
      </button>

      {/* 大图 */}
      {item.imageUrl && (
        <div
          style={{
            maxWidth: '80%', maxHeight: '60%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
              borderRadius: '3px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              border: '2px solid rgba(255,255,255,0.15)',
            }}
          />
        </div>
      )}

      {/* 信息区 */}
      <div
        style={{ textAlign: 'center', maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold', marginBottom: '6px' }}>
          {item.title}
        </div>

        {item.category && (
          <div style={{
            display: 'inline-block',
            background: 'rgba(49,106,197,0.5)',
            border: '1px solid rgba(100,160,255,0.4)',
            borderRadius: '3px', padding: '1px 8px',
            fontSize: '11px', color: '#9ec8ff', marginBottom: '10px',
          }}>
            {item.category}
          </div>
        )}

        {item.description && (
          <div style={{ color: '#bcd0f0', fontSize: '12px', lineHeight: 1.7, marginBottom: '10px' }}>
            {item.description}
          </div>
        )}

        {/* 技术栈标签 */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 12 }}>
            {tags.map((t) => (
              <span key={t} style={{
                fontSize: 10, color: '#c8deff',
                background: 'rgba(40,80,160,0.55)',
                border: '1px solid rgba(100,160,255,0.35)',
                borderRadius: 3, padding: '1px 7px',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* 项目链接 */}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 3, color: '#fff', fontSize: 11,
              padding: '3px 14px', textDecoration: 'none',
              fontFamily: FONT,
            }}
          >
            🔗 查看项目
          </a>
        )}
      </div>
    </div>
  );
}

// ─── 顶部工具栏 ───────────────────────────────────────────────────────────────

function ExplorerToolbar() {
  return (
    <div style={{
      background: '#ece9d8',
      borderBottom: '1px solid #aca899',
      fontFamily: FONT, fontSize: '12px', flexShrink: 0,
    }}>
      {/* 菜单栏 */}
      <div style={{
        display: 'flex', gap: '2px', padding: '2px 4px',
        borderBottom: '1px solid #aca899', alignItems: 'center',
      }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button key={m} style={{
            background: 'none', border: 'none', padding: '2px 6px',
            cursor: 'pointer', fontFamily: FONT, fontSize: '12px',
          }}>
            {m}
          </button>
        ))}
      </div>

      {/* 地址栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}>
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div style={{
          flex: 1, background: '#fff', border: '1px solid #999',
          padding: '1px 6px', fontSize: '12px', borderRadius: '2px',
        }}>
          C:\Users\Portfolio\My Works
        </div>
      </div>
    </div>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

export function PortfolioApp() {
  const [activeCategory,  setActiveCategory]  = useState('All');
  const [hoveredId,       setHoveredId]       = useState<string | null>(null);
  const [lightboxItem,    setLightboxItem]    = useState<PortfolioItem | null>(null);

  // 从 DB 读取作品列表
  const { data: items = [], isLoading } = useQuery({
    ...trpc.portfolio.list.queryOptions(),
    staleTime: 30_000,
  });

  // 从 site_settings 读取背景
  const { portfolioBgUrl, portfolioBgOpacity } = useSiteSettings();
  const hasBackground = portfolioBgUrl.length > 0;

  // 自动生成分类 Tab
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['All', ...cats];
  }, [items]);

  // 按分类过滤
  const filtered =
    activeCategory === 'All'
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <div style={{
      position: 'relative',
      height: '100%', display: 'flex', flexDirection: 'column',
      fontFamily: FONT, overflow: 'hidden',
    }}>
      {/* 背景图层 */}
      {hasBackground && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `url(${portfolioBgUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: portfolioBgOpacity,
        }} />
      )}

      {/* 内容层 */}
      <div style={{
        position: 'relative', zIndex: 1,
        height: '100%', display: 'flex', flexDirection: 'column',
      }}>
        <ExplorerToolbar />

        {/* 分类 Tab 栏 */}
        <div style={{
          background: '#ece9d8', padding: '6px 8px 0 8px',
          borderBottom: '1px solid #aca899',
          display: 'flex', alignItems: 'flex-end',
          flexShrink: 0, flexWrap: 'wrap', gap: '2px',
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat
                  ? 'linear-gradient(180deg,#fff 0%,#ece9d8 100%)'
                  : 'linear-gradient(180deg,#d4d0c8 0%,#c0bdb5 100%)',
                border: '1px solid #aca899',
                borderBottom: activeCategory === cat ? '1px solid #ece9d8' : '1px solid #aca899',
                borderRadius: '3px 3px 0 0',
                padding: '3px 12px', cursor: 'pointer',
                fontFamily: FONT, fontSize: '11px',
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

        {/* 主区域 */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 左侧面板 */}
          <div style={{
            width: '150px', flexShrink: 0,
            background: SIDEBAR.background,
            borderRight: `1px solid ${SIDEBAR.borderColor}`,
            padding: '12px 8px', overflowY: 'auto',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 'bold', color: SIDEBAR.titleColor,
              marginBottom: '8px',
              borderBottom: `1px solid ${SIDEBAR.borderColor}`, paddingBottom: '4px',
            }}>
              {SIDEBAR.tasksTitle}
            </div>
            {SIDEBAR.taskItems.map((t) => (
              <div key={t.text} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '3px 2px', cursor: 'pointer',
                fontSize: '11px', color: SIDEBAR.linkColor, borderRadius: '2px',
              }}>
                <span>{t.icon}</span>
                <span style={{ textDecoration: 'underline' }}>{t.text}</span>
              </div>
            ))}
            <div style={{
              fontSize: '11px', fontWeight: 'bold', color: SIDEBAR.titleColor,
              margin: '14px 0 8px',
              borderBottom: `1px solid ${SIDEBAR.borderColor}`, paddingBottom: '4px',
            }}>
              {SIDEBAR.detailsTitle}
            </div>
            <div style={{ fontSize: '10px', color: '#333', lineHeight: 1.7 }}>
              <div><strong>Items:</strong> {filtered.length}</div>
              <div><strong>Type:</strong> Portfolio</div>
              <div><strong>Owner:</strong> {SIDEBAR.owner}</div>
            </div>
          </div>

          {/* 图片网格 */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))',
            gap: '14px', alignContent: 'flex-start',
            background: hasBackground ? 'transparent' : '#fff',
          }}>
            {isLoading ? (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center',
                color: '#888', fontSize: '12px', paddingTop: '40px',
              }}>
                加载中…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1', textAlign: 'center',
                color: '#888', fontSize: '12px', paddingTop: '40px',
              }}>
                此分类暂无作品。
              </div>
            ) : filtered.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setLightboxItem(item)}
                style={{
                  border: hoveredId === item.id ? '2px solid #5a5a5a' : '2px solid #d0d8e8',
                  borderRadius: '4px', overflow: 'hidden', cursor: 'pointer',
                  background: '#f5f8ff',
                  boxShadow: hoveredId === item.id
                    ? '0 2px 8px rgba(49,106,197,0.25)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'border-color 0.15s,box-shadow 0.15s',
                }}
              >
                {/* 缩略图 */}
                <div style={{
                  position: 'relative', height: '90px',
                  background: '#e8eef8', overflow: 'hidden',
                }}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, color: '#b0b8c8',
                    }}>
                      🖼️
                    </div>
                  )}

                  {/* Hover 覆盖层 */}
                  {hoveredId === item.id && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(49,106,197,0.75)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexDirection: 'column', gap: '4px',
                    }}>
                      <span style={{
                        color: '#fff', fontSize: '11px', fontWeight: 'bold',
                        textAlign: 'center', padding: '0 4px',
                      }}>
                        {item.title}
                      </span>
                      <span style={{
                        color: '#fff', fontSize: '10px',
                        background: 'rgba(0,0,0,0.3)', borderRadius: '2px',
                        padding: '1px 5px', marginTop: '2px',
                      }}>
                        🔍 点击查看
                      </span>
                    </div>
                  )}
                </div>

                {/* 卡片底部 */}
                <div style={{
                  padding: '6px 8px', borderTop: '1px solid #d0d8e8',
                  background: hasBackground ? 'rgba(245,248,255,0.9)' : '#f5f8ff',
                }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 'bold', color: '#767676',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {item.title}
                  </div>
                  {item.category && (
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '1px' }}>
                      {item.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 状态栏 */}
        <div style={{
          background: '#ece9d8', borderTop: '1px solid #aca899',
          padding: '2px 10px', flexShrink: 0,
        }}>
          <span style={{ fontSize: '11px', color: '#333' }}>
            {filtered.length} object(s)
          </span>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem !== null && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
