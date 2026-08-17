import { createClient, type Client, type ResultSet, type Value } from '@libsql/client/node';
import { sql } from 'drizzle-orm';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { readMigrationFiles, type MigrationMeta } from 'drizzle-orm/migrator';
import type { Database } from './factory';

const BUSINESS_TABLES = [
  'blog_posts',
  'chat_messages',
  'desktop_icons',
  'documents',
  'mascots',
  'media_tracks',
  'portfolio_items',
  'site_settings',
] as const;

const MIGRATIONS_TABLE = '__drizzle_migrations';

function normalizedValue(value: Value | undefined): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value instanceof ArrayBuffer) return `arraybuffer:${value.byteLength}`;
  return `${typeof value}:${String(value)}`;
}

function normalizedRows(result: ResultSet): string[][] {
  return result.rows.map((row) => result.columns.map((column) => normalizedValue(row[column])));
}

function sqlTokens(statement: string | null): string[] {
  if (statement === null) return [];
  const tokens: string[] = [];
  let index = 0;
  while (index < statement.length) {
    const character = statement[index];
    if (character === undefined) break;
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (character === ';') {
      index += 1;
      continue;
    }
    if (character === "'" || character === '"' || character === '`' || character === '[') {
      const opening = character;
      const closing = opening === '[' ? ']' : opening;
      let token = opening === "'" ? "'" : '';
      index += 1;
      while (index < statement.length) {
        const current = statement[index];
        if (current === undefined) break;
        if (current === closing) {
          const next = statement[index + 1];
          if (opening !== '[' && next === closing) {
            token += opening === "'" ? `${closing}${closing}` : closing;
            index += 2;
            continue;
          }
          if (opening === "'") token += closing;
          index += 1;
          break;
        }
        token += opening === "'" ? current : current.toLowerCase();
        index += 1;
      }
      tokens.push(token);
      continue;
    }
    if ('(),'.includes(character)) {
      tokens.push(character);
      index += 1;
      continue;
    }
    let token = '';
    while (index < statement.length) {
      const current = statement[index];
      if (current === undefined || /\s/.test(current) || "'\"`[](),;".includes(current)) break;
      token += current.toLowerCase();
      index += 1;
    }
    if (token) {
      tokens.push(token);
    } else {
      tokens.push(character.toLowerCase());
      index += 1;
    }
  }

  const tableIndex = tokens.indexOf('table');
  if (tableIndex >= 0
    && tokens[tableIndex + 1] === 'if'
    && tokens[tableIndex + 2] === 'not'
    && tokens[tableIndex + 3] === 'exists') {
    tokens.splice(tableIndex + 1, 3);
  }
  return tokens;
}

function sqliteIdentifier(identifier: string): string {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function tableSignature(client: Client, tableName: string): Promise<string> {
  const table = sqliteIdentifier(tableName);
  const master = await client.execute({
    sql: 'SELECT sql FROM sqlite_master WHERE type = ? AND name = ?',
    args: ['table', tableName],
  });
  const createStatement = master.rows[0]?.sql;
  const columns = await client.execute(`PRAGMA table_xinfo(${table})`);
  const foreignKeys = await client.execute(`PRAGMA foreign_key_list(${table})`);
  const indexes = await client.execute(`PRAGMA index_list(${table})`);
  const indexColumns: Array<{ name: string; rows: string[][] }> = [];
  for (const indexRow of indexes.rows) {
    const indexName = indexRow.name;
    if (typeof indexName !== 'string') {
      throw new Error(`[db:migrate] Could not inspect an index on ${tableName}`);
    }
    indexColumns.push({
      name: indexName,
      rows: normalizedRows(await client.execute(`PRAGMA index_xinfo(${sqliteIdentifier(indexName)})`)),
    });
  }

  return JSON.stringify({
    createTokens: sqlTokens(typeof createStatement === 'string' ? createStatement : null),
    columns: normalizedRows(columns),
    foreignKeys: normalizedRows(foreignKeys),
    indexes: normalizedRows(indexes),
    indexColumns,
  });
}

async function existingBusinessTables(database: Database): Promise<string[]> {
  const rows = await database.all<{ name: string }>(sql`
    SELECT name FROM sqlite_master
    WHERE type = 'table'
      AND name IN ('site_settings', 'blog_posts', 'desktop_icons', 'mascots',
                   'chat_messages', 'media_tracks', 'portfolio_items', 'documents')
    ORDER BY name
  `);
  return rows.map((row) => row.name);
}

async function hasAppliedMigration(database: Database): Promise<boolean> {
  const migrationTables = await database.all<{ name: string }>(sql`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name = '__drizzle_migrations'
  `);
  if (migrationTables.length === 0) return false;
  const rows = await database.all<{ count: number }>(sql`
    SELECT count(*) AS count FROM __drizzle_migrations
  `);
  return Number(rows[0]?.count ?? 0) > 0;
}

async function matchesBaselineSchema(database: Database, baseline: MigrationMeta): Promise<boolean> {
  const referenceClient = createClient({ url: 'file::memory:' });
  try {
    await referenceClient.migrate(baseline.sql.filter((statement) => statement.trim().length > 0));
    for (const tableName of BUSINESS_TABLES) {
      const [actual, expected] = await Promise.all([
        tableSignature(database.$client, tableName),
        tableSignature(referenceClient, tableName),
      ]);
      if (actual !== expected) return false;
    }
    return true;
  } finally {
    referenceClient.close();
  }
}

async function adoptUnjournaledBaseline(
  database: Database,
  migrationsFolder: string,
): Promise<void> {
  if (await hasAppliedMigration(database)) return;

  const tables = await existingBusinessTables(database);
  if (tables.length === 0) return;
  if (tables.length !== BUSINESS_TABLES.length) {
    throw new Error('[db:migrate] Existing database has only part of the baseline schema; refusing to modify it.');
  }

  const [baseline] = readMigrationFiles({ migrationsFolder });
  if (!baseline) {
    throw new Error('[db:migrate] Cannot adopt an existing schema without a baseline migration.');
  }
  if (!await matchesBaselineSchema(database, baseline)) {
    throw new Error('[db:migrate] Existing database schema does not exactly match the baseline; refusing to journal it.');
  }

  await database.$client.batch([
    `CREATE TABLE IF NOT EXISTS ${sqliteIdentifier(MIGRATIONS_TABLE)} (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at numeric
    )`,
    {
      sql: `INSERT INTO ${sqliteIdentifier(MIGRATIONS_TABLE)} (hash, created_at)
        SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM ${sqliteIdentifier(MIGRATIONS_TABLE)})`,
      args: [baseline.hash, baseline.folderMillis],
    },
  ], 'write');
}

export async function migrateDatabase(
  database: Database,
  migrationsFolder = resolve(process.cwd(), 'drizzle'),
): Promise<void> {
  await adoptUnjournaledBaseline(database, migrationsFolder);
  await migrate(database, { migrationsFolder });
}
