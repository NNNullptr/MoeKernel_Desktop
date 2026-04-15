/**
 * @file blog.config.ts
 * @description 博客文章配置文件 — 博客系统的数据源。
 *
 * ════════════════════════════════════════════════════════════════
 *  💡 使用步骤：如何新增一篇博客文章
 * ════════════════════════════════════════════════════════════════
 *
 * 第一步：创建 Markdown 文件
 *   在 `src/client/apps/blog/posts/` 目录下新建 .md 文件，例如：
 *   `src/client/apps/blog/posts/my-new-post.md`
 *
 * 第二步：在本文件顶部导入该 Markdown 文件
 *   import myNewPostContent from '../apps/blog/posts/my-new-post.md?raw';
 *
 * 第三步：在 BLOG_POSTS 数组中添加一条配置项
 *   {
 *     id: 'blog-my-new-post',       // 唯一 ID，必须以 'blog-' 开头（避免与其他应用 ID 冲突）
 *     title: '我的新文章',            // 显示在文件夹图标和窗口标题栏上的标题
 *     icon: '/assets/icons/document.png', // 文件夹内图标路径（可使用默认图标）
 *     backgroundImage: '',          // 阅读器背景图路径（留空则使用纯色背景）
 *     bgOpacity: 0.12,              // 背景图初始透明度，范围 0.0 ~ 1.0
 *     content: myNewPostContent,    // 引入的 Markdown 内容
 *     category: '技术',              // ← 文章分类（自由填写，自动出现在分类栏中）
 *   }
 *
 * 第四步：无需其他操作！
 *   registry.ts 会自动读取 BLOG_POSTS 数组并动态注册每篇文章为独立窗口。
 *   icons.config.ts 中的 'blog' 桌面图标会打开博客文件夹，
 *   点击文件夹内的文章图标即可在新窗口中打开对应文章。
 *
 * ────────────────────────────────────────────────────────────────
 *  📂 分类系统说明
 * ────────────────────────────────────────────────────────────────
 *  - category 字段可以自由填写，例如：'技术'、'生活'、'随笔'、'Tech'、'Life' 等。
 *  - 系统会自动从 BLOG_POSTS 中提取所有不重复的分类值，生成分类 Tab 栏。
 *  - 无需手动维护分类列表，添加新文章并填写 category 后自动生效。
 * ════════════════════════════════════════════════════════════════
 */

// ── 使用 Vite ?raw 导入 Markdown 文件（构建时内联，无网络请求） ──────────
import post1Content from '../apps/blog/posts/hello-world.md?raw';
import post2Content from '../apps/blog/posts/windows-xp-memories.md?raw';

/** 博客文章配置项的类型定义 */
export interface BlogPost {
  /** 唯一标识符，建议以 'blog-' 开头 */
  id: string;
  /** 文章标题，显示在图标下方和窗口标题栏 */
  title: string;
  /** 文件夹内图标图片路径 */
  icon: string;
  /** 阅读器窗口背景图路径（留空则纯色背景） */
  backgroundImage: string;
  /** 背景图初始透明度 0.0 ~ 1.0 */
  bgOpacity: number;
  /** Markdown 原始内容（通过 ?raw 导入） */
  content: string;
  /**
   * 文章分类标签（自由填写）。
   * 系统会自动提取所有文章的分类并生成分类 Tab 栏。
   * 例如：'技术'、'生活'、'随笔'、'Tech'、'Design' 等。
   */
  category: string;
}

/**
 * 博客文章列表 — 所有博客文章的配置数据。
 * registry.ts 会遍历此数组，为每篇文章动态创建独立的 OsApp 注册项。
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-hello-world',
    title: 'Hello World',
    icon: 'https://static.step1.dev/g9nbov/assets/bb426464f8be.ico',
    backgroundImage: '',
    bgOpacity: 0.12,
    content: post1Content,
    category: '技术',
  },
  {
    id: 'blog-xp-memories',
    title: 'Windows XP 的回忆',
    icon: 'https://static.step1.dev/g9nbov/assets/bb426464f8be.ico',
    backgroundImage: '',
    bgOpacity: 0.12,
    content: post2Content,
    category: '生活',
  },
];
