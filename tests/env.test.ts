import assert from 'node:assert/strict';
import test from 'node:test';
import bcrypt from 'bcryptjs';
import { DEV_DATABASE_URL, resolveEnv } from '../src/server/env';

const developmentHash = '$2b$12$0KRfAzF82uZrEQ6Kv9Rhgew20/B1vkv31AXGIJSrd5Vo26Xx5l7/y';
const validHash = '$2b$12$INdaDEX8LD8wxfurdw2hO.kQFrbFk9e4bQ4zt/aW5o7.R2aeE0/AC';
const validJwt = '0123456789abcdef0123456789abcdef';
const developmentJwt = 'moekernel-local-development-only-jwt-secret';
const oldExampleJwt = 'replace-with-at-least-32-random-characters';

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

test('development rejects a non-default mixed-case file database URL', () => {
  assert.throws(
    () => resolveEnv({
      TURSO_DATABASE_URL: 'FiLe:/arbitrary/path.db',
      TURSO_AUTH_TOKEN: 'token',
    }),
    /Development file database URLs must equal DEV_DATABASE_URL/,
  );
});

test('development classifies the fixed mixed-case file URL as local', () => {
  const result = resolveEnv({
    TURSO_DATABASE_URL: DEV_DATABASE_URL.replace(/^file:/, 'FiLe:'),
    TURSO_AUTH_TOKEN: 'token',
  }, () => undefined);

  assert.equal(result.IS_LOCAL_DATABASE, true);
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

test('production rejects a mixed-case file database URL', () => {
  assert.throws(() => resolveEnv({
    NODE_ENV: 'production',
    TURSO_DATABASE_URL: 'FILE:.data/dev.db',
    TURSO_AUTH_TOKEN: 'token',
    ADMIN_PASSWORD_HASH: validHash,
    JWT_SECRET: validJwt,
  }), /file: database URLs are not allowed in production/);
});

test('production rejects the built-in development administrator hash when copied explicitly', () => {
  assert.throws(() => resolveEnv({
    NODE_ENV: 'production',
    TURSO_DATABASE_URL: 'libsql://example.turso.io',
    TURSO_AUTH_TOKEN: 'token',
    ADMIN_PASSWORD_HASH: developmentHash,
    JWT_SECRET: validJwt,
  }), /development ADMIN_PASSWORD_HASH is not allowed in production/);
});

test('production rejects the built-in development JWT when copied explicitly', () => {
  assert.throws(() => resolveEnv({
    NODE_ENV: 'production',
    TURSO_DATABASE_URL: 'libsql://example.turso.io',
    TURSO_AUTH_TOKEN: 'token',
    ADMIN_PASSWORD_HASH: validHash,
    JWT_SECRET: developmentJwt,
  }), /development JWT_SECRET is not allowed in production/);
});

test('production rejects the formerly valid-length public JWT placeholder', () => {
  assert.throws(() => resolveEnv({
    NODE_ENV: 'production',
    TURSO_DATABASE_URL: 'libsql://example.turso.io',
    TURSO_AUTH_TOKEN: 'token',
    ADMIN_PASSWORD_HASH: validHash,
    JWT_SECRET: oldExampleJwt,
  }), /example JWT_SECRET placeholder is not allowed in production/);
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
