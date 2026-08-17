import type { DatabaseConfig } from './factory';
import { databaseUrlScheme, isFileDatabaseUrl, normalizeDatabaseUrlScheme } from './url';

export type DatabaseEnvSource = Record<string, string | undefined>;

const REMOTE_DATABASE_SCHEMES = new Set(['http', 'https', 'libsql', 'ws', 'wss']);

export function resolveExplicitRemoteDatabaseConfig(
  source: DatabaseEnvSource,
): Readonly<DatabaseConfig> {
  const databaseUrl = source.TURSO_DATABASE_URL?.trim();
  const authToken = source.TURSO_AUTH_TOKEN?.trim();

  if (!databaseUrl || !authToken) {
    throw new Error(
      '[db:config] TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required for an explicit remote database.',
    );
  }
  if (isFileDatabaseUrl(databaseUrl)) {
    throw new Error('[db:config] An explicit remote database cannot use a file: URL.');
  }
  const scheme = databaseUrlScheme(databaseUrl);
  if (!scheme || !REMOTE_DATABASE_SCHEMES.has(scheme)) {
    throw new Error('[db:config] TURSO_DATABASE_URL must be an explicit remote database URL.');
  }

  return Object.freeze({
    TURSO_DATABASE_URL: normalizeDatabaseUrlScheme(databaseUrl),
    TURSO_AUTH_TOKEN: authToken,
  });
}
