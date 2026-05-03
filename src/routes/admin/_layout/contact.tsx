import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/client/trpc';
import type { ContactItem } from '@/client/hooks/use-site-config';

export const Route = createFileRoute('/admin/_layout/contact')({
  component: ContactAdminPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

const DEFAULT_LINKS: ContactItem[] = [
  { id: 'github',  name: 'GitHub',  url: 'https://github.com/NNNullptr', iconSrc: '/assets/icons/github.png',  emoji: '' },
  { id: 'twitter', name: 'Twitter', url: 'https://x.com/NNNullptr',      iconSrc: '/assets/icons/twitter.png', emoji: '' },
];

function newItem(): ContactItem {
  return { id: `link-${Date.now()}`, name: '', url: '', iconSrc: '', emoji: '🌐' };
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function ContactAdminPage() {
  const qc = useQueryClient();

  // ── 链接状态 ────────────────────────────────────────────────────────────────
  const [links,         setLinks]         = useState<ContactItem[]>(DEFAULT_LINKS);
  const [linksInited,   setLinksInited]   = useState(false);
  const [showLinksOk,   setShowLinksOk]   = useState(false);
  const [linksErr,      setLinksErr]      = useState('');

  // ── 外观状态 ────────────────────────────────────────────────────────────────
  const [bgUrl,         setBgUrl]         = useState('');
  const [bgOpacity,     setBgOpacity]     = useState(0.15);
  const [bgInited,      setBgInited]      = useState(false);
  const [showBgOk,      setShowBgOk]      = useState(false);
  const [bgErr,         setBgErr]         = useState('');

  // ── 读取设置 ────────────────────────────────────────────────────────────────
  const { data: settings, isPending: isLoading } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  useEffect(() => {
    if (!settings) return;
    if (!linksInited) {
      const raw = settings['contact_content'];
      if (raw) {
        try { setLinks(JSON.parse(raw) as ContactItem[]); } catch { /* fallback */ }
      }
      setLinksInited(true);
    }
    if (!bgInited) {
      setBgUrl(settings['contact_bg_url'] ?? '');
      const rawOp = settings['contact_bg_opacity'];
      setBgOpacity(rawOp ? parseFloat(rawOp) : 0.15);
      setBgInited(true);
    }
  }, [settings, linksInited, bgInited]);

  const invalidateFront = useCallback(() => {
    void qc.invalidateQueries({ queryKey: trpc.site.getSettings.queryOptions().queryKey });
  }, [qc]);

  // ── 保存链接 ────────────────────────────────────────────────────────────────
  const { mutate: saveLinks, isPending: isSavingLinks } = useMutation(
    trpc.settings.setBatch.mutationOptions({
      onSuccess: () => { invalidateFront(); setLinksErr(''); setShowLinksOk(true); },
      onError:   (err) => setLinksErr(err.message ?? '保存失败，请重试'),
    }),
  );
  const handleSaveLinks = useCallback(() => {
    const cleaned = links.map((l) => ({
      ...l,
      name:    l.name.trim(),
      url:     l.url.trim(),
      iconSrc: l.iconSrc.trim(),
      emoji:   l.emoji.trim(),
    }));
    saveLinks({ contact_content: JSON.stringify(cleaned) });
  }, [saveLinks, links]);

  // ── 保存外观 ────────────────────────────────────────────────────────────────
  const { mutate: saveBg, isPending: isSavingBg } = useMutation(
    trpc.settings.setBatch.mutationOptions({
      onSuccess: () => { invalidateFront(); setBgErr(''); setShowBgOk(true); },
      onError:   (err) => setBgErr(err.message ?? '保存失败，请重试'),
    }),
  );
  const handleSaveBg = useCallback(() => {
    saveBg({ contact_bg_url: bgUrl.trim(), contact_bg_opacity: String(bgOpacity) });
  }, [saveBg, bgUrl, bgOpacity]);

  const updateItem = (idx: number, patch: Partial<ContactItem>) =>
    setLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  const deleteItem = (idx: number) =>
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  const addItem = () => setLinks((prev) => [...prev, newItem()]);

  // ── 渲染 ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT, position: 'relative' }}>

      {/* 页头 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 28 }}>📬</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>联系方式设置</h1>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>管理前台 Contact Me 窗口的社交链接与背景图，保存后前台即时生效</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ color: '#555', fontSize: 12, marginTop: 16 }}>正在加载设置…</div>
      ) : (
        <>
          {/* ── 链接列表 ── */}
          <Section title="🔗  社交链接列表">
            {links.length === 0 && (
              <p style={{ fontSize: 11, color: '#888', margin: '8px 0' }}>暂无链接，点击"添加"新建一条。</p>
            )}
            {links.map((item, idx) => (
              <LinkRow
                key={item.id}
                item={item}
                idx={idx}
                onChange={(patch) => updateItem(idx, patch)}
                onDelete={() => deleteItem(idx)}
              />
            ))}
            <div style={{ marginTop: 10 }}>
              <XpButton onClick={addItem}>＋ 添加链接</XpButton>
            </div>
          </Section>

          {/* 说明 */}
          <Section title="💡  说明">
            <ul style={{ margin: '4px 0', paddingLeft: 20, fontSize: 11, color: '#555', lineHeight: 1.8 }}>
              <li><b>图标 URL</b>：填写本地路径（如 <code>/assets/icons/github.png</code>）或外链 URL。</li>
              <li><b>Emoji 备用</b>：当图标 URL 为空时显示此 Emoji。</li>
              <li><b>链接</b>：邮件地址请填写 <code>mailto:xxx@example.com</code>。</li>
            </ul>
          </Section>

          {linksErr && <ErrorBar msg={linksErr} />}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 20 }}>
            <XpButton onClick={handleSaveLinks} disabled={isSavingLinks} primary>
              {isSavingLinks ? '保存中…' : '💾  保存链接'}
            </XpButton>
            <XpButton onClick={() => setLinksInited(false)} disabled={isSavingLinks}>重置</XpButton>
          </div>

          {/* ── 外观设置 ── */}
          <Section title="🎨  外观设置（全局默认背景）">
            <p style={{ margin: '0 0 10px', fontSize: 11, color: '#555' }}>
              保存后前台 Contact Me 窗口打开时默认显示此背景。
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
                <div style={{ width: 200, height: 120, position: 'relative', overflow: 'hidden', border: '2px inset #888', background: '#fff' }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${bgUrl})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: bgOpacity,
                  }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: '12px 16px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {['G', 'T', 'Q'].map((c) => (
                      <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: 24, height: 24, background: '#d4d0c8', border: '1px solid #aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#555' }}>{c}</div>
                        <div style={{ fontSize: 7, color: '#333', fontFamily: FONT }}>Link</div>
                      </div>
                    ))}
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

      {showLinksOk && (
        <SuccessDialog
          title="联系方式设置"
          message="链接已保存。"
          detail="前台 Contact Me 窗口重新打开后即可看到最新效果。"
          onClose={() => setShowLinksOk(false)}
        />
      )}
      {showBgOk && (
        <SuccessDialog
          title="联系方式设置"
          message="外观设置已保存。"
          detail="重新打开 Contact Me 窗口即可看到背景效果。"
          onClose={() => setShowBgOk(false)}
        />
      )}
    </div>
  );
}

// ─── 单条链接编辑行 ───────────────────────────────────────────────────────────

function LinkRow({
  item, idx, onChange, onDelete,
}: {
  item: ContactItem;
  idx: number;
  onChange: (patch: Partial<ContactItem>) => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ border: '1px solid #c8c0b0', borderRadius: 2, padding: '10px 12px', marginBottom: 8, background: '#fff', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', color: '#555' }}>链接 #{idx + 1}</span>
        <XpButton onClick={onDelete}><span style={{ color: '#990000' }}>✕ 删除</span></XpButton>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', rowGap: 5, columnGap: 8, alignItems: 'center', fontSize: 12 }}>
        <label style={{ color: '#333' }}>显示名称：</label>
        <XpInput value={item.name} onChange={(v) => onChange({ name: v })} placeholder="如：GitHub" />
        <label style={{ color: '#333' }}>跳转链接：</label>
        <XpInput value={item.url} onChange={(v) => onChange({ url: v })} placeholder="https://... 或 mailto:..." />
        <label style={{ color: '#333' }}>图标 URL：</label>
        <XpInput value={item.iconSrc} onChange={(v) => onChange({ iconSrc: v })} placeholder="/assets/icons/xxx.png 或留空" />
        <label style={{ color: '#333' }}>Emoji 备用：</label>
        <XpInput value={item.emoji} onChange={(v) => onChange({ emoji: v })} placeholder="🌐" />
        <label style={{ color: '#333' }}>ID（唯一）：</label>
        <XpInput value={item.id} onChange={(v) => onChange({ id: v })} placeholder="唯一字符串" />
      </div>
      {(item.iconSrc || item.emoji) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: '#666' }}>预览：</span>
          {item.iconSrc ? (
            <img src={item.iconSrc} alt={item.name} style={{ width: 28, height: 28, objectFit: 'contain' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }} />
          ) : (
            <span style={{ fontSize: 22 }}>{item.emoji}</span>
          )}
          <span style={{ fontSize: 12, color: '#444' }}>{item.name}</span>
        </div>
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

function XpInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '3px 6px', fontSize: 12, fontFamily: FONT, border: '2px inset #aaa', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
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
