import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';
import { db } from '../../db/client';
import { blogPosts } from '../../db/schema';
import { adminProcedure } from '../procedure';

// ── Zod Schema ────────────────────────────────────────────────────────────────
// 描述博客文章的可写字段（对应 schema.ts 中 blogPosts 的非自动生成字段）。
// update 通过 .partial() 复用，不重复定义字段。
const blogPostInput = z.object({
  title:           z.string().min(1, '标题不能为空'),
  content:         z.string().min(1, '内容不能为空'),
  category:        z.string().min(1, '分类不能为空'),
  icon:            z.string().min(1, '图标路径不能为空'),
  backgroundImage: z.string().default(''),
  bgOpacity:       z.number().min(0).max(1).default(1),
  order:           z.number().int().nonnegative().default(0),
});

// ── Router ────────────────────────────────────────────────────────────────────
export const blogRouter = {
  /**
   * 列出所有博客文章（含隐藏、草稿），供管理后台使用。
   * 返回按 order 升序排列的完整列表（不过滤任何字段）。
   * 公开读取接口见 site.ts → getBlogPosts。
   */
  list: adminProcedure.query(async () => {
    return db
      .select()
      .from(blogPosts)
      .orderBy(asc(blogPosts.order));
  }),

  /**
   * 创建新博客文章。
   * id 由服务端生成（nanoid），createdAt 由 $defaultFn 自动填充。
   * 返回新建记录的完整数据。
   */
  create: adminProcedure
    .input(blogPostInput)
    .mutation(async ({ input }) => {
      const id = `blog-${nanoid()}`;
      const [created] = await db
        .insert(blogPosts)
        .values({ id, ...input })
        .returning();
      if (!created) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '数据库未返回新建记录',
        });
      }
      return created;
    }),

  /**
   * 更新指定博客文章的字段（支持 partial，只更新传入的字段）。
   * 若 id 不存在，抛出 NOT_FOUND 错误。
   */
  update: adminProcedure
    .input(blogPostInput.partial().extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;

      // fields 可能为空对象（调用方未传任何字段）——提前拦截，避免无效写入
      if (Object.keys(fields).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '至少需要提供一个要更新的字段',
        });
      }

      const [updated] = await db
        .update(blogPosts)
        .set(fields)
        .where(eq(blogPosts.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `找不到 id 为 "${id}" 的博客文章`,
        });
      }

      return updated;
    }),

  /**
   * 删除指定博客文章。
   * 若 id 不存在，抛出 NOT_FOUND 错误。
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(blogPosts)
        .where(eq(blogPosts.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `找不到 id 为 "${input.id}" 的博客文章`,
        });
      }

      return { success: true, id: deleted.id };
    }),
};
