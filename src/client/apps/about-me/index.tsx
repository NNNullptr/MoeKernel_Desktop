/**
 * @file about-me/index.tsx
 * @description About Me 个人简介应用 — 图层分离、固定底部技能标签、Markdown 中区滚动。
 *
 * ============================================================
 * 🛠️ 中文修改指南
 * ============================================================
 *
 * 【1. 修改头像图片】
 *   - 将你的头像文件放入 `public/assets/` 目录（例如 `public/assets/avatar.png`）。
 *   - 修改下方 `ABOUT_CONFIG.avatarSrc` 的值为 `/assets/avatar.png`。
 *   - 如果不想用图片，保持空字符串 `""` 则显示默认 Emoji 图标。
 *
 * 【2. 修改背景图片】
 *   - 将背景图文件放入 `public/assets/wallpapers/` 目录。
 *   - 修改 `ABOUT_CONFIG.bgImageSrc` 为对应路径，例如 `/assets/wallpapers/bg.jpg`。
 *   - 通过拖动右上角的透明度滑块，可以实时调节背景图的显示强度（0=全透明, 1=全不透明）。
 *   - 修改 `ABOUT_CONFIG.bgOpacity` 可改变页面初始加载时的默认透明度（0.0 ~ 1.0）。
 *
 * 【3. 修改技能标签颜色】
 *   - 找到 `ABOUT_CONFIG.skills` 数组。
 *   - 每个技能对象有三个字段：
 *       name      → 标签显示的文字
 *       bgColor   → 标签背景颜色（支持任意 CSS 颜色，如 "#316ac5" 或 "rgb(49,106,197)"）
 *       textColor → 标签文字颜色（建议与背景对比鲜明）
 *   - 直接新增、删除或修改这些对象即可更新技能标签区。
 *
 * 【4. 修改中间 Markdown 内容】
 *   - 找到 `ABOUT_CONFIG.markdownContent` 字段。
 *   - 使用标准 Markdown 语法书写即可（支持 ##标题、**加粗**、- 列表、> 引用等）。
 *   - 内容较长时，中间区域会自动出现滚动条，不影响顶部和底部布局。
 *
 * ============================================================
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ============================================================
// ⚙️ ABOUT_CONFIG — 所有内容都在这里修改，无需触碰组件逻辑
// ============================================================
const ABOUT_CONFIG = {
  // 头像图片路径。填写 public/assets/ 下的路径，如 "/assets/avatar.png"。
  // 留空字符串 "" 则显示默认 Emoji 占位符。
  avatarSrc: '',

  // 背景图片路径。填写 public/assets/wallpapers/ 下的路径。
  bgImageSrc: '',

  // 背景图初始透明度（0.0 ~ 1.0）。0 = 完全透明，1 = 完全不透明。
  bgOpacity: 0.15,

  // 个人基础信息
  name: 'NNNullptr',
  title: 'Full-Stack Developer & Designer',
  location: '📍 Istanbul, Turkey',

  // 中间滚动区 Markdown 内容。支持标准 Markdown 语法。
  markdownContent: `
## 👋 Hey there!

Welcome to my **Windows XP** portfolio!

I'm a designer & developer who loves building beautiful, interactive experiences on the web. I specialize in **retro-inspired UI**, React, and TypeScript.

---

## 🎮 Interests

- 🖥️ Retro computing nostalgia & Y2K aesthetics
- 🎵 Chiptune music & lo-fi beats
- 🎮 Indie game development & pixel art
- 🌐 Exploring the early internet

---

## 🚀 Current Focus

Currently exploring **WebGL shaders**, **Framer Motion** micro-interactions, and building tools that make the web feel more magical and playful.

> "Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke
  `,

  // 技能标签数组。每个标签可以单独设置背景色和文字颜色。
  skills: [
    { name: 'React',        bgColor: '#316ac5', textColor: '#ffffff' },
    { name: 'TypeScript',   bgColor: '#3178c6', textColor: '#ffffff' },
    { name: 'Tailwind CSS', bgColor: '#06b6d4', textColor: '#ffffff' },
    { name: 'Node.js',      bgColor: '#3d8b37', textColor: '#ffffff' },
    { name: 'tRPC',         bgColor: '#398ccb', textColor: '#ffffff' },
    { name: 'Figma',        bgColor: '#a259ff', textColor: '#ffffff' },
    { name: 'CSS Animations', bgColor: '#e96a24', textColor: '#ffffff' },
    { name: 'WebGL',        bgColor: '#990000', textColor: '#ffffff' },
  ],
} as const;

// ============================================================
// 🎨 内联 Markdown 样式（注入到内容容器内）
// ============================================================
const MARKDOWN_STYLES = `
  .about-md h2 { font-size: 13px; font-weight: bold; color: #0a3a8a; margin: 14px 0 6px; border-bottom: 1px solid #c5d8f8; padding-bottom: 3px; }
  .about-md p  { font-size: 12px; color: #333; line-height: 1.75; margin: 0 0 8px; }
  .about-md ul { padding-left: 18px; margin: 0 0 8px; }
  .about-md li { font-size: 12px; color: #333; line-height: 1.8; list-style-type: disc; }
  .about-md strong { color: #0a3a8a; }
  .about-md hr { border: none; border-top: 1px solid #dce9fc; margin: 10px 0; }
  .about-md blockquote { border-left: 3px solid #316ac5; margin: 8px 0; padding: 4px 10px; background: #eef4ff; border-radius: 0 4px 4px 0; }
  .about-md blockquote p { font-size: 11px; color: #555; font-style: italic; margin: 0; }
`;

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ============================================================
// 🖼️ AboutMeApp 主组件
// ============================================================
export function AboutMeApp() {
  const [bgOpacity, setBgOpacity] = useState<number>(ABOUT_CONFIG.bgOpacity);

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FONT, overflow: 'hidden', background: 'linear-gradient(160deg,#dce9fc 0%,#eef4ff 100%)' }}>

      {/* ── 样式注入 ── */}
      <style>{MARKDOWN_STYLES}</style>

      {/* ── 图层 1：背景图（绝对定位，不干扰内容流） ── */}
      {ABOUT_CONFIG.bgImageSrc && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${ABOUT_CONFIG.bgImageSrc})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: bgOpacity,
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* ── 透明度滑块（右上角浮层，仅在配置了背景图时显示） ── */}
      {ABOUT_CONFIG.bgImageSrc && (
        <div style={{ position: 'absolute', top: '10px', right: '12px', zIndex: 20, display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.75)', borderRadius: '12px', padding: '3px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
          <span style={{ fontSize: '10px', color: '#555' }}>BG</span>
          <input
            type="range" min={0} max={1} step={0.05}
            value={bgOpacity}
            onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
            style={{ width: '72px', accentColor: '#316ac5', cursor: 'pointer' }}
          />
        </div>
      )}

      {/* ── 图层 2：内容区（在背景图之上，z-index: 1） ── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* ── 顶部：头像 + 基础信息（固定高度，不滚动） ── */}
        <div style={{ flexShrink: 0, padding: '16px 20px 12px', borderBottom: '1px solid #c5d8f8', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* 头像 */}
            {ABOUT_CONFIG.avatarSrc ? (
              <img
                src={ABOUT_CONFIG.avatarSrc}
                alt="avatar"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #316ac5', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#316ac5,#5fa3e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0, border: '2px solid #316ac5' }}>
                👤
              </div>
            )}
            {/* 文字信息 */}
            <div>
              <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#0a3a8a' }}>{ABOUT_CONFIG.name}</div>
              <div style={{ fontSize: '12px', color: '#316ac5', marginTop: '2px' }}>{ABOUT_CONFIG.title}</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>{ABOUT_CONFIG.location}</div>
            </div>
          </div>
        </div>

        {/* ── 中间：Markdown 内容（flex-1，独立滚动） ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 10px' }}>
          <div className="about-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {ABOUT_CONFIG.markdownContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* ── 底部：技能标签（固定在最底部，不参与滚动） ── */}
        <div style={{ flexShrink: 0, padding: '10px 20px 14px', borderTop: '1px solid #c5d8f8', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0a3a8a', marginBottom: '7px', letterSpacing: '0.5px' }}>🛠 SKILLS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {ABOUT_CONFIG.skills.map((skill) => (
              <span
                key={skill.name}
                style={{
                  background: skill.bgColor,
                  color: skill.textColor,
                  borderRadius: '4px',
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  letterSpacing: '0.3px',
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
