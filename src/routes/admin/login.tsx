import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { trpc } from '@/client/trpc';

export const Route = createFileRoute('/admin/login')({
  component: AdminLoginPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

const TITLE_BAR_GRADIENT =
  'linear-gradient(180deg, #2e7bd4 0%, #1a5fb4 40%, #1e4fa0 60%, #2466c4 100%)';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate: login, isPending } = useMutation({
    ...trpc.auth.login.mutationOptions(),
    onSuccess: () => {
      // Phase 3.2 完成后 /admin 会成为合法路由；此处先用 string cast 规避类型检查
      navigate({ to: '/admin' as string });
    },
    onError: (err) => {
      setErrorMsg(err.message ?? '登录失败，请重试。');
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!password.trim()) return;
      setErrorMsg('');
      login({ password });
    },
    [login, password],
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #003a7a 0%, #1a5fb4 50%, #0a2a5e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      {/* Dialog window */}
      <div
        style={{
          width: 340,
          borderRadius: 4,
          border: '2px solid #00378a',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: TITLE_BAR_GRADIENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 6px',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <img
              src="/favicon.png"
              alt=""
              style={{ width: 14, height: 14, imageRendering: 'pixelated' }}
            />
            <span
              style={{
                color: '#fff',
                fontSize: 12,
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
              }}
            >
              Administrator Login
            </span>
          </div>

          {/* Close button (decorative) */}
          <div
            style={{
              width: 16,
              height: 14,
              background: 'linear-gradient(180deg, #e05050 0%, #c02020 100%)',
              border: '1px solid #800000',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 9,
              fontWeight: 'bold',
              cursor: 'default',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            ✕
          </div>
        </div>

        {/* Content area */}
        <div
          style={{
            background: '#ece9d8',
            padding: '18px 20px 16px',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #2e7bd4, #1a3a8a)',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
                border: '1px solid #1a5fb4',
              }}
            >
              🔐
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003399', marginBottom: 2 }}>
                管理员登录
              </div>
              <div style={{ fontSize: 11, color: '#555' }}>
                请输入管理员密码以继续
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label
                htmlFor="admin-password"
                style={{ display: 'block', fontSize: 12, color: '#222', marginBottom: 4 }}
              >
                密码：
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '3px 6px',
                  fontSize: 13,
                  border: '2px inset #aaa',
                  background: '#fff',
                  fontFamily: FONT,
                  outline: 'none',
                }}
              />
            </div>

            {/* Error message */}
            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  background: '#fff4ce',
                  border: '1px solid #e0a000',
                  borderRadius: 2,
                  padding: '6px 8px',
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>⚠️</span>
                <span style={{ fontSize: 11, color: '#7a4900', lineHeight: 1.4 }}>{errorMsg}</span>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <XpButton type="submit" disabled={isPending}>
                {isPending ? '登录中…' : '确定'}
              </XpButton>
              <XpButton
                type="button"
                onClick={() => {
                  setPassword('');
                  setErrorMsg('');
                }}
                disabled={isPending}
              >
                清除
              </XpButton>
            </div>
          </form>
        </div>
      </div>

      {/* Footer hint */}
      <div
        style={{
          marginTop: 16,
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          fontFamily: FONT,
        }}
      >
        MoeKernel Administrator Console
      </div>
    </div>
  );
}

/** WinXP 风格按钮 */
function XpButton({
  children,
  type = 'button',
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        minWidth: 72,
        height: 23,
        padding: '0 10px',
        fontFamily: FONT,
        fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        border: '2px solid',
        borderColor: pressed ? '#003399 #a0b8e0 #a0b8e0 #003399' : '#a0b8e0 #003399 #003399 #a0b8e0',
        background: disabled
          ? '#d4d0c8'
          : pressed
            ? 'linear-gradient(180deg, #b8cce8 0%, #dce8f8 100%)'
            : 'linear-gradient(180deg, #f0f4fc 0%, #dce8f8 40%, #c8daf0 100%)',
        color: disabled ? '#888' : '#000',
        boxShadow: pressed ? 'none' : '1px 1px 0 rgba(255,255,255,0.8) inset',
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
}
