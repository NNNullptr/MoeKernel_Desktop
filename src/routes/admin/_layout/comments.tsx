import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc, queryClient } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/comments')({
  component: CommentsPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type Provider = 'disabled' | 'giscus' | 'waline';

type GiscusForm = {
  repo:        string;
  repoId:      string;
  category:    string;
  categoryId:  string;
  mapping:     string;
  theme:       string;
  lang:        string;
};

type WalineForm = {
  serverUrl: string;
  path:      string;
  lang:      string;
};

const GISCUS_EMPTY: GiscusForm = {
  repo: '', repoId: '', category: '', categoryId: '',
  mapping: 'pathname', theme: 'preferred_color_scheme', lang: 'zh-CN',
};

const WALINE_EMPTY: WalineForm = {
  serverUrl: '', path: '', lang: 'zh-CN',
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function CommentsPage() {
  const [provider,     setProvider]     = useState<Provider>('disabled');
  const [giscus,       setGiscus]       = useState<GiscusForm>(GISCUS_EMPTY);
  const [waline,       setWaline]       = useState<WalineForm>(WALINE_EMPTY);
  const [initialized,  setInitialized]  = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [errorMsg,     setErrorMsg]     = useState('');

  // ── 从 site_settings 加载当前配置 ────────────────────────────────────────
  const { data: settings, isPending: isLoading } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  useEffect(() => {
    if (settings && !initialized) {
      const p = (settings['comment_provider'] ?? 'disabled') as Provider;
      setProvider(['giscus', 'waline'].includes(p) ? p : 'disabled');

      setGiscus({
        repo:       settings['comment_giscus_repo']        ?? '',
        repoId:     settings['comment_giscus_repo_id']     ?? '',
        category:   settings['comment_giscus_category']    ?? '',
        categoryId: settings['comment_giscus_category_id'] ?? '',
        mapping:    settings['comment_giscus_mapping']     ?? 'pathname',
        theme:      settings['comment_giscus_theme']       ?? 'preferred_color_scheme',
        lang:       settings['comment_giscus_lang']        ?? 'zh-CN',
      });

      setWaline({
        serverUrl: settings['comment_waline_server_url'] ?? '',
        path:      settings['comment_waline_path']       ?? '',
        lang:      settings['comment_waline_lang']       ?? 'zh-CN',
      });

      setInitialized(true);
    }
  }, [settings, initialized]);

  // ── 保存 ──────────────────────────────────────────────────────────────────
  const { mutate: save, isPending: isSaving } = useMutation({
    ...trpc.settings.setBatch.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.site.getSettings.queryOptions().queryKey,
      });
      setErrorMsg('');
      setShowSuccess(true);
    },
    onError: (err) => setErrorMsg(err.message ?? '保存失败，请重试'),
  });

  const handleSave = useCallback(() => {
    save({
      comment_provider:             provider,
      comment_giscus_repo:          giscus.repo.trim(),
      comment_giscus_repo_id:       giscus.repoId.trim(),
      comment_giscus_category:      giscus.category.trim(),
      comment_giscus_category_id:   giscus.categoryId.trim(),
      comment_giscus_mapping:       giscus.mapping,
      comment_giscus_theme:         giscus.theme,
      comment_giscus_lang:          giscus.lang.trim(),
      comment_waline_server_url:    waline.serverUrl.trim(),
      comment_waline_path:          waline.path.trim(),
      comment_waline_lang:          waline.lang.trim(),
    });
  }, [save, provider, giscus, waline]);

  // ── 渲染 ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 18,
      }}>
        <span style={{ fontSize: 28 }}>💬</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>评论系统</h1>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            选择评论方案并填写配置参数，保存后前台博客底部自动显示评论区
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ fontSize: 12, color: '#555' }}>正在加载配置…</div>
      ) : (
        <>
          {/* ── 方案选择 ── */}
          <Section title="📦  评论方案">
            <FieldRow label="当前方案">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                style={{
                  padding: '3px 6px', fontSize: 12, fontFamily: FONT,
                  border: '2px inset #aaa', background: '#fff', outline: 'none',
                  cursor: 'pointer', minWidth: 180,
                }}
              >
                <option value="disabled">🚫  关闭（不显示评论）</option>
                <option value="giscus">💬  Giscus（基于 GitHub Discussions）</option>
                <option value="waline">✍️  Waline（自部署评论服务）</option>
              </select>
            </FieldRow>

            <ProviderBadge provider={provider} />
          </Section>

          {/* ── Giscus 配置 ── */}
          {provider === 'giscus' && (
            <Section title="⚙️  Giscus 配置">
              <GiscusGuide />

              <FieldRow label="repo *">
                <XpInput
                  value={giscus.repo}
                  onChange={(v) => setGiscus((p) => ({ ...p, repo: v }))}
                  placeholder="owner/repo-name"
                  width={280}
                />
                <Hint>GitHub 仓库路径，格式：用户名/仓库名</Hint>
              </FieldRow>

              <FieldRow label="repo-id *">
                <XpInput
                  value={giscus.repoId}
                  onChange={(v) => setGiscus((p) => ({ ...p, repoId: v }))}
                  placeholder="R_kgDO..."
                  width={280}
                  mono
                />
                <Hint>仓库 ID，在 giscus.app 生成脚本中获取</Hint>
              </FieldRow>

              <FieldRow label="category *">
                <XpInput
                  value={giscus.category}
                  onChange={(v) => setGiscus((p) => ({ ...p, category: v }))}
                  placeholder="Announcements"
                  width={200}
                />
                <Hint>Discussion 分类名称</Hint>
              </FieldRow>

              <FieldRow label="category-id *">
                <XpInput
                  value={giscus.categoryId}
                  onChange={(v) => setGiscus((p) => ({ ...p, categoryId: v }))}
                  placeholder="DIC_kwDO..."
                  width={280}
                  mono
                />
                <Hint>分类 ID，在 giscus.app 生成脚本中获取</Hint>
              </FieldRow>

              <FieldRow label="页面映射">
                <XpSelect
                  value={giscus.mapping}
                  onChange={(v) => setGiscus((p) => ({ ...p, mapping: v }))}
                  options={[
                    { value: 'pathname', label: 'pathname（推荐）' },
                    { value: 'url',      label: 'url' },
                    { value: 'title',    label: 'title' },
                    { value: 'og:title', label: 'og:title' },
                  ]}
                />
              </FieldRow>

              <FieldRow label="主题">
                <XpSelect
                  value={giscus.theme}
                  onChange={(v) => setGiscus((p) => ({ ...p, theme: v }))}
                  options={[
                    { value: 'preferred_color_scheme', label: '跟随系统（推荐）' },
                    { value: 'light',                  label: 'light' },
                    { value: 'dark',                   label: 'dark' },
                    { value: 'dark_dimmed',             label: 'dark_dimmed' },
                    { value: 'transparent_dark',        label: 'transparent_dark' },
                  ]}
                />
              </FieldRow>

              <FieldRow label="语言">
                <XpInput
                  value={giscus.lang}
                  onChange={(v) => setGiscus((p) => ({ ...p, lang: v }))}
                  placeholder="zh-CN"
                  width={100}
                />
              </FieldRow>
            </Section>
          )}

          {/* ── Waline 配置 ── */}
          {provider === 'waline' && (
            <Section title="⚙️  Waline 配置">
              <WalineGuide />

              <FieldRow label="Server URL *">
                <XpInput
                  value={waline.serverUrl}
                  onChange={(v) => setWaline((p) => ({ ...p, serverUrl: v }))}
                  placeholder="https://waline.example.com"
                  width={320}
                />
                <Hint>Waline 服务端地址（需自行部署）</Hint>
              </FieldRow>

              <FieldRow label="path">
                <XpInput
                  value={waline.path}
                  onChange={(v) => setWaline((p) => ({ ...p, path: v }))}
                  placeholder="留空则自动使用页面路径"
                  width={280}
                />
              </FieldRow>

              <FieldRow label="语言">
                <XpInput
                  value={waline.lang}
                  onChange={(v) => setWaline((p) => ({ ...p, lang: v }))}
                  placeholder="zh-CN"
                  width={100}
                />
              </FieldRow>
            </Section>
          )}

          {/* ── 当前存储的 Key 预览 ── */}
          <Section title="🔑  存储的配置 Key（site_settings 表）">
            <KeyPreview provider={provider} giscus={giscus} waline={waline} />
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
              {isSaving ? '保存中…' : '💾  保存配置'}
            </XpButton>
            <XpButton onClick={() => setInitialized(false)} disabled={isSaving}>
              重置
            </XpButton>
          </div>
        </>
      )}

      {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

// ─── 方案状态徽标 ─────────────────────────────────────────────────────────────

function ProviderBadge({ provider }: { provider: Provider }) {
  const map = {
    disabled: { color: '#a00', bg: '#fff0f0', border: '#fca0a0', text: '🚫  评论区已关闭，博客页面底部不显示任何评论组件' },
    giscus:   { color: '#005c00', bg: '#f0fff0', border: '#80c080', text: '✅  评论将由 Giscus 提供，数据存储于 GitHub Discussions' },
    waline:   { color: '#003a7a', bg: '#f0f4ff', border: '#a0b8e0', text: '✅  评论将由 Waline 提供，数据存储于你的自部署服务' },
  }[provider];

  return (
    <div style={{
      marginTop: 8, padding: '6px 10px',
      background: map.bg, border: `1px solid ${map.border}`,
      borderRadius: 2, fontSize: 11, color: map.color,
    }}>
      {map.text}
    </div>
  );
}

// ─── 配置 Key 预览 ────────────────────────────────────────────────────────────

function KeyPreview({ provider, giscus, waline }: {
  provider: Provider; giscus: GiscusForm; waline: WalineForm;
}) {
  const rows: [string, string][] = [
    ['comment_provider', provider],
    ...(provider === 'giscus' ? [
      ['comment_giscus_repo',        giscus.repo        || '（未填）'],
      ['comment_giscus_repo_id',     giscus.repoId      || '（未填）'],
      ['comment_giscus_category',    giscus.category    || '（未填）'],
      ['comment_giscus_category_id', giscus.categoryId  || '（未填）'],
      ['comment_giscus_mapping',     giscus.mapping],
      ['comment_giscus_theme',       giscus.theme],
      ['comment_giscus_lang',        giscus.lang        || 'zh-CN'],
    ] as [string, string][] : []),
    ...(provider === 'waline' ? [
      ['comment_waline_server_url', waline.serverUrl || '（未填）'],
      ['comment_waline_path',       waline.path      || '（自动）'],
      ['comment_waline_lang',       waline.lang      || 'zh-CN'],
    ] as [string, string][] : []),
  ];

  return (
    <div style={{
      background: '#fff', border: '2px inset #aaa',
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 11, lineHeight: 1.7, padding: '6px 10px',
    }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: '#2060b8', minWidth: 240, flexShrink: 0 }}>{k}</span>
          <span style={{ color: '#333' }}>=</span>
          <span style={{ color: v.startsWith('（') ? '#aaa' : '#060', wordBreak: 'break-all' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Giscus 配置说明 ─────────────────────────────────────────────────────────

function GiscusGuide() {
  return (
    <div style={{
      background: '#f8f8f0', border: '1px solid #c8c080',
      borderRadius: 2, padding: '8px 10px', marginBottom: 12, fontSize: 11,
      color: '#444', lineHeight: 1.7,
    }}>
      📋 <strong>如何获取 repo-id 和 category-id：</strong><br />
      1. 在 GitHub 仓库中开启 Discussions 功能<br />
      2. 访问 <code style={{ background: '#eee', padding: '0 3px' }}>giscus.app</code>，
         输入仓库名后自动生成配置脚本<br />
      3. 从脚本中复制 <code style={{ background: '#eee', padding: '0 3px' }}>data-repo-id</code> 和{' '}
         <code style={{ background: '#eee', padding: '0 3px' }}>data-category-id</code> 的值粘贴到此处
    </div>
  );
}

// ─── Waline 配置说明 ─────────────────────────────────────────────────────────

function WalineGuide() {
  return (
    <div style={{
      background: '#f8f8f0', border: '1px solid #c8c080',
      borderRadius: 2, padding: '8px 10px', marginBottom: 12, fontSize: 11,
      color: '#444', lineHeight: 1.7,
    }}>
      📋 <strong>如何部署 Waline 服务端：</strong><br />
      推荐使用 Vercel 一键部署 + LeanCloud 存储数据（免费）。<br />
      访问 <code style={{ background: '#eee', padding: '0 3px' }}>waline.js.org/guide/get-started</code> 查看完整教程，
      部署完成后将服务地址填入下方 Server URL。
    </div>
  );
}

// ─── 成功对话框 ───────────────────────────────────────────────────────────────

function SuccessDialog({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, fontFamily: FONT,
    }}>
      <div style={{
        width: 340, border: '2px solid #00378a', borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            评论系统
          </span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 4 }}>
                配置已保存
              </div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                评论系统配置已写入数据库。<br />
                前台博客页面刷新后即可看到评论区（Phase 4 接入后生效）。
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

// ─── 共用 UI ──────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{
      border: '2px groove #b0a890', borderRadius: 2,
      padding: '6px 12px 12px', marginBottom: 16, background: '#f5f3ec',
    }}>
      <legend style={{ fontSize: 12, fontWeight: 'bold', color: '#003', padding: '0 6px', background: '#f5f3ec' }}>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 12, color: '#222', width: 108, flexShrink: 0 }}>{label}：</label>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 10, color: '#888', marginLeft: 4 }}>{children}</span>;
}

function XpInput({
  value, onChange, placeholder, width = 260, mono = false,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; width?: number; mono?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width, padding: '3px 6px', fontSize: 12,
        fontFamily: mono ? 'Consolas, "Courier New", monospace' : FONT,
        border: '2px inset #aaa', background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

function XpSelect({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '3px 6px', fontSize: 12, fontFamily: FONT,
        border: '2px inset #aaa', background: '#fff', outline: 'none', cursor: 'pointer',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function XpButton({
  children, onClick, disabled, primary,
}: {
  children: React.ReactNode; onClick?: () => void;
  disabled?: boolean; primary?: boolean;
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
        minWidth: primary ? 100 : 72, height: 24, padding: '0 12px',
        fontFamily: FONT, fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        border: '2px solid',
        borderColor: pressed ? '#003399 #a0b8e0 #a0b8e0 #003399' : '#a0b8e0 #003399 #003399 #a0b8e0',
        background: disabled
          ? '#d4d0c8'
          : pressed
            ? 'linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)'
            : primary
              ? 'linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)'
              : 'linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)',
        color: disabled ? '#888' : '#000',
        boxShadow: pressed ? 'none' : '1px 1px 0 rgba(255,255,255,0.8) inset',
        outline: 'none', fontWeight: primary ? 'bold' : 'normal',
      }}
    >
      {children}
    </button>
  );
}
