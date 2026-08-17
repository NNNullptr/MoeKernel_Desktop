import { mkdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertDevDatabaseTarget, devDatabaseSidecars } from '../src/server/db/dev-paths';
import type { AppEnv } from '../src/server/env';

type DevelopmentDatabaseConfig = Pick<AppEnv,
  'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN' | 'IS_LOCAL_DATABASE'>;

export async function setupDevelopmentDatabase(config?: DevelopmentDatabaseConfig): Promise<void> {
  const activeConfig = config ?? (await import('../src/server/env')).env;
  if (!activeConfig.IS_LOCAL_DATABASE) {
    console.log(`[dev:setup] Using configured Turso database: ${activeConfig.TURSO_DATABASE_URL}`);
    console.log('[dev:setup] Remote migrations remain explicit; run pnpm db:migrate when intended.');
    return;
  }

  const [databasePath] = devDatabaseSidecars();
  await mkdir(dirname(databasePath), { recursive: true });
  assertDevDatabaseTarget(databasePath);
  const [{ createDatabase }, { migrateDatabase }, { seedDatabase }] = await Promise.all([
    import('../src/server/db/factory'),
    import('../src/server/db/migrate'),
    import('../src/server/db/seed'),
  ]);
  const database = createDatabase(activeConfig);
  await migrateDatabase(database);
  await seedDatabase(database);
  console.log(`[dev:setup] Local development database: ${relative(process.cwd(), databasePath)}`);
  console.log('[dev:setup] Admin URL: http://localhost:3000/admin');
  console.log('[dev:setup] Development password: admin');
  console.warn('[dev:setup] Development mode only — do not use these defaults in production.');
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(resolve(entryPath)).href) {
  await setupDevelopmentDatabase();
}
