import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';
import { db } from '../../db/client';
import { mediaTracks } from '../../db/schema';
import { adminProcedure, publicProcedure } from '../procedure';

// ── Zod Schemas ───────────────────────────────────────────────────────────────

const mediaTrackInput = z.object({
  title:   z.string().min(1, '标题不能为空').max(200),
  artist:  z.string().max(100).default(''),
  src:     z.string().max(1000).default(''),
  bvid:    z.string().max(20).optional(),
  cover:   z.string().max(1000).default(''),
  type:    z.enum(['audio', 'video', 'bilibili']).default('audio'),
  order:   z.number().int().default(0),
  visible: z.boolean().default(true),
});

// ── Router ────────────────────────────────────────────────────────────────────

export const mediaRouter = {
  /**
   * 公开读取：仅返回 visible=true 的曲目，按 order 升序。
   * Winamp 过滤 type='audio'，Video Player 过滤 type='video'|'bilibili'。
   */
  list: publicProcedure.query(async () => {
    return db
      .select()
      .from(mediaTracks)
      .where(eq(mediaTracks.visible, true))
      .orderBy(asc(mediaTracks.order));
  }),

  /**
   * 管理员读取全量曲目（含隐藏条目），按 order 升序。
   */
  listAll: adminProcedure.query(async () => {
    return db
      .select()
      .from(mediaTracks)
      .orderBy(asc(mediaTracks.order));
  }),

  /**
   * 创建曲目（管理员）。
   */
  create: adminProcedure
    .input(mediaTrackInput)
    .mutation(async ({ input }) => {
      const id = nanoid();
      const [created] = await db
        .insert(mediaTracks)
        .values({
          id,
          title:   input.title,
          artist:  input.artist,
          src:     input.src,
          bvid:    input.bvid ?? null,
          cover:   input.cover,
          type:    input.type,
          order:   input.order,
          visible: input.visible,
        })
        .returning();

      return created;
    }),

  /**
   * 更新曲目（管理员）。
   */
  update: adminProcedure
    .input(z.object({ id: z.string().min(1) }).merge(mediaTrackInput))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const [existing] = await db
        .select({ id: mediaTracks.id })
        .from(mediaTracks)
        .where(eq(mediaTracks.id, id));

      if (!existing) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: `找不到 id 为 "${id}" 的曲目`,
        });
      }

      const [updated] = await db
        .update(mediaTracks)
        .set({
          title:   data.title,
          artist:  data.artist,
          src:     data.src,
          bvid:    data.bvid ?? null,
          cover:   data.cover,
          type:    data.type,
          order:   data.order,
          visible: data.visible,
        })
        .where(eq(mediaTracks.id, id))
        .returning();

      return updated;
    }),

  /**
   * 删除曲目（管理员）。
   * 删除后前台 Winamp / Video Player 的播放列表会在下次请求时同步更新。
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(mediaTracks)
        .where(eq(mediaTracks.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code:    'NOT_FOUND',
          message: `找不到 id 为 "${input.id}" 的曲目`,
        });
      }

      return { success: true, id: deleted.id };
    }),
};
