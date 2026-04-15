import { authMiddleware, loggingMiddleware } from './middlewares';
import { t } from './init';
export { t, createTRPCRouter } from './init';

export const publicProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure
  .use(loggingMiddleware)
  .use(authMiddleware);
