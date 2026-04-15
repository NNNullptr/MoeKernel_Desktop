import { createTRPCRouter } from './procedure';
import { exampleRouter } from './routes/example';

export const appRouter = createTRPCRouter({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
