import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/client/trpc';
import type { AboutConfig } from '@/client/hooks/use-site-config';

export const Route = createFileRoute('/admin/_layout/about')({
  component: AboutAdminPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

const DEFAULT_ABOUT: AboutConfig = {
  name:            'NNNullptr',
  title:           '简介一段',
  location:        'null',
  avatarSrc:       '/assets/avatarSrc.jpg',
  markdownContent: '## 标题\n\n欢迎访问，随便写几句\n',
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function AboutAdminPage() {
  const qc = useQueryClient();

  // ── 内容状态 ────────────────────────────────────────────────────────────────
  const [config,          setConfig]          = useState<AboutConfig>(DEFAULT_ABOUT);
  const [contentInited,   setContentInited]   = useState(false);
  const [showContentOk,   setShowContentOk]   = useState(false);
  const [contentErr,      setContentErr]      = useState('');

  // ── 外观状态 ────────────────────────────────────────────────────────────────
  const [bgUrl,           setBgUrl]           = useState('/assets/wallpapers/bg2.jpg');
  const [bgOpacity,       setBgOpacity]       = useState(0.5);
  const [bgInited,        setBgInited]        = useState(false);
  const [showBgOk,        setShowBgOk]        = useState(false);
  const [bgErr,           setBgErr]           = useState('');

  // ── 读取设置 ────────────────────────────────────────────────────────────────
  const { data: settings, isPending: isLoading } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  useEffect(() => {
    if (!settings) return;
    if (!contentInited) {
      const raw = settings['about_content'];
      if (raw) {
        try { setConfig(JSON.parse(raw) as AboutConfig); } catch { /* fallback */ }
      }
      setContentInited(true);
    }
    if (!bgInited) {
      setBgUrl(settings['about_bg_url'] ?? '/assets/wallpapers/bg2.jpg');
      const rawOp = settings['about_bg_opacity'];
      setBgOpacity(rawOp ? parseFloat(rawOp) : 0.5);
      setBgInited(true);
    }
  }, [settings, contentInited, bgInited]);

  const invalidateFront = useCallback(() => {
    void qc.invalidateQueries({ queryKey: trpc.site.getSettings.queryOptions().queryKey });
  }, [qc]);

  // ── 保存内容 ────────────────────────────────────────────────────────────────
  const { mutate: saveContent, isPending: isSavingContent } = useMutation(
    trpc.settings.setBatch.mutationOptions({
      onSuccess: () => { invalidateFront(); setContentErr(''); setShowContentOk(true); },
      onError:   (err) => setContentErr(err.message ?? '保存失败，请重试'),
    }),
  );
  const handleSaveContent = useCallback(() => {
    saveContent({ about_content: JSON.stringify(config) });
  }, [saveContent, config]);

  // ── 保存外观 ────────────────────────────────────────────────────────────────
  const { mutate: saveBg, isPending: isSavingBg } = useMutation(
    trpc.settings.setBatch.mutationOptions({
      onSuccess: () => { invalidateFront(); setBgErr(''); setShowBgOk(true); },
      onError:   (err) => setBgErr(err.message ?? '保存失败，请重试'),
    }),
  );
  const handleSaveBg = useCallback(() => {
    saveBg({ about_bg_url: bgUrl.trim(), about_bg_opacity: String(bgOpacity) });
  }, [saveBg, bgUrl, bgOpacity]);

  const update = (patch: Partial<AboutConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  // ── 渲染 ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT, position: 'relative' }}>

      {/* 页头 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 28 }}>👤</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>关于我设置</h1>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>管理前台 About Me 窗口的个人简介与背景图，保存后前台即时生效</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#555', fontSize: 12, marginTop: 16 }}>正在加载设置…</div>
      ) : (
        <>
          {/* ── 基本信息 ── */}
          <Section title="📋  基本信息">
            <FieldRow label="昵称">
              <XpInput value={config.name} onChange={(v) => update({ name: v })} placeholder="NNNullptr" />
            </FieldRow>
            <FieldRow label="职位/简介">
              <XpInput value={config.title} onChange={(v) => update({ title: v })} placeholder="前端开发者 / 学生" />
            </FieldRow>
            <FieldRow label="位置">
              <XpInput value={config.location} onChange={(v) => update({ location: v })} placeholder="null" />
            </FieldRow>
            <FieldRow label="头像 URL">
              <XpInput value={config.avatarSrc} onChange={(v) => update({ avatarSrc: v })} placeholder="/assets/avatarSrc.jpg 或外链" width={380} />
            </FieldRow>
            {config.avatarSrc && (
              <div style={{ marginLeft: 90, marginBottom: 4 }}>
                <img src={config.avatarSrc} alt="头像预览"
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #aaa' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }} />
              </div>
            )}
          </Section>

          {/* ── Markdown 内容 ── */}
          <Section title="📝  Markdown 内容（中间滚动区）">
            <p style={{ margin: '0 0 6px', fontSize: 11, color: '#555' }}>
              支持标准 Markdown 语法：## 标题、**加粗**、- 列表、{'>'} 引用等。
            </p>
            <textarea
              value={config.markdownContent}
              onChange={(e) => update({ markdownContent: e.target.value })}
              rows={14}
              spellCheck={false}
              style={{
                width: '100%', boxSizing: 'border-box', padding: '6px 8px',
                fontSize: 12, fontFamily: 'Consolas, "Courier New", monospace',
                border: '2px inset #aaa', background: '#fff',
                resize: 'vertical', outline: 'none', lineHeight: 1.6,
              }}
            />
          </Section>

          {/* 内容错误 */}
          {contentErr && <ErrorBar msg={contentErr} />}

          {/* 内容保存 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 20 }}>
            <XpButton onClick={handleSaveContent} disabled={isSavingContent} primary>
              {isSavingContent ? '保存中…' : '💾  保存内容'}
            </XpButton>
            <XpButton onClick={() => setContentInited(false)} disabled={isSavingContent}>重置</XpButton>
          </div>

          {/* ── 外观设置 ── */}
          <Section title="🎨  外观设置（全局默认背景）">
            <p style={{ margin: '0 0 10px', fontSize: 11, color: '#555' }}>
              保存后前台 About Me 窗口打开时默认显示此背景。
            </p>

            <FieldRow label="背景图 URL">
              <input
                type="text"
                value={bgUrl}
                onChange={(e) => setBgUrl(e.target.value)}
                placeholder="https://example.com/bg.jpg  或 /assets/wallpapers/...  或留空不显示"
                style={{
                  width: 420, padding: '3px 6px', fontSize: 12, fontFamily: FONT,
                  border: '2px inset #aaa', background: '#fff', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </FieldRow>

            {/* 效果预览 */}
            {bgUrl && (
              <div style={{ marginBottom: 10, marginLeft: 86 }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>效果预览：</div>
                <div style={{ width: 200, height: 120, position: 'relative', overflow: 'hidden', border: '2px inset #888', background: 'linear-gradient(160deg,#f0f0f0,#fafafa)' }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${bgUrl})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: bgOpacity,
                  }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '10px 10px' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,0.65)', borderRadius: 2, padding: '4px 6px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#b8b8b8', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 8, fontWeight: 'bold', color: '#767676' }}>NNNullptr</div>
                        <div style={{ fontSize: 7, color: '#888' }}>前端开发者</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <FieldRow label={`透明度 ${Math.round(bgOpacity * 100)}%`}>
              <input
                type="range" min={0} max={100}
                value={Math.round(bgOpacity * 100)}
                onChange={(e) => setBgOpacity(parseInt(e.target.value, 10) / 100)}
                style={{ width: 200 }}
              />
            </FieldRow>

            {bgErr && <ErrorBar msg={bgErr} />}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <XpButton onClick={handleSaveBg} disabled={isSavingBg} primary>
                {isSavingBg ? '保存中…' : '💾  保存外观'}
              </XpButton>
            </div>
          </Section>
        </>
      )}

      {showContentOk && (
        <SuccessDialog
          title="关于我设置"
          message="内容已写入数据库。"
          detail="前台 About Me 窗口重新打开后即可看到最新效果。"
          onClose={() => setShowContentOk(false)}
        />
      )}
      {showBgOk && (
        <SuccessDialog
          title="关于我设置"
          message="外观设置已保存。"
          detail="重新打开 About Me 窗口即可看到背景效果。"
          onClose={() => setShowBgOk(false)}
        />
      )}
    </div>
  );
}

// ─── 辅助组件 ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: '2px groove #b0a890', borderRadius: 2, padding: '6px 12px 12px', marginBottom: 16, background: '#f5f3ec' }}>
      <legend style={{ fontSize: 12, fontWeight: 'bold', color: '#003', padding: '0 6px', background: '#f5f3ec' }}>{title}</legend>
      {children}
    </fieldset>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: '#222', width: 76, flexShrink: 0 }}>{label}：</label>
      {children}
    </div>
  );
}

function ErrorBar({ msg }: { msg: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff4ce', border: '1px solid #e0a000', borderRadius: 2, padding: '6px 10px', marginBottom: 12 }}>
      <span style={{ fontSize: 16 }}>⚠️</span>
      <span style={{ fontSize: 11, color: '#7a4900' }}>{msg}</span>
    </div>
  );
}

function XpInput({ value, onChange, placeholder, width = 320 }: { value: string; onChange: (v: string) => void; placeholder?: string; width?: number }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width, padding: '3px 6px', fontSize: 12, fontFamily: FONT, border: '2px inset #aaa', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
    />
  );
}

function XpButton({ children, onClick, disabled, primary }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; primary?: boolean }) {
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
        minWidth: primary ? 100 : 72, height: 24, padding: '0 12px',
        fontFamily: FONT, fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        border: '2px solid',
        borderColor: pressed ? '#003399 #a0b8e0 #a0b8e0 #003399' : '#a0b8e0 #003399 #003399 #a0b8e0',
        background: disabled ? '#d4d0c8' : pressed ? 'linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)' : primary ? 'linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)' : 'linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)',
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

function SuccessDialog({ title, message, detail, onClose }: { title: string; message: string; detail: string; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: 320, border: '2px solid #00378a', borderRadius: 4, boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px' }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{title}</span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 4 }}>{message}</div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>{detail}</div>
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
