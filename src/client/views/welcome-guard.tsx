import { useState, useEffect, useTransition, type ReactNode } from 'react';
import { useSiteSettings } from '@/client/hooks/use-site-config';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';
const LOGO_URL = 'https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico';

// 身份信息 props — 由 WelcomeGuard 从 useSiteSettings() 读取后传入
interface IdentityProps {
  brand:      string;
  subtitle:   string;
  username:   string;
  avatarUrl:  string;
  role:       string;
}

// ─── 可自定义内容 ────────────────────────────────────────────────────────────
//
// BOOT 阶段文字修改位置：
//   第 1 行大字（用户名）→ 搜索 "MoeKernel"（第一处，BootStage 内）
//   第 2 行红色后缀      → 搜索 ">xp<"（BootStage 内的 <span> 红色斜体）
//   第 3 行副标题        → 搜索 ">Welcome<"
//   进度条持续时间       → 修改 setTimeout(onDone, 3000) 中的毫秒数
//
// LOGIN 阶段文字修改位置：
//   左侧品牌大字（用户名）→ 搜索 "MoeKernel"（LoginStage 左栏第一处）
//   左侧红色后缀          → 搜索 ">xp<"（LoginStage 内）
//   左侧角色说明          → 搜索 ">Software Developer<"（左栏）
//   左侧引导语            → 搜索 ">To begin, click your user name<"
//   右侧头像卡用户名      → 搜索 "NNNullptr"（LoginStage 右栏头像卡）
//   右侧头像卡角色        → 搜索 ">Software Developer<"（右栏）
//   右侧头像图片          → 修改 src="/assets/avatarSrc.jpg"
//   底部 Restart 按钮文字 → 搜索 ">Restart<"
//   登录音效文件          → 修改 new Audio('/startup.mp3') 中的路径
//   退出动画时长          → 修改 EXIT_MS 常量（毫秒）
//
// ────────────────────────────────────────────────────────────────────────────

// 退出动画总时长（毫秒），与下方 CSS transition 保持一致
const EXIT_MS = 700;

function BootStage({ onDone, identity }: { onDone: () => void; identity: IdentityProps }) {
  // 修改 3000 可调整 Boot 阶段持续时间（单位：毫秒）
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#000', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: FONT,
    }}>
      <style>{`
        @keyframes xpBoot {
          from { transform: translateX(-100px); }
          to   { transform: translateX(280px); }
        }
      `}</style>

      <img src={LOGO_URL} alt="Windows" style={{ width: 64, height: 64, marginBottom: 24, imageRendering: 'pixelated' }} />

      {/* Boot 第 1、2 行：品牌大字 + xp 后缀 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ color: '#fff', fontSize: 36, fontWeight: 'bold' }}>{identity.brand}</span>
        <span style={{ color: '#c0392b', fontSize: 28, fontStyle: 'italic', fontWeight: 'bold' }}>xp</span>
      </div>

      {/* Boot 第 3 行：副标题 */}
      <div style={{ color: '#ccc', fontSize: 14, marginBottom: 80 }}>{identity.subtitle}</div>

      {/* 银色胶囊进度条 */}
      <div style={{
        position: 'absolute', bottom: '22%',
        width: 280, height: 16,
        border: '2px solid #2a2a2a', borderRadius: 999,
        background: '#000', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', gap: 6, alignItems: 'center', height: '100%',
          animation: 'xpBoot 1.4s linear infinite',
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 24, height: '80%', borderRadius: 999, flexShrink: 0,
              background: 'linear-gradient(180deg, #ffffff 0%, #d0d0d0 50%, #888 100%)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginStage({ onEnter, identity }: { onEnter: () => void; identity: IdentityProps }) {
  const [hovered, setHovered] = useState(false);
  const [exiting, setExiting] = useState(false);

  // useTransition 让 onEnter() 引发的状态更新以低优先级渲染，
  // React 在后台准备好桌面内容后再原子性提交，避免动画被主线程打断。
  const [, startTransition] = useTransition();

  const handleLogin = () => {
    // 播放登录音效（autoplay 被浏览器策略拦截时静默忽略）
    new Audio('/startup.mp3').play().catch(() => {});

    // 触发 GPU 加速退出动画（transform + opacity，不触发 layout/paint）
    setExiting(true);

    // 动画结束后以低优先级切换到桌面，让 React 后台预渲染
    setTimeout(() => {
      startTransition(() => onEnter());
    }, EXIT_MS);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', flexDirection: 'column', fontFamily: FONT,
      // GPU 加速：提前提升合成层，避免动画触发重绘
      willChange: 'transform, opacity',
      // 退出时 scale down + fade out；初始无 transition 防止首帧抖动
      transform: exiting ? 'scale(0.94)' : 'scale(1)',
      opacity: exiting ? 0 : 1,
      transition: exiting ? `transform ${EXIT_MS}ms ease-in, opacity ${EXIT_MS}ms ease-in` : 'none',
      pointerEvents: exiting ? 'none' : 'auto',
    }}>
      {/* 顶部深色横条 */}
      <div style={{ height: 80, background: '#3a3a3a', flexShrink: 0 }} />

      <div style={{
        flex: 1,
        background: 'linear-gradient(180deg, #c8c8c8 0%, #a8a8a8 50%, #888 100%)',
        display: 'flex',
      }}>
        {/* 左栏：品牌区 */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
          borderRight: '1px solid #999',
        }}>
          <img src={LOGO_URL} alt="Windows" style={{ width: 72, height: 72, imageRendering: 'pixelated', marginBottom: 8 }} />

          {/* 左栏：品牌大字 + xp 后缀 */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{identity.brand}</span>
            <span style={{ color: '#c0392b', fontSize: 24, fontStyle: 'italic', fontWeight: 'bold' }}>xp</span>
          </div>

          {/* 左栏：角色说明 */}
          <div style={{ color: '#eee', fontSize: 13, textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>{identity.role}</div>

          {/* 左栏：引导语 */}
          <div style={{ color: '#ddd', fontSize: 12, marginTop: 16, textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>To begin, click your user name</div>
        </div>

        {/* 右栏：头像卡（点击触发 handleLogin） */}
        <div style={{
          flex: 1, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div
            onClick={handleLogin}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '14px 20px', borderRadius: 6, cursor: 'pointer',
              background: hovered ? 'rgba(255,255,255,0.15)' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            {/* 头像 */}
            <img
              src={identity.avatarUrl}
              alt={identity.username}
              style={{ width: 80, height: 80, border: '2px solid #fff', borderRadius: 4, objectFit: 'cover' }}
            />
            <div>
              {/* 右栏：头像卡用户名 */}
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{identity.username}</div>
              {/* 右栏：头像卡角色 */}
              <div style={{ color: '#ddd', fontSize: 12, textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>{identity.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部深色横条 + Restart 按钮 */}
      <div style={{
        height: 60, background: '#3a3a3a', flexShrink: 0,
        display: 'flex', alignItems: 'center', padding: '0 20px',
      }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(180deg, #d0d0d0 0%, #a0a0a0 100%)',
            border: '1px solid #888', borderRadius: 4, padding: '4px 12px',
            cursor: 'pointer', fontFamily: FONT, fontSize: 12, color: '#000',
          }}
        >
          <span style={{ fontSize: 16 }}>⟳</span>
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
}

export function WelcomeGuard({ children }: { children: ReactNode }) {
  // sessionStorage key: 'xp:welcomed'
  // 调试时在浏览器 console 执行以下命令可重置欢迎流程：
  //   sessionStorage.removeItem('xp:welcomed'); location.reload();
  //
  // SSR 安全说明：
  // stage 初始值统一为 'init'，服务端和客户端首次渲染结果一致（均渲染 children）。
  // useEffect 在客户端水合完成后才读取 sessionStorage 并切换真实 stage，
  // 彻底避免 SSR 水合不匹配导致 React 崩溃、欢迎动画卡死的问题。
  const [stage, setStage] = useState<'init' | 'boot' | 'login' | 'desktop'>('init');

  // 身份信息：isLoaded=false 时自动使用静态 Fallback，动画开始前数据通常已到达
  const settings = useSiteSettings();
  const identity: IdentityProps = {
    brand:     settings.siteBrand,
    subtitle:  settings.bootSubtitle,
    username:  settings.siteUsername,
    avatarUrl: settings.siteAvatarUrl,
    role:      settings.siteRole,
  };

  useEffect(() => {
    const welcomed = sessionStorage.getItem('xp:welcomed') === '1';
    setStage(welcomed ? 'desktop' : 'boot');
  }, []);

  const enterDesktop = () => {
    sessionStorage.setItem('xp:welcomed', '1');
    setStage('desktop');
  };

  return (
    <>
      {children}
      {stage === 'boot' && <BootStage onDone={() => setStage('login')} identity={identity} />}
      {stage === 'login' && <LoginStage onEnter={enterDesktop} identity={identity} />}
    </>
  );
}
