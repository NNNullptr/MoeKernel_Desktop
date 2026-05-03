import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSiteSettings } from '@/client/hooks/use-site-config';

// ─── 静态技能标签（在后台「关于我设置」中不管理，在此处直接修改）──────────────
const SKILLS = [
  { name: 'React',          bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'TypeScript',     bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'Tailwind CSS',   bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'Node.js',        bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'tRPC',           bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'Figma',          bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'CSS Animations', bgColor: '#f46fa43f', textColor: '#ffffff' },
  { name: 'WebGL',          bgColor: '#f46fa43f', textColor: '#ffffff' },
];

const MARKDOWN_STYLES = `
  .about-md h2 { font-size: 13px; font-weight: bold; color: #767676; margin: 14px 0 6px; border-bottom: 1px solid #c5d8f8; padding-bottom: 3px; }
  .about-md p  { font-size: 12px; color: #333; line-height: 1.75; margin: 0 0 8px; }
  .about-md ul { padding-left: 18px; margin: 0 0 8px; }
  .about-md li { font-size: 12px; color: #333; line-height: 1.8; list-style-type: disc; }
  .about-md strong { color: #767676; }
  .about-md hr { border: none; border-top: 1px solid #f0f0f0; margin: 10px 0; }
  .about-md blockquote { border-left: 3px solid #5a5a5a; margin: 8px 0; padding: 4px 10px; background: #fafafa; border-radius: 0 4px 4px 0; }
  .about-md blockquote p { font-size: 11px; color: #555; font-style: italic; margin: 0; }
`;

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ─── AboutMeApp 主组件 ────────────────────────────────────────────────────────

export function AboutMeApp() {
  const { aboutConfig, aboutBgUrl, aboutBgOpacity } = useSiteSettings();

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: FONT, overflow: 'hidden', background: 'linear-gradient(160deg,#f0f0f0 0%,#fafafa 100%)' }}>

      <style>{MARKDOWN_STYLES}</style>

      {/* 背景图层：透明度由后台「外观设置」控制 */}
      {aboutBgUrl && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${aboutBgUrl})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: aboutBgOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 内容层 */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

        {/* 顶部：头像 + 基础信息 */}
        <div style={{ flexShrink: 0, padding: '16px 20px 12px', borderBottom: '1px solid #c5d8f8', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {aboutConfig.avatarSrc ? (
              <img
                src={aboutConfig.avatarSrc}
                alt="avatar"
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #5a5a5a', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#5a5a5a,#b8b8b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0, border: '2px solid #5a5a5a' }}>
                👤
              </div>
            )}
            <div>
              <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#767676' }}>{aboutConfig.name}</div>
              <div style={{ fontSize: '12px', color: '#5a5a5a', marginTop: '2px' }}>{aboutConfig.title}</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>{aboutConfig.location}</div>
            </div>
          </div>
        </div>

        {/* 中间：Markdown 内容 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 10px' }}>
          <div className="about-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {aboutConfig.markdownContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* 底部：技能标签 */}
        <div style={{ flexShrink: 0, padding: '10px 20px 14px', borderTop: '1px solid #c5d8f8', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#767676', marginBottom: '7px', letterSpacing: '0.5px' }}>🛠 SKILLS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {SKILLS.map((skill) => (
              <span key={skill.name} style={{ background: skill.bgColor, color: skill.textColor, borderRadius: '4px', padding: '3px 9px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.3px' }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
