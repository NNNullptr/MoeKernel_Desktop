import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc, queryClient } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/theme')({
  component: ThemePage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function ThemePage() {
  const [wallpaperUrl,  setWallpaperUrl]  = useState('');
  const [logoUrl,       setLogoUrl]       = useState('');
  const [trayIconsText, setTrayIconsText] = useState('');
  const [initialized,   setInitialized]   = useState(false);
  const [showSuccess,   setShowSuccess]   = useState(false);
  const [errorMsg,      setErrorMsg]      = useState('');

  // ── 读取当前设置 ────────────────────────────────────────────���─────────────
  const { data: settings, isPending: isLoading } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  // 首次加载完成后，用 DB 值初始化表单（只跑一次）
  useEffect(() => {
    if (settings && !initialized) {
      setWallpaperUrl(settings['wallpaper_url'] ?? '');
      setLogoUrl(settings['windows_logo_url'] ?? '');
      const raw = settings['system_tray_icons'];
      const icons: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      setTrayIconsText(icons.join('\n'));
      setInitialized(true);
    }
  }, [settings, initialized]);

  // ── 保存 ──────────────────────────────────────────────────────────────────
  const { mutate: save, isPending: isSaving } = useMutation({
    ...trpc.settings.setBatch.mutationOptions(),
    onSuccess: () => {
      // 失效前台 site.getSettings 缓存，下次访问首页自动重新拉取
      queryClient.invalidateQueries({
        queryKey: trpc.site.getSettings.queryOptions().queryKey,
      });
      setErrorMsg('');
      setShowSuccess(true);
    },
    onError: (err) => {
      setErrorMsg(err.message ?? '保存失败，请重试');
    },
  });

  const handleSave = useCallback(() => {
    const trayIcons = trayIconsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    save({
      wallpaper_url:    wallpaperUrl.trim(),
      windows_logo_url: logoUrl.trim(),
      system_tray_icons: JSON.stringify(trayIcons),
    });
  }, [save, wallpaperUrl, logoUrl, trayIconsText]);

  // ── 渲染 ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT, position: 'relative' }}>

      {/* 页头 */}
      <PageHeader />

      {isLoading ? (
        <div style={{ color: '#555', fontSize: 12, marginTop: 16 }}>正在加载设置…</div>
      ) : (
        <>
          {/* 壁纸 */}
          <Section title="🖼️  桌面壁纸">
            <FieldRow label="图片 URL">
              <XpInput
                value={wallpaperUrl}
                onChange={setWallpaperUrl}
                placeholder="https://example.com/wallpaper.jpg 或 /assets/wallpapers/..."
                width={420}
              />
            </FieldRow>
            <ImagePreview src={wallpaperUrl} aspect="16/9" maxWidth={280} label="壁纸预览" />
          </Section>

          {/* Windows Logo */}
          <Section title="🪟  Windows Logo（左下角图标）">
            <FieldRow label="图标 URL">
              <XpInput
                value={logoUrl}
                onChange={setLogoUrl}
                placeholder="https://example.com/logo.ico 或 /assets/..."
                width={420}
              />
            </FieldRow>
            <ImagePreview src={logoUrl} aspect="1/1" maxWidth={48} label="Logo 预览" />
          </Section>

          {/* 托盘图标 */}
          <Section title="📌  系统托盘图标">
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#555' }}>
              每行一个图片 URL，从左到右依次显示在任务栏右侧。
            </p>
            <textarea
              value={trayIconsText}
              onChange={(e) => setTrayIconsText(e.target.value)}
              rows={6}
              spellCheck={false}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '4px 6px',
                fontSize: 12,
                fontFamily: 'Consolas, "Courier New", monospace',
                border: '2px inset #aaa',
                background: '#fff',
                resize: 'vertical',
                outline: 'none',
              }}
            />
            {/* 托盘图标即时预览 */}
            <TrayPreview text={trayIconsText} />
          </Section>

          {/* 错误提示 */}
          {errorMsg && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff4ce', border: '1px solid #e0a000',
              borderRadius: 2, padding: '6px 10px', marginBottom: 12,
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 11, color: '#7a4900' }}>{errorMsg}</span>
            </div>
          )}

          {/* 操作栏 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <XpButton onClick={handleSave} disabled={isSaving} primary>
              {isSaving ? '保存中…' : '💾  保存设置'}
            </XpButton>
            <XpButton onClick={() => setInitialized(false)} disabled={isSaving}>
              重置
            </XpButton>
          </div>
        </>
      )}

      {/* 成功对话框 */}
      {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

// ─── 页头 ─────────────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '2px solid #2060b8',
      paddingBottom: 10, marginBottom: 18,
    }}>
      <span style={{ fontSize: 28 }}>🎨</span>
      <div>
        <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
          主题设置
        </h1>
        <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
          修改壁纸、Logo 与托盘图标，保存后前台即时生效
        </p>
      </div>
    </div>
  );
}

// ─── GroupBox（XP 显示属性风格）──────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{
      border: '2px groove #b0a890',
      borderRadius: 2,
      padding: '6px 12px 12px',
      marginBottom: 16,
      background: '#f5f3ec',
    }}>
      <legend style={{
        fontSize: 12, fontWeight: 'bold', color: '#003',
        padding: '0 6px', background: '#f5f3ec',
      }}>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

// ─── 表单行 ──────────────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: '#222', width: 76, flexShrink: 0 }}>
        {label}：
      </label>
      {children}
    </div>
  );
}

// ─── XP 风格输入框 ───────────────────────────────────────────────────────────���─

function XpInput({
  value, onChange, placeholder, width = 320,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width,
        padding: '3px 6px',
        fontSize: 12,
        fontFamily: FONT,
        border: '2px inset #aaa',
        background: '#fff',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

// ─── 图片预览 ─────────────────────────────────────────────────────────────────

function ImagePreview({
  src, aspect, maxWidth, label,
}: {
  src: string;
  aspect: string;
  maxWidth: number;
  label: string;
}) {
  const [broken, setBroken] = useState(false);

  // URL 变化时重置 broken 状态
  useEffect(() => { setBroken(false); }, [src]);

  const isUrl = src.startsWith('http') || src.startsWith('/');

  return (
    <div style={{ marginTop: 6, marginBottom: 4 }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{label}</div>
      <div style={{
        width: maxWidth,
        aspectRatio: aspect,
        background: '#c8c8c8',
        border: '2px inset #888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {isUrl && !broken ? (
          <img
            src={src}
            alt={label}
            onError={() => setBroken(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: 10, color: '#888' }}>
            {src ? (broken ? '加载失败' : '…') : '（未填写）'}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── 托盘图标即时预览 ─────────────────────────────────────────────────────────

function TrayPreview({ text }: { text: string }) {
  const icons = text.split('\n').map((s) => s.trim()).filter(Boolean);
  if (icons.length === 0) return null;

  return (
    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 11, color: '#666', marginRight: 4 }}>预览：</span>
      {icons.map((url, i) => (
        <img
          key={i}
          src={url}
          alt=""
          style={{
            width: 18, height: 18,
            objectFit: 'contain',
            imageRendering: 'pixelated',
          }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
        />
      ))}
    </div>
  );
}

// ─── XP 风格按钮 ──────────────────────────────────────────────────────────────

function XpButton({
  children, onClick, disabled, primary,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        minWidth: primary ? 100 : 72,
        height: 24,
        padding: '0 12px',
        fontFamily: FONT,
        fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        border: '2px solid',
        borderColor: pressed
          ? '#003399 #a0b8e0 #a0b8e0 #003399'
          : '#a0b8e0 #003399 #003399 #a0b8e0',
        background: disabled
          ? '#d4d0c8'
          : pressed
            ? 'linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)'
            : primary
              ? 'linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)'
              : 'linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)',
        color: disabled ? '#888' : '#000',
        boxShadow: pressed ? 'none' : '1px 1px 0 rgba(255,255,255,0.8) inset',
        outline: 'none',
        fontWeight: primary ? 'bold' : 'normal',
      }}
    >
      {children}
    </button>
  );
}

// ─── 成功对话框 ───────────────────────────────────────────────────────────────

function SuccessDialog({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        width: 320,
        border: '2px solid #00378a',
        borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>
        {/* 标题栏 */}
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            主题设置
          </span>
        </div>

        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 4 }}>
                设置已保存
              </div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                主题设置已成功写入数据库。<br />
                前台页面刷新后即可看到最新效果。
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <XpButton onClick={onClose} primary>确定</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}
