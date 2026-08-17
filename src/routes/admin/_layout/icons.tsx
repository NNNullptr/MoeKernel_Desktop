import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { trpc, queryClient } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/icons')({
  component: IconsPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type Icon = {
  id:      string;
  label:   string;
  src:     string;
  order:   number;
  visible: boolean;
};

// 双缓存失效（管理列表 + 前台桌面）
function invalidateIcons() {
  queryClient.invalidateQueries({ queryKey: trpc.settings.listAllIcons.queryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: trpc.site.getDesktopIcons.queryOptions().queryKey });
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

function IconsPage() {
  const [deleteTarget, setDeleteTarget] = useState<Icon | null>(null);
  const [showAdd, setShowAdd]           = useState(false);

  const { data: icons = [], isPending } = useQuery({
    ...trpc.settings.listAllIcons.queryOptions(),
    staleTime: 0,
  });

  const visibleCount = icons.filter((i) => i.visible).length;

  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🖥️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
              桌面图标管理
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
              {isPending
                ? '加载中…'
                : `共 ${icons.length} 个图标，${visibleCount} 个可见，${icons.length - visibleCount} 个已隐藏`}
            </p>
          </div>
        </div>
        <XpButton primary onClick={() => setShowAdd(true)}>✚ 添加图标</XpButton>
      </div>

      {/* 提示 */}
      <div style={{
        background: '#f0f4ff', border: '1px solid #a0b8e0',
        borderRadius: 2, padding: '6px 10px', marginBottom: 12,
        fontSize: 11, color: '#224', lineHeight: 1.6,
      }}>
        💡 <strong>图标 ID</strong> 须与 <code style={{ background: '#e8eef8', padding: '0 3px' }}>APP_REGISTRY</code> 中的键名完全一致（如{' '}
        <code style={{ background: '#e8eef8', padding: '0 3px' }}>myComputer</code>、
        <code style={{ background: '#e8eef8', padding: '0 3px' }}>blog</code>），
        否则点击图标时无法打开对应窗口。直接勾选/取消 <strong>显示</strong> 复选框即时生效，
        修改名称/路径/排序后需点击「保存」。
      </div>

      {/* 表格 */}
      {isPending ? (
        <div style={{ color: '#555', fontSize: 12 }}>正在加载图标列表…</div>
      ) : icons.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <IconTable icons={icons} onDelete={setDeleteTarget} />
      )}

      {deleteTarget && (
        <DeleteDialog
          icon={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDeleted={() => setDeleteTarget(null)}
        />
      )}

      {showAdd && <AddDialog onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ─── 图标表格（含表头）────────────────────────────────────────────────────────

const GRID = '38px 44px 110px 1fr 1.6fr 54px 136px';

function IconTable({ icons, onDelete }: { icons: Icon[]; onDelete: (i: Icon) => void }) {
  return (
    <div style={{ border: '2px inset #aaa', background: '#fff', overflow: 'hidden' }}>
      {/* 表头 */}
      <div style={{
        display: 'grid', gridTemplateColumns: GRID,
        background: 'linear-gradient(180deg,#ddd 0%,#c8c8c8 100%)',
        borderBottom: '1px solid #aaa',
        userSelect: 'none',
      }}>
        {['显示', '预览', 'ID', '名称', '图标路径', '排序', '操作'].map((col) => (
          <div key={col} style={{
            padding: '3px 6px', fontSize: 11, fontWeight: 'bold',
            color: '#222', borderRight: '1px solid #bbb',
          }}>
            {col}
          </div>
        ))}
      </div>

      {/* 数据行 */}
      {icons.map((icon, idx) => (
        <IconRow key={icon.id} icon={icon} striped={idx % 2 === 1} onDelete={onDelete} />
      ))}
    </div>
  );
}

// ─── 单行（内联编辑）─────────────────────────────────────────────────────────

function IconRow({
  icon, striped, onDelete,
}: {
  icon: Icon; striped: boolean; onDelete: (i: Icon) => void;
}) {
  const [label, setLabel] = useState(icon.label);
  const [src,   setSrc]   = useState(icon.src);
  const [order, setOrder] = useState(String(icon.order));

  // 保存成功后缓存刷新，props 更新时同步本地草稿（仅在非保存中时同步，避免覆盖在途输入）
  const { mutate: save, isPending: isSaving } = useMutation({
    ...trpc.settings.updateIcon.mutationOptions(),
    onSuccess: invalidateIcons,
  });

  useEffect(() => {
    if (!isSaving) {
      setLabel(icon.label);
      setSrc(icon.src);
      setOrder(String(icon.order));
    }
  }, [icon.label, icon.src, icon.order, isSaving]);

  const parsedOrder = parseInt(order) || 0;
  const isDirty =
    label.trim() !== icon.label ||
    src.trim()   !== icon.src   ||
    parsedOrder  !== icon.order;

  const { mutate: toggleVis, isPending: isToggling } = useMutation({
    ...trpc.settings.updateIcon.mutationOptions(),
    onSuccess: invalidateIcons,
  });

  const rowBg = icon.visible ? (striped ? '#f0f0f0' : '#fff') : (striped ? '#f8f4f4' : '#fdf8f8');

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: GRID,
      background: rowBg, borderBottom: '1px solid #e8e8e8',
      opacity: icon.visible ? 1 : 0.72,
    }}>
      {/* 显示复选框（立即保存） */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
        <input
          type="checkbox"
          checked={icon.visible}
          onChange={() => toggleVis({ id: icon.id, visible: !icon.visible })}
          disabled={isToggling}
          title={icon.visible ? '点击隐藏' : '点击显示'}
          style={{ width: 14, height: 14, cursor: isToggling ? 'wait' : 'pointer' }}
        />
      </div>

      {/* 图标预览（实时反映 src 草稿值） */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
        <img
          src={src || icon.src}
          alt=""
          style={{ width: 28, height: 28, objectFit: 'contain', imageRendering: 'pixelated' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
        />
      </div>

      {/* ID（只读） */}
      <div style={{
        padding: '5px 6px', fontSize: 11, color: '#555', display: 'flex', alignItems: 'center',
        fontFamily: 'Consolas, "Courier New", monospace',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}
        title={icon.id}
      >
        {icon.id}
      </div>

      {/* 名称（可编辑） */}
      <div style={{ padding: '3px 5px', display: 'flex', alignItems: 'center' }}>
        <RowInput value={label} onChange={setLabel} placeholder="显示名称" />
      </div>

      {/* 图标路径（可编辑） */}
      <div style={{ padding: '3px 5px', display: 'flex', alignItems: 'center' }}>
        <RowInput value={src} onChange={setSrc} placeholder="图标路径或 URL" />
      </div>

      {/* 排序数字（可编辑） */}
      <div style={{ padding: '3px 5px', display: 'flex', alignItems: 'center' }}>
        <input
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{
            width: 44, padding: '3px 4px', fontSize: 12,
            border: '2px inset #aaa', background: '#fff',
            outline: 'none', fontFamily: FONT, boxSizing: 'border-box',
          }}
        />
      </div>

      {/* 操作按钮 */}
      <div style={{ padding: '3px 5px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <XpButton
          small
          primary
          disabled={!isDirty || isSaving || !label.trim() || !src.trim()}
          onClick={() => save({
            id: icon.id,
            label: label.trim(),
            src:   src.trim(),
            order: parsedOrder,
          })}
        >
          {isSaving ? '…' : '保存'}
        </XpButton>
        <XpButton small danger onClick={() => onDelete(icon)}>删除</XpButton>
      </div>
    </div>
  );
}

// ─── 空状态 ───────────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 0', color: '#888', border: '2px inset #aaa', background: '#fff',
    }}>
      <span style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }}>🖥️</span>
      <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 6 }}>桌面没有图标</div>
      <div style={{ fontSize: 11, marginBottom: 16 }}>还未添加任何桌面图标</div>
      <XpButton primary onClick={onAdd}>✚ 添加第一个图标</XpButton>
    </div>
  );
}

// ─── 删除确认弹窗 ─────────────────────────────────────────────────────────────

function DeleteDialog({
  icon, onCancel, onDeleted,
}: {
  icon: Icon; onCancel: () => void; onDeleted: () => void;
}) {
  const { mutate: del, isPending } = useMutation({
    ...trpc.settings.deleteIcon.mutationOptions(),
    onSuccess: () => { invalidateIcons(); onDeleted(); },
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
            确认删除
          </span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 6 }}>
                确定要删除这个桌面图标吗？
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fff', border: '1px solid #ccc',
                padding: '5px 8px', borderRadius: 2, marginBottom: 6,
              }}>
                <img src={icon.src} alt="" style={{ width: 20, height: 20, objectFit: 'contain', imageRendering: 'pixelated', flexShrink: 0 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
                />
                <span style={{ fontSize: 12, color: '#222' }}>{icon.label}</span>
                <code style={{ fontSize: 10, color: '#888', marginLeft: 'auto' }}>{icon.id}</code>
              </div>
              <div style={{ fontSize: 11, color: '#a00' }}>
                删除后桌面将不再显示该图标快捷方式（不影响应用本身）。
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <XpButton onClick={() => del({ id: icon.id })} disabled={isPending} danger>
              {isPending ? '删除中…' : '删除'}
            </XpButton>
            <XpButton onClick={onCancel} disabled={isPending}>取消</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 添加图标弹窗 ─────────────────────────────────────────────────────────────

function AddDialog({ onClose }: { onClose: () => void }) {
  const [id,      setId]      = useState('');
  const [label,   setLabel]   = useState('');
  const [src,     setSrc]     = useState('');
  const [visible, setVisible] = useState(true);
  const [errorMsg, setError]  = useState('');

  const isValid = id.trim() && label.trim() && src.trim();

  const { mutate: create, isPending } = useMutation({
    ...trpc.settings.createIcon.mutationOptions(),
    onSuccess: () => { invalidateIcons(); onClose(); },
    onError:   (err) => setError(err.message ?? '创建失败，请重试'),
  });

  const handleCreate = () => {
    if (!isValid) return;
    setError('');
    create({ id: id.trim(), label: label.trim(), src: src.trim(), visible });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, fontFamily: FONT,
    }}>
      <div style={{
        width: 420, border: '2px solid #00378a', borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden',
      }}>
        {/* 标题栏 */}
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            添加桌面图标
          </span>
        </div>

        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '16px 20px 14px' }}>

          {/* ID 说明 */}
          <div style={{
            background: '#fff8dc', border: '1px solid #c8a000',
            borderRadius: 2, padding: '5px 8px', marginBottom: 12,
            fontSize: 11, color: '#664400', lineHeight: 1.5,
          }}>
            ⚠️ ID 须与 APP_REGISTRY 键名一致，否则点击无法打开窗口。<br />
            常用 ID：<code>myComputer</code> · <code>blog</code> · <code>aboutme</code> · <code>contact</code> 等
          </div>

          <DlgField label="图标 ID *">
            <DlgInput
              value={id}
              onChange={setId}
              placeholder="如 myComputer / blog"
              mono
            />
          </DlgField>
          <DlgField label="显示名称 *">
            <DlgInput value={label} onChange={setLabel} placeholder="桌面上显示的名称" />
          </DlgField>
          <DlgField label="图标路径 *">
            <DlgInput value={src} onChange={setSrc} placeholder="/assets/icons/xxx.png 或完整 URL" />
          </DlgField>

          {/* 图标预览（实时） */}
          {src.trim() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, marginLeft: 90 }}>
              <img
                src={src.trim()} alt=""
                style={{ width: 32, height: 32, objectFit: 'contain', imageRendering: 'pixelated', border: '1px solid #ccc', background: '#fff', padding: 2 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
              />
              <span style={{ fontSize: 11, color: '#666' }}>图标预览</span>
            </div>
          )}

          <DlgField label="默认显示">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                style={{ width: 14, height: 14, cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12, color: '#333' }}>
                {visible ? '显示在桌面' : '默认隐藏'}
              </span>
            </div>
          </DlgField>

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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
            <XpButton onClick={handleCreate} disabled={isPending || !isValid} primary>
              {isPending ? '添加中…' : '✚ 添加'}
            </XpButton>
            <XpButton onClick={onClose} disabled={isPending}>取消</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 弹窗内字段组件 ──────────────────────────────────────────────────────────

function DlgField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: '#222', width: 82, flexShrink: 0 }}>{label}：</label>
      {children}
    </div>
  );
}

function DlgInput({
  value, onChange, placeholder, mono = false,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1, padding: '3px 6px', fontSize: 12,
        fontFamily: mono ? 'Consolas, "Courier New", monospace' : FONT,
        border: '2px inset #aaa', background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

// ─── 行内输入框（全宽自适应）─────────────────────────────────────────────────

function RowInput({
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
        width: '100%', padding: '2px 5px', fontSize: 11, fontFamily: FONT,
        border: '2px inset #aaa', background: '#fff', outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );
}

// ─── XP 风格按钮 ──────────────────────────────────────────────────────────────

function XpButton({
  children, onClick, disabled, primary, danger, small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
  small?: boolean;
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
      }}
    >
      {children}
    </button>
  );
}
