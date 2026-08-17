import assert from 'node:assert/strict';
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
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
  await symlink(join(projectRoot, 'drizzle'), join(directory, 'drizzle'), 'dir');
  await mkdir(join(directory, 'src/client/apps/blog'), { recursive: true });
  await symlink(
    join(projectRoot, 'src/client/apps/blog/posts'),
    join(directory, 'src/client/apps/blog/posts'),
    'dir',
  );
  return directory;
}

test('reset command refuses a symlinked .data directory before deleting an external database', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-reset-link-'));
  const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-external-db-'));
  const externalDatabase = join(externalDirectory, 'dev.db');
  try {
    await writeFile(externalDatabase, 'external database must survive');
    await symlink(externalDirectory, join(directory, '.data'), 'dir');

    const result = runTsx(directory, [resetScript]);

    assert.notEqual(result.status, 0, result.stderr);
    assert.match(`${result.stdout}${result.stderr}`, /Refusing to delete/);
    assert.equal(await readFile(externalDatabase, 'utf8'), 'external database must survive');
  } finally {
    await rm(directory, { recursive: true, force: true });
    await rm(externalDirectory, { recursive: true, force: true });
  }
});

test('setup command refuses a symlinked .data directory before creating an external database', async () => {
  const directory = await createSetupFixture();
  const externalDirectory = await mkdtemp(join(tmpdir(), 'moekernel-external-setup-'));
  try {
    await symlink(externalDirectory, join(directory, '.data'), 'dir');

    const result = runTsx(directory, [setupScript]);

    assert.notEqual(result.status, 0, result.stderr);
    assert.match(`${result.stdout}${result.stderr}`, /Refusing to delete through symbolic link/);
    await assert.rejects(readFile(join(externalDirectory, 'dev.db')));
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
    assert.match(result.stdout, /Local development database: .data\/dev\.db/);
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
