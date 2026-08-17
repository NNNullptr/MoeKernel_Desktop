CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`icon` text NOT NULL,
	`background_image` text DEFAULT '' NOT NULL,
	`bg_opacity` real DEFAULT 1 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`ip_hash` text NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `desktop_icons` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`src` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`icon_src` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`bg_url` text DEFAULT '' NOT NULL,
	`bg_opacity` real DEFAULT 0.12 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mascots` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`icon_src` text NOT NULL,
	`pet_src` text NOT NULL,
	`size` integer DEFAULT 80 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media_tracks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`artist` text DEFAULT '' NOT NULL,
	`src` text DEFAULT '' NOT NULL,
	`bvid` text,
	`cover` text DEFAULT '' NOT NULL,
	`type` text DEFAULT 'audio' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`tech_stack` text DEFAULT '' NOT NULL,
	`link` text,
	`image_url` text DEFAULT '' NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
