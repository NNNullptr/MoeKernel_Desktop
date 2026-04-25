import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { trpc, queryClient } from '@/client/trpc';

// CSS 由 Vite 在构建时处理，SSR 路径会被 Vite 过滤，不会在服务端报错
import '@uiw/react-md-editor/markdown-editor.css';

// MDEditor 使用 CodeMirror 等浏览器专属 API，必须懒加载避免 SSR 崩溃
const MDEditor = lazy(() =>
  import('@uiw/react-md-editor').then((m) => ({ default: m.default })),
);

export const Route = createFileRoute('/admin/_layout/blog/new')({
  component: NewBlogPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type FormState = {
  title:           string;
  category:        string;
  icon:            string;
  backgroundImage: string;
  bgOpacity:       number;
  order:           number;
  content:         string;
};

const EMPTY: FormState = {
  title: '', category: '', icon: '',
  backgroundImage: '', bgOpacity: 1, order: 0, content: '',
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function NewBlogPage() {
  const navigate = useNavigate();
  const [form, setForm]         = useState<FormState>(EMPTY);
  const [errorMsg, setErrorMsg] = useState('');

  const set = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  }, []);

  const isValid =
    form.title.trim() && form.content.trim() &&
    form.category.trim() && form.icon.trim();

  const { mutate: create, isPending } = useMutation({
    ...trpc.blog.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.blog.list.queryOptions().queryKey });
      queryClient.invalidateQueries({ queryKey: trpc.site.getBlogPosts.queryOptions().queryKey });
      navigate({ to: '/admin/blog' as string });
    },
    onError: (err) => setErrorMsg(err.message ?? '发布失败，请重试'),
  });

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    setErrorMsg('');
    create({
      title:           form.title.trim(),
      category:        form.category.trim(),
      icon:            form.icon.trim(),
      backgroundImage: form.backgroundImage.trim(),
      bgOpacity:       form.bgOpacity,
      order:           form.order,
      content:         form.content,
    });
  }, [create, form, isValid]);

  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>✏️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
              新建文章
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#555' }}>撰写并发布一篇新博客文章</p>
          </div>
        </div>
        <a href="/admin/blog" style={{ textDecoration: 'none' }}>
          <XpButton>← 返回列表</XpButton>
        </a>
      </div>

      {/* ── 基本信息 ── */}
      <Section title="📄  基本信息">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
          <Field label="标题 *">
            <XpInput value={form.title} onChange={(v) => set('title', v)} placeholder="文章标题" />
          </Field>
          <Field label="分类 *">
            <XpInput value={form.category} onChange={(v) => set('category', v)} placeholder="技术 / 生活 / 随笔" />
          </Field>
          <Field label="排序">
            <XpInput
              value={String(form.order)}
              onChange={(v) => set('order', parseInt(v) || 0)}
              placeholder="0"
              width={80}
            />
            <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>数字越小越靠前</span>
          </Field>
        </div>
      </Section>

      {/* ── 视觉设置 ── */}
      <Section title="🖼️  视觉设置">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <Field label="图标 URL *">
              <XpInput
                value={form.icon}
                onChange={(v) => set('icon', v)}
                placeholder="/assets/icons/Blog.png"
                width={300}
              />
            </Field>
            <Field label="背景图 URL">
              <XpInput
                value={form.backgroundImage}
                onChange={(v) => set('backgroundImage', v)}
                placeholder="/assets/wallpapers/bg4.jpg （留空则无背景）"
                width={300}
              />
            </Field>
            <Field label="背景不透明度">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="range"
                  min={0} max={1} step={0.05}
                  value={form.bgOpacity}
                  onChange={(e) => set('bgOpacity', parseFloat(e.target.value))}
                  style={{ width: 160, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 12, minWidth: 32, color: '#333' }}>
                  {(form.bgOpacity * 100).toFixed(0)}%
                </span>
              </div>
            </Field>
          </div>

          {/* 图标 & 背景预览 */}
          <VisualPreview icon={form.icon} bg={form.backgroundImage} opacity={form.bgOpacity} />
        </div>
      </Section>

      {/* ── Markdown 编辑器 ── */}
      <Section title="📝  文章内容 *">
        <EditorArea value={form.content} onChange={(v) => set('content', v)} />
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {!isValid && (
          <span style={{ fontSize: 11, color: '#888', alignSelf: 'center', marginRight: 8 }}>
            * 标题、分类、图标、内容为必填项
          </span>
        )}
        <XpButton onClick={handleSubmit} disabled={isPending || !isValid} primary>
          {isPending ? '发布中…' : '🚀  发布文章'}
        </XpButton>
        <a href="/admin/blog" style={{ textDecoration: 'none' }}>
          <XpButton disabled={isPending}>取消</XpButton>
        </a>
      </div>
    </div>
  );
}

// ─── Markdown 编辑器区域（客户端懒加载）────────────────────────────────────────

function EditorArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // isMounted 确保 SSR 阶段不渲染任何与浏览器 API 相关的内容
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) {
    return (
      <div style={{
        height: 400, background: '#f8f8f0', border: '2px inset #aaa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#888', fontSize: 12,
      }}>
        编辑器加载中…
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div style={{
        height: 400, background: '#f8f8f0', border: '2px inset #aaa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#888', fontSize: 12,
      }}>
        编辑器加载中…
      </div>
    }>
      {/* data-color-mode 控制编辑器明暗主题，light 与后台视觉保持一致 */}
      <div data-color-mode="light" style={{ border: '2px inset #aaa' }}>
        <MDEditor
          value={value}
          onChange={(v) => onChange(v ?? '')}
          height={400}
          preview="live"
          style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
        />
      </div>
    </Suspense>
  );
}

// ─── 视觉预览 ─────────────────────────────────────────────────────────────────

function VisualPreview({
  icon, bg, opacity,
}: {
  icon: string; bg: string; opacity: number;
}) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>卡片预览</div>
      {/* 模拟博客卡片外观 */}
      <div style={{
        width: 160, height: 90,
        border: '2px inset #aaa',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        background: '#333',
      }}>
        {bg && (
          <img
            src={bg}
            alt=""
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity,
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {icon && (
          <img
            src={icon}
            alt=""
            style={{
              position: 'absolute', bottom: 6, right: 6,
              width: 28, height: 28,
              objectFit: 'contain',
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {!bg && !icon && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#888', fontSize: 10,
          }}>
            填写 URL 后预览
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 共用 UI 组件 ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{
      border: '2px groove #b0a890', borderRadius: 2,
      padding: '6px 12px 12px', marginBottom: 16, background: '#f5f3ec',
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

function Field({
  label, children,
}: {
  label: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 12, color: '#222', width: 104, flexShrink: 0 }}>{label}：</label>
      {children}
    </div>
  );
}

function XpInput({
  value, onChange, placeholder, width = 240,
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
        width, padding: '3px 6px', fontSize: 12, fontFamily: FONT,
        border: '2px inset #aaa', background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

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
        minWidth: primary ? 110 : 72, height: 24, padding: '0 12px',
        fontFamily: FONT, fontSize: 12,
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
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
