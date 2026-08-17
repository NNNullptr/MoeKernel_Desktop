import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { eq, sql } from 'drizzle-orm';
import { createDatabase } from '../src/server/db/client';
import { migrateDatabase } from '../src/server/db/migrate';
import { seedDatabase } from '../src/server/db/seed';
import { blogPosts, desktopIcons, mascots, siteSettings } from '../src/server/db/schema';

test('migration creates eight business tables and seed preserves edits while restoring missing defaults', async () => {
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
    await rm(directory, { recursive: true, force: true });
  }
});
