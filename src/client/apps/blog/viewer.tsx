/**
 * @file blog/viewer.tsx
 * @description 博客文章阅读器组件 — 通用 Markdown 查看器，专为博客文章设计。
 *
 * ════════════════════════════════════════════════════════════════
 *  💡 使用说明
 * ════════════════════════════════════════════════════════════════
 *
 * 本组件接收一个 BlogPost 对象并渲染其内容。
 * 复用了 ResumeApp 的完整布局结构，包括：
 *   - 工具栏（File / Edit / View / Format / Help）
 *   - 绝对定位背景图层（独立透明度，不影响文字）
 *   - 背景透明度滑块（右上角，仅在配置了背景图时显示）
 *   - ReactMarkdown + remark-gfm 渲染 XP 风格 Markdown
 *
 * 与 ResumeApp 的区别：
 *   - 接收 props.post 对象，而非读取全局 DOC_CONFIG
 *   - 每篇文章有自己的背景图与透明度配置
 *   - 工具栏标题显示文章标题（动态）
 *
 * 使用方式（在 registry.ts 中）：
 *   import { BlogPostViewer } from './blog/viewer';
 *   AppComponent: () => <BlogPostViewer post={blogPost} />
 * ════════════════════════════════════════════════════════════════
 *
 * 实现逻辑：
 * 1. 外层容器相对定位，承载背景图层 + 内容层两个独立层。
 * 2. 背景图层（absolute）通过 opacity 控制透明度，运行时可实时调节。
 * 3. 内容层（relative, z-index 10）包含工具栏和 Markdown 区域。
 * 4. ReactMarkdown 通过 components prop 注入 XP 风格内联样式。
 */

import type React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BLOG_POSTS } from '@/client/config/blog.config';
import { trpc } from '@/client/trpc';

// ── XP 主题色常量 ────────────────────────────────────────────────────────────
const XP_BLUE = '#5a5a5a';
const XP_DARK_BLUE = '#767676';
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ── Markdown 元素样式映射（与 ResumeApp 保持一致） ───────────────────────────
const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: XP_DARK_BLUE, borderBottom: `2px solid ${XP_BLUE}`, paddingBottom: '8px', marginBottom: '16px', marginTop: '24px' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: XP_BLUE, borderBottom: `1px solid #d0d8f0`, paddingBottom: '4px', marginBottom: '12px', marginTop: '20px', letterSpacing: '0.5px' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a4fa0', marginBottom: '8px', marginTop: '16px' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#333', marginBottom: '10px', marginTop: 0 }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul style={{ fontSize: '12px', color: '#333', marginBottom: '10px', paddingLeft: '20px', lineHeight: 1.8 }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ fontSize: '12px', color: '#333', marginBottom: '10px', paddingLeft: '20px', lineHeight: 1.8 }}>{children}</ol>
  ),
  li: ({ children }) => <li style={{ marginBottom: '3px' }}>{children}</li>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    return isBlock ? (
      <code style={{ display: 'block', background: '#e8edf8', border: '1px solid #c5d0e8', borderRadius: '3px', padding: '10px 14px', fontSize: '11px', fontFamily: '"Courier New", monospace', color: XP_DARK_BLUE, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, marginBottom: '10px' }}>
        {children}
      </code>
    ) : (
      <code style={{ background: '#e8edf8', border: '1px solid #c5d0e8', borderRadius: '2px', padding: '1px 5px', fontSize: '11px', fontFamily: '"Courier New", monospace', color: XP_DARK_BLUE }}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre style={{ margin: '0 0 10px 0', background: 'none', padding: 0 }}>{children}</pre>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: `3px solid ${XP_BLUE}`, margin: '0 0 10px 0', paddingLeft: '12px', color: '#555', fontStyle: 'italic', background: '#f0f4fb' }}>
      {children}
    </blockquote>
  ),
  hr: () => <hr style={{ border: 'none', borderTop: '1px solid #d0d8f0', margin: '16px 0' }} />,
  strong: ({ children }) => <strong style={{ color: XP_DARK_BLUE, fontWeight: 'bold' }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: '#444', fontStyle: 'italic' }}>{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: XP_BLUE, textDecoration: 'underline', fontSize: '12px' }}>
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ''} style={{ maxWidth: '100%', borderRadius: '4px', border: '1px solid #d0d8f0', margin: '8px 0', display: 'block', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px' }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: '#dbe4f5' }}>{children}</thead>,
  th: ({ children }) => (
    <th style={{ border: '1px solid #c5d0e8', padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', color: XP_DARK_BLUE }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ border: '1px solid #d8dfe8', padding: '4px 10px', color: '#333' }}>{children}</td>
  ),
  tr: ({ children }) => <tr style={{ background: 'transparent' }}>{children}</tr>,
};

/** 背景透明度控制滑块（仅在配置了背景图时显示） */
function OpacityControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{
      position: 'absolute', top: '38px', right: '10px', zIndex: 20,
      background: 'rgba(236,233,216,0.92)', border: '1px solid #aca899',
      borderRadius: '3px', padding: '4px 8px',
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '10px', color: '#555', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    }}>
      <span style={{ whiteSpace: 'nowrap' }}>背景透明度</span>
      <input
        type="range" min={0} max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        style={{ width: '70px', cursor: 'pointer', accentColor: XP_BLUE }}
      />
      <span style={{ minWidth: '28px' }}>{Math.round(value * 100)}%</span>
    </div>
  );
}

/**
 * BlogPostViewer — 博客文章阅读器
 *
 * @param post - 来自 BLOG_POSTS 的博客文章配置对象
 *
 * 渲染逻辑：
 * 1. 外层容器（relative, overflow hidden）承载背景层 + 内容层。
 * 2. 背景图层（absolute, inset 0）独立控制透明度，不影响文字层。
 * 3. 内容层（relative, z-index 10）包含 XP 风格工具栏和 Markdown 渲染区。
 * 4. Markdown 区域可独立滚动（overflow-y: auto）。
 */
export function BlogPostViewer({ postId }: { postId: string }) {
  const { data: dbPosts } = useQuery({
    ...trpc.site.getBlogPosts.queryOptions(),
    staleTime: 60_000,
  });
  const post = dbPosts?.find((p) => p.id === postId) ?? BLOG_POSTS.find((p) => p.id === postId);

  const [bgOpacity, setBgOpacity] = useState<number>(post?.bgOpacity ?? 1);
  const hasBg = Boolean(post?.backgroundImage);

  if (!post) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontFamily: FONT }}>
        <span style={{ color: '#888', fontSize: '12px' }}>正在加载文章内容...</span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', fontFamily: FONT }}>

      {/* ── 背景图层（绝对定位，独立透明度） ── */}
      {hasBg && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${post.backgroundImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: bgOpacity, zIndex: 0,
          }}
        />
      )}

      {/* ── 内容层（z-index 10，独立滚动） ── */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* 工具栏 */}
        <div style={{
          background: '#ece9d8', borderBottom: '1px solid #aca899',
          padding: '4px 10px', display: 'flex', gap: '2px',
          flexShrink: 0, alignItems: 'center',
        }}>
          {['File', 'Edit', 'View', 'Format', 'Help'].map((m) => (
            <button
              key={m}
              type="button"
              style={{ background: 'none', border: 'none', padding: '2px 8px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}
            >
              {m}
            </button>
          ))}
          {/* 动态显示文章标题 */}
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#888', paddingRight: hasBg ? '100px' : '10px' }}>
            {post.title} — 只读
          </span>
        </div>

        {/* 背景透明度控制（仅在有背景图时显示） */}
        {hasBg && <OpacityControl value={bgOpacity} onChange={setBgOpacity} />}

        {/* Markdown 渲染区 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: hasBg ? 'transparent' : '#f0ede4' }}>
          <div style={{
            maxWidth: '680px', margin: '0 auto 12px auto', padding: '32px 40px',
            // 💡 提示：如需修改覆盖在背景图上方的白色文本块透明度，更改下方 rgba(255,255,255,0) 中的 0 即可（0 代表完全透明，1 代表完全不透明）
            background: hasBg ? 'rgba(255,255,255,0)' : '#fff',
            minHeight: '400px', boxShadow: '0 0 12px rgba(0,0,0,0.15)',
            backdropFilter: hasBg ? 'blur(2px)' : 'none',
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}
