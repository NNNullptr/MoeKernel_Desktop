/**
 * @file resume/index.tsx
 * @description 通用 Markdown 文档查看器 — 以 Notepad/Word 风格的 XP 窗口展示 Markdown 内容。
 *
 * ════════════════════════════════════════════════════════════════
 *  💡 复用指南：如何用本文件创建一个新的文档窗口应用
 * ════════════════════════════════════════════════════════════════
 *
 * 第一步：复制整个文件夹
 *   将 `src/client/apps/resume/` 文件夹复制为新名称，例如 `src/client/apps/my-notes/`
 *
 * 第二步：修改本文件顶部的 DOC_CONFIG（见下方配置区）
 *   只需更改以下几项：
 *   - content       : 替换为你想展示的 Markdown 文本（可用 Vite ?raw 导入任意 .md 文件）
 *   - backgroundImage: 背景图路径（留空字符串 "" 则使用纯色背景）
 *   - backgroundOpacity: 背景图透明度，范围 0.0（完全透明）到 1.0（完全不透明）
 *   - fontFamily    : 字体（可选，默认 Trebuchet MS）
 *
 * 第三步：修改导出函数名
 *   将底部的 `export function ResumeApp` 重命名为你的组件名，例如 `export function MyNotesApp`
 *
 * 第四步：在注册中心登记 (src/client/apps/registry.ts)
 *   import { MyNotesApp } from './my-notes';
 *   然后在 APP_REGISTRY 中添加：
 *   myNotes: {
 *     id: 'myNotes',
 *     title: '我的笔记.md',
 *     icon: '/assets/icons/your-icon.png',
 *     defaultWidth: 700,
 *     defaultHeight: 540,
 *     AppComponent: MyNotesApp,
 *   }
 *
 * 第五步：添加桌面图标 (src/client/config/icons.config.ts)
 *   在 DESKTOP_ICON_DEFS 数组中添加：
 *   { id: 'myNotes', label: '我的笔记', src: '/assets/icons/your-icon.png' }
 *
 * 完成！双击桌面图标即可打开新文档窗口。
 * ════════════════════════════════════════════════════════════════
 *
 * 实现逻辑：
 * 1. DOC_CONFIG 在文件顶部集中声明所有可定制项，修改时只需改这一个区块。
 * 2. 背景图层使用 `position: absolute` 独立铺底，通过 `opacity` 调节透明度，
 *    文字内容层通过 `position: relative; z-index: 10` 浮于其上，确保文字清晰。
 * 3. ReactMarkdown + remark-gfm 负责将 Markdown 字符串渲染为 HTML 元素，
 *    所有元素通过 `components` prop 注入内联样式，保持与 XP 主题一致。
 * 4. 图片路径约定：文档内引用的图片统一放置于 `public/assets/` 目录，
 *    在 Markdown 中使用绝对路径引用，例如 `![图片](/assets/images/my-photo.jpg)`
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ── 使用 Vite ?raw 导入 Markdown 文件（不发起网络请求，构建时内联） ──────────
// 如果想换成其他 .md 文件，只需修改这行 import 路径即可
import readmeContent from '../../../../README.md?raw';

// ════════════════════════════════════════════════════════════════
//  ⚙️  DOC_CONFIG — 文档应用配置区
//  复用时只需修改这个对象，无需改动下方任何渲染逻辑。
// ════════════════════════════════════════════════════════════════
const DOC_CONFIG = {
  /** 要展示的 Markdown 文本内容。默认读取项目根目录的 README.md */
  content: readmeContent,

  /**
   * 文档背景图路径（相对于 public/ 目录，例如 '/assets/wallpapers/bliss.webp'）
   * 留空字符串 "" 则使用纯白背景，无任何图片。
   * 推荐将图片放置于 public/assets/ 目录下。
   */
  backgroundImage: '',

  /**
   * 背景图透明度，范围 0.0（完全透明，等同于无背景图）到 1.0（完全不透明）
   * 推荐范围 0.05 – 0.25，既有视觉层次感，又不影响文字辨读。
   */
  backgroundOpacity: 0.12,

  /** 文档正文字体，与 XP 主题保持一致 */
  fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
} as const;

// ════════════════════════════════════════════════════════════════
//  🎨  Markdown 元素样式映射
//  通过 ReactMarkdown 的 components prop 为每个 Markdown 元素注入内联样式，
//  使其与 XP 风格文档界面保持视觉一致性。
// ════════════════════════════════════════════════════════════════

/** 代码块高亮色（XP 主题蓝） */
const XP_BLUE = '#5a5a5a';
const XP_DARK_BLUE = '#767676';

/** 为 ReactMarkdown 提供的元素样式组件映射 */
const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  // 标题
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

  // 段落
  p: ({ children }) => (
    <p style={{ fontSize: '12px', lineHeight: 1.8, color: '#333', marginBottom: '10px', marginTop: 0 }}>
      {children}
    </p>
  ),

  // 有序/无序列表
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

  // 行内代码 & 代码块
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    return isBlock ? (
      <code style={{
        display: 'block',
        background: '#e8edf8',
        border: '1px solid #c5d0e8',
        borderRadius: '3px',
        padding: '10px 14px',
        fontSize: '11px',
        fontFamily: '"Courier New", monospace',
        color: '#767676',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 1.7,
        marginBottom: '10px',
      }}>
        {children}
      </code>
    ) : (
      <code style={{
        background: '#e8edf8',
        border: '1px solid #c5d0e8',
        borderRadius: '2px',
        padding: '1px 5px',
        fontSize: '11px',
        fontFamily: '"Courier New", monospace',
        color: '#767676',
      }}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre style={{ margin: '0 0 10px 0', background: 'none', padding: 0 }}>{children}</pre>
  ),

  // 引用块
  blockquote: ({ children }) => (
    <blockquote style={{
      borderLeft: `3px solid ${XP_BLUE}`,
      margin: '0 0 10px 0',
      paddingLeft: '12px',
      color: '#555',
      fontStyle: 'italic',
      background: '#f0f4fb',
    }}>
      {children}
    </blockquote>
  ),

  // 分割线
  hr: () => (
    <hr style={{ border: 'none', borderTop: `1px solid #d0d8f0`, margin: '16px 0' }} />
  ),

  // 粗体 & 斜体
  strong: ({ children }) => (
    <strong style={{ color: XP_DARK_BLUE, fontWeight: 'bold' }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: '#444', fontStyle: 'italic' }}>{children}</em>
  ),

  // 链接
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: XP_BLUE, textDecoration: 'underline', fontSize: '12px' }}>
      {children}
    </a>
  ),

  // 图片（放置于 public/assets/ 目录，使用绝对路径引用）
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      style={{
        maxWidth: '100%',
        borderRadius: '4px',
        border: `1px solid #d0d8f0`,
        margin: '8px 0',
        display: 'block',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      }}
    />
  ),

  // 表格（remark-gfm 提供 GFM 表格支持）
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '11px' }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: '#dbe4f5' }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th style={{ border: `1px solid #c5d0e8`, padding: '5px 10px', textAlign: 'left', fontWeight: 'bold', color: XP_DARK_BLUE }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{ border: `1px solid #d8dfe8`, padding: '4px 10px', color: '#333' }}>
      {children}
    </td>
  ),
  tr: ({ children }) => (
    <tr style={{ background: 'transparent' }}>{children}</tr>
  ),
};

// ════════════════════════════════════════════════════════════════
//  🔧  背景透明度控制滑块（内部工具组件）
// ════════════════════════════════════════════════════════════════

/** 悬浮在右上角的透明度微调滑块（仅在配置了背景图时显示） */
function OpacityControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{
      position: 'absolute',
      top: '38px',
      right: '10px',
      zIndex: 20,
      background: 'rgba(236,233,216,0.92)',
      border: '1px solid #aca899',
      borderRadius: '3px',
      padding: '4px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '10px',
      color: '#555',
      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    }}>
      <span style={{ whiteSpace: 'nowrap' }}>背景透明度</span>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        style={{ width: '70px', cursor: 'pointer', accentColor: XP_BLUE }}
      />
      <span style={{ minWidth: '28px' }}>{Math.round(value * 100)}%</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  📄  主组件
//  ⚠️  复用时请将函数名改为你的应用名，例如 `MyNotesApp`
// ════════════════════════════════════════════════════════════════

/**
 * ResumeApp — Markdown 文档查看器
 *
 * 渲染逻辑：
 * 1. 使用相对定位的外层容器承载两个独立层：背景图层 + 内容层。
 * 2. 背景图层（absolute）使用 DOC_CONFIG.backgroundOpacity 控制透明度，
 *    运行时可通过状态 bgOpacity 实时调节（不影响文字层）。
 * 3. 内容层（relative, z-index 10）包含工具栏和 Markdown 渲染区，
 *    通过 overflow-y: auto 实现独立滚动。
 */
export function ResumeApp() {
  // 运行时可调节的背景透明度（初始值来自 DOC_CONFIG）
  const [bgOpacity, setBgOpacity] = useState<number>(DOC_CONFIG.backgroundOpacity);

  const hasBg = Boolean(DOC_CONFIG.backgroundImage);

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', fontFamily: DOC_CONFIG.fontFamily }}>

      {/* ── 背景图层（绝对定位，独立透明度，不影响文字） ── */}
      {hasBg && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${DOC_CONFIG.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgOpacity,
            zIndex: 0,
          }}
        />
      )}

      {/* ── 内容层（z-index 10，独立滚动） ── */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* 工具栏 */}
        <div style={{
          background: '#ece9d8',
          borderBottom: '1px solid #aca899',
          padding: '4px 10px',
          display: 'flex',
          gap: '2px',
          flexShrink: 0,
          alignItems: 'center',
        }}>
          {['File', 'Edit', 'View', 'Format', 'Help'].map((m) => (
            <button
              key={m}
              style={{ background: 'none', border: 'none', padding: '2px 8px', cursor: 'pointer', fontFamily: DOC_CONFIG.fontFamily, fontSize: '12px' }}
            >
              {m}
            </button>
          ))}
          {/* 文件名标识 */}
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#888', paddingRight: '90px' }}>
            MoeKernel_Desktop / README.md — 只读
          </span>
        </div>

        {/* 背景透明度控制（仅在有背景图时显示） */}
        {hasBg && (
          <OpacityControl value={bgOpacity} onChange={setBgOpacity} />
        )}

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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {DOC_CONFIG.content}
            </ReactMarkdown>
          </div>
        </div>

      </div>
    </div>
  );
}
