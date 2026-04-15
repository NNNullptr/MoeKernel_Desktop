# Edit History

## V1: Start Button & Start Menu

Implemented a Windows XP Luna-style Start button on the taskbar and a matching Start Menu popup with user header, two-column layout (programs + places), and Log Off / Turn Off footer. Added live clock to the system tray and desktop click-to-close logic.

## V2: Window Management System

Implemented a full XP window management system: draggable XpWindow component with title bar (minimize/maximize/close), useWindowDrag hook for pointer-based drag, openWindows state array in home.tsx, double-click on desktop icons to open windows, z-index layering on focus, and taskbar buttons that toggle minimize/restore for each open window.

## V3: Draggable Desktop Icons with Selection & Responsive Clamping

Refactored desktop icons from CSS grid to absolute positioning; created useDesktopIcons hook and DesktopIcon component supporting free-drag (pointer events), single-click selection with XP-style blue highlight, double-click to open windows, and automatic boundary clamping on window resize.

## V4: Fix Icon Stacking & Disappearing on Resize/Reload

Rewrote computePositions to support multi-column auto-arrange layout based on viewport height, fixing icons disappearing off-screen on small viewports. Added isCustomPos flag to preserve user-dragged positions across resizes, and fixed icon stacking caused by all out-of-bounds icons collapsing to the same maxY coordinate.

## V5: Right Sidebar Pet Launcher & Draggable Desktop Pets

Added a Frutiger Aero frosted-glass right sidebar (RightSidebar component) with 3 pet launcher buttons and XP-blue active glow indicators. Created DesktopPet component that spawns draggable pets above all windows (z-index 9999) with pointer-capture drag, viewport clamping, and a dismiss button. Pets toggle on/off via sidebar click.

## V6: Resizable Windows & Pet Icon/Image Separation

Added 8-direction resize handles to XpWindow (all edges and corners) with proper cursor feedback and minimum size constraints. Refactored PetDef to separate iconSrc (sidebar button icon) from petSrc (desktop pet graphic), with full GIF support for petSrc.

## V7: Full App Content for All Windows

Implemented rich interactive content for all 8 desktop apps: Winamp music player (with playlist, visualizer, progress/volume controls), MSN Messenger (live chat with bot replies and emoji picker), Paint (full canvas drawing app with pencil/eraser/fill tools and color palette), Resume (formatted CV document), About Me (bio card with skills), Contact (styled link cards), My Computer (drive grid), and Games folder.

## V8: Video Player & Portfolio Folder Windows

Added two new desktop apps: a Windows Media Player-style window with Bilibili iframe embed and XP transport bar UI, and a full Explorer-style Portfolio folder with category filter tabs, left task pane, and a responsive thumbnail grid showcasing personal works.

## V9: Config Architecture Refactor & Asset Directory Structure

Extracted all hardcoded data from home.tsx into three dedicated config files (theme.config.ts, icons.config.ts, pets.config.ts) under src/client/config/, and created the public/assets/ directory tree (wallpapers/, icons/tray/, pets/avatars/, pets/sprites/) with README guides for easy asset management.

## V11: Right Sidebar Style Overhaul — XP Classic Gray Theme

Replaced the Frutiger Aero frosted-glass effect on the right sidebar with a solid light-gray left-to-right gradient (XP Classic/Silver style), removed the decorative top handle and bottom circle, and updated PetButton states to use raised/inset bevel effects instead of blue glows. The XP-blue active dot indicator was retained.

## V12: Resume → Generic Markdown Doc Viewer with Background Image Support

Refactored the Resume app into a reusable Markdown document viewer that renders README.md via Vite `?raw` import with react-markdown + remark-gfm. Added a layered background image system (absolute-positioned layer with independently adjustable opacity slider) and a detailed Chinese reuse guide in comments so future doc windows only require changing DOC_CONFIG and the export name.

## V13: About Me App — Config-Driven Redesign with Fixed Skills Footer

Refactored `about-me/index.tsx` into a config-driven component with `ABOUT_CONFIG` at the top (avatar, background image + opacity, personal info, colored skill tags, Markdown content). Added a layered background image system with a real-time opacity slider, a Flex top-middle-bottom layout where the header and skills footer are fixed while the Markdown area scrolls independently, and detailed Chinese modification guide comments at the top of the file.

## V14: Contact App — XP Explorer 风格重构

将 Contact 组件重构为与 My Computer 完全一致的 Windows XP 资源管理器界面，配备 ExplorerToolbar（菜单栏 + 地址栏）、flex/wrap 图标网格、点击新标签跳转，以及顶部 CONTACT_CONFIG 配置对象和详细中文修改指南。

## V15: Winamp — 真实音频引擎 + 复古播放器 UI 完全重写

将 WinampApp 从假轮询进度条升级为 HTML5 Audio 真实播放引擎（useRef + audio 事件），布局参考 Winamp 2.x：100×100 封面 + 歌曲信息 + 可拖拽真实进度条 + 复古 Previous/Play/Pause/Stop/Next 按钮。新增 WINAMP_CONFIG 主题配色配置对象、SONG_LIST 歌单数组、绝对定位背景图层及顶部详细中文修改指南注释。

## V16: Winamp 窗口默认尺寸修复

将 Winamp 窗口的默认尺寸从 290×460 调整为 350×230，并移除了底部按钮区的 `marginTop: auto`，消除了进度条与按钮之间的大片空白。

## V17: Portfolio App — Config-Driven Redesign with Lightbox & Dynamic Categories

Rewrote Portfolio app with PORTFOLIO_CONFIG (sidebar color, background image + opacity slider) and PORTFOLIO_ITEMS data array, auto-derived category tabs, absolute-positioned background layer with real-time opacity range input, configurable left task pane colors and text, and an in-window Lightbox overlay for full-image preview.

## V18: 删除 Help Me Clippy 桌面图标

从 `icons.config.ts` 的 `DESKTOP_ICON_DEFS` 数组中移除了 "Help Me Clippy" 桌面快捷方式。

## V20: Video Player — 双引擎升级（bilibili iframe + mp4 原生控制）

将 VideoPlayerApp 升级为双引擎架构：bilibili 模式渲染 B站 iframe（跨域限制导致的控制键自动置灰）；mp4 模式渲染原生 `<video>` 标签（播放/暂停/快进/快退/进度条全部真实生效）。修复了按钮 key bug，新增引擎类型徽章、可点击进度条滑块和 mm:ss 时间显示。

## V19: Video Player — 真实播放控制 + 播放列表 + 配置化重构

将 VideoPlayerApp 完全重构：提取 VIDEO_CONFIG 配色配置对象（含中文注释）和 VIDEO_LIST 播放列表数组（含 BV 号查找指南注释），引入 currentIndex/isStopped/isPlaying 状态管理和 iframeRef，通过 postMessage 实现真实的播放/暂停/快退/快进按钮，⏮/⏭ 循环切换视频，⏹ 真正停止并显示占位画面。

## V21: Games Folder — 配置化游戏启动器 + iframe 沙盒视图切换

将 Games Folder 重构为配置驱动的启动器：新增 GAMES_LIST 配置数组（含 6 款示范游戏的在线 URL）、文件夹/游戏双视图状态切换、地址栏联动、后退按钮，以及详细的中文使用步骤注释，支持将本地 HTML5 游戏放入 /public/games/ 后一键上架。

## V22: Blog System — XP-Style Blog Folder with Markdown Viewer

Implemented a full blog system: two demo .md posts under src/client/apps/blog/posts/, a BLOG_POSTS config array in blog.config.ts, a reusable BlogPostViewer component (layout cloned from ResumeApp), an XP Explorer-style BlogFolderApp grid, dynamic APP_REGISTRY registration of each post, xp-open-window CustomEvent listener in home.tsx for in-window navigation, and a "My Blog" desktop shortcut in icons.config.ts.

## V23: Blog Category Filter — XP-Style Tab Bar for Blog Folder

在博客文件夹组件中新增文章分类功能：`BlogPost` 接口增加 `category` 字段，系统自动从 `BLOG_POSTS` 提取不重复分类并渲染 XP 风格 Tab 标签栏，点击分类切换过滤文章列表，左侧面板同步显示当前分类和文章数量，两篇示例文章分别归入"技术"和"生活"分类。

## V24: 修复最大化窗口被右侧边栏遮挡问题

将 XpWindow 最大化状态的宽度从 `100vw` 改为 `calc(100vw - 34px)`，使全屏窗口右边缘与右侧宠物启动器边栏完美对齐，互不遮盖。

## V10: Micro-Kernel + Plugin Architecture Refactor

Split the monolithic 899-line window-contents.tsx into 10 independent app modules under src/client/apps/ (my-computer, games-folder, about-me, contact, winamp, msn, paint, resume, video-player, portfolio). Created a unified OsApp interface and APP_REGISTRY in apps/registry.ts as the single source of truth for all window metadata and components. Updated home.tsx to use dynamic registry lookup instead of a hardcoded switch chain, and simplified icons.config.ts to only manage desktop shortcut appearance.
