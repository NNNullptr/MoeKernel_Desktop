import z from 'zod';
import { publicProcedure } from '../procedure';

const greetings: string[] = [];

export const exampleRouter = {
  getServerTime: publicProcedure.query(() => {
    return new Date().toLocaleString();
  }),
  greet: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello, ${input.name}!`;
    }),
  getGreetings: publicProcedure.query(() => {
    return greetings;
  }),
  addGreeting: publicProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(({ input }) => {
      greetings.push(input.message);
      return { success: true, count: greetings.length };
    }),
};
