import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Database } from './client';
import { blogPosts, desktopIcons, mascots, siteSettings } from './schema';

export interface SeedOptions {
  projectRoot?: string;
  log?: (message: string) => void;
}

const SITE_SETTINGS = [
  { key: 'wallpaper_url', value: '/assets/wallpapers/wallpaper.jpg' },
  { key: 'windows_logo_url', value: 'https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico' },
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

const BLOG_POST_METADATA = [
  {
    id: 'blog-hello-world',
    title: 'Hello World',
    icon: '/assets/icons/Blog.png',
    backgroundImage: '/assets/wallpapers/bg4.jpg',
    bgOpacity: 1,
    filename: 'hello-world.md',
    category: '技术',
    order: 0,
  },
  {
    id: 'blog-xp-memories',
    title: '1 Day',
    icon: '/assets/icons/blog2.png',
    backgroundImage: '/assets/wallpapers/bg5.jpg',
    bgOpacity: 1,
    filename: 'windows-xp-memories.md',
    category: '生活',
    order: 1,
  },
];

const DESKTOP_ICONS_SEED = [
  { id: 'myComputer', label: 'My Computer', src: '/assets/icons/My Computer.png' },
  { id: 'resume', label: 'Resume', src: '/assets/icons/Resume.png' },
  { id: 'aboutme', label: 'About Me', src: '/assets/icons/About.png' },
  { id: 'contact', label: 'Contact Me', src: '/assets/icons/Contact.png' },
  { id: 'webamp', label: 'Winamp', src: '/assets/icons/Winamp.png' },
  { id: 'paint', label: 'Paint', src: '/assets/icons/Paint.png' },
  { id: 'gamesFolder', label: 'Games', src: '/assets/icons/Games.png' },
  { id: 'video', label: 'Media Player', src: '/assets/icons/Media.png' },
  { id: 'portfolio', label: 'My Portfolio', src: '/assets/icons/Portfolio.png' },
  { id: 'blog', label: 'My Blog', src: '/assets/icons/Blog.png' },
  { id: 'recycleBin', label: 'Recycle Bin', src: '/assets/icons/Recycle.png' },
].map((icon, index) => ({ ...icon, order: index, visible: true as const }));

const MASCOTS_SEED = [
  { id: 'pet_1', iconSrc: '/assets/pets/avatars/1.png', petSrc: '/assets/pets/sprites/20.png', size: 140 },
  { id: 'pet_2', iconSrc: '/assets/pets/avatars/5.png', petSrc: '/assets/pets/sprites/21.png', size: 120 },
  { id: 'pet_3', iconSrc: '/assets/pets/avatars/3.png', petSrc: '/assets/pets/sprites/1.gif', size: 150 },
  { id: 'pet_4', iconSrc: '/assets/pets/avatars/4.png', petSrc: '/assets/pets/sprites/2.gif', size: 200 },
  { id: 'pet_5', iconSrc: '/assets/pets/avatars/6.png', petSrc: '/assets/pets/sprites/3.gif', size: 220 },
  { id: 'pet_6', iconSrc: '/assets/pets/avatars/7.png', petSrc: '/assets/pets/sprites/4.gif', size: 260 },
  { id: 'pet_7', iconSrc: '/assets/pets/avatars/8.png', petSrc: '/assets/pets/sprites/5.png', size: 150 },
  { id: 'pet_8', iconSrc: '/assets/pets/avatars/9.png', petSrc: '/assets/pets/sprites/6.gif', size: 220 },
  { id: 'pet_9', iconSrc: '/assets/pets/avatars/10.png', petSrc: '/assets/pets/sprites/7.gif', size: 150 },
  { id: 'pet_10', iconSrc: '/assets/pets/avatars/11.png', petSrc: '/assets/pets/sprites/8.gif', size: 200 },
  { id: 'pet_11', iconSrc: '/assets/pets/avatars/12.png', petSrc: '/assets/pets/sprites/9.gif', size: 250 },
  { id: 'pet_12', iconSrc: '/assets/pets/avatars/13.png', petSrc: '/assets/pets/sprites/10.png', size: 120 },
  { id: 'pet_13', iconSrc: '/assets/pets/avatars/14.png', petSrc: '/assets/pets/sprites/11.png', size: 180 },
  { id: 'pet_14', iconSrc: '/assets/pets/avatars/15.png', petSrc: '/assets/pets/sprites/12.gif', size: 180 },
  { id: 'pet_15', iconSrc: '/assets/pets/avatars/16.png', petSrc: '/assets/pets/sprites/13.gif', size: 190 },
  { id: 'pet_16', iconSrc: '/assets/pets/avatars/17.png', petSrc: '/assets/pets/sprites/14.gif', size: 230 },
  { id: 'pet_17', iconSrc: '/assets/pets/avatars/18.png', petSrc: '/assets/pets/sprites/15.png', size: 200 },
  { id: 'pet_18', iconSrc: '/assets/pets/avatars/19.png', petSrc: '/assets/pets/sprites/16.png', size: 200 },
  { id: 'pet_19', iconSrc: '/assets/pets/avatars/20.png', petSrc: '/assets/pets/sprites/17.gif', size: 210 },
  { id: 'pet_20', iconSrc: '/assets/pets/avatars/21.png', petSrc: '/assets/pets/sprites/18.png', size: 220 },
  { id: 'pet_21', iconSrc: '/assets/pets/avatars/22.png', petSrc: '/assets/pets/sprites/19.png', size: 210 },
  { id: 'pet_22', iconSrc: '/assets/pets/avatars/23.png', petSrc: '/assets/pets/sprites/22.png', size: 165 },
  { id: 'pet_23', iconSrc: '/assets/pets/avatars/24.png', petSrc: '/assets/pets/sprites/23.png', size: 150 },
  { id: 'pet_24', iconSrc: '/assets/pets/avatars/25.png', petSrc: '/assets/pets/sprites/24.png', size: 120 },
  { id: 'pet_25', iconSrc: '/assets/pets/avatars/26.png', petSrc: '/assets/pets/sprites/25.png', size: 200 },
  { id: 'pet_26', iconSrc: '/assets/pets/avatars/27.png', petSrc: '/assets/pets/sprites/26.png', size: 180 },
  { id: 'pet_27', iconSrc: '/assets/pets/avatars/28.png', petSrc: '/assets/pets/sprites/28.gif', size: 250 },
  { id: 'pet_28', iconSrc: '/assets/pets/avatars/2.png', petSrc: '/assets/pets/sprites/27.png', size: 180 },
].map((mascot, index) => ({ ...mascot, label: ' ', order: index }));

export async function seedDatabase(
  database: Database,
  options: SeedOptions = {},
): Promise<void> {
  const projectRoot = options.projectRoot ?? process.cwd();
  const log = options.log ?? console.log;
  const postsDir = join(projectRoot, 'src/client/apps/blog/posts');
  const blogPostValues = BLOG_POST_METADATA.map((post) => ({
    ...post,
    content: readFileSync(join(postsDir, post.filename), 'utf8'),
  }));

  await database.insert(siteSettings).values(SITE_SETTINGS).onConflictDoNothing();
  await database.insert(blogPosts).values(blogPostValues).onConflictDoNothing();
  await database.insert(desktopIcons).values(DESKTOP_ICONS_SEED).onConflictDoNothing();
  await database.insert(mascots).values(MASCOTS_SEED).onConflictDoNothing();
  log('[seed] Default records are present.');
}
