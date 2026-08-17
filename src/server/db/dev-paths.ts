import { lstatSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function assertDevDatabaseTarget(target: string): void {
  const resolvedTarget = resolve(target);
  if (!devDatabaseSidecars().includes(resolvedTarget)) {
    throw new Error(`[dev:reset] Refusing to delete unexpected path: ${target}`);
  }

  const parentDirectory = dirname(resolvedTarget);
  try {
    if (lstatSync(parentDirectory).isSymbolicLink() || realpathSync(parentDirectory) !== parentDirectory) {
      throw new Error(`[dev:reset] Refusing to delete through symbolic link: ${target}`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
}

export function devDatabaseSidecars(): [string, string, string] {
  const databasePath = resolve(process.cwd(), '.data/dev.db');
  return [databasePath, `${databasePath}-wal`, `${databasePath}-shm`];
}
