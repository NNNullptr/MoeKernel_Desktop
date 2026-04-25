import { TRPCError } from '@trpc/server';
import { jwtVerify } from 'jose';
import { t } from './init';
import { env } from '../env';

const JWT_SECRET   = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME  = 'admin_token';

function getCookie(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}

export const authMiddleware = t.middleware(({ ctx, next }) => {
  return next({ ctx: {} });
});

// ── Phase 3 升级：adminMiddleware 改为验证 JWT Cookie ─────────────────────
// 浏览器登录后持有 httpOnly admin_token Cookie，所有 adminProcedure 均由此验证。
export const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  const cookieHeader = ctx.headers.get('cookie') ?? '';
  const token = getCookie(cookieHeader, COOKIE_NAME);

  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '未登录' });
  }

  try {
    await jwtVerify(token, JWT_SECRET);
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '会话已过期，请重新登录' });
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
