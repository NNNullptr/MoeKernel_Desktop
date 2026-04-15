# Project Structure

## 1. Tech Stack

- Framework: React 19, TanStack Start (SSR), TanStack Router
- Styling: Tailwind CSS v4, CSS Variables, PostCSS
- Client: tRPC Client (Options Proxy / splitLink), TanStack React Query v5, SuperJSON
- Server: tRPC on Deno (Nitro), Zod v4 validation
- Build/Dev: Vite, TypeScript, tsconfig-paths
- UI: Inline CSS (Windows XP theme), shadcn/ui (base components), react-markdown + remark-gfm

---

## 2. Directory Structure

```
src/
├── client/
│   ├── apps/                       # ★ Plugin layer — one folder per desktop application
│   │   ├── registry.ts             # OsApp interface + APP_REGISTRY (single source of truth)
│   │   ├── my-computer/            # My Computer app (drive grid explorer)
│   │   ├── games-folder/           # Games folder app (configurable HTML5 game launcher)
│   │   ├── about-me/               # About Me bio card (config-driven, background image layer)
│   │   ├── contact/                # Contact links app (XP Explorer style)
│   │   ├── winamp/                 # Winamp music player (HTML5 Audio engine)
│   │   ├── msn/                    # MSN Messenger chat app (bot auto-reply + emoji picker)
│   │   ├── paint/                  # MS Paint canvas app (pencil/eraser/fill + palette)
│   │   ├── resume/                 # Generic Markdown doc viewer (background image layer)
│   │   ├── video-player/           # Dual-engine video player (Bilibili iframe + native mp4)
│   │   ├── portfolio/              # Portfolio explorer (category tabs + in-window lightbox)
│   │   └── blog/                   # Blog system (folder view + per-post Markdown viewer)
│   │       ├── index.tsx           # BlogFolderApp — XP Explorer grid with category tab filter
│   │       ├── viewer.tsx          # BlogPostViewer — Markdown reader (cloned from ResumeApp)
│   │       └── posts/              # Static .md blog post files
│   │           ├── hello-world.md
│   │           └── windows-xp-memories.md
│   ├── config/                     # ★ Customization config files — edit these to change content
│   │   ├── theme.config.ts         # Wallpaper URL, Windows logo, system tray icons
│   │   ├── icons.config.ts         # Desktop shortcut icons only (DESKTOP_ICON_DEFS)
│   │   ├── pets.config.ts          # Desktop pet list (PET_DEFS) — add/remove pets here
│   │   └── blog.config.ts          # Blog post list (BLOG_POSTS) — add/remove posts here
│   ├── trpc/                       # tRPC client configuration (DO NOT EDIT)
│   │   ├── index.ts                # splitLink client — SSR uses localLink, CSR uses httpBatchLink
│   │   └── provider.tsx            # QueryClientProvider wrapper
│   └── views/                      # Desktop UI components
│       ├── home.tsx                # Main desktop: icons, taskbar, open windows, xp-open-window listener
│       ├── xp-window.tsx           # Reusable draggable + resizable XP window (8-dir resize handles)
│       ├── desktop-pet.tsx         # Draggable GIF desktop pet with viewport clamping + dismiss button
│       ├── right-sidebar.tsx       # XP Classic gray sidebar with bevel-style pet launcher buttons
│       ├── start-menu.tsx          # Luna-style Start Menu popup (Programs + Places + footer)
│       └── window-contents.tsx     # Legacy (replaced by registry.ts + apps/* plugin system)
├── components/
│   └── not-found.tsx               # 404 fallback component
├── hooks/
│   ├── use-desktop-icons.ts        # Free-drag icons, selection highlight, auto-arrange, boundary clamp
│   ├── use-window-drag.ts          # Pointer-capture drag for XP window title bars
│   └── use-mobile.ts               # 768px breakpoint detector
├── lib/
│   └── utils.ts                    # cn() helper (clsx + tailwind-merge)
├── routes/
│   ├── __root.tsx                  # HTML shell, meta, global CSS injections (XP theme sheets)
│   ├── index.tsx                   # Route / → renders HomePage
│   └── api/
│       └── trpc.$.ts               # tRPC fetch handler (catch-all)
├── server/
│   └── trpc/
│       ├── routes/example.ts       # Example procedures (server time, greeting)
│       ├── router.ts               # createTRPCRouter — combines sub-routers
│       ├── procedure.ts            # publicProcedure / protectedProcedure
│       ├── middlewares.ts          # Auth + logging middlewares
│       ├── init.ts                 # tRPC init with SuperJSON transformer
│       ├── context.ts              # Request context (headers)
│       ├── caller.ts               # Server-side SSR caller
│       └── link.ts                 # unstable_localLink for SSR
├── styles/
│   └── global.css                  # Tailwind v4 config: oklch color vars, @theme inline
└── routeTree.gen.ts                 # AUTO-GENERATED — never edit
public/
├── assets/
│   ├── wallpapers/                 # Desktop background images (.webp / .jpg / .png)
│   ├── icons/                      # App and desktop shortcut icons (.png / .ico)
│   │   └── tray/                   # System tray icons (16–20px)
│   └── pets/
│       ├── avatars/                # Sidebar button icons (22px recommended)
│       └── sprites/                # Desktop pet graphics (animated .gif preferred)
└── home/styles/                    # Extracted Windows XP theme CSS sheets (see §6)
```

---

## 3. Core Modules

### 3.1 App Plugin System (`client/apps/`)

All desktop apps follow the **micro-kernel + plugin** pattern:

1. Each app lives in its own folder under `src/client/apps/`.
2. It exports a single React component (e.g. `WinampApp`).
3. It registers itself in `APP_REGISTRY` (`registry.ts`) with metadata: `id`, `title`, `icon`, `defaultWidth`, `defaultHeight`, `AppComponent`.
4. Desktop icons in `icons.config.ts` reference the same `id` — double-clicking an icon calls `openWindow(id)` in `home.tsx`.
5. Blog posts are auto-registered at module init time by iterating `BLOG_POSTS`.

### 3.2 Config-Driven Pattern

Every app exposes a top-level config object for easy customization:

| App | Config Object | Customizable Fields |
|-----|---------------|---------------------|
| About Me | `ABOUT_CONFIG` | Avatar, background image + opacity, personal info, skill tags, Markdown content |
| Winamp | `WINAMP_CONFIG` + `SONG_LIST` | Theme colors, song list (title/artist/src/cover) |
| Video Player | `VIDEO_CONFIG` + `VIDEO_LIST` | Theme colors, video list (bilibili BV# or mp4 URL) |
| Portfolio | `PORTFOLIO_CONFIG` + `PORTFOLIO_ITEMS` | Sidebar color, background image, project entries |
| Contact | `CONTACT_CONFIG` | Contact links (icon, label, href, color) |
| Games | `GAMES_LIST` | Game entries (title, icon, URL — supports local /public/games/) |
| Blog | `BLOG_POSTS` in `blog.config.ts` | Post entries (id, title, icon, category, .md import) |
| Resume/README | `DOC_CONFIG` | Markdown file, background image + opacity |
| Desktop | `DESKTOP_ICON_DEFS` | Icon order, labels, images |
| Pets | `PET_DEFS` | Pet name, sidebar button icon, desktop pet GIF sprite |
| Theme | `THEME_CONFIG` | Wallpaper URL, Windows logo, system tray icons |

### 3.3 XpWindow (`client/views/xp-window.tsx`)

Reusable Windows XP–style floating window:
- Fixed-position at `(x, y)` with `width × height`.
- Title bar: XP blue gradient, app icon, title, minimize/maximize/close buttons.
- Maximize fills `calc(100vw - 34px) × calc(100vh - 30px)` (avoids right sidebar + taskbar).
- 8-direction `ResizeHandle` components for free resize with minimum size constraints.
- `useWindowDrag` for pointer-capture title bar dragging.

### 3.4 Desktop Icons (`hooks/use-desktop-icons.ts`)

- Icons are absolutely positioned; auto-arranged in multi-column grid based on viewport height.
- Free-drag with pointer events; `isCustomPos` flag preserves user-dragged positions across resizes.
- Single-click: XP-style blue selection highlight. Double-click: opens window.

### 3.5 Blog System (`client/apps/blog/`)

- `BlogFolderApp`: XP Explorer–style icon grid with category filter tab bar.
  - Categories auto-derived from `BLOG_POSTS[].category`.
  - Clicking an article tile dispatches `CustomEvent('xp-open-window', { detail: postId })`.
- `BlogPostViewer`: Markdown reader (renders `.md` via react-markdown + remark-gfm).
- `home.tsx` listens for `xp-open-window` and calls `openWindow(id)` — enables window-in-window navigation without prop drilling.
- Each post is auto-registered as an independent `OsApp` entry in `APP_REGISTRY` at startup.

### 3.6 Desktop Pets (`client/views/desktop-pet.tsx`)

- Draggable GIF pets floating above all windows (`z-index: 9999`).
- Pointer-capture drag with viewport clamping.
- Toggled on/off by the right sidebar. Each pet has `iconSrc` (sidebar button) and `petSrc` (desktop GIF).

### 3.7 Right Sidebar (`client/views/right-sidebar.tsx`)

- **Visual**: Solid light-gray left-to-right gradient (XP Classic/Silver style). Not Frutiger Aero.
- Bevel-style raised/inset button states for pet launchers. XP-blue active dot indicator retained.
- Width: 34px. Positioned fixed on the right edge above the taskbar.

---

## 4. Routes

| Path | File | Description |
|------|------|-------------|
| `/` | `routes/index.tsx` | Main landing page — renders the Windows XP desktop |
| `/api/trpc/$` | `routes/api/trpc.$.ts` | tRPC endpoint (all API queries and mutations) |
| N/A | `routes/__root.tsx` | Root layout — HTML shell, meta, XP theme CSS injections |

---

## 5. Data Flow

### 5.1 State Management

- **`openWindows` array** in `home.tsx`: Manages all open window instances (position, size, z-index, minimized).
- **`activePets` set** in `home.tsx` / right sidebar: Tracks which desktop pets are visible.
- **App-local state**: Each app component manages its own UI state (playback, chat messages, canvas, etc.).
- **React Query Cache**: Server-state sync via tRPC queries (example procedures; extend as needed).

### 5.2 Data Fetching

- **tRPC**: Primary API pattern. Procedures in `server/trpc/routes/`; consumed via `trpc` proxy.
- **Static imports**: Blog posts use `import rawMd from './posts/post.md?raw'` (Vite raw import).
- **Server Loaders**: `src/server/loader.ts` enables SSR pre-fetching (available for extension).

### 5.3 Key Data Paths

- **Opening a window**: Icon double-click → `openWindow(id)` in `home.tsx` → looks up `APP_REGISTRY[id]` → appends to `openWindows` → renders `<XpWindow>` + `<AppComponent />`.
- **Blog navigation**: Article tile click → `CustomEvent('xp-open-window')` → `home.tsx` listener → `openWindow(postId)` → renders `<BlogPostViewer post={...} />`.
- **SSR render**: `__root.tsx` → server tRPC link → HTML streamed with pre-computed styles.
- **CSR API call**: User action → `useMutation(trpc.x.mutationOptions())` → `httpBatchLink` → `/api/trpc` → procedure executes → response cached by React Query.

---

## 6. Stylesheets

### `style_3b43319be51c.css` (Core XP Theme)
The primary Windows XP "Luna" theme engine — desktop layout, scrollbar appearance, taskbar gradients.
- **Key selectors**: `._desktop_1d92e_1`, `._taskbar_oqlpl_1`, `._icon_1d92e_20`, `._system-tray_oqlpl_86`, `._time_oqlpl_108`
- **CSS Variables**: `--xp-cursor-default`, `--titlebar-gradient`, `--system-tray`, `--xp-scrollbar-thumb-bg`
- ⚠️ Risky to edit — contains primary OS layout grid rules.

### `style_44662de83434.css` (Tailwind Engine)
Tailwind v4 `@property` Houdini animation definitions. **DO NOT EDIT.**

### `style_568d4a59d1ae.css` (Animations)
Custom `@keyframes` for loading and transition effects. Safe to modify durations.

### `merged_styles.css` (Utilities)
Small utility sheet (`.sf-hidden`). Safe to extend.

### Brand Colors

| Semantic Role | Value |
|---------------|-------|
| Desktop Background | `teal` |
| Primary XP Blue | `rgb(43, 113, 224)` |
| Taskbar Shadow | `rgb(16, 66, 175)` |
| Start Button Glow | `#18bbff` |
