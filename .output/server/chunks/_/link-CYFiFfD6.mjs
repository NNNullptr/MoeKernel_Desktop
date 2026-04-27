import { unstable_localLink } from "@trpc/client";
import superjson from "superjson";
import { a as appRouter, c as createTRPCContext } from "./router-Dg4MpxXb.mjs";
import { g as getRequestHeaders } from "./server.mjs";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-query";
import "@trpc/server/observable";
import "@trpc/tanstack-react-query";
import "@trpc/server/adapters/fetch";
import "@trpc/server";
import "jose";
import "zod";
import "drizzle-orm";
import "nanoid";
import "drizzle-orm/libsql";
import "@libsql/client/http";
import "drizzle-orm/sqlite-core";
import "node:crypto";
import "node:async_hooks";
import "node:stream";
import "@tanstack/react-router/ssr/server";
const serverLink = unstable_localLink({
  router: appRouter,
  transformer: superjson,
  async createContext() {
    const headers = await getRequestHeaders();
    return createTRPCContext({ headers });
  }
});
export {
  serverLink
};
