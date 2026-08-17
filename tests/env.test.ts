import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import { DEV_DATABASE_URL, resolveEnv } from '../src/server/env';

const validHash = '$2b$12$0KRfAzF82uZrEQ6Kv9Rhgew20/B1vkv31AXGIJSrd5Vo26Xx5l7/y';
const validJwt = '0123456789abcdef0123456789abcdef';

test('development without env uses persistent local defaults', async () => {
  const warnings: string[] = [];
  const result = resolveEnv({}, (message) => warnings.push(message));

  assert.equal(result.TURSO_DATABASE_URL, DEV_DATABASE_URL);
  assert.equal(result.TURSO_AUTH_TOKEN, undefined);
  assert.equal(result.IS_LOCAL_DATABASE, true);
  assert.equal(result.USES_DEVELOPMENT_DEFAULTS, true);
  assert.equal(await bcrypt.compare('admin', result.ADMIN_PASSWORD_HASH), true);
  assert.ok(warnings.some((message) => message.includes('Development mode only')));
});

test('development rejects a partial Turso configuration', () => {
  assert.throws(
    () => resolveEnv({ TURSO_DATABASE_URL: 'libsql://example.turso.io' }),
    /TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set together/,
  );
});

test('development rejects a non-default file database URL', () => {
  assert.throws(
    () => resolveEnv({
      TURSO_DATABASE_URL: 'file:/arbitrary/path.db',
      TURSO_AUTH_TOKEN: 'token',
    }),
    /Development file database URLs must equal DEV_DATABASE_URL/,
  );
});

test('development may explicitly use Turso', () => {
  const result = resolveEnv({
    TURSO_DATABASE_URL: 'libsql://example.turso.io',
    TURSO_AUTH_TOKEN: 'token',
  }, () => undefined);

  assert.equal(result.IS_LOCAL_DATABASE, false);
  assert.equal(result.TURSO_AUTH_TOKEN, 'token');
});

test('production reports every missing required variable', () => {
  assert.throws(
    () => resolveEnv({ NODE_ENV: 'production' }),
    /TURSO_DATABASE_URL.*TURSO_AUTH_TOKEN.*ADMIN_PASSWORD_HASH.*JWT_SECRET/s,
  );
});

test('production rejects file database, plaintext password, and short JWT', () => {
  assert.throws(() => resolveEnv({
    NODE_ENV: 'production',
    TURSO_DATABASE_URL: 'file:.data/dev.db',
    TURSO_AUTH_TOKEN: 'token',
    ADMIN_PASSWORD_HASH: 'plaintext',
    JWT_SECRET: 'short',
  }), /Production validation failed.*file:.*bcrypt.*32/s);
});

test('legacy ADMIN_PASSWORD remains supported with a warning', () => {
  const warnings: string[] = [];
  const result = resolveEnv({
    NODE_ENV: 'production',
    TURSO_DATABASE_URL: 'libsql://example.turso.io',
    TURSO_AUTH_TOKEN: 'token',
    ADMIN_PASSWORD: validHash,
    JWT_SECRET: validJwt,
  }, (message) => warnings.push(message));

  assert.equal(result.ADMIN_PASSWORD_HASH, validHash);
  assert.ok(warnings.some((message) => message.includes('deprecated')));
});
