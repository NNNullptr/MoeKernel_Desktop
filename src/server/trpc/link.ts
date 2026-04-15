import { unstable_localLink } from '@trpc/client';
import { getRequestHeaders } from '@tanstack/react-start/server';
import superjson from 'superjson';
import { appRouter } from './router';
import { createTRPCContext } from './context';

export const serverLink = unstable_localLink({
  router: appRouter,
  transformer: superjson,
  async createContext() {
    const headers = await getRequestHeaders();
    return createTRPCContext({ headers });
  },
});
