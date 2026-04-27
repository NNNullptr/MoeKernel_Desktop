import { createHash } from 'node:crypto';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, lt } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';
import { db } from '../../db/client';
import { chatMessages } from '../../db/schema';
import { adminProcedure, publicProcedure } from '../procedure';

const RATE_LIMIT_MS = 60_000; // 同一 IP 两次留言最短间隔（毫秒）

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

// ── Zod Schema ────────────────────────────────────────────────────────────────

const createMessageInput = z.object({
  name:    z.string().min(1, '昵称不能为空').max(20, '昵称最多 20 字'),
  content: z.string().min(1, '内容不能为空').max(500, '内容最多 500 字'),
});

// ── Router ────────────────────────────────────────────────────────────────────

export const chatboxRouter = {
  /**
   * 分页读取留言。
   * 返回结构：
   *   pinned  — 全部置顶消息（不分页，按创建时间降序）
   *   items   — 普通消息（按创建时间降序，游标分页）
   *   nextCursor — 下一页游标（null 表示没有更多）
   *
   * cursor 为上一页最后一条普通消息的 createdAt Unix 毫秒时间戳字符串。
   * SQLite timestamp 列精度为秒，游标比较使用 lt（严格小于），安全无重复。
   */
  listMessages: publicProcedure
    .input(
      z.object({
        limit:  z.number().int().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      // ipHash 是服务端内部字段，在此层剔除，不对外暴露
      // 使用 db.select() 取全量列，再用 destructuring 去掉 ipHash
      const strip = ({ ipHash: _h, ...rest }: typeof chatMessages.$inferSelect) => rest;

      // 置顶消息：全量返回，供前端固定在顶部
      const rawPinned = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.isPinned, true))
        .orderBy(desc(chatMessages.createdAt));
      const pinned = rawPinned.map(strip);

      // 普通消息：游标分页
      const cursorDate = cursor ? new Date(Number(cursor)) : undefined;

      const rawRows = await db
        .select()
        .from(chatMessages)
        .where(
          cursorDate
            ? and(eq(chatMessages.isPinned, false), lt(chatMessages.createdAt, cursorDate))
            : eq(chatMessages.isPinned, false),
        )
        .orderBy(desc(chatMessages.createdAt))
        .limit(limit + 1); // 多取一条，用于判断是否还有下一页

      const hasMore = rawRows.length > limit;
      const items = (hasMore ? rawRows.slice(0, limit) : rawRows).map(strip);

      // 游标 = 最后一条消息的 createdAt（毫秒），null 表示已到底
      const lastItem = items.at(-1);
      const nextCursor = hasMore && lastItem ? String(lastItem.createdAt!.getTime()) : null;

      return { pinned, items, nextCursor };
    }),

  /**
   * 访客发送留言。
   * 防刷：同一 IP（SHA-256 哈希）在 60 秒内只能发送一条。
   * 错误码 TOO_MANY_REQUESTS → HTTP 429，前端可读取 message 显示剩余等待秒数。
   */
  createMessage: publicProcedure
    .input(createMessageInput)
    .mutation(async ({ input, ctx }) => {
      const ipHash = hashIp(ctx.ip);

      // 查询该 IP 最近一条留言的时间
      const [lastMsg] = await db
        .select({ createdAt: chatMessages.createdAt })
        .from(chatMessages)
        .where(eq(chatMessages.ipHash, ipHash))
        .orderBy(desc(chatMessages.createdAt))
        .limit(1);

      if (lastMsg?.createdAt) {
        const elapsed = Date.now() - lastMsg.createdAt.getTime();
        if (elapsed < RATE_LIMIT_MS) {
          const waitSec = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
          throw new TRPCError({
            code:    'TOO_MANY_REQUESTS',
            message: `发送太频繁，请等待 ${waitSec} 秒后再试`,
          });
        }
      }

      const id = nanoid();
      const [created] = await db
        .insert(chatMessages)
        .values({ id, name: input.name, content: input.content, ipHash })
        .returning({
          id:        chatMessages.id,
          name:      chatMessages.name,
          content:   chatMessages.content,
          isPinned:  chatMessages.isPinned,
          createdAt: chatMessages.createdAt,
        });

      return created;
    }),

  /**
   * 删除指定留言（管理员）。
   */
  deleteMessage: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(chatMessages)
        .where(eq(chatMessages.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: `找不到 id 为 "${input.id}" 的留言`,
        });
      }

      return { success: true, id: deleted.id };
    }),

  /**
   * 切换留言的置顶状态（管理员）。
   * 读取当前 isPinned 值后取反写回，返回更新后的完整记录。
   */
  togglePin: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [msg] = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.id, input.id));

      if (!msg) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: `找不到 id 为 "${input.id}" 的留言`,
        });
      }

      const [updated] = await db
        .update(chatMessages)
        .set({ isPinned: !msg.isPinned })
        .where(eq(chatMessages.id, input.id))
        .returning({
          id:        chatMessages.id,
          name:      chatMessages.name,
          content:   chatMessages.content,
          isPinned:  chatMessages.isPinned,
          createdAt: chatMessages.createdAt,
        });

      return updated;
    }),
};
