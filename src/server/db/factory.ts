import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createClient } from '@libsql/client/node';
import { drizzle } from 'drizzle-orm/libsql';
import type { AppEnv } from '../env';
import * as schema from './schema';
import { fileDatabasePath, normalizeDatabaseUrlScheme } from './url';

export type DatabaseConfig = Pick<AppEnv, 'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN'>;

export function createDatabase(config: DatabaseConfig) {
  const databaseUrl = normalizeDatabaseUrlScheme(config.TURSO_DATABASE_URL);
  const localPath = fileDatabasePath(databaseUrl);
  if (localPath !== undefined) {
    mkdirSync(dirname(localPath), { recursive: true });
  }
  const client = createClient({
    url: databaseUrl,
    authToken: config.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDatabase>;
