import { unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertDevDatabaseTarget, devDatabaseSidecars } from '../src/server/db/dev-paths';
import { setupDevelopmentDatabase } from './dev-setup';

export async function resetDevelopmentDatabase(): Promise<void> {
  for (const file of devDatabaseSidecars()) {
    assertDevDatabaseTarget(file);
    await unlink(file).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
  const [databasePath] = devDatabaseSidecars();
  await setupDevelopmentDatabase({
    TURSO_DATABASE_URL: `file:${databasePath}`,
    TURSO_AUTH_TOKEN: undefined,
    IS_LOCAL_DATABASE: true,
  });
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(resolve(entryPath)).href) {
  await resetDevelopmentDatabase();
}
