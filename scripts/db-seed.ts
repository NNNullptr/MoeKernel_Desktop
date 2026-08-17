import { loadEnvFileIfPresent } from './load-env-file';
import { createDatabase } from '../src/server/db/factory';
import { resolveExplicitRemoteDatabaseConfig } from '../src/server/db/remote-config';
import { seedDatabase } from '../src/server/db/seed';

loadEnvFileIfPresent();
const config = resolveExplicitRemoteDatabaseConfig(process.env);
const database = createDatabase(config);
try {
  await seedDatabase(database);
} finally {
  database.$client.close();
}
