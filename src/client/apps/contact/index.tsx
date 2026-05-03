import { useState } from 'react';
import { useSiteSettings } from '@/client/hooks/use-site-config';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ─── ExplorerToolbar ──────────────────────────────────────────────────────────

function ExplorerToolbar({ address }: { address: string }) {
  return (
    <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', fontFamily: FONT, fontSize: '12px', flexShrink: 0 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}>
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #999', padding: '1px 6px', fontSize: '12px', borderRadius: '2px' }}>
          {address}
        </div>
      </div>
    </div>
  );
}

// ─── ContactTile ──────────────────────────────────────────────────────────────

function ContactTile({ name, url, iconSrc, emoji }: { name: string; url: string; iconSrc: string; emoji: string }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        width: '80px', cursor: 'pointer',
        background: hov ? '#5a5a5a' : 'transparent',
        borderRadius: '4px', padding: '8px 4px', textDecoration: 'none',
      }}
    >
      {iconSrc ? (
        <img src={iconSrc} alt={name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
      ) : (
        <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
          {emoji || '🌐'}
        </div>
      )}
      <span style={{ fontSize: '11px', fontFamily: FONT, color: hov ? '#fff' : '#000', textAlign: 'center', wordBreak: 'break-word' }}>
        {name}
      </span>
    </a>
  );
}

// ─── ContactApp 主组件 ────────────────────────────────────────────────────────

export function ContactApp() {
  const { contactLinks, contactBgUrl, contactBgOpacity, isLoaded } = useSiteSettings();

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* 背景图层：透明度由后台「外观设置」控制 */}
      {contactBgUrl && (
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url(${contactBgUrl})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: contactBgOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 内容层 */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ExplorerToolbar address="Contact Me" />

        <div style={{
          flex: 1, padding: '16px',
          display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '20px',
          background: contactBgUrl ? 'transparent' : '#fff',
          overflowY: 'auto',
        }}>
          {!isLoaded ? (
            <span style={{ fontSize: 12, color: '#888', fontFamily: FONT }}>加载中…</span>
          ) : contactLinks.length === 0 ? (
            <span style={{ fontSize: 12, color: '#888', fontFamily: FONT }}>暂无联系方式</span>
          ) : (
            contactLinks.map((item) => (
              <ContactTile key={item.id} name={item.name} url={item.url} iconSrc={item.iconSrc} emoji={item.emoji} />
            ))
          )}
        </div>
      </div>

    </div>
  );
}
