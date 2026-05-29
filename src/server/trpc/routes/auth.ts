import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import z from 'zod';
import { env } from '../../env';
import { loginRateLimiter } from '../../rate-limiter';
import { publicProcedure } from '../procedure';

// JWT 签名密钥（TextEncoder 将字符串转为 Uint8Array，jose 要求此格式）
// env.JWT_SECRET 在 Phase 0.2 已验证长度 ≥ 32，此处无需重复校验
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 天（秒）

/** 从请求头的 Cookie 字符串中提取指定名称的值。 */
function getCookie(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}

/**
 * 构造 Set-Cookie 字符串。
 *
 * - Secure：由 env.NODE_ENV 控制，生产环境启用，开发环境不启用（保证本地 HTTP 可用）。
 *   策略：不依赖 X-Forwarded-Proto（防 header 伪造），统一由部署阶段的 NODE_ENV 决定。
 *
 * - Domain：由 env.COOKIE_DOMAIN 控制，留空时不拼接 Domain 属性（Host-only，默认最安全）。
 *   跨子域名共享时在 .env 中填写 ".yoursite.com"。
 */
function buildCookieString(value: string, maxAge: number): string {
  const secure = env.NODE_ENV === 'production' ? '; Secure' : '';
  const domain = env.COOKIE_DOMAIN ? `; Domain=${env.COOKIE_DOMAIN}` : '';
  return `${COOKIE_NAME}=${value}; HttpOnly${secure}; SameSite=Lax; Path=/${domain}; Max-Age=${maxAge}`;
}

export const authRouter = {
  /**
   * 管理员登录。
   * 验证密码 → 签发 7 天有效期 JWT → 写入 httpOnly Cookie。
   * 安全原则：JWT 不返回给前端脚本，仅由浏览器在后续请求中自动携带。
   *
   * ⚠️ 必须通过浏览器侧调用（走 /api/trpc HTTP 端点），
   * SSR loader 中调用无法将 Set-Cookie 写回客户端响应。
   */
  login: publicProcedure
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // ── 速率限制：同一 IP 失败 5 次后锁定 15 分钟 ────────────────────────
      const rateCheck = loginRateLimiter.check(ctx.ip);
      if (!rateCheck.allowed) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: `登录失败次数过多，请等待 ${rateCheck.retryAfterSec} 秒后再试`,
        });
      }

      // ── 密码校验（bcrypt 哈希比对）────────────────────────────────────────
      // env.ADMIN_PASSWORD 存储的是 bcrypt 哈希，不再是明文。
      // bcrypt.compare 内部使用恒定时间比较，可防止时序攻击。
      const passwordMatch = await bcrypt.compare(input.password, env.ADMIN_PASSWORD);
      if (!passwordMatch) {
        // 故意不区分「密码错误」和「用户不存在」，防止枚举攻击
        loginRateLimiter.recordFailure(ctx.ip);
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '密码错误' });
      }

      // 登录成功：清零失败计数，防止合法管理员被误锁
      loginRateLimiter.recordSuccess(ctx.ip);

      const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

      ctx.resHeaders.append('Set-Cookie', buildCookieString(token, COOKIE_MAX_AGE));
      return { success: true };
    }),

  /**
   * 退出登录。
   * 将 admin_token Cookie 的 Max-Age 设为 0，令浏览器立即删除该 Cookie。
   *
   * ⚠️ 同 login，需浏览器侧调用。
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.resHeaders.append('Set-Cookie', buildCookieString('', 0));
    return { success: true };
  }),

  /**
   * 验证当前会话是否有效（供前端路由守卫使用）。
   * 读取请求头中的 Cookie → 解析 JWT → 返回布尔值。
   * 可在 SSR loader 中安全调用（只读操作，不写 Cookie）。
   */
  verify: publicProcedure.query(async ({ ctx }) => {
    const cookieHeader = ctx.headers.get('cookie') ?? '';
    const token = getCookie(cookieHeader, COOKIE_NAME);

    if (!token) return { authenticated: false };

    try {
      await jwtVerify(token, JWT_SECRET);
      return { authenticated: true };
    } catch {
      // Token 过期、签名错误等均视为未认证，不向客户端暴露具体原因
      return { authenticated: false };
    }
  }),
};
