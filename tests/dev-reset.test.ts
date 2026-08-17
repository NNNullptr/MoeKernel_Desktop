import assert from 'node:assert/strict';
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test, { type TestContext } from 'node:test';
import { createClient } from '@libsql/client/node';
import { setupDevelopmentDatabase } from '../scripts/dev-setup';

const projectRoot = process.cwd();
const tsxCli = resolve(projectRoot, 'node_modules/tsx/dist/cli.mjs');
const resetScript = resolve(projectRoot, 'scripts/dev-reset.ts');
const setupScript = resolve(projectRoot, 'scripts/dev-setup.ts');

function runTsx(
  cwd: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [tsxCli, ...args], {
    cwd,
    encoding: 'utf8',
    env,
  });
}

async function createSetupFixture(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-reset-'));
  await cp(join(projectRoot, 'drizzle'), join(directory, 'drizzle'), { recursive: true });
  await cp(
    join(projectRoot, 'src/client/apps/blog/posts'),
    join(directory, 'src/client/apps/blog/posts'),
    { recursive: true },
  );
  return directory;
}

function isSymlinkUnavailable(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error
    && 'code' in error
    && ['EACCES', 'ENOSYS', 'EPERM'].includes(String(error.code));
}

async function symlinkOrSkip(
  context: TestContext,
  target: string,
  path: string,
  type?: 'dir' | 'file',
): Promise<boolean> {
  try {
    await symlink(target, path, type);
    return true;
  } catch (error) {
    if (!isSymlinkUnavailable(error)) throw error;
    context.skip(`symlinks are unavailable on this platform: ${error.code}`);
    return false;
  }
}

async function createSqliteSentinel(path: string): Promise<void> {
  const client = createClient({ url: `file:${path}` });
  try {
    await client.execute('CREATE TABLE external_sentinel (value TEXT PRIMARY KEY NOT NULL)');
    await client.execute({
      sql: 'INSERT INTO external_sentinel (value) VALUES (?)',
      args: ['must remain byte-for-byte unchanged'],
    });
  } finally {
    client.close();
  }
}

test('reset command refuses a symlinked .data directory before deleting an external database', async (context) => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-reset-link-'));
  const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-external-db-'));
  const externalDatabase = join(externalDirectory, 'dev.db');
  try {
    await writeFile(externalDatabase, 'external database must survive');
    if (!await symlinkOrSkip(context, externalDirectory, join(directory, '.data'), 'dir')) return;

    const result = runTsx(directory, [resetScript]);

    assert.notEqual(result.status, 0, result.stderr);
    assert.match(`${result.stdout}${result.stderr}`, /Refusing to delete/);
    assert.equal(await readFile(externalDatabase, 'utf8'), 'external database must survive');
  } finally {
    await rm(directory, { recursive: true, force: true });
    await rm(externalDirectory, { recursive: true, force: true });
  }
});

test('setup command refuses a symlinked .data directory before creating an external database', async (context) => {
  const directory = await createSetupFixture();
  const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-external-setup-'));
  try {
    if (!await symlinkOrSkip(context, externalDirectory, join(directory, '.data'), 'dir')) return;

    const result = runTsx(directory, [setupScript]);

    assert.notEqual(result.status, 0, result.stderr);
    assert.match(`${result.stdout}${result.stderr}`, /Refusing to delete through symbolic link/);
    await assert.rejects(readFile(join(externalDirectory, 'dev.db')));
  } finally {
    await rm(directory, { recursive: true, force: true });
    await rm(externalDirectory, { recursive: true, force: true });
  }
});

for (const suffix of ['', '-wal', '-shm'] as const) {
  const targetName = `dev.db${suffix}`;

  test(`setup command refuses a symlinked ${targetName} and preserves its external sentinel`, async (context) => {
    const directory = await createSetupFixture();
    const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-external-file-'));
    const externalSentinel = join(externalDirectory, `sentinel${suffix || '.db'}`);
    try {
      await mkdir(join(directory, '.data'), { recursive: true });
      if (suffix === '') {
        await createSqliteSentinel(externalSentinel);
      } else {
        await writeFile(externalSentinel, `external ${targetName} must survive`);
      }
      const before = await readFile(externalSentinel);
      if (!await symlinkOrSkip(
        context,
        externalSentinel,
        join(directory, '.data', targetName),
        'file',
      )) return;

      const result = runTsx(directory, [setupScript]);

      assert.notEqual(result.status, 0, result.stderr);
      assert.match(`${result.stdout}${result.stderr}`, /Refusing to use symbolic link/);
      assert.deepEqual(await readFile(externalSentinel), before);
    } finally {
      await rm(directory, { recursive: true, force: true });
      await rm(externalDirectory, { recursive: true, force: true });
    }
  });
}

for (const suffix of ['', '-wal', '-shm'] as const) {
  const targetName = `dev.db${suffix}`;

  test(`setup command refuses a non-regular ${targetName}`, async () => {
    const directory = await createSetupFixture();
    try {
      await mkdir(join(directory, '.data', targetName), { recursive: true });

      const result = runTsx(directory, [setupScript]);

      assert.notEqual(result.status, 0, result.stderr);
      assert.match(`${result.stdout}${result.stderr}`, /Refusing to use non-regular file/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

test('setup snapshots fixed local configuration before its first await', async () => {
  const directory = await createSetupFixture();
  const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-mutated-config-'));
  const externalDatabase = join(externalDirectory, 'outside.db');
  const runner = join(directory, 'mutate-config.mts');
  try {
    await writeFile(runner, `
      const { setupDevelopmentDatabase } = await import(${JSON.stringify(pathToFileURL(setupScript).href)});
      const config = {
        TURSO_DATABASE_URL: \`file:\${process.cwd()}/.data/dev.db\`,
        TURSO_AUTH_TOKEN: undefined,
        IS_LOCAL_DATABASE: true,
      };
      const setup = setupDevelopmentDatabase(config);
      config.TURSO_DATABASE_URL = ${JSON.stringify(`file:${externalDatabase}`)};
      await setup;
    `);

    const result = runTsx(directory, [runner]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal((await readFile(join(directory, '.data/dev.db'))).byteLength > 0, true);
    await assert.rejects(readFile(externalDatabase), /ENOENT/);
  } finally {
    await rm(directory, { recursive: true, force: true });
    await rm(externalDirectory, { recursive: true, force: true });
  }
});

test('setup rejects a local-marked external file URL before creating its database', async () => {
  const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-external-config-'));
  const externalDatabase = join(externalDirectory, 'outside.db');
  let failure: unknown;
  try {
    try {
      await setupDevelopmentDatabase({
        TURSO_DATABASE_URL: `file:${externalDatabase}`,
        TURSO_AUTH_TOKEN: undefined,
        IS_LOCAL_DATABASE: true,
      });
    } catch (error) {
      failure = error;
    }

    await assert.rejects(readFile(externalDatabase));
    assert.match(String(failure), /Refusing to set up unexpected database URL/);
  } finally {
    await rm(externalDirectory, { recursive: true, force: true });
  }
});

test('setup rejects a local-marked remote URL before contacting it for migrations', async () => {
  let requests = 0;
  const server = createServer((_request, response) => {
    requests += 1;
    response.writeHead(500);
    response.end('unexpected migration request');
  });
  await new Promise<void>((resolveServer, rejectServer) => {
    server.once('error', rejectServer);
    server.listen(0, '127.0.0.1', resolveServer);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not expose a TCP address');

  let failure: unknown;
  try {
    try {
      await setupDevelopmentDatabase({
        TURSO_DATABASE_URL: `http://127.0.0.1:${address.port}`,
        TURSO_AUTH_TOKEN: 'test-token',
        IS_LOCAL_DATABASE: true,
      });
    } catch (error) {
      failure = error;
    }

    assert.equal(requests, 0);
    assert.match(String(failure), /Refusing to set up unexpected database URL/);
  } finally {
    await new Promise<void>((resolveServer, rejectServer) => {
      server.close((error) => (error ? rejectServer(error) : resolveServer()));
    });
  }
});

test('reset command ignores an invalid configured database and recreates its local database', async () => {
  const directory = await createSetupFixture();
  const environment = {
    ...process.env,
    NODE_ENV: 'development',
    TURSO_DATABASE_URL: 'not-a-valid-database-url',
    TURSO_AUTH_TOKEN: 'ignored-by-reset',
  };
  try {
    const result = runTsx(directory, [resetScript], environment);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Local development database: \.data[\\/]dev\.db/);
    assert.equal((await readFile(join(directory, '.data/dev.db'))).byteLength > 0, true);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('importing the reset module does not delete an existing development database', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-reset-import-'));
  const database = join(directory, '.data/dev.db');
  const importer = join(directory, 'import-reset.mts');
  try {
    await mkdir(dirname(database), { recursive: true });
    await writeFile(database, 'database must survive import');
    await writeFile(
      importer,
      `import ${JSON.stringify(pathToFileURL(resetScript).href)};\nconsole.log('reset module imported');\n`,
    );

    const result = runTsx(directory, [importer]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /reset module imported/);
    assert.equal(await readFile(database, 'utf8'), 'database must survive import');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
