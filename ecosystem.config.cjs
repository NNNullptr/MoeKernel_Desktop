/**
 * PM2 进程管理配置文件
 *
 * 使用方式：
 *   首次启动：pm2 start ecosystem.config.cjs
 *   热重载：  pm2 reload moekernel          ← 只改了代码
 *   改了.env：pm2 restart moekernel         ← 无需 --update-env，Node 自动读取
 *   改了本文件：pm2 delete moekernel && pm2 start ecosystem.config.cjs
 *   查看日志：pm2 logs moekernel
 *   开机自启：pm2 startup && pm2 save
 *
 * 部署前提：
 *   1. 项目根目录存在 .env 文件，包含所有必需环境变量
 *   2. 已执行 pnpm build，.output/server/index.mjs 存在
 *   3. 已执行 pnpm db:migrate，Turso 云端表结构已就绪
 *
 * ⚠️  不要使用 pm2 restart --update-env：该 flag 会用当前 shell 的空环境
 *     覆盖 PM2 内部存储的变量，导致 .env 中的 secrets 全部丢失。
 *     本配置通过 node_args --env-file 由 Node.js 直接加载 .env，
 *     与 PM2 内部 env 存储完全解耦，重启方式无论如何都能正确加载变量。
 */

module.exports = {
  apps: [
    {
      name: 'moekernel',

      // Nitro node-server preset 的固定产物路径
      script: './.output/server/index.mjs',

      // 明确工作目录，保证 script 和 --env-file 的相对路径正确解析
      cwd: '/www/wwwroot/moekernel',

      // ── 环境变量加载 ──────────────────────────────────────────────────────
      // 通过 Node.js 原生 --env-file 在进程启动时加载 .env（项目需 ^20.19.0 || >=22.12.0）。
      // 好处：与 PM2 内部 env 存储解耦，pm2 restart / reload / delete+start
      // 任何方式重启都能正确加载最新的 .env，无需 --update-env。
      node_args: '--env-file=/www/wwwroot/moekernel/.env',

      // ── 集群配置 ──────────────────────────────────────────────────────────
      // instances: 1 — 单进程模式，内存状态（如登录限流器）全局唯一。
      // 若未来引入 Redis 共享状态，可改回 'max' + exec_mode: 'cluster'。
      instances: 1,
      exec_mode: 'fork',

      // ── 非敏感固定变量 ────────────────────────────────────────────────────
      // 敏感变量（TURSO_AUTH_TOKEN、JWT_SECRET、ADMIN_PASSWORD_HASH 等）
      // 由上方 node_args 的 --env-file 加载，不写在这里。
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // ── 日志配置 ──────────────────────────────────────────────────────────
      out_file:   './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,

      // ── 崩溃自动重启 ──────────────────────────────────────────────────────
      autorestart: true,
      max_restarts: 10,
      min_uptime: '5s',

      // ── 内存泄漏保护 ──────────────────────────────────────────────────────
      // 超过 512MB 时自动重启单个实例（Cluster 模式下不影响其他实例）
      max_memory_restart: '512M',
    },
  ],
};
