import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/client/trpc';
import { useSiteSettings } from '@/client/hooks/use-site-config';

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

// ── 类型定义 ─────────────────────────────────────────────────────────────────

type ChatMsg = {
  id: string;
  name: string;
  content: string;
  isPinned: boolean;
  createdAt: Date | null;
};

// ── 工具函数 ─────────────────────────────────────────────────────────────────

function formatDate(d: Date | null): string {
  if (!d) return '';
  return new Date(d).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── 子组件：单条留言气泡 ─────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMsg }) {
  return (
    <div
      style={{
        position: 'relative',
        background: msg.isPinned ? '#fffbe6' : '#ffffff',
        border: `1px solid ${msg.isPinned ? '#f0c040' : '#d4d0c8'}`,
        borderRadius: '3px',
        padding: '7px 10px 7px 10px',
        marginBottom: '5px',
      }}
    >
      {msg.isPinned && (
        <span
          style={{
            position: 'absolute',
            top: '5px',
            right: '8px',
            fontSize: '10px',
            color: '#b8820a',
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: '#fef3b0',
            padding: '1px 5px',
            borderRadius: '2px',
            border: '1px solid #f0c040',
          }}
        >
          📌 置顶
        </span>
      )}

      {/* 昵称 + 时间 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px',
          marginBottom: '4px',
          paddingRight: msg.isPinned ? '52px' : '0',
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '12px',
            color: '#003c7e',
            fontFamily: FONT,
          }}
        >
          {msg.name}
        </span>
        <span style={{ fontSize: '10px', color: '#999', fontFamily: FONT }}>
          {formatDate(msg.createdAt)}
        </span>
      </div>

      {/* 留言内容 */}
      <div
        style={{
          fontSize: '12px',
          color: '#1a1a1a',
          fontFamily: FONT,
          lineHeight: '1.55',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

// ── 子组件：背景设置浮层 ─────────────────────────────────────────────────────

interface BgPanelProps {
  bgUrlInput: string;
  setBgUrlInput: (v: string) => void;
  bgOpacity: number;
  setBgOpacity: (v: number) => void;
  hasBg: boolean;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

function BgPanel({
  bgUrlInput,
  setBgUrlInput,
  bgOpacity,
  setBgOpacity,
  hasBg,
  onApply,
  onClear,
  onClose,
}: BgPanelProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '58px',
        right: '6px',
        zIndex: 20,
        background: '#ece9d8',
        border: '2px solid #aca899',
        padding: '10px 12px',
        width: '230px',
        boxShadow: '3px 3px 6px rgba(0,0,0,0.25)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#000' }}>
          背景图片设置
        </span>
        <button
          onClick={onClose}
          style={{
            fontSize: '11px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#555',
            padding: '0 2px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: '11px', marginBottom: '3px', color: '#000' }}>图片 URL：</div>
      <input
        value={bgUrlInput}
        onChange={(e) => setBgUrlInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onApply()}
        placeholder="粘贴图片链接后回车"
        style={{
          width: '100%',
          fontSize: '11px',
          padding: '2px 5px',
          border: '1px solid #7f9db9',
          fontFamily: FONT,
          boxSizing: 'border-box',
          marginBottom: '6px',
        }}
      />

      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
        <button
          onClick={onApply}
          style={{
            flex: 1,
            fontSize: '11px',
            padding: '2px 0',
            fontFamily: FONT,
            background: 'linear-gradient(to bottom, #f4f4f0, #dbd9d0)',
            border: '1px solid #aca899',
            cursor: 'pointer',
          }}
        >
          应用
        </button>
        {hasBg && (
          <button
            onClick={onClear}
            style={{
              flex: 1,
              fontSize: '11px',
              padding: '2px 0',
              fontFamily: FONT,
              background: 'linear-gradient(to bottom, #f4f4f0, #dbd9d0)',
              border: '1px solid #aca899',
              cursor: 'pointer',
            }}
          >
            清除
          </button>
        )}
      </div>

      <div style={{ fontSize: '11px', marginBottom: '3px', color: '#000' }}>
        背景透明度：{Math.round(bgOpacity * 100)}%
      </div>
      <input
        type="range"
        min={5}
        max={100}
        value={Math.round(bgOpacity * 100)}
        onChange={(e) => setBgOpacity(parseInt(e.target.value, 10) / 100)}
        style={{ width: '100%' }}
      />
    </div>
  );
}

// ── 主组件 ───────────────────────────────────────────────────────────────────

export function ChatBoxApp() {
  // 发送表单
  const [name, setName]       = useState('');
  const [content, setContent] = useState('');

  // 限流倒计时
  const [rateLimitSec, setRateLimitSec] = useState(0);

  // 背景设置（初始值来自站点设置，用户可临时覆盖）
  const [bgUrl, setBgUrl]             = useState('');
  const [bgUrlInput, setBgUrlInput]   = useState('');
  const [bgOpacity, setBgOpacity]     = useState(0.15);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [bgInitialized, setBgInitialized] = useState(false);

  const listRef     = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 从站点设置读取默认背景（API 加载完成后初始化一次，用户之后可临时覆盖）
  const { isLoaded: settingsLoaded, chatboxBgUrl, chatboxBgOpacity } = useSiteSettings();

  useEffect(() => {
    if (settingsLoaded && !bgInitialized) {
      setBgUrl(chatboxBgUrl);
      setBgUrlInput(chatboxBgUrl);
      setBgOpacity(chatboxBgOpacity);
      setBgInitialized(true);
    }
  }, [settingsLoaded, chatboxBgUrl, chatboxBgOpacity, bgInitialized]);

  // ── 数据查询 ──────────────────────────────────────────────────────────────

  const queryKey = trpc.chatbox.listMessages.queryOptions({ limit: 50 }).queryKey;

  const { data, isLoading } = useQuery({
    ...trpc.chatbox.listMessages.queryOptions({ limit: 50 }),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  // ── 发送 Mutation ─────────────────────────────────────────────────────────

  const mutation = useMutation(
    trpc.chatbox.createMessage.mutationOptions({
      onSuccess: () => {
        setContent('');
        void queryClient.invalidateQueries({ queryKey });
        // 发送成功后滚动到顶部（最新消息在最上方）
        requestAnimationFrame(() => {
          if (listRef.current) listRef.current.scrollTop = 0;
        });
      },
      onError: (err) => {
        // 提取服务端返回的剩余等待秒数
        const match = err.message.match(/(\d+)\s*秒/);
        setRateLimitSec(match?.[1] !== undefined ? parseInt(match[1], 10) : 60);
      },
    }),
  );

  // ── 限流倒计时 ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (rateLimitSec <= 0) return;
    const id = setTimeout(() => setRateLimitSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [rateLimitSec]);

  // ── 事件处理 ──────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || mutation.isPending || rateLimitSec > 0) return;
    mutation.mutate({ name: name.trim(), content: content.trim() });
  };

  const applyBg = () => {
    setBgUrl(bgUrlInput.trim());
    setShowBgPanel(false);
  };

  const clearBg = () => {
    setBgUrl('');
    setBgUrlInput('');
  };

  // ── 消息列表合并（置顶在前） ──────────────────────────────────────────────

  const pinned  = data?.pinned ?? [];
  const regular = data?.items  ?? [];
  const allMessages: ChatMsg[] = [...pinned, ...regular];

  const isSendDisabled =
    mutation.isPending || !name.trim() || !content.trim() || rateLimitSec > 0;

  // ── 渲染 ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        fontFamily: FONT,
        overflow: 'hidden',
        background: '#f0ede8',
      }}
    >
      {/* ── 背景图层 ── */}
      {bgUrl && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── 工具栏 ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
          background: '#ece9d8',
          borderBottom: '2px solid #aca899',
        }}
      >
        {/* 菜单栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            padding: '2px 4px',
            borderBottom: '1px solid #d4d0c8',
          }}
        >
          {['文件(F)', '编辑(E)', '查看(V)', '帮助(H)'].map((m) => (
            <span
              key={m}
              style={{
                padding: '1px 6px',
                fontSize: '11px',
                cursor: 'default',
                color: '#000',
                userSelect: 'none',
              }}
            >
              {m}
            </span>
          ))}
          <div style={{ flex: 1 }} />
          {/* 背景按钮 */}
          <button
            onClick={() => setShowBgPanel((v) => !v)}
            style={{
              padding: '1px 8px',
              fontSize: '11px',
              fontFamily: FONT,
              background: showBgPanel
                ? 'linear-gradient(to bottom, #dbd9d0, #c8c6bc)'
                : 'linear-gradient(to bottom, #f4f4f0, #dbd9d0)',
              border: '1px solid #aca899',
              cursor: 'pointer',
              borderRadius: '2px',
              color: '#000',
            }}
          >
            🎨 背景
          </button>
        </div>

        {/* 地址栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '2px 6px',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '11px', color: '#444', whiteSpace: 'nowrap' }}>
            地址(D)
          </span>
          <div
            style={{
              flex: 1,
              background: '#fff',
              border: '1px solid #7f9db9',
              padding: '1px 6px',
              fontSize: '11px',
              color: '#5a5a5a',
            }}
          >
            💬 留言板 / ChatBox
          </div>
        </div>
      </div>

      {/* ── 背景设置浮层 ── */}
      {showBgPanel && (
        <BgPanel
          bgUrlInput={bgUrlInput}
          setBgUrlInput={setBgUrlInput}
          bgOpacity={bgOpacity}
          setBgOpacity={setBgOpacity}
          hasBg={!!bgUrl}
          onApply={applyBg}
          onClear={clearBg}
          onClose={() => setShowBgPanel(false)}
        />
      )}

      {/* ── 留言列表 ── */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 10px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {isLoading && (
          <div
            style={{
              textAlign: 'center',
              padding: '28px 0',
              fontSize: '12px',
              color: '#666',
            }}
          >
            正在连接留言板...
          </div>
        )}

        {!isLoading && allMessages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '36px 20px',
              fontSize: '12px',
              color: '#888',
              lineHeight: '2',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>💬</div>
            还没有留言，来第一个吧！
          </div>
        )}

        {allMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* 分页提示（有更多时显示） */}
        {data?.nextCursor && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#888',
              padding: '6px 0',
            }}
          >
            ── 仅显示最新 50 条留言 ──
          </div>
        )}
      </div>

      {/* ── 限流警告条 ── */}
      {rateLimitSec > 0 && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            flexShrink: 0,
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderLeft: '4px solid #ffc107',
            margin: '0 8px 4px',
            padding: '5px 10px',
            borderRadius: '2px',
            fontSize: '11px',
            color: '#856404',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>⚠️</span>
          <span>
            请休息一会再留言（剩余{' '}
            <strong>{rateLimitSec}</strong> 秒）
          </span>
        </div>
      )}

      {/* ── 发送表单 ── */}
      <div
        style={{
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
          background: '#ece9d8',
          borderTop: '2px solid #aca899',
          padding: '7px 10px 8px',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* 昵称行 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '5px',
            }}
          >
            <label
              style={{
                fontSize: '11px',
                color: '#000',
                whiteSpace: 'nowrap',
                minWidth: '36px',
              }}
            >
              昵称：
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="你的昵称（最多 20 字）"
              style={{
                flex: 1,
                fontSize: '11px',
                padding: '2px 5px',
                border: '1px solid #7f9db9',
                fontFamily: FONT,
                outline: 'none',
              }}
            />
          </div>

          {/* 内容行 + 发送按钮 */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                placeholder="留言内容（最多 500 字）"
                rows={2}
                style={{
                  width: '100%',
                  fontSize: '11px',
                  padding: '3px 5px',
                  border: '1px solid #7f9db9',
                  fontFamily: FONT,
                  resize: 'none',
                  lineHeight: '1.45',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              {/* 字数计数 */}
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '10px',
                  color: content.length > 450 ? '#c0392b' : '#999',
                  marginTop: '1px',
                }}
              >
                {content.length} / 500
              </div>
            </div>

            {/* 发送按钮 */}
            <button
              type="submit"
              disabled={isSendDisabled}
              style={{
                padding: '0 14px',
                height: '42px',
                marginBottom: '18px',
                fontSize: '11px',
                fontFamily: FONT,
                background: isSendDisabled
                  ? '#d4d0c8'
                  : 'linear-gradient(to bottom, #f4f4f0, #dbd9d0)',
                border: '2px outset #d4d0c8',
                cursor: isSendDisabled ? 'not-allowed' : 'pointer',
                color: isSendDisabled ? '#888' : '#000',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {mutation.isPending ? '发送中...' : '发  送'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
