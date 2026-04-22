/**
 * PM2 进程管理配置文件
 *
 * 使用方式：
 *   首次启动：pm2 start ecosystem.config.cjs
 *   热重载：  pm2 reload moekernel
 *   停止：    pm2 stop moekernel
 *   查看日志：pm2 logs moekernel
 *   开机自启：pm2 startup && pm2 save
 *
 * 部署前提：
 *   1. 项目根目录存在 .env 文件，包含 6 个必需环境变量
 *   2. 已执行 pnpm build，.output/server/index.mjs 存在
 *   3. 已执行 npx drizzle-kit push，Turso 云端表结构已就绪
 */

module.exports = {
  apps: [
    {
      name: 'moekernel',

      // Nitro node-server preset 的固定产物路径
      script: './.output/server/index.mjs',

      // ── 集群配置 ──────────────────────────────────────────────────────────
      // instances: 所有 CPU 核心。单核 VPS 建议改为 1，避免切换开销。
      // exec_mode: 'cluster' 使用 Node.js 内置 Cluster，多进程共享同一端口。
      // 注意：所有状态必须在数据库中（本项目已满足），不可用内存共享状态。
      instances: 'max',
      exec_mode: 'cluster',

      // ── 环境变量 ──────────────────────────────────────────────────────────
      // 敏感变量（TURSO_AUTH_TOKEN、JWT_SECRET 等）从 .env 文件自动加载，
      // 此处只声明非敏感的固定变量，避免将 secret 提交到 git。
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
