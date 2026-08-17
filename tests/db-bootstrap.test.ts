import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { eq, sql } from 'drizzle-orm';
import { createDatabase } from '../src/server/db/client';
import { migrateDatabase } from '../src/server/db/migrate';
import { seedDatabase } from '../src/server/db/seed';
import { siteSettings } from '../src/server/db/schema';

test('migration creates eight business tables and seed never overwrites edits', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'moekernel-db-'));
  try {
    const database = createDatabase({
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
    await seedDatabase(database, { projectRoot: process.cwd(), log: () => undefined });

    const [wallpaper] = await database.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'wallpaper_url'));
    assert.equal(wallpaper?.value, '/custom-wallpaper.jpg');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
