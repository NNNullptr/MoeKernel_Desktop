/**
 * @file apps/registry.ts
 * @description Central App Registry — the "plugin manifest" for the Windows XP desktop.
 *
 * HOW IT WORKS:
 * 1. Every desktop application implements the `OsApp` interface defined here.
 * 2. The `APP_REGISTRY` record maps an app ID string to its full manifest.
 * 3. `home.tsx` reads from this registry to:
 *    a. Determine window title, icon, and default dimensions when opening a window.
 *    b. Dynamically render the correct `AppComponent` inside an XpWindow.
 *
 * HOW TO ADD A NEW APP:
 * 1. Create a new folder under `src/client/apps/your-app/`.
 * 2. Export a React component (e.g. `YourApp`) from its `index.tsx`.
 * 3. Add an entry to `APP_REGISTRY` below with a unique id.
 * 4. Add the id to `DESKTOP_ICON_DEFS` in `icons.config.ts` for it to appear on the desktop.
 *
 * HOW TO ADD A NEW BLOG POST:
 * 1. Create a .md file in `src/client/apps/blog/posts/`.
 * 2. Add a new entry to `BLOG_POSTS` in `src/client/config/blog.config.ts`.
 *    - id must start with 'blog-' to avoid conflicts.
 * 3. Done! The post will be automatically registered here and accessible via the Blog folder.
 *
 * NOTE: `icons.config.ts` now ONLY defines desktop shortcut appearance (label + src image).
 * Window metadata (title, icon, size) now lives exclusively in this file.
 */

import React from 'react';

// ── Individual app components ────────────────────────────────────────────────
import { MyComputerApp }   from './my-computer';
import { GamesFolderApp }  from './games-folder';
import { AboutMeApp }      from './about-me';
import { ContactApp }      from './contact';
import { WinampApp }       from './winamp';
import { MsnApp }          from './msn';
import { PaintApp }        from './paint';
import { ResumeApp }       from './resume';
import { VideoPlayerApp }  from './video-player';
import { PortfolioApp }    from './portfolio';
import { ImageViewerApp }  from './image-viewer';

// ── Blog app components ──────────────────────────────────────────────────────
import { BlogFolderApp }   from './blog';
import { BlogPostViewer }  from './blog/viewer';

// ── Blog post configuration ──────────────────────────────────────────────────
import { BLOG_POSTS }      from '@/client/config/blog.config';

// ── OsApp interface — the contract every app must satisfy ───────────────────

/**
 * The manifest interface every registered OS application must implement.
 *
 * - `id`             : Unique string key. Must match the id in `DESKTOP_ICON_DEFS`.
 * - `title`          : Displayed in the window title bar and taskbar button.
 * - `icon`           : URL for the 16–32px title-bar icon used in XpWindow and the taskbar.
 * - `defaultWidth`   : Initial pixel width of the XpWindow.
 * - `defaultHeight`  : Initial pixel height of the XpWindow.
 * - `AppComponent`   : The self-contained React component rendered inside the window.
 */
export interface OsApp {
  id: string;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  AppComponent: React.ComponentType;
}

// ── App Registry — single source of truth for all windows ───────────────────

/**
 * Record mapping app id → OsApp manifest.
 * The kernel (home.tsx) imports this to open and render windows.
 */
export const APP_REGISTRY: Record<string, OsApp> = {
  myComputer: {
    id: 'myComputer',
    title: 'My Computer',
    icon: 'https://static.step1.dev/g9nbov/assets/c27a5c3a1797.png',
    defaultWidth: 640,
    defaultHeight: 480,
    AppComponent: MyComputerApp,
  },
  gamesFolder: {
    id: 'gamesFolder',
    title: 'Games',
    icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png',
    defaultWidth: 620,
    defaultHeight: 460,
    AppComponent: GamesFolderApp,
  },
  aboutme: {
    id: 'aboutme',
    title: 'About Me',
    icon: 'https://static.step1.dev/g9nbov/assets/58721f37b0c0.png',
    defaultWidth: 500,
    defaultHeight: 400,
    AppComponent: AboutMeApp,
  },
  contact: {
    id: 'contact',
    title: 'Contact Me',
    icon: 'https://static.step1.dev/g9nbov/assets/e225895b1c27.png',
    defaultWidth: 400,
    defaultHeight: 380,
    AppComponent: ContactApp,
  },
  webamp: {
    id: 'webamp',
    title: 'Winamp',
    icon: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png',
    defaultWidth: 350,
    defaultHeight: 230,
    AppComponent: WinampApp,
  },
  msn: {
    id: 'msn',
    title: 'MSN Messenger',
    icon: 'https://static.step1.dev/g9nbov/assets/ba1bb3f668bb.png',
    defaultWidth: 340,
    defaultHeight: 500,
    AppComponent: MsnApp,
  },
  paint: {
    id: 'paint',
    title: 'Paint',
    icon: 'https://static.step1.dev/g9nbov/assets/035b30cba825.png',
    defaultWidth: 700,
    defaultHeight: 500,
    AppComponent: PaintApp,
  },
  resume: {
    id: 'resume',
    title: 'README.md',
    icon: 'https://static.step1.dev/g9nbov/assets/bb426464f8be.ico',
    defaultWidth: 700,
    defaultHeight: 560,
    AppComponent: ResumeApp,
  },
  video: {
    id: 'video',
    title: 'Windows Media Player',
    icon: 'https://static.step1.dev/g9nbov/assets/da0d359368d3.png',
    defaultWidth: 680,
    defaultHeight: 520,
    AppComponent: VideoPlayerApp,
  },
  portfolio: {
    id: 'portfolio',
    title: 'My Portfolio',
    icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png',
    defaultWidth: 780,
    defaultHeight: 560,
    AppComponent: PortfolioApp,
  },

  imageViewer: {
    id: 'imageViewer',
    title: 'Image Viewer',
    icon: '/assets/icons/file.png',
    defaultWidth: 640,
    defaultHeight: 500,
    AppComponent: ImageViewerApp,
  },

  // ── Blog folder — opens the blog article grid ────────────────────────────
  blog: {
    id: 'blog',
    title: 'My Blog',
    icon: 'https://static.step1.dev/g9nbov/assets/37d3eab6367b.png',
    defaultWidth: 640,
    defaultHeight: 460,
    AppComponent: BlogFolderApp,
  },
};

// ── Dynamically register each blog post as an independent window ─────────────
//
// For each post in BLOG_POSTS, we create a dedicated OsApp entry so that
// home.tsx can open it as its own window via openWindow(post.id).
// AppComponent is a closure that captures the specific post object.
//
// This loop runs at module initialization time, so APP_REGISTRY is fully
// populated before the first render. No runtime side effects.
BLOG_POSTS.forEach((post) => {
  APP_REGISTRY[post.id] = {
    id: post.id,
    title: post.title,
    icon: post.icon,
    defaultWidth: 700,
    defaultHeight: 560,
    // Capture post in closure — each article gets its own viewer instance
    AppComponent: () => React.createElement(BlogPostViewer, { postId: post.id }),
  };
});
