import { createFileRoute } from '@tanstack/react-router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { createTRPCContext } from '@/server/trpc/context';
import { appRouter } from '@/server/trpc/router';

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: () => createTRPCContext(request),
    // 将 Procedure 内写入 ctx.resHeaders 的响应头（如 Set-Cookie）转发到 HTTP 响应。
    responseMeta({ ctx }) {
      if (!ctx?.resHeaders) return {};
      return { headers: ctx.resHeaders };
    },
  });
}

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
