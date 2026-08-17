import { loadEnvFileIfPresent } from './load-env-file';

loadEnvFileIfPresent();
const [{ createDatabase }, { env }, { seedDatabase }] = await Promise.all([
  import('../src/server/db/client'),
  import('../src/server/env'),
  import('../src/server/db/seed'),
]);
await seedDatabase(createDatabase(env));
