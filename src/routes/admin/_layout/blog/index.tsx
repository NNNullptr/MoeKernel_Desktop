import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc, queryClient } from '@/client/trpc';

export const Route = createFileRoute('/admin/_layout/blog/')({
  component: BlogListPage,
});

const FONT = '"Trebuchet MS", Tahoma, Arial, sans-serif';

type Post = {
  id: string;
  title: string;
  category: string;
  order: number;
  icon: string;
  createdAt: Date | null;
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

function BlogListPage() {
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const { data: posts = [], isPending } = useQuery({
    ...trpc.blog.list.queryOptions(),
    staleTime: 0,
  });

  return (
    <div style={{ padding: '20px 24px', fontFamily: FONT }}>

      {/* 页头 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '2px solid #2060b8',
        paddingBottom: 10, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>📝</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 15, color: '#003399', fontWeight: 'bold' }}>
              博客管理
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#555' }}>
              {isPending ? '加载中…' : `共 ${posts.length} 篇文章`}
            </p>
          </div>
        </div>
        <a href="/admin/blog/new" style={{ textDecoration: 'none' }}>
          <XpButton primary>✚ 新建文章</XpButton>
        </a>
      </div>

      {/* 列表主体 */}
      {isPending ? (
        <div style={{ color: '#555', fontSize: 12 }}>正在加载文章列表…</div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <PostTable posts={posts} onDelete={setDeleteTarget} />
      )}

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <DeleteDialog
          post={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onDeleted={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ─── 文章表格 ─────────────────────────────────────────────────────────────────

function PostTable({
  posts,
  onDelete,
}: {
  posts: Post[];
  onDelete: (p: Post) => void;
}) {
  return (
    <div style={{ border: '2px inset #aaa', background: '#fff', overflow: 'hidden' }}>
      {/* 表头（XP 资源管理器风格） */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 110px 48px 120px',
        background: 'linear-gradient(180deg,#ddd 0%,#c8c8c8 100%)',
        borderBottom: '1px solid #aaa',
        userSelect: 'none',
      }}>
        {['标题', '分类', '创建时间', '排序', '操作'].map((col) => (
          <div key={col} style={{
            padding: '3px 8px',
            fontSize: 11, fontWeight: 'bold', color: '#222',
            borderRight: '1px solid #bbb',
          }}>
            {col}
          </div>
        ))}
      </div>

      {/* 数据行 */}
      {posts.map((post, idx) => (
        <PostRow
          key={post.id}
          post={post}
          striped={idx % 2 === 1}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

// ─── 单行 ────────────────────────────────────────────────────────────────────

function PostRow({
  post, striped, onDelete,
}: {
  post: Post;
  striped: boolean;
  onDelete: (p: Post) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const bg = hovered
    ? '#cce8ff'
    : striped ? '#f0f0f0' : '#fff';

  const createdStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
      })
    : '—';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 110px 48px 120px',
        background: bg,
        borderBottom: '1px solid #e8e8e8',
        transition: 'background 0.05s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 标题（含图标） */}
      <div style={{ padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <img
          src={post.icon}
          alt=""
          style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0, imageRendering: 'pixelated' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
        />
        <span style={{
          fontSize: 12, color: '#000',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {post.title}
        </span>
      </div>

      {/* 分类 */}
      <div style={{ padding: '5px 8px', fontSize: 12, color: '#444', display: 'flex', alignItems: 'center' }}>
        {post.category}
      </div>

      {/* 创建时间 */}
      <div style={{ padding: '5px 8px', fontSize: 11, color: '#666', display: 'flex', alignItems: 'center' }}>
        {createdStr}
      </div>

      {/* 排序 */}
      <div style={{ padding: '5px 8px', fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {post.order}
      </div>

      {/* 操作按钮 */}
      <div style={{ padding: '3px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <a href={`/admin/blog/${post.id}`} style={{ textDecoration: 'none' }}>
          <XpButton small>✏️ 编辑</XpButton>
        </a>
        <XpButton small danger onClick={() => onDelete(post)}>
          🗑️ 删除
        </XpButton>
      </div>
    </div>
  );
}

// ─── 空状态 ───────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 0', color: '#888',
      border: '2px inset #aaa', background: '#fff',
    }}>
      <span style={{ fontSize: 48, marginBottom: 12, opacity: 0.5 }}>📂</span>
      <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4 }}>文件夹为空</div>
      <div style={{ fontSize: 11 }}>还没有任何博客文章，点击「新建文章」开始写作</div>
    </div>
  );
}

// ─── 删除确认弹窗 ─────────────────────────────────────────────────────────────

function DeleteDialog({
  post,
  onCancel,
  onDeleted,
}: {
  post: Post;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const { mutate: del, isPending } = useMutation({
    ...trpc.blog.delete.mutationOptions(),
    onSuccess: () => {
      // 同时刷新后台列表和前台博客缓存
      queryClient.invalidateQueries({ queryKey: trpc.blog.list.queryOptions().queryKey });
      queryClient.invalidateQueries({ queryKey: trpc.site.getBlogPosts.queryOptions().queryKey });
      onDeleted();
    },
  });

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, fontFamily: FONT,
    }}>
      <div style={{
        width: 360,
        border: '2px solid #00378a',
        borderRadius: 4,
        boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* 标题栏 */}
        <div style={{
          background: 'linear-gradient(180deg,#2e7bd4 0%,#1a5fb4 40%,#1e4fa0 60%,#2466c4 100%)',
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 8px',
        }}>
          <img src="/favicon.png" alt="" style={{ width: 14, height: 14, imageRendering: 'pixelated' }} />
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            确认删除
          </span>
        </div>

        {/* 内容 */}
        <div style={{ background: '#ece9d8', padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#003', marginBottom: 6 }}>
                确定要永久删除这篇文章吗？
              </div>
              <div style={{
                fontSize: 12, color: '#222',
                background: '#fff', border: '1px solid #ccc',
                padding: '4px 8px', borderRadius: 2, marginBottom: 6,
              }}>
                📄 {post.title}
              </div>
              <div style={{ fontSize: 11, color: '#a00' }}>
                此操作无法撤销，文章内容将被永久删除。
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
            <XpButton onClick={() => del({ id: post.id })} disabled={isPending} danger>
              {isPending ? '删除中…' : '删除'}
            </XpButton>
            <XpButton onClick={onCancel} disabled={isPending}>
              取消
            </XpButton>
          </div>
        </div>
      </div>
    </div>
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
        fontFamily: FONT,
        fontSize: small ? 11 : 12,
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
