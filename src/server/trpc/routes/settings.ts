import { TRPCError } from '@trpc/server';
import { asc, eq, max, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import z from 'zod';
import { db } from '../../db/client';
import { desktopIcons, mascots, siteSettings } from '../../db/schema';
import { adminProcedure } from '../procedure';

export const settingsRouter = {
  // ── 站点设置 ────────────────────────────────────────────────────────────────

  /** 读取所有站点设置，返回扁平 Key-Value 对象（供管理页面初始化表单）。 */
  get: adminProcedure.query(async () => {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map(({ key, value }) => [key, value])) as Record<string, string>;
  }),

  /**
   * 写入单条站点设置（Upsert）。
   * 若 key 已存在则覆盖，不存在则新建。
   */
  set: adminProcedure
    .input(z.object({ key: z.string().min(1), value: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .insert(siteSettings)
        .values({ key: input.key, value: input.value })
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: input.value } });
      return { success: true };
    }),

  /**
   * 批量写入站点设置（Batch Upsert），用于主题设置页"一键保存"。
   * 接收 Record<string, string>，全部 Upsert 到 site_settings 表。
   * excluded.value 是 SQLite UPSERT 语法，指「本次尝试插入的值」。
   */
  setBatch: adminProcedure
    .input(z.record(z.string().min(1), z.string()))
    .mutation(async ({ input }) => {
      const pairs = Object.entries(input).map(([key, value]) => ({ key, value }));
      if (pairs.length === 0) return { success: true, count: 0 };
      await db
        .insert(siteSettings)
        .values(pairs)
        .onConflictDoUpdate({ target: siteSettings.key, set: { value: sql`excluded.value` } });
      return { success: true, count: pairs.length };
    }),

  // ── 桌面图标 CRUD ────────────────────────────────────────────────────────────

  /** 列出所有图标（含隐藏），供管理页面完整展示。 */
  listAllIcons: adminProcedure.query(async () => {
    return db.select().from(desktopIcons).orderBy(asc(desktopIcons.order));
  }),

  /**
   * 新建桌面图标。
   * id 由调用方提供，必须与 APP_REGISTRY 键名一致（如 'myComputer'）。
   * 未传 order 时自动取当前最大值 + 1，保证新图标排在末尾。
   */
  createIcon: adminProcedure
    .input(z.object({
      id:      z.string().min(1, '图标 id 不能为空，且须与 APP_REGISTRY 键名一致'),
      label:   z.string().min(1, '显示名称不能为空'),
      src:     z.string().min(1, '图标路径不能为空'),
      visible: z.boolean().default(true),
      order:   z.number().int().nonnegative().optional(),
    }))
    .mutation(async ({ input }) => {
      // noUncheckedIndexedAccess 下 rows[0] 类型为 {...} | undefined，用可选链保底
      const rows = await db.select({ maxOrder: max(desktopIcons.order) }).from(desktopIcons);
      const maxOrder = rows[0]?.maxOrder ?? null;
      const order = input.order ?? (maxOrder ?? -1) + 1;
      const [created] = await db.insert(desktopIcons).values({ ...input, order }).returning();
      return created;
    }),

  /** 更新桌面图标（partial）。id 不存在时抛 NOT_FOUND。 */
  updateIcon: adminProcedure
    .input(z.object({
      id:      z.string().min(1),
      label:   z.string().min(1).optional(),
      src:     z.string().min(1).optional(),
      visible: z.boolean().optional(),
      order:   z.number().int().nonnegative().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;
      if (Object.keys(fields).length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: '至少需要提供一个要更新的字段' });
      }
      const [updated] = await db
        .update(desktopIcons).set(fields).where(eq(desktopIcons.id, id)).returning();
      if (!updated) {
        throw new TRPCError({ code: 'NOT_FOUND', message: `找不到 id 为 "${id}" 的桌面图标` });
      }
      return updated;
    }),

  /** 删除桌面图标。id 不存在时抛 NOT_FOUND。 */
  deleteIcon: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(desktopIcons).where(eq(desktopIcons.id, input.id)).returning();
      if (!deleted) {
        throw new TRPCError({ code: 'NOT_FOUND', message: `找不到 id 为 "${input.id}" 的桌面图标` });
      }
      return { success: true, id: deleted.id };
    }),

  // ── 吉祥物 CRUD ──────────────────────────────────────────────────────────────

  /** 列出所有吉祥物，供管理页面完整展示。 */
  listAllMascots: adminProcedure.query(async () => {
    return db.select().from(mascots).orderBy(asc(mascots.order));
  }),

  /**
   * 新建吉祥物。
   * id 由服务端生成（nanoid），无需调用方传入。
   * 未传 order 时自动取当前最大值 + 1。
   */
  createMascot: adminProcedure
    .input(z.object({
      label:   z.string().default(''),
      iconSrc: z.string().min(1, '侧边栏图标路径不能为空'),
      petSrc:  z.string().min(1, '桌面精灵路径不能为空'),
      size:    z.number().int().positive().default(80),
      order:   z.number().int().nonnegative().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = `mascot-${nanoid()}`;
      // noUncheckedIndexedAccess 下 rows[0] 类型为 {...} | undefined，用可选链保底
      const rows = await db.select({ maxOrder: max(mascots.order) }).from(mascots);
      const maxOrder = rows[0]?.maxOrder ?? null;
      const order = input.order ?? (maxOrder ?? -1) + 1;
      const [created] = await db.insert(mascots).values({ id, ...input, order }).returning();
      return created;
    }),

  /** 更新吉祥物（partial）。id 不存在时抛 NOT_FOUND。 */
  updateMascot: adminProcedure
    .input(z.object({
      id:      z.string().min(1),
      label:   z.string().optional(),
      iconSrc: z.string().min(1).optional(),
      petSrc:  z.string().min(1).optional(),
      size:    z.number().int().positive().optional(),
      order:   z.number().int().nonnegative().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...fields } = input;
      if (Object.keys(fields).length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: '至少需要提供一个要更新的字段' });
      }
      const [updated] = await db
        .update(mascots).set(fields).where(eq(mascots.id, id)).returning();
      if (!updated) {
        throw new TRPCError({ code: 'NOT_FOUND', message: `找不到 id 为 "${id}" 的吉祥物` });
      }
      return updated;
    }),

  /** 删除吉祥物。id 不存在时抛 NOT_FOUND。 */
  deleteMascot: adminProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(mascots).where(eq(mascots.id, input.id)).returning();
      if (!deleted) {
        throw new TRPCError({ code: 'NOT_FOUND', message: `找不到 id 为 "${input.id}" 的吉祥物` });
      }
      return { success: true, id: deleted.id };
    }),
};
