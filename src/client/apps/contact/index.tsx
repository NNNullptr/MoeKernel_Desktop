/**
 * @file contact/index.tsx
 * @description Contact Me app — Windows XP Explorer 风格的社交平台图标网格。
 *              界面结构完全复刻 My Computer，点击图标新标签页跳转对应链接。
 *
 * ============================================================
 * 🛠️ 中文修改指南
 * ============================================================
 *
 * 【如何替换或添加平台图标图片】
 *   1. 将你找到的社交平台图标文件（推荐 48×48 或更大的 .png / .ico）
 *      放入 public/assets/icons/social/ 目录下。
 *      例如：public/assets/icons/social/github.png
 *   2. 在下方 CONTACT_CONFIG 数组中，将对应条目的 iconSrc
 *      改为 "/assets/icons/social/github.png"（以 / 开头的绝对路径）。
 *   3. 如果暂时没有图片，iconSrc 留空字符串 ""，会显示 Emoji 备用图标。
 *
 * 【如何新增一个平台】
 *   在 CONTACT_CONFIG 数组末尾添加一个新对象，格式如下：
 *   {
 *     id:        "platform-id",        // 唯一字符串 ID，自取，用于 React key
 *     name:      "平台名称",            // 显示在图标下方的文字
 *     url:       "https://xxx.com",    // 点击跳转的链接，mailto: 也支持
 *     iconSrc:   "/assets/icons/social/xxx.png", // 本地图标路径（public目录下）
 *     emoji:     "🌐",                 // 当 iconSrc 为空时显示的 Emoji 备用图标
 *   },
 *
 * 【如何删除一个平台】
 *   直接删除 CONTACT_CONFIG 数组中对应的 {} 对象即可。
 *
 * 【如何修改跳转链接或平台名称】
 *   直接修改对应条目的 url 或 name 字段即可。
 *
 * 【图标建议尺寸】
 *   48×48px 或更大（组件内固定渲染为 48×48，会自动等比缩放）。
 *   格式：.png / .gif / .ico 均可。
 *
 * ============================================================
 */

import { useState } from 'react';

// ============================================================
// ⚙️ CONTACT_CONFIG — 所有平台信息在这里统一管理
// ============================================================
const CONTACT_CONFIG = [
  {
    id:      'github',
    name:    'GitHub',
    url:     'https://github.com',
    // 把 github.png 放到 public/assets/icons/social/github.png 后替换下方路径
    iconSrc: '',
    emoji:   '🐙',
  },
  {
    id:      'linkedin',
    name:    'LinkedIn',
    url:     'https://linkedin.com',
    // 把 linkedin.png 放到 public/assets/icons/social/linkedin.png 后替换下方路径
    iconSrc: '',
    emoji:   '💼',
  },
  {
    id:      'email',
    name:    'Email',
    url:     'mailto:nnnullptr@example.com',
    // 把 email.png 放到 public/assets/icons/social/email.png 后替换下方路径
    iconSrc: '',
    emoji:   '📧',
  },
  {
    id:      'twitter',
    name:    'Twitter / X',
    url:     'https://x.com',
    // 把 twitter.png 放到 public/assets/icons/social/twitter.png 后替换下方路径
    iconSrc: '',
    emoji:   '🐦',
  },
  // ── 在这里添加更多平台 ──
  // {
  //   id:      'instagram',
  //   name:    'Instagram',
  //   url:     'https://instagram.com',
  //   iconSrc: '/assets/icons/social/instagram.png',
  //   emoji:   '📸',
  // },
] as const;

// ============================================================
// 🎨 常量
// ============================================================
const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ============================================================
// 🔧 ExplorerToolbar — XP 资源管理器顶部工具栏（与 My Computer 相同）
// ============================================================
function ExplorerToolbar({ address }: { address: string }) {
  return (
    <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', fontFamily: FONT, fontSize: '12px', flexShrink: 0 }}>
      {/* 菜单栏 */}
      <div style={{ display: 'flex', gap: '2px', padding: '2px 4px', borderBottom: '1px solid #aca899' }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button
            key={m}
            style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}
          >
            {m}
          </button>
        ))}
      </div>
      {/* 地址栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}>
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #999', padding: '1px 6px', fontSize: '12px', borderRadius: '2px' }}>
          {address}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔧 ContactTile — 单个社交平台图标（a 标签 + 新标签跳转）
// ============================================================
function ContactTile({
  name,
  url,
  iconSrc,
  emoji,
}: {
  name: string;
  url: string;
  iconSrc: string;
  emoji: string;
}) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '4px',
        width:          '80px',
        cursor:         'pointer',
        background:     hov ? '#5a5a5a' : 'transparent',
        borderRadius:   '4px',
        padding:        '8px 4px',
        textDecoration: 'none',
      }}
    >
      {/* 图标：优先使用 iconSrc 图片，否则显示 Emoji 备用 */}
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={name}
          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
        />
      ) : (
        <div
          style={{
            width:          '48px',
            height:         '48px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontSize:       '32px',
          }}
        >
          {emoji}
        </div>
      )}
      {/* 平台名称 */}
      <span
        style={{
          fontSize:   '11px',
          fontFamily: FONT,
          color:      hov ? '#fff' : '#000',
          textAlign:  'center',
          wordBreak:  'break-word',
        }}
      >
        {name}
      </span>
    </a>
  );
}

// ============================================================
// 🖼️ ContactApp 主组件
// ============================================================
export function ContactApp() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* XP 资源管理器工具栏 */}
      <ExplorerToolbar address="Contact Me" />

      {/* 图标网格区域 */}
      <div
        style={{
          flex:           1,
          padding:        '16px',
          display:        'flex',
          flexWrap:       'wrap',
          alignContent:   'flex-start',
          gap:            '20px',
          background:     '#fff',
          overflowY:      'auto',
        }}
      >
        {CONTACT_CONFIG.map((item) => (
          <ContactTile
            key={item.id}
            name={item.name}
            url={item.url}
            iconSrc={item.iconSrc}
            emoji={item.emoji}
          />
        ))}
      </div>
    </div>
  );
}
