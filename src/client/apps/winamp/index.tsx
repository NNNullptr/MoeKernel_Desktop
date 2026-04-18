/**
 * @file winamp/index.tsx
 * @description 复古 Winamp 播放器 — 真实 HTML5 Audio 引擎，完全隐藏播放列表 UI。
 *              布局参考 Winamp 2.x 经典风格：封面 + 信息 / 进度条 / 复古按钮。
 *
 * ============================================================
 * 🎵 中文修改指南 — 如何添加歌曲、更换封面、修改主题
 * ============================================================
 *
 * 【第一步：准备文件夹】
 *   1. 在 public/assets/ 下创建两个文件夹：
 *      - public/assets/covers/      ← 存放专辑封面图片（推荐 200×200 .jpg/.png）
 *      - public/assets/tracks/      ← 存放音乐文件（支持 .mp3 / .ogg / .wav）
 *
 * 【第二步：放入文件】
 *   例如：
 *   - public/assets/covers/my-song.jpg
 *   - public/assets/tracks/my-song.mp3
 *
 * 【第三步：在 SONG_LIST 数组中添加一首歌】
 *   在下方 SONG_LIST 数组末尾（或任意位置）添加一个新对象：
 *   {
 *     coverSrc:  '/assets/covers/my-song.jpg',   // 专辑封面路径（以 / 开头）
 *     title:     '歌曲名称',                      // 显示的歌曲标题
 *     artist:    '歌手名称',                      // 显示的歌手名
 *     audioSrc:  '/assets/tracks/my-song.mp3',   // 音频文件路径（以 / 开头）
 *   },
 *
 * 【如何删除一首歌】
 *   直接删除 SONG_LIST 数组中对应的 {} 对象即可。
 *
 * 【如何修改播放器外观主题】
 *   修改下方 WINAMP_CONFIG 对象中的值：
 *   - bgImage:       背景图片路径（留空 '' 则不显示背景图）
 *   - bgOpacity:     背景图片透明度 0.0 ~ 1.0
 *   - bgColor:       播放器主背景色（CSS 颜色字符串）
 *   - textColor:     文字主色
 *   - subTextColor:  副标题、时间等次要文字颜色
 *   - progressColor: 进度条填充颜色
 *   - progressBg:    进度条轨道背景颜色
 *   - btnBg:         按钮背景色
 *   - btnBorder:     按钮边框色
 *   - btnText:       按钮文字/图标颜色
 *   - btnActiveBg:   激活（播放中）按钮的背景色
 *
 * ============================================================
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { consumePendingViewFile } from '@/client/config/filesystem.config';

// ============================================================
// 🎵 SONG_LIST — 在此添加/删除歌曲（详见顶部中文指南）
// ============================================================
const SONG_LIST = [
  {
    coverSrc: '/assets/covers/cover1.jpg',                              // 替换为 '/assets/covers/song1.jpg'
    title: 'Tatara',
    artist: 'Hatsune Miku',
    audioSrc: '/assets/tracks/Tatara.mp3',                              // 替换为 '/assets/tracks/triple-baka.mp3'
  },
  {
    coverSrc: '/assets/covers/cover2.jpg',                              // 替换为 '/assets/covers/song2.jpg'
    title: '世界で一番おひめさま',
    artist: 'Hatsune Miku',
    audioSrc: '/assets/tracks/Tatara.mp3',                              // 替换为 '/assets/tracks/world-is-mine.mp3'
  },
  // ── 在此继续添加歌曲 ──
  // {
  //   coverSrc:  '/assets/covers/my-song.jpg',
  //   title:     '歌曲名',
  //   artist:    '歌手名',
  //   audioSrc:  '/assets/tracks/my-song.mp3',
  // },
] as const;

// ============================================================
// 🎨 WINAMP_CONFIG — 在此修改主题配色与背景图
// ============================================================
const WINAMP_CONFIG = {
  // 背景图设置（留空 '' 则不显示背景图片）
  bgImage: '/assets/wallpapers/bg3.jpg',          // 例：'/assets/wallpapers/winamp-bg.jpg'
  bgOpacity: 0.3,        // 背景图透明度 0.0（全透明）~ 1.0（不透明）

  // 配色方案
  bgColor: '#ffffffff',   // 播放器整体背景色
  textColor: '#464646ff',   // 主文字颜色（歌曲名）
  subTextColor: '#7a7678ff',   // 副文字颜色（歌手名、时间）
  progressColor: '#ee9cc1ff',   // 进度条填充色
  progressBg: '#f5ecf2ff',   // 进度条轨道背景色
  btnBg: '#fafafa',   // 按钮默认背景色
  btnBorder: '#fafafa',   // 按钮边框色
  btnText: '#ee9cc1ff',   // 按钮图标/文字色
  btnActiveBg: '#fafafa',   // 播放按钮激活时的背景色
} as const;

// ============================================================
// 🛠️ 工具函数 — 将秒数格式化为 MM:SS
// ============================================================
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 默认封面占位（纯 CSS 渐变，不依赖外部图片）
const DEFAULT_COVER_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #2a2a5a 0%, #6644cc 50%, #aa44aa 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
};

// ============================================================
// 🎮 WinampApp 主组件
// ============================================================
type SongItem = { coverSrc: string; title: string; artist: string; audioSrc: string };

export function WinampApp() {
  const cfg = WINAMP_CONFIG;
  const [songs] = useState<SongItem[]>(() => {
    const base = SONG_LIST as unknown as SongItem[];
    const pending = consumePendingViewFile();
    if (pending?.type === 'audio') {
      return [{ coverSrc: '/assets/icons/Media.png', title: pending.title, artist: 'Unknown', audioSrc: pending.url }, ...base];
    }
    return [...base];
  });

  // ── 播放状态 ──
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);   // 当前播放秒数
  const [duration, setDuration] = useState(0);   // 总时长（秒）
  const [dragging, setDragging] = useState(false);
  const [dragVal, setDragVal] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const song = songs[trackIdx] ?? { coverSrc: '', title: 'No Track', artist: '---', audioSrc: '' };
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  // ── 切换曲目时更新 audio src ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setCurrent(0);
    setDuration(0);
    if (playing && song.audioSrc) {
      audio.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  // ── 播放 / 暂停 ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && song.audioSrc) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, song.audioSrc]);

  // ── 自动播放下一首 ──
  const handleEnded = useCallback(() => {
    setTrackIdx((i) => (i + 1) % songs.length);
    setPlaying(true);
  }, [songs.length]);

  // ── 上一首 / 下一首 ──
  const prev = () => { setTrackIdx((i) => (i - 1 + songs.length) % songs.length); setCurrent(0); };
  const next = () => { setTrackIdx((i) => (i + 1) % songs.length); setCurrent(0); };

  // ── 停止 ──
  const stop = () => {
    setPlaying(false);
    setCurrent(0);
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
  };

  // ── 进度条拖拽计算 ──
  const calcRatio = (e: React.MouseEvent | React.PointerEvent): number => {
    const bar = progressRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  };

  const onProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setDragVal(calcRatio(e) * 100);
  };
  const onProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragVal(calcRatio(e) * 100);
  };
  const onProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    const ratio = calcRatio(e);
    if (audioRef.current && isFinite(duration)) {
      audioRef.current.currentTime = ratio * duration;
    }
  };

  const displayProgress = dragging ? dragVal : progress;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: cfg.bgColor,
        color: cfg.textColor,
        fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── 隐藏 Audio 标签 ── */}
      <audio
        ref={audioRef}
        src={song.audioSrc || undefined}
        onTimeUpdate={() => { if (!dragging && audioRef.current) setCurrent(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={handleEnded}
      />

      {/* ── 背景图层 ── */}
      {cfg.bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${cfg.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: cfg.bgOpacity,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* ── 主内容区（在背景图层之上）── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── 上半区：封面 + 歌曲信息 ── */}
        <div style={{ display: 'flex', gap: '14px', padding: '14px 16px 10px', alignItems: 'center' }}>
          {/* 专辑封面 */}
          <div
            style={{
              width: '100px',
              height: '100px',
              flexShrink: 0,
              border: `2px solid ${cfg.btnBorder}`,
              borderRadius: '4px',
              overflow: 'hidden',
              ...(song.coverSrc ? {} : DEFAULT_COVER_STYLE),
            }}
          >
            {song.coverSrc ? (
              <img
                src={song.coverSrc}
                alt={song.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <span>🎵</span>
            )}
          </div>

          {/* 歌曲信息 */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* 歌曲名 */}
            <div
              style={{
                fontSize: '15px',
                fontWeight: 'bold',
                color: cfg.textColor,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                letterSpacing: '0.5px',
              }}
            >
              {song.title}
            </div>
            {/* 歌手名 */}
            <div
              style={{
                fontSize: '13px',
                color: cfg.subTextColor,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {song.artist}
            </div>
            {/* 时间显示 */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '12px', color: cfg.textColor, fontFamily: '"Courier New", monospace', letterSpacing: '1px' }}>
                {formatTime(current)}
              </span>
              <span style={{ fontSize: '11px', color: cfg.subTextColor }}>
                / {formatTime(duration)}
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '10px',
                  color: cfg.subTextColor,
                  background: cfg.btnBg,
                  border: `1px solid ${cfg.btnBorder}`,
                  borderRadius: '3px',
                  padding: '1px 6px',
                }}
              >
                {trackIdx + 1} / {songs.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── 进度条区域 ── */}
        <div style={{ padding: '0 16px 10px' }}>
          <div
            ref={progressRef}
            onPointerDown={onProgressPointerDown}
            onPointerMove={onProgressPointerMove}
            onPointerUp={onProgressPointerUp}
            style={{
              height: '10px',
              background: cfg.progressBg,
              borderRadius: '5px',
              cursor: 'pointer',
              position: 'relative',
              border: `1px solid ${cfg.btnBorder}`,
            }}
          >
            {/* 填充条 */}
            <div
              style={{
                width: `${displayProgress}%`,
                height: '100%',
                background: cfg.progressColor,
                borderRadius: '5px',
                transition: dragging ? 'none' : 'width 0.1s linear',
              }}
            />
            {/* 拖拽手柄 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${displayProgress}%`,
                transform: 'translate(-50%, -50%)',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: cfg.progressColor,
                border: `2px solid ${cfg.textColor}`,
                boxShadow: '0 0 4px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </div>

        {/* ── 底部控制按钮 ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px 14px',
            borderTop: `1px solid ${cfg.btnBorder}`,
            background: 'transparent',
          }}
        >
          {/* Previous */}
          <CtrlBtn cfg={cfg} title="上一首" onClick={prev}>
            ⏮
          </CtrlBtn>

          {/* Play */}
          <CtrlBtn cfg={cfg} title="播放" active={playing && !false} onClick={() => setPlaying(true)}>
            ▶
          </CtrlBtn>

          {/* Pause */}
          <CtrlBtn cfg={cfg} title="暂停" active={!playing} onClick={() => setPlaying(false)}>
            ⏸
          </CtrlBtn>

          {/* Stop */}
          <CtrlBtn cfg={cfg} title="停止" onClick={stop}>
            ⏹
          </CtrlBtn>

          {/* Next */}
          <CtrlBtn cfg={cfg} title="下一首" onClick={next}>
            ⏭
          </CtrlBtn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔧 CtrlBtn — 复古控制按钮（内联配色）
// ============================================================
function CtrlBtn({
  children,
  cfg,
  onClick,
  active = false,
  title,
}: {
  children: React.ReactNode;
  cfg: typeof WINAMP_CONFIG;
  onClick: () => void;
  active?: boolean;
  title?: string;
}) {
  const [hov, setHov] = useState(false);

  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: active ? cfg.btnActiveBg : hov ? cfg.btnActiveBg : cfg.btnBg,
        color: cfg.btnText,
        border: `1px solid ${cfg.btnBorder}`,
        borderRadius: '5px',
        padding: '7px 14px',
        cursor: 'pointer',
        fontSize: '16px',
        minWidth: '42px',
        transition: 'background 0.15s',
        boxShadow: active ? `0 0 8px ${cfg.btnActiveBg}88` : 'none',
      }}
    >
      {children}
    </button>
  );
}
