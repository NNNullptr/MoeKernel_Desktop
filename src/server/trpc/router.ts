import { createTRPCRouter } from './procedure';
import { exampleRouter } from './routes/example';
import { authRouter } from './routes/auth';
import { blogRouter } from './routes/blog';
import { chatboxRouter } from './routes/chatbox';
import { documentsRouter } from './routes/documents';
import { mediaRouter } from './routes/media';
import { portfolioRouter } from './routes/portfolio';
import { settingsRouter } from './routes/settings';
import { siteRouter } from './routes/site';

export const appRouter = createTRPCRouter({
  example:   exampleRouter,   // 保持不动
  site:      siteRouter,      // 公开读取：settings / blogPosts / desktopIcons / mascots / portfolioItems / mediaTracks / documents
  blog:      blogRouter,      // 管理：博客 CRUD（需鉴权）
  settings:  settingsRouter,  // 管理：站点设置 + 图标 + 吉祥物 CRUD（需鉴权）
  auth:      authRouter,      // 认证：login / logout / verify
  chatbox:   chatboxRouter,   // Phase 4：留言板（公开读写 + 管理删除/置顶）
  portfolio: portfolioRouter, // Phase 5.1：作品集（公开读 + 管理 CRUD）
  media:     mediaRouter,     // Phase 5.2：多媒体曲目（公开读 + 管理 CRUD）
  documents: documentsRouter, // Phase 6：通用文档窗口 CRUD（公开读 + 管理 CRUD）
});

export type AppRouter = typeof appRouter;
