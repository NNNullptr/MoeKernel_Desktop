import assert from 'node:assert/strict';
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { cp, lstat, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';

const projectRoot = process.cwd();
const tsxCli = resolve(projectRoot, 'node_modules/tsx/dist/cli.mjs');
const migrateScript = resolve(projectRoot, 'scripts/db-migrate.ts');
const seedScript = resolve(projectRoot, 'scripts/db-seed.ts');

function runTsx(
  cwd: string,
  script: string,
  env: NodeJS.ProcessEnv,
): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [tsxCli, script], {
    cwd,
    encoding: 'utf8',
    env,
  });
}

function withoutDatabaseEnvironment(): NodeJS.ProcessEnv {
  const environment = { ...process.env };
  delete environment.TURSO_DATABASE_URL;
  delete environment.TURSO_AUTH_TOKEN;
  delete environment.NODE_ENV;
  delete environment.ADMIN_PASSWORD;
  delete environment.ADMIN_PASSWORD_HASH;
  delete environment.JWT_SECRET;
  return environment;
}

async function createCliFixture(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-db-cli-'));
  await cp(join(projectRoot, 'drizzle'), join(directory, 'drizzle'), { recursive: true });
  await cp(
    join(projectRoot, 'src/client/apps/blog/posts'),
    join(directory, 'src/client/apps/blog/posts'),
    { recursive: true },
  );
  return directory;
}

async function assertPathMissing(path: string): Promise<void> {
  await assert.rejects(lstat(path), (error: unknown) => (
    error instanceof Error && 'code' in error && error.code === 'ENOENT'
  ));
}

for (const [name, script] of [
  ['migration', migrateScript],
  ['seed', seedScript],
] as const) {
  test(`${name} CLI requires an explicit remote URL and token without opening local SQLite`, async () => {
    const directory = await createCliFixture();
    try {
      const result = runTsx(directory, script, withoutDatabaseEnvironment());

      assert.notEqual(result.status, 0, result.stderr);
      assert.match(
        `${result.stdout}${result.stderr}`,
        /TURSO_DATABASE_URL.*TURSO_AUTH_TOKEN.*explicit remote database/s,
      );
      await assertPathMissing(join(directory, '.data'));
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test(`${name} CLI rejects a mixed-case local file URL without opening it`, async () => {
    const directory = await createCliFixture();
    const environment = withoutDatabaseEnvironment();
    environment.TURSO_DATABASE_URL = `FiLe:${join(directory, 'outside.db')}`;
    environment.TURSO_AUTH_TOKEN = 'token';
    try {
      const result = runTsx(directory, script, environment);

      assert.notEqual(result.status, 0, result.stderr);
      assert.match(`${result.stdout}${result.stderr}`, /explicit remote database.*file:/s);
      await assertPathMissing(join(directory, 'outside.db'));
      await assertPathMissing(join(directory, '.data'));
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
