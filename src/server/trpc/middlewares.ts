import { t } from './init';

export const authMiddleware = t.middleware(({ ctx, next }) => {
  return next({
    ctx: {},
  });
});

export const loggingMiddleware = t.middleware(
  async ({ path, type, next, input }) => {
    const start = Date.now();
    const isDev = process.env.NODE_ENV !== 'production';
    const timestamp = isDev
      ? new Date().toLocaleTimeString()
      : new Date().toISOString();
    const typeAbbr = type === 'query' ? 'Q' : type === 'mutation' ? 'M' : 'S';

    const fmt = (msg: string) => `[${timestamp}][${typeAbbr}] ${msg}`;

    console.log(fmt(`${path} - Started`));

    if (input !== undefined && process.env.NODE_ENV !== 'production') {
      console.log(fmt(`Input: ${JSON.stringify(input)}`));
    }

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
