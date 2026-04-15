/**
 * @file window-contents.tsx
 * @description Content panels rendered inside each XP app window.
 *
 * Exported components (one per app):
 * - MyComputerContent    — drive/folder explorer
 * - GamesFolderContent   — game shortcut grid
 * - AboutMeContent       — personal bio card
 * - ContactContent       — contact info links
 * - WinampContent        — music player UI
 * - MsnContent           — MSN messenger chat UI
 * - PaintContent         — simple canvas drawing app
 * - ResumeContent        — scrollable résumé document
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ─── Shared: Explorer toolbar ──────────────────────────────────────────────────
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

// ─── Shared: File/Drive icon tile ──────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════════════
// MY COMPUTER
// ═══════════════════════════════════════════════════════════════════════════════
export function MyComputerContent() {
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

// ═══════════════════════════════════════════════════════════════════════════════
// GAMES FOLDER
// ═══════════════════════════════════════════════════════════════════════════════
export function GamesFolderContent() {
  const games = [
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Pinball' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Minesweeper' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Solitaire' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'FreeCell' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Hearts' },
    { icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png', label: 'Spider Solitaire' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <ExplorerToolbar address="C:\Games" />
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: '24px', background: '#fff', overflowY: 'auto' }}>
        {games.map((g) => <FolderTile key={g.label} icon={g.icon} label={g.label} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT ME
// ═══════════════════════════════════════════════════════════════════════════════
export function AboutMeContent() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'linear-gradient(160deg,#dce9fc 0%,#eef4ff 100%)', fontFamily: FONT }}>
      <div style={{ padding: '24px 28px' }}>
        {/* Header card */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#fff', border: '1px solid #c5d8f8', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,80,200,0.08)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#316ac5,#5fa3e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0a3a8a' }}>NNNullptr</div>
            <div style={{ fontSize: '13px', color: '#316ac5', marginTop: '2px' }}>Full-Stack Developer & Designer</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '6px' }}>📍 Istanbul, Turkey</div>
          </div>
        </div>

        {/* About text */}
        <Section title="👋 Hey there!">
          <p style={{ margin: 0, lineHeight: 1.7, fontSize: '13px', color: '#333' }}>
            Welcome to my Windows XP portfolio! I'm a designer &amp; developer who loves building beautiful, interactive experiences on the web. I specialize in retro-inspired UI, React, and TypeScript.
          </p>
        </Section>

        <Section title="🛠 Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'tRPC', 'Figma', 'CSS Animations', 'WebGL'].map((s) => (
              <span key={s} style={{ background: '#316ac5', color: '#fff', borderRadius: '4px', padding: '3px 10px', fontSize: '11px', fontWeight: 'bold' }}>{s}</span>
            ))}
          </div>
        </Section>

        <Section title="🎮 Interests">
          <p style={{ margin: 0, lineHeight: 1.7, fontSize: '13px', color: '#333' }}>
            Retro computing nostalgia, Y2K aesthetics, chiptune music, indie game dev, pixel art, and exploring the early internet.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0a3a8a', marginBottom: '8px', borderBottom: '1px solid #c5d8f8', paddingBottom: '4px' }}>{title}</div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT
// ═══════════════════════════════════════════════════════════════════════════════
export function ContactContent() {
  const links = [
    { icon: '📧', label: 'Email', value: 'nnnullptr@example.com', href: 'mailto:nnnullptr@example.com' },
    { icon: '💼', label: 'LinkedIn', value: '/in/nnnullptr', href: 'https://linkedin.com' },
    { icon: '🐙', label: 'GitHub', value: '/nnnullptr', href: 'https://github.com' },
    { icon: '📸', label: 'Instagram', value: '@nnnullptr', href: 'https://instagram.com' },
    { icon: '🐦', label: 'Twitter/X', value: '@nnnullptr', href: 'https://x.com' },
  ];
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'linear-gradient(160deg,#dce9fc,#eef4ff)', fontFamily: FONT, padding: '24px 28px' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0a3a8a', marginBottom: '6px' }}>Get In Touch</div>
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '20px' }}>I'm open to new opportunities and collaborations.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid #c5d8f8', borderRadius: '8px', padding: '12px 16px', textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,80,200,0.07)', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#edf3ff')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
          >
            <span style={{ fontSize: '22px' }}>{l.icon}</span>
            <div>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>{l.label}</div>
              <div style={{ fontSize: '13px', color: '#316ac5' }}>{l.value}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WINAMP MUSIC PLAYER
// ═══════════════════════════════════════════════════════════════════════════════
const TRACKS = [
  { title: 'Butterfly', artist: 'Crazy Frog', duration: '3:08' },
  { title: 'In Da Club',  artist: '50 Cent',    duration: '3:46' },
  { title: 'Numb',        artist: 'Linkin Park', duration: '3:05' },
  { title: 'Yeah!',       artist: 'Usher',       duration: '4:12' },
  { title: 'Hey Ya!',     artist: 'OutKast',     duration: '3:55' },
  { title: 'Toxic',       artist: 'Britney Spears', duration: '3:21' },
];

export function WinampContent() {
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(22);
  const [volume, setVolume] = useState(75);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = TRACKS[trackIdx]!;

  // Simulate progress tick
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.5)), 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const prev = () => { setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };
  const next = () => { setTrackIdx((i) => (i + 1) % TRACKS.length); setProgress(0); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1a1a1a', fontFamily: '"Courier New", monospace', color: '#00e000', userSelect: 'none' }}>
      {/* Visualizer bar */}
      <div style={{ background: '#000', height: '60px', display: 'flex', alignItems: 'flex-end', padding: '4px 8px', gap: '2px', overflow: 'hidden' }}>
        {Array.from({ length: 28 }).map((_, i) => {
          const h = playing ? Math.max(4, Math.sin(i * 0.7 + Date.now() * 0.002) * 25 + 28) : 4;
          return <div key={i} style={{ flex: 1, height: `${h}px`, background: `hsl(${100 + i * 3},100%,45%)`, borderRadius: '1px', transition: playing ? 'height 0.15s' : 'none' }} />;
        })}
      </div>

      {/* Track info */}
      <div style={{ background: '#000', padding: '8px 12px', borderTop: '1px solid #333' }}>
        <div style={{ fontSize: '13px', color: '#00e000', letterSpacing: '1px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          ♫ {track.artist} — {track.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: '#00a000' }}>{trackIdx + 1}/{TRACKS.length}</span>
          <span style={{ fontSize: '11px', color: '#00a000' }}>{track.duration}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#111', padding: '6px 10px' }}>
        <div style={{ background: '#333', height: '6px', borderRadius: '3px', cursor: 'pointer', position: 'relative' }}
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#00a000,#00ff00)', borderRadius: '3px', transition: 'width 0.1s' }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{ background: '#222', padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {[
          { label: '⏮', action: prev },
          { label: playing ? '⏸' : '▶', action: () => setPlaying((p) => !p), highlight: playing },
          { label: '⏹', action: () => { setPlaying(false); setProgress(0); } },
          { label: '⏭', action: next },
        ].map(({ label, action, highlight }) => (
          <button key={label} onClick={action}
            style={{ background: highlight ? '#004000' : '#333', color: '#00e000', border: '1px solid #555', borderRadius: '4px', padding: '6px 14px', cursor: 'pointer', fontSize: '16px', fontFamily: 'monospace' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Volume */}
      <div style={{ background: '#1a1a1a', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #333' }}>
        <span style={{ fontSize: '11px', color: '#00a000', width: '48px' }}>VOL</span>
        <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#00e000', cursor: 'pointer' }} />
        <span style={{ fontSize: '11px', color: '#00a000', width: '28px', textAlign: 'right' }}>{volume}%</span>
      </div>

      {/* Playlist */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#111', borderTop: '1px solid #333' }}>
        {TRACKS.map((t, i) => (
          <div key={i} onClick={() => { setTrackIdx(i); setProgress(0); setPlaying(true); }}
            style={{ padding: '5px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
              background: i === trackIdx ? '#003300' : 'transparent',
              borderBottom: '1px solid #1e1e1e' }}>
            <span style={{ fontSize: '11px', color: i === trackIdx ? '#00ff00' : '#00a000' }}>{i + 1}. {t.artist} — {t.title}</span>
            <span style={{ fontSize: '11px', color: '#006000' }}>{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MSN MESSENGER
// ═══════════════════════════════════════════════════════════════════════════════
const BOT_REPLIES = [
  'lol, totally!',
  'omg really?? 😮',
  'brb, mom is calling',
  'that is so cool!!',
  'i was just thinking the same thing :)',
  'lmao xD',
  'k gtg, ttyl!! ✌️',
  'did u see that new movie?',
  'my asl is 16/f/usa lol',
  '...busy?',
];

interface ChatMsg {
  from: 'me' | 'them';
  text: string;
  time: string;
}

export function MsnContent() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: 'them', text: 'heyyy, whats up! :)', time: '3:41 PM' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = () => {
    const d = new Date();
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: ChatMsg = { from: 'me', text: input.trim(), time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]!;
      setMessages((m) => [...m, { from: 'them', text: reply, time: now() }]);
    }, 800 + Math.random() * 1200);
  }, [input]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: FONT }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,#0078d7,#004fa3)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffce00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>😊</div>
        <div>
          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>XP_Buddy (Online)</div>
          <div style={{ color: '#c8deff', fontSize: '11px' }}>💬 Chatting on MSN Messenger</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#f5f9ff' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <span style={{ fontSize: '10px', color: '#999', marginBottom: '2px' }}>{msg.from === 'me' ? 'Me' : 'XP_Buddy'} • {msg.time}</span>
            <div style={{ background: msg.from === 'me' ? '#316ac5' : '#fff', color: msg.from === 'me' ? '#fff' : '#000', border: msg.from === 'me' ? 'none' : '1px solid #d0d8e8', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', maxWidth: '75%', wordBreak: 'break-word' }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Nudge strip */}
      <div style={{ background: '#ece9d8', borderTop: '1px solid #ccc', padding: '4px 8px', display: 'flex', gap: '6px' }}>
        {['😊','😂','😎','❤️','👋'].map((e) => (
          <button key={e} onClick={() => setInput((v) => v + e)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px' }}>{e}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', borderTop: '2px solid #316ac5', background: '#fff' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontFamily: FONT, fontSize: '12px' }} />
        <button onClick={send}
          style={{ background: '#316ac5', color: '#fff', border: 'none', padding: '0 16px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px', fontWeight: 'bold' }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAINT
// ═══════════════════════════════════════════════════════════════════════════════
const COLORS = ['#000','#7f7f7f','#880015','#ed1c24','#ff7f27','#fff200','#22b14c','#00a2e8','#3f48cc','#a349a4','#fff','#c3c3c3','#b97a57','#ffaec9','#ffc90e','#efe4b0','#b5e61d','#99d9ea','#7092be','#c8bfe7'];
type Tool = 'pencil' | 'eraser' | 'fill';

export function PaintContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000');
  const [tool, setTool] = useState<Tool>('pencil');
  const [size, setSize] = useState(4);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Initialize white canvas
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, c.width, c.height);
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (canvasRef.current!.width / r.width), y: (e.clientY - r.top) * (canvasRef.current!.height / r.height) };
  };

  const floodFill = (ctx: CanvasRenderingContext2D, sx: number, sy: number, fillColor: string) => {
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = img.data;
    const idx = (Math.round(sy) * ctx.canvas.width + Math.round(sx)) * 4;
    const [tr, tg, tb, ta] = [data[idx]!, data[idx+1]!, data[idx+2]!, data[idx+3]!];
    const fr = parseInt(fillColor.slice(1,3),16), fg = parseInt(fillColor.slice(3,5),16), fb = parseInt(fillColor.slice(5,7),16);
    if (tr===fr && tg===fg && tb===fb) return;
    const stack = [Math.round(sx), Math.round(sy)];
    while (stack.length) {
      const y = stack.pop()!, x = stack.pop()!;
      if (x<0||y<0||x>=ctx.canvas.width||y>=ctx.canvas.height) continue;
      const i = (y*ctx.canvas.width+x)*4;
      if (data[i]!==tr||data[i+1]!==tg||data[i+2]!==tb||data[i+3]!==ta) continue;
      data[i]=fr; data[i+1]=fg; data[i+2]=fb; data[i+3]=255;
      stack.push(x+1,y,x-1,y,x,y+1,x,y-1);
    }
    ctx.putImageData(img,0,0);
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (tool === 'fill') { floodFill(ctx, pos.x, pos.y, color); return; }
    last.current = pos;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size/2, 0, Math.PI*2);
    ctx.fillStyle = tool === 'eraser' ? '#fff' : color;
    ctx.fill();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || tool==='fill') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !last.current) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool==='eraser' ? '#fff' : color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
    last.current = pos;
  };

  const onUp = () => { drawing.current=false; last.current=null; };

  const clear = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!ctx||!c) return;
    ctx.fillStyle='#fff';
    ctx.fillRect(0,0,c.width,c.height);
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#ece9d8', fontFamily:FONT }}>
      {/* Toolbar */}
      <div style={{ background:'#ece9d8', borderBottom:'1px solid #aca899', padding:'4px 8px', display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap', flexShrink:0 }}>
        {/* Tool buttons */}
        <div style={{ display:'flex', gap:'4px' }}>
          {([['pencil','✏️'],['eraser','⬜'],['fill','🪣']] as [Tool,string][]).map(([t,icon]) => (
            <button key={t} onClick={()=>setTool(t)}
              style={{ background:tool===t?'#316ac5':'#d4d0c8', color:tool===t?'#fff':'#000', border:'1px solid #888', borderRadius:'3px', padding:'2px 8px', cursor:'pointer', fontSize:'14px' }}>
              {icon}
            </button>
          ))}
        </div>
        {/* Size */}
        <label style={{ fontSize:'11px', display:'flex', alignItems:'center', gap:'4px' }}>
          Size: <input type="range" min={1} max={24} value={size} onChange={(e)=>setSize(Number(e.target.value))} style={{ width:'60px', accentColor:'#316ac5' }} /> {size}px
        </label>
        {/* Clear */}
        <button onClick={clear} style={{ marginLeft:'auto', background:'#d4d0c8', border:'1px solid #888', borderRadius:'3px', padding:'2px 8px', cursor:'pointer', fontSize:'11px' }}>
          Clear
        </button>
      </div>

      {/* Color palette */}
      <div style={{ background:'#d4d0c8', borderBottom:'1px solid #aca899', padding:'4px 8px', display:'flex', gap:'3px', flexWrap:'wrap', flexShrink:0 }}>
        {COLORS.map((c) => (
          <div key={c} onClick={()=>setColor(c)}
            style={{ width:'16px', height:'16px', background:c, border:color===c?'2px solid #000':'1px solid #888', borderRadius:'1px', cursor:'pointer', boxSizing:'border-box' }} />
        ))}
      </div>

      {/* Canvas */}
      <div style={{ flex:1, overflow:'auto', display:'flex', justifyContent:'center', alignItems:'flex-start', padding:'8px', background:'#808080' }}>
        <canvas ref={canvasRef} width={560} height={380}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
          style={{ display:'block', background:'#fff', cursor:tool==='eraser'?'cell':tool==='fill'?'crosshair':'crosshair', boxShadow:'2px 2px 6px rgba(0,0,0,0.4)' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESUME / CV
// ═══════════════════════════════════════════════════════════════════════════════
export function ResumeContent() {
  return (
    <div style={{ height:'100%', overflowY:'auto', background:'#f0ede4', fontFamily:FONT }}>
      {/* Toolbar */}
      <div style={{ background:'#ece9d8', borderBottom:'1px solid #aca899', padding:'4px 10px', display:'flex', gap:'2px', flexShrink:0 }}>
        {['File','Edit','View','Format','Help'].map((m)=>(
          <button key={m} style={{background:'none',border:'none',padding:'2px 8px',cursor:'pointer',fontFamily:FONT,fontSize:'12px'}}>{m}</button>
        ))}
      </div>
      {/* Document */}
      <div style={{ maxWidth:'640px', margin:'0 auto', padding:'40px 48px', background:'#fff', minHeight:'800px', boxShadow:'0 0 12px rgba(0,0,0,0.15)', marginTop:'12px', marginBottom:'12px' }}>
        <div style={{ textAlign:'center', borderBottom:'2px solid #316ac5', paddingBottom:'16px', marginBottom:'20px' }}>
          <div style={{ fontSize:'22px', fontWeight:'bold', color:'#0a3a8a' }}>NNNULLPTR</div>
          <div style={{ fontSize:'12px', color:'#316ac5', marginTop:'4px' }}>Full-Stack Developer • Designer • Retro Enthusiast</div>
          <div style={{ fontSize:'11px', color:'#666', marginTop:'6px' }}>📧 nnnullptr@example.com &nbsp;|&nbsp; 🌐 nnnullptr.dev &nbsp;|&nbsp; 📍 Istanbul, Turkey</div>
        </div>

        <ResumeSection title="OBJECTIVE">
          <p style={{ margin:0, fontSize:'12px', lineHeight:1.7, color:'#333' }}>
            Passionate full-stack developer with 5+ years of experience building high-performance web applications. Seeking a senior role where I can combine technical expertise with a love for creative, user-centric design.
          </p>
        </ResumeSection>

        <ResumeSection title="EXPERIENCE">
          <ResumeJob title="Senior Frontend Engineer" company="TechCorp Inc." period="2022–Present" />
          <p style={{ margin:'4px 0 10px 0', fontSize:'11px', color:'#555', lineHeight:1.6 }}>
            Led rebuilding of core product in React+TypeScript. Reduced bundle size 40%, improved Lighthouse score from 62 to 98.
          </p>
          <ResumeJob title="Frontend Developer" company="Startup XYZ" period="2020–2022" />
          <p style={{ margin:'4px 0 0 0', fontSize:'11px', color:'#555', lineHeight:1.6 }}>
            Built real-time dashboard with WebSocket and D3.js. Mentored 2 junior developers.
          </p>
        </ResumeSection>

        <ResumeSection title="EDUCATION">
          <ResumeJob title="B.Sc. Computer Science" company="Istanbul Tech University" period="2016–2020" />
          <p style={{ margin:'4px 0', fontSize:'11px', color:'#555' }}>GPA: 3.8/4.0 &nbsp;•&nbsp; Honors Graduate</p>
        </ResumeSection>

        <ResumeSection title="SKILLS">
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', fontSize:'11px', color:'#333' }}>
            <div><strong>Languages:</strong> TypeScript, JavaScript, Python, SQL</div>
            <div><strong>Frontend:</strong> React, Tailwind CSS, Framer Motion</div>
            <div><strong>Backend:</strong> Node.js, tRPC, PostgreSQL</div>
            <div><strong>Tools:</strong> Git, Figma, Docker, Vercel</div>
          </div>
        </ResumeSection>
      </div>
    </div>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'18px' }}>
      <div style={{ fontSize:'12px', fontWeight:'bold', color:'#316ac5', letterSpacing:'1.5px', marginBottom:'6px', borderBottom:'1px solid #d0d8f0', paddingBottom:'2px' }}>{title}</div>
      {children}
    </div>
  );
}

function ResumeJob({ title, company, period }: { title: string; company: string; period: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'2px' }}>
      <div style={{ fontSize:'12px', fontWeight:'bold', color:'#0a3a8a' }}>{title} <span style={{ color:'#555', fontWeight:'normal' }}>@ {company}</span></div>
      <div style={{ fontSize:'11px', color:'#888', flexShrink:0, marginLeft:'8px' }}>{period}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO PLAYER  (Bilibili iframe inside an XP Windows Media Player shell)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * A fake Windows Media Player window embedding a Bilibili video iframe.
 *
 * Layout:
 * 1. Fake WMP menu bar (File / View / Play / Tools / Help)
 * 2. "Now Playing" label strip
 * 3. Bilibili iframe takes all remaining vertical space
 * 4. Bottom transport bar with static playback-style buttons (visual only)
 */
export function VideoPlayerContent() {
  // Default Bilibili embed: popular "Windows XP startup" compilation video
  const BV_ID = 'BV1GJ411x7h7';
  const src = `https://player.bilibili.com/player.html?bvid=${BV_ID}&page=1&high_quality=1&danmaku=0&autoplay=0`;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1a1a2e', fontFamily: FONT, userSelect: 'none' }}>
      {/* ── Menu bar ── */}
      <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0', padding: '2px 4px' }}>
          {['File', 'View', 'Play', 'Tools', 'Help'].map((m) => (
            <button key={m} style={{ background: 'none', border: 'none', padding: '2px 8px', cursor: 'pointer', fontFamily: FONT, fontSize: '12px' }}>{m}</button>
          ))}
        </div>
      </div>

      {/* ── Now Playing label ── */}
      <div style={{
        background: 'linear-gradient(90deg, #003366 0%, #005599 60%, #003366 100%)',
        padding: '4px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
        borderBottom: '1px solid #000',
      }}>
        <span style={{ fontSize: '11px', color: '#7ec8ff', fontWeight: 'bold', letterSpacing: '0.5px' }}>▶ NOW PLAYING</span>
        <span style={{ fontSize: '11px', color: '#fff', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          Windows XP Nostalgia Mix — Bilibili
        </span>
      </div>

      {/* ── Video iframe ── */}
      <div style={{ flex: 1, position: 'relative', background: '#000', overflow: 'hidden' }}>
        <iframe
          src={src}
          title="Bilibili Video Player"
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>

      {/* ── Transport bar ── */}
      <div style={{
        background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
        borderTop: '2px solid #444',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}>
        {/* Playback buttons */}
        {['⏮', '⏪', '▶', '⏩', '⏭', '⏹'].map((btn) => (
          <button key={btn}
            style={{ background: 'linear-gradient(180deg,#555,#333)', border: '1px solid #666', borderRadius: '3px', color: '#ddd', fontSize: '14px', padding: '2px 8px', cursor: 'pointer', fontFamily: 'monospace' }}>
            {btn}
          </button>
        ))}
        {/* Seek bar */}
        <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px', border: '1px solid #555', position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg,#3399ff,#66bbff)', borderRadius: '3px' }} />
        </div>
        {/* Volume */}
        <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '4px' }}>🔊</span>
        <div style={{ width: '50px', height: '5px', background: '#444', borderRadius: '3px', border: '1px solid #555' }}>
          <div style={{ width: '70%', height: '100%', background: '#3399ff', borderRadius: '3px' }} />
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{ background: '#111', padding: '2px 10px', borderTop: '1px solid #333', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: '#666', fontFamily: FONT }}>Ready &nbsp;|&nbsp; Bilibili Player &nbsp;|&nbsp; 1080p HD</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PORTFOLIO FOLDER  (Works grid in XP Explorer style)
// ═══════════════════════════════════════════════════════════════════════════════

/** A single portfolio work item card */
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  /** Thumbnail URL — use any publicly accessible image */
  thumb: string;
  year: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'XP Desktop UI',
    category: 'Web Design',
    thumb: 'https://static.step1.dev/g9nbov/assets/e56270f4cdcb.webp',
    year: '2024',
  },
  {
    id: 'p2',
    title: 'Retro Music App',
    category: 'UI Design',
    thumb: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png',
    year: '2024',
  },
  {
    id: 'p3',
    title: 'Pixel Art Series',
    category: 'Illustration',
    thumb: 'https://static.step1.dev/g9nbov/assets/035b30cba825.png',
    year: '2023',
  },
  {
    id: 'p4',
    title: 'Chat Application',
    category: 'Full-Stack',
    thumb: 'https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png',
    year: '2023',
  },
  {
    id: 'p5',
    title: 'Portfolio v1',
    category: 'Web Design',
    thumb: 'https://static.step1.dev/g9nbov/assets/58721f37b0c0.png',
    year: '2022',
  },
  {
    id: 'p6',
    title: 'Icon Pack',
    category: 'Illustration',
    thumb: 'https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png',
    year: '2022',
  },
];

/** Category filter tabs styled as XP toolbar tabs */
function CategoryTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active
          ? 'linear-gradient(180deg,#ffffff 0%,#ece9d8 100%)'
          : 'linear-gradient(180deg,#d4d0c8 0%,#c0bdb5 100%)',
        border: '1px solid #aca899',
        borderBottom: active ? '1px solid #ece9d8' : '1px solid #aca899',
        borderRadius: '3px 3px 0 0',
        padding: '3px 12px',
        cursor: 'pointer',
        fontFamily: FONT,
        fontSize: '11px',
        fontWeight: active ? 'bold' : 'normal',
        color: active ? '#0a3a8a' : '#333',
        marginRight: '2px',
        position: 'relative',
        bottom: active ? '-1px' : '0',
        zIndex: active ? 1 : 0,
      }}
    >
      {label}
    </button>
  );
}

/**
 * PortfolioContent — Windows Explorer-style folder showing project works.
 *
 * Features:
 * - XP Explorer toolbar with address bar
 * - Category filter tabs (All / Web Design / Illustration / Full-Stack)
 * - Responsive grid of thumbnail cards
 * - Hover overlay with title and year
 * - Left detail panel (Explorer task pane style)
 */
export function PortfolioContent() {
  const categories = ['All', 'Web Design', 'Illustration', 'Full-Stack', 'UI Design'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((p) => p.category === activeCategory);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: FONT }}>
      {/* ── Menu & address bar ── */}
      <ExplorerToolbar address="C:\Users\Portfolio\My Works" />

      {/* ── Category tabs ── */}
      <div style={{
        background: '#ece9d8',
        padding: '6px 8px 0 8px',
        borderBottom: '1px solid #aca899',
        display: 'flex',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        {categories.map((cat) => (
          <CategoryTab key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </div>

      {/* ── Main content: task pane + grid ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left task pane (XP Explorer sidebar) */}
        <div style={{
          width: '150px',
          flexShrink: 0,
          background: 'linear-gradient(180deg,#dce8fc 0%,#b8d0f8 100%)',
          borderRight: '1px solid #7ba2d8',
          padding: '12px 8px',
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0a3a8a', marginBottom: '8px', borderBottom: '1px solid #7ba2d8', paddingBottom: '4px' }}>
            File and Folder Tasks
          </div>
          {[
            { icon: '📁', text: 'Make new folder' },
            { icon: '📤', text: 'Publish to Web' },
            { icon: '📧', text: 'E-mail items' },
          ].map((t) => (
            <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 2px', cursor: 'pointer', fontSize: '11px', color: '#0033aa', borderRadius: '2px' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(49,106,197,0.12)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <span>{t.icon}</span><span style={{ textDecoration: 'underline' }}>{t.text}</span>
            </div>
          ))}

          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0a3a8a', margin: '14px 0 8px', borderBottom: '1px solid #7ba2d8', paddingBottom: '4px' }}>
            Details
          </div>
          <div style={{ fontSize: '10px', color: '#333', lineHeight: 1.7 }}>
            <div><strong>Items:</strong> {filtered.length}</div>
            <div><strong>Type:</strong> Portfolio</div>
            <div><strong>Owner:</strong> NNNullptr</div>
          </div>
        </div>

        {/* Right: thumbnail grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px', alignContent: 'flex-start', background: '#fff' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                border: hoveredId === item.id ? '2px solid #316ac5' : '2px solid #d0d8e8',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#f5f8ff',
                boxShadow: hoveredId === item.id ? '0 2px 8px rgba(49,106,197,0.25)' : '0 1px 3px rgba(0,0,0,0.08)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            >
              {/* Thumbnail with hover overlay */}
              <div style={{ position: 'relative', height: '90px', background: '#e8eef8', overflow: 'hidden' }}>
                <img
                  src={item.thumb}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {hoveredId === item.id && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(49,106,197,0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: '4px',
                  }}>
                    <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', padding: '0 4px' }}>{item.title}</span>
                    <span style={{ color: '#c8deff', fontSize: '10px' }}>{item.year}</span>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div style={{ padding: '6px 8px', borderTop: '1px solid #d0d8e8' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0a3a8a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                <div style={{ fontSize: '10px', color: '#666', marginTop: '1px' }}>{item.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{ background: '#ece9d8', borderTop: '1px solid #aca899', padding: '2px 10px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', color: '#333' }}>{filtered.length} object(s)</span>
      </div>
    </div>
  );
}
