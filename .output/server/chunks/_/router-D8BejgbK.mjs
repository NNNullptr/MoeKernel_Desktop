import { createRouter, createRootRoute, Outlet, Scripts, createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createTRPCClient, loggerLink, splitLink, httpBatchLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { TRPCError, initTRPC } from "@trpc/server";
import { jwtVerify, SignJWT } from "jose";
import z from "zod";
import { eq, max, asc, desc, and, lt, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";
import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { createHash } from "node:crypto";
const globalCss = "/assets/global-Mjb7QcIy.css";
const queryClient = new QueryClient();
const lazyServerLink = (runtime) => (ctx) => observable((observer) => {
  let sub;
  import("./link-Mcb9SWbo.mjs").then(
    ({ serverLink }) => sub = serverLink(runtime)(ctx).subscribe(observer),
    (err) => observer.error(err)
  );
  return () => sub?.unsubscribe();
});
const trpcClient = createTRPCClient({
  links: [
    loggerLink({
      enabled: (op) => op.direction === "down" && op.result instanceof Error
    }),
    splitLink({
      condition: () => typeof window === "undefined",
      true: lazyServerLink,
      false: httpBatchLink({
        url: "/api/trpc",
        transformer: superjson
      })
    })
  ]
});
const trpc = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient
});
function TrpcProvider(props) {
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, "data-cid": "4LkTTN8G", children: props.children });
}
const Route$i = createRootRoute({
  component: RootDocument
});
function RootDocument() {
  return /* @__PURE__ */ jsxs("html", { "data-cid": "P7OMxmUA", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "article:author", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "/og-card.png" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_US" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "NNNullptr" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "/og-card.png" }),
      /* @__PURE__ */ jsx("meta", { name: "referrer", content: "no-referrer" }),
      /* @__PURE__ */ jsx("link", { rel: "icon", href: "https://static.step1.dev/g9nbov/assets/608befa6aa8f.ico", type: "image/x-icon" }),
      /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: "/home/styles/style_3b43319be51c.css" }),
      /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: "/home/styles/style_44662de83434.css" }),
      /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: "/home/styles/style_568d4a59d1ae.css" }),
      /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: "/home/styles/merged_styles.css" }),
      /* @__PURE__ */ jsx("title", { children: "NNNullptr" }),
      /* @__PURE__ */ jsx("link", { rel: "stylesheet", href: globalCss }),
      /* @__PURE__ */ jsx("link", { rel: "icon", href: "favicon.png" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(TrpcProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$g = () => import("./index-B6PCBeEC.mjs");
const Route$h = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./login-Cioy7hle.mjs");
const Route$g = createFileRoute("/admin/login")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./_layout-DhW5OKPI.mjs");
const Route$f = createFileRoute("/admin/_layout")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-CBkGdXBO.mjs");
const Route$e = createFileRoute("/admin/_layout/")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
function extractIp(headers) {
  return headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",").at(0)?.trim() ?? headers.get("x-real-ip") ?? "unknown";
}
const createTRPCContext = (input) => {
  const headers = input instanceof Request ? input.headers : input.headers;
  const ip = input instanceof Request ? extractIp(headers) : "unknown";
  return {
    headers,
    // 用于在 tRPC Procedure 内向响应追加 Set-Cookie 等响应头。
    // 仅在 HTTP 适配器路径（/api/trpc）下有效，SSR local link 路径不会转发此对象。
    resHeaders: new Headers(),
    ip
  };
};
const t = initTRPC.context().create({
  transformer: superjson
});
const createTRPCRouter = t.router;
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET$2 = process.env.JWT_SECRET;
const missing = [];
if (!TURSO_DATABASE_URL) missing.push("TURSO_DATABASE_URL");
if (!TURSO_AUTH_TOKEN) missing.push("TURSO_AUTH_TOKEN");
if (!ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
if (!JWT_SECRET$2) missing.push("JWT_SECRET");
if (missing.length > 0) {
  throw new Error(
    `[env] 缺少以下必需的环境变量，请在部署平台或 .env 文件中配置：
` + missing.map((k) => `  - ${k}`).join("\n")
  );
}
if (JWT_SECRET$2.length < 32) {
  throw new Error("[env] JWT_SECRET 长度必须 ≥ 32 个字符，请使用强随机字符串");
}
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? "";
const env = {
  TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN,
  ADMIN_PASSWORD,
  JWT_SECRET: JWT_SECRET$2,
  COOKIE_DOMAIN
};
const JWT_SECRET$1 = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME$1 = "admin_token";
function getCookie$1(cookieHeader, name) {
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return void 0;
}
const authMiddleware = t.middleware(({ ctx, next }) => {
  return next({ ctx: {} });
});
const adminMiddleware = t.middleware(async ({ ctx, next }) => {
  const cookieHeader = ctx.headers.get("cookie") ?? "";
  const token = getCookie$1(cookieHeader, COOKIE_NAME$1);
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "未登录" });
  }
  try {
    await jwtVerify(token, JWT_SECRET$1);
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "会话已过期，请重新登录" });
  }
  return next({ ctx });
});
const loggingMiddleware = t.middleware(
  async ({ path, type, next, input }) => {
    const start = Date.now();
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const typeAbbr = type === "query" ? "Q" : type === "mutation" ? "M" : "S";
    const fmt = (msg) => `[${timestamp}][${typeAbbr}] ${msg}`;
    console.log(fmt(`${path} - Started`));
    try {
      const result = await next();
      const duration = Date.now() - start;
      if (result.ok) {
        console.log(fmt(`${path} - OK - ${duration}ms`));
      } else {
        console.error(fmt(`${path} - FAILED - ${duration}ms`));
        const error = result.error;
        console.error(fmt(`[Trpc] ${error.code}: ${error.message}`));
      }
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(fmt(`${path} - FAILED - ${duration}ms`));
      if (error instanceof Error) {
        console.error(fmt(`Error: ${error.message}`));
        console.error(fmt(`Stack: ${error.stack}`));
      }
      throw error;
    }
  }
);
const publicProcedure = t.procedure.use(loggingMiddleware);
t.procedure.use(loggingMiddleware).use(authMiddleware);
const adminProcedure = publicProcedure.use(adminMiddleware);
const greetings = [];
const exampleRouter = {
  getServerTime: publicProcedure.query(() => {
    return (/* @__PURE__ */ new Date()).toLocaleString();
  }),
  greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }) => {
    return `Hello, ${input.name}!`;
  }),
  getGreetings: publicProcedure.query(() => {
    return greetings;
  }),
  addGreeting: publicProcedure.input(z.object({ message: z.string().min(1) })).mutation(({ input }) => {
    greetings.push(input.message);
    return { success: true, count: greetings.length };
  })
};
const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);
const COOKIE_NAME = "admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
function getCookie(cookieHeader, name) {
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return void 0;
}
function buildCookieString(value, maxAge) {
  const secure = "; Secure";
  const domain = env.COOKIE_DOMAIN ? `; Domain=${env.COOKIE_DOMAIN}` : "";
  return `${COOKIE_NAME}=${value}; HttpOnly${secure}; SameSite=Lax; Path=/${domain}; Max-Age=${maxAge}`;
}
const authRouter = {
  /**
   * 管理员登录。
   * 验证密码 → 签发 7 天有效期 JWT → 写入 httpOnly Cookie。
   * 安全原则：JWT 不返回给前端脚本，仅由浏览器在后续请求中自动携带。
   *
   * ⚠️ 必须通过浏览器侧调用（走 /api/trpc HTTP 端点），
   * SSR loader 中调用无法将 Set-Cookie 写回客户端响应。
   */
  login: publicProcedure.input(z.object({ password: z.string().min(1) })).mutation(async ({ input, ctx }) => {
    if (input.password !== env.ADMIN_PASSWORD) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "密码错误" });
    }
    const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);
    ctx.resHeaders.append("Set-Cookie", buildCookieString(token, COOKIE_MAX_AGE));
    return { success: true };
  }),
  /**
   * 退出登录。
   * 将 admin_token Cookie 的 Max-Age 设为 0，令浏览器立即删除该 Cookie。
   *
   * ⚠️ 同 login，需浏览器侧调用。
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.resHeaders.append("Set-Cookie", buildCookieString("", 0));
    return { success: true };
  }),
  /**
   * 验证当前会话是否有效（供前端路由守卫使用）。
   * 读取请求头中的 Cookie → 解析 JWT → 返回布尔值。
   * 可在 SSR loader 中安全调用（只读操作，不写 Cookie）。
   */
  verify: publicProcedure.query(async ({ ctx }) => {
    const cookieHeader = ctx.headers.get("cookie") ?? "";
    const token = getCookie(cookieHeader, COOKIE_NAME);
    if (!token) return { authenticated: false };
    try {
      await jwtVerify(token, JWT_SECRET);
      return { authenticated: true };
    } catch {
      return { authenticated: false };
    }
  })
};
const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull()
});
const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  backgroundImage: text("background_image").notNull().default(""),
  bgOpacity: real("bg_opacity").notNull().default(1),
  order: integer("order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date())
});
const desktopIcons = sqliteTable("desktop_icons", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  src: text("src").notNull(),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true)
});
const mascots = sqliteTable("mascots", {
  id: text("id").primaryKey(),
  label: text("label").notNull().default(""),
  iconSrc: text("icon_src").notNull(),
  petSrc: text("pet_src").notNull(),
  size: integer("size").notNull().default(80),
  order: integer("order").notNull().default(0)
});
const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  ipHash: text("ip_hash").notNull(),
  isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => /* @__PURE__ */ new Date())
});
const mediaTracks = sqliteTable("media_tracks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull().default(""),
  src: text("src").notNull().default(""),
  bvid: text("bvid"),
  cover: text("cover").notNull().default(""),
  type: text("type").notNull().default("audio"),
  // 'audio' | 'video' | 'bilibili'
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true)
});
const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  techStack: text("tech_stack").notNull().default(""),
  link: text("link"),
  imageUrl: text("image_url").notNull().default(""),
  category: text("category").notNull().default(""),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true)
});
const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  iconSrc: text("icon_src").notNull().default(""),
  content: text("content").notNull().default(""),
  bgUrl: text("bg_url").notNull().default(""),
  bgOpacity: real("bg_opacity").notNull().default(0.12),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true)
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  blogPosts,
  chatMessages,
  desktopIcons,
  documents,
  mascots,
  mediaTracks,
  portfolioItems,
  siteSettings
}, Symbol.toStringTag, { value: "Module" }));
const libsql = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN
});
const db = drizzle(libsql, { schema });
const blogPostInput = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  category: z.string().min(1, "分类不能为空"),
  icon: z.string().min(1, "图标路径不能为空"),
  backgroundImage: z.string().default(""),
  bgOpacity: z.number().min(0).max(1).default(1),
  order: z.number().int().nonnegative().default(0)
});
const blogRouter = {
  /**
   * 列出所有博客文章（含隐藏、草稿），供管理后台使用。
   * 返回按 order 升序排列的完整列表（不过滤任何字段）。
   * 公开读取接口见 site.ts → getBlogPosts。
   */
  list: adminProcedure.query(async () => {
    return db.select().from(blogPosts).orderBy(asc(blogPosts.order));
  }),
  /**
   * 创建新博客文章。
   * id 由服务端生成（nanoid），createdAt 由 $defaultFn 自动填充。
   * 返回新建记录的完整数据。
   */
  create: adminProcedure.input(blogPostInput).mutation(async ({ input }) => {
    const id = `blog-${nanoid()}`;
    const [created] = await db.insert(blogPosts).values({ id, ...input }).returning();
    return created;
  }),
  /**
   * 更新指定博客文章的字段（支持 partial，只更新传入的字段）。
   * 若 id 不存在，抛出 NOT_FOUND 错误。
   */
  update: adminProcedure.input(blogPostInput.partial().extend({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const { id, ...fields } = input;
    if (Object.keys(fields).length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "至少需要提供一个要更新的字段"
      });
    }
    const [updated] = await db.update(blogPosts).set(fields).where(eq(blogPosts.id, id)).returning();
    if (!updated) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${id}" 的博客文章`
      });
    }
    return updated;
  }),
  /**
   * 删除指定博客文章。
   * 若 id 不存在，抛出 NOT_FOUND 错误。
   */
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${input.id}" 的博客文章`
      });
    }
    return { success: true, id: deleted.id };
  })
};
const RATE_LIMIT_MS = 6e4;
function hashIp(ip) {
  return createHash("sha256").update(ip).digest("hex");
}
const createMessageInput = z.object({
  name: z.string().min(1, "昵称不能为空").max(20, "昵称最多 20 字"),
  content: z.string().min(1, "内容不能为空").max(500, "内容最多 500 字")
});
const chatboxRouter = {
  /**
   * 分页读取留言。
   * 返回结构：
   *   pinned  — 全部置顶消息（不分页，按创建时间降序）
   *   items   — 普通消息（按创建时间降序，游标分页）
   *   nextCursor — 下一页游标（null 表示没有更多）
   *
   * cursor 为上一页最后一条普通消息的 createdAt Unix 毫秒时间戳字符串。
   * SQLite timestamp 列精度为秒，游标比较使用 lt（严格小于），安全无重复。
   */
  listMessages: publicProcedure.input(
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().optional()
    })
  ).query(async ({ input }) => {
    const { limit, cursor } = input;
    const strip = ({ ipHash: _h, ...rest }) => rest;
    const rawPinned = await db.select().from(chatMessages).where(eq(chatMessages.isPinned, true)).orderBy(desc(chatMessages.createdAt));
    const pinned = rawPinned.map(strip);
    const cursorDate = cursor ? new Date(Number(cursor)) : void 0;
    const rawRows = await db.select().from(chatMessages).where(
      cursorDate ? and(eq(chatMessages.isPinned, false), lt(chatMessages.createdAt, cursorDate)) : eq(chatMessages.isPinned, false)
    ).orderBy(desc(chatMessages.createdAt)).limit(limit + 1);
    const hasMore = rawRows.length > limit;
    const items = (hasMore ? rawRows.slice(0, limit) : rawRows).map(strip);
    const lastItem = items.at(-1);
    const nextCursor = hasMore && lastItem ? String(lastItem.createdAt.getTime()) : null;
    return { pinned, items, nextCursor };
  }),
  /**
   * 访客发送留言。
   * 防刷：同一 IP（SHA-256 哈希）在 60 秒内只能发送一条。
   * 错误码 TOO_MANY_REQUESTS → HTTP 429，前端可读取 message 显示剩余等待秒数。
   */
  createMessage: publicProcedure.input(createMessageInput).mutation(async ({ input, ctx }) => {
    const ipHash = hashIp(ctx.ip);
    const [lastMsg] = await db.select({ createdAt: chatMessages.createdAt }).from(chatMessages).where(eq(chatMessages.ipHash, ipHash)).orderBy(desc(chatMessages.createdAt)).limit(1);
    if (lastMsg?.createdAt) {
      const elapsed = Date.now() - lastMsg.createdAt.getTime();
      if (elapsed < RATE_LIMIT_MS) {
        const waitSec = Math.ceil((RATE_LIMIT_MS - elapsed) / 1e3);
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `发送太频繁，请等待 ${waitSec} 秒后再试`
        });
      }
    }
    const id = nanoid();
    const [created] = await db.insert(chatMessages).values({ id, name: input.name, content: input.content, ipHash }).returning({
      id: chatMessages.id,
      name: chatMessages.name,
      content: chatMessages.content,
      isPinned: chatMessages.isPinned,
      createdAt: chatMessages.createdAt
    });
    return created;
  }),
  /**
   * 删除指定留言（管理员）。
   */
  deleteMessage: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(chatMessages).where(eq(chatMessages.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${input.id}" 的留言`
      });
    }
    return { success: true, id: deleted.id };
  }),
  /**
   * 切换留言的置顶状态（管理员）。
   * 读取当前 isPinned 值后取反写回，返回更新后的完整记录。
   */
  togglePin: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [msg] = await db.select().from(chatMessages).where(eq(chatMessages.id, input.id));
    if (!msg) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${input.id}" 的留言`
      });
    }
    const [updated] = await db.update(chatMessages).set({ isPinned: !msg.isPinned }).where(eq(chatMessages.id, input.id)).returning({
      id: chatMessages.id,
      name: chatMessages.name,
      content: chatMessages.content,
      isPinned: chatMessages.isPinned,
      createdAt: chatMessages.createdAt
    });
    return updated;
  })
};
const documentInput = z.object({
  title: z.string().min(1, "标题不能为空"),
  iconSrc: z.string().default(""),
  content: z.string().default(""),
  bgUrl: z.string().default(""),
  bgOpacity: z.number().min(0).max(1).default(0.12),
  order: z.number().int().nonnegative().default(0),
  visible: z.boolean().default(true)
});
const documentsRouter = {
  /**
   * 列出所有文档（含隐藏），供管理后台使用。
   * 公开读取接口见 site.ts → getDocuments（仅返回 visible=true）。
   */
  list: adminProcedure.query(async () => {
    return db.select().from(documents).orderBy(asc(documents.order));
  }),
  /**
   * 创建新文档。
   * - customId 可选：若提供则使用该值（调用方需保证唯一），否则自动生成 `doc-{nanoid()}`。
   * - order 自动取当前最大值 + 1（除非调用方显式传入非零值）。
   */
  create: adminProcedure.input(documentInput.extend({
    customId: z.string().regex(/^[a-zA-Z0-9_-]+$/, "ID 只能包含字母、数字、- 和 _").optional()
  })).mutation(async ({ input }) => {
    const { customId, ...fields } = input;
    const id = customId?.trim() || `doc-${nanoid()}`;
    if (customId?.trim()) {
      const [existing] = await db.select({ id: documents.id }).from(documents).where(eq(documents.id, id));
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `id 为 "${id}" 的文档已存在，请换一个 ID`
        });
      }
    }
    const result = await db.select({ maxOrder: max(documents.order) }).from(documents);
    const maxOrder = result[0]?.maxOrder ?? 0;
    const order = fields.order !== 0 ? fields.order : maxOrder + 1;
    const [created] = await db.insert(documents).values({ id, ...fields, order }).returning();
    return created;
  }),
  /**
   * 更新指定文档字段（partial），若 id 不存在抛 NOT_FOUND。
   */
  update: adminProcedure.input(documentInput.partial().extend({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const { id, ...fields } = input;
    if (Object.keys(fields).length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "至少需要提供一个要更新的字段"
      });
    }
    const [updated] = await db.update(documents).set(fields).where(eq(documents.id, id)).returning();
    if (!updated) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${id}" 的文档`
      });
    }
    return updated;
  }),
  /**
   * 删除指定文档，若 id 不存在抛 NOT_FOUND。
   */
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(documents).where(eq(documents.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${input.id}" 的文档`
      });
    }
    return { success: true };
  })
};
const mediaTrackInput = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  artist: z.string().max(100).default(""),
  src: z.string().max(1e3).default(""),
  bvid: z.string().max(20).optional(),
  cover: z.string().max(1e3).default(""),
  type: z.enum(["audio", "video", "bilibili"]).default("audio"),
  order: z.number().int().default(0),
  visible: z.boolean().default(true)
});
const mediaRouter = {
  /**
   * 公开读取：仅返回 visible=true 的曲目，按 order 升序。
   * Winamp 过滤 type='audio'，Video Player 过滤 type='video'|'bilibili'。
   */
  list: publicProcedure.query(async () => {
    return db.select().from(mediaTracks).where(eq(mediaTracks.visible, true)).orderBy(asc(mediaTracks.order));
  }),
  /**
   * 管理员读取全量曲目（含隐藏条目），按 order 升序。
   */
  listAll: adminProcedure.query(async () => {
    return db.select().from(mediaTracks).orderBy(asc(mediaTracks.order));
  }),
  /**
   * 创建曲目（管理员）。
   */
  create: adminProcedure.input(mediaTrackInput).mutation(async ({ input }) => {
    const id = nanoid();
    const [created] = await db.insert(mediaTracks).values({
      id,
      title: input.title,
      artist: input.artist,
      src: input.src,
      bvid: input.bvid ?? null,
      cover: input.cover,
      type: input.type,
      order: input.order,
      visible: input.visible
    }).returning();
    return created;
  }),
  /**
   * 更新曲目（管理员）。
   */
  update: adminProcedure.input(z.object({ id: z.string().min(1) }).merge(mediaTrackInput)).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [existing] = await db.select({ id: mediaTracks.id }).from(mediaTracks).where(eq(mediaTracks.id, id));
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${id}" 的曲目`
      });
    }
    const [updated] = await db.update(mediaTracks).set({
      title: data.title,
      artist: data.artist,
      src: data.src,
      bvid: data.bvid ?? null,
      cover: data.cover,
      type: data.type,
      order: data.order,
      visible: data.visible
    }).where(eq(mediaTracks.id, id)).returning();
    return updated;
  }),
  /**
   * 删除曲目（管理员）。
   * 删除后前台 Winamp / Video Player 的播放列表会在下次请求时同步更新。
   */
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(mediaTracks).where(eq(mediaTracks.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${input.id}" 的曲目`
      });
    }
    return { success: true, id: deleted.id };
  })
};
const portfolioItemInput = z.object({
  title: z.string().min(1, "标题不能为空").max(100),
  description: z.string().max(1e3).default(""),
  techStack: z.string().max(500).default(""),
  link: z.string().url("请输入有效的 URL").or(z.literal("")).optional(),
  imageUrl: z.string().max(500).default(""),
  category: z.string().max(50).default(""),
  order: z.number().int().default(0),
  visible: z.boolean().default(true)
});
const portfolioRouter = {
  /**
   * 公开读取作品列表，仅返回 visible=true 的条目，按 order 升序。
   * 管理员后台读全量时通过 admin 专属过滤（listAll）。
   */
  list: publicProcedure.query(async () => {
    return db.select().from(portfolioItems).where(eq(portfolioItems.visible, true)).orderBy(asc(portfolioItems.order));
  }),
  /**
   * 管理员读取全量作品列表（含隐藏条目），按 order 升序。
   */
  listAll: adminProcedure.query(async () => {
    return db.select().from(portfolioItems).orderBy(asc(portfolioItems.order));
  }),
  /**
   * 创建新作品条目（管理员）。
   */
  create: adminProcedure.input(portfolioItemInput).mutation(async ({ input }) => {
    const id = nanoid();
    const [created] = await db.insert(portfolioItems).values({
      id,
      title: input.title,
      description: input.description,
      techStack: input.techStack,
      link: input.link ?? null,
      imageUrl: input.imageUrl,
      category: input.category,
      order: input.order,
      visible: input.visible
    }).returning();
    return created;
  }),
  /**
   * 更新作品条目（管理员）。
   */
  update: adminProcedure.input(z.object({ id: z.string().min(1) }).merge(portfolioItemInput)).mutation(async ({ input }) => {
    const { id, ...data } = input;
    const [existing] = await db.select({ id: portfolioItems.id }).from(portfolioItems).where(eq(portfolioItems.id, id));
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${id}" 的作品`
      });
    }
    const [updated] = await db.update(portfolioItems).set({
      title: data.title,
      description: data.description,
      techStack: data.techStack,
      link: data.link ?? null,
      imageUrl: data.imageUrl,
      category: data.category,
      order: data.order,
      visible: data.visible
    }).where(eq(portfolioItems.id, id)).returning();
    return updated;
  }),
  /**
   * 删除作品条目（管理员）。
   */
  delete: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(portfolioItems).where(eq(portfolioItems.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `找不到 id 为 "${input.id}" 的作品`
      });
    }
    return { success: true, id: deleted.id };
  })
};
const settingsRouter = {
  // ── 站点设置 ────────────────────────────────────────────────────────────────
  /** 读取所有站点设置，返回扁平 Key-Value 对象（供管理页面初始化表单）。 */
  get: adminProcedure.query(async () => {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map(({ key, value }) => [key, value]));
  }),
  /**
   * 写入单条站点设置（Upsert）。
   * 若 key 已存在则覆盖，不存在则新建。
   */
  set: adminProcedure.input(z.object({ key: z.string().min(1), value: z.string() })).mutation(async ({ input }) => {
    await db.insert(siteSettings).values({ key: input.key, value: input.value }).onConflictDoUpdate({ target: siteSettings.key, set: { value: input.value } });
    return { success: true };
  }),
  /**
   * 批量写入站点设置（Batch Upsert），用于主题设置页"一键保存"。
   * 接收 Record<string, string>，全部 Upsert 到 site_settings 表。
   * excluded.value 是 SQLite UPSERT 语法，指「本次尝试插入的值」。
   */
  setBatch: adminProcedure.input(z.record(z.string().min(1), z.string())).mutation(async ({ input }) => {
    const pairs = Object.entries(input).map(([key, value]) => ({ key, value }));
    if (pairs.length === 0) return { success: true, count: 0 };
    await db.insert(siteSettings).values(pairs).onConflictDoUpdate({ target: siteSettings.key, set: { value: sql`excluded.value` } });
    return { success: true, count: pairs.length };
  }),
  // ── 桌面图标 CRUD ────────────────────────────────────────────────────────────
  /** 列出所有图标（含隐藏），供管理页面完整展示。 */
  listAllIcons: adminProcedure.query(async () => {
    return db.select().from(desktopIcons).orderBy(asc(desktopIcons.order));
  }),
  /**
   * 新建桌面图标。
   * id 由调用方提供，必须与 APP_REGISTRY 键名一致（如 'myComputer'）。
   * 未传 order 时自动取当前最大值 + 1，保证新图标排在末尾。
   */
  createIcon: adminProcedure.input(z.object({
    id: z.string().min(1, "图标 id 不能为空，且须与 APP_REGISTRY 键名一致"),
    label: z.string().min(1, "显示名称不能为空"),
    src: z.string().min(1, "图标路径不能为空"),
    visible: z.boolean().default(true),
    order: z.number().int().nonnegative().optional()
  })).mutation(async ({ input }) => {
    const rows = await db.select({ maxOrder: max(desktopIcons.order) }).from(desktopIcons);
    const maxOrder = rows[0]?.maxOrder ?? null;
    const order = input.order ?? (maxOrder ?? -1) + 1;
    const [created] = await db.insert(desktopIcons).values({ ...input, order }).returning();
    return created;
  }),
  /** 更新桌面图标（partial）。id 不存在时抛 NOT_FOUND。 */
  updateIcon: adminProcedure.input(z.object({
    id: z.string().min(1),
    label: z.string().min(1).optional(),
    src: z.string().min(1).optional(),
    visible: z.boolean().optional(),
    order: z.number().int().nonnegative().optional()
  })).mutation(async ({ input }) => {
    const { id, ...fields } = input;
    if (Object.keys(fields).length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "至少需要提供一个要更新的字段" });
    }
    const [updated] = await db.update(desktopIcons).set(fields).where(eq(desktopIcons.id, id)).returning();
    if (!updated) {
      throw new TRPCError({ code: "NOT_FOUND", message: `找不到 id 为 "${id}" 的桌面图标` });
    }
    return updated;
  }),
  /** 删除桌面图标。id 不存在时抛 NOT_FOUND。 */
  deleteIcon: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(desktopIcons).where(eq(desktopIcons.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: `找不到 id 为 "${input.id}" 的桌面图标` });
    }
    return { success: true, id: deleted.id };
  }),
  // ── 吉祥物 CRUD ──────────────────────────────────────────────────────────────
  /** 列出所有吉祥物，供管理页面完整展示。 */
  listAllMascots: adminProcedure.query(async () => {
    return db.select().from(mascots).orderBy(asc(mascots.order));
  }),
  /**
   * 新建吉祥物。
   * id 由服务端生成（nanoid），无需调用方传入。
   * 未传 order 时自动取当前最大值 + 1。
   */
  createMascot: adminProcedure.input(z.object({
    label: z.string().default(""),
    iconSrc: z.string().min(1, "侧边栏图标路径不能为空"),
    petSrc: z.string().min(1, "桌面精灵路径不能为空"),
    size: z.number().int().positive().default(80),
    order: z.number().int().nonnegative().optional()
  })).mutation(async ({ input }) => {
    const id = `mascot-${nanoid()}`;
    const rows = await db.select({ maxOrder: max(mascots.order) }).from(mascots);
    const maxOrder = rows[0]?.maxOrder ?? null;
    const order = input.order ?? (maxOrder ?? -1) + 1;
    const [created] = await db.insert(mascots).values({ id, ...input, order }).returning();
    return created;
  }),
  /** 更新吉祥物（partial）。id 不存在时抛 NOT_FOUND。 */
  updateMascot: adminProcedure.input(z.object({
    id: z.string().min(1),
    label: z.string().optional(),
    iconSrc: z.string().min(1).optional(),
    petSrc: z.string().min(1).optional(),
    size: z.number().int().positive().optional(),
    order: z.number().int().nonnegative().optional()
  })).mutation(async ({ input }) => {
    const { id, ...fields } = input;
    if (Object.keys(fields).length === 0) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "至少需要提供一个要更新的字段" });
    }
    const [updated] = await db.update(mascots).set(fields).where(eq(mascots.id, id)).returning();
    if (!updated) {
      throw new TRPCError({ code: "NOT_FOUND", message: `找不到 id 为 "${id}" 的吉祥物` });
    }
    return updated;
  }),
  /** 删除吉祥物。id 不存在时抛 NOT_FOUND。 */
  deleteMascot: adminProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) => {
    const [deleted] = await db.delete(mascots).where(eq(mascots.id, input.id)).returning();
    if (!deleted) {
      throw new TRPCError({ code: "NOT_FOUND", message: `找不到 id 为 "${input.id}" 的吉祥物` });
    }
    return { success: true, id: deleted.id };
  })
};
const siteRouter = {
  /**
   * 读取所有站点设置，将 [{key, value}] 数组转换为扁平对象。
   * 前端可直接解构：const { wallpaper_url, windows_logo_url } = data
   *
   * 注意：数组类型的值（如 system_tray_icons）在 DB 中以 JSON 字符串存储，
   * 前端取用时需自行 JSON.parse。
   */
  getSettings: publicProcedure.query(async () => {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map(({ key, value }) => [key, value]));
  }),
  /**
   * 读取所有博客文章，按 order 升序排列。
   * 返回完整字段（含 content），由前端按需使用。
   */
  getBlogPosts: publicProcedure.query(async () => {
    return db.select().from(blogPosts).orderBy(asc(blogPosts.order));
  }),
  /**
   * 读取 visible = true 的桌面图标，按 order 升序排列。
   * 隐藏的图标（visible = false）在此接口不可见，仅管理员接口返回全量。
   */
  getDesktopIcons: publicProcedure.query(async () => {
    return db.select().from(desktopIcons).where(eq(desktopIcons.visible, true)).orderBy(asc(desktopIcons.order));
  }),
  /**
   * 读取所有吉祥物，按 order 升序排列。
   */
  getMascots: publicProcedure.query(async () => {
    return db.select().from(mascots).orderBy(asc(mascots.order));
  }),
  /**
   * 读取 visible=true 的作品集条目，按 order 升序排列。
   */
  getPortfolioItems: publicProcedure.query(async () => {
    return db.select().from(portfolioItems).where(eq(portfolioItems.visible, true)).orderBy(asc(portfolioItems.order));
  }),
  /**
   * 读取 visible=true 的多媒体曲目，按 order 升序排列。
   * 前台 Winamp 过滤 type='audio'，Video Player 过滤 type='video'|'bilibili'。
   */
  getMediaTracks: publicProcedure.query(async () => {
    return db.select().from(mediaTracks).where(eq(mediaTracks.visible, true)).orderBy(asc(mediaTracks.order));
  }),
  /**
   * 读取 visible=true 的文档窗口，按 order 升序排列。
   * 管理后台全量读取见 documents.ts → list。
   */
  getDocuments: publicProcedure.query(async () => {
    return db.select().from(documents).where(eq(documents.visible, true)).orderBy(asc(documents.order));
  })
};
const appRouter = createTRPCRouter({
  example: exampleRouter,
  // 保持不动
  site: siteRouter,
  // 公开读取：settings / blogPosts / desktopIcons / mascots / portfolioItems / mediaTracks / documents
  blog: blogRouter,
  // 管理：博客 CRUD（需鉴权）
  settings: settingsRouter,
  // 管理：站点设置 + 图标 + 吉祥物 CRUD（需鉴权）
  auth: authRouter,
  // 认证：login / logout / verify
  chatbox: chatboxRouter,
  // Phase 4：留言板（公开读写 + 管理删除/置顶）
  portfolio: portfolioRouter,
  // Phase 5.1：作品集（公开读 + 管理 CRUD）
  media: mediaRouter,
  // Phase 5.2：多媒体曲目（公开读 + 管理 CRUD）
  documents: documentsRouter
  // Phase 6：通用文档窗口 CRUD（公开读 + 管理 CRUD）
});
function handler({ request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: () => createTRPCContext(request),
    // 将 Procedure 内写入 ctx.resHeaders 的响应头（如 Set-Cookie）转发到 HTTP 响应。
    responseMeta({ ctx }) {
      if (!ctx?.resHeaders) return {};
      return { headers: ctx.resHeaders };
    }
  });
}
const Route$d = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler
    }
  }
});
const $$splitComponentImporter$c = () => import("./theme-4U0DL0Hh.mjs");
const Route$c = createFileRoute("/admin/_layout/theme")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./portfolio-DvYDAcXS.mjs");
const Route$b = createFileRoute("/admin/_layout/portfolio")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./media-B8W3EkLT.mjs");
const Route$a = createFileRoute("/admin/_layout/media")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./mascots-DW8H1C1V.mjs");
const Route$9 = createFileRoute("/admin/_layout/mascots")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./icons-CEDqzyWm.mjs");
const Route$8 = createFileRoute("/admin/_layout/icons")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./documents-D0NAvuNK.mjs");
const Route$7 = createFileRoute("/admin/_layout/documents")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./contact-B83E34Cd.mjs");
const Route$6 = createFileRoute("/admin/_layout/contact")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./comments-bd4Ww50U.mjs");
const Route$5 = createFileRoute("/admin/_layout/comments")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./chatbox-5GEIYDP_.mjs");
const Route$4 = createFileRoute("/admin/_layout/chatbox")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./about-CDyAyHPp.mjs");
const Route$3 = createFileRoute("/admin/_layout/about")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-B9XzcJf8.mjs");
const Route$2 = createFileRoute("/admin/_layout/blog/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./new-DQZDkmV0.mjs");
const Route$1 = createFileRoute("/admin/_layout/blog/new")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./_id-DUQArNcM.mjs");
const Route = createFileRoute("/admin/_layout/blog/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$i
});
const AdminLoginRoute = Route$g.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$i
});
const AdminLayoutRoute = Route$f.update({
  id: "/admin/_layout",
  path: "/admin",
  getParentRoute: () => Route$i
});
const AdminLayoutIndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminLayoutRoute
});
const ApiTrpcSplatRoute = Route$d.update({
  id: "/api/trpc/$",
  path: "/api/trpc/$",
  getParentRoute: () => Route$i
});
const AdminLayoutThemeRoute = Route$c.update({
  id: "/theme",
  path: "/theme",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutPortfolioRoute = Route$b.update({
  id: "/portfolio",
  path: "/portfolio",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutMediaRoute = Route$a.update({
  id: "/media",
  path: "/media",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutMascotsRoute = Route$9.update({
  id: "/mascots",
  path: "/mascots",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutIconsRoute = Route$8.update({
  id: "/icons",
  path: "/icons",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutDocumentsRoute = Route$7.update({
  id: "/documents",
  path: "/documents",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutContactRoute = Route$6.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutCommentsRoute = Route$5.update({
  id: "/comments",
  path: "/comments",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutChatboxRoute = Route$4.update({
  id: "/chatbox",
  path: "/chatbox",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutAboutRoute = Route$3.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutBlogIndexRoute = Route$2.update({
  id: "/blog/",
  path: "/blog/",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutBlogNewRoute = Route$1.update({
  id: "/blog/new",
  path: "/blog/new",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutBlogIdRoute = Route.update({
  id: "/blog/$id",
  path: "/blog/$id",
  getParentRoute: () => AdminLayoutRoute
});
const AdminLayoutRouteChildren = {
  AdminLayoutAboutRoute,
  AdminLayoutChatboxRoute,
  AdminLayoutCommentsRoute,
  AdminLayoutContactRoute,
  AdminLayoutDocumentsRoute,
  AdminLayoutIconsRoute,
  AdminLayoutMascotsRoute,
  AdminLayoutMediaRoute,
  AdminLayoutPortfolioRoute,
  AdminLayoutThemeRoute,
  AdminLayoutIndexRoute,
  AdminLayoutBlogIdRoute,
  AdminLayoutBlogNewRoute,
  AdminLayoutBlogIndexRoute
};
const AdminLayoutRouteWithChildren = AdminLayoutRoute._addFileChildren(
  AdminLayoutRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminLayoutRoute: AdminLayoutRouteWithChildren,
  AdminLoginRoute,
  ApiTrpcSplatRoute
};
const routeTree = Route$i._addFileChildren(rootRouteChildren)._addFileTypes();
function NotFound() {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-screen w-screen overflow-hidden", "data-cid": "EM1cQ_H3", children: /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: "404 - Not Found" }) });
}
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  appRouter as a,
  createTRPCContext as c,
  queryClient as q,
  router as r,
  trpc as t
};
