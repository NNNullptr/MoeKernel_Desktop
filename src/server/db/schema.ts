import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 对应 theme.config.ts — key-value 结构，灵活存储任意站点设置
// 数组类型（如 system_tray_icons）存为 JSON 序列化字符串
export const siteSettings = sqliteTable('site_settings', {
  key:   text('key').primaryKey(),
  value: text('value').notNull(),
});

// 对应 blog.config.ts
export const blogPosts = sqliteTable('blog_posts', {
  id:              text('id').primaryKey(),
  title:           text('title').notNull(),
  content:         text('content').notNull(),
  category:        text('category').notNull(),
  icon:            text('icon').notNull(),
  backgroundImage: text('background_image').notNull().default(''),
  bgOpacity:       real('bg_opacity').notNull().default(1),
  order:           integer('order').notNull().default(0),
  createdAt:       integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 对应 icons.config.ts
export const desktopIcons = sqliteTable('desktop_icons', {
  id:      text('id').primaryKey(),
  label:   text('label').notNull(),
  src:     text('src').notNull(),
  order:   integer('order').notNull().default(0),
  visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
});

// 对应 pets.config.ts
export const mascots = sqliteTable('mascots', {
  id:      text('id').primaryKey(),
  label:   text('label').notNull().default(''),
  iconSrc: text('icon_src').notNull(),
  petSrc:  text('pet_src').notNull(),
  size:    integer('size').notNull().default(80),
  order:   integer('order').notNull().default(0),
});

// Phase 4：ChatBox 留言板
// ipHash 存储 SHA-256(IP)，仅用于限流，不存明文 IP
export const chatMessages = sqliteTable('chat_messages', {
  id:        text('id').primaryKey(),
  name:      text('name').notNull(),
  content:   text('content').notNull(),
  ipHash:    text('ip_hash').notNull(),
  isPinned:  integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Phase 5.2：多媒体曲目库
// type: 'audio'    → Winamp 播放列表（src = 音频 URL）
// type: 'video'    → Video Player mp4 模式（src = 视频直链）
// type: 'bilibili' → Video Player B站模式（bvid = BV 号，src 留空）
export const mediaTracks = sqliteTable('media_tracks', {
  id:      text('id').primaryKey(),
  title:   text('title').notNull(),
  artist:  text('artist').notNull().default(''),
  src:     text('src').notNull().default(''),
  bvid:    text('bvid'),
  cover:   text('cover').notNull().default(''),
  type:    text('type').notNull().default('audio'), // 'audio' | 'video' | 'bilibili'
  order:   integer('order').notNull().default(0),
  visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
});

// Phase 5：Portfolio 作品集
// techStack 以逗号分隔字符串存储，如 "React,TypeScript,Drizzle"
export const portfolioItems = sqliteTable('portfolio_items', {
  id:          text('id').primaryKey(),
  title:       text('title').notNull(),
  description: text('description').notNull().default(''),
  techStack:   text('tech_stack').notNull().default(''),
  link:        text('link'),
  imageUrl:    text('image_url').notNull().default(''),
  category:    text('category').notNull().default(''),
  order:       integer('order').notNull().default(0),
  visible:     integer('visible', { mode: 'boolean' }).notNull().default(true),
});

// Phase 6：通用文档窗口系统
// 每行对应一个桌面文档窗口，content 存储 Markdown 正文
export const documents = sqliteTable('documents', {
  id:        text('id').primaryKey(),
  title:     text('title').notNull(),
  iconSrc:   text('icon_src').notNull().default(''),
  content:   text('content').notNull().default(''),
  bgUrl:     text('bg_url').notNull().default(''),
  bgOpacity: real('bg_opacity').notNull().default(0.12),
  order:     integer('order').notNull().default(0),
  visible:   integer('visible', { mode: 'boolean' }).notNull().default(true),
});
