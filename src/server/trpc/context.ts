export const createTRPCContext = ({ headers }: { headers: Headers }) => {
  return {
    headers,
  };
};
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
