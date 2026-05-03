/**
 * @file resume/index.tsx
 * @description 通用 Markdown 文档查看器 — 以 Notepad/Word 风格的 XP 窗口展示 Markdown 内容。
 *
 * Phase 6 改造：数据源从硬编码 README.md?raw 迁移至 documents 数据表。
 * - 接受 documentId prop，从 trpc.site.getDocuments 按 id 查找内容。
 * - bgUrl / bgOpacity 由后台「文档管理 → 外观设置」控制，前台不再内嵌控制滑块。
 * - 若数据库中无对应文档，自动降级为 README.md 静态内容（Fallback）。
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';

// 静态 Fallback：数据库中无对应文档时显示此内容
import readmeContent from '../../../../README.md?raw';

const FALLBACK = {
  content:   readmeContent,
  bgUrl:     '',
  bgOpacity: 0.12,
  title:     'README.md',
} as const;

const FONT         = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const XP_BLUE      = '#5a5a5a';
const XP_DARK_BLUE = '#767676';

// ════════════════════════════════════════════════════════════════
//  🎨  Markdown 元素样式映射
// ════════════════════════════════════════════════════════════════

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
  h4: ({ children }) => (
    <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#333', marginBottom: '6px', marginTop: '12px' }}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#333', marginBottom: '10px', marginTop: 0 }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul style={{ fontSize: '12px', color: '#333', marginBottom: '10px', paddingLeft: '20px', lineHeight: 1.8 }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ fontSize: '12px', color: '#333', marginBottom: '10px', paddingLeft: '20px', lineHeight: 1.8 }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: '3px' }}>{children}</li>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    return isBlock ? (
      <code style={{ display: 'block', background: '#e8edf8', border: '1px solid #c5d0e8', borderRadius: '3px', padding: '10px 14px', fontSize: '11px', fontFamily: '"Courier New", monospace', color: '#767676', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, marginBottom: '10px' }}>
        {children}
      </code>
    ) : (
      <code style={{ background: '#e8edf8', border: '1px solid #c5d0e8', borderRadius: '2px', padding: '1px 5px', fontSize: '11px', fontFamily: '"Courier New", monospace', color: '#767676' }}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre style={{ margin: '0 0 10px 0', background: 'none', padding: 0 }}>{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: `3px solid ${XP_BLUE}`, margin: '0 0 10px 0', paddingLeft: '12px', color: '#555', fontStyle: 'italic', background: '#f0f4fb' }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid #d0d8f0`, margin: '16px 0' }} />
  ),
  strong: ({ children }) => (
    <strong style={{ color: XP_DARK_BLUE, fontWeight: 'bold' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: '#444', fontStyle: 'italic' }}>{children}</em>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: XP_BLUE, textDecoration: 'underline', fontSize: '12px' }}>
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ''} style={{ maxWidth: '100%', borderRadius: '4px', border: `1px solid #d0d8f0`, margin: '8px 0', display: 'block', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }} />
  ),
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px' }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: '#dbe4f5' }}>{children}</thead>,
  th: ({ children }) => (
    <th style={{ border: `1px solid #c5d0e8`, padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', color: XP_DARK_BLUE }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ border: `1px solid #d8dfe8`, padding: '4px 10px', color: '#333' }}>{children}</td>
  ),
  tr: ({ children }) => <tr style={{ background: 'transparent' }}>{children}</tr>,
};

// ════════════════════════════════════════════════════════════════
//  📄  主组件
// ════════════════════════════════════════════════════════════════

export function ResumeApp({ documentId }: { documentId: string }) {
  // 每次窗口打开都重新拉取，避免管理后台保存后前台拿到旧缓存
  const { data: docs = [] } = useQuery({
    ...trpc.site.getDocuments.queryOptions(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
  const doc = docs.find((d) => d.id === documentId);

  // 使用显式 !== undefined 判断，避免 || 将空字符串误判为"无文档"而触发 Fallback
  const isFound   = doc !== undefined;
  const content   = isFound ? doc.content   : FALLBACK.content;
  const bgUrl     = isFound ? doc.bgUrl     : FALLBACK.bgUrl;
  const bgOpacity = isFound ? doc.bgOpacity : FALLBACK.bgOpacity;
  const title     = isFound ? doc.title     : FALLBACK.title;
  const hasBg     = Boolean(bgUrl);

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', fontFamily: FONT }}>

      {/* ── 背景图层 ── */}
      {hasBg && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: bgOpacity, zIndex: 0,
          }}
        />
      )}

      {/* ── 内容层 ── */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* 工具栏 */}
        <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', padding: '4px 10px', display: 'flex', gap: '2px', flexShrink: 0, alignItems: 'center' }}>
          {['File', 'Edit', 'View', 'Format', 'Help'].map((m) => (
            <button
              key={m}
              style={{ background: 'none', border: 'none', padding: '2px 8px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}
            >
              {m}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#888' }}>
            {title} — 只读
          </span>
        </div>

        {/* Markdown 渲染区 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: hasBg ? 'transparent' : '#f0ede4' }}>
          <div style={{
            maxWidth: '680px',
            margin: '0 auto 12px auto',
            padding: '32px 40px',
            background: hasBg ? 'rgba(255,255,255,0.88)' : '#fff',
            minHeight: '600px',
            boxShadow: '0 0 12px rgba(0,0,0,0.15)',
            backdropFilter: hasBg ? 'blur(2px)' : 'none',
          }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}
