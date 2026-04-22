/**
 * @file src/server/db/seed.ts
 * 初始化脚本：将 config 文件的默认数据同步写入 Turso 数据库。
 *
 * 策略：onConflictDoUpdate — 每次运行都将此文件的最新值覆盖写入 DB。
 *   适合开发阶段反复调整默认值后重新同步。
 *
 * 运行命令：pnpm db:seed
 *
 * 注意：
 *   - blog.config.ts 使用 Vite ?raw 导入，不兼容 Node.js 运行时。
 *     此处改用 fs.readFileSync 读取同一批 .md 文件，内容完全一致。
 *   - mascots 的 label 字段与 pets.config.ts 保持一致（值为单个空格 ' '）。
 *   - 数组类型（system_tray_icons）在存入前 JSON.stringify，取用时 JSON.parse。
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from 'drizzle-orm';
import { db } from './client';
import { blogPosts, desktopIcons, mascots, siteSettings } from './schema';

// ── 1. 站点设置（对应 theme.config.ts）────────────────────────────────────────

const SITE_SETTINGS = [
  {
    key:   'wallpaper_url',
    value: '/assets/wallpapers/wallpaper.jpg',
  },
  {
    key:   'windows_logo_url',
    value: 'https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico',
  },
  {
    key: 'system_tray_icons',
    value: JSON.stringify([
      'https://static.step1.dev/g9nbov/assets/f41de3abce9a.png',
      'https://static.step1.dev/g9nbov/assets/cff960cc7c15.png',
      'https://static.step1.dev/g9nbov/assets/a52bbbc23e20.png',
      '/assets/icons/tray/icon1.png',
      '/assets/icons/tray/icon2.png',
    ]),
  },
];

// ── 2. 博客文章（对应 blog.config.ts）────────────────────────────────────────

const postsDir = join(process.cwd(), 'src/client/apps/blog/posts');
const readPost = (filename: string) => readFileSync(join(postsDir, filename), 'utf-8');

const BLOG_POSTS_SEED = [
  {
    id:              'blog-hello-world',
    title:           'Hello World',
    icon:            '/assets/icons/Blog.png',
    backgroundImage: '/assets/wallpapers/bg4.jpg',
    bgOpacity:       1,
    content:         readPost('hello-world.md'),
    category:        '技术',
    order:           0,
  },
  {
    id:              'blog-xp-memories',
    title:           '1 Day',
    icon:            '/assets/icons/blog2.png',
    backgroundImage: '/assets/wallpapers/bg5.jpg',
    bgOpacity:       1,
    content:         readPost('windows-xp-memories.md'),
    category:        '生活',
    order:           1,
  },
];

// ── 3. 桌面图标（对应 icons.config.ts）───────────────────────────────────────

const DESKTOP_ICONS_SEED = [
  { id: 'myComputer',  label: 'My Computer',  src: '/assets/icons/My Computer.png' },
  { id: 'resume',      label: 'Resume',       src: '/assets/icons/Resume.png'      },
  { id: 'aboutme',     label: 'About Me',     src: '/assets/icons/About.png'       },
  { id: 'contact',     label: 'Contact Me',   src: '/assets/icons/Contact.png'     },
  { id: 'webamp',      label: 'Winamp',       src: '/assets/icons/Winamp.png'      },
  { id: 'paint',       label: 'Paint',        src: '/assets/icons/Paint.png'       },
  { id: 'gamesFolder', label: 'Games',        src: '/assets/icons/Games.png'       },
  { id: 'video',       label: 'Media Player', src: '/assets/icons/Media.png'       },
  { id: 'portfolio',   label: 'My Portfolio', src: '/assets/icons/Portfolio.png'   },
  { id: 'blog',        label: 'My Blog',      src: '/assets/icons/Blog.png'        },
  { id: 'recycleBin',  label: 'Recycle Bin',  src: '/assets/icons/Recycle.png'     },
].map((icon, index) => ({ ...icon, order: index, visible: true as const }));

// ── 4. 吉祥物（对应 pets.config.ts）──────────────────────────────────────────

const MASCOTS_SEED = [
  { id: 'pet_1',  iconSrc: '/assets/pets/avatars/1.png',  petSrc: '/assets/pets/sprites/20.png',  size: 140 },
  { id: 'pet_2',  iconSrc: '/assets/pets/avatars/5.png',  petSrc: '/assets/pets/sprites/21.png',  size: 120 },
  { id: 'pet_3',  iconSrc: '/assets/pets/avatars/3.png',  petSrc: '/assets/pets/sprites/1.gif',   size: 150 },
  { id: 'pet_4',  iconSrc: '/assets/pets/avatars/4.png',  petSrc: '/assets/pets/sprites/2.gif',   size: 200 },
  { id: 'pet_5',  iconSrc: '/assets/pets/avatars/6.png',  petSrc: '/assets/pets/sprites/3.gif',   size: 220 },
  { id: 'pet_6',  iconSrc: '/assets/pets/avatars/7.png',  petSrc: '/assets/pets/sprites/4.gif',   size: 260 },
  { id: 'pet_7',  iconSrc: '/assets/pets/avatars/8.png',  petSrc: '/assets/pets/sprites/5.png',   size: 150 },
  { id: 'pet_8',  iconSrc: '/assets/pets/avatars/9.png',  petSrc: '/assets/pets/sprites/6.gif',   size: 220 },
  { id: 'pet_9',  iconSrc: '/assets/pets/avatars/10.png', petSrc: '/assets/pets/sprites/7.gif',   size: 150 },
  { id: 'pet_10', iconSrc: '/assets/pets/avatars/11.png', petSrc: '/assets/pets/sprites/8.gif',   size: 200 },
  { id: 'pet_11', iconSrc: '/assets/pets/avatars/12.png', petSrc: '/assets/pets/sprites/9.gif',   size: 250 },
  { id: 'pet_12', iconSrc: '/assets/pets/avatars/13.png', petSrc: '/assets/pets/sprites/10.png',  size: 120 },
  { id: 'pet_13', iconSrc: '/assets/pets/avatars/14.png', petSrc: '/assets/pets/sprites/11.png',  size: 180 },
  { id: 'pet_14', iconSrc: '/assets/pets/avatars/15.png', petSrc: '/assets/pets/sprites/12.gif',  size: 180 },
  { id: 'pet_15', iconSrc: '/assets/pets/avatars/16.png', petSrc: '/assets/pets/sprites/13.gif',  size: 190 },
  { id: 'pet_16', iconSrc: '/assets/pets/avatars/17.png', petSrc: '/assets/pets/sprites/14.gif',  size: 230 },
  { id: 'pet_17', iconSrc: '/assets/pets/avatars/18.png', petSrc: '/assets/pets/sprites/15.png',  size: 200 },
  { id: 'pet_18', iconSrc: '/assets/pets/avatars/19.png', petSrc: '/assets/pets/sprites/16.png',  size: 200 },
  { id: 'pet_19', iconSrc: '/assets/pets/avatars/20.png', petSrc: '/assets/pets/sprites/17.gif',  size: 210 },
  { id: 'pet_20', iconSrc: '/assets/pets/avatars/21.png', petSrc: '/assets/pets/sprites/18.png',  size: 220 },
  { id: 'pet_21', iconSrc: '/assets/pets/avatars/22.png', petSrc: '/assets/pets/sprites/19.png',  size: 210 },
  { id: 'pet_22', iconSrc: '/assets/pets/avatars/23.png', petSrc: '/assets/pets/sprites/22.png',  size: 165 },
  { id: 'pet_23', iconSrc: '/assets/pets/avatars/24.png', petSrc: '/assets/pets/sprites/23.png',  size: 150 },
  { id: 'pet_24', iconSrc: '/assets/pets/avatars/25.png', petSrc: '/assets/pets/sprites/24.png',  size: 120 },
  { id: 'pet_25', iconSrc: '/assets/pets/avatars/26.png', petSrc: '/assets/pets/sprites/25.png',  size: 200 },
  { id: 'pet_26', iconSrc: '/assets/pets/avatars/27.png', petSrc: '/assets/pets/sprites/26.png',  size: 180 },
  { id: 'pet_27', iconSrc: '/assets/pets/avatars/28.png', petSrc: '/assets/pets/sprites/28.gif',  size: 250 },
  { id: 'pet_28', iconSrc: '/assets/pets/avatars/2.png',  petSrc: '/assets/pets/sprites/27.png',  size: 180 },
].map((m, index) => ({ ...m, label: ' ', order: index }));

// ── 写入 ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('[seed] 开始同步初始数据到 Turso...\n');

  // site_settings
  await db
    .insert(siteSettings)
    .values(SITE_SETTINGS)
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: sql`excluded.value` },
    });
  console.log(`[seed] ✅ site_settings   ${SITE_SETTINGS.length} 条`);

  // blog_posts — 保留原始 createdAt，不随每次 seed 覆盖
  await db
    .insert(blogPosts)
    .values(BLOG_POSTS_SEED)
    .onConflictDoUpdate({
      target: blogPosts.id,
      set: {
        title:           sql`excluded.title`,
        content:         sql`excluded.content`,
        category:        sql`excluded.category`,
        icon:            sql`excluded.icon`,
        backgroundImage: sql`excluded.background_image`,
        bgOpacity:       sql`excluded.bg_opacity`,
        order:           sql`excluded."order"`,
        // createdAt 不更新，保留首次插入时的时间戳
      },
    });
  console.log(`[seed] ✅ blog_posts      ${BLOG_POSTS_SEED.length} 条`);

  // desktop_icons
  await db
    .insert(desktopIcons)
    .values(DESKTOP_ICONS_SEED)
    .onConflictDoUpdate({
      target: desktopIcons.id,
      set: {
        label:   sql`excluded.label`,
        src:     sql`excluded.src`,
        order:   sql`excluded."order"`,
        visible: sql`excluded.visible`,
      },
    });
  console.log(`[seed] ✅ desktop_icons   ${DESKTOP_ICONS_SEED.length} 条`);

  // mascots
  await db
    .insert(mascots)
    .values(MASCOTS_SEED)
    .onConflictDoUpdate({
      target: mascots.id,
      set: {
        label:   sql`excluded.label`,
        iconSrc: sql`excluded.icon_src`,
        petSrc:  sql`excluded.pet_src`,
        size:    sql`excluded.size`,
        order:   sql`excluded."order"`,
      },
    });
  console.log(`[seed] ✅ mascots         ${MASCOTS_SEED.length} 条`);

  console.log('\n[seed] 全部完成。');
  process.exit(0);
}

seed().catch((err: unknown) => {
  console.error('[seed] 写入失败：', err);
  process.exit(1);
});
