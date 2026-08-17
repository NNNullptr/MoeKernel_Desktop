import { lstatSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

function pathsEqual(left: string, right: string): boolean {
  return process.platform === 'win32'
    ? left.toLowerCase() === right.toLowerCase()
    : left === right;
}

function assertCanonicalParent(target: string): void {
  const parentDirectory = dirname(target);
  try {
    const parent = lstatSync(parentDirectory);
    if (parent.isSymbolicLink() || !parent.isDirectory()) {
      throw new Error(`[dev:reset] Refusing to delete through symbolic link or non-directory: ${target}`);
    }
    if (!pathsEqual(realpathSync(parentDirectory), parentDirectory)) {
      throw new Error(`[dev:reset] Refusing to delete through symbolic link: ${target}`);
    }
  } catch (error) {
    if (isErrnoException(error) && error.code === 'ENOENT') return;
    throw error;
  }
}

function assertExistingRegularFile(target: string): void {
  try {
    const stats = lstatSync(target);
    if (stats.isSymbolicLink()) {
      throw new Error(`[dev:setup] Refusing to use symbolic link: ${target}`);
    }
    if (!stats.isFile()) {
      throw new Error(`[dev:setup] Refusing to use non-regular file: ${target}`);
    }
  } catch (error) {
    if (isErrnoException(error) && error.code === 'ENOENT') return;
    throw error;
  }
}

export function assertDevDatabaseTarget(target: string): void {
  const resolvedTarget = resolve(target);
  if (!devDatabaseSidecars().includes(resolvedTarget)) {
    throw new Error(`[dev:reset] Refusing to delete unexpected path: ${target}`);
  }

  assertCanonicalParent(resolvedTarget);
  assertExistingRegularFile(resolvedTarget);
  assertCanonicalParent(resolvedTarget);
}

export function assertSafeDevDatabaseFiles(): void {
  const targets = devDatabaseSidecars();
  assertCanonicalParent(targets[0]);
  for (const target of targets) {
    assertExistingRegularFile(target);
  }
  assertCanonicalParent(targets[0]);
}

export function devDatabaseSidecars(): [string, string, string] {
  const databasePath = resolve(process.cwd(), '.data/dev.db');
  return [databasePath, `${databasePath}-wal`, `${databasePath}-shm`];
}
