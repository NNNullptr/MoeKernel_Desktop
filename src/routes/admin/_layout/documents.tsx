import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { trpc, queryClient } from '@/client/trpc';

import '@uiw/react-md-editor/markdown-editor.css';

const MDEditor = lazy(() =>
  import('@uiw/react-md-editor').then((m) => ({ default: m.default })),
);

export const Route = createFileRoute('/admin/_layout/documents')({
  component: DocumentsPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type DocRow = {
  id: string;
  title: string;
  iconSrc: string;
  content: string;
  bgUrl: string;
  bgOpacity: number;
  order: number;
  visible: boolean;
};

type InfoForm       = { title: string; iconSrc: string; order: number; visible: boolean };
type AppearanceForm = { bgUrl: string; bgOpacity: number };

// ─── 缓存失效辅助 ─────────────────────────────────────────────────────────────

function invalidateDocs() {
  queryClient.invalidateQueries({ queryKey: trpc.documents.list.queryOptions().queryKey });
  queryClient.invalidateQueries({ queryKey: trpc.site.getDocuments.queryOptions().queryKey });
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function DocumentsPage() {
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [loadedId,     setLoadedId]     = useState<string | null>(null);   // 当前已载入表单的文档 id
  const [showNewOk,    setShowNewOk]    = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);

  // ── 表单分区状态 ──────────────────────────────────────────────────────────
  const [info,       setInfo]       = useState<InfoForm>({ title: '', iconSrc: '', order: 0, visible: true });
  const [content,    setContent]    = useState('');
  const [appearance, setAppearance] = useState<AppearanceForm>({ bgUrl: '', bgOpacity: 0.12 });

  // ── 各区保存结果 ──────────────────────────────────────────────────────────
  const [infoOk,   setInfoOk]   = useState(false);
  const [infoErr,  setInfoErr]  = useState('');
  const [contOk,   setContOk]   = useState(false);
  const [contErr,  setContErr]  = useState('');
  const [appOk,    setAppOk]    = useState(false);
  const [appErr,   setAppErr]   = useState('');

  // ── 获取文档列表（管理员接口，含隐藏文档） ────────────────────────────────
  const { data: docs = [], isPending } = useQuery({
    ...trpc.documents.list.queryOptions(),
    staleTime: 0,
  });

  const selectedDoc = docs.find((d) => d.id === selectedId) as DocRow | undefined;

  // 当 selectedId 变化且数据已加载时，初始化三个表单区
  useEffect(() => {
    if (!selectedDoc || selectedId === loadedId) return;
    setInfo({
      title:   selectedDoc.title,
      iconSrc: selectedDoc.iconSrc,
      order:   selectedDoc.order,
      visible: selectedDoc.visible,
    });
    setContent(selectedDoc.content);
    setAppearance({ bgUrl: selectedDoc.bgUrl, bgOpacity: selectedDoc.bgOpacity });
    setLoadedId(selectedId);
    // 清空上次保存结果
    setInfoOk(false); setInfoErr('');
    setContOk(false); setContErr('');
    setAppOk(false);  setAppErr('');
  }, [selectedId, selectedDoc, loadedId]);

  // ── 新建文档 ──────────────────────────────────────────────────────────────
  const { mutate: createDoc, isPending: isCreating } = useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: (created) => {
        invalidateDocs();
        if (created) setSelectedId(created.id);
        setLoadedId(null);   // 强制重新初始化
        setShowNewOk(true);
        setTimeout(() => setShowNewOk(false), 2000);
      },
    }),
  );

  // ── 基本信息保存 ──────────────────────────────────────────────────────────
  const { mutate: saveInfo, isPending: isSavingInfo } = useMutation(
    trpc.documents.update.mutationOptions({
      onSuccess: () => { invalidateDocs(); setInfoOk(true); setInfoErr(''); setTimeout(() => setInfoOk(false), 2500); },
      onError:  (e) => { setInfoErr(e.message ?? '保存失败'); setInfoOk(false); },
    }),
  );

  // ── 内容保存 ──────────────────────────────────────────────────────────────
  const { mutate: saveContent, isPending: isSavingCont } = useMutation(
    trpc.documents.update.mutationOptions({
      onSuccess: () => { invalidateDocs(); setContOk(true); setContErr(''); setTimeout(() => setContOk(false), 2500); },
      onError:  (e) => { setContErr(e.message ?? '保存失败'); setContOk(false); },
    }),
  );

  // ── 外观保存 ──────────────────────────────────────────────────────────────
  const { mutate: saveAppearance, isPending: isSavingApp } = useMutation(
    trpc.documents.update.mutationOptions({
      onSuccess: () => { invalidateDocs(); setAppOk(true); setAppErr(''); setTimeout(() => setAppOk(false), 2500); },
      onError:  (e) => { setAppErr(e.message ?? '保存失败'); setAppOk(false); },
    }),
  );

  // ── 删除文档 ──────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<DocRow | null>(null);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: FONT, overflow: 'hidden' }}>

      {/* ── 左侧：文档列表 ── */}
      <div style={{
        width: 220, flexShrink: 0,
        borderRight: '2px inset #aaa',
        display: 'flex', flexDirection: 'column',
        background: '#f5f3ec',
        overflow: 'hidden',
      }}>
        {/* 列表页头 */}
        <div style={{ padding: '10px 10px 6px', borderBottom: '1px solid #ccc', background: '#ece9d8', flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003399', marginBottom: 6 }}>
            📄 文档管理
          </div>
          <XpButton primary onClick={() => setShowNewDialog(true)}>
            ✚ 新建文档
          </XpButton>
          {showNewOk && <div style={{ fontSize: 11, color: '#006400', marginTop: 4 }}>✅ 已创建，请编辑内容</div>}
        </div>

        {/* 文档列表 */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isPending ? (
            <div style={{ padding: 12, fontSize: 11, color: '#888' }}>加载中…</div>
          ) : docs.length === 0 ? (
            <div style={{ padding: 12, fontSize: 11, color: '#888', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
              暂无文档，点击「新建文档」开始
            </div>
          ) : (
            docs.map((doc) => {
              const isSelected = doc.id === selectedId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedId(doc.id)}
                  style={{
                    padding: '7px 10px',
                    cursor: 'pointer',
                    background: isSelected ? '#cce8ff' : 'transparent',
                    borderLeft: isSelected ? '3px solid #003399' : '3px solid transparent',
                    borderBottom: '1px solid #e0ddd5',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}
                >
                  {doc.iconSrc ? (
                    <img src={doc.iconSrc} alt="" style={{ width: 16, height: 16, objectFit: 'contain', imageRendering: 'pixelated', flexShrink: 0 }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                  ) : (
                    <span style={{ fontSize: 14, flexShrink: 0 }}>📄</span>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.title}
                    </div>
                    <div style={{ fontSize: 10, color: doc.visible ? '#006400' : '#888' }}>
                      {doc.visible ? '● 可见' : '○ 隐藏'} · 排序 {doc.order}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── 右侧：编辑面板 ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {!selectedId ? (
          <EmptyEditor />
        ) : !selectedDoc && !isPending ? (
          <div style={{ fontSize: 12, color: '#888', padding: 20 }}>文档不存在或已被删除。</div>
        ) : !selectedDoc ? null : (
          <>
            {/* 页头 */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '2px solid #2060b8', paddingBottom: 10, marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>✏️</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#003399' }}>
                    {selectedDoc.title}
                  </div>
                  <div style={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>
                    id: {selectedDoc.id}
                  </div>
                </div>
              </div>
              <XpButton danger onClick={() => setDeleteTarget(selectedDoc)}>
                🗑️ 删除文档
              </XpButton>
            </div>

            {/* ── 区块 1：文档信息 ── */}
            <Section title="📄  文档信息">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                <Field label="标题 *">
                  <XpInput
                    value={info.title}
                    onChange={(v) => setInfo((p) => ({ ...p, title: v }))}
                    placeholder="文档标题（将显示在窗口标题栏）"
                    width={280}
                  />
                </Field>
                <Field label="图标 URL">
                  <XpInput
                    value={info.iconSrc}
                    onChange={(v) => setInfo((p) => ({ ...p, iconSrc: v }))}
                    placeholder="/assets/icons/file.png"
                    width={280}
                  />
                </Field>
                <Field label="排序">
                  <XpInput
                    value={String(info.order)}
                    onChange={(v) => setInfo((p) => ({ ...p, order: parseInt(v) || 0 }))}
                    placeholder="0"
                    width={80}
                  />
                  <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>数字越小越靠前</span>
                </Field>
                <Field label="可见性">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}>
                    <input
                      type="checkbox"
                      checked={info.visible}
                      onChange={(e) => setInfo((p) => ({ ...p, visible: e.target.checked }))}
                    />
                    {info.visible ? '前台可见' : '已隐藏（前台不显示）'}
                  </label>
                </Field>
              </div>
              <SaveRow
                onSave={() => saveInfo({ id: selectedId!, title: info.title.trim() || '未命名', iconSrc: info.iconSrc.trim(), order: info.order, visible: info.visible })}
                isPending={isSavingInfo}
                ok={infoOk}
                err={infoErr}
                disabled={!info.title.trim()}
              />
            </Section>

            {/* ── 区块 2：Markdown 内容 ── */}
            <Section title="📝  Markdown 内容">
              <EditorArea value={content} onChange={setContent} />
              <div style={{ marginTop: 8 }}>
                <SaveRow
                  onSave={() => saveContent({ id: selectedId!, content })}
                  isPending={isSavingCont}
                  ok={contOk}
                  err={contErr}
                />
              </div>
            </Section>

            {/* ── 区块 3：外观设置 ── */}
            <Section title="🖼️  外观设置">
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 280px' }}>
                  <Field label="背景图 URL">
                    <XpInput
                      value={appearance.bgUrl}
                      onChange={(v) => setAppearance((p) => ({ ...p, bgUrl: v }))}
                      placeholder="/assets/wallpapers/bg2.jpg（留空则纯白背景）"
                      width={300}
                    />
                  </Field>
                  <Field label="背景不透明度">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="range" min={0} max={1} step={0.05}
                        value={appearance.bgOpacity}
                        onChange={(e) => setAppearance((p) => ({ ...p, bgOpacity: parseFloat(e.target.value) }))}
                        style={{ width: 160, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: 12, minWidth: 32, color: '#333' }}>
                        {(appearance.bgOpacity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </Field>
                </div>
                <AppearancePreview bgUrl={appearance.bgUrl} bgOpacity={appearance.bgOpacity} iconSrc={info.iconSrc} title={info.title} />
              </div>
              <SaveRow
                onSave={() => saveAppearance({ id: selectedId!, bgUrl: appearance.bgUrl.trim(), bgOpacity: appearance.bgOpacity })}
                isPending={isSavingApp}
                ok={appOk}
                err={appErr}
              />
            </Section>
          </>
        )}
      </div>

      {/* 新建文档对话框 */}
      {showNewDialog && (
        <NewDocDialog
          isPending={isCreating}
          onCreate={(title, customId) => {
            createDoc({ title, customId: customId || undefined, content: '', iconSrc: '', bgUrl: '', bgOpacity: 0.12, order: 0, visible: true });
            setShowNewDialog(false);
          }}
          onCancel={() => setShowNewDialog(false)}
        />
      )}

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <DeleteDialog
          doc={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            setSelectedId(null);
            setLoadedId(null);
          }}
        />
      )}
    </div>
  );
}

// ─── 新建文档对话框 ───────────────────────────────────────────────────────────

function NewDocDialog({
  isPending, onCreate, onCancel,
}: {
  isPending: boolean;
  onCreate: (title: string, customId: string) => void;
  onCancel: () => void;
}) {
  const [title,    setTitle]    = useState('新建文档');
  const [customId, setCustomId] = useState('');

  const idHint = customId.trim()
    ? `将使用 ID: ${customId.trim()}`
    : '留空则自动生成 doc-xxxxx';

  const isValidId = !customId.trim() || /^[a-zA-Z0-9_-]+$/.test(customId.trim());

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, fontFamily: FONT }}>
      <div style={{ width: 400, border: '2px solid #00378a', borderRadius: 4, boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        {/* 标题栏 */}
        <div style={{ background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px' }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>新建文档</span>
        </div>
        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '16px 18px 14px' }}>
          {/* 标题 */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#222', display: 'block', marginBottom: 4 }}>文档标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '3px 6px', fontSize: 12, fontFamily: FONT, border: '2px inset #aaa', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* 自定义 ID */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: '#222', display: 'block', marginBottom: 4 }}>
              自定义 ID <span style={{ color: '#888', fontWeight: 'normal' }}>（可选）</span>
            </label>
            <input
              type="text"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder="例如：resume（用于对接前台固定入口）"
              style={{ width: '100%', padding: '3px 6px', fontSize: 12, fontFamily: FONT, border: `2px inset ${isValidId ? '#aaa' : '#c00'}`, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: 10, color: isValidId ? '#666' : '#c00', marginTop: 3 }}>
              {isValidId ? idHint : 'ID 只能包含字母、数字、- 和 _'}
            </div>
          </div>

          {/* 提示框：说明 resume 场景 */}
          <div style={{ background: '#fff8dc', border: '1px solid #e0c000', borderRadius: 2, padding: '6px 10px', fontSize: 11, color: '#6a4f00', marginBottom: 14, lineHeight: 1.5 }}>
            💡 前台 <strong>Resume 窗口</strong>固定对接 ID 为 <code style={{ fontFamily: 'monospace', background: '#fffbe0', padding: '0 3px' }}>resume</code> 的文档。
            如需让简历窗口展示数据库内容，请将此处 ID 填写为 <code style={{ fontFamily: 'monospace', background: '#fffbe0', padding: '0 3px' }}>resume</code>。
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <XpButton
              primary
              disabled={!title.trim() || !isValidId || isPending}
              onClick={() => onCreate(title.trim(), customId.trim())}
            >
              {isPending ? '创建中…' : '✚ 创建'}
            </XpButton>
            <XpButton onClick={onCancel} disabled={isPending}>取消</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 空编辑器占位 ──────────────────────────────────────────────────────────────

function EmptyEditor() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#888', userSelect: 'none',
    }}>
      <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.35 }}>📄</div>
      <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>请从左侧选择文档</div>
      <div style={{ fontSize: 11 }}>或点击「✚ 新建文档」创建第一个文档窗口</div>
    </div>
  );
}

// ─── Markdown 编辑器区域 ───────────────────────────────────────────────────────

function EditorArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const placeholder = (
    <div style={{ height: 360, background: '#f8f8f0', border: '2px inset #aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
      编辑器加载中…
    </div>
  );

  if (!isMounted) return placeholder;

  return (
    <Suspense fallback={placeholder}>
      <div data-color-mode="light" style={{ border: '2px inset #aaa' }}>
        <MDEditor
          value={value}
          onChange={(v) => onChange(v ?? '')}
          height={360}
          preview="live"
          style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
        />
      </div>
    </Suspense>
  );
}

// ─── 外观预览缩略图 ───────────────────────────────────────────────────────────

function AppearancePreview({
  bgUrl, bgOpacity, iconSrc, title,
}: {
  bgUrl: string; bgOpacity: number; iconSrc: string; title: string;
}) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>窗口预览</div>
      {/* 模拟 XP 窗口 */}
      <div style={{ width: 200, border: '2px solid #003399', borderRadius: 3, overflow: 'hidden', boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}>
        {/* 标题栏 */}
        <div style={{ background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 100%)', padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
          {iconSrc ? (
            <img src={iconSrc} alt="" style={{ width: 12, height: 12, imageRendering: 'pixelated' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span style={{ fontSize: 10 }}>📄</span>
          )}
          <span style={{ fontSize: 10, color: '#fff', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {title || '未命名'}
          </span>
        </div>
        {/* 工具栏条 */}
        <div style={{ background: '#ece9d8', borderBottom: '1px solid #aca899', padding: '2px 4px', fontSize: 9, color: '#555' }}>
          File  Edit  View  Help
        </div>
        {/* 内容区 */}
        <div style={{ height: 90, position: 'relative', background: bgUrl ? '#333' : '#f0ede4', overflow: 'hidden' }}>
          {bgUrl && (
            <img src={bgUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: bgOpacity }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, padding: '6px 8px', background: bgUrl ? 'rgba(255,255,255,0.82)' : 'transparent', margin: '6px', boxShadow: bgUrl ? '0 0 4px rgba(0,0,0,0.2)' : 'none' }}>
            <div style={{ height: 5, background: '#c5d0e8', borderRadius: 2, marginBottom: 4, width: '70%' }} />
            <div style={{ height: 4, background: '#e8e8e8', borderRadius: 2, marginBottom: 3, width: '90%' }} />
            <div style={{ height: 4, background: '#e8e8e8', borderRadius: 2, marginBottom: 3, width: '80%' }} />
            <div style={{ height: 4, background: '#e8e8e8', borderRadius: 2, width: '60%' }} />
          </div>
        </div>
      </div>
      {!bgUrl && !iconSrc && (
        <div style={{ fontSize: 10, color: '#aaa', marginTop: 4, textAlign: 'center' }}>填写 URL 后预览</div>
      )}
    </div>
  );
}

// ─── 保存操作行（按钮 + 状态反馈） ───────────────────────────────────────────

function SaveRow({
  onSave, isPending, ok, err, disabled = false,
}: {
  onSave: () => void;
  isPending: boolean;
  ok: boolean;
  err: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
      <XpButton onClick={onSave} disabled={isPending || disabled} primary>
        {isPending ? '保存中…' : '💾  保存此区域'}
      </XpButton>
      {ok  && <span style={{ fontSize: 11, color: '#006400' }}>✅ 已保存</span>}
      {err && <span style={{ fontSize: 11, color: '#a00' }}>⚠️ {err}</span>}
    </div>
  );
}

// ─── 删除确认弹窗 ─────────────────────────────────────────────────────────────

function DeleteDialog({
  doc, onCancel, onDeleted,
}: {
  doc: DocRow; onCancel: () => void; onDeleted: () => void;
}) {
  const { mutate: del, isPending } = useMutation(
    trpc.documents.delete.mutationOptions({
      onSuccess: () => { invalidateDocs(); onDeleted(); },
    }),
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, fontFamily: FONT }}>
      <div style={{ width: 380, border: '2px solid #00378a', borderRadius: 4, boxShadow: '4px 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px' }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>确认删除</span>
        </div>
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 6 }}>确定要永久删除这个文档吗？</div>
              <div style={{ fontSize: 12, color: '#222', background: '#fff', border: '1px solid #ccc', padding: '4px 8px', borderRadius: 2, marginBottom: 6 }}>
                📄 {doc.title}
              </div>
              <div style={{ fontSize: 11, color: '#a00' }}>此操作无法撤销，文档内容将被永久删除。</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <XpButton onClick={() => del({ id: doc.id })} disabled={isPending} danger>
              {isPending ? '删除中…' : '删除'}
            </XpButton>
            <XpButton onClick={onCancel} disabled={isPending}>取消</XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 共用 UI 组件 ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: '2px groove #b0a890', borderRadius: 2, padding: '6px 12px 12px', marginBottom: 16, background: '#f5f3ec' }}>
      <legend style={{ fontSize: 12, fontWeight: 'bold', color: '#003', padding: '0 6px', background: '#f5f3ec' }}>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 12, color: '#222', width: 96, flexShrink: 0 }}>{label}：</label>
      {children}
    </div>
  );
}

function XpInput({ value, onChange, placeholder, width = 240 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; width?: number;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width, padding: '3px 6px', fontSize: 12, fontFamily: FONT, border: '2px inset #aaa', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
    />
  );
}

function XpButton({ children, onClick, disabled, primary, danger }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
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
        height: 24, padding: '0 12px', fontFamily: FONT, fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        border: '2px solid',
        borderColor: pressed ? '#003399 #a0b8e0 #a0b8e0 #003399' : danger ? '#a00000 #f0a0a0 #f0a0a0 #a00000' : '#a0b8e0 #003399 #003399 #a0b8e0',
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
