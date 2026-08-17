import { resolve } from 'node:path';
import { DEV_DATABASE_PATH } from '../env';

export function assertDevDatabaseTarget(target: string): void {
  if (resolve(target) !== DEV_DATABASE_PATH) {
    throw new Error(`[dev:reset] Refusing to delete unexpected path: ${target}`);
  }
}

export function devDatabaseSidecars(): string[] {
  return [DEV_DATABASE_PATH, `${DEV_DATABASE_PATH}-wal`, `${DEV_DATABASE_PATH}-shm`];
}
