/**
 * @file my-computer/index.tsx
 * @description My Computer app — XP Explorer-style drive/folder grid.
 *
 * Self-contained app component. No external state dependencies.
 * Future: could fetch real filesystem data via tRPC.
 */

import { useState } from 'react';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

function ExplorerToolbar({ address }: { address: string }) {
  return (
    <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', fontFamily: FONT, fontSize: '12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', gap: '2px', padding: '2px 4px', borderBottom: '1px solid #aca899' }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button key={m} style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}>{m}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px' }}>
        <span style={{ color: '#555', fontSize: '11px' }}>Address</span>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #999', padding: '1px 6px', fontSize: '12px', borderRadius: '2px' }}>{address}</div>
      </div>
    </div>
  );
}

function FolderTile({ icon, label }: { icon: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '80px',
        cursor: 'pointer', background: hov ? '#316ac5' : 'transparent', borderRadius: '4px', padding: '8px 4px' }}
    >
      <img src={icon} alt={label} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
      <span style={{ fontSize: '11px', fontFamily: FONT, color: hov ? '#fff' : '#000', textAlign: 'center', wordBreak: 'break-word' }}>{label}</span>
    </div>
  );
}

export function MyComputerApp() {
  const drives = [
    { icon: 'https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png', label: 'Local Disk (C:)' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Documents (D:)' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Projects (E:)' },
    { icon: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png', label: 'Music (F:)' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <ExplorerToolbar address="My Computer" />
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '20px', background: '#fff', overflowY: 'auto' }}>
        {drives.map((d) => <FolderTile key={d.label} icon={d.icon} label={d.label} />)}
      </div>
    </div>
  );
}
