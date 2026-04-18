import { useState, useEffect } from 'react';
import {
  FILE_SYSTEM,
  DEFAULT_FILE_ICON,
  consumePendingInitialPath,
  inferFileType,
  getPublicUrl,
  setPendingViewFile,
} from '@/client/config/filesystem.config';
import type { FsItem } from '@/client/config/filesystem.config';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

function getItemsAt(path: string[], tree: FsItem[]): FsItem[] {
  if (path.length === 0) return tree;
  const [head, ...rest] = path;
  const folder = tree.find((item) => item.name === head && item.type === 'folder');
  if (!folder || !folder.children) return [];
  return getItemsAt(rest, folder.children);
}

function ExplorerToolbar({
  address, onBack, canGoBack,
}: {
  address: string; onBack: () => void; canGoBack: boolean;
}) {
  return (
    <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', fontFamily: FONT, fontSize: '12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: '2px', padding: '2px 4px', borderBottom: '1px solid #aca899' }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button key={m} style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}>{m}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}>
        <button
          onClick={onBack}
          disabled={!canGoBack}
          style={{
            background: canGoBack ? '#d4d0c8' : '#e8e8e4',
            border: '1px solid #aca899',
            borderRadius: '2px',
            padding: '1px 8px',
            cursor: canGoBack ? 'pointer' : 'default',
            fontFamily: FONT,
            fontSize: '11px',
            color: canGoBack ? '#000' : '#aaa',
          }}
        >
          ← Back
        </button>
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #999', padding: '1px 6px', fontSize: '12px', borderRadius: '2px' }}>
          {address}
        </div>
      </div>
    </div>
  );
}

function VideoThumb({ src }: { src: string }) {
  return (
    <video
      src={src}
      muted
      preload="metadata"
      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, display: 'block' }}
      onLoadedMetadata={(e) => { e.currentTarget.currentTime = 1; }}
    />
  );
}

function FileTile({
  label,
  onClick,
  imageSrc,
  videoSrc,
  iconSrc,
}: {
  label: string;
  onClick?: () => void;
  imageSrc?: string;
  videoSrc?: string;
  iconSrc?: string;
}) {
  const [hov, setHov] = useState(false);

  let preview: React.ReactNode;
  if (imageSrc) {
    preview = (
      <img
        src={imageSrc}
        alt={label}
        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, border: '1px solid #ccc' }}
      />
    );
  } else if (videoSrc) {
    preview = <VideoThumb src={videoSrc} />;
  } else {
    preview = (
      <img
        src={iconSrc ?? DEFAULT_FILE_ICON}
        alt={label}
        style={{ width: 48, height: 48, objectFit: 'contain' }}
      />
    );
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '80px',
        cursor: onClick ? 'pointer' : 'default',
        background: hov ? '#5a5a5a' : 'transparent',
        borderRadius: '4px', padding: '8px 4px',
      }}
    >
      {preview}
      <span style={{ fontSize: '11px', fontFamily: FONT, color: hov ? '#fff' : '#000', textAlign: 'center', wordBreak: 'break-word' }}>{label}</span>
    </div>
  );
}

export function MyComputerApp() {
  const [currentPath, setCurrentPath] = useState<string[]>(() => consumePendingInitialPath());

  useEffect(() => {
    const handler = (e: Event) => {
      setCurrentPath((e as CustomEvent<string[]>).detail);
    };
    window.addEventListener('xp-navigate-mycomputer', handler);
    return () => window.removeEventListener('xp-navigate-mycomputer', handler);
  }, []);

  const items = getItemsAt(currentPath, FILE_SYSTEM);
  const address = currentPath.length === 0
    ? 'My Computer'
    : 'My Computer > ' + currentPath.join(' > ');

  const handleFileClick = (item: FsItem) => {
    const fileType = inferFileType(item.name);
    const url = getPublicUrl([...currentPath, item.name]);

    if (fileType === 'image') {
      setPendingViewFile({ type: 'image', url, title: item.name });
      window.dispatchEvent(new CustomEvent('xp-open-window', { detail: 'imageViewer' }));
    } else if (fileType === 'video') {
      setPendingViewFile({ type: 'video', url, title: item.name });
      window.dispatchEvent(new CustomEvent('xp-open-window', { detail: 'video' }));
    } else if (fileType === 'audio') {
      setPendingViewFile({ type: 'audio', url, title: item.name });
      window.dispatchEvent(new CustomEvent('xp-open-window', { detail: 'webamp' }));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <ExplorerToolbar
        address={address}
        onBack={() => setCurrentPath((p) => p.slice(0, -1))}
        canGoBack={currentPath.length > 0}
      />
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '20px', background: '#fff', overflowY: 'auto' }}>
        {items.map((item) => {
          if (item.type === 'folder') {
            return (
              <FileTile
                key={item.name}
                label={item.name}
                iconSrc={item.icon ?? '/assets/icons/Games.png'}
                onClick={() => setCurrentPath((p) => [...p, item.name])}
              />
            );
          }

          const fileType = inferFileType(item.name);
          const url = getPublicUrl([...currentPath, item.name]);

          return (
            <FileTile
              key={item.name}
              label={item.name}
              imageSrc={fileType === 'image' ? url : undefined}
              videoSrc={fileType === 'video' ? url : undefined}
              iconSrc={
                fileType === 'audio'
                  ? '/assets/icons/Media.png'
                  : (item.icon ?? DEFAULT_FILE_ICON)
              }
              onClick={() => handleFileClick(item)}
            />
          );
        })}
        {items.length === 0 && (
          <span style={{ color: '#888', fontSize: '12px', fontFamily: FONT }}>This folder is empty.</span>
        )}
      </div>
    </div>
  );
}
