import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/portfolio')({
  component: PortfolioAdminPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  techStack: string;
  link: string | null;
  imageUrl: string;
  category: string;
  order: number;
  visible: boolean;
};

type ItemForm = Omit<PortfolioItem, 'id'>;

const EMPTY_FORM: ItemForm = {
  title: '',
  description: '',
  techStack: '',
  link: '',
  imageUrl: '',
  category: '',
  order: 0,
  visible: true,
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function PortfolioAdminPage() {
  const qc = useQueryClient();

  // ── 外观设置 state ─────────────────────────────────────────────────────────
  const [bgUrl,       setBgUrl]       = useState('');
  const [bgOpacity,   setBgOpacity]   = useState(0.2);
  const [bgInit,      setBgInit]      = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg,    setErrorMsg]    = useState('');

  // ── 编辑器 state ───────────────────────────────────────────────────────────
  const [editId,       setEditId]       = useState<string | null>(null); // null = 新建
  const [form,         setForm]         = useState<ItemForm>(EMPTY_FORM);
  const [showEditor,   setShowEditor]   = useState(false);
  const [confirmDelId, setConfirmDelId] = useState<string | null>(null);

  const listQueryKey = trpc.portfolio.listAll.queryOptions().queryKey;

  // ── 数据加载 ───────────────────────────────────────────────────────────────
  const { data: items = [], isLoading } = useQuery({
    ...trpc.portfolio.listAll.queryOptions(),
    staleTime: 0,
  });

  const { data: settings } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  useEffect(() => {
    if (settings && !bgInit) {
      setBgUrl(settings['portfolio_bg_url'] ?? '');
      const raw = settings['portfolio_bg_opacity'];
      setBgOpacity(raw ? parseFloat(raw) : 0.2);
      setBgInit(true);
    }
  }, [settings, bgInit]);

  // ── 外观保存 ───────────────────────────────────────────────────────────────
  const { mutate: saveAppearance, isPending: isSaving } = useMutation(
    trpc.settings.setBatch.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({
          queryKey: trpc.site.getSettings.queryOptions().queryKey,
        });
        setErrorMsg('');
        setShowSuccess(true);
      },
      onError: (err) => setErrorMsg(err.message ?? '保存失败，请重试'),
    }),
  );

  const handleSaveAppearance = useCallback(() => {
    saveAppearance({
      portfolio_bg_url:     bgUrl.trim(),
      portfolio_bg_opacity: String(bgOpacity),
    });
  }, [saveAppearance, bgUrl, bgOpacity]);

  // ── CRUD mutations ─────────────────────────────────────────────────────────
  const { mutate: createItem } = useMutation(
    trpc.portfolio.create.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: listQueryKey });
        closeEditor();
      },
    }),
  );

  const { mutate: updateItem } = useMutation(
    trpc.portfolio.update.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: listQueryKey });
        closeEditor();
      },
    }),
  );

  const { mutate: deleteItem } = useMutation(
    trpc.portfolio.delete.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: listQueryKey });
        setConfirmDelId(null);
      },
    }),
  );

  // ── 编辑器开关 ─────────────────────────────────────────────────────────────
  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowEditor(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditId(item.id);
    setForm({
      title:       item.title,
      description: item.description,
      techStack:   item.techStack,
      link:        item.link ?? '',
      imageUrl:    item.imageUrl,
      category:    item.category,
      order:       item.order,
      visible:     item.visible,
    });
    setShowEditor(true);
  }

  function closeEditor() {
    setShowEditor(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function handleSubmit() {
    const payload = {
      ...form,
      link: form.link?.trim() || undefined,
    };
    if (editId) {
      updateItem({ id: editId, ...payload });
    } else {
      createItem(payload);
    }
  }

  function setField<K extends keyof ItemForm>(key: K, val: ItemForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // ── 渲染 ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT, position: 'relative' }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid #2060b8',
        paddingBottom: 10, marginBottom: 18,
      }}>
        <span style={{ fontSize: 28 }}>🗂️</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
            作品集管理
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            管理作品条目、技术栈标签，并配置作品集窗口全局默认背景
          </p>
        </div>
      </div>

      {/* ── 作品条目管理 ── */}
      <Section title="📋  作品条目管理">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <XpButton onClick={openCreate} primary>➕ 新增作品</XpButton>
        </div>

        {isLoading ? (
          <div style={{ fontSize: 12, color: '#666', padding: '8px 0' }}>加载中…</div>
        ) : items.length === 0 ? (
          <div style={{ fontSize: 12, color: '#888', padding: '8px 0' }}>
            暂无作品条目。点击「新增作品」添加第一个。
          </div>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                confirmingDelete={confirmDelId === item.id}
                onEdit={() => openEdit(item)}
                onDeleteRequest={() => setConfirmDelId(item.id)}
                onDeleteConfirm={() => deleteItem({ id: item.id })}
                onDeleteCancel={() => setConfirmDelId(null)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── 外观设置 ── */}
      <Section title="🎨  外观设置（全局默认背景）">
        <p style={{ margin: '0 0 10px', fontSize: 11, color: '#555' }}>
          保存后前台作品集窗口打开时默认显示此背景。
        </p>

        <FieldRow label="背景图 URL">
          <input
            type="text"
            value={bgUrl}
            onChange={(e) => setBgUrl(e.target.value)}
            placeholder="https://example.com/bg.jpg  或留空不显示背景"
            style={{
              width: 420, padding: '3px 6px', fontSize: 12, fontFamily: FONT,
              border: '2px inset #aaa', background: '#fff', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </FieldRow>

        {/* 预览 */}
        {bgUrl && (
          <div style={{ marginBottom: 10, marginLeft: 86 }}>
            <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>效果预览：</div>
            <div style={{
              width: 200, height: 120, position: 'relative', overflow: 'hidden',
              border: '2px inset #888', background: '#f0ede8',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: bgOpacity,
              }} />
              <div style={{
                position: 'relative', zIndex: 1,
                padding: '8px 6px',
              }}>
                <div style={{
                  background: '#fff', border: '1px solid #d4d0c8',
                  borderRadius: 2, padding: '4px 6px',
                  fontSize: 10, color: '#333', fontFamily: FONT,
                }}>
                  示例作品卡片
                </div>
              </div>
            </div>
          </div>
        )}

        <FieldRow label={`透明度 ${Math.round(bgOpacity * 100)}%`}>
          <input
            type="range" min={5} max={100}
            value={Math.round(bgOpacity * 100)}
            onChange={(e) => setBgOpacity(parseInt(e.target.value, 10) / 100)}
            style={{ width: 200 }}
          />
        </FieldRow>

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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <XpButton onClick={handleSaveAppearance} disabled={isSaving} primary>
            {isSaving ? '保存中…' : '💾  保存外观'}
          </XpButton>
        </div>
      </Section>

      {/* 编辑器弹窗 */}
      {showEditor && (
        <EditorDialog
          editId={editId}
          form={form}
          setField={setField}
          onSubmit={handleSubmit}
          onCancel={closeEditor}
        />
      )}

      {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

// ─── ItemRow ──────────────────────────────────────────────────────────────────

function ItemRow({
  item, confirmingDelete, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}: {
  item: PortfolioItem;
  confirmingDelete: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  const tags = item.techStack
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start',
      padding: '7px 8px',
      background: item.visible ? '#fff' : '#f5f5f5',
      border: `1px solid ${item.visible ? '#d4d0c8' : '#b8b8b8'}`,
      borderRadius: 2, marginBottom: 5,
    }}>
      {/* 缩略图 */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{
            width: 48, height: 36, objectFit: 'cover',
            border: '1px solid #ccc', borderRadius: 2, flexShrink: 0,
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      ) : (
        <div style={{
          width: 48, height: 36, background: '#e8eef8',
          border: '1px dashed #b0b8c8', borderRadius: 2, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>
          🖼️
        </div>
      )}

      {/* 信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 'bold', color: '#003c7e', fontFamily: FONT }}>
            {item.title}
          </span>
          <span style={{
            fontSize: 10, color: '#fff', background: '#5a7fb5',
            borderRadius: 2, padding: '0 5px', lineHeight: '16px',
          }}>
            {item.category || '无分类'}
          </span>
          {!item.visible && (
            <span style={{
              fontSize: 10, color: '#888', background: '#e0e0e0',
              borderRadius: 2, padding: '0 5px', lineHeight: '16px',
            }}>
              已隐藏
            </span>
          )}
          <span style={{ fontSize: 10, color: '#999' }}>排序 {item.order}</span>
        </div>
        {item.description && (
          <div style={{
            fontSize: 11, color: '#555', fontFamily: FONT,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 360, lineHeight: 1.4,
          }}>
            {item.description}
          </div>
        )}
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 3 }}>
            {tags.map((t) => (
              <span key={t} style={{
                fontSize: 10, color: '#336', background: '#e8ecf8',
                border: '1px solid #c8d0e8', borderRadius: 2, padding: '0 4px',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
        <ActionBtn onClick={onEdit}>✏️ 编辑</ActionBtn>
        {confirmingDelete ? (
          <>
            <ActionBtn onClick={onDeleteConfirm} danger>确认删除</ActionBtn>
            <ActionBtn onClick={onDeleteCancel}>取消</ActionBtn>
          </>
        ) : (
          <ActionBtn onClick={onDeleteRequest} danger>🗑️ 删除</ActionBtn>
        )}
      </div>
    </div>
  );
}

// ─── EditorDialog ─────────────────────────────────────────────────────────────

function EditorDialog({
  editId, form, setField, onSubmit, onCancel,
}: {
  editId: string | null;
  form: ItemForm;
  setField: <K extends keyof ItemForm>(key: K, val: ItemForm[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        width: 540, border: '2px solid #00378a', borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden', fontFamily: FONT,
      }}>
        {/* 标题栏 */}
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {editId ? '编辑作品' : '新增作品'}
          </span>
        </div>

        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '14px 18px' }}>
          <EditorField label="标题 *">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              style={inputStyle}
              placeholder="作品名称"
            />
          </EditorField>
          <EditorField label="分类">
            <input
              type="text"
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              style={inputStyle}
              placeholder="如：Web Design / Full-Stack / Illustration"
            />
          </EditorField>
          <EditorField label="图片 URL">
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setField('imageUrl', e.target.value)}
              style={inputStyle}
              placeholder="https://example.com/work.jpg"
            />
          </EditorField>
          <EditorField label="项目链接">
            <input
              type="text"
              value={form.link ?? ''}
              onChange={(e) => setField('link', e.target.value)}
              style={inputStyle}
              placeholder="https://github.com/... （留空则不显示）"
            />
          </EditorField>
          <EditorField label="技术栈">
            <input
              type="text"
              value={form.techStack}
              onChange={(e) => setField('techStack', e.target.value)}
              style={inputStyle}
              placeholder="React, TypeScript, Drizzle（逗号分隔）"
            />
          </EditorField>
          <EditorField label="描述">
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', height: 'auto', width: 360 }}
              placeholder="作品详情描述，灯箱中显示"
            />
          </EditorField>
          <div style={{ display: 'flex', gap: 24, marginBottom: 10 }}>
            <EditorField label="排序">
              <input
                type="number"
                value={form.order}
                onChange={(e) => setField('order', parseInt(e.target.value, 10) || 0)}
                style={{ ...inputStyle, width: 70 }}
              />
            </EditorField>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#222' }}>
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setField('visible', e.target.checked)}
                  style={{ marginRight: 4 }}
                />
                显示（visible）
              </label>
            </div>
          </div>

          {/* 按钮行 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <XpButton onClick={onCancel}>取消</XpButton>
            <XpButton onClick={onSubmit} primary disabled={!form.title.trim()}>
              {editId ? '💾 保存' : '➕ 创建'}
            </XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: 360, padding: '3px 6px', fontSize: 12, fontFamily: FONT,
  border: '2px inset #aaa', background: '#fff', outline: 'none',
  boxSizing: 'border-box',
};

// ─── 辅助组件 ─────────────────────────────────────────────────────────────────

function ActionBtn({ children, onClick, danger }: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '2px 7px', fontSize: 11, fontFamily: FONT,
        background: danger
          ? 'linear-gradient(to bottom, #fde8e8, #f8d0d0)'
          : 'linear-gradient(to bottom, #f4f4f0, #dbd9d0)',
        border: `1px solid ${danger ? '#c07070' : '#aca899'}`,
        cursor: 'pointer', borderRadius: 2,
        color: danger ? '#8b0000' : '#000',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

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

function EditorField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: '#222', width: 72, flexShrink: 0, paddingTop: 4 }}>
        {label}：
      </label>
      {children}
    </div>
  );
}

function XpButton({ children, onClick, disabled, primary }: {
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
        minWidth: primary ? 100 : 72, height: 24, padding: '0 12px',
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
      }}
    >
      {children}
    </button>
  );
}

function SuccessDialog({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        width: 320, border: '2px solid #00378a', borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden', fontFamily: FONT,
      }}>
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            作品集管理
          </span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 4 }}>
                外观设置已保存
              </div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                背景设置已写入数据库。<br />
                重新打开作品集窗口即可看到效果。
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
