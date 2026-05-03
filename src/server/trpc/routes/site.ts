import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { blogPosts, desktopIcons, documents, mascots, mediaTracks, portfolioItems, siteSettings } from '../../db/schema';
import { publicProcedure } from '../procedure';

export const siteRouter = {
  /**
   * 读取所有站点设置，将 [{key, value}] 数组转换为扁平对象。
   * 前端可直接解构：const { wallpaper_url, windows_logo_url } = data
   *
   * 注意：数组类型的值（如 system_tray_icons）在 DB 中以 JSON 字符串存储，
   * 前端取用时需自行 JSON.parse。
   */
  getSettings: publicProcedure.query(async () => {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map(({ key, value }) => [key, value])) as Record<string, string>;
  }),

  /**
   * 读取所有博客文章，按 order 升序排列。
   * 返回完整字段（含 content），由前端按需使用。
   */
  getBlogPosts: publicProcedure.query(async () => {
    return db
      .select()
      .from(blogPosts)
      .orderBy(asc(blogPosts.order));
  }),

  /**
   * 读取 visible = true 的桌面图标，按 order 升序排列。
   * 隐藏的图标（visible = false）在此接口不可见，仅管理员接口返回全量。
   */
  getDesktopIcons: publicProcedure.query(async () => {
    return db
      .select()
      .from(desktopIcons)
      .where(eq(desktopIcons.visible, true))
      .orderBy(asc(desktopIcons.order));
  }),

  /**
   * 读取所有吉祥物，按 order 升序排列。
   */
  getMascots: publicProcedure.query(async () => {
    return db
      .select()
      .from(mascots)
      .orderBy(asc(mascots.order));
  }),

  /**
   * 读取 visible=true 的作品集条目，按 order 升序排列。
   */
  getPortfolioItems: publicProcedure.query(async () => {
    return db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.visible, true))
      .orderBy(asc(portfolioItems.order));
  }),

  /**
   * 读取 visible=true 的多媒体曲目，按 order 升序排列。
   * 前台 Winamp 过滤 type='audio'，Video Player 过滤 type='video'|'bilibili'。
   */
  getMediaTracks: publicProcedure.query(async () => {
    return db
      .select()
      .from(mediaTracks)
      .where(eq(mediaTracks.visible, true))
      .orderBy(asc(mediaTracks.order));
  }),

  /**
   * 读取 visible=true 的文档窗口，按 order 升序排列。
   * 管理后台全量读取见 documents.ts → list。
   */
  getDocuments: publicProcedure.query(async () => {
    return db
      .select()
      .from(documents)
      .where(eq(documents.visible, true))
      .orderBy(asc(documents.order));
  }),
};
