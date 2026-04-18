import { useState, useEffect } from 'react';
import { consumePendingViewFile } from '@/client/config/filesystem.config';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

export function ImageViewerApp() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('Image Viewer');
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === 'image') {
      setImageUrl(pending.url);
      setTitle(pending.title);
    }
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#2b2b2b', fontFamily: FONT }}>
      {/* Toolbar */}
      <div style={{
        background: '#ece9d8',
        borderBottom: '1px solid #aca899',
        padding: '3px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setZoom((z) => Math.min(z + 25, 400))}
          style={{ padding: '1px 8px', fontFamily: FONT, fontSize: '12px', border: '1px solid #aca899', background: '#d4d0c8', borderRadius: 2, cursor: 'pointer' }}
        >
          + Zoom In
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 25, 25))}
          style={{ padding: '1px 8px', fontFamily: FONT, fontSize: '12px', border: '1px solid #aca899', background: '#d4d0c8', borderRadius: 2, cursor: 'pointer' }}
        >
          − Zoom Out
        </button>
        <button
          onClick={() => setZoom(100)}
          style={{ padding: '1px 8px', fontFamily: FONT, fontSize: '12px', border: '1px solid #aca899', background: '#d4d0c8', borderRadius: 2, cursor: 'pointer' }}
        >
          1:1
        </button>
        <span style={{ color: '#555', fontSize: '11px', marginLeft: 4 }}>{zoom}%</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: '#555', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
          {title}
        </span>
      </div>

      {/* Image area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        alignItems: zoom <= 100 ? 'center' : 'flex-start',
        justifyContent: zoom <= 100 ? 'center' : 'flex-start',
        padding: 12,
        background: '#1e1e1e',
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: zoom <= 100 ? '100%' : 'none',
              maxHeight: zoom <= 100 ? '100%' : 'none',
              width: zoom !== 100 ? `${zoom}%` : undefined,
              objectFit: 'contain',
              display: 'block',
              imageRendering: zoom > 200 ? 'pixelated' : 'auto',
              boxShadow: '0 2px 16px rgba(0,0,0,0.6)',
            }}
          />
        ) : (
          <div style={{ color: '#666', fontSize: '13px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🖼</div>
            No image selected.<br />
            <span style={{ fontSize: 11, color: '#444' }}>Open an image from My Computer.</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        background: '#ece9d8',
        borderTop: '1px solid #aca899',
        padding: '2px 8px',
        fontSize: '11px',
        color: '#555',
        flexShrink: 0,
        fontFamily: FONT,
      }}>
        {imageUrl ? title : 'Ready'}
      </div>
    </div>
  );
}
