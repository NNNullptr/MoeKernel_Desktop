import { createTRPCRouter } from './procedure';
import { exampleRouter } from './routes/example';
import { authRouter } from './routes/auth';
import { blogRouter } from './routes/blog';
import { chatboxRouter } from './routes/chatbox';
import { settingsRouter } from './routes/settings';
import { siteRouter } from './routes/site';

export const appRouter = createTRPCRouter({
  example:  exampleRouter,   // 保持不动
  site:     siteRouter,      // 公开读取：settings / blogPosts / desktopIcons / mascots
  blog:     blogRouter,      // 管理：博客 CRUD（需鉴权）
  settings: settingsRouter,  // 管理：站点设置 + 图标 + 吉祥物 CRUD（需鉴权）
  auth:     authRouter,      // 认证：login / logout / verify
  chatbox:  chatboxRouter,   // Phase 4：留言板（公开读写 + 管理删除/置顶）
});

export type AppRouter = typeof appRouter;
