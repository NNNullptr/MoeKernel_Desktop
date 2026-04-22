import { adminMiddleware, authMiddleware, loggingMiddleware } from './middlewares';
import { t } from './init';
export { t, createTRPCRouter } from './init';

export const publicProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(authMiddleware);

// ── Phase 1 新增：管理员受保护过程 ────────────────────────────────────────
// 执行顺序：loggingMiddleware → adminMiddleware → 路由处理函数
// publicProcedure 已携带 loggingMiddleware，直接 .use(adminMiddleware) 不重复挂载
export const adminProcedure = publicProcedure.use(adminMiddleware);
