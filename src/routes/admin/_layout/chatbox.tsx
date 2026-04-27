import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/chatbox')({
  component: ChatboxAdminPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type Msg = {
  id: string;
  name: string;
  content: string;
  isPinned: boolean;
  createdAt: Date | null;
};

function formatDate(d: Date | null): string {
  if (!d) return '';
  return new Date(d).toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function ChatboxAdminPage() {
  const qc = useQueryClient();

  const [bgUrl,       setBgUrl]       = useState('');
  const [bgOpacity,   setBgOpacity]   = useState(0.15);
  const [initialized, setInitialized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg,    setErrorMsg]    = useState('');

  const msgQueryKey = trpc.chatbox.listMessages.queryOptions({ limit: 100 }).queryKey;

  // ── 留言列表 ────────────────────────────────────────────────────────────────
  const { data, isLoading: msgLoading } = useQuery({
    ...trpc.chatbox.listMessages.queryOptions({ limit: 100 }),
    staleTime: 0,
  });

  // ── 站点设置（读取外观初始值）──────────────────────────────────────────────
  const { data: settings } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  useEffect(() => {
    if (settings && !initialized) {
      setBgUrl(settings['chatbox_bg_url'] ?? '');
      const raw = settings['chatbox_bg_opacity'];
      setBgOpacity(raw ? parseFloat(raw) : 0.15);
      setInitialized(true);
    }
  }, [settings, initialized]);

  // ── 删除留言 ────────────────────────────────────────────────────────────────
  const { mutate: deleteMsg } = useMutation(
    trpc.chatbox.deleteMessage.mutationOptions({
      onSuccess: () => { void qc.invalidateQueries({ queryKey: msgQueryKey }); },
    }),
  );

  // ── 切换置顶 ────────────────────────────────────────────────────────────────
  const { mutate: togglePin } = useMutation(
    trpc.chatbox.togglePin.mutationOptions({
      onSuccess: () => { void qc.invalidateQueries({ queryKey: msgQueryKey }); },
    }),
  );

  // ── 保存外观 ────────────────────────────────────────────────────────────────
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

  const handleSave = useCallback(() => {
    saveAppearance({
      chatbox_bg_url:     bgUrl.trim(),
      chatbox_bg_opacity: String(bgOpacity),
    });
  }, [saveAppearance, bgUrl, bgOpacity]);

  const allMessages: Msg[] = [...(data?.pinned ?? []), ...(data?.items ?? [])];

  // ── 渲染 ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT, position: 'relative' }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid #2060b8',
        paddingBottom: 10, marginBottom: 18,
      }}>
        <span style={{ fontSize: 28 }}>💬</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
            ChatBox 留言板管理
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            管理访客留言、设置置顶，并配置留言板全局默认背景
          </p>
        </div>
      </div>

      {/* ── 留言管理 ── */}
      <Section title="📋  留言管理">
        {msgLoading ? (
          <div style={{ fontSize: 12, color: '#666', padding: '8px 0' }}>加载中…</div>
        ) : allMessages.length === 0 ? (
          <div style={{ fontSize: 12, color: '#888', padding: '8px 0' }}>暂无留言</div>
        ) : (
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {allMessages.map((msg) => (
              <MessageRow
                key={msg.id}
                msg={msg}
                onDelete={() => deleteMsg({ id: msg.id })}
                onTogglePin={() => togglePin({ id: msg.id })}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── 外观设置 ── */}
      <Section title="🎨  外观设置（全局默认背景）">
        <p style={{ margin: '0 0 10px', fontSize: 11, color: '#555' }}>
          保存后前台 ChatBox 窗口打开时默认显示此背景。用户仍可通过「🎨 背景」按钮临时覆盖。
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
                  示例留言气泡
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
          <XpButton onClick={handleSave} disabled={isSaving} primary>
            {isSaving ? '保存中…' : '💾  保存外观'}
          </XpButton>
        </div>
      </Section>

      {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

// ─── MessageRow ───────────────────────────────────────────────────────────────

function MessageRow({
  msg, onDelete, onTogglePin,
}: {
  msg: Msg;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start',
      padding: '7px 8px',
      background: msg.isPinned ? '#fffbe6' : '#fff',
      border: `1px solid ${msg.isPinned ? '#f0c040' : '#d4d0c8'}`,
      borderRadius: 2, marginBottom: 5,
    }}>
      {msg.isPinned && (
        <span style={{ fontSize: 12, flexShrink: 0, marginTop: 2 }}>📌</span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 'bold', color: '#003c7e', fontFamily: FONT }}>
            {msg.name}
          </span>
          <span style={{ fontSize: 10, color: '#999' }}>{formatDate(msg.createdAt)}</span>
        </div>
        <div style={{
          fontSize: 11, color: '#333', fontFamily: FONT,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5,
        }}>
          {msg.content}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
        <ActionBtn onClick={onTogglePin}>
          {msg.isPinned ? '📌取消' : '📌置顶'}
        </ActionBtn>
        {confirmDelete ? (
          <>
            <ActionBtn onClick={() => { onDelete(); setConfirmDelete(false); }} danger>
              确认删除
            </ActionBtn>
            <ActionBtn onClick={() => setConfirmDelete(false)}>取消</ActionBtn>
          </>
        ) : (
          <ActionBtn onClick={() => setConfirmDelete(true)} danger>🗑️删除</ActionBtn>
        )}
      </div>
    </div>
  );
}

// ─── 辅助组件 ─────────────────────────────────────────────────────────────────

function ActionBtn({
  children, onClick, danger,
}: {
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
            ChatBox 管理
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
                重新打开 ChatBox 窗口即可看到效果。
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
