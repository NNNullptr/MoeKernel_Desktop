import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';
import { db } from '../../db/client';
import { portfolioItems } from '../../db/schema';
import { adminProcedure, publicProcedure } from '../procedure';

// ── Zod Schemas ───────────────────────────────────────────────────────────────

const portfolioItemInput = z.object({
  title:       z.string().min(1, '标题不能为空').max(100),
  description: z.string().max(1000).default(''),
  techStack:   z.string().max(500).default(''),
  link:        z.string().url('请输入有效的 URL').or(z.literal('')).optional(),
  imageUrl:    z.string().max(500).default(''),
  category:    z.string().max(50).default(''),
  order:       z.number().int().default(0),
  visible:     z.boolean().default(true),
});

// ── Router ────────────────────────────────────────────────────────────────────

export const portfolioRouter = {
  /**
   * 公开读取作品列表，仅返回 visible=true 的条目，按 order 升序。
   * 管理员后台读全量时通过 admin 专属过滤（listAll）。
   */
  list: publicProcedure.query(async () => {
    return db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.visible, true))
      .orderBy(asc(portfolioItems.order));
  }),

  /**
   * 管理员读取全量作品列表（含隐藏条目），按 order 升序。
   */
  listAll: adminProcedure.query(async () => {
    return db
      .select()
      .from(portfolioItems)
      .orderBy(asc(portfolioItems.order));
  }),

  /**
   * 创建新作品条目（管理员）。
   */
  create: adminProcedure
    .input(portfolioItemInput)
    .mutation(async ({ input }) => {
      const id = nanoid();
      const [created] = await db
        .insert(portfolioItems)
        .values({
          id,
          title:       input.title,
          description: input.description,
          techStack:   input.techStack,
          link:        input.link ?? null,
          imageUrl:    input.imageUrl,
          category:    input.category,
          order:       input.order,
          visible:     input.visible,
        })
        .returning();

      return created;
    }),

  /**
   * 更新作品条目（管理员）。
   */
  update: adminProcedure
    .input(z.object({ id: z.string().min(1) }).merge(portfolioItemInput))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const [existing] = await db
        .select({ id: portfolioItems.id })
        .from(portfolioItems)
        .where(eq(portfolioItems.id, id));

      if (!existing) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: `找不到 id 为 "${id}" 的作品`,
        });
      }

      const [updated] = await db
        .update(portfolioItems)
        .set({
          title:       data.title,
          description: data.description,
          techStack:   data.techStack,
          link:        data.link ?? null,
          imageUrl:    data.imageUrl,
          category:    data.category,
          order:       data.order,
          visible:     data.visible,
        })
        .where(eq(portfolioItems.id, id))
        .returning();

      return updated;
    }),

  /**
   * 删除作品条目（管理员）。
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(portfolioItems)
        .where(eq(portfolioItems.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: `找不到 id 为 "${input.id}" 的作品`,
        });
      }

      return { success: true, id: deleted.id };
    }),
};
