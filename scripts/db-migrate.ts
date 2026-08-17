import { createDatabase } from '../src/server/db/client';
import { env } from '../src/server/env';
import { migrateDatabase } from '../src/server/db/migrate';

await migrateDatabase(createDatabase(env));
console.log(`[db:migrate] Applied migrations to ${env.TURSO_DATABASE_URL}`);
