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
