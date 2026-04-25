# 全栈化改造 · 执行进度与评估

> 对应规划文档：[fullstack-plan.md](./fullstack-plan.md)
> 每完成一个步骤后在此记录结果、遇到的问题和实际偏差。

---

## 架构变更日志

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
| Phase 3：管理后台 UI | 🔄 进行中 | — | — |
| Phase 4：评论系统 | 🔲 未开始 | — | — |

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

<!-- -->

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
- [ ] **3.6** `/admin/blog/$id` — 编辑文章
- [ ] **3.7** `/admin/icons` — 图标显示/隐藏、拖拽排序
- [ ] **3.8** `/admin/mascots` — 吉祥物管理
- [ ] **3.9** `/admin/comments` — 评论系统选择与参数填写

### 完成标志验证

- [ ] 未登录访问 `/admin/theme`，自动跳转到 `/admin/login`
- [ ] 登录后在主题页修改壁纸 URL，保存后刷新首页壁纸变化
- [ ] 在博客管理页新建一篇文章，前台博客列表中出现新文章
- [ ] 在图标页隐藏某图标，前台桌面对应图标消失

### 问题记录

<!-- -->

---

## Phase 4：评论系统（可选）

**目标**：支持多种评论方案，后台可配置切换

### 步骤检查

- [ ] **4.1** 在 `site_settings` 中约定评论相关 key 的命名规范
- [ ] **4.2** 创建 `GiscusWidget` 组件，从 settings 读取参数
- [ ] **4.3** 创建 `WalineWidget` 组件，从 settings 读取参数
- [ ] **4.4** 博客阅读器底部根据 `comment_provider` 动态渲染对应组件
- [ ] **4.5** `/admin/comments` 页面完善（选择方案 + 填写参数）

### 完成标志验证

- [ ] 在后台选择 Giscus，填入 repo 参数，博客底部出现评论区
- [ ] 在后台切换为 `disabled`，博客底部评论区消失

### 问题记录

<!-- -->

---

## 部署验证（最终）

- [ ] fork 仓库后，填入 4 个环境变量，Deno Deploy 部署成功
- [ ] 首次访问 `/admin`，跳转登录页
- [ ] 登录后完成基础配置，前台桌面正确显示
- [ ] 删除 Turso DB 连接，页面 fallback 不崩溃（静态配置兜底）

---

## 已知风险与决策记录

| 日期 | 问题/决策 | 结论 |
|---|---|---|
| — | 图片资源托管（壁纸上传） | Phase 3 先支持填写外链 URL，Phase 3+ 视需要加 Cloudflare R2 上传 |
| — | admin JWT Phase 1 临时方案 | Phase 1 用明文密码对比，Phase 3 完成后替换为完整 JWT |
| — | 评论系统 | 做成插件化配置，内置 Giscus + Waline 选项，不自研 |
