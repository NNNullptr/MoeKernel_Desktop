import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createClient } from '@libsql/client/node';
import { drizzle } from 'drizzle-orm/libsql';
import type { AppEnv } from '../env';
import * as schema from './schema';

export type DatabaseConfig = Pick<AppEnv, 'TURSO_DATABASE_URL' | 'TURSO_AUTH_TOKEN'>;

export function createDatabase(config: DatabaseConfig) {
  if (config.TURSO_DATABASE_URL.startsWith('file:')) {
    mkdirSync(dirname(config.TURSO_DATABASE_URL.slice('file:'.length)), { recursive: true });
  }
  const client = createClient({
    url: config.TURSO_DATABASE_URL,
    authToken: config.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDatabase>;
