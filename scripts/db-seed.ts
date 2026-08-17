import { createDatabase } from '../src/server/db/client';
import { env } from '../src/server/env';
import { seedDatabase } from '../src/server/db/seed';

await seedDatabase(createDatabase(env));
