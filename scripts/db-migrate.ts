import { loadEnvFileIfPresent } from './load-env-file';
import { createDatabase } from '../src/server/db/factory';
import { migrateDatabase } from '../src/server/db/migrate';
import { resolveExplicitRemoteDatabaseConfig } from '../src/server/db/remote-config';

loadEnvFileIfPresent();
const config = resolveExplicitRemoteDatabaseConfig(process.env);
const database = createDatabase(config);
try {
  await migrateDatabase(database);
  console.log(`[db:migrate] Applied migrations to ${config.TURSO_DATABASE_URL}`);
} finally {
  database.$client.close();
}
