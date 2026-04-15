/**
 * @file msn/index.tsx
 * @description MSN Messenger app — retro chat UI with bot auto-replies.
 *
 * Self-contained app component with its own message state.
 * Future: replace bot replies with a real tRPC WebSocket subscription.
 */

import { useRef, useState, useEffect, useCallback } from 'react';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

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

function nowStr() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

export function MsnApp() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: 'them', text: 'heyyy, whats up! :)', time: '3:41 PM' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = useCallback(() => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: 'me', text: input.trim(), time: nowStr() }]);
    setInput('');
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)]!;
      setMessages((m) => [...m, { from: 'them', text: reply, time: nowStr() }]);
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

      {/* Emoji strip */}
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
