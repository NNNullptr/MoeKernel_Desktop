import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { eq, sql } from 'drizzle-orm';
import { createDatabase, type Database } from '../src/server/db/factory';
import { assertDevDatabaseTarget, devDatabaseSidecars } from '../src/server/db/dev-paths';
import { migrateDatabase } from '../src/server/db/migrate';
import { seedDatabase } from '../src/server/db/seed';
import { DEV_DATABASE_PATH } from '../src/server/env';
import { blogPosts, desktopIcons, mascots, siteSettings } from '../src/server/db/schema';

const businessTables = [
  'blog_posts',
  'chat_messages',
  'desktop_icons',
  'documents',
  'mascots',
  'media_tracks',
  'portfolio_items',
  'site_settings',
] as const;

async function readBaseline(): Promise<string> {
  return readFile(join(process.cwd(), 'drizzle/0000_baseline.sql'), 'utf8');
}

async function createPushedSchemaWithoutJournal(database: Database): Promise<string> {
  const baseline = await readBaseline();
  await database.$client.executeMultiple(baseline.replaceAll('--> statement-breakpoint', ''));
  return baseline;
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

async function insertExistingDeploymentData(database: Database): Promise<void> {
  await database.$client.executeMultiple(`
    INSERT INTO site_settings (key, value) VALUES ('existing-setting', 'keep-setting');
    INSERT INTO blog_posts
      (id, title, content, category, icon, background_image, bg_opacity, "order")
      VALUES ('existing-blog', 'Keep blog', 'keep-blog', 'existing', '/icon.png', '', 1, 0);
    INSERT INTO desktop_icons (id, label, src, "order", visible)
      VALUES ('existing-icon', 'Keep icon', '/icon.png', 0, 1);
    INSERT INTO mascots (id, label, icon_src, pet_src, size, "order")
      VALUES ('existing-mascot', 'Keep mascot', '/icon.png', '/pet.png', 80, 0);
    INSERT INTO chat_messages (id, name, content, ip_hash, is_pinned)
      VALUES ('existing-message', 'Keep name', 'keep-message', 'hash', 0);
    INSERT INTO media_tracks (id, title, artist, src, cover, type, "order", visible)
      VALUES ('existing-track', 'Keep track', 'artist', '/track.mp3', '/cover.png', 'audio', 0, 1);
    INSERT INTO portfolio_items
      (id, title, description, tech_stack, image_url, category, "order", visible)
      VALUES ('existing-portfolio', 'Keep portfolio', 'description', 'stack', '/image.png', 'existing', 0, 1);
    INSERT INTO documents
      (id, title, icon_src, content, bg_url, bg_opacity, "order", visible)
      VALUES ('existing-document', 'Keep document', '/icon.png', 'keep-document', '', 0.12, 0, 1);
  `);
}

async function tableRowCounts(database: Database): Promise<Array<{ name: string; rows: number }>> {
  return database.all<{ name: string; rows: number }>(sql`
    SELECT 'blog_posts' AS name, count(*) AS rows FROM blog_posts
    UNION ALL SELECT 'chat_messages', count(*) FROM chat_messages
    UNION ALL SELECT 'desktop_icons', count(*) FROM desktop_icons
    UNION ALL SELECT 'documents', count(*) FROM documents
    UNION ALL SELECT 'mascots', count(*) FROM mascots
    UNION ALL SELECT 'media_tracks', count(*) FROM media_tracks
    UNION ALL SELECT 'portfolio_items', count(*) FROM portfolio_items
    UNION ALL SELECT 'site_settings', count(*) FROM site_settings
    ORDER BY name
  `);
}

test('reset boundary accepts only the fixed local database path', () => {
  assert.doesNotThrow(() => assertDevDatabaseTarget(DEV_DATABASE_PATH));
  assert.throws(() => assertDevDatabaseTarget(resolve('.data/other.db')), /Refusing to delete/);
  assert.throws(() => assertDevDatabaseTarget(resolve('.data')), /Refusing to delete/);
  assert.deepEqual(devDatabaseSidecars(), [
    DEV_DATABASE_PATH,
    `${DEV_DATABASE_PATH}-wal`,
    `${DEV_DATABASE_PATH}-shm`,
  ]);
});

test('database factory recognizes a mixed-case file scheme before opening SQLite', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-mixed-file-'));
  let database: Database | undefined;
  try {
    database = createDatabase({
      TURSO_DATABASE_URL: `FiLe:${join(directory, 'nested/dev.db')}`,
      TURSO_AUTH_TOKEN: undefined,
    });

    const result = await database.all<{ answer: number }>(sql`SELECT 42 AS answer`);
    assert.equal(result[0]?.answer, 42);
  } finally {
    database?.$client.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('migration adopts an accurate pushed eight-table schema without a journal or data loss', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-adopt-baseline-'));
  let database: Database | undefined;
  try {
    database = createDatabase({
      TURSO_DATABASE_URL: `file:${join(directory, 'existing.db')}`,
      TURSO_AUTH_TOKEN: undefined,
    });
    const baseline = await createPushedSchemaWithoutJournal(database);
    await insertExistingDeploymentData(database);

    assert.deepEqual(await existingBusinessTables(database), [...businessTables]);
    assert.equal((await database.all<{ name: string }>(sql`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name = '__drizzle_migrations'
    `)).length, 0);

    await migrateDatabase(database);
    await migrateDatabase(database);

    assert.deepEqual(
      await tableRowCounts(database),
      businessTables.map((name) => ({ name, rows: 1 })),
    );
    const [setting] = await database.select().from(siteSettings)
      .where(eq(siteSettings.key, 'existing-setting'));
    assert.equal(setting?.value, 'keep-setting');

    const journal = await database.all<{ hash: string; created_at: number }>(sql`
      SELECT hash, created_at FROM __drizzle_migrations ORDER BY created_at
    `);
    assert.deepEqual(journal, [{
      hash: createHash('sha256').update(baseline).digest('hex'),
      created_at: 1786979083195,
    }]);
  } finally {
    database?.$client.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('migration refuses to journal a pushed schema that differs from the baseline', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-reject-baseline-'));
  let database: Database | undefined;
  try {
    database = createDatabase({
      TURSO_DATABASE_URL: `file:${join(directory, 'mismatched.db')}`,
      TURSO_AUTH_TOKEN: undefined,
    });
    await createPushedSchemaWithoutJournal(database);
    await database.run(sql`ALTER TABLE site_settings ADD COLUMN unexpected TEXT`);
    await database.run(sql`
      INSERT INTO site_settings (key, value) VALUES ('existing-setting', 'keep-setting')
    `);

    await assert.rejects(
      migrateDatabase(database),
      /existing database schema does not exactly match the baseline/i,
    );

    const [setting] = await database.select().from(siteSettings)
      .where(eq(siteSettings.key, 'existing-setting'));
    assert.equal(setting?.value, 'keep-setting');
    const journalTables = await database.all<{ name: string }>(sql`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name = '__drizzle_migrations'
    `);
    assert.equal(journalTables.length, 0);
  } finally {
    database?.$client.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('migration refuses a partial pushed schema without creating other tables or a journal', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-partial-baseline-'));
  let database: Database | undefined;
  try {
    database = createDatabase({
      TURSO_DATABASE_URL: `file:${join(directory, 'partial.db')}`,
      TURSO_AUTH_TOKEN: undefined,
    });
    await database.$client.executeMultiple(`
      CREATE TABLE site_settings (
        key text PRIMARY KEY NOT NULL,
        value text NOT NULL
      );
      INSERT INTO site_settings (key, value) VALUES ('existing-setting', 'keep-setting');
    `);

    await assert.rejects(
      migrateDatabase(database),
      /existing database has only part of the baseline schema/i,
    );

    assert.deepEqual(await existingBusinessTables(database), ['site_settings']);
    const [setting] = await database.select().from(siteSettings)
      .where(eq(siteSettings.key, 'existing-setting'));
    assert.equal(setting?.value, 'keep-setting');
    const journalTables = await database.all<{ name: string }>(sql`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name = '__drizzle_migrations'
    `);
    assert.equal(journalTables.length, 0);
  } finally {
    database?.$client.close();
    await rm(directory, { recursive: true, force: true });
  }
});

test('migration creates eight business tables and seed preserves edits while restoring missing defaults', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-db-'));
  let database: Database | undefined;
  try {
    database = createDatabase({
      TURSO_DATABASE_URL: `file:${join(directory, 'dev.db')}`,
      TURSO_AUTH_TOKEN: undefined,
    });
    await migrateDatabase(database);
    await seedDatabase(database, { projectRoot: process.cwd(), log: () => undefined });

    const tableRows = await database.all<{ name: string }>(sql`
      SELECT name FROM sqlite_master
      WHERE type = 'table'
        AND name IN ('site_settings', 'blog_posts', 'desktop_icons', 'mascots',
                     'chat_messages', 'media_tracks', 'portfolio_items', 'documents')
    `);
    assert.equal(tableRows.length, 8);

    await database.update(siteSettings)
      .set({ value: '/custom-wallpaper.jpg' })
      .where(eq(siteSettings.key, 'wallpaper_url'));
    await database.update(blogPosts)
      .set({ title: 'My edited blog post', content: 'User-authored blog content.' })
      .where(eq(blogPosts.id, 'blog-xp-memories'));
    await database.update(desktopIcons)
      .set({ label: 'My custom Resume icon' })
      .where(eq(desktopIcons.id, 'resume'));
    await database.update(mascots)
      .set({ label: 'My custom mascot' })
      .where(eq(mascots.id, 'pet_1'));
    await database.delete(siteSettings)
      .where(eq(siteSettings.key, 'windows_logo_url'));
    await seedDatabase(database, { projectRoot: process.cwd(), log: () => undefined });

    const [wallpaper] = await database.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'wallpaper_url'));
    const [restoredLogo] = await database.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'windows_logo_url'));
    assert.equal(wallpaper?.value, '/custom-wallpaper.jpg');
    assert.equal(restoredLogo?.value, 'https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico');

    const [helloWorldPost] = await database.select()
      .from(blogPosts)
      .where(eq(blogPosts.id, 'blog-hello-world'));
    const [editedPost] = await database.select()
      .from(blogPosts)
      .where(eq(blogPosts.id, 'blog-xp-memories'));
    assert.equal(helloWorldPost?.title, 'Hello World');
    assert.equal(helloWorldPost?.content, await readFile(
      join(process.cwd(), 'src/client/apps/blog/posts/hello-world.md'),
      'utf8',
    ));
    assert.equal(editedPost?.title, 'My edited blog post');
    assert.equal(editedPost?.content, 'User-authored blog content.');

    const [editedIcon] = await database.select()
      .from(desktopIcons)
      .where(eq(desktopIcons.id, 'resume'));
    assert.equal(editedIcon?.label, 'My custom Resume icon');

    const [editedMascot] = await database.select()
      .from(mascots)
      .where(eq(mascots.id, 'pet_1'));
    assert.equal(editedMascot?.label, 'My custom mascot');

    const [settingsCount] = await database.select({ count: sql<number>`count(*)` }).from(siteSettings);
    const [postsCount] = await database.select({ count: sql<number>`count(*)` }).from(blogPosts);
    const [iconsCount] = await database.select({ count: sql<number>`count(*)` }).from(desktopIcons);
    const [mascotsCount] = await database.select({ count: sql<number>`count(*)` }).from(mascots);
    assert.equal(settingsCount?.count, 3);
    assert.equal(postsCount?.count, 2);
    assert.equal(iconsCount?.count, 11);
    assert.equal(mascotsCount?.count, 28);
  } finally {
    database?.$client.close();
    await rm(directory, { recursive: true, force: true });
  }
});
