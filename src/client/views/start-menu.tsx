import React from 'react';

interface ProgramItem {
  id: string;
  icon: string;
  label: string;
  highlight?: boolean;
}

interface PlaceItem {
  id: string;
  icon: string;
  label: string;
  dividerAbove?: boolean;
}

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

const PROGRAMS: ProgramItem[] = [
  { id: 'resume', icon: 'https://static.step1.dev/g9nbov/assets/bb426464f8be.ico', label: 'Resume', highlight: true },
  { id: 'contact', icon: 'https://static.step1.dev/g9nbov/assets/e225895b1c27.png', label: 'Contact Me' },
  { id: 'myComputer', icon: 'https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png', label: 'My Computer' },
  { id: 'webamp', icon: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png', label: 'Winamp' },
  { id: 'paint', icon: 'https://static.step1.dev/g9nbov/assets/035b30cba825.png', label: 'Paint' },
  { id: 'msn', icon: 'https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png', label: 'MSN Messenger' },
];

const PLACES: PlaceItem[] = [
  { id: 'myDocuments', icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'My Documents' },
  { id: 'myPictures', icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'My Pictures' },
  { id: 'myMusic', icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'My Music' },
  { id: 'myVideos', icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'My Videos', dividerAbove: true },
  { id: 'displayProperties', icon: 'https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png', label: 'Display Properties', dividerAbove: true },
  { id: 'linkedin', icon: 'https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png', label: 'LinkedIn', dividerAbove: true },
  { id: 'github', icon: 'https://static.step1.dev/g9nbov/assets/5e5af28959cf.webp', label: 'GitHub' },
  { id: 'instagram', icon: 'https://static.step1.dev/g9nbov/assets/e225895b1c27.png', label: 'Instagram' },
];

interface StartMenuProps {
  onItemClick?: (id: string) => void;
  onLogOff?: () => void;
  onTurnOff?: () => void;
}

export function StartMenu({ onItemClick, onLogOff, onTurnOff }: StartMenuProps) {
  return (
    <div
      style={{
        position: 'fixed', bottom: '30px', left: '0px', width: '460px',
        zIndex: 10000, boxShadow: '4px -4px 16px rgba(0,0,0,0.6)',
        borderRadius: '8px 8px 0 0', overflow: 'hidden',
        fontFamily: FONT, fontSize: '13px', userSelect: 'none',
        border: '1px solid var(--xp-chrome-border-dark)', borderBottom: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #e0e0e0 0%, #c8c8c8 50%, #a8a8a8 100%)',
        padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px',
        borderBottom: '2px solid #888',
      }}>
        <img
          src="https://static.step1.dev/g9nbov/assets/58721f37b0c0.png"
          alt="User"
          style={{ width: '50px', height: '50px', border: '2px solid #b8b8b8', borderRadius: '2px', objectFit: 'cover', background: '#fff' }}
        />
        <span style={{ color: '#000', fontWeight: 'bold', fontSize: '15px', textShadow: '1px 1px 3px rgba(255,255,255,0.5)' }}>NNNullptr</span>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', height: '400px' }}>
        {/* Left: Programs */}
        <div style={{ flex: 1, background: '#ffffff', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingTop: '4px' }}>
          {PROGRAMS.map((prog, idx) => (
            <React.Fragment key={prog.id}>
              {idx === 1 && <Divider color="#d4d0c8" />}
              <ProgramBtn icon={prog.icon} label={prog.label} highlighted={prog.highlight} onClick={() => onItemClick?.(prog.id)} />
            </React.Fragment>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <Divider color="#d4d0c8" />
            <AllProgramsBtn />
          </div>
        </div>

        {/* Right: Places */}
        <div style={{
          width: '210px',
          background: 'linear-gradient(180deg, #ececec 0%, #dcdcdc 100%)',
          borderLeft: '1px solid #a0a0a0', display: 'flex', flexDirection: 'column',
          overflowY: 'auto', paddingTop: '6px',
        }}>
          {PLACES.map((place) => (
            <React.Fragment key={place.id}>
              {place.dividerAbove && <Divider color="#a0a0a0" />}
              <PlaceBtn icon={place.icon} label={place.label} onClick={() => onItemClick?.(place.id)} />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: 'linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%)',
        borderTop: '2px solid #888', display: 'flex',
        justifyContent: 'flex-end', gap: '8px', padding: '6px 12px',
      }}>
        <FooterBtn label="Log Off" emoji="\uD83D\uDD13" onClick={onLogOff} />
        <FooterBtn label="Turn Off Computer" emoji="\u23FB" onClick={onTurnOff} />
      </div>
    </div>
  );
}

function Divider({ color }: { color: string }) {
  return <hr style={{ border: 'none', borderTop: `1px solid ${color}`, margin: '4px 8px' }} />;
}

function ProgramBtn({ icon, label, highlighted, onClick }: { icon: string; label: string; highlighted?: boolean; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  const active = highlighted || hovered;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px',
        background: active ? 'var(--xp-chrome-highlight)' : 'transparent', color: '#000',
        border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%',
        fontSize: '13px', fontFamily: FONT, fontWeight: highlighted ? 'bold' : 'normal',
      }}
    >
      <img src={icon} alt={label} style={{ width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0 }} />
      <span>{label}</span>
    </button>
  );
}

function PlaceBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
        background: hovered ? 'var(--xp-chrome-highlight)' : 'transparent', color: '#000',
        border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%',
        fontSize: '13px', fontFamily: FONT,
      }}
    >
      <img src={icon} alt={label} style={{ width: '28px', height: '28px', objectFit: 'contain', flexShrink: 0 }} />
      <span>{label}</span>
    </button>
  );
}

function AllProgramsBtn() {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', background: hovered ? 'var(--xp-chrome-highlight)' : 'transparent',
        color: '#000', border: 'none', cursor: 'pointer',
        width: '100%', fontSize: '13px', fontFamily: FONT, fontWeight: 'bold',
      }}
    >
      <span>All Programs</span>
      <span style={{ fontSize: '10px' }}>&#9658;</span>
    </button>
  );
}

function FooterBtn({ label, emoji, onClick }: { label: string; emoji: string; onClick?: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px',
        background: hovered ? 'linear-gradient(180deg,#ececec 0%,#bcbcbc 100%)' : 'linear-gradient(180deg,#d8d8d8 0%,#a8a8a8 100%)',
        border: '1px solid #888', borderRadius: '4px', color: '#000',
        fontSize: '12px', fontFamily: FONT, cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
