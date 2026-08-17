# Issue #9 Zero-Config Local Development Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `pnpm dev` start a persistent local SQLite-backed site and admin area without `.env` or Turso, while preserving strict production security, fixing the existing TypeScript errors, and separating local and production documentation.

**Architecture:** A pure environment resolver chooses either a local `file:.data/dev.db` configuration or an explicitly configured Turso connection. Shared database factories, tracked Drizzle migrations, and idempotent seed functions power both local setup and production commands; small CLI scripts orchestrate setup/reset without placing filesystem or process-exit behavior inside reusable modules.

**Tech Stack:** Node.js 20+, TypeScript 5.9, pnpm 10.14, `@libsql/client`, Drizzle ORM/Kit, bcryptjs, TanStack Start, Node's built-in test runner through `tsx --test`.

## Global Constraints

- Production remains Turso-backed; do not remove or weaken its required credentials.
- `NODE_ENV === "production"` is the only production-mode test.
- Local data is fixed at `.data/dev.db`, persists across restarts, and is ignored by Git.
- The local admin plaintext password is exactly `admin`; its bcrypt hash is a development-only constant.
- Production accepts `ADMIN_PASSWORD_HASH`; legacy `ADMIN_PASSWORD` remains temporarily supported with a deprecation warning.
- Production rejects plaintext admin passwords, `file:` database URLs, missing credentials, and JWT secrets shorter than 32 characters.
- Initialization inserts only missing defaults and never overwrites user-edited rows.
- Reset code may delete only `.data/dev.db`, `.data/dev.db-wal`, and `.data/dev.db-shm` after exact absolute-path validation.
- Do not use `as any`, non-null assertions, reduced TypeScript strictness, Docker, or a new large test framework.
- Preserve unrelated application behavior and keep Issue #9 in a standalone PR after #8.

---

## File Responsibility Map

- `src/server/env.ts`: pure environment parsing/validation plus the process-level `env` singleton.
- `src/server/db/client.ts`: libSQL client and Drizzle database factory; no validation logic.
- `src/server/db/migrate.ts`: reusable migration function for a provided database.
- `src/server/db/seed.ts`: reusable, non-overwriting seed function for a provided database.
- `scripts/db-migrate.ts`: configured-database migration CLI.
- `scripts/db-seed.ts`: configured-database seed CLI.
- `scripts/dev-setup.ts`: local migration/seed orchestration before Vite starts.
- `scripts/dev-reset.ts`: validated deletion of the fixed local SQLite files followed by setup.
- `scripts/hash-password.ts`: hidden interactive password input and bcrypt hash output.
- `drizzle/`: generated, committed schema migrations and journal metadata.
- `tests/env.test.ts`: environment and production-boundary tests.
- `tests/db-bootstrap.test.ts`: migration, seed idempotence, and reset-target tests.
- `README.md` and `.env.example`: user-facing local and production instructions.

---

### Task 1: Pure Environment Resolution and Password Naming

**Files:**
- Modify: `src/server/env.ts:1-48`
- Modify: `src/server/trpc/routes/auth.ts:1-110`
- Modify: `scripts/hash-password.ts:1-43`
- Modify: `package.json:6-14`
- Create: `tests/env.test.ts`
- Modify: `pnpm-lock.yaml` only if `pnpm install` changes lock metadata; do not add a new runtime dependency.

**Interfaces:**
- Produces `AppEnv`, `EnvSource`, `WarningSink`, `resolveEnv(source, warn)`, `env`, `DEV_DATABASE_URL`, and `DEV_DATABASE_PATH` from `src/server/env.ts`.
- `AppEnv` fields are `TURSO_DATABASE_URL`, optional `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `NODE_ENV`, `COOKIE_DOMAIN`, `IS_PRODUCTION`, `IS_LOCAL_DATABASE`, and `USES_DEVELOPMENT_DEFAULTS`.
- `auth.ts` consumes `env.ADMIN_PASSWORD_HASH`; all other existing consumers keep their current property names.

- [ ] **Step 1: Add the environment test script and write failing resolver tests**

Add this script to `package.json` while retaining all existing scripts:

```json
"test": "tsx --test tests/**/*.test.ts"
```

Create `tests/env.test.ts` with focused cases. Use an injected warning array so assertions do not depend on global console state:

```ts
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
```

- [ ] **Step 2: Run the tests and verify the resolver API is missing**

Run:

```bash
pnpm test
```

Expected: FAIL because `DEV_DATABASE_URL` and `resolveEnv` are not exported by the current `src/server/env.ts`.

- [ ] **Step 3: Implement the pure resolver and process singleton**

Replace the top-level imperative validation in `src/server/env.ts` with this public shape:

```ts
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
```

Keep the error messages stable because the tests assert their key phrases. Do not export the development hash or JWT value.

- [ ] **Step 4: Update authentication consumers**

In `src/server/trpc/routes/auth.ts`, change only the bcrypt comparison and related comments:

```ts
const passwordMatch = await bcrypt.compare(input.password, env.ADMIN_PASSWORD_HASH);
```

Search for remaining property reads and update any actual `env.ADMIN_PASSWORD` consumer to `env.ADMIN_PASSWORD_HASH`:

```bash
rg -n 'env\.ADMIN_PASSWORD\b' src
```

Expected after edits: no matches. `process.env.ADMIN_PASSWORD` remains only inside the resolver as the compatibility input.

- [ ] **Step 5: Replace the password generator with hidden interactive input**

Implement a small raw-terminal reader in `scripts/hash-password.ts`. It must restore terminal raw mode in `finally`, reject empty input, and print only the hash assignment:

```ts
import bcrypt from 'bcryptjs';

async function readHidden(prompt: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('hash-password requires an interactive terminal');
  }
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  return new Promise((resolve, reject) => {
    let value = '';
    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onData);
    };
    const onData = (chunk: string) => {
      if (chunk === '\u0003') {
        cleanup();
        reject(new Error('cancelled'));
        return;
      }
      if (chunk === '\r' || chunk === '\n') {
        cleanup();
        process.stdout.write('\n');
        resolve(value);
        return;
      }
      if (chunk === '\u007f') {
        value = value.slice(0, -1);
        return;
      }
      value += chunk;
    };
    process.stdin.on('data', onData);
  });
}

try {
  const raw = await readHidden('New admin password: ');
  if (!raw) throw new Error('password must not be empty');
  const hash = await bcrypt.hash(raw, 12);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
} catch (error) {
  process.stdin.isTTY && process.stdin.setRawMode(false);
  console.error(`[hash-password] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
```

Update `package.json` so `hash-password` is `tsx scripts/hash-password.ts` and no longer loads `.env`.

- [ ] **Step 6: Run focused and full verification**

Run:

```bash
pnpm test
pnpm lint
```

Expected: environment tests PASS. `pnpm lint` still reports only the four known mutation errors; it must not report new environment or password-script errors.

- [ ] **Step 7: Commit the environment boundary**

```bash
git add package.json pnpm-lock.yaml src/server/env.ts src/server/trpc/routes/auth.ts scripts/hash-password.ts tests/env.test.ts
git commit -m "feat: add safe local environment defaults"
```

---

### Task 2: Shared Database Factory, Migrations, and Non-Overwriting Seed

**Files:**
- Modify: `src/server/db/client.ts:1-11`
- Create: `src/server/db/migrate.ts`
- Modify: `src/server/db/seed.ts:1-195`
- Create: `scripts/db-migrate.ts`
- Create: `scripts/db-seed.ts`
- Modify: `drizzle.config.ts:1-11`
- Create: generated `drizzle/*.sql` and `drizzle/meta/*`
- Create: `tests/db-bootstrap.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes `AppEnv`, `env`, and `DEV_DATABASE_PATH` from Task 1.
- Produces `createDatabase(config: Pick<AppEnv, 'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN'>)`, `db`, `migrateDatabase(database, migrationsFolder?)`, and `seedDatabase(database, options?)`.
- `SeedOptions` contains `projectRoot?: string` and `log?: (message: string) => void`.

- [ ] **Step 1: Write a failing database bootstrap integration test**

Create `tests/db-bootstrap.test.ts`. Use a unique temporary directory, create the client through the public factory, apply migrations, seed, modify one row, seed again, and assert preservation:

```ts
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { eq, sql } from 'drizzle-orm';
import { createDatabase } from '../src/server/db/client';
import { migrateDatabase } from '../src/server/db/migrate';
import { seedDatabase } from '../src/server/db/seed';
import { siteSettings } from '../src/server/db/schema';

test('migration creates eight business tables and seed never overwrites edits', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-db-'));
  try {
    const database = createDatabase({
      TURSO_DATABASE_URL: `file:${join(directory, 'dev.db')}`,
      TURSO_AUTH_TOKEN: undefined,
    });
    await migrateDatabase(database);
    await seedDatabase(database, { projectRoot: process.cwd(), log: () => undefined });

    const tableRows = await database.all<{ name: string }>(sql`
      SELECT name FROM sqlite_master
      WHERE type = 'table'
        AND name IN ('site_settings', 'blog_posts', 'desktop_icons', 'mascots',
                     'chat_messages', 'media_tracks', 'portfolio_items', 'documents')
    `);
    assert.equal(tableRows.length, 8);

    await database.update(siteSettings)
      .set({ value: '/custom-wallpaper.jpg' })
      .where(eq(siteSettings.key, 'wallpaper_url'));
    await seedDatabase(database, { projectRoot: process.cwd(), log: () => undefined });

    const [wallpaper] = await database.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'wallpaper_url'));
    assert.equal(wallpaper?.value, '/custom-wallpaper.jpg');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run the integration test and verify public database APIs are missing**

Run:

```bash
pnpm test
```

Expected: FAIL because `createDatabase`, `migrateDatabase`, and `seedDatabase` do not yet exist.

- [ ] **Step 3: Add the database factory**

Refactor `src/server/db/client.ts` to use the Node client that supports both local files and Turso:

```ts
import { createClient } from '@libsql/client/node';
import { drizzle } from 'drizzle-orm/libsql';
import type { AppEnv } from '../env';
import { env } from '../env';
import * as schema from './schema';

export type DatabaseConfig = Pick<AppEnv, 'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN'>;

export function createDatabase(config: DatabaseConfig) {
  const client = createClient({
    url: config.TURSO_DATABASE_URL,
    authToken: config.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDatabase>;
export const db = createDatabase(env);
```

- [ ] **Step 4: Generate and commit the baseline migration**

Make `drizzle.config.ts` usable without production credentials for generation:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? 'file:.data/dev.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

Run:

```bash
pnpm exec drizzle-kit generate --name baseline
```

Expected: a SQL migration and `drizzle/meta` journal/snapshot appear. Inspect the SQL and confirm it creates exactly the eight schema tables; do not manually add application data to the migration.

- [ ] **Step 5: Add the reusable migrator**

Create `src/server/db/migrate.ts`:

```ts
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import type { Database } from './client';

export async function migrateDatabase(
  database: Database,
  migrationsFolder = resolve(process.cwd(), 'drizzle'),
): Promise<void> {
  await migrate(database, { migrationsFolder });
}
```

- [ ] **Step 6: Refactor seed into a reusable, non-overwriting function**

Keep the existing seed values exactly, but make path lookup use an injected project root and replace every `onConflictDoUpdate` with `onConflictDoNothing`:

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Database } from './client';
import { blogPosts, desktopIcons, mascots, siteSettings } from './schema';

export interface SeedOptions {
  projectRoot?: string;
  log?: (message: string) => void;
}

export async function seedDatabase(
  database: Database,
  options: SeedOptions = {},
): Promise<void> {
  const projectRoot = options.projectRoot ?? process.cwd();
  const log = options.log ?? console.log;
  const postsDir = join(projectRoot, 'src/client/apps/blog/posts');
  const blogPostValues = BLOG_POST_METADATA.map((post) => ({
    ...post,
    content: readFileSync(join(postsDir, post.filename), 'utf8'),
  }));

  await database.insert(siteSettings).values(SITE_SETTINGS).onConflictDoNothing();
  await database.insert(blogPosts).values(blogPostValues).onConflictDoNothing();
  await database.insert(desktopIcons).values(DESKTOP_ICONS_SEED).onConflictDoNothing();
  await database.insert(mascots).values(MASCOTS_SEED).onConflictDoNothing();
  log('[seed] Default records are present.');
}
```

Represent each blog seed entry as metadata with `filename`; do not call `readFileSync` at module import time. Remove all `process.exit` calls and top-level `seed()` invocation from this reusable module.

Use this exact metadata for the two existing posts, preserving every current value:

```ts
const BLOG_POST_METADATA = [
  {
    id: 'blog-hello-world',
    title: 'Hello World',
    icon: '/assets/icons/Blog.png',
    backgroundImage: '/assets/wallpapers/bg4.jpg',
    bgOpacity: 1,
    filename: 'hello-world.md',
    category: '技术',
    order: 0,
  },
  {
    id: 'blog-xp-memories',
    title: '1 Day',
    icon: '/assets/icons/blog2.png',
    backgroundImage: '/assets/wallpapers/bg5.jpg',
    bgOpacity: 1,
    filename: 'windows-xp-memories.md',
    category: '生活',
    order: 1,
  },
];
```

- [ ] **Step 7: Add explicit configured-database CLIs and scripts**

Create `scripts/db-migrate.ts`:

```ts
import { createDatabase } from '../src/server/db/client';
import { env } from '../src/server/env';
import { migrateDatabase } from '../src/server/db/migrate';

await migrateDatabase(createDatabase(env));
console.log(`[db:migrate] Applied migrations to ${env.TURSO_DATABASE_URL}`);
```

Create `scripts/db-seed.ts`:

```ts
import { createDatabase } from '../src/server/db/client';
import { env } from '../src/server/env';
import { seedDatabase } from '../src/server/db/seed';

await seedDatabase(createDatabase(env));
```

Update `package.json`:

```json
"db:migrate": "tsx scripts/db-migrate.ts",
"db:seed": "tsx scripts/db-seed.ts"
```

Environment values may come from the shell or deployment platform. Optional `.env` loading for the explicit database CLI commands is added in Task 3, so do not add a parser here.

- [ ] **Step 8: Run migration and seed tests**

Run:

```bash
pnpm test
```

Expected: all environment and database bootstrap tests PASS, including the assertion that a second seed preserves `/custom-wallpaper.jpg`.

- [ ] **Step 9: Commit database bootstrap support**

```bash
git add package.json drizzle.config.ts drizzle src/server/db/client.ts src/server/db/migrate.ts src/server/db/seed.ts scripts/db-migrate.ts scripts/db-seed.ts tests/db-bootstrap.test.ts
git commit -m "feat: add reusable local database bootstrap"
```

---

### Task 3: Zero-Config Setup and Safe Reset Commands

**Files:**
- Create: `src/server/db/dev-paths.ts`
- Create: `scripts/load-env-file.ts`
- Create: `scripts/dev-setup.ts`
- Create: `scripts/dev-reset.ts`
- Modify: `scripts/db-migrate.ts`
- Modify: `scripts/db-seed.ts`
- Modify: `tests/db-bootstrap.test.ts`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes `env`, `DEV_DATABASE_PATH`, `createDatabase`, `migrateDatabase`, and `seedDatabase`.
- Produces `loadEnvFileIfPresent(filename?: string): void`, `assertDevDatabaseTarget(target: string): void`, `devDatabaseSidecars(): string[]`, `setupDevelopmentDatabase(config?: AppEnv): Promise<void>`, and `resetDevelopmentDatabase(): Promise<void>`.

- [ ] **Step 1: Add failing reset-boundary tests**

Merge `resolve` into the existing `node:path` import, then append the test:

```ts
import { DEV_DATABASE_PATH } from '../src/server/env';
import { assertDevDatabaseTarget, devDatabaseSidecars } from '../src/server/db/dev-paths';

test('reset boundary accepts only the fixed local database path', () => {
  assert.doesNotThrow(() => assertDevDatabaseTarget(DEV_DATABASE_PATH));
  assert.throws(() => assertDevDatabaseTarget(resolve('.data/other.db')), /Refusing to delete/);
  assert.throws(() => assertDevDatabaseTarget(resolve('.data')), /Refusing to delete/);
  assert.deepEqual(devDatabaseSidecars(), [
    DEV_DATABASE_PATH,
    `${DEV_DATABASE_PATH}-wal`,
    `${DEV_DATABASE_PATH}-shm`,
  ]);
});
```

- [ ] **Step 2: Run tests and verify the reset boundary module is absent**

Run:

```bash
pnpm test
```

Expected: FAIL because `src/server/db/dev-paths.ts` does not exist.

- [ ] **Step 3: Implement the fixed-path guard**

Create `src/server/db/dev-paths.ts`:

```ts
import { resolve } from 'node:path';
import { DEV_DATABASE_PATH } from '../env';

export function assertDevDatabaseTarget(target: string): void {
  if (resolve(target) !== DEV_DATABASE_PATH) {
    throw new Error(`[dev:reset] Refusing to delete unexpected path: ${target}`);
  }
}

export function devDatabaseSidecars(): string[] {
  return [DEV_DATABASE_PATH, `${DEV_DATABASE_PATH}-wal`, `${DEV_DATABASE_PATH}-shm`];
}
```

- [ ] **Step 4: Add deterministic optional `.env` loading for CLI scripts**

Create `scripts/load-env-file.ts` using Node APIs only. It loads simple unquoted `KEY=value` lines, does not override values already supplied by the shell, and splits only at the first equals sign:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadEnvFileIfPresent(filename = '.env'): void {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;

  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) throw new Error(`[env] Invalid line in ${filename}: ${rawLine}`);
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
}
```

Update both configured-database CLIs so loading happens before the module-level `env` singleton is imported. `scripts/db-migrate.ts` becomes:

```ts
import { loadEnvFileIfPresent } from './load-env-file';

loadEnvFileIfPresent();
const [{ createDatabase }, { env }, { migrateDatabase }] = await Promise.all([
  import('../src/server/db/client'),
  import('../src/server/env'),
  import('../src/server/db/migrate'),
]);
await migrateDatabase(createDatabase(env));
console.log(`[db:migrate] Applied migrations to ${env.TURSO_DATABASE_URL}`);
```

Use the same import order in `scripts/db-seed.ts`, dynamically import `seedDatabase`, then call `seedDatabase(createDatabase(env))`.

This intentionally supports only simple, unquoted values. Values that require shell quoting must be supplied through the shell or deployment platform instead of this lightweight loader.

- [ ] **Step 5: Implement local setup orchestration**

Create `scripts/dev-setup.ts` and export the function so reset can reuse it:

```ts
import { mkdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createDatabase } from '../src/server/db/client';
import { migrateDatabase } from '../src/server/db/migrate';
import { seedDatabase } from '../src/server/db/seed';
import { DEV_DATABASE_PATH, env, type AppEnv } from '../src/server/env';

export async function setupDevelopmentDatabase(config: AppEnv = env): Promise<void> {
  if (!config.IS_LOCAL_DATABASE) {
    console.log(`[dev:setup] Using configured Turso database: ${config.TURSO_DATABASE_URL}`);
    console.log('[dev:setup] Remote migrations remain explicit; run pnpm db:migrate when intended.');
    return;
  }

  await mkdir(dirname(DEV_DATABASE_PATH), { recursive: true });
  const database = createDatabase(config);
  await migrateDatabase(database);
  await seedDatabase(database);
  console.log(`[dev:setup] Local development database: ${relative(process.cwd(), DEV_DATABASE_PATH)}`);
  console.log('[dev:setup] Admin URL: http://localhost:3000/admin');
  console.log('[dev:setup] Development password: admin');
  console.warn('[dev:setup] Development mode only — do not use these defaults in production.');
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(resolve(entryPath)).href) {
  await setupDevelopmentDatabase();
}
```

- [ ] **Step 6: Implement validated reset orchestration**

Create `scripts/dev-reset.ts`:

```ts
import { unlink } from 'node:fs/promises';
import { DEV_DATABASE_PATH, resolveEnv } from '../src/server/env';
import { assertDevDatabaseTarget, devDatabaseSidecars } from '../src/server/db/dev-paths';
import { setupDevelopmentDatabase } from './dev-setup';

export async function resetDevelopmentDatabase(): Promise<void> {
  assertDevDatabaseTarget(DEV_DATABASE_PATH);
  for (const file of devDatabaseSidecars()) {
    await unlink(file).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
  const localConfig = resolveEnv({ NODE_ENV: 'development' }, () => undefined);
  await setupDevelopmentDatabase(localConfig);
}

await resetDevelopmentDatabase();
```

This script accepts no arguments and never removes `.data/` as a directory.

- [ ] **Step 7: Wire scripts and ignore local data**

Update `package.json` scripts:

```json
"dev": "pnpm dev:setup && vite dev",
"dev:setup": "tsx scripts/dev-setup.ts",
"dev:reset": "tsx scripts/dev-reset.ts"
```

Add this exact entry under the Node/build section of `.gitignore`:

```gitignore
.data/
```

- [ ] **Step 8: Run automated tests and a two-pass local setup smoke test**

Run:

```bash
pnpm test
pnpm dev:setup
pnpm dev:setup
git check-ignore -v .data/dev.db
```

Expected: tests PASS; both setup runs exit 0; the second run does not overwrite rows; `git check-ignore` reports the `.data/` rule.

Then run reset once:

```bash
pnpm dev:reset
```

Expected: the command recreates `.data/dev.db`, prints the admin URL/password, and does not change tracked files.

- [ ] **Step 9: Commit zero-config development commands**

```bash
git add .gitignore package.json src/server/db/dev-paths.ts scripts/load-env-file.ts scripts/dev-setup.ts scripts/dev-reset.ts scripts/db-migrate.ts scripts/db-seed.ts tests/db-bootstrap.test.ts
git commit -m "feat: add zero-config local development"
```

---

### Task 4: Fix the Four Existing TypeScript Errors

**Files:**
- Modify: `src/server/trpc/routes/blog.ts:41-50`
- Modify: `src/server/trpc/routes/settings.ts:61-98,124-140`
- Modify: `src/routes/admin/_layout/icons.tsx:130-170`

**Interfaces:**
- Existing tRPC mutation names and input shapes remain unchanged.
- Create mutations now guarantee a non-optional record or throw `TRPCError({ code: 'INTERNAL_SERVER_ERROR' })`.
- `IconRow` consumes TanStack Mutation's `isPending` as its single saving-state source.

- [ ] **Step 1: Capture the known failing lint baseline**

Run:

```bash
pnpm lint
```

Expected: exactly four `TS2345` errors at blog new, two icon mutation call sites, and mascot create. Save no generated output.

- [ ] **Step 2: Guarantee create mutation return values**

After each `.returning()` in blog create, icon create, and mascot create, add the corresponding check before returning:

```ts
if (!created) {
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: '数据库未返回新建记录',
  });
}
return created;
```

`blog.ts` and `settings.ts` already import `TRPCError`; keep those imports and the existing generated IDs, order calculation, inputs, and returned record shapes unchanged.

- [ ] **Step 3: Remove duplicate icon saving state**

In the icon row component, declare the mutation before the input-sync effect and use its pending state:

```ts
const { mutate: save, isPending: isSaving } = useMutation({
  ...trpc.settings.updateIcon.mutationOptions(),
  onSuccess: invalidateIcons,
});

useEffect(() => {
  if (!isSaving) {
    setLabel(icon.label);
    setSrc(icon.src);
    setOrder(String(icon.order));
  }
}, [icon.label, icon.src, icon.order, isSaving]);
```

Delete `const [saving, setSaving] = useState(false)`, `onMutate`, `onSettled`, and the now-unnecessary exhaustive-deps suppression. Preserve all button disabling and label behavior that already uses `isSaving`.

- [ ] **Step 4: Verify lint and build**

Run:

```bash
pnpm lint
pnpm build
```

Expected: `pnpm lint` exits 0 with zero errors; `pnpm build` exits 0. Chunk-size notices are warnings, not failures.

- [ ] **Step 5: Commit the lint baseline cleanup**

```bash
git add src/server/trpc/routes/blog.ts src/server/trpc/routes/settings.ts src/routes/admin/_layout/icons.tsx
git commit -m "fix: restore clean TypeScript baseline"
```

---

### Task 5: Production Env Example, README Split, and Final Verification

**Files:**
- Rename: `example.env` to `.env.example`
- Modify: `.env.example`
- Modify: `README.md:176-500,602-614`

**Interfaces:**
- README documents the exact commands already implemented in Tasks 1-4.

- [ ] **Step 1: Rename and rewrite the production environment example**

Run the rename through Git:

```bash
git mv example.env .env.example
```

Replace its contents with:

```env
# Production deployment example. Local `pnpm dev` does not need this file.
NODE_ENV=production
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=replace-with-your-turso-token

# Generate with `pnpm hash-password`; this must be a bcrypt hash, not plaintext.
ADMIN_PASSWORD_HASH=$2b$12$replace-with-generated-hash

# Generate at least 32 random characters.
JWT_SECRET=replace-with-at-least-32-random-characters

# Optional. Leave empty for a host-only cookie.
COOKIE_DOMAIN=
```

- [ ] **Step 2: Rewrite the README local path before production deployment**

Replace the current combined “部署教程（新手向）” opening with these explicit sections and commands:

````markdown
## 🚀 本地开发（零配置）

要求 Node.js 20+、pnpm 10+ 和 Git。

```bash
git clone https://github.com/你的用户名/MoeKernel_Desktop.git
cd MoeKernel_Desktop
pnpm install
pnpm dev
```

- 前台：`http://localhost:3000`
- 后台：`http://localhost:3000/admin`
- 本地后台密码：`admin`
- 本地数据库：`.data/dev.db`

本地数据会跨重启保留。需要恢复示例数据时运行：

```bash
pnpm dev:reset
```

本地开发不需要 `.env`、Turso 账号或云数据库 Token。默认密码和 JWT 仅用于开发，生产环境无法使用这些默认值。

## 🌐 生产部署
````

Keep the existing Turso, PM2, Nginx, and Cloudflare material under production deployment, but make these exact changes:

- Use `cp .env.example .env` instead of `touch .env`.
- Tell the user to run `pnpm hash-password` and paste `ADMIN_PASSWORD_HASH=...`.
- Set `NODE_ENV=production`.
- Replace `pnpm exec drizzle-kit push` with `pnpm db:migrate`.
- Keep `pnpm db:seed` explicitly optional and explain that it inserts only missing defaults.
- Remove every statement that describes `ADMIN_PASSWORD` as plaintext.

- [ ] **Step 3: Add the environment matrix and synchronize the command reference**

Add this table near the production `.env` instructions:

```markdown
| 变量 | 本地开发 | 生产环境 |
|---|---|---|
| `TURSO_DATABASE_URL` | 不需要 | 必填 |
| `TURSO_AUTH_TOKEN` | 不需要 | 必填 |
| `ADMIN_PASSWORD_HASH` | 默认密码 `admin` | 必填，必须是 bcrypt 哈希 |
| `JWT_SECRET` | 使用开发专用值 | 必填，至少 32 字符 |
| `COOKIE_DOMAIN` | 不需要 | 可选 |
```

Replace the common-command block with:

```bash
pnpm dev            # 初始化本地数据库并启动开发服务器
pnpm dev:setup      # 只检查迁移并补齐缺失的默认数据
pnpm dev:reset      # 重置 .data/dev.db
pnpm test           # 运行环境与数据库测试
pnpm lint           # TypeScript 类型检查
pnpm build          # 构建生产版本
pnpm start          # 启动生产构建
pnpm db:migrate     # 迁移显式配置的生产数据库
pnpm db:seed        # 向显式配置的数据库插入缺失默认数据
pnpm hash-password  # 交互式生成 ADMIN_PASSWORD_HASH
```

Search for stale wording:

```bash
rg -n 'example\.env|ADMIN_PASSWORD=|npm run|drizzle-kit push|必须.*Turso|\.env.*本地' README.md .env.example
```

Expected: no stale local-development requirements or plaintext-password instructions. A compatibility note may mention the legacy name `ADMIN_PASSWORD` once, but examples must not use it.

- [ ] **Step 4: Run the complete acceptance suite in the current checkout**

Run:

```bash
pnpm test
pnpm lint
pnpm build
git status --short
```

Expected: tests PASS, lint exits 0, build exits 0, and status lists only the intended Issue #9 source/document changes before commit; `.output`, `.data`, and `node_modules` do not appear.

- [ ] **Step 5: Verify a clean zero-config checkout**

From a fresh temporary checkout of the implementation branch with no `.env`, `.data`, or `node_modules`:

```bash
pnpm install --frozen-lockfile
pnpm dev:setup
pnpm dev:setup
pnpm test
pnpm lint
pnpm build
git status --short
```

Expected: install has no lockfile changes; both setup runs succeed; the database persists; tests/lint/build succeed; Git status is empty after ignoring generated local/build data.

- [ ] **Step 6: Commit documentation finishing work**

```bash
git add -A -- README.md example.env .env.example
git commit -m "docs: separate local development from deployment"
```

- [ ] **Step 7: Review the final branch against the approved design**

Run:

```bash
git log --oneline --decorate -6
git diff --stat origin/fullstack...HEAD
git diff --check origin/fullstack...HEAD
```

Expected: the branch contains the design/plan commits plus five focused implementation commits; the diff contains only Issue #9 files; `git diff --check` prints nothing.

Prepare a PR whose body states:

```markdown
Closes #9

## What changed
- add persistent zero-config local SQLite development
- enforce separate production environment validation
- add tracked migrations and non-overwriting seed behavior
- restore a clean TypeScript lint baseline
- separate local development and production deployment docs

## Verification
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- clean two-pass `pnpm dev:setup`
```
