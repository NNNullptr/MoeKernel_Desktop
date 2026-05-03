import { TRPCError } from '@trpc/server';
import { asc, eq, max } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';
import { db } from '../../db/client';
import { documents } from '../../db/schema';
import { adminProcedure } from '../procedure';

// ── Zod Schema ────────────────────────────────────────────────────────────────
const documentInput = z.object({
  title:     z.string().min(1, '标题不能为空'),
  iconSrc:   z.string().default(''),
  content:   z.string().default(''),
  bgUrl:     z.string().default(''),
  bgOpacity: z.number().min(0).max(1).default(0.12),
  order:     z.number().int().nonnegative().default(0),
  visible:   z.boolean().default(true),
});

// ── Router ────────────────────────────────────────────────────────────────────
export const documentsRouter = {
  /**
   * 列出所有文档（含隐藏），供管理后台使用。
   * 公开读取接口见 site.ts → getDocuments（仅返回 visible=true）。
   */
  list: adminProcedure.query(async () => {
    return db
      .select()
      .from(documents)
      .orderBy(asc(documents.order));
  }),

  /**
   * 创建新文档。
   * - customId 可选：若提供则使用该值（调用方需保证唯一），否则自动生成 `doc-{nanoid()}`。
   * - order 自动取当前最大值 + 1（除非调用方显式传入非零值）。
   */
  create: adminProcedure
    .input(documentInput.extend({
      customId: z.string().regex(/^[a-zA-Z0-9_-]+$/, 'ID 只能包含字母、数字、- 和 _').optional(),
    }))
    .mutation(async ({ input }) => {
      const { customId, ...fields } = input;
      const id = customId?.trim() || `doc-${nanoid()}`;

      // 若指定了自定义 id，先检查是否已存在
      if (customId?.trim()) {
        const [existing] = await db
          .select({ id: documents.id })
          .from(documents)
          .where(eq(documents.id, id));
        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `id 为 "${id}" 的文档已存在，请换一个 ID`,
          });
        }
      }

      const result = await db
        .select({ maxOrder: max(documents.order) })
        .from(documents);

      const maxOrder = result[0]?.maxOrder ?? 0;
      const order = fields.order !== 0 ? fields.order : maxOrder + 1;

      const [created] = await db
        .insert(documents)
        .values({ id, ...fields, order })
        .returning();
      return created;
    }),

  /**
   * 更新指定文档字段（partial），若 id 不存在抛 NOT_FOUND。
   */
  update: adminProcedure
    .input(documentInput.partial().extend({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;

      if (Object.keys(fields).length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '至少需要提供一个要更新的字段',
        });
      }

      const [updated] = await db
        .update(documents)
        .set(fields)
        .where(eq(documents.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `找不到 id 为 "${id}" 的文档`,
        });
      }

      return updated;
    }),

  /**
   * 删除指定文档，若 id 不存在抛 NOT_FOUND。
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(documents)
        .where(eq(documents.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `找不到 id 为 "${input.id}" 的文档`,
        });
      }

      return { success: true };
    }),
};
