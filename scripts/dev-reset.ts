import { unlink } from 'node:fs/promises';
import { assertDevDatabaseTarget, devDatabaseSidecars } from '../src/server/db/dev-paths';
import { DEV_DATABASE_PATH, resolveEnv } from '../src/server/env';
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
