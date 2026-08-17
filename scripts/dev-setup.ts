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
