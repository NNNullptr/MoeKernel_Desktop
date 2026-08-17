import { resolve } from 'node:path';

export const DEV_DATABASE_PATH = resolve(process.cwd(), '.data/dev.db');
export const DEV_DATABASE_URL = `file:${DEV_DATABASE_PATH}`;
const DEV_ADMIN_PASSWORD_HASH = '$2b$12$0KRfAzF82uZrEQ6Kv9Rhgew20/B1vkv31AXGIJSrd5Vo26Xx5l7/y';
const DEV_JWT_SECRET = 'moekernel-local-development-only-jwt-secret';
const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export type EnvSource = Record<string, string | undefined>;
export type WarningSink = (message: string) => void;

export interface AppEnv {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string | undefined;
  ADMIN_PASSWORD_HASH: string;
  JWT_SECRET: string;
  NODE_ENV: string;
  COOKIE_DOMAIN: string;
  IS_PRODUCTION: boolean;
  IS_LOCAL_DATABASE: boolean;
  USES_DEVELOPMENT_DEFAULTS: boolean;
}

export function resolveEnv(
  source: EnvSource,
  warn: WarningSink = console.warn,
): AppEnv {
  const nodeEnv = source.NODE_ENV ?? 'development';
  const isProduction = nodeEnv === 'production';
  const url = source.TURSO_DATABASE_URL;
  const token = source.TURSO_AUTH_TOKEN;
  const newPasswordHash = source.ADMIN_PASSWORD_HASH;
  const legacyPasswordHash = source.ADMIN_PASSWORD;
  const jwtSecret = source.JWT_SECRET;
  const cookieDomain = source.COOKIE_DOMAIN ?? '';

  if (Boolean(url) !== Boolean(token)) {
    throw new Error('[env] TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set together');
  }

  if (legacyPasswordHash && !newPasswordHash) {
    warn('[env] ADMIN_PASSWORD is deprecated; rename it to ADMIN_PASSWORD_HASH.');
  }

  const passwordHash = newPasswordHash ?? legacyPasswordHash;
  if (isProduction) {
    const problems: string[] = [];
    if (!url) problems.push('TURSO_DATABASE_URL is required');
    if (!token) problems.push('TURSO_AUTH_TOKEN is required');
    if (!passwordHash) problems.push('ADMIN_PASSWORD_HASH is required');
    if (!jwtSecret) problems.push('JWT_SECRET is required');
    if (url?.startsWith('file:')) problems.push('file: database URLs are not allowed in production');
    if (passwordHash && !BCRYPT_HASH.test(passwordHash)) problems.push('ADMIN_PASSWORD_HASH must be a bcrypt hash');
    if (jwtSecret && jwtSecret.length < 32) problems.push('JWT_SECRET must contain at least 32 characters');
    if (problems.length > 0) {
      throw new Error(`[env] Production validation failed:\n${problems.map((item) => `  - ${item}`).join('\n')}`);
    }
  }

  const usesDefaults = !isProduction && (!url || !passwordHash || !jwtSecret);
  if (usesDefaults) {
    warn('[env] Development mode only — do not use local database, password, or JWT defaults in production.');
  }

  const databaseUrl = url ?? DEV_DATABASE_URL;
  return {
    TURSO_DATABASE_URL: databaseUrl,
    TURSO_AUTH_TOKEN: token,
    ADMIN_PASSWORD_HASH: passwordHash ?? DEV_ADMIN_PASSWORD_HASH,
    JWT_SECRET: jwtSecret ?? DEV_JWT_SECRET,
    NODE_ENV: nodeEnv,
    COOKIE_DOMAIN: cookieDomain,
    IS_PRODUCTION: isProduction,
    IS_LOCAL_DATABASE: databaseUrl.startsWith('file:'),
    USES_DEVELOPMENT_DEFAULTS: usesDefaults,
  };
}

export const env = resolveEnv(process.env);
