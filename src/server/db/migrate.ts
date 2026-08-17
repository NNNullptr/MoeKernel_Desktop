import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import type { Database } from './client';

export async function migrateDatabase(
  database: Database,
  migrationsFolder = resolve(process.cwd(), 'drizzle'),
): Promise<void> {
  await migrate(database, { migrationsFolder });
}
