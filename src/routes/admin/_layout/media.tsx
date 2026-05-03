import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/media')({
  component: MediaAdminPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type TrackType = 'audio' | 'video' | 'bilibili';

type MediaTrack = {
  id: string;
  title: string;
  artist: string;
  src: string;
  bvid: string | null;
  cover: string;
  type: TrackType;
  order: number;
  visible: boolean;
};

type TrackForm = Omit<MediaTrack, 'id'>;

const EMPTY_FORM: TrackForm = {
  title: '',
  artist: '',
  src: '',
  bvid: '',
  cover: '',
  type: 'audio',
  order: 0,
  visible: true,
};

const TYPE_LABELS: Record<TrackType, string> = {
  audio:    '🎵 音频 (Winamp)',
  video:    '🎬 视频 MP4 (Media Player)',
  bilibili: '📺 B站视频 (Media Player)',
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function MediaAdminPage() {
  const qc = useQueryClient();

  // ── Winamp 外观 state ──────────────────────────────────────────────────────
  const [bgUrl,       setBgUrl]       = useState('');
  const [bgOpacity,   setBgOpacity]   = useState(0.3);
  const [bgInit,      setBgInit]      = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg,    setErrorMsg]    = useState('');

  // ── 编辑器 state ───────────────────────────────────────────────────────────
  const [editId,       setEditId]       = useState<string | null>(null);
  const [form,         setForm]         = useState<TrackForm>(EMPTY_FORM);
  const [showEditor,   setShowEditor]   = useState(false);
  const [confirmDelId, setConfirmDelId] = useState<string | null>(null);
  const [filterType,   setFilterType]   = useState<TrackType | 'all'>('all');

  const listQueryKey = trpc.media.listAll.queryOptions().queryKey;

  // ── 数据加载 ───────────────────────────────────────────────────────────────
  const { data: tracks = [], isLoading } = useQuery({
    ...trpc.media.listAll.queryOptions(),
    staleTime: 0,
  });

  const { data: settings } = useQuery({
    ...trpc.settings.get.queryOptions(),
    staleTime: 0,
  });

  useEffect(() => {
    if (settings && !bgInit) {
      setBgUrl(settings['winamp_bg_url'] ?? '');
      const raw = settings['winamp_bg_opacity'];
      setBgOpacity(raw ? parseFloat(raw) : 0.3);
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
      winamp_bg_url:     bgUrl.trim(),
      winamp_bg_opacity: String(bgOpacity),
    });
  }, [saveAppearance, bgUrl, bgOpacity]);

  // ── CRUD mutations ─────────────────────────────────────────────────────────
  const { mutate: createTrack } = useMutation(
    trpc.media.create.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: listQueryKey });
        closeEditor();
      },
    }),
  );

  const { mutate: updateTrack } = useMutation(
    trpc.media.update.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: listQueryKey });
        closeEditor();
      },
    }),
  );

  const { mutate: deleteTrack } = useMutation(
    trpc.media.delete.mutationOptions({
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: listQueryKey });
        setConfirmDelId(null);
      },
    }),
  );

  // ── 编辑器开关 ─────────────────────────────────────────────────────────────
  function openCreate(defaultType: TrackType = 'audio') {
    setEditId(null);
    setForm({ ...EMPTY_FORM, type: defaultType });
    setShowEditor(true);
  }

  function openEdit(track: MediaTrack) {
    setEditId(track.id);
    setForm({
      title:   track.title,
      artist:  track.artist,
      src:     track.src,
      bvid:    track.bvid ?? '',
      cover:   track.cover,
      type:    track.type,
      order:   track.order,
      visible: track.visible,
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
      bvid: form.bvid?.trim() || undefined,
    };
    if (editId) {
      updateTrack({ id: editId, ...payload });
    } else {
      createTrack(payload);
    }
  }

  function setField<K extends keyof TrackForm>(key: K, val: TrackForm[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  // ── 过滤后的列表 ────────────────────────────────────────────────────────────
  const filteredTracks = filterType === 'all'
    ? tracks
    : tracks.filter((t) => t.type === filterType);

  const audioCount    = tracks.filter((t) => t.type === 'audio').length;
  const videoCount    = tracks.filter((t) => t.type === 'video').length;
  const bilibiliCount = tracks.filter((t) => t.type === 'bilibili').length;

  // ── 渲染 ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT, position: 'relative' }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '2px solid #2060b8',
        paddingBottom: 10, marginBottom: 18,
      }}>
        <span style={{ fontSize: 28 }}>🎵</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
            媒体库管理
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
            管理 Winamp 音频与 Media Player 视频曲目，并配置 Winamp 默认背景
          </p>
        </div>
      </div>

      {/* ── 曲目管理 ── */}
      <Section title="📋  曲目管理">
        {/* 工具栏：类型过滤 + 新增按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          {/* 类型 Tab 过滤 */}
          <div style={{ display: 'flex', gap: 4 }}>
            {([
              ['all',      `全部 (${tracks.length})`         ],
              ['audio',    `🎵 音频 (${audioCount})`         ],
              ['video',    `🎬 视频 (${videoCount})`         ],
              ['bilibili', `📺 B站 (${bilibiliCount})`       ],
            ] as [TrackType | 'all', string][]).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '2px 10px', fontSize: 11, fontFamily: FONT,
                  background: filterType === type
                    ? 'linear-gradient(to bottom, #c8daf0, #a8c0e8)'
                    : 'linear-gradient(to bottom, #f4f4f0, #dbd9d0)',
                  border: `1px solid ${filterType === type ? '#6090c8' : '#aca899'}`,
                  borderRadius: 2, cursor: 'pointer',
                  color: filterType === type ? '#003399' : '#333',
                  fontWeight: filterType === type ? 'bold' : 'normal',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 新增按钮组 */}
          <div style={{ display: 'flex', gap: 6 }}>
            <XpButton onClick={() => openCreate('audio')}>🎵 新增音频</XpButton>
            <XpButton onClick={() => openCreate('video')}>🎬 新增视频</XpButton>
            <XpButton onClick={() => openCreate('bilibili')}>📺 新增B站</XpButton>
          </div>
        </div>

        {/* 曲目表格 */}
        {isLoading ? (
          <div style={{ fontSize: 12, color: '#666', padding: '8px 0' }}>加载中…</div>
        ) : filteredTracks.length === 0 ? (
          <div style={{ fontSize: 12, color: '#888', padding: '8px 0' }}>
            暂无曲目。点击上方按钮添加。
          </div>
        ) : (
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {/* 表头 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '24px 80px 1fr 120px 60px 60px 80px',
              gap: 6, padding: '4px 8px',
              background: '#d4d0c8', borderRadius: 2,
              fontSize: 11, fontWeight: 'bold', color: '#333',
              marginBottom: 2,
            }}>
              <span>#</span>
              <span>类型</span>
              <span>标题 / 来源</span>
              <span>艺术家</span>
              <span>排序</span>
              <span>可见</span>
              <span>操作</span>
            </div>

            {filteredTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track as MediaTrack}
                index={idx + 1}
                confirmingDelete={confirmDelId === track.id}
                onEdit={() => openEdit(track as MediaTrack)}
                onDeleteRequest={() => setConfirmDelId(track.id)}
                onDeleteConfirm={() => deleteTrack({ id: track.id })}
                onDeleteCancel={() => setConfirmDelId(null)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── Winamp 外观设置 ── */}
      <Section title="🎨  Winamp 外观设置（全局默认背景）">
        <p style={{ margin: '0 0 10px', fontSize: 11, color: '#555' }}>
          保存后前台 Winamp 播放器打开时默认显示此背景。
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
              border: '2px inset #888', background: '#fff',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: bgOpacity,
              }} />
              <div style={{
                position: 'relative', zIndex: 1, padding: '10px',
                color: '#464646', fontSize: 12, fontWeight: 'bold',
              }}>
                🎵 示例歌曲名
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

// ─── TrackRow ─────────────────────────────────────────────────────────────────

function TrackRow({
  track, index, confirmingDelete,
  onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}: {
  track: MediaTrack;
  index: number;
  confirmingDelete: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  const typeBadge: Record<TrackType, { label: string; bg: string; color: string }> = {
    audio:    { label: '🎵 音频',   bg: '#e8f4e8', color: '#1a6a1a' },
    video:    { label: '🎬 视频',   bg: '#e8eef8', color: '#1a3a8a' },
    bilibili: { label: '📺 B站',    bg: '#fce8e8', color: '#8a1a1a' },
  };
  const badge = typeBadge[track.type];

  const sourceHint = track.type === 'bilibili'
    ? (track.bvid || '—')
    : (track.src ? track.src.split('/').at(-1) ?? track.src : '—');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '24px 80px 1fr 120px 60px 60px 80px',
      gap: 6, alignItems: 'center',
      padding: '5px 8px',
      background: track.visible ? '#fff' : '#f5f5f5',
      border: `1px solid ${track.visible ? '#d4d0c8' : '#b8b8b8'}`,
      borderRadius: 2, marginBottom: 3,
    }}>
      {/* 序号 */}
      <span style={{ fontSize: 11, color: '#999' }}>{index}</span>

      {/* 类型徽章 */}
      <span style={{
        fontSize: 10, padding: '1px 5px', borderRadius: 2,
        background: badge.bg, color: badge.color, border: `1px solid ${badge.color}44`,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {badge.label}
      </span>

      {/* 标题 + 来源 */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 'bold', color: '#003c7e',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {track.title}
        </div>
        <div style={{
          fontSize: 10, color: '#888',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {sourceHint}
        </div>
      </div>

      {/* 艺术家 */}
      <span style={{
        fontSize: 11, color: '#555',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {track.artist || '—'}
      </span>

      {/* 排序 */}
      <span style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>{track.order}</span>

      {/* 可见 */}
      <span style={{ fontSize: 14, textAlign: 'center' }}>
        {track.visible ? '✅' : '🚫'}
      </span>

      {/* 操作 */}
      <div style={{ display: 'flex', gap: 3 }}>
        <ActionBtn onClick={onEdit}>✏️</ActionBtn>
        {confirmingDelete ? (
          <>
            <ActionBtn onClick={onDeleteConfirm} danger>✓</ActionBtn>
            <ActionBtn onClick={onDeleteCancel}>✕</ActionBtn>
          </>
        ) : (
          <ActionBtn onClick={onDeleteRequest} danger>🗑️</ActionBtn>
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
  form: TrackForm;
  setField: <K extends keyof TrackForm>(key: K, val: TrackForm[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const isBilibili = form.type === 'bilibili';
  const isAudio    = form.type === 'audio';

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
            {editId ? '编辑曲目' : '新增曲目'}
          </span>
        </div>

        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '14px 18px' }}>
          {/* 类型选择 */}
          <EditorField label="类型">
            <div style={{ display: 'flex', gap: 8 }}>
              {(['audio', 'video', 'bilibili'] as TrackType[]).map((t) => (
                <label key={t} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, cursor: 'pointer',
                }}>
                  <input
                    type="radio"
                    name="track-type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => setField('type', t)}
                  />
                  {t === 'audio' ? '🎵 音频' : t === 'video' ? '🎬 视频 MP4' : '📺 B站视频'}
                </label>
              ))}
            </div>
          </EditorField>

          <EditorField label="标题 *">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              style={inputStyle}
              placeholder="曲目名称"
            />
          </EditorField>

          {/* 音频：显示艺术家 */}
          {isAudio && (
            <EditorField label="艺术家">
              <input
                type="text"
                value={form.artist}
                onChange={(e) => setField('artist', e.target.value)}
                style={inputStyle}
                placeholder="歌手 / 演奏者名称"
              />
            </EditorField>
          )}

          {/* 音频/视频 MP4：显示 src */}
          {!isBilibili && (
            <EditorField label={isAudio ? '音频 URL' : '视频 URL'}>
              <input
                type="text"
                value={form.src}
                onChange={(e) => setField('src', e.target.value)}
                style={inputStyle}
                placeholder={isAudio
                  ? '/assets/tracks/song.mp3 或 https://...'
                  : '/assets/video/clip.mp4 或 https://...'}
              />
            </EditorField>
          )}

          {/* B站：显示 BV 号 */}
          {isBilibili && (
            <EditorField label="BV 号">
              <input
                type="text"
                value={form.bvid ?? ''}
                onChange={(e) => setField('bvid', e.target.value)}
                style={inputStyle}
                placeholder="BV1xxxxxxxxx（从 B站视频页 URL 获取）"
              />
            </EditorField>
          )}

          <EditorField label="封面 URL">
            <input
              type="text"
              value={form.cover}
              onChange={(e) => setField('cover', e.target.value)}
              style={inputStyle}
              placeholder="/assets/covers/cover.jpg 或 https://...（可留空）"
            />
          </EditorField>

          {/* 排序 + 可见 */}
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

          {/* 来源提示 */}
          {isBilibili && (
            <div style={{
              fontSize: 10, color: '#666', background: '#f0eee8',
              border: '1px solid #d0ccc0', borderRadius: 2, padding: '4px 8px',
              marginBottom: 10,
            }}>
              💡 B站模式下，Play/Pause/快进/快退按钮将置灰（浏览器跨域限制），用户直接点击画面控制。
            </div>
          )}

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
        padding: '2px 6px', fontSize: 11, fontFamily: FONT,
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
            媒体库管理
          </span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 4 }}>
                Winamp 外观已保存
              </div>
              <div style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
                背景设置已写入数据库。<br />
                重新打开 Winamp 窗口即可看到效果。
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
