# 全栈化改造 · 执行进度与评估

> 对应规划文档：[fullstack-plan.md](./fullstack-plan.md)
> 每完成一个步骤后在此记录结果、遇到的问题和实际偏差。

---

## 架构变更日志

### 2026-04-29 · 需求变更：Phase 6 Resume 结构化方案废弃 → 通用文档窗口管理系统

| 项目 | 原方案（废弃） | 新方案 |
|---|---|---|
| Phase 6 目标 | Resume 组件改为结构化分区表单（basics / experience / projects / skills / education） | 通用文档窗口管理系统，Resume 作为第一个迁入实例 |
| 数据存储 | `site_settings` 存储 `resume_basics` / `resume_experience` 等多个 JSON 键 | 独立 `documents` 表，每条记录 = 一个 XP 文档窗口（id / title / iconSrc / content / bgUrl / bgOpacity / order / visible） |
| tRPC 路由 | 复用 `settings.ts` 的 setBatch | 新建 `documents.ts`（公开 `list` + 管理 CRUD） |
| 后台页面 | `/admin/resume`，分 Tab 的动态表单 | `/admin/documents`，左侧列表 + 右侧编辑面板（内容区 + 外观区各自独立保存） |
| 前台组件 | `ResumeApp` 改为读取结构化字段并渲染各分区 | `ResumeApp` → 通用 `DocumentApp`，接收 `documentId` prop，从 `documents.list` 按 id 取内容 |
| 桌面注册 | 静态写死在 APP_REGISTRY | 运行时动态注册（复用 Phase 2 博客 nanoid 文章方案） |
| 透明度滑块 | 保留在前台窗口内（OpacityControl 组件） | 迁移到后台外观设置（与 About / Contact 保持一致） |

**变更原因**：仔细阅读 `src/client/apps/resume/index.tsx` 后发现，该组件的实际设计是**通用 Markdown 文档查看器**，顶部注释提供了完整的复用指南（修改 `DOC_CONFIG` + 复制文件夹），与「简历结构化表单」的规划完全背离。新方案尊重组件的原始设计意图，通过数据库驱动的方式实现同等目标，同时为未来增加任意文档窗口提供了扩展路径。

**影响范围**：已完成的 Phase 0–5 代码无需改动。`documents` 新表与现有 `desktop_icons`、`site_settings` 表完全独立。

---

### 2026-04-25 · 需求变更：评论系统取消 → 全局 ChatBox + 多组件后台扩容

| 项目 | 原方案 | 新方案 |
|---|---|---|
| 评论系统 | 博客文章下方嵌入 Giscus/Waline | 取消；改为 XP 桌面独立"留言板"窗口（自研 ChatBox） |
| Phase 4 定义 | 评论系统配置 | ChatBox 留言板系统（独立数据表 + tRPC + 前台窗口） |
| 后台管理范围 | Blog / 图标 / 桌宠 | 新增：My Portfolio、Media Player/Winamp、Contact Me、About Me |
| Resume 组件 | 前端硬编码 | Phase 6 全栈化：后台编辑，前台动态渲染（数据存 site_settings JSON） |

**新增数据表**：`chat_messages`（Phase 4）、`portfolio_items`（Phase 5）、`media_tracks`（Phase 5）。
Resume 不新建表，复用 `site_settings` 存储 `resume_*` 系列 JSON 字段。

**影响范围**：不修改任何已完成代码，所有变更为纯增量添加。Phase 3.9（`/admin/comments`）已完成的评论配置页面保留，不删除。

---

### 2026-04-22 · 部署方案重定位：Deno Deploy → 自有服务器 + Cloudflare

| 项目 | 原方案 | 新方案 |
|---|---|---|
| 部署平台 | Deno Deploy Serverless | Ubuntu 云服务器 + 宝塔面板 |
| 运行时 | Deno | **Node.js 20** |
| 反向代理 | 无 | Nginx（宝塔管理）+ Cloudflare CDN |
| 域名 | Deno 分配子域名 | 自有域名 + Cloudflare 代理 |

**技术影响与决策**：
- DB 驱动 `@libsql/client/http` **保留不动**（Node 同样支持，HTTP 驱动也是 Node 推荐方案）
- Cookie `Secure` 策略：由 `NODE_ENV === 'production'` 控制，不依赖 `X-Forwarded-Proto`（防伪造头）
- 新增环境变量：`NODE_ENV`（宽松校验，非 production 均视为开发环境并 warn）、`COOKIE_DOMAIN`（可选）
- 新增依赖：`jose`（安装于项目根目录 `D:/MoeKernel`）

**不受影响的已完成工作**：Phase 0 全部成果、Phase 1.1–1.5 所有路由均与运行时无关

**部署侧约束（非代码，需人工配置）**：
- Cloudflare SSL 模式必须 **Full (Strict)**（Flexible 模式下 Secure Cookie 不稳定）
- Cloudflare Page Rule：`/api/trpc/*` → **Cache Level: Bypass**
- Nginx 必须转发 `X-Forwarded-*` 标准头（宝塔模板默认已配）

---

## 里程碑总览

| 阶段 | 状态 | 完成日期 | 备注 |
|---|---|---|---|
| Phase 0：基础设施 | ✅ 完成 | 2026-04-22 | 4 张表已在 Turso 云端就绪 |
| Phase 1：tRPC 数据层 | ✅ 完成 | 2026-04-23 | seed 待执行（1.8），其余全部就绪 |
| Phase 2：组件数据源切换 | ✅ 完成 | 2026-04-25 | 全部 4 个组件已切换至 tRPC，静态配置退为 fallback |
| Phase 3：管理后台 UI | ✅ 完成 | 2026-04-26 | 9 个子步骤全部完成 |
| Phase 4：ChatBox 留言板 | ✅ 完成 | 2026-04-26 | 含后台管理 + 皮肤系统全栈化 |
| Phase 5：Portfolio/Media/Contact/About 后台 | ✅ 完成 | 2026-04-29 | 5.1 Portfolio / 5.2 Media / 5.3 Contact+About 全部完成 |
| Phase 6：通用文档窗口管理系统 | ✅ 完成 | 2026-05-03 | Task A ✅ Task B ✅ Task C ✅（含 Bug Fix）|

> 状态说明：🔲 未开始 / 🔄 进行中 / ✅ 完成 / ❌ 阻塞

---

## Phase 0：项目基础设施

**目标**：数据库连通，能读写，不触碰任何现有代码

### 步骤检查

- [x] **0.1** 安装依赖（`drizzle-orm` / `@libsql/client` / `drizzle-kit`）
- [x] **0.2** 创建 `src/server/env.ts`，应用启动时验证环境变量（含错误汇总 + JWT 长度校验）
- [x] **0.3** 创建 `src/server/db/client.ts`，Drizzle + Turso HTTP 连接（使用 `/http` 驱动适配 Deno Deploy）
- [x] **0.4** 创建 `src/server/db/schema.ts`，定义 4 张表（字段与现有 config 文件完全对齐）
- [x] **0.5** 创建 `drizzle.config.ts`（项目根目录）
- [x] **0.6** 执行 `npx drizzle-kit push`，建表成功

### 完成标志验证

- [x] Turso 控制台可见：`site_settings` / `blog_posts` / `desktop_icons` / `mascots` 四张空表
- [x] 本地启动项目无报错

### 问题记录

<!-- 遇到的报错、环境问题、与规划的偏差，记录在这里 -->

---

## Phase 1：tRPC 数据层

**目标**：建立完整的服务端 API，不改任何前端组件

### 步骤检查

- [x] **1.1** 在 `middlewares.ts` 追加 `adminMiddleware`（临时密码对比，Phase 3 换 JWT）
- [x] **1.2** 在 `procedure.ts` 导出 `adminProcedure`（修正规划偏差：不重复挂载 logging）
- [x] **1.3** 创建 `routes/site.ts`（公开读取接口）
  - [x] `getSettings`（DB 行 → 扁平 Record<string,string> 对象）
  - [x] `getBlogPosts`（按 order asc 排序）
  - [x] `getDesktopIcons`（过滤 visible=true，按 order asc 排序）
  - [x] `getMascots`（按 order asc 排序）
- [x] **1.4** 创建 `routes/blog.ts`（需鉴权）
  - [x] `list`（全量，含草稿，按 order asc）
  - [x] `create`（nanoid 生成 id，$defaultFn 自动填 createdAt）
  - [x] `update`（partial 更新，空字段提前拦截，returning 判断 NOT_FOUND）
  - [x] `delete`（returning 判断 NOT_FOUND，返回 {success, id}）
- [x] **1.5** 创建 `routes/settings.ts`（需鉴权）
  - [x] `get`（读取全部设置，扁平对象）
  - [x] `set`（单条 Upsert）
  - [x] `setBatch`（批量 Upsert，`excluded.value` 语法，支持主题页一键保存）
  - [x] `listAllIcons` / `createIcon` / `updateIcon` / `deleteIcon`（图标 id 由调用方传入）
  - [x] `listAllMascots` / `createMascot` / `updateMascot` / `deleteMascot`（吉祥物 id 由 nanoid 生成）
- [x] **1.6** 创建 `routes/auth.ts`（Node.js + Cloudflare 优化版）
  - [x] `login`（HS256 JWT 7天；httpOnly Cookie；Secure 由 `NODE_ENV` 控制；Domain 由 `COOKIE_DOMAIN` 控制）
  - [x] `logout`（Max-Age=0 立即清除 Cookie）
  - [x] `verify`（jwtVerify，捕获所有 jose 异常返回 `{authenticated:false}`，可 SSR 调用）
  - [x] 前置：`context.ts` 增加 `resHeaders`，`trpc.$.ts` 增加 `responseMeta` 钩子
  - [x] 规范加固：`buildCookieString` 改为读取 `env.NODE_ENV` / `env.COOKIE_DOMAIN`，消除直接 `process.env` 访问
  - [x] ⚠️ 已知限制：login/logout 需浏览器侧调用（SSR local link 不转发 resHeaders）
  - [x] ⚠️ 部署要求：CF SSL=Full(Strict)；`/api/trpc/*` Bypass 缓存
- [x] **1.7** 更新 `router.ts`，注册 site / blog / settings / auth 四个路由（example 保持不动）
  - [x] 配套：`vite.config.ts` Nitro preset 从 `deno-deploy` 改为 `node-server`
  - [x] 配套：新建 `ecosystem.config.cjs`（PM2 配置，cluster 模式，512M 内存保护）
- [x] **1.8** 编写 `src/server/db/seed.ts`（onConflictDoUpdate；blog 用 fs.readFileSync 绕过 Vite ?raw；createdAt 不随 seed 覆盖）
  - 运行命令：`pnpm db:seed`（已加入 package.json scripts）

### 完成标志验证

- [x] `pnpm db:seed` 成功，控制台输出 4 条 ✅
- [x] Turso 控制台可见各表数据
- [x] 未携带 token 调用 admin 接口，返回 `UNAUTHORIZED`
- [x] 调用 `trpc.auth.login` 传正确密码后，cookie 被写入

### 问题记录

<!-- -->

---

## Phase 2：组件层数据源切换

**目标**：前端显示来自数据库的内容，静态配置退为 fallback

### 步骤检查

- [x] **2.1** 创建 `src/client/hooks/use-site-config.ts`，实现 DB 值 + 静态 fallback 合并
- [x] **2.2** 博客应用 → 改为读取 `trpc.site.getBlogPosts`，验证正常
- [x] **2.3** 桌面图标 → 改为读取 `trpc.site.getDesktopIcons`，验证正常
- [x] **2.4** 主题/壁纸 → 改为读取 `useSiteSettings()`，验证正常
- [x] **2.5** 吉祥物 → 改为读取 `trpc.site.getMascots`，验证正常

### 完成标志验证

- [ ] 在 Turso 控制台删除一篇博客，刷新页面后博客列表对应减少
- [ ] 在 Turso 修改 `wallpaper_url` 的值，刷新页面后壁纸变化
- [ ] 未配置 DB（断开 Turso）时，页面 fallback 到静态配置，不崩溃

### 问题记录

- **新建文章点击无法打开**：`APP_REGISTRY` 只在模块加载时注册静态 `BLOG_POSTS`，DB 创建的文章（nanoid id）不在其中。修复：`ArticleTile` 点击 dispatch 改为携带 `{ id, title, icon }` 对象；`home.tsx` 事件处理器在找不到注册项时动态写入 `APP_REGISTRY`（避免从 `blog/index.tsx` 反向 import registry 造成循环依赖）。

---

## Phase 3：管理后台 UI

**目标**：可通过 /admin 页面修改站点所有配置

### 步骤检查

**基础框架**
- [x] **3.1** 创建 `/admin/login` 登录页，调用 `trpc.auth.login`
- [x] **3.2** 创建 `/admin/_layout.tsx`，验证 session，未登录跳转 login；新增 `_layout/index.tsx` 仪表盘占位

**各功能页（按顺序完成）**
- [x] **3.3** `/admin/theme` — 壁纸 URL、Logo URL、托盘图标列表（含 adminMiddleware JWT 升级）
- [x] **3.4** `/admin/blog/index` — 文章列表，支持删除（双缓存失效：blog.list + site.getBlogPosts）
- [x] **3.5** `/admin/blog/new` — 新建文章，含 Markdown 编辑器（MDEditor lazy 加载规避 SSR）
- [x] **3.6** `/admin/blog/$id` — 编辑文章（从 blog.list 按 id 过滤预填表单；保存后双缓存失效；成功弹窗提供"继续编辑/返回列表"两个出口）
- [x] **3.7** `/admin/icons` — 图标显示/隐藏（立即保存）、内联编辑名称/路径/排序、添加/删除图标
- [x] **3.8** `/admin/mascots` — 桌宠管理（缩略图网格视图；添加/编辑/删除弹窗；实时预览精灵+图标；尺寸滑块）
- [x] **3.9** `/admin/comments` — 评论方案选择（disabled/Giscus/Waline）+ 动态表单 + Key 预览面板

### 完成标志验证

- [ ] 未登录访问 `/admin/theme`，自动跳转到 `/admin/login`
- [ ] 登录后在主题页修改壁纸 URL，保存后刷新首页壁纸变化
- [ ] 在博客管理页新建一篇文章，前台博客列表中出现新文章
- [ ] 在图标页隐藏某图标，前台桌面对应图标消失

### 问题记录

<!-- -->

---

## Phase 4：ChatBox 留言板系统

**目标**：XP 桌面新增"留言板"独立窗口，访客公开留言，后台可管理

### 步骤检查

- [x] **4.1** 在 `schema.ts` 添加 `chat_messages` 表，执行 `drizzle-kit push`
- [x] **4.2** 创建 `src/server/trpc/routes/chatbox.ts`（公开 listMessages + createMessage；管理 deleteMessage + togglePin）
- [x] **4.3** 注册 `chatbox` 路由到 `router.ts`
- [x] **4.4** 创建前台 `ChatBox` 窗口组件（`src/client/apps/chatbox/index.tsx`），注册到 APP_REGISTRY
- [x] **4.5** 在 XP 桌面添加留言板图标入口（`icons.config.ts`，使用 MSN.png 图标）
- [x] **4.6** 创建 `/admin/chatbox` 后台管理页（留言删除/置顶 + 外观皮肤设置）
- [x] **4.7** `use-site-config.ts` 新增 `chatboxBgUrl` / `chatboxBgOpacity` 字段（含 `isLoaded` 信号）
- [x] **4.8** 前台 `ChatBoxApp` 从 `useSiteSettings()` 初始化默认背景，用户可临时覆盖

### 完成标志验证

- [x] 访客填写昵称 + 内容后点发送，留言出现在列表
- [x] 同一 IP 60 秒内连续发送第二条，返回限流提示
- [x] 后台可删除留言，前台刷新后消失
- [x] 后台可置顶留言，前台列表顶部显示
- [x] 后台外观页修改背景 URL，前台 ChatBox 窗口重新打开后自动应用

### 问题记录

<!-- -->

---

## Phase 5：Portfolio / Media / Winamp / Contact / About 后台管理

**目标**：将上述组件内容全部云端化，通过 /admin 可视化配置

### 步骤检查

**Phase 5.1 — Portfolio 全栈化（2026-04-27 完成）**

- [x] **5.1a** `schema.ts` 添加 `portfolio_items` 表（9 字段），执行 `drizzle-kit push`
- [x] **5.1b** 创建 `src/server/trpc/routes/portfolio.ts`（`list` 公开 / `listAll` 管理 / `create` / `update` / `delete`）
- [x] **5.1c** `routes/site.ts` 追加 `getPortfolioItems` 公开接口
- [x] **5.1d** 注册 `portfolio: portfolioRouter` 到 `router.ts`
- [x] **5.1e** 创建 `/admin/portfolio` 后台页（条目卡片列表 + 编辑器弹窗 CRUD + 外观设置）
- [x] **5.1f** `use-site-config.ts` 新增 `portfolioBgUrl` / `portfolioBgOpacity` 字段
- [x] **5.1g** 重写前台 `src/client/apps/portfolio/index.tsx`：
  - 数据源切换为 `trpc.portfolio.list`（仅 visible=true，按 order 升序）
  - 背景改为从 `useSiteSettings()` 读取（`portfolioBgUrl` / `portfolioBgOpacity`）
  - `fileName` → `imageUrl`（直接使用完整 URL）
  - 灯箱新增：技术栈标签气泡 + 项目链接按钮
  - 移除工具栏透明度滑块（现由管理后台控制）
- [x] **5.1h** 管理后台侧边栏新增「🗂️ 作品集」导航项

**Phase 5.2 — Media & Winamp 全栈化（2026-04-28 完成）**

- [x] **5.2a** `schema.ts` 添加 `media_tracks` 表（9 字段 type='audio'|'video'|'bilibili'），执行 push
- [x] **5.2b** 创建 `src/server/trpc/routes/media.ts`（`list` / `listAll` / `create` / `update` / `delete`）
- [x] **5.2c** `routes/site.ts` 追加 `getMediaTracks` 公开接口
- [x] **5.2d** 注册 `media: mediaRouter` 到 `router.ts`
- [x] **5.2e** 创建 `/admin/media` 后台页（表格 + 类型 Tab 过滤 + 编辑器弹窗 + Winamp 外观设置）
- [x] **5.2f** `use-site-config.ts` 新增 `winampBgUrl` / `winampBgOpacity`
- [x] **5.2g** 重写 Winamp（`apps/winamp/index.tsx`）：
  - 数据源切换为 `trpc.media.list`（过滤 type='audio'，按 order 升序）
  - 背景改为从 `useSiteSettings()` 读取（`winampBgUrl` / `winampBgOpacity`）
  - 保留 `consumePendingViewFile()` 拖入文件逻辑
- [x] **5.2h** 重写 Video Player（`apps/video-player/index.tsx`）：
  - 数据源切换为 `trpc.media.list`（过滤 type='video'|'bilibili'，按 order 升序）
  - DB `type='video'` → mp4 模式；`type='bilibili'` → B站 iframe 模式
  - 保留 `consumePendingViewFile()` 拖入视频逻辑
- [x] **5.2i** 管理后台侧边栏新增「🎵 媒体库」导航项

**Phase 5.3 — Contact / About 全栈化（2026-04-29 完成）**

- [x] **5.3a** `use-site-config.ts` 新增 `ContactItem` / `AboutConfig` 类型 + 导出，添加 `contactLinks` / `aboutConfig` 字段（含 JSON 解析 + 静态 Fallback）
- [x] **5.3b** 创建 `/admin/contact` — 社交链接表单（增删改 + 图标预览 + setBatch 保存 + 失效前台缓存）
- [x] **5.3c** 创建 `/admin/about` — 基本信息 + Markdown TextArea（setBatch 保存 + 失效前台缓存）
- [x] **5.3d** 前台 `ContactApp` 改为读取 `useSiteSettings().contactLinks`，fallback 到静态默认值
- [x] **5.3e** 前台 `AboutMeApp` 改为读取 `useSiteSettings().aboutConfig`，背景透明度支持本地临时覆盖
- [x] **5.3f** 管理后台侧边栏新增「📬 联系设置」和「👤 关于设置」两个导航项

**存储结构**：
- `site_settings` key `contact_content` → `ContactItem[]` JSON 数组（id / name / url / iconSrc / emoji）
- `site_settings` key `about_content` → `AboutConfig` JSON 对象（name / title / location / avatarSrc / bgImageSrc / bgOpacity / markdownContent）

### 完成标志验证

**Phase 5.1 Portfolio**
- [x] `portfolio.list` 接口返回 200（空数组）
- [x] `portfolio_items` 表在 Turso 已创建（drizzle-kit push 成功）
- [x] TS 类型检查：新建文件无任何类型错误
- [ ] 后台添加一个 Portfolio 项目，前台 My Portfolio 出现新卡片（需运行服务器手动验证）
- [ ] 后台外观页修改背景 URL，前台窗口重新打开后自动应用

**Phase 5.2 Media**
- [x] `media_tracks` 表在 Turso 已创建（drizzle-kit push 成功）
- [x] `media.list` 接口返回 200（空数组）
- [x] TS 类型检查：新建/修改文件无类型错误
- [ ] 后台添加一首 MP3 曲目，Winamp 播放列表出现新歌（需运行服务器手动验证）
- [ ] 后台外观页修改 Winamp 背景 URL，重新打开窗口后生效

**Phase 5.3 Contact / About**
- [ ] 修改 Contact 联系方式中的邮箱地址，前台 Contact Me 窗口点击链接指向新地址（需运行服务器手动验证）
- [ ] 修改 About Markdown 内容，前台 About Me 窗口显示新内容（需运行服务器手动验证）

### 问题记录

<!-- -->

---

## Phase 6：通用文档窗口管理系统

> ⚠️ **2026-04-29 方案已重新定义**，见架构变更日志。原 Resume 结构化分区方案已废弃。

**目标**：建立通用文档窗口管理系统，Resume 作为第一个迁入实例

### 步骤检查

**6.1 数据层（2026-04-30 完成）**
- [x] `schema.ts` 添加 `documents` 表（id / title / iconSrc / content / bgUrl / bgOpacity / order / visible），执行 `drizzle-kit push`
- [x] 创建 `src/server/trpc/routes/documents.ts`（管理 `list` / `create` / `update` / `delete`）
- [x] `routes/site.ts` 追加 `getDocuments` 公开接口（visible=true 过滤）
- [x] 注册 `documents: documentsRouter` 到 `router.ts`

**6.2 前台改造（2026-04-30 完成）**
- [x] `src/client/apps/resume/index.tsx`：移除静态 `DOC_CONFIG` 和 `OpacityControl`，接收 `documentId` prop，从 `trpc.site.getDocuments` 按 id 取数据
- [x] `readmeContent` 保留为静态 Fallback（数据库中无对应文档时自动降级）
- [x] 工具栏文件名动态显示 `doc.title`；背景由 `doc.bgUrl` / `doc.bgOpacity` 驱动
- [x] `registry.ts` 修改 resume 条目：`AppComponent` 改为闭包 `() => createElement(ResumeApp, { documentId: 'resume' })`

**6.3 管理后台（2026-04-30 完成）**
- [x] 创建 `/admin/documents`（左侧文档列表 + 右侧两栏编辑面板）
- [x] 编辑面板：文档信息区（标题、图标 URL、排序、可见性）+ Markdown 内容区（MDEditor）+ 外观设置区（背景图 URL + 透明度预览缩略图）
- [x] 三区各自独立保存按钮，保存后同时 invalidate `documents.list` 和 `site.getDocuments`
- [x] 新建文档按钮（自动取最大 order+1）+ 删除确认对话框
- [x] 侧边栏 `NAV_ITEMS` 追加「📄 文档管理」入口
- [x] `routeTree.gen.ts` 注册 `/admin/_layout/documents` 路由

**6.4 桌面动态图标（2026-05-01 完成，2026-05-03 Bug 修复）**
- [x] `home.tsx` 新增 `trpc.site.getDocuments` 查询，过滤掉已在 APP_REGISTRY 的文档，合并进 `useDesktopIcons` 渲染
- [x] `documentsRef` + 空依赖 `openWindow` 双路径：APP_REGISTRY 优先，fallback 到 documents 查动态文档元数据
- [x] `WindowContent` 增加路径 2：`documents.some(d => d.id === id)` 时渲染 `<ResumeApp documentId={id} />`
- [x] 不修改 APP_REGISTRY 写入逻辑，不修改 registry.ts
- [x] **[BugFix]** `resume/index.tsx`：`||` 运算符误将空字符串 content 判为 Fallback → 改用 `doc !== undefined` 显式检查
- [x] **[BugFix]** `home.tsx`：`useDesktopIcons` 传入每帧新数组引用，触发无限重渲染导致图标堆叠 → 用 `useMemo` 稳定 `dynamicDocuments` 与 `allIconDefs`

### 完成标志验证

- [x] 在后台新建一个文档，桌面出现新图标，双击打开显示编辑内容
- [x] 修改 Resume 文档的 Markdown 内容，前台窗口重新打开后显示新内容
- [x] 在后台设置文档背景图 URL，前台窗口背景生效（无窗口内透明度滑块）
- [x] 将某文档 `visible` 设为 false，桌面对应图标消失

### 问题记录

- **[BugFix 1 / 2026-05-03]** 新建文档打开始终显示 README.md 内容：`resume/index.tsx` 中 `doc?.content || FALLBACK.content` 使用 `||`，将空字符串 content（新文档默认值）视为 falsy 触发 Fallback。修复：改用 `doc !== undefined` 显式判断，四个派生值（content / bgUrl / bgOpacity / title）统一走三元表达式。
- **[BugFix 2 / 2026-05-03]** 桌面图标堆叠、单次双击开多窗口：`home.tsx` 每次渲染都对 `documents.filter()` 和展开 `[...iconDefs, ...docIconDefs]` 生成新数组引用，`useDesktopIcons` 内部 `useEffect([defs])` 检测到引用变化→ `setIcons()` → 重渲染→ 再次生成新数组，形成无限循环。修复：用 `useMemo` 包裹 `dynamicDocuments`（依赖 `[documents]`）和 `allIconDefs`（依赖 `[iconDefs, dynamicDocuments]`），稳定引用后循环消除。

---

## 部署验证（最终）

> 部署方案：Ubuntu 云服务器 + PM2 Node.js + Nginx 反代 + Cloudflare CDN（见 2026-04-22 架构变更日志）

- [ ] 服务器填入 4 个必要环境变量（`TURSO_URL` / `TURSO_AUTH_TOKEN` / `JWT_SECRET` / `NODE_ENV=production`），`pm2 start ecosystem.config.cjs` 启动成功
- [ ] 首次访问 `/admin`，自动跳转登录页
- [ ] 使用正确密码登录，写入 httpOnly Cookie，跳转后台首页
- [ ] 登录后完成基础配置（壁纸、图标、文档），前台桌面正确显示
- [ ] 删除 Turso DB 连接（或断网），页面 fallback 不崩溃（静态配置兜底）
- [ ] Cloudflare SSL 模式确认为 Full (Strict)，Cookie 在生产环境正常写入

---

## 已知风险与决策记录

| 日期 | 问题/决策 | 结论 |
|---|---|---|
| — | 图片资源托管（壁纸上传） | Phase 3 先支持填写外链 URL，Phase 3+ 视需要加 Cloudflare R2 上传 |
| — | admin JWT Phase 1 临时方案 | Phase 1 用明文密码对比，Phase 3 完成后替换为完整 JWT |
| — | 评论系统 | 做成插件化配置，内置 Giscus + Waline 选项，不自研 |
