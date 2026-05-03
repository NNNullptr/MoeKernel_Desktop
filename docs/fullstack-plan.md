# 全栈化改造开发规划

> 目标：将 MoeKernel_Desktop 从纯前端转变为人人可自部署、可视化配置的 WinXP 桌面风格个人站点平台。
> 产品模型：**自部署模板**（类 Ghost / Umami），每位用户 fork 后独立部署，通过后台管理自己的桌面内容。
> 约束：不重构现有架构，所有改动为纯增量添加。

---

## 技术角色说明

| 工具 | 职责 | 不该做的事 |
|---|---|---|
| **Drizzle ORM** | 描述数据库表结构，生成类型安全的 SQL | 不写业务逻辑 |
| **Turso** | 云端 SQLite，实际存储数据 | 不直接在组件里访问 |
| **tRPC** | 服务端函数的暴露窗口，客户端通过它调用服务端 | 不在里面写 UI 逻辑 |
| **TanStack Query** | 客户端数据缓存，管理 loading/error/刷新 | 不做数据变换 |
| **Zod** | 验证进入服务端的数据格式 | 不用来描述数据库结构 |

**数据流向（永远单向）：**
```
浏览器 → tRPC 调用 → 服务端函数 → Drizzle → Turso 数据库
浏览器 ← tRPC 返回 ← 服务端函数 ← Drizzle 结果 ←
```

---

## 防屎山规范

> 这些规则比具体实现更重要，违反它们是屎山的根源。

1. **数据只有一个来源**：某个数据要么来自 DB，要么来自静态配置，不能两处同时有逻辑。迁移后静态配置文件仅作初始默认值，不再被组件直接 import。

2. **服务端逻辑不进组件**：React 组件只做展示数据和响应用户操作。查询 DB、写业务逻辑全放 tRPC 路由文件。

3. **tRPC 路由按领域拆分，不堆在一起**：单个路由文件超过 150 行就拆分。

4. **Zod schema 和 Drizzle schema 各司其职**：Drizzle schema 描述 DB 结构；Zod schema 描述 API 输入验证。不混用。

5. **环境变量集中管理**：`process.env.XXX` 的读取只在 `src/server/env.ts` 一处，其他地方 import 它。

---

## 最终目录结构（仅新增部分）

现有所有文件保持不动，以下为新增内容：

```
src/
├── server/
│   ├── env.ts                        ← 环境变量读取与验证（唯一出口）
│   ├── db/
│   │   ├── schema.ts                 ← 所有数据库表定义（唯一）
│   │   ├── client.ts                 ← Drizzle + Turso 连接（唯一）
│   │   └── seed.ts                   ← 从现有 config 导入初始数据（一次性脚本）
│   └── trpc/
│       └── routes/
│           ├── example.ts            （保持不动）
│           ├── site.ts               ← 公开读取接口（含 portfolio/media）
│           ├── blog.ts               ← 博客管理接口（需鉴权）
│           ├── settings.ts           ← 站点设置 + Resume 内容（需鉴权）
│           ├── auth.ts               ← 管理员认证接口
│           ├── chatbox.ts            ← 留言板（Phase 4，公开写 + 管理删）
│           ├── portfolio.ts          ← 作品集管理（Phase 5，需鉴权）
│           ├── media.ts              ← 曲目管理（Phase 5，需鉴权）
│           └── documents.ts          ← 通用文档窗口管理（Phase 6，公开读 + 管理 CRUD）
│
└── routes/
    └── admin/
        ├── _layout.tsx               ← 管理后台外壳 + 鉴权守卫
        ├── index.tsx                 ← 仪表盘
        ├── login.tsx                 ← 登录页
        ├── theme.tsx                 ← 主题设置（壁纸、Logo）
        ├── icons.tsx                 ← 桌面图标管理
        ├── mascots.tsx               ← 吉祥物管理
        ├── comments.tsx              ← 评论方案配置（已完成）
        ├── chatbox.tsx               ← 留言板管理（Phase 4）
        ├── portfolio.tsx             ← 作品集管理（Phase 5）
        ├── media.tsx                 ← 曲目管理（Phase 5）
        ├── contact.tsx               ← 联系方式（Phase 5）
        ├── about.tsx                 ← 关于我（Phase 5）
        ├── documents.tsx             ← 通用文档窗口管理（Phase 6）
        └── blog/
            ├── index.tsx             ← 文章列表
            ├── new.tsx               ← 新建文章
            └── $id.tsx               ← 编辑文章

drizzle.config.ts                     ← 新增于项目根目录
drizzle/                              ← 自动生成，存放 migration 文件
```

---

## Phase 0：项目基础设施

**目标**：数据库连通，能读写，不触碰任何现有代码。
**预估耗时**：2-3 小时

### 0.1 安装依赖

```bash
pnpm add drizzle-orm @libsql/client
pnpm add -D drizzle-kit
```

### 0.2 创建 `src/server/env.ts`

读取并验证所有环境变量，应用启动时立即报错而不是运行到一半崩溃：

```typescript
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN   = process.env.TURSO_AUTH_TOKEN;
const ADMIN_PASSWORD     = process.env.ADMIN_PASSWORD;
const JWT_SECRET         = process.env.JWT_SECRET;

if (!TURSO_DATABASE_URL) throw new Error('缺少环境变量: TURSO_DATABASE_URL');
if (!TURSO_AUTH_TOKEN)   throw new Error('缺少环境变量: TURSO_AUTH_TOKEN');
if (!ADMIN_PASSWORD)     throw new Error('缺少环境变量: ADMIN_PASSWORD');
if (!JWT_SECRET)         throw new Error('缺少环境变量: JWT_SECRET');

export const env = { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, ADMIN_PASSWORD, JWT_SECRET };
```

### 0.3 创建 `src/server/db/client.ts`

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/http';  // 必须用 /http，Deno Deploy 不支持 TCP
import { env } from '../env';
import * as schema from './schema';

const libsql = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(libsql, { schema });
```

### 0.4 创建 `src/server/db/schema.ts`

严格对应现有 config 文件结构：

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// 对应 theme.config.ts — key-value 结构，灵活存储任意站点设置
export const siteSettings = sqliteTable('site_settings', {
  key:   text('key').primaryKey(),
  value: text('value').notNull(),
});

// 对应 blog.config.ts
export const blogPosts = sqliteTable('blog_posts', {
  id:              text('id').primaryKey(),
  title:           text('title').notNull(),
  content:         text('content').notNull(),       // Markdown 全文
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
```

### 0.5 创建 `drizzle.config.ts`（项目根目录）

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

### 0.6 建表

```bash
npx drizzle-kit push
```

**完成标志**：Turso 控制台中可见 4 张空表（site_settings / blog_posts / desktop_icons / mascots）。

---

## Phase 1：tRPC 数据层

**目标**：建立完整的服务端 API，暂不改任何前端组件。
**预估耗时**：1 天

### 1.1 追加 admin 中间件

在 `src/server/trpc/middlewares.ts` 末尾追加（不改动现有代码）：

```typescript
import { TRPCError } from '@trpc/server';
import { env } from '../../env';

export const adminMiddleware = t.middleware(({ ctx, next }) => {
  const token = ctx.headers.get('x-admin-token');
  if (!token || token !== env.ADMIN_PASSWORD) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});
```

> Phase 3 完成 JWT 后替换此处的简单密码验证。

### 1.2 在 `procedure.ts` 导出受保护过程

追加一行（保持文件其余内容不变）：

```typescript
export const adminProcedure = publicProcedure.use(adminMiddleware).use(loggingMiddleware);
```

### 1.3 创建 `src/server/trpc/routes/site.ts`（公开读取）

对外暴露所有前端需要的读取接口，无需鉴权：

- `getSettings` — 返回 site_settings 的 key-value 对象
- `getBlogPosts` — 返回博客文章列表（按 order 排序）
- `getDesktopIcons` — 返回可见桌面图标（过滤 visible=false）
- `getMascots` — 返回吉祥物列表

### 1.4 创建 `src/server/trpc/routes/blog.ts`（管理接口，需鉴权）

使用 `adminProcedure`，提供：

- `list` — 列出所有文章（含草稿）
- `create` — 创建文章，Zod 验证所有字段
- `update` — 按 id 更新，Zod 验证 partial 字段
- `delete` — 按 id 删除

### 1.5 创建 `src/server/trpc/routes/settings.ts`（管理接口，需鉴权）

- `get` — 读取全部设置
- `set` — 写入单条 key-value
- `setBatch` — 批量写入（主题设置页用）
- 桌面图标和吉祥物的 CRUD 操作

### 1.6 创建 `src/server/trpc/routes/auth.ts`（认证）

- `login` — 验证密码，成功后签发 JWT（存入 httpOnly cookie）
- `logout` — 清除 cookie
- `verify` — 验证当前 session 是否有效（用于前端路由守卫）

### 1.7 注册所有路由

修改 `src/server/trpc/router.ts`，追加新路由（example 路由保持不动）：

```typescript
export const appRouter = createTRPCRouter({
  example: exampleRouter,    // 不动
  site: siteRouter,
  blog: blogRouter,
  settings: settingsRouter,
  auth: authRouter,
});
```

### 1.8 创建 seed 脚本 `src/server/db/seed.ts`

从现有静态 config 文件读取数据写入数据库，**只运行一次**：

```bash
npx tsx src/server/db/seed.ts
```

- 导入 `BLOG_POSTS` → 写入 blog_posts 表
- 导入 `DESKTOP_ICON_DEFS` → 写入 desktop_icons 表
- 导入 `PET_DEFS` → 写入 mascots 表
- 写入主题默认值 → site_settings 表

**完成标志**：用 tRPC Panel 或 curl 能查询到博客数据，admin 接口未携带 token 时返回 401。

---

## Phase 2：组件层数据源切换

**目标**：前端组件改为从 tRPC 读取数据，静态配置退为 fallback。
**预估耗时**：半天

### 2.1 创建配置 hook `src/client/hooks/use-site-config.ts`

合并 DB 值（优先）和静态默认值（fallback），确保未配置 DB 的 fork 也能正常工作：

```typescript
export function useSiteSettings() {
  const { data } = trpc.site.getSettings.useQuery();
  return {
    wallpaperUrl: data?.wallpaper_url ?? WALLPAPER_URL,
    logoUrl:      data?.windows_logo_url ?? WINDOWS_LOGO_URL,
    // ...
  };
}
```

### 2.2 逐组件迁移（按优先级，改一个测一个）

| 顺序 | 组件 | 数据来源变更 |
|---|---|---|
| 1 | 博客应用 | `blog.config.ts` → `trpc.site.getBlogPosts` |
| 2 | 桌面图标 | `icons.config.ts` → `trpc.site.getDesktopIcons` |
| 3 | 主题/壁纸 | `theme.config.ts` → `useSiteSettings()` |
| 4 | 吉祥物 | `pets.config.ts` → `trpc.site.getMascots` |

> **重要**：每次只改一个组件，验证页面正常后再改下一个。

**完成标志**：在 Turso 控制台删除一条博客记录，刷新页面后博客列表对应减少。

---

## Phase 3：管理后台 UI

**目标**：可视化后台，通过界面修改所有配置。
**预估耗时**：1-2 周

### 鉴权流程

```
访问 /admin 任意页面
→ _layout.tsx 调用 trpc.auth.verify 检查 cookie
→ 无效 → 重定向 /admin/login
→ 填写密码 → trpc.auth.login → 服务端签发 JWT → httpOnly cookie
→ 后续请求自动携带 cookie，无需手动处理
```

> 管理员只有一个人（自己），密码存环境变量，无需用户注册系统。

### 开发顺序（严格按此顺序，每步依赖前一步）

1. **`/admin/login`** — 无此页则其他一切进不去
2. **`/admin/_layout.tsx`** — 鉴权守卫 + 后台导航框架
3. **`/admin/theme`** — 壁纸 URL、Logo URL、托盘图标
4. **`/admin/blog/index`** — 文章列表（删除、排序）
5. **`/admin/blog/new` & `$id`** — Markdown 编辑器（使用 `@uiw/react-md-editor`）
6. **`/admin/icons`** — 图标显示/隐藏、拖拽排序
7. **`/admin/mascots`** — 吉祥物管理
8. **`/admin/comments`** — 评论系统配置（填写参数即可）

**完成标志**：通过后台修改壁纸 URL，刷新首页后桌面壁纸变化。

---

## Phase 4：ChatBox 留言板系统

**目标**：在 XP 桌面新增独立"留言板"窗口，访客可公开留言，站长可在后台管理（删除/置顶）。
**预估耗时**：半天

### 4.1 数据表：`chat_messages`

```typescript
export const chatMessages = sqliteTable('chat_messages', {
  id:        text('id').primaryKey(),                                   // nanoid
  name:      text('name').notNull(),                                    // 访客昵称
  content:   text('content').notNull(),                                 // 留言内容（纯文本，限 500 字）
  ipHash:    text('ip_hash').notNull(),                                 // SHA-256(IP)，用于限流，不存明文
  isPinned:  integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

### 4.2 tRPC 接口设计

**公开接口**（`publicProcedure`，无需登录）：

```typescript
// 分页读取留言（倒序，置顶消息永远排最前）
chatbox.listMessages({ limit?: number, cursor?: string }) → { items, nextCursor }

// 访客发送留言（防刷机制）
chatbox.createMessage({ name: string, content: string })
// 防刷逻辑：查询同 ip_hash 最近一条消息，若距现在 < 60s 则抛 TOO_MANY_REQUESTS
// name 限 20 字，content 限 500 字（Zod 验证）
```

**管理接口**（`adminProcedure`，需鉴权）：

```typescript
chatbox.deleteMessage({ id: string })
chatbox.togglePin({ id: string })     // 切换置顶状态
```

### 4.3 前台组件：`ChatBox` 窗口

- 在 XP 桌面注册为一个可开关的独立窗口（与博客、Portfolio 平级）
- 窗口内显示留言列表（时间倒序，置顶消息顶部特显）
- 底部输入区：昵称 + 内容 + 发送按钮
- 发送成功后乐观更新，失败时展示限流提示

### 4.4 后台管理：`/admin/chatbox`

- 留言列表（含 IP hash 显示供参考）
- 删除按钮（单条）
- 置顶/取消置顶切换

---

## Phase 5：Portfolio / Media / Winamp / Contact / About 后台管理

**目标**：将桌面核心组件的内容全部云端化，通过后台可视化配置。
**预估耗时**：2-3 天

### 5.1 新增数据表

```typescript
// My Portfolio — 作品集
export const portfolioItems = sqliteTable('portfolio_items', {
  id:          text('id').primaryKey(),
  title:       text('title').notNull(),
  description: text('description').notNull().default(''),
  techStack:   text('tech_stack').notNull().default(''),  // 逗号分隔或 JSON 数组字符串
  link:        text('link').notNull().default(''),
  imageUrl:    text('image_url').notNull().default(''),
  order:       integer('order').notNull().default(0),
  visible:     integer('visible', { mode: 'boolean' }).notNull().default(true),
});

// Media Player / Winamp 共用播放列表
export const mediaTracks = sqliteTable('media_tracks', {
  id:       text('id').primaryKey(),
  title:    text('title').notNull(),
  artist:   text('artist').notNull().default(''),
  src:      text('src').notNull(),           // 外链 URL 或相对路径
  coverUrl: text('cover_url').notNull().default(''),
  order:    integer('order').notNull().default(0),
});
```

**Contact Me / About Me**：内容结构相对简单（一段文本 + 若干链接），使用 `site_settings` 存储 JSON 字符串，无需独立建表。

### 5.2 新增 tRPC 路由

- `portfolio.ts`（`adminProcedure`）：CRUD + 排序
- `media.ts`（`adminProcedure`）：CRUD + 排序；公开读取接口注册到 `site.ts`
- `site.ts` 追加：`getPortfolioItems` / `getMediaTracks`（公开）

### 5.3 新增后台页面

| 页面 | 路径 | 功能 |
|---|---|---|
| 作品集管理 | `/admin/portfolio` | 卡片列表 + 添加/编辑/删除 |
| 曲目管理 | `/admin/media` | 表格列表 + 拖拽排序 + CRUD |
| 联系方式 | `/admin/contact` | 文本 + 社交链接 key-value 编辑 |
| 关于我 | `/admin/about` | 富文本/Markdown 编辑器 |

### 5.4 前台组件切换

各组件从静态 config → `trpc.site.getXxx`，模式与 Phase 2 相同，改一个验一个。

---

## Phase 6：通用文档窗口管理系统

> ⚠️ **2026-04-29 需求变更**：原 Phase 6「Resume 结构化分区表单」方案已废弃。
> 原因：`src/client/apps/resume/index.tsx` 的实际设计是**通用 Markdown 文档查看器**，
> 顶部注释明确提供了复用指南（复制文件夹 → 改 DOC_CONFIG → 注册到 APP_REGISTRY）。
> 将其改造为结构化表单完全背离了组件的设计意图，且引入了不必要的复杂度。
> 正确路径：以「通用文档窗口管理系统」替代，Resume 作为第一个迁入实例。

**目标**：在桌面上支持任意数量的 Markdown 文档窗口，每个窗口的内容与外观均可在后台管理，无需改代码。
**预估耗时**：1-2 天

---

### 核心设计原则

`ResumeApp`（以及通过复用指南创建的任何文档窗口）本质上只需三个输入：

| 输入 | 旧方案（静态） | 新方案（DB 驱动） |
|---|---|---|
| Markdown 内容 | `import readme?raw` 硬编码 | `documents.content` 字段 |
| 背景图 URL | `DOC_CONFIG.backgroundImage` 硬编码 | `documents.bg_url` 字段 |
| 背景透明度 | `DOC_CONFIG.backgroundOpacity` 硬编码 | `documents.bg_opacity` 字段 |

组件逻辑完全不变，只需将数据来源从静态 `DOC_CONFIG` 切换到 tRPC 查询结果。

---

### 6.1 新增数据表 `documents`

```typescript
export const documents = sqliteTable('documents', {
  id:         text('id').primaryKey(),                                // nanoid，同时作为 APP_REGISTRY 键
  title:      text('title').notNull(),                               // 窗口标题 & 桌面图标文字
  iconSrc:    text('icon_src').notNull().default(''),                // 桌面图标图片 URL
  content:    text('content').notNull().default(''),                 // Markdown 全文
  bgUrl:      text('bg_url').notNull().default(''),                  // 背景图 URL（空字符串 = 无背景）
  bgOpacity:  real('bg_opacity').notNull().default(0.12),            // 背景透明度 0.0–1.0
  order:      integer('order').notNull().default(0),                 // 桌面图标排列顺序
  visible:    integer('visible', { mode: 'boolean' }).notNull().default(true),
});
```

执行 `npx drizzle-kit push` 建表。

**Seed 数据**：将现有 `README.md` 内容作为 id=`'resume'`、title=`'My Resume'` 的第一条记录写入，完成 Resume 迁移。

---

### 6.2 新增 tRPC 路由 `src/server/trpc/routes/documents.ts`

**公开接口**（`publicProcedure`）：
```typescript
documents.list()  // 返回 visible=true 的文档列表，按 order asc
```

**管理接口**（`adminProcedure`）：
```typescript
documents.listAll()                    // 返回所有文档（含隐藏）
documents.create({ title, iconSrc?, content?, bgUrl?, bgOpacity?, order? })
documents.update({ id, ...partial })   // partial 更新，id 不存在抛 NOT_FOUND
documents.delete({ id })
```

注册到 `router.ts`：`documents: documentsRouter`。

`site.ts` 追加公开接口 `getDocuments`（等价于 `documents.list`，供前台 `useSiteSettings` 外的组件直接调用）。

---

### 6.3 前台组件改造：`ResumeApp` → 通用 `DocumentApp`

**改造范围**：`src/client/apps/resume/index.tsx`

- 移除静态 `DOC_CONFIG` 对象和 `import readme?raw`
- 接收 `documentId: string` prop（通过 APP_REGISTRY 的 `props` 字段传入）
- 调用 `trpc.site.getDocuments.useQuery()` 或 `trpc.documents.list.useQuery()`，按 id 找到当前文档
- 渲染逻辑不变：背景图层 + 内容层 + Markdown 渲染
- **移除窗口内透明度滑块**（OpacityControl 组件），透明度由后台「外观设置」控制，与 About/Contact 保持一致
- 工具栏文件名改为动态显示 `document.title`

**工具栏文件名**：`{document.title} — 只读`（原来是硬编码的 `README.md`）

---

### 6.4 桌面动态注册机制

每个 `documents` 表中的记录，需要在前台桌面上注册为可点击的图标和可打开的窗口。

**方案**：复用 Phase 2 解决博客 nanoid 文章的动态注册模式：

1. 桌面组件（`home.tsx` 或图标层）调用 `trpc.site.getDocuments` 获取文档列表
2. 对每条文档，生成 APP_REGISTRY 条目：
   ```typescript
   APP_REGISTRY[`doc-${doc.id}`] = {
     id:           `doc-${doc.id}`,
     title:        doc.title,
     icon:         doc.iconSrc || '/assets/icons/document.png',
     defaultWidth: 720,
     defaultHeight: 560,
     AppComponent: (props) => <DocumentApp documentId={doc.id} {...props} />,
   };
   ```
3. 同时渲染桌面图标（直接由 `documents` 列表驱动，**不**写入 `desktop_icons` 表，避免两处数据源）
4. 点击图标 dispatch `OPEN_APP` 事件，与现有窗口系统完全兼容

**注意**：文档的桌面图标独立于 `desktop_icons` 表管理，两套系统互不干扰：
- `desktop_icons` 表管理应用入口图标（博客、Portfolio、ChatBox 等）
- `documents` 表自带图标信息，直接在桌面渲染

---

### 6.5 管理后台 `/admin/documents`

**布局**：左侧文档列表 + 右侧编辑面板（仿 Blog 管理页风格）

**文档列表区**：
- 每行显示：标题、可见状态徽标、排序序号、「编辑」「删除」按钮
- 顶部「＋ 新建文档」按钮（新建后自动切到右侧编辑该文档）

**编辑面板区**（选中文档后显示）：

```
┌─────────────────────────────────────────────────────┐
│ Section: 📄 文档信息                                  │
│   标题：[_________________________]                   │
│   图标 URL：[_____________________]  [预览]           │
│   排序：[___]  可见：[✓]                              │
├─────────────────────────────────────────────────────┤
│ Section: 📝 Markdown 内容                             │
│   [大文本框，rows=20，等宽字体]                        │
│                                    [💾 保存内容]      │
├─────────────────────────────────────────────────────┤
│ Section: 🎨 外观设置（全局默认背景）                   │
│   背景图 URL：[_____________________]                  │
│   [200×120 实时预览缩略图]                             │
│   透明度：[════════════] 12%                           │
│                                    [💾 保存外观]      │
└─────────────────────────────────────────────────────┘
```

保存内容调用 `documents.update({ id, title, iconSrc, content, visible, order })`。
保存外观调用 `documents.update({ id, bgUrl, bgOpacity })`。
两个保存按钮独立，避免大文本框内容与外观设置相互干扰。

**删除**：二次确认对话框，删除后文档从桌面消失。

---

### 6.6 侧边栏导航

在 `src/routes/admin/_layout.tsx` 的 `NAV_ITEMS` 中追加：

```typescript
{ icon: '📄', label: '文档窗口', href: '/admin/documents' },
```

---

### 与现有系统的关系

| 系统 | 交互方式 |
|---|---|
| `desktop_icons` 表 | 无关，文档图标由 `documents` 表自带，独立渲染 |
| `blog_posts` 表 | 无关，博客是列表窗口，文档是单文档阅读窗口 |
| `site_settings` 表 | 无关，文档独立建表，结构更清晰 |
| APP_REGISTRY | 运行时动态写入（与 Phase 2 博客文章方案相同） |
| `settings.ts` tRPC | 不复用，文档有独立 `documents.ts` 路由 |

---

## Phase 7：站点身份信息自定义

**目标**：让站长通过管理后台自定义网页标题、欢迎屏用户名/头像/角色、开始菜单用户名等身份信息，无需改代码。  
**预估耗时**：2–4 小时  
**依赖**：Phase 0–3 全部完成（`site_settings` 表、`useSiteSettings` hook、`/admin/theme` 页已存在）

---

### 设计原则

- 不新建数据表，不新建 tRPC 路由 — 全部复用现有 `site_settings` key-value 表和 `settings.setBatch` 接口
- 与现有 `useSiteSettings()` 模式完全一致：DB 值优先，静态兜底
- `<title>` / `<meta>` SSR 问题用客户端 `document.title` 覆盖方案（对个人主页 SEO 无实质影响）
- `WelcomeGuard` 加载中显示静态 Fallback，数据到达后若动画仍在播放则已渲染正确值

---

### 7.1 新增 site_settings keys

不需执行任何 migration，key-value 表按需写入即可。

| Key | 说明 | 静态 Fallback |
|-----|------|--------------|
| `site_title` | 浏览器标签页标题 + og:title | `'NNNullptr'` |
| `site_description` | meta description + og:description | `'NNNullptr'` |
| `site_author` | meta author + twitter 署名 | `'NNNullptr'` |
| `site_username` | Login 右栏用户名 + Start 菜单用户名 | `'NNNullptr'` |
| `site_avatar_url` | Login 右栏头像 + Start 菜单头像 | `'/assets/avatarSrc.jpg'` |
| `site_role` | Login 左/右栏角色说明 | `'Software Developer'` |
| `site_brand` | Boot/Login 左栏品牌大字 | `'MoeKernel'` |
| `boot_subtitle` | Boot 阶段副标题文字 | `'Welcome'` |

---

### 7.2 更新 `useSiteSettings()`

文件：`src/client/hooks/use-site-config.ts`

在 return 对象中新增以下字段：

```typescript
siteTitle:       data?.site_title       ?? 'NNNullptr',
siteDescription: data?.site_description ?? 'NNNullptr',
siteAuthor:      data?.site_author      ?? 'NNNullptr',
siteUsername:    data?.site_username    ?? 'NNNullptr',
siteAvatarUrl:   data?.site_avatar_url  ?? '/assets/avatarSrc.jpg',
siteRole:        data?.site_role        ?? 'Software Developer',
siteBrand:       data?.site_brand       ?? 'MoeKernel',
bootSubtitle:    data?.boot_subtitle    ?? 'Welcome',
```

---

### 7.3 更新 `welcome-guard.tsx`

文件：`src/client/views/welcome-guard.tsx`

- 在 `WelcomeGuard` 组件内调用 `useSiteSettings()`（已有 hook，直接 import）
- 将 identity 字段以 props 向下传给 `BootStage` 和 `LoginStage`
- 加载中（`isLoaded === false`）时使用静态 Fallback（`useSiteSettings()` 已内置，无需额外处理）
- 替换所有写死字符串：

| 原硬编码 | 替换为 |
|---------|--------|
| `MoeKernel`（Boot 大字） | `settings.siteBrand` |
| `Welcome`（Boot 副标题） | `settings.bootSubtitle` |
| `MoeKernel`（Login 左栏） | `settings.siteBrand` |
| `Software Developer`（左栏） | `settings.siteRole` |
| `To begin, click your user name` | 保持硬编码（通用引导语） |
| `/assets/avatarSrc.jpg`（头像） | `settings.siteAvatarUrl` |
| `NNNullptr`（右栏用户名） | `settings.siteUsername` |
| `Software Developer`（右栏） | `settings.siteRole` |

---

### 7.4 更新 `start-menu.tsx`

文件：`src/client/views/start-menu.tsx`

- 在 `StartMenu` 组件内调用 `useSiteSettings()`
- 替换头部头像 URL（硬编码的 `static.step1.dev` URL）→ `settings.siteAvatarUrl`
- 替换用户名 `NNNullptr` → `settings.siteUsername`

---

### 7.5 更新 `__root.tsx`（页面标题与 meta）

文件：`src/routes/__root.tsx`

`__root.tsx` 是 SSR 渲染的，`useQuery` 无法在服务端获取 DB 数据，采用**客户端覆盖**方案：

**步骤 A**：`<title>` 等 meta 标签保留静态默认值作为 SSR 骨架（SEO 爬虫首帧）  
**步骤 B**：在 `src/routes/index.tsx`（或新建 `SiteHead` 组件）中：

```typescript
const settings = useSiteSettings();
useEffect(() => {
  if (!settings.isLoaded) return;
  document.title = settings.siteTitle;
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', settings.siteDescription);
  document.querySelector('meta[property="og:title"]')
    ?.setAttribute('content', settings.siteTitle);
  // ...其余 meta 同理
}, [settings.isLoaded, settings.siteTitle, settings.siteDescription]);
```

此方案不改 SSR 数据流，实现代价最低。

---

### 7.6 管理后台：主题设置页新增「站点信息」分区

文件：`src/routes/admin/_layout/theme.tsx`

在现有表单末尾追加新的 `<fieldset>` 分区：

```
┌─────────────────────────────────────────────────────┐
│ 🪪 站点身份信息                                       │
│                                                     │
│ 站点标题（<title>）     [___________________]        │
│ 站点描述（description）  [___________________]       │
│ 作者署名（author）       [___________________]       │
│ ─────────────────────────────────────────────────── │
│ 欢迎屏品牌大字           [___________________]       │
│ Boot 副标题              [___________________]       │
│ 角色/头衔说明            [___________________]       │
│ 用户名（Login + Start）  [___________________]       │
│ 头像图片 URL             [___________________] [预览]│
│                                                     │
│                              [💾 保存站点信息]       │
└─────────────────────────────────────────────────────┘
```

保存时调用 `trpc.settings.setBatch`，传入所有 8 个 key-value 对，并 invalidate `site.getSettings` 缓存。

---

### 完成标志验证

- [ ] 后台修改「站点标题」，浏览器标签页显示新标题
- [ ] 后台修改「用户名」，Start 菜单头部用户名更新
- [ ] 后台修改「头像 URL」，Login 屏和 Start 菜单头像同步更新
- [ ] 后台修改「品牌大字」，WelcomeGuard Boot/Login 阶段显示新内容
- [ ] 删除 Turso 连接（断网测试），所有位置显示静态 Fallback，不报错

---

## 部署目标流程（最终用户体验）

**运行环境**：Ubuntu 云服务器 + 宝塔面板 + Nginx 反向代理 + Cloudflare 代理 + Node.js 20

```
1. 服务器准备：Ubuntu + 宝塔面板，通过宝塔安装 Node.js 20、pnpm、pm2
2. Turso 创建数据库（免费套餐） → 复制 URL + AUTH_TOKEN
3. git clone 仓库到服务器 → pnpm install → pnpm build
4. 项目根目录创建 .env，填入以下环境变量：
   TURSO_DATABASE_URL=libsql://xxx.turso.io
   TURSO_AUTH_TOKEN=eyJ...
   ADMIN_PASSWORD=你的管理员密码
   JWT_SECRET=至少32字符的强随机字符串
   NODE_ENV=production
   COOKIE_DOMAIN=（可选，跨子域名共享时填 .yoursite.com，通常留空）
5. pm2 start（监听本地端口，如 3000）
6. 宝塔：创建站点 → 绑定子域名 → 反向代理到 127.0.0.1:3000
7. Cloudflare：DNS 启用橙云代理 → SSL 模式设为 Full (Strict)
   → Page Rule：yoursite.com/api/trpc/* → Cache Level: Bypass
8. 访问 https://your-subdomain.yoursite.com/admin → 登录 → 配置桌面
```

### 反向代理与 Cloudflare 配置约束

**Nginx 必须转发的请求头**（宝塔反向代理模板通常已默认配置）：
```nginx
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

**Cloudflare 必须配置**：
- SSL/TLS 加密模式：**Full (Strict)** — 若设为 Flexible，`Secure` Cookie 在 CF→源站的 HTTP 段会不稳定
- Page Rule：`/api/trpc/*` → **Cache Level: Bypass** — 防止查询结果被 CDN 缓存串用户
- 若开启「Bot Fight Mode」，需将 `/admin/*` 和 `/api/trpc/*` 加入白名单

**关于 Cookie `Secure` 标志的策略**：
- 不依赖检测 `X-Forwarded-Proto` 头（避免头伪造风险）
- 统一由 `NODE_ENV === 'production'` 控制：生产环境自动启用 `Secure`，开发环境不启用
- 因此本地开发 HTTP 可正常调试，生产 HTTPS 自动加固

---

## 开发过程检查清单

每个 Phase 开始前自查：

- [ ] 这个功能的数据只来自一个地方吗？
- [ ] 服务端逻辑有没有混进 React 组件？
- [ ] 新建的 tRPC 路由文件超过 150 行了吗？（超了就拆）
- [ ] 有没有在 `env.ts` 以外的地方读取 `process.env`？
- [ ] 新文件的命名和位置符合已有规范吗？
