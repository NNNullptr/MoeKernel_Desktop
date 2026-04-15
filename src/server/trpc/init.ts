import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { type TRPCContext } from './context';

export const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
