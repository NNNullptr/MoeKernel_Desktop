// IMPORTANT: trpc is only allowed to be used in client components
import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
  splitLink,
} from '@trpc/client';
import type { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '@/server/trpc/router';
import superjson from 'superjson';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

export const queryClient = new QueryClient();

const lazyServerLink: TRPCLink<AppRouter> = (runtime) => (ctx) =>
  observable((observer) => {
    let sub: { unsubscribe(): void } | undefined;
    import('@/server/trpc/link').then(
      ({ serverLink }) => (sub = serverLink(runtime)(ctx).subscribe(observer)),
      (err) => observer.error(err)
    );
    return () => sub?.unsubscribe();
  });

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    splitLink({
      condition: () => typeof window === 'undefined',
      true: lazyServerLink,
      false: httpBatchLink({
        url: '/api/trpc',
        transformer: superjson,
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
