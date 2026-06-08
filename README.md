# 🖥️ MoeKernel_Desktop — Windows XP 风格个人桌面系统

> 一个以 Windows XP / Y2K 梦幻核美学为主题的交互式个人桌面系统。  
> 访客将像操作一台复古 PC 一样浏览你的作品、文章与个人信息。  
> 所有内容均可通过 **管理后台** 在线编辑，无需触碰代码。

---

## 📸 项目简介

**MoeKernel_Desktop** 是一个运行在浏览器里的 Windows XP 风格个人主页系统，模拟了一套完整的 XP 桌面操作体验：

- 🖱️ 可拖拽的桌面图标（多列自动排布 + 自由拖拽 + 边界钳制）
- 🪟 多窗口管理（可拖拽、8 方向缩放、最小化/关闭/任务栏）
- 🟢 Luna 风格开始菜单（程序 + 地点两列布局）
- 🕐 系统托盘实时时钟
- 🐾 可拖拽桌宠，浮于所有窗口之上（右侧边栏一键召唤）
- ✨ Boot → Login 两阶段欢迎动画（每个会话仅播放一次）
- 🔧 **全栈 CMS 后台**：`/admin` 可视化管理所有内容，DB 驱动，静态配置兜底

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19、TanStack Start（SSR）、TanStack Router |
| 样式 | Tailwind CSS v4、CSS Variables（OKLCH）、Inline CSS（XP 主题） |
| 组件库 | shadcn/ui（Radix UI 底层） |
| Markdown | react-markdown + remark-gfm |
| 客户端数据 | TanStack React Query v5、tRPC v11 Options Proxy |
| 服务端 API | tRPC on H3（Nitro）、Node.js 20 |
| 数据库 | Turso（libSQL / SQLite 云端）、Drizzle ORM |
| 鉴权 | JWT（jose HS256）、httpOnly Cookie |
| 构建 | Vite 7、Nitro（node-server preset）、TypeScript 5.9 |
| 表单验证 | React Hook Form + Zod v4 |
| 进程管理 | PM2（Cluster 模式） |
| 部署 | Ubuntu 云服务器 + Nginx 反代 + Cloudflare CDN |

---

## 🪟 内置应用一览

| 应用 | 说明 |
|------|------|
| 📁 博客系统 | XP 资源管理器风格，支持分类过滤 Tab + Markdown 阅读器 |
| 🗂️ 作品集 | 卡片网格 + 动态分类 Tab + 灯箱图片预览 + 技术栈标签 |
| 🎵 Winamp | 复古 Winamp 2.x UI + HTML5 Audio 真实播放引擎 |
| 🎬 视频播放器 | B站 iframe 嵌入 + 本地/直链 mp4 双引擎 |
| 💬 ChatBox 留言板 | 访客公开留言 + 置顶 + IP 限流（60s/次）|
| 📄 文档窗口 | 通用 Markdown 查看器（Resume 是第一个实例），支持自定义背景图 |
| 👤 关于我 | 头像 + 个人介绍 + Markdown 正文，后台可配置 |
| 📬 联系方式 | XP 资源管理器风格，社交链接列表，后台可配置 |
| 🖥️ 我的电脑 | 静态文件树映射 `public/assets/`，支持图片/视频/音频预览 |
| 🎮 游戏文件夹 | iframe 沙盒游戏启动器，支持本地 H5 游戏 |
| 💅 MSN Messenger | Bot 自动回复 + 表情包 |
| 🎨 MS Paint | 铅笔/橡皮/填充 + 调色板画板 |

---

## ⚙️ 管理后台功能

访问 `/admin` 登录后，可通过可视化界面管理所有内容：

| 后台页面 | 可管理内容 |
|---------|-----------|
| 🎨 主题设置 | 壁纸 URL、顶栏 Logo、系统托盘图标列表 |
| 📝 博客管理 | 文章增删改、Markdown 编辑器（MDEditor）、背景图 |
| 🖼️ 图标管理 | 桌面图标显示/隐藏、名称/路径/排序内联编辑 |
| 🐾 桌宠管理 | 桌宠增删改、精灵图/图标预览、尺寸调节 |
| 💬 留言板 | 删除留言、置顶/取消置顶、背景外观设置 |
| 🗂️ 作品集 | 条目增删改（卡片弹窗）、背景外观设置 |
| 🎵 媒体库 | 音频/视频/Bilibili 曲目增删改排序 |
| 📬 联系设置 | 社交链接列表增删改（图标/名称/URL） |
| 👤 关于设置 | 基本信息 + Markdown 正文编辑 |
| 📄 文档管理 | 文档窗口增删改（标题/内容/背景图/排序/可见性） |

---

## 📁 项目目录结构

```
MoeKernel/
├── public/                         # 静态资源（直接替换你的素材）
│   └── assets/
│       ├── wallpapers/             # 桌面壁纸 (.webp / .jpg)
│       ├── icons/                  # 应用图标 (.png / .ico)
│       │   └── tray/               # 系统托盘小图标 (16–20px)
│       └── pets/
│           ├── avatars/            # 桌宠侧栏按钮图标 (推荐 22px)
│           └── sprites/            # 桌宠本体图像 (推荐 .gif 动图)
│
├── src/
│   ├── client/                     # 前端代码
│   │   ├── apps/                   # 各桌面应用（每个应用独立文件夹）
│   │   │   ├── registry.ts         # 应用注册中心（APP_REGISTRY）
│   │   │   ├── blog/               # 博客系统（文件夹视图 + Markdown 阅读器）
│   │   │   ├── resume/             # 通用 Markdown 文档查看器
│   │   │   ├── portfolio/          # 作品集（卡片 + 灯箱）
│   │   │   ├── winamp/             # Winamp 音乐播放器
│   │   │   ├── video-player/       # 视频播放器（B站/mp4 双引擎）
│   │   │   ├── chatbox/            # ChatBox 留言板
│   │   │   ├── about-me/           # 关于我
│   │   │   ├── contact/            # 联系方式
│   │   │   ├── my-computer/        # 我的电脑（文件树导航）
│   │   │   ├── games-folder/       # 游戏文件夹
│   │   │   ├── msn/                # MSN Messenger
│   │   │   └── paint/              # MS Paint 画板
│   │   │
│   │   ├── config/                 # 静态兜底配置（DB 无数据时使用）
│   │   │   ├── theme.config.ts     # 壁纸、Logo、托盘图标
│   │   │   ├── icons.config.ts     # 桌面图标列表
│   │   │   ├── pets.config.ts      # 桌宠列表
│   │   │   └── blog.config.ts      # 博客文章列表（含 .md 静态导入）
│   │   │
│   │   ├── hooks/                  # 自定义 React Hooks
│   │   │   ├── use-desktop-icons.ts  # 图标拖拽、选中、自动排布
│   │   │   ├── use-site-config.ts    # DB 设置读取（含静态 Fallback）
│   │   │   └── use-window-drag.ts    # 窗口拖拽
│   │   │
│   │   └── views/                  # 页面级视图组件
│   │       ├── home.tsx            # 🖥️ XP 桌面主组件（内核）
│   │       ├── xp-window.tsx       # 可拖拽/可缩放 XP 窗口
│   │       ├── start-menu.tsx      # 开始菜单（Luna 风格）
│   │       ├── welcome-guard.tsx   # Boot → Login 欢迎动画
│   │       ├── right-sidebar.tsx   # 右侧桌宠启动栏
│   │       └── desktop-pet.tsx     # 可拖拽桌宠
│   │
│   ├── routes/                     # 文件路由（路径即 URL）
│   │   ├── __root.tsx              # 根布局（HTML Shell）
│   │   ├── index.tsx               # / → XP 桌面主页
│   │   ├── api/trpc.$.ts           # tRPC HTTP 端点（catch-all）
│   │   └── admin/                  # 管理后台路由
│   │       ├── login.tsx           # /admin/login 登录页
│   │       ├── _layout.tsx         # 后台布局（JWT 鉴权守卫）
│   │       └── _layout/            # 后台各功能页
│   │           ├── index.tsx       # /admin 仪表盘
│   │           ├── theme.tsx       # /admin/theme
│   │           ├── blog/           # /admin/blog（列表 + 新建 + 编辑）
│   │           ├── icons.tsx       # /admin/icons
│   │           ├── mascots.tsx     # /admin/mascots
│   │           ├── chatbox.tsx     # /admin/chatbox
│   │           ├── portfolio.tsx   # /admin/portfolio
│   │           ├── media.tsx       # /admin/media
│   │           ├── contact.tsx     # /admin/contact
│   │           ├── about.tsx       # /admin/about
│   │           └── documents.tsx   # /admin/documents
│   │
│   └── server/                     # 服务端代码
│       ├── env.ts                  # 环境变量校验（启动时 fail-fast）
│       ├── db/
│       │   ├── client.ts           # Drizzle + Turso HTTP 连接
│       │   ├── schema.ts           # 7 张数据表定义
│       │   └── seed.ts             # 初始数据填充脚本
│       └── trpc/
│           ├── router.ts           # 主路由（注册所有子路由）
│           ├── procedure.ts        # publicProcedure / adminProcedure
│           └── routes/             # 各功能路由
│               ├── site.ts         # 公开读取接口
│               ├── auth.ts         # 登录 / 登出 / 验证
│               ├── settings.ts     # 站点设置 CRUD
│               ├── blog.ts         # 博客文章 CRUD
│               ├── documents.ts    # 文档窗口 CRUD
│               ├── chatbox.ts      # 留言板 CRUD
│               ├── portfolio.ts    # 作品集 CRUD
│               └── media.ts        # 媒体库 CRUD
│
├── ecosystem.config.cjs            # PM2 进程管理配置
├── drizzle.config.ts               # Drizzle Kit 配置
└── package.json
```

---

## 🏗️ 核心架构

### 微内核 + 插件层 + CMS 三层架构

```
┌─────────────────────────────────────────────────────────┐
│              Turso 云端数据库（7 张表）                    │
│  site_settings / blog_posts / desktop_icons / mascots   │
│  chat_messages / portfolio_items / media_tracks         │
│  documents                                              │
└───────────────────────────┬─────────────────────────────┘
                            │ tRPC + Drizzle ORM
┌───────────────────────────▼─────────────────────────────┐
│                  tRPC 服务端路由层                        │
│  site（公开读）/ auth / settings / blog / documents      │
│  chatbox / portfolio / media                            │
└────────────────┬────────────────────────────────────────┘
                 │ TanStack Query + tRPC Client
     ┌───────────┴───────────┐
     │                       │
┌────▼────────────┐   ┌──────▼────────────────────────────┐
│  /admin 后台    │   │    / 前台（XP 桌面）               │
│  10 个管理页面  │   │  内核层 home.tsx                   │
│  可视化 CRUD    │   │  窗口管理·图标拖拽·任务栏·桌宠系统 │
└─────────────────┘   └──────────────┬─────────────────────┘
                                     │ APP_REGISTRY 查找
                          ┌──────────▼──────────────────────┐
                          │    注册中心 registry.ts          │
                          │  静态 App + 动态文档窗口          │
                          └──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┘
                            博客 简历 作品 音乐 视频 留言 ...
```

### 数据库表结构

| 表名 | 用途 |
|------|------|
| `site_settings` | 壁纸/Logo/托盘/About/Contact 等所有 key-value 配置 |
| `blog_posts` | 博客文章（含 Markdown 正文） |
| `desktop_icons` | 桌面图标列表（可隐藏/排序） |
| `mascots` | 桌宠列表（图标/精灵图/尺寸） |
| `chat_messages` | ChatBox 留言（含 IP 哈希限流） |
| `portfolio_items` | 作品集条目 |
| `media_tracks` | 音频/视频/Bilibili 媒体库 |
| `documents` | 通用文档窗口（Markdown + 背景图） |

---

## 🚀 部署教程（新手向）

### 前置条件

在开始之前，确保你的机器上已安装：

- **Node.js 20+**：[https://nodejs.org](https://nodejs.org)（选 LTS 版本）
- **pnpm**：安装好 Node.js 后执行 `npm install -g pnpm`
- **Git**：[https://git-scm.com](https://git-scm.com)

> 本项目统一使用 pnpm 进行依赖安装和脚本执行。

验证安装：

```bash
node -v    # 应输出 v20.x.x 或更高
pnpm -v    # 应输出 v10.x.x 或更高
git --version
```

---

### 第一步：获取代码

```bash
git clone https://github.com/你的用户名/MoeKernel_Desktop.git
cd MoeKernel_Desktop
pnpm install
```

---

### 第二步：创建 Turso 数据库

Turso 是本项目使用的云端 SQLite 数据库，有免费套餐，无需信用卡。

**1. 注册账号**

前往 [https://turso.tech](https://turso.tech) 注册（支持 GitHub 一键登录）。

**2. 安装 Turso CLI**

```bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows（PowerShell）
irm https://get.tur.so/install.ps1 | iex
```

**3. 登录并创建数据库**

```bash
turso auth login          # 打开浏览器完成授权

turso db create moekernel # 创建数据库（名字可以自定义）
```

**4. 获取数据库地址和 Token**

```bash
turso db show moekernel   # 复制 URL 字段（格式：libsql://...turso.io）
turso db tokens create moekernel   # 复制输出的 Token 字符串
```

> 💡 这两个值分别对应环境变量 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN`，妥善保存。

---

### 第三步：配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# macOS / Linux
cp .env.example .env   # 如果有示例文件

# 或直接新建
touch .env
```

用文本编辑器打开 `.env`，填入以下内容：

```env
# ── 数据库（必填）──────────────────────────────
TURSO_DATABASE_URL=libsql://你的数据库名.turso.io
TURSO_AUTH_TOKEN=你从上一步复制的Token

# ── 后台管理密码（必填）───────────────────────
# 这是登录 /admin 时使用的密码，自行设置一个强密码
ADMIN_PASSWORD=你的管理后台密码

# ── JWT 签名密钥（必填）───────────────────────
# 用于签发管理员登录 Cookie，必须 ≥ 32 个字符的随机字符串
# 生成示例（在终端运行）：node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=至少32位的随机字符串

# ── 可选配置 ──────────────────────────────────
# 生产环境设为 production（影响 Cookie Secure 属性）
NODE_ENV=development

# 跨子域名共享 Cookie 时填写，如 .yoursite.com；单域名留空
# COOKIE_DOMAIN=
```

> ⚠️ **`.env` 文件绝对不要提交到 Git！** 确认 `.gitignore` 里包含 `.env`。

---

### 第四步：初始化数据库表结构

```bash
pnpm exec drizzle-kit push
```

这条命令会把 `src/server/db/schema.ts` 中定义的 8 张表推送到 Turso 云端。  
成功后在终端看到各表名即完成。

**（可选）填充初始数据：**

```bash
pnpm db:seed
```

这会把 `src/client/config/` 里的静态配置数据（图标/桌宠/博客文章等）写入数据库作为初始内容。

---

### 第五步：本地开发验证

```bash
pnpm dev
```

打开浏览器访问：
- `http://localhost:3000` — XP 桌面前台
- `http://localhost:3000/admin` — 管理后台（用 `.env` 中的 `ADMIN_PASSWORD` 登录）

确认以下功能正常：
- [x] 桌面正常渲染，图标可双击打开窗口
- [x] `/admin/login` 输入密码后跳转后台
- [x] 后台保存内容后，前台刷新显示新内容

---

### 第六步：构建生产版本

```bash
pnpm build
```

构建产物在 `.output/` 目录下：
- `.output/server/index.mjs` — 服务端入口
- `.output/public/` — 静态资源文件

生产启动命令：

```bash
pnpm start
```

---

### 第七步：服务器部署（Ubuntu + PM2 + Nginx）

> 以下步骤需要一台运行 Ubuntu 20.04+ 的云服务器（阿里云/腾讯云/Vultr 等均可）。

#### 7.1 服务器安装 Node.js

```bash
# 使用 NodeSource 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm 和 PM2
npm install -g pnpm pm2
```

#### 7.2 上传代码到服务器

**方式 A：Git 拉取（推荐）**

```bash
# 在服务器上
git clone https://github.com/你的用户名/MoeKernel_Desktop.git /www/moekernel
cd /www/moekernel
pnpm install
```

**方式 B：通过宝塔面板上传**

在宝塔文件管理器上传项目压缩包，解压到 `/www/moekernel/`，然后在终端执行 `pnpm install`。

#### 7.3 在服务器上创建 .env 文件

```bash
cd /www/moekernel
nano .env   # 或 vim .env
```

填入与本地相同的环境变量，但修改以下值：

```env
NODE_ENV=production
TURSO_DATABASE_URL=libsql://你的数据库名.turso.io
TURSO_AUTH_TOKEN=你的Token
ADMIN_PASSWORD=你的管理密码
JWT_SECRET=至少32位随机字符串
```

#### 7.4 构建并启动服务

```bash
cd /www/moekernel
pnpm build              # 构建生产版本
mkdir -p logs           # PM2 日志目录
pm2 start ecosystem.config.cjs   # 启动服务（监听 3000 端口）
pm2 save                # 保存进程列表
pm2 startup             # 生成开机自启命令（按提示执行输出的命令）
```

如果不使用 PM2，也可以在构建后执行 `pnpm start` 直接启动生产服务。

验证是否启动成功：

```bash
pm2 status              # 应看到 moekernel 状态为 online
curl http://localhost:3000   # 应返回 HTML 页面
```

#### 7.5 配置 Nginx 反向代理

```bash
sudo nano /etc/nginx/sites-available/moekernel
```

粘贴以下配置（将 `your-domain.com` 替换为你的域名）：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/moekernel /etc/nginx/sites-enabled/
sudo nginx -t              # 检查配置语法
sudo systemctl reload nginx
```

> 🔔 **宝塔面板用户**：在「网站」→「添加站点」→「反向代理」中填入目标 URL `http://127.0.0.1:3000` 即可，无需手动编辑 nginx.conf。

---

### 第八步：配置 Cloudflare（可选但推荐）

使用 Cloudflare 可获得免费 CDN、DDoS 防护和自动 HTTPS。

#### 8.1 添加域名到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击「Add a Site」，输入你的域名
3. 按提示将域名的 NS 服务器改为 Cloudflare 提供的地址（在域名注册商处修改）

#### 8.2 关键设置（必须正确，否则登录 Cookie 会失效）

**SSL/TLS 加密模式：**  
进入「SSL/TLS」→「Overview」→ 选择 **Full (Strict)**  
⚠️ 不能选 Flexible，否则 HTTPS 请求到服务器时变成 HTTP，导致 `Secure Cookie` 无法写入，管理员无法登录。

**API 缓存绕过（必须设置）：**  
进入「Rules」→「Page Rules」→「Create Page Rule」：
- URL 匹配：`your-domain.com/api/trpc/*`
- 设置：Cache Level → **Bypass**

这样 tRPC API 请求不会被 Cloudflare 缓存，保证数据实时性。

#### 8.3 申请 SSL 证书（若不用 Cloudflare）

如果不使用 Cloudflare，可用 Certbot 申请免费 Let's Encrypt 证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
# 按提示操作，自动修改 Nginx 配置并续期
```

---

### 第九步：首次登录后台配置内容

1. 浏览器访问 `https://your-domain.com/admin`
2. 输入 `.env` 中设置的 `ADMIN_PASSWORD` 登录
3. 按需配置各项内容：
   - **主题设置**：替换壁纸 URL、Logo 图片、托盘图标
   - **文档管理**：创建 ID 为 `resume` 的文档，填入你的简历 Markdown 内容
   - **博客管理**：添加你的第一篇博客文章
   - **关于设置**：填写个人信息和 Markdown 简介
   - **联系设置**：配置你的社交媒体链接

---

### 更新部署

当代码有更新时，在服务器上执行：

```bash
cd /www/moekernel
git pull
pnpm install           # 如果依赖有变化
pnpm build             # 重新构建
pm2 reload moekernel   # 热重载（零停机）
```

如果不使用 PM2，也可以在构建后执行 `pnpm start` 直接启动生产服务。

如果数据库 schema 有变更（新增表/字段）：

```bash
pnpm exec drizzle-kit push  # 在重启前执行
```

---

## 🖥️ WelcomeGuard 欢迎动画

文件：`src/client/views/welcome-guard.tsx`

首次进入时自动播放 Boot → Login 两阶段动画，同一会话内刷新不重复播放。

| 需要修改的内容 | 搜索关键词 |
|--------------|-----------|
| Boot 用户名大字 | `MoeKernel`（BootStage 内） |
| Boot 副标题 | `>Welcome<` |
| Login 左侧用户名 | `MoeKernel`（LoginStage 左栏） |
| Login 右侧头像图片 | `src="/assets/avatarSrc.jpg"` |
| Login 右侧用户名 | `NNNullptr`（LoginStage 右栏） |

**调试命令（浏览器 Console）：**

```js
// 重新播放欢迎流程
sessionStorage.removeItem('xp:welcomed'); location.reload();

// 跳过欢迎流程
sessionStorage.setItem('xp:welcomed', '1'); location.reload();
```

---

## ✏️ 如何添加新桌面应用

只需 3 步，完全不触碰内核代码：

**第一步：** 创建应用组件

```tsx
// src/client/apps/your-app/index.tsx
export function YourApp() {
  return <div>你的应用内容</div>;
}
```

**第二步：** 注册到应用中心（`src/client/apps/registry.ts`）

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

**第三步：** 在管理后台「图标管理」添加桌面图标，或直接编辑 `src/client/config/icons.config.ts`：

```typescript
{ id: 'yourApp', label: '你的应用', src: '/assets/icons/your-icon.png' }
```

完成！应用自动出现在桌面，双击图标即可打开。

---

## 🗂️ 路由映射

| URL 路径 | 说明 |
|----------|------|
| `/` | XP 桌面主页面 |
| `/api/trpc/*` | tRPC API 端点 |
| `/admin/login` | 管理后台登录页 |
| `/admin` | 管理后台仪表盘 |
| `/admin/theme` | 主题设置 |
| `/admin/blog` | 博客管理 |
| `/admin/icons` | 图标管理 |
| `/admin/mascots` | 桌宠管理 |
| `/admin/chatbox` | 留言板管理 |
| `/admin/portfolio` | 作品集管理 |
| `/admin/media` | 媒体库管理 |
| `/admin/contact` | 联系设置 |
| `/admin/about` | 关于设置 |
| `/admin/documents` | 文档窗口管理 |

---

## 🔧 常用开发命令

```bash
pnpm dev          # 启动开发服务器（localhost:3000）
pnpm build        # 构建生产版本
pnpm start        # 启动 .output/server/index.mjs 生产服务
pnpm lint         # TypeScript 类型检查

pnpm exec drizzle-kit push  # 推送 schema 变更到 Turso（建表/加字段）
pnpm db:seed      # 填充初始数据到数据库
pnpm db:studio    # 打开 Drizzle Studio（本地 DB 可视化界面）
```

---

## 📂 静态资源目录

| 目录 | 用途 | 推荐格式 |
|------|------|---------|
| `public/assets/wallpapers/` | 桌面壁纸 | `.webp`、`.jpg` |
| `public/assets/icons/` | 应用 & 快捷方式图标 | `.png`、`.ico` |
| `public/assets/icons/tray/` | 系统托盘小图标 | `.png`（16–20px）|
| `public/assets/pets/avatars/` | 桌宠侧栏按钮图标 | `.png`（22px）|
| `public/assets/pets/sprites/` | 桌宠本体图像 | `.gif`（动图）|

---

## 📝 版本历史

| 版本 | 主要内容 |
|------|---------|
| V1–V5 | 开始菜单、多窗口管理、桌面图标拖拽、桌宠系统基础框架 |
| V6–V9 | 8 方向窗口缩放、10 个内置应用、配置文件架构规范化 |
| V10 | **微内核+插件层**架构重构，统一应用注册中心 |
| V11–V17 | 右侧边栏 XP Classic 风格重构、各应用配置驱动重构 |
| V18–V21 | 视频播放器双引擎、Games Folder 配置化、My Computer 文件预览 |
| V22–V23 | **博客系统**：XP 资源管理器文件夹 + Markdown 阅读器 + 分类 Tab |
| V24–V25 | 最大化窗口修复、**WelcomeGuard** Boot→Login 欢迎动画 |
| V26–V30 | My Computer 文件树导航、Start 菜单双侧联动、正式命名 MoeKernel_Desktop |
| **Full-Stack** | **全栈化改造**：Turso 数据库 + tRPC 服务端 + Drizzle ORM + JWT 鉴权 |
| Phase 0–1 | 基础设施搭建：8 张表建表、tRPC 数据层（site/auth/settings/blog 路由） |
| Phase 2 | 前端组件数据源切换至 DB，静态配置退为 Fallback |
| Phase 3 | 管理后台 UI：10 个后台页面，完整 CRUD |
| Phase 4 | **ChatBox 留言板**：独立数据表 + 皮肤系统 + IP 限流 |
| Phase 5 | **Portfolio / Media / Contact / About** 全栈化 |
| Phase 6 | **通用文档窗口管理系统**：documents 表 + 动态桌面图标 + 后台编辑器 |
