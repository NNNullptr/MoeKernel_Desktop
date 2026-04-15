import { getRequestHeaders } from '@tanstack/react-start/server';
import { appRouter, type AppRouter } from './router';
import { createTRPCContext } from './context';

export function createCaller() {
  const headers = getRequestHeaders();
  const ctx = createTRPCContext({ headers });
  return appRouter.createCaller(ctx);
}

export type ServerCaller = ReturnType<typeof createCaller>;
