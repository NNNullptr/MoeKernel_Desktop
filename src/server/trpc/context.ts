export const createTRPCContext = ({ headers }: { headers: Headers }) => {
  return {
    headers,
    // 用于在 tRPC Procedure 内向响应追加 Set-Cookie 等响应头。
    // 仅在 HTTP 适配器路径（/api/trpc）下有效，SSR local link 路径不会转发此对象。
    resHeaders: new Headers(),
  };
};
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
