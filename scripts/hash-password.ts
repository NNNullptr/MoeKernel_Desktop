/**
 * @file scripts/hash-password.ts
 * @description 将 .env 中的明文 ADMIN_PASSWORD 生成 bcrypt 哈希，输出替换指令。
 *
 * 使用方式：
 *   pnpm hash-password
 *
 * 执行后将输出新的哈希值，手动将 .env 中的 ADMIN_PASSWORD 替换为该值即可。
 *
 * ⚠️  替换后服务需要重启才能读取新的环境变量。
 * ⚠️  替换前请确保记住原始密码，哈希不可逆。
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // 2^12 次迭代，当前推荐的最低安全轮数（约 300ms/次）

const raw = process.env.ADMIN_PASSWORD;

if (!raw) {
  console.error('\n❌ 未找到 ADMIN_PASSWORD，请确认已通过 --env-file=.env 加载环境变量\n');
  process.exit(1);
}

// 检测是否已经是 bcrypt 哈希（$2a$ / $2b$ / $2y$ 开头）
if (/^\$2[aby]\$/.test(raw)) {
  console.warn('\n⚠️  ADMIN_PASSWORD 已经是 bcrypt 哈希格式，无需重新生成。');
  console.warn('   若需要修改密码，请先在 .env 中填入新的明文密码再运行此脚本。\n');
  process.exit(0);
}

console.log(`\n🔐 正在使用 bcrypt（saltRounds=${SALT_ROUNDS}）生成哈希，请稍候...\n`);

const hash = await bcrypt.hash(raw, SALT_ROUNDS);

console.log('✅ 生成成功！请将以下内容替换 .env 中的 ADMIN_PASSWORD 一行：\n');
console.log('─'.repeat(72));
console.log(`ADMIN_PASSWORD=${hash}`);
console.log('─'.repeat(72));
console.log('\n操作步骤：');
console.log('  1. 复制上方整行（含变量名）');
console.log('  2. 打开 .env，找到 ADMIN_PASSWORD=... 并整行替换');
console.log('  3. 保存文件后重启服务\n');
