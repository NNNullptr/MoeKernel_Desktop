import { loadEnvFileIfPresent } from './load-env-file';

loadEnvFileIfPresent();
const [{ createDatabase }, { env }, { migrateDatabase }] = await Promise.all([
  import('../src/server/db/client'),
  import('../src/server/env'),
  import('../src/server/db/migrate'),
]);
await migrateDatabase(createDatabase(env));
console.log(`[db:migrate] Applied migrations to ${env.TURSO_DATABASE_URL}`);
