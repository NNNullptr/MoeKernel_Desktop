/**
 * @file winamp/index.tsx
 * @description 复古 Winamp 播放器 — 真实 HTML5 Audio 引擎。
 *              数据源：trpc.media.list（过滤 type='audio'），按 order 升序。
 *              外观背景：通过管理后台 /admin/media 配置，前台自动读取。
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';
import { useSiteSettings } from '@/client/hooks/use-site-config';
import { consumePendingViewFile } from '@/client/config/filesystem.config';

// ── 配色方案（固定，外观色彩不入库）────────────────────────────────────────
const THEME = {
  bgColor:       '#ffffffff',
  textColor:     '#464646ff',
  subTextColor:  '#7a7678ff',
  progressColor: '#ee9cc1ff',
  progressBg:    '#f5ecf2ff',
  btnBg:         '#fafafa',
  btnBorder:     '#fafafa',
  btnText:       '#ee9cc1ff',
  btnActiveBg:   '#fafafa',
} as const;

// ── 辅助 ──────────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const DEFAULT_COVER_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, #2a2a5a 0%, #6644cc 50%, #aa44aa 100%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
};

type SongItem = { id: string; coverSrc: string; title: string; artist: string; audioSrc: string };

// ── 主组件 ────────────────────────────────────────────────────────────────────
export function WinampApp() {
  // 从 DB 加载音频曲目（type='audio'）
  const { data: rawTracks = [] } = useQuery({
    ...trpc.media.list.queryOptions(),
    staleTime: 30_000,
  });

  // 从 site_settings 读取 Winamp 背景
  const { winampBgUrl, winampBgOpacity, isLoaded: settingsLoaded } = useSiteSettings();
  const [bgInit, setBgInit] = useState(false);
  const [bgImage, setBgImage] = useState('');
  const [bgOpacity, setBgOpacity] = useState(0.3);

  useEffect(() => {
    if (settingsLoaded && !bgInit) {
      setBgImage(winampBgUrl);
      setBgOpacity(winampBgOpacity);
      setBgInit(true);
    }
  }, [settingsLoaded, winampBgUrl, winampBgOpacity, bgInit]);

  // 将 DB 曲目转换为内部 SongItem，仅取 type='audio'
  const dbSongs: SongItem[] = rawTracks
    .filter((t) => t.type === 'audio')
    .map((t) => ({
      id:       t.id,
      coverSrc: t.cover,
      title:    t.title,
      artist:   t.artist,
      audioSrc: t.src,
    }));

  // 合并：pending file（拖入的文件）放最前面
  const [songs] = useState<SongItem[]>(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === 'audio') {
      return [{
        id:       '__pending__',
        coverSrc: '/assets/icons/Media.png',
        title:    pending.title,
        artist:   'Unknown',
        audioSrc: pending.url,
      }];
    }
    return [];
  });

  // 合并 pending + DB songs（DB songs 在 useEffect 后才有，直接合并到 useMemo 等价物）
  const allSongs: SongItem[] = [...songs, ...dbSongs];

  // ── 播放状态 ────────────────────────────────────────────────────────────────
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragVal,  setDragVal]  = useState(0);

  const audioRef    = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const song = allSongs[trackIdx] ?? { id: '', coverSrc: '', title: 'No Track', artist: '---', audioSrc: '' };
  const progress = duration > 0 ? (current / duration) * 100 : 0;

  // autoPlayAfterSwitch: 切换曲目后是否自动开始播放（供 next/prev/ended 使用）
  const autoPlayRef = useRef(false);

  // 切换曲目时重载 audio，按 autoPlayRef 决定是否自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setCurrent(0);
    setDuration(0);
    if (autoPlayRef.current && song.audioSrc) {
      void audio.play().catch(() => { setPlaying(false); });
    } else {
      setPlaying(false);
    }
    autoPlayRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  // ── 直接 DOM 控制（不依赖 useEffect 同步）──────────────────────────────────
  /** 播放/暂停 切换 */
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !song.audioSrc) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  const stop = () => {
    setPlaying(false);
    setCurrent(0);
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
  };

  // 自动下一首（曲目播完）
  const handleEnded = useCallback(() => {
    if (allSongs.length === 0) return;
    autoPlayRef.current = true;
    setTrackIdx((i) => (i + 1) % allSongs.length);
  }, [allSongs.length]);

  const prev = () => {
    if (allSongs.length === 0) return;
    autoPlayRef.current = playing; // 如果正在播放则切换后继续播
    setTrackIdx((i) => (i - 1 + allSongs.length) % allSongs.length);
    setCurrent(0);
  };
  const next = () => {
    if (allSongs.length === 0) return;
    autoPlayRef.current = playing;
    setTrackIdx((i) => (i + 1) % allSongs.length);
    setCurrent(0);
  };

  // 进度条拖拽
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
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: THEME.bgColor, color: THEME.textColor,
      fontFamily: '"Trebuchet MS", Tahoma, Arial, sans-serif',
      userSelect: 'none', position: 'relative', overflow: 'hidden',
    }}>
      {/* 隐藏 Audio */}
      <audio
        ref={audioRef}
        src={song.audioSrc || undefined}
        onTimeUpdate={() => { if (!dragging && audioRef.current) setCurrent(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={handleEnded}
      />

      {/* 背景图层（从 site_settings 读取） */}
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: bgOpacity, pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* 主内容 */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* 上半：封面 + 信息 */}
        <div style={{ display: 'flex', gap: '14px', padding: '14px 16px 10px', alignItems: 'center' }}>
          {/* 封面 */}
          <div style={{
            width: '100px', height: '100px', flexShrink: 0,
            border: `2px solid ${THEME.btnBorder}`, borderRadius: '4px',
            overflow: 'hidden',
            ...(song.coverSrc ? {} : DEFAULT_COVER_STYLE),
          }}>
            {song.coverSrc ? (
              <img src={song.coverSrc} alt={song.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <span>🎵</span>
            )}
          </div>

          {/* 信息 */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              fontSize: '15px', fontWeight: 'bold', color: THEME.textColor,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', letterSpacing: '0.5px',
            }}>
              {song.title}
            </div>
            <div style={{
              fontSize: '13px', color: THEME.subTextColor,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}>
              {song.artist}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '12px', color: THEME.textColor, fontFamily: '"Courier New", monospace', letterSpacing: '1px' }}>
                {formatTime(current)}
              </span>
              <span style={{ fontSize: '11px', color: THEME.subTextColor }}>
                / {formatTime(duration)}
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: '10px', color: THEME.subTextColor,
                background: THEME.btnBg, border: `1px solid ${THEME.btnBorder}`,
                borderRadius: '3px', padding: '1px 6px',
              }}>
                {allSongs.length > 0 ? `${trackIdx + 1} / ${allSongs.length}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div style={{ padding: '0 16px 10px' }}>
          <div
            ref={progressRef}
            onPointerDown={onProgressPointerDown}
            onPointerMove={onProgressPointerMove}
            onPointerUp={onProgressPointerUp}
            style={{
              height: '10px', background: THEME.progressBg, borderRadius: '5px',
              cursor: 'pointer', position: 'relative', border: `1px solid ${THEME.btnBorder}`,
            }}
          >
            <div style={{
              width: `${displayProgress}%`, height: '100%',
              background: THEME.progressColor, borderRadius: '5px',
              transition: dragging ? 'none' : 'width 0.1s linear',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: `${displayProgress}%`,
              transform: 'translate(-50%, -50%)',
              width: '14px', height: '14px', borderRadius: '50%',
              background: THEME.progressColor, border: `2px solid ${THEME.textColor}`,
              boxShadow: '0 0 4px rgba(0,0,0,0.5)',
            }} />
          </div>
        </div>

        {/* 控制按钮 */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: '8px', padding: '10px 16px 14px',
          borderTop: `1px solid ${THEME.btnBorder}`,
        }}>
          <CtrlBtn title="上一首" onClick={prev}>⏮</CtrlBtn>
          <CtrlBtn title={playing ? '暂停' : '播放'} active={playing} onClick={togglePlay}>
            {playing ? '⏸' : '▶'}
          </CtrlBtn>
          <CtrlBtn title="停止" onClick={stop}>⏹</CtrlBtn>
          <CtrlBtn title="下一首" onClick={next}>⏭</CtrlBtn>
        </div>
      </div>
    </div>
  );
}

// ── CtrlBtn ───────────────────────────────────────────────────────────────────
function CtrlBtn({ children, onClick, active = false, title }: {
  children: React.ReactNode;
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
        background: active || hov ? THEME.btnActiveBg : THEME.btnBg,
        color: THEME.btnText,
        border: `1px solid ${THEME.btnBorder}`,
        borderRadius: '5px', padding: '7px 14px', cursor: 'pointer',
        fontSize: '16px', minWidth: '42px', transition: 'background 0.15s',
        boxShadow: active ? `0 0 8px ${THEME.btnActiveBg}88` : 'none',
      }}
    >
      {children}
    </button>
  );
}
