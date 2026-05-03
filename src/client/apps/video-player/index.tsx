/**
 * @file video-player/index.tsx
 * @description Windows Media Player 风格的双引擎视频播放器。
 *
 * ============================================================
 * 🎨 如何修改配色主题？
 *   → 修改下方 VIDEO_CONFIG 对象中的颜色字段。
 *   → 每个字段都有中文注释说明其作用。
 *
 * 🎬 如何更换/添加视频？
 *   → 修改下方 VIDEO_LIST 数组，参考注释格式添加条目。
 *   → type: 'bilibili' 使用 B站 iframe（播放/暂停/快进键受限，只能点画面）
 *   → type: 'mp4' 使用原生 <video> 标签（所有按钮完美生效）
 *
 * ▶️ 双引擎说明：
 *   【bilibili 模式】
 *   - 渲染 B站 iframe，用户直接点击画面控制播放。
 *   - 由于浏览器跨域限制，B站会拦截外部 postMessage 指令，
 *     因此 Play / Pause / 快进 / 快退 按钮会置灰（不可点击）。
 *   - Prev / Next / Stop 按钮正常工作（它们操作外部状态）。
 *
 *   【mp4 模式】
 *   - 渲染原生 HTML5 <video>，通过 videoRef 完整控制。
 *   - 所有按钮（Play/Pause/快进/快退/上一个/下一个/停止）均完美生效。
 *   - 进度条实时更新，反映真实播放进度。
 * ============================================================
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';
import { consumePendingViewFile } from '@/client/config/filesystem.config';

// ============================================================
// 🎨 VIDEO_CONFIG — 修改配色主题
// ============================================================
const VIDEO_CONFIG = {
  bgColor: '#1a1a1a',
  menuBarBg: '#ece9d8',
  menuBarBorder: '#aca899',
  nowPlayingGradientStart: '#2a2a2a',
  nowPlayingGradientMid: '#505050',
  nowPlayingAccentColor: '#cccccc',
  nowPlayingTitleColor: '#ffffff',
  transportBgTop: '#2a2a2a',
  transportBgBottom: '#1a1a1a',
  transportBorder: '#444444',
  buttonBgTop: '#555555',
  buttonBgBottom: '#333333',
  buttonBorder: '#666666',
  buttonColor: '#dddddd',
  buttonHoverBg: '#808080',
  // 置灰按钮（bilibili模式下禁用的按钮）
  buttonDisabledBg: '#2a2a2a',
  buttonDisabledColor: '#555555',
  buttonDisabledBorder: '#3a3a3a',
  progressTrackBg: '#333333',
  progressTrackBorder: '#555555',
  progressFillStart: '#a0a0a0',
  progressFillEnd: '#c0c0c0',
  // 进度条可拖拽滑块颜色
  progressThumbColor: '#c0c0c0',
  volumeFillColor: '#a0a0a0',
  statusBarBg: '#111111',
  statusBarText: '#666666',
  statusBarBorder: '#333333',
  stoppedBg: '#000000',
  stoppedTextColor: '#555555',
};

// ============================================================
// 🎬 VIDEO_LIST — 视频播放列表（支持 bilibili 和 mp4 双引擎）
// ============================================================
//
// ── bilibili 类型 ──────────────────────────────────────────
// 【如何查找 BV 号？】
// 1. 打开 bilibili.com，找到你想嵌入的视频。
// 2. 浏览器地址栏格式：https://www.bilibili.com/video/BV1GJ411x7h7/
//                                                        ^^^^^^^^^^^^^^
//                                                        这串 BV 开头的字符就是 BV 号
// 3. 将 BV 号填入 bvid 字段。
// 4. 注意：bilibili 模式下 Play/Pause/快进/快退 按钮会置灰（B站跨域拦截）。
//
// ── mp4 类型 ───────────────────────────────────────────────
// 【如何使用 mp4 实现完美按钮控制？】
// 1. 获取视频的直链 .mp4 URL。方式举例：
//    a) 将视频放入 public/assets/ 目录，使用相对路径 '/assets/my-video.mp4'
//    b) 使用支持 CORS 的第三方托管服务（如 Cloudflare R2、Backblaze B2 等）
//    c) GitHub Releases 上传的视频文件（原始下载链接）
// 2. 填入 src 字段，type 设置为 'mp4'。
// 3. 所有播放控制按钮将完美生效！
//
// 【通用字段说明】
//   title  — 显示在 Now Playing 栏的视频标题
//   cover  — 停止状态下显示的封面图（可留空 ''）
//   type   — 'bilibili' | 'mp4'
//   bvid   — bilibili BV 号（仅 type='bilibili' 时有效）
//   src    — mp4 视频直链（仅 type='mp4' 时有效）
//
// ============================================================
type VideoItem =
  | { type: 'bilibili'; title: string; bvid: string; cover: string }
  | { type: 'mp4'; title: string; src: string; cover: string };

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ============================================================
// 类型定义
// ============================================================
interface TransportButton {
  id: string;
  icon: string | (() => string);
  label: string;
  handler: () => void;
  /** bilibili 模式下是否禁用 */
  disabledOnBilibili?: boolean;
}

/**
 * VideoPlayerApp
 *
 * 双引擎 Windows Media Player 风格播放器。
 * - bilibili 模式：渲染 B站 iframe，Play/Pause/Seek 按钮置灰。
 * - mp4 模式：渲染原生 <video>，所有按钮完整生效 + 进度条实时更新。
 *
 * 状态：
 * - currentIndex: 当前播放的视频在 VIDEO_LIST 中的下标
 * - isStopped: 是否处于停止状态（隐藏播放器，显示封面）
 * - isPlaying: 是否正在播放（控制按钮图标）
 * - progress: 播放进度 0~1（仅 mp4 模式有效）
 */
export function VideoPlayerApp() {
  // 从 DB 加载视频曲目（type='video' 或 'bilibili'）
  const { data: rawTracks = [] } = useQuery({
    ...trpc.media.list.queryOptions(),
    staleTime: 30_000,
  });

  // 将 DB 曲目映射到 VideoItem 联合类型
  const dbVideos: VideoItem[] = rawTracks
    .filter((t) => t.type === 'video' || t.type === 'bilibili')
    .map((t) => {
      if (t.type === 'bilibili') {
        return { type: 'bilibili', title: t.title, bvid: t.bvid ?? '', cover: t.cover };
      }
      return { type: 'mp4', title: t.title, src: t.src, cover: t.cover };
    });

  // pending file（拖入的视频文件）放最前面
  const [pendingVideo] = useState<VideoItem | null>(() => {
    const pending = consumePendingViewFile();
    if (pending?.type === 'video') {
      return { type: 'mp4', title: pending.title, src: pending.url, cover: '' };
    }
    return null;
  });

  const videoList: VideoItem[] = pendingVideo ? [pendingVideo, ...dbVideos] : dbVideos;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videoList[currentIndex];
  const isBilibili = currentVideo?.type === 'bilibili';
  const isMp4 = currentVideo?.type === 'mp4';

  // ── Bilibili iframe src ────────────────────────────────
  const iframeSrc =
    isBilibili && currentVideo
      ? `https://player.bilibili.com/player.html?bvid=${currentVideo.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`
      : '';

  // ── mp4 src ────────────────────────────────────────────
  const mp4Src = isMp4 && currentVideo ? currentVideo.src : '';

  // ── mp4 进度条事件绑定 ────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress(video.currentTime / video.duration);
        setDuration(video.duration);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  // isMp4 加入 deps：当 rawTracks 加载后 isMp4 从 false 变 true，
  // 此时 <video> 元素刚出现，需要重新绑定事件监听器
  }, [currentIndex, isStopped, isMp4]);

  // ── 切换视频时重置状态 ────────────────────────────────
  const switchTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsStopped(false);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, []);

  // ── 控制函数（mp4 原生控制） ──────────────────────────

  const handlePlay = () => {
    if (isStopped) {
      setIsStopped(false);
      setIsPlaying(true);
      if (isMp4) {
        setTimeout(() => videoRef.current?.play(), 100);
      }
      return;
    }
    if (isMp4) {
      videoRef.current?.play();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (isMp4) {
      videoRef.current?.pause();
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (isMp4 && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsStopped(true);
    setIsPlaying(false);
    setProgress(0);
  };

  const handleSeekBack = () => {
    const video = videoRef.current;
    if (!isMp4 || !video) return;
    // duration 未加载时（NaN）不操作，避免跳回开头
    if (!isFinite(video.duration) || video.duration === 0) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const handleSeekForward = () => {
    const video = videoRef.current;
    if (!isMp4 || !video) return;
    // 关键修复：原先 `duration || 0` 在 duration=NaN 时变成 0，导致跳回开头
    if (!isFinite(video.duration) || video.duration === 0) return;
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const handlePrev = () => switchTo((currentIndex - 1 + videoList.length) % videoList.length);
  const handleNext = () => switchTo((currentIndex + 1) % videoList.length);

  // ── 进度条点击跳转（仅 mp4） ──────────────────────────
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMp4 || !videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * (videoRef.current.duration || 0);
  };

  // ── 控制按钮配置 ──────────────────────────────────────
  const transportButtons: TransportButton[] = [
    { id: 'prev', icon: '⏮', label: '上一个', handler: handlePrev },
    { id: 'seekback', icon: '⏪', label: '快退10秒', handler: handleSeekBack, disabledOnBilibili: true },
    {
      id: 'playpause',
      icon: () => (isPlaying ? '⏸' : '▶'),
      label: isPlaying ? '暂停' : '播放',
      handler: isPlaying ? handlePause : handlePlay,
      disabledOnBilibili: true,
    },
    { id: 'seekfwd', icon: '⏩', label: '快进10秒', handler: handleSeekForward, disabledOnBilibili: true },
    { id: 'next', icon: '⏭', label: '下一个', handler: handleNext },
    { id: 'stop', icon: '⏹', label: '停止', handler: handleStop },
  ];

  // ── 辅助：格式化时间 mm:ss ────────────────────────────
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: VIDEO_CONFIG.bgColor,
        fontFamily: FONT,
        userSelect: 'none',
      }}
    >
      {/* ── 菜单栏 ── */}
      <div
        style={{
          background: VIDEO_CONFIG.menuBarBg,
          borderBottom: `1px solid ${VIDEO_CONFIG.menuBarBorder}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', padding: '2px 4px' }}>
          {['File', 'View', 'Play', 'Tools', 'Help'].map((m) => (
            <button
              key={m}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px 8px',
                cursor: 'default',
                fontFamily: FONT,
                fontSize: '12px',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ── Now Playing 标题栏 ── */}
      <div
        style={{
          background: `linear-gradient(90deg, ${VIDEO_CONFIG.nowPlayingGradientStart} 0%, ${VIDEO_CONFIG.nowPlayingGradientMid} 60%, ${VIDEO_CONFIG.nowPlayingGradientStart} 100%)`,
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
          borderBottom: '1px solid #000',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: VIDEO_CONFIG.nowPlayingAccentColor,
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
          }}
        >
          ▶ NOW PLAYING
        </span>
        <span
          style={{
            fontSize: '11px',
            color: VIDEO_CONFIG.nowPlayingTitleColor,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flex: 1,
          }}
        >
          {currentVideo?.title ?? '— No Video —'}
          <span style={{ marginLeft: '8px', opacity: 0.5, fontSize: '10px' }}>
            [{currentIndex + 1}/{videoList.length}]
          </span>
        </span>
        {/* 引擎标识徽章 */}
        <span
          style={{
            fontSize: '9px',
            padding: '1px 5px',
            borderRadius: '2px',
            background: isBilibili ? '#cc3333' : '#336633',
            color: '#fff',
            flexShrink: 0,
            letterSpacing: '0.5px',
          }}
        >
          {isBilibili ? 'BILIBILI' : 'MP4'}
        </span>
      </div>

      {/* ── 视频区域 ── */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          background: '#000',
          overflow: 'hidden',
        }}
      >
        {isStopped ? (
          /* 停止状态：封面/占位画面 */
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: VIDEO_CONFIG.stoppedBg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {currentVideo?.cover ? (
              <img
                src={currentVideo.cover}
                alt="cover"
                style={{ maxWidth: '60%', maxHeight: '60%', opacity: 0.5, borderRadius: '4px' }}
              />
            ) : (
              <span style={{ fontSize: '48px', opacity: 0.3 }}>⏹</span>
            )}
            <span
              style={{ color: VIDEO_CONFIG.stoppedTextColor, fontSize: '12px', fontFamily: FONT }}
            >
              已停止 — 点击 ▶ 播放
            </span>
          </div>
        ) : isBilibili ? (
          /* bilibili iframe 模式 */
          <iframe
            ref={iframeRef}
            key={`bilibili-${currentVideo && 'bvid' in currentVideo ? currentVideo.bvid : currentIndex}`}
            src={iframeSrc}
            title="Bilibili Video Player"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        ) : (
          /* mp4 原生 video 模式 */
          <video
            ref={videoRef}
            key={`mp4-${currentIndex}`}
            src={mp4Src}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              background: '#000',
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {/* bilibili 模式提示覆盖层（不遮挡视频，仅在角落显示小提示） */}
        {isBilibili && !isStopped && (
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              right: '8px',
              background: 'rgba(0,0,0,0.6)',
              color: '#aaa',
              fontSize: '9px',
              padding: '2px 6px',
              borderRadius: '2px',
              pointerEvents: 'none',
              fontFamily: FONT,
            }}
          >
            B站模式：直接点击画面控制
          </div>
        )}
      </div>

      {/* ── 进度条 ── */}
      <div
        style={{
          background: VIDEO_CONFIG.transportBgBottom,
          padding: '4px 10px 2px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '9px', color: '#777', minWidth: '30px', fontFamily: FONT }}>
          {isMp4 && !isStopped ? formatTime(progress * duration) : '0:00'}
        </span>
        {/* 进度条轨道 */}
        <div
          onClick={handleProgressClick}
          style={{
            flex: 1,
            height: '8px',
            background: VIDEO_CONFIG.progressTrackBg,
            borderRadius: '4px',
            border: `1px solid ${VIDEO_CONFIG.progressTrackBorder}`,
            position: 'relative',
            cursor: isMp4 && !isStopped ? 'pointer' : 'default',
          }}
        >
          {/* 填充 */}
          <div
            style={{
              width: `${(isStopped ? 0 : progress) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${VIDEO_CONFIG.progressFillStart}, ${VIDEO_CONFIG.progressFillEnd})`,
              borderRadius: '4px',
              transition: isMp4 ? 'none' : 'width 0.3s',
            }}
          />
          {/* 滑块 */}
          {isMp4 && !isStopped && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progress * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: VIDEO_CONFIG.progressThumbColor,
                border: '1px solid #fff',
                boxShadow: '0 0 3px rgba(0,0,0,0.5)',
              }}
            />
          )}
        </div>
        <span style={{ fontSize: '9px', color: '#777', minWidth: '30px', textAlign: 'right', fontFamily: FONT }}>
          {isMp4 && duration > 0 ? formatTime(duration) : '--:--'}
        </span>
      </div>

      {/* ── 控制栏（Transport Bar） ── */}
      <div
        style={{
          background: `linear-gradient(180deg, ${VIDEO_CONFIG.transportBgTop} 0%, ${VIDEO_CONFIG.transportBgBottom} 100%)`,
          borderTop: `2px solid ${VIDEO_CONFIG.transportBorder}`,
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        {transportButtons.map(({ id, icon, handler, label, disabledOnBilibili }) => {
          const isDisabled = isBilibili && disabledOnBilibili === true;
          const iconStr = typeof icon === 'function' ? icon() : icon;

          return (
            <button
              key={id}
              title={isDisabled ? `${label}（B站模式不可用）` : label}
              onClick={isDisabled ? undefined : handler}
              disabled={isDisabled}
              style={{
                background: isDisabled
                  ? VIDEO_CONFIG.buttonDisabledBg
                  : `linear-gradient(180deg, ${VIDEO_CONFIG.buttonBgTop}, ${VIDEO_CONFIG.buttonBgBottom})`,
                border: `1px solid ${isDisabled ? VIDEO_CONFIG.buttonDisabledBorder : VIDEO_CONFIG.buttonBorder}`,
                borderRadius: '3px',
                color: isDisabled ? VIDEO_CONFIG.buttonDisabledColor : VIDEO_CONFIG.buttonColor,
                fontSize: '14px',
                padding: '2px 8px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace',
                opacity: isDisabled ? 0.45 : 1,
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    VIDEO_CONFIG.buttonHoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    `linear-gradient(180deg, ${VIDEO_CONFIG.buttonBgTop}, ${VIDEO_CONFIG.buttonBgBottom})`;
                }
              }}
            >
              {iconStr}
            </button>
          );
        })}

        {/* 音量图标 */}
        <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '4px' }}>🔊</span>

        {/* 音量条（装饰性） */}
        <div
          style={{
            width: '50px',
            height: '5px',
            background: '#444',
            borderRadius: '3px',
            border: '1px solid #555',
          }}
        >
          <div
            style={{
              width: '70%',
              height: '100%',
              background: VIDEO_CONFIG.volumeFillColor,
              borderRadius: '3px',
            }}
          />
        </div>
      </div>

      {/* ── 状态栏 ── */}
      <div
        style={{
          background: VIDEO_CONFIG.statusBarBg,
          padding: '2px 10px',
          borderTop: `1px solid ${VIDEO_CONFIG.statusBarBorder}`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '10px', color: VIDEO_CONFIG.statusBarText, fontFamily: FONT }}>
          {isStopped
            ? '已停止'
            : isPlaying
            ? `▶ 正在播放 — ${currentVideo?.title ?? ''}`
            : `⏸ 已暂停 — ${currentVideo?.title ?? ''}`}
        </span>
        <span style={{ fontSize: '10px', color: VIDEO_CONFIG.statusBarText, fontFamily: FONT }}>
          {isBilibili ? 'Bilibili Player' : 'HTML5 Player'}&nbsp;|&nbsp;HD
        </span>
      </div>
    </div>
  );
}
