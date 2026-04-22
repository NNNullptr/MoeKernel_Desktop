import { TRPCError } from '@trpc/server';
import { t } from './init';
import { env } from '../env';

export const authMiddleware = t.middleware(({ ctx, next }) => {
  return next({
    ctx: {},
  });
});

// ── Phase 1 新增：管理员鉴权中间件 ────────────────────────────────────────
// 读取请求头 x-admin-token，与环境变量 ADMIN_PASSWORD 对比。
// Phase 3 完成 JWT 后，此处替换为 cookie 验证，届时只改这一个函数。
export const adminMiddleware = t.middleware(({ ctx, next }) => {
  const token = ctx.headers.get('x-admin-token');
  if (!token || token !== env.ADMIN_PASSWORD) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});

export const loggingMiddleware = t.middleware(
  async ({ path, type, next, input }) => {
    const start = Date.now();
    const isDev = process.env.NODE_ENV !== 'production';
    const timestamp = isDev
      ? new Date().toLocaleTimeString()
      : new Date().toISOString();
    const typeAbbr = type === 'query' ? 'Q' : type === 'mutation' ? 'M' : 'S';

    const fmt = (msg: string) => `[${timestamp}][${typeAbbr}] ${msg}`;

    console.log(fmt(`${path} - Started`));

    if (input !== undefined && process.env.NODE_ENV !== 'production') {
      console.log(fmt(`Input: ${JSON.stringify(input)}`));
    }

    try {
      const result = await next();
      const duration = Date.now() - start;

      if (result.ok) {
        console.log(fmt(`${path} - OK - ${duration}ms`));
      } else {
        console.error(fmt(`${path} - FAILED - ${duration}ms`));
        const error = result.error;
        console.error(fmt(`[Trpc] ${error.code}: ${error.message}`));
      }

      return result;
    } catch (error) {
      const duration = Date.now() - start;

      console.error(fmt(`${path} - FAILED - ${duration}ms`));
      if (error instanceof Error) {
        console.error(fmt(`Error: ${error.message}`));
        console.error(fmt(`Stack: ${error.stack}`));
      }

      throw error;
    }
  }
);
