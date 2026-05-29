const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN   = process.env.TURSO_AUTH_TOKEN;
const ADMIN_PASSWORD     = process.env.ADMIN_PASSWORD;
const JWT_SECRET         = process.env.JWT_SECRET;

// ── 必需变量校验（启动时全量收集，一次性报告所有缺失项）───────────────────
const missing: string[] = [];
if (!TURSO_DATABASE_URL) missing.push('TURSO_DATABASE_URL');
if (!TURSO_AUTH_TOKEN)   missing.push('TURSO_AUTH_TOKEN');
// ADMIN_PASSWORD 必须是 bcrypt 哈希（$2b$ 开头），不可存储明文。
// 使用 `pnpm hash-password` 脚本从当前明文密码生成哈希后更新此值。
if (!ADMIN_PASSWORD)     missing.push('ADMIN_PASSWORD');
if (!JWT_SECRET)         missing.push('JWT_SECRET');

if (missing.length > 0) {
  throw new Error(
    `[env] 缺少以下必需的环境变量，请在部署平台或 .env 文件中配置：\n` +
    missing.map(k => `  - ${k}`).join('\n'),
  );
}

// JWT_SECRET 过短会导致签名被暴力破解，要求至少 32 个字符
if (JWT_SECRET!.length < 32) {
  throw new Error('[env] JWT_SECRET 长度必须 ≥ 32 个字符，请使用强随机字符串');
}

// ── NODE_ENV：宽松校验 ─────────────────────────────────────────────────────
// 非 'production' 均视为开发环境，不 throw；未设置或值不规范时给出警告。
const NODE_ENV = process.env.NODE_ENV ?? 'development';
if (NODE_ENV !== 'production' && NODE_ENV !== 'development') {
  console.warn(
    `[env] NODE_ENV="${NODE_ENV}" 不是标准值（production/development），将视为开发环境处理。`,
  );
}

// ── COOKIE_DOMAIN：可选 ────────────────────────────────────────────────────
// 留空 = Cookie 绑定到当前主机（Host-only，最安全的默认值）。
// 跨子域名共享时填写 ".yoursite.com"（注意前导点）。
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? '';

export const env = {
  TURSO_DATABASE_URL: TURSO_DATABASE_URL!,
  TURSO_AUTH_TOKEN:   TURSO_AUTH_TOKEN!,
  ADMIN_PASSWORD:     ADMIN_PASSWORD!,
  JWT_SECRET:         JWT_SECRET!,
  NODE_ENV,
  COOKIE_DOMAIN,
} as const;
