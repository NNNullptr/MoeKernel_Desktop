import { env } from '../env';
import { createDatabase } from './factory';

export { createDatabase } from './factory';
export type { Database, DatabaseConfig } from './factory';
export const db = createDatabase(env);
