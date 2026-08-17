# Issue #9：零配置本地开发设计

## 背景

当前项目在功能上可以运行，但本地开发和生产部署共用一套强制环境变量：即使只想在本机查看页面，也必须先创建 Turso 数据库、准备 Token、生成后台密码哈希并配置 JWT 密钥。`README.md` 主要按生产部署路径组织，`example.env` 又把 `ADMIN_PASSWORD` 写得像明文密码，导致新贡献者难以快速启动，也容易误解安全边界。此外，`pnpm lint` 当前存在 4 个 TypeScript 错误，无法作为后续改动的可靠基线。

## 目标

本次改动完成后，新贡献者只需执行：

```bash
pnpm install
pnpm dev
```

即可获得可持久化的本地 SQLite 数据库、初始化数据和可登录的管理后台。本地开发不要求 `.env` 或 Turso；生产环境继续使用 Turso，并保持严格的环境变量校验。

同时完成以下目标：

- 本地后台默认密码为 `admin`，终端明确标示仅限开发环境。
- 本地数据保存在 `.data/dev.db`，重启后继续存在且不会进入 Git。
- 提供安全、显式的 `pnpm dev:reset` 重置命令。
- 用 `ADMIN_PASSWORD_HASH` 明确表达生产配置必须是 bcrypt 哈希。
- 暂时兼容已经部署的 `ADMIN_PASSWORD`，并输出弃用提示。
- 修复现有 4 个 TypeScript 错误，使 `pnpm lint` 成为干净基线。
- 将 README 的本地开发和生产部署说明拆开。

## 非目标

- 不把 Turso 从生产架构中移除。
- 不为本地开发加入 Docker。
- 不自动把本地 SQLite 数据同步到 Turso。
- 不重构与 Issue #9 无关的前端组件或服务端路由。
- 不在这次改动中移除旧的 `ADMIN_PASSWORD` 兼容入口。

## 用户体验

### 首次本地启动

`pnpm dev` 在启动 Vite 前运行本地初始化：

1. 创建 `.data/`。
2. 创建 `.data/dev.db`。
3. 执行尚未应用的 Drizzle 迁移。
4. 为不存在的默认记录写入示例数据。
5. 启动开发服务器。

终端需要输出以下等价信息：

```text
Local development database: .data/dev.db
Admin URL: http://localhost:3000/admin
Development password: admin
Development mode only — do not use these defaults in production.
```

### 后续本地启动

再次运行 `pnpm dev` 时只应用新迁移，不删除数据库，也不覆盖用户在后台修改过的数据。初始化数据使用“缺失时插入”的策略，而不是当前 `onConflictDoUpdate` 的覆盖策略。

### 重置本地数据

`pnpm dev:reset` 只允许删除仓库根目录下固定的 `.data/dev.db`，以及同名 SQLite `-wal`、`-shm` 文件。脚本必须先将目标解析成绝对路径，并验证它等于预期路径；不得接受用户提供的路径、glob 或目录参数。删除完成后，脚本重新执行本地初始化。

## 环境与安全边界

### 模式判断

`NODE_ENV === "production"` 是生产模式的唯一判定条件；其他值按开发模式处理。

开发模式的配置解析规则：

- `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN` 均未设置时，使用 `file:.data/dev.db`。
- 两者只设置其中一个时直接报错，避免用户以为正在使用 Turso，实际却悄悄回退到本地数据库。
- 两者都设置时允许开发服务器连接远端 Turso，便于有需要的维护者调试。
- 未设置密码哈希时使用内置的开发专用 bcrypt 哈希，其对应明文为 `admin`。
- 未设置 JWT 密钥时使用长度足够、只用于本地开发的固定密钥。
- 使用任何开发默认值时都输出警告。

生产模式的配置解析规则：

- 必须设置 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN`。
- 拒绝以 `file:` 开头的数据库地址。
- 必须设置 `ADMIN_PASSWORD_HASH`，或暂时使用旧的 `ADMIN_PASSWORD` 回退值。
- 密码值必须匹配 bcrypt 哈希前缀 `$2a$`、`$2b$` 或 `$2y$`；明文直接导致启动失败。
- `JWT_SECRET` 必填且至少 32 个字符。
- 不提供任何生产默认值。

### 密码变量迁移

应用内部统一使用 `env.ADMIN_PASSWORD_HASH`。外部配置优先读取同名变量；如果只存在旧的 `ADMIN_PASSWORD`，继续使用它并输出弃用警告。`.env.example` 和 README 只展示新变量。

`pnpm hash-password` 不再要求先把明文写进 `.env`。脚本通过不回显输入内容的交互式提示读取密码，输出完整的：

```env
ADMIN_PASSWORD_HASH=$2b$...
```

### 示例环境文件

将 `example.env` 重命名为 `.env.example`。该文件明确标注为“生产部署示例”，包含 Turso、`ADMIN_PASSWORD_HASH`、`JWT_SECRET`、`NODE_ENV=production` 和可选的 `COOKIE_DOMAIN`，不作为本地开发的必需步骤。

## 数据库架构

### 连接边界

数据库创建逻辑接收已经解析好的配置，而不是直接在模块各处读取 `process.env`。`src/server/env.ts` 负责模式判断和配置校验，`src/server/db/client.ts` 只负责根据配置创建 libSQL/Drizzle 客户端。

数据库客户端从 `@libsql/client/http` 切换到支持 Node 本地文件和远端 Turso 的 `@libsql/client/node`，使相同的 Drizzle schema 可以服务两种环境。

### 迁移

`drizzle/` 中提交可重复执行的迁移文件，并以当前 8 张表的 schema 生成第一份基线迁移。`drizzle-orm/libsql/migrator` 负责记录已执行迁移；本地初始化和生产数据库初始化使用同一批迁移，避免维护两套建表逻辑。

提供独立的 `pnpm db:migrate` 命令用于生产或显式迁移。生产部署文档不再依赖不可追踪的临时 `drizzle-kit push` 作为主要流程。

### Seed

将默认数据与命令入口分离：可复用函数负责向给定数据库写入缺失记录，CLI 文件只负责加载配置、调用函数和报告结果。

Seed 的冲突策略改为 `onConflictDoNothing`：

- 新数据库得到完整示例数据。
- 已存在的用户记录不被启动流程覆盖。
- 部分缺失的默认记录可以补齐。

## 命令设计

`package.json` 最终提供以下边界清晰的命令：

```text
pnpm dev          初始化本地数据库后启动 Vite
pnpm dev:setup    只执行本地迁移和缺失数据填充
pnpm dev:reset    安全删除固定本地数据库并重新初始化
pnpm db:migrate   对当前显式配置的数据库执行迁移
pnpm db:seed      对当前显式配置的数据库填充缺失数据
pnpm hash-password  交互式生成 ADMIN_PASSWORD_HASH
pnpm lint         TypeScript 类型检查
pnpm test         环境解析和数据库初始化测试
pnpm build        生产构建
```

`.gitignore` 增加 `.data/`，保证本地数据库、WAL 和共享内存文件都不会被提交。

## Lint 修复

现有错误分为两组。

博客、桌面图标和桌宠的创建 mutation 通过数组解构读取 `.returning()`，在 `noUncheckedIndexedAccess` 下结果可能是 `undefined`。每个 handler 必须检查返回记录；缺失时抛出明确的 `INTERNAL_SERVER_ERROR`，成功分支返回非可选记录。不得用 `as any`、非空断言或降低 TypeScript 严格度绕过检查。

图标编辑行同时维护手写 `saving` 和 TanStack Mutation 的 `isPending` 状态。删除手写状态，统一使用 mutation 状态控制输入同步与保存中 UI，消除 `onMutate` 上下文的泛型冲突。

## README 结构

README 将开发和部署拆成两个顶级流程：

1. “本地开发（零配置）”放在部署说明之前，只包含安装、启动、访问地址、默认密码、数据位置和重置命令。
2. “生产部署”包含 Turso、`.env.example`、密码哈希、迁移、Seed、构建、PM2 和 Nginx。

环境变量表明确显示每个变量在本地和生产中的要求：

| 变量 | 本地开发 | 生产环境 |
|---|---|---|
| `TURSO_DATABASE_URL` | 不需要 | 必填 |
| `TURSO_AUTH_TOKEN` | 不需要 | 必填 |
| `ADMIN_PASSWORD_HASH` | 默认密码 `admin` | 必填，必须是 bcrypt 哈希 |
| `JWT_SECRET` | 使用开发专用值 | 必填，至少 32 字符 |
| `COOKIE_DOMAIN` | 不需要 | 可选 |

README 不再把 `.env`、Turso 注册或生产部署步骤放入本地快速启动路径。

## 测试与验收

测试使用 Node 内置测试运行器配合现有 `tsx`，避免为这次改动引入大型测试框架。数据库测试在操作系统临时目录创建独立 SQLite 文件，不触碰真实 `.data/dev.db`。

自动测试至少覆盖：

- 开发模式无环境变量时解析为本地 SQLite、默认管理员哈希和开发 JWT。
- 开发模式只提供一个 Turso 变量时失败。
- 生产模式缺少任意必填变量时失败。
- 生产模式拒绝 `file:` 数据库地址。
- 生产模式拒绝明文管理员密码和过短 JWT。
- 旧 `ADMIN_PASSWORD` 可用但产生弃用警告。
- 空数据库迁移后包含全部 8 张业务表。
- 首次 Seed 写入示例数据。
- 第二次 Seed 不覆盖已修改数据。
- 重置逻辑只接受固定的 `.data/dev.db` 目标。

最终验收命令：

```bash
pnpm test
pnpm lint
pnpm build
git status --short
```

验收结果必须为：测试全部通过、lint 为 0 错误、构建成功、构建后 Git 工作区没有生成文件变化。还需要在没有 `.env` 和 `.data/dev.db` 的干净临时检出中实际运行一次 `pnpm dev:setup`，再运行第二次确认数据不会被覆盖。

## 兼容性与发布顺序

这组改动作为 #8 之后的独立 PR 提交，不混入其他功能。PR 内建议按以下可审阅顺序组织提交：

1. 环境配置解析及安全测试。
2. 本地数据库迁移、Seed、初始化和重置流程。
3. 现有 lint 错误修复。
4. `.env.example`、命令和 README 更新。

旧生产部署继续使用 `ADMIN_PASSWORD` 时不会立即中断，但会收到迁移提示。README 只宣传 `ADMIN_PASSWORD_HASH`，使新部署从一开始使用清晰命名。
