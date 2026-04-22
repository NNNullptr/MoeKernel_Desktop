import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/http';
import { env } from '../env';
import * as schema from './schema';

const libsql = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(libsql, { schema });
