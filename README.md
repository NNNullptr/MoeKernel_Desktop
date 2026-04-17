# 🖥️ XP Portfolio — Windows XP 风格个人作品集

> 一个以 Windows XP / Y2K 梦幻核美学为主题的交互式个人作品集网站。访客将像操作一台复古 PC 一样浏览你的作品。

---

## 📸 项目简介

本项目模拟了一套完整的 Windows XP 桌面操作系统体验：

- 可拖拽的桌面图标与墙纸背景（多列自动排布 + 自由拖拽 + 边界钳制）
- 带 Luna 风格的开始菜单（程序 + 地点两列布局）
- 系统托盘实时时钟
- 可拖拽、可 8 方向调整大小的多窗口管理系统（最小化 / 最大化 / 关闭）
- 右侧 XP Classic 风格宠物启动侧边栏（亮灰色渐变 + 内嵌浮雕按钮风格）
- 可拖拽的桌面宠物（桌宠），浮于所有窗口之上（z-index 9999）
- **配置驱动型应用**：所有应用顶部均有 `CONFIG` 对象，无需改组件逻辑即可定制内容
- **博客系统**：XP 资源管理器风格博客文件夹 + Markdown 文章阅读器 + 分类过滤 Tab 栏

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19、TanStack Start（SSR）、TanStack Router |
| 样式 | Tailwind CSS v4、CSS Variables（OKLCH 色彩空间）、Inline CSS（XP 主题） |
| 组件库 | shadcn/ui（Radix UI 底层） |
| Markdown | react-markdown + remark-gfm（博客、简历阅读器）|
| 客户端数据 | TanStack React Query v5、tRPC v11 Options Proxy |
| 服务端 | tRPC on H3、Deno Edge Function |
| 构建工具 | Vite 7、Nitro、TypeScript 5.9 |
| 表单验证 | React Hook Form + Zod v4 |
| 数据序列化 | SuperJSON |

---

## 📁 项目目录结构

```
项目根目录/
├── public/                         # 静态资源（可直接替换你的素材）
│   ├── assets/
│   │   ├── wallpapers/             # 桌面壁纸 (.webp / .jpg / .png)
│   │   ├── icons/                  # 应用图标 (.png / .ico)
│   │   │   └── tray/               # 系统托盘小图标 (16–20px)
│   │   └── pets/                   # 桌宠素材
│   │       ├── avatars/            # 侧栏按钮图标 (推荐 22px)
│   │       └── sprites/            # 桌宠本体图像 (推荐 .gif 动图)
│   └── home/styles/                # XP 主题 CSS 文件（勿随意修改）
│
├── src/
│   ├── client/                     # 客户端代码
│   │   ├── apps/                   # ★ 插件层 — 每个桌面应用一个独立文件夹
│   │   │   ├── registry.ts         # 应用注册中心（OsApp 接口 + APP_REGISTRY）
│   │   │   ├── my-computer/        # 我的电脑（驱动器网格）
│   │   │   ├── games-folder/       # 游戏文件夹（可配置 H5 游戏启动器）
│   │   │   ├── about-me/           # 关于我（配置驱动，含背景图层）
│   │   │   ├── contact/            # 联系方式（XP 资源管理器风格）
│   │   │   ├── winamp/             # Winamp 音乐播放器（HTML5 Audio 真实引擎）
│   │   │   ├── msn/                # MSN Messenger（Bot 自动回复 + 表情包）
│   │   │   ├── paint/              # MS Paint 画板（铅笔/橡皮/填充 + 调色板）
│   │   │   ├── resume/             # 通用 Markdown 文档查看器（含背景图层）
│   │   │   ├── video-player/       # 双引擎视频播放器（B站 iframe + 原生 mp4）
│   │   │   ├── portfolio/          # 作品集文件夹（分类 Tab + 灯箱预览）
│   │   │   └── blog/               # 博客系统
│   │   │       ├── index.tsx       # 博客文件夹（XP 资源管理器 + 分类 Tab 过滤）
│   │   │       ├── viewer.tsx      # 博客文章 Markdown 阅读器
│   │   │       └── posts/          # 静态 .md 文章文件
│   │   │
│   │   ├── config/                 # ★ 个性化配置文件 — 改这里来定制内容
│   │   │   ├── theme.config.ts     # 壁纸URL、Windows Logo、系统托盘图标
│   │   │   ├── icons.config.ts     # 桌面快捷图标列表（DESKTOP_ICON_DEFS）
│   │   │   ├── pets.config.ts      # 桌宠列表（PET_DEFS）
│   │   │   └── blog.config.ts      # 博客文章列表（BLOG_POSTS）
│   │   │
│   │   ├── trpc/                   # tRPC 客户端配置（勿修改）
│   │   └── views/                  # 页面级视图组件
│   │       ├── home.tsx            # 🖥️ XP 桌面主组件（内核）
│   │       ├── xp-window.tsx       # 可拖拽/可 8 方向缩放的 XP 窗口组件
│   │       ├── start-menu.tsx      # 开始菜单（Luna 风格）
│   │       ├── right-sidebar.tsx   # 右侧桌宠启动栏（XP Classic 亮灰风格）
│   │       └── desktop-pet.tsx     # 桌宠组件（可拖拽，浮层 z-index 9999）
│   │
│   ├── hooks/                      # 自定义 React Hooks
│   │   ├── use-desktop-icons.ts    # 桌面图标拖拽、选中、自动排布逻辑
│   │   ├── use-window-drag.ts      # 窗口拖拽（指针事件捕获）
│   │   └── use-mobile.ts           # 移动端检测（768px 断点）
│   │
│   ├── routes/                     # 文件路由（路径即URL）
│   │   ├── __root.tsx              # 根布局（HTML Shell、全局CSS注入）
│   │   ├── index.tsx               # 主路由 / → 渲染 HomePage
│   │   └── api/trpc.$.ts           # tRPC HTTP 端点（catch-all）
│   │
│   └── server/                     # 服务端代码（tRPC procedures）
│
├── docs/                           # 项目文档（AI 记忆系统）
├── package.json
└── tsconfig.json
```

---

## 🏗️ 核心架构设计

### 微内核 + 插件层架构

本项目采用**微内核 + 插件层**的架构模式，将桌面操作系统内核逻辑与各窗口应用彻底解耦：

```
┌─────────────────────────────────────────────────────────────────┐
│                      内核层 (home.tsx)                           │
│  窗口管理 · 图标拖拽 · 任务栏 · 开始菜单 · 桌宠系统              │
│  + xp-open-window CustomEvent 监听器（博客窗口内开新窗口）        │
└───────────────────────┬─────────────────────────────────────────┘
                        │ 通过 APP_REGISTRY 查找
┌───────────────────────▼─────────────────────────────────────────┐
│                   注册中心 (registry.ts)                          │
│   APP_REGISTRY: Record<id, OsApp>  ← 单一数据源                  │
│   + 启动时自动注册 BLOG_POSTS 每篇文章为独立 OsApp                │
└──┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬───────────┘
   │    │    │    │    │    │    │    │    │    │    │
  MC  Games  Me  Contact Winamp MSN Paint Resume Video Portfolio Blog
  插件  插件  插件  插件   插件  插件  插件   插件   插件   插件   插件
```

### OsApp 接口规范

每个桌面应用必须实现以下接口：

```typescript
interface OsApp {
  id: string;           // 唯一标识符，需与 icons.config.ts 中的 id 一致
  title: string;        // 窗口标题栏 & 任务栏显示名
  icon: string;         // 16–32px 标题栏图标 URL
  defaultWidth: number; // 窗口默认宽度（像素）
  defaultHeight: number;// 窗口默认高度（像素）
  AppComponent: React.ComponentType; // 窗口内容组件
}
```

### 配置驱动型应用

所有应用均在文件顶部暴露配置对象，直接修改即可定制：

| 应用 | 配置对象 | 可定制内容 |
|------|---------|-----------|
| About Me | `ABOUT_CONFIG` | 头像、背景图+透明度、个人信息、技能标签、Markdown 正文 |
| Winamp | `WINAMP_CONFIG` + `SONG_LIST` | 主题配色、歌曲列表（标题/艺术家/音源/封面） |
| Video Player | `VIDEO_CONFIG` + `VIDEO_LIST` | 主题配色、视频列表（B站BV号 或 mp4 URL） |
| Portfolio | `PORTFOLIO_CONFIG` + `PORTFOLIO_ITEMS` | 侧栏颜色、背景图、作品条目 |
| Contact | `CONTACT_CONFIG` | 联系方式链接（图标、标签、href、颜色） |
| Games | `GAMES_LIST` | 游戏条目（标题、图标、URL，支持 /public/games/ 本地游戏） |
| Blog | `BLOG_POSTS`（blog.config.ts）| 文章列表（id、标题、图标、分类、.md 文件导入） |
| Resume/README | `DOC_CONFIG` | Markdown 文件、背景图+透明度 |

---

## 🖥️ WelcomeGuard 欢迎动画

文件：`src/client/views/welcome-guard.tsx`

首次进入时自动播放 Boot → Login 两阶段动画，同一会话内刷新不重复播放。

**修改文字内容：** 文件顶部有完整索引注释，按注释搜索关键词即可定位：

| 需要修改的内容 | 搜索关键词 |
|--------------|-----------|
| Boot 用户名大字 | `NNNullptr`（BootStage 内） |
| Boot 红色 xp 后缀 | `>xp<`（BootStage 内 `<span>` 红色斜体） |
| Boot 副标题 | `>Welcome<` |
| Boot 持续时间 | `setTimeout(onDone, 3000)` 中的毫秒数 |
| Login 左侧用户名 | `NNNullptr`（LoginStage 左栏） |
| Login 左侧角色说明 | `>Software Developer<`（左栏） |
| Login 左侧引导语 | `>To begin, click your user name<` |
| Login 右侧头像图片 | `src="/assets/avatarSrc.jpg"` |
| Login 右侧头像卡用户名 | `NNNullptr`（LoginStage 右栏头像卡） |
| Login 右侧头像卡角色 | `>Software Developer<`（右栏） |
| 底部 Restart 按钮 | `>Restart<` |

**调试命令（浏览器 console）：**
```js
// 重新播放欢迎流程
sessionStorage.removeItem('xp:welcomed'); location.reload();

// 跳过欢迎流程
sessionStorage.setItem('xp:welcomed', '1'); location.reload();
```

---

## ✏️ 如何添加新应用

只需 3 步，完全不触碰内核代码：

**第一步：** 创建应用组件
```
src/client/apps/your-app/index.tsx
```
```tsx
export function YourApp() {
  return <div>你的应用内容</div>;
}
```

**第二步：** 在注册中心登记（`src/client/apps/registry.ts`）
```typescript
import { YourApp } from './your-app';

export const APP_REGISTRY = {
  // ...现有应用
  yourApp: {
    id: 'yourApp',
    title: '你的应用',
    icon: '/assets/icons/your-icon.png',
    defaultWidth: 500,
    defaultHeight: 400,
    AppComponent: YourApp,
  },
};
```

**第三步：** 添加桌面图标（`src/client/config/icons.config.ts`）
```typescript
export const DESKTOP_ICON_DEFS = [
  // ...现有图标
  { id: 'yourApp', label: '你的应用', src: '/assets/icons/your-icon.png' },
];
```

完成！应用将自动出现在桌面，双击图标即可打开。

---

## 📝 如何添加博客文章

**第一步：** 在 `src/client/apps/blog/posts/` 创建 `.md` 文件

**第二步：** 在 `src/client/config/blog.config.ts` 添加条目：
```typescript
import rawMyPost from '../apps/blog/posts/my-post.md?raw';

export const BLOG_POSTS: BlogPost[] = [
  // ...现有文章
  {
    id: 'blog-my-post',    // 必须以 'blog-' 开头
    title: '我的新文章',
    icon: '图标URL',
    category: '技术',      // 分类标签（自动出现在 Tab 栏）
    raw: rawMyPost,
  },
];
```

完成！文章自动出现在博客文件夹，并动态注册为独立阅读器窗口。

---

## 🎨 个性化定制

### 替换壁纸
```typescript
// src/client/config/theme.config.ts
export const WALLPAPER_URL = '/assets/wallpapers/your-wallpaper.jpg';
```

### 添加/修改桌宠
```typescript
// src/client/config/pets.config.ts
export const PET_DEFS: PetDef[] = [
  {
    id: 'my-pet',
    name: '我的宠物',
    iconSrc: '/assets/pets/avatars/icon.png',  // 侧栏按钮图标
    petSrc: '/assets/pets/sprites/sprite.gif', // 桌面宠物图像（支持 GIF）
  },
];
```

---

## 🚀 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm lint

# 构建生产版本
pnpm build
```

---

## 📂 静态资源目录

将你自己的素材放入 `public/assets/` 对应子目录，然后在配置文件中引用路径即可：

| 目录 | 用途 | 推荐格式 |
|------|------|---------|
| `public/assets/wallpapers/` | 桌面壁纸 | `.webp`、`.jpg` |
| `public/assets/icons/` | 应用 & 快捷方式图标 | `.png`、`.ico` |
| `public/assets/icons/tray/` | 系统托盘小图标 | `.png`（16–20px）|
| `public/assets/pets/avatars/` | 桌宠侧栏按钮图标 | `.png`（22px）|
| `public/assets/pets/sprites/` | 桌宠本体图像 | `.gif`（动图）|

---

## 🗂️ 路由映射

| URL 路径 | 文件 | 说明 |
|----------|------|------|
| `/` | `routes/index.tsx` | XP 桌面主页面 |
| `/api/trpc/*` | `routes/api/trpc.$.ts` | tRPC API 端点 |
| `*` | `routes/__root.tsx` | 根布局（HTML Shell）|

---

## 📝 开发历史摘要

| 版本 | 主要内容 |
|------|---------|
| V1 | 开始菜单、Luna 风格 Start 按钮、系统托盘实时时钟 |
| V2 | 多窗口管理系统（可拖拽、最小化/最大化/关闭、任务栏按钮）|
| V3 | 桌面图标自由拖拽、单击选中、双击打开、边界自动钳制 |
| V4 | 修复图标重叠与小屏消失问题，多列自动排布算法 |
| V5 | 右侧桌宠启动栏（Frutiger Aero 风格）、可拖拽桌宠 |
| V6 | 窗口 8 方向调整大小、桌宠图标/图像分离（iconSrc + petSrc）|
| V7 | 10 个窗口应用完整内容（Winamp、MSN、Paint、简历等）|
| V8 | 新增视频播放器（Bilibili 嵌入）和作品集文件夹窗口 |
| V9 | 配置文件架构重构，静态资源目录规范化 |
| V10 | **微内核+插件层**架构重构，10 个独立应用模块 + 统一注册中心 |
| V11 | 右侧边栏视觉重构 → XP Classic 亮灰渐变风格（取代 Frutiger Aero）|
| V12 | Resume 重构为通用 Markdown 文档查看器，支持背景图层 + 透明度滑块 |
| V13 | About Me 配置驱动重构（ABOUT_CONFIG）+ 固定技能页脚 + 背景图层 |
| V14 | Contact 重构为 XP 资源管理器界面（含菜单栏 + 地址栏）|
| V15 | Winamp 升级为 HTML5 Audio 真实播放引擎 + Winamp 2.x 复古 UI |
| V16 | Winamp 窗口默认尺寸修复（350×230）|
| V17 | Portfolio 配置驱动重构 + 动态分类 Tab + 灯箱图片预览 |
| V18 | 删除 "Help Me Clippy" 桌面快捷方式 |
| V19–V20 | Video Player 双引擎升级（B站 iframe + 原生 mp4 真实控制）|
| V21 | Games Folder 配置化重构 + iframe 沙盒游戏视图切换 |
| V22–V23 | **博客系统**：XP 资源管理器博客文件夹 + Markdown 阅读器 + 分类过滤 Tab |
| V24 | 修复最大化窗口被右侧边栏遮挡（`calc(100vw - 34px)`）|
| V25 | **WelcomeGuard 入口保护**：Boot（银色胶囊进度条）→ Login（银灰主题头像卡）两阶段欢迎动画，sessionStorage 控制每会话仅播放一次 |
| V26 | **My Computer 重构**：静态文件树映射 `public/assets/`，文件夹导航（地址栏 + Back 按钮），默认图标 `file.png` 支持逐项覆盖 |
| V27 | **Start 菜单双侧联动**：左侧程序列表自动同步 `DESKTOP_ICON_DEFS`，右侧文件夹列表来自 `FILE_SYSTEM`（最多 5 行），点击定位 My Computer 对应目录 |

