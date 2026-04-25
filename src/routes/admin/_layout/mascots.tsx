import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc, queryClient } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/mascots')({
  component: MascotsPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type Mascot = {
  id:      string;
  label:   string;
  iconSrc: string;
  petSrc:  string;
  size:    number;
  order:   number;
};

function invalidateMascots() {
  queryClient.invalidateQueries({ queryKey: trpc.settings.listAllMascots.queryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: trpc.site.getMascots.queryOptions().queryKey });
}

// 判断是否为路径/URL（否则视为 emoji 或纯文字）
function isUrl(src: string) {
  return src.startsWith('/') || src.startsWith('http') || src.startsWith('data:');
}

// ─── 通用图片/Emoji 预览 ──────────────────────────────────────────────────────

function SrcPreview({
  src, size, pixelated = false,
}: {
  src: string; size: number; pixelated?: boolean;
}) {
  if (!src) {
    return (
      <div style={{
        width: size, height: size,
        background: '#d8d0c8', border: '1px dashed #aaa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, color: '#888', flexShrink: 0,
      }}>
        空
      </div>
    );
  }
  if (isUrl(src)) {
    return (
      <img
        src={src}
        alt=""
        style={{
          width: size, height: size,
          objectFit: 'contain', flexShrink: 0,
          imageRendering: pixelated ? 'pixelated' : 'auto',
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.floor(size * 0.65), lineHeight: 1,
    }}>
      {src}
    </div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

function MascotsPage() {
  const [editTarget,   setEditTarget]   = useState<Mascot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Mascot | null>(null);
  const [showAdd,      setShowAdd]      = useState(false);

  const { data: mascots = [], isPending } = useQuery({
    ...trpc.settings.listAllMascots.queryOptions(),
    staleTime: 0,
  });

  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🐾</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
              桌宠管理
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
              {isPending ? '加载中…' : `共 ${mascots.length} 只桌宠`}
            </p>
          </div>
        </div>
        <XpButton primary onClick={() => setShowAdd(true)}>✚ 添加桌宠</XpButton>
      </div>

      {/* 说明 */}
      <div style={{
        background: '#f0f4ff', border: '1px solid #a0b8e0',
        borderRadius: 2, padding: '6px 10px', marginBottom: 14,
        fontSize: 11, color: '#224', lineHeight: 1.6,
      }}>
        💡 <strong>侧边栏图标</strong>（iconSrc）显示在右侧面板的按钮上，点击后召唤桌宠；
        <strong>桌宠精灵</strong>（petSrc）为出现在桌面上的图像，支持 GIF 动图。
        路径填写 <code style={{ background: '#e8eef8', padding: '0 3px' }}>/assets/pets/...</code>
        或完整 URL，也可直接填写 Emoji（如 🐱）。
      </div>

      {/* 缩略图网格 */}
      {isPending ? (
        <div style={{ color: '#555', fontSize: 12 }}>正在加载桌宠列表…</div>
      ) : mascots.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
        }}>
          {mascots.map((m) => (
            <MascotCard
              key={m.id}
              mascot={m}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <MascotDialog
          mode="edit"
          initial={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          mascot={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDeleted={() => setDeleteTarget(null)}
        />
      )}

      {showAdd && (
        <MascotDialog mode="add" onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}

// ─── 桌宠卡片（缩略图视图）────────────────────────────────────────────────────

function MascotCard({
  mascot, onEdit, onDelete,
}: {
  mascot: Mascot;
  onEdit:   (m: Mascot) => void;
  onDelete: (m: Mascot) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? '2px solid #6699cc' : '2px inset #aaa',
        borderRadius: 2,
        background: hovered ? '#f0f5fc' : '#f5f3ec',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color 0.1s, background 0.1s',
      }}
    >
      {/* 精灵预览区域 */}
      <div style={{
        background: '#2a2a3a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 130, position: 'relative', overflow: 'hidden',
        flexShrink: 0,
      }}>
        <SrcPreview src={mascot.petSrc} size={110} />

        {/* 侧边栏图标（右上角小图） */}
        <div style={{
          position: 'absolute', top: 5, right: 5,
          background: 'rgba(0,0,0,0.55)', borderRadius: 3,
          padding: 3, display: 'flex',
        }}
          title="侧边栏图标（iconSrc）"
        >
          <SrcPreview src={mascot.iconSrc} size={20} pixelated />
        </div>

        {/* 尺寸标签 */}
        <div style={{
          position: 'absolute', bottom: 5, left: 5,
          background: 'rgba(0,0,0,0.6)',
          color: '#cce', fontSize: 10, padding: '1px 5px', borderRadius: 2,
        }}>
          {mascot.size}px
        </div>

        {/* 排序标签 */}
        <div style={{
          position: 'absolute', bottom: 5, right: 5,
          background: 'rgba(0,0,0,0.6)',
          color: '#ccc', fontSize: 10, padding: '1px 5px', borderRadius: 2,
        }}>
          #{mascot.order}
        </div>
      </div>

      {/* 信息与操作 */}
      <div style={{ padding: '7px 8px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* 名称 */}
        <div style={{
          fontSize: 12, fontWeight: 'bold', color: '#003',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
          title={mascot.label || '（无名称）'}
        >
          {mascot.label || <span style={{ color: '#999', fontStyle: 'italic' }}>无名称</span>}
        </div>

        {/* ID（小字） */}
        <div style={{
          fontSize: 10, color: '#888',
          fontFamily: 'Consolas, monospace',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
          title={mascot.id}
        >
          {mascot.id}
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
          <XpButton small onClick={() => onEdit(mascot)} style={{ flex: 1 }}>
            ✏️ 编辑
          </XpButton>
          <XpButton small danger onClick={() => onDelete(mascot)}>
            🗑️
          </XpButton>
        </div>
      </div>
    </div>
  );
}

// ─── 添加 / 编辑弹窗（复用）──────────────────────────────────────────────────

type MascotDialogProps =
  | { mode: 'add';  initial?: undefined; onClose: () => void }
  | { mode: 'edit'; initial: Mascot;     onClose: () => void };

function MascotDialog({ mode, initial, onClose }: MascotDialogProps) {
  const [label,    setLabel]   = useState(initial?.label   ?? '');
  const [iconSrc,  setIconSrc] = useState(initial?.iconSrc ?? '');
  const [petSrc,   setPetSrc]  = useState(initial?.petSrc  ?? '');
  const [size,     setSize]    = useState(String(initial?.size  ?? 120));
  const [order,    setOrder]   = useState(String(initial?.order ?? 0));
  const [errorMsg, setError]   = useState('');

  const isValid = iconSrc.trim() && petSrc.trim();

  const { mutate: create, isPending: isCreating } = useMutation({
    ...trpc.settings.createMascot.mutationOptions(),
    onSuccess: () => { invalidateMascots(); onClose(); },
    onError:   (err) => setError(err.message ?? '创建失败'),
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    ...trpc.settings.updateMascot.mutationOptions(),
    onSuccess: () => { invalidateMascots(); onClose(); },
    onError:   (err) => setError(err.message ?? '保存失败'),
  });

  const isPending = isCreating || isUpdating;

  const handleSubmit = () => {
    if (!isValid) return;
    setError('');
    const parsedSize  = parseInt(size)  || 120;
    const parsedOrder = parseInt(order) || 0;

    if (mode === 'add') {
      create({ label: label.trim(), iconSrc: iconSrc.trim(), petSrc: petSrc.trim(), size: parsedSize, order: parsedOrder });
    } else {
      update({ id: initial.id, label: label.trim(), iconSrc: iconSrc.trim(), petSrc: petSrc.trim(), size: parsedSize, order: parsedOrder });
    }
  };

  const titleText = mode === 'add' ? '添加桌宠' : '编辑桌宠';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, fontFamily: FONT,
    }}>
      <div style={{
        width: 480, border: '2px solid #00378a', borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        {/* 标题栏 */}
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            {titleText}
          </span>
        </div>

        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '16px 20px 14px' }}>

          {/* 预览区（实时） */}
          <div style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            marginBottom: 14, padding: '10px 12px',
            background: '#2a2a3a', borderRadius: 3,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8899bb', marginBottom: 4 }}>桌宠精灵</div>
              <div style={{ background: '#3a3a4e', border: '1px solid #555', borderRadius: 2, padding: 6 }}>
                <SrcPreview src={petSrc || initial?.petSrc || ''} size={80} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#8899bb', marginBottom: 4 }}>侧边栏图标</div>
              <div style={{ background: '#3a3a4e', border: '1px solid #555', borderRadius: 2, padding: 6 }}>
                <SrcPreview src={iconSrc || initial?.iconSrc || ''} size={32} pixelated />
              </div>
            </div>
            <div style={{ color: '#8899bb', fontSize: 11, alignSelf: 'center', lineHeight: 1.6 }}>
              <div>精灵尺寸：{parseInt(size) || 0}px</div>
              <div>排序：#{parseInt(order) || 0}</div>
              {label && <div>名称：{label}</div>}
            </div>
          </div>

          <DlgField label="名称">
            <DlgInput value={label} onChange={setLabel} placeholder="桌宠昵称（可留空）" />
          </DlgField>
          <DlgField label="侧边栏图标 *">
            <DlgInput
              value={iconSrc}
              onChange={setIconSrc}
              placeholder="/assets/pets/avatars/1.png 或 🐱"
            />
          </DlgField>
          <DlgField label="桌宠精灵 *">
            <DlgInput
              value={petSrc}
              onChange={setPetSrc}
              placeholder="/assets/pets/sprites/1.gif 或 🐈"
            />
          </DlgField>
          <DlgField label="显示尺寸（px）">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number"
                min={20} max={400}
                value={size}
                onChange={(e) => setSize(e.target.value)}
                style={{
                  width: 70, padding: '3px 6px', fontSize: 12,
                  border: '2px inset #aaa', background: '#fff',
                  outline: 'none', fontFamily: FONT,
                }}
              />
              <input
                type="range" min={20} max={400} step={10}
                value={parseInt(size) || 120}
                onChange={(e) => setSize(e.target.value)}
                style={{ width: 120, cursor: 'pointer' }}
              />
            </div>
          </DlgField>
          <DlgField label="排序">
            <input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              style={{
                width: 70, padding: '3px 6px', fontSize: 12,
                border: '2px inset #aaa', background: '#fff',
                outline: 'none', fontFamily: FONT,
              }}
            />
            <span style={{ fontSize: 11, color: '#777', marginLeft: 6 }}>数字越小越靠前</span>
          </DlgField>

          {/* 编辑模式下显示 ID */}
          {mode === 'edit' && (
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8, fontFamily: 'Consolas, monospace' }}>
              ID: {initial.id}
            </div>
          )}

          {/* 错误提示 */}
          {errorMsg && (
            <div style={{
              background: '#fff4ce', border: '1px solid #e0a000',
              borderRadius: 2, padding: '5px 8px', marginBottom: 10,
              fontSize: 11, color: '#7a4900',
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <XpButton onClick={handleSubmit} disabled={isPending || !isValid} primary>
              {isPending
                ? (mode === 'add' ? '添加中…' : '保存中…')
                : (mode === 'add' ? '✚ 添加'  : '💾 保存修改')}
            </XpButton>
            <XpButton onClick={onClose} disabled={isPending}>取消</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 删除确认弹窗 ─────────────────────────────────────────────────────────────

function DeleteDialog({
  mascot, onCancel, onDeleted,
}: {
  mascot: Mascot; onCancel: () => void; onDeleted: () => void;
}) {
  const { mutate: del, isPending } = useMutation({
    ...trpc.settings.deleteMascot.mutationOptions(),
    onSuccess: () => { invalidateMascots(); onDeleted(); },
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, fontFamily: FONT,
    }}>
      <div style={{
        width: 360, border: '2px solid #00378a', borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            确认删除桌宠
          </span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <div style={{ background: '#3a3a4e', borderRadius: 4, padding: 8, flexShrink: 0 }}>
              <SrcPreview src={mascot.petSrc} size={48} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 4 }}>
                确定要删除这只桌宠吗？
              </div>
              <div style={{ fontSize: 12, color: '#444', marginBottom: 6 }}>
                {mascot.label || '（无名称）'} — {mascot.size}px
              </div>
              <div style={{ fontSize: 11, color: '#a00' }}>
                删除后该桌宠将从侧边栏消失，此操作无法撤销。
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <XpButton onClick={() => del({ id: mascot.id })} disabled={isPending} danger>
              {isPending ? '删除中…' : '删除'}
            </XpButton>
            <XpButton onClick={onCancel} disabled={isPending}>取消</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 空状态 ───────────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 0', color: '#888',
      border: '2px inset #aaa', background: '#fff',
    }}>
      <span style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }}>🐾</span>
      <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>还没有任何桌宠</div>
      <div style={{ fontSize: 11, marginBottom: 16 }}>添加你的第一只桌宠吧</div>
      <XpButton primary onClick={onAdd}>✚ 添加桌宠</XpButton>
    </div>
  );
}

// ─── 弹窗字段辅助组件 ─────────────────────────────────────────────────────────

function DlgField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: '#222', width: 96, flexShrink: 0 }}>{label}：</label>
      {children}
    </div>
  );
}

function DlgInput({
  value, onChange, placeholder,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1, padding: '3px 6px', fontSize: 12, fontFamily: FONT,
        border: '2px inset #aaa', background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

// ─── XP 风格按钮 ──────────────────────────────────────────────────────────────

function XpButton({
  children, onClick, disabled, primary, danger, small, style: extraStyle,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
  style?: React.CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);

  const bg = disabled
    ? '#d4d0c8'
    : pressed
      ? 'linear-gradient(180deg,#b8cce8 0%,#dce8f8 100%)'
      : danger
        ? 'linear-gradient(180deg,#fce8e8 0%,#f0c0c0 100%)'
        : primary
          ? 'linear-gradient(180deg,#dce8f8 0%,#b8d0f0 50%,#9ac0e8 100%)'
          : 'linear-gradient(180deg,#f0f4fc 0%,#dce8f8 40%,#c8daf0 100%)';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        height: small ? 20 : 24,
        padding: small ? '0 7px' : '0 12px',
        fontFamily: FONT, fontSize: small ? 11 : 12,
        cursor: disabled ? 'default' : 'pointer',
        border: '2px solid',
        borderColor: pressed
          ? '#003399 #a0b8e0 #a0b8e0 #003399'
          : danger
            ? '#a00000 #f0a0a0 #f0a0a0 #a00000'
            : '#a0b8e0 #003399 #003399 #a0b8e0',
        background: bg,
        color: disabled ? '#888' : danger ? '#8b0000' : '#000',
        boxShadow: pressed ? 'none' : '1px 1px 0 rgba(255,255,255,0.8) inset',
        outline: 'none',
        fontWeight: primary ? 'bold' : 'normal',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}
