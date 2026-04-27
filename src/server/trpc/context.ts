// 接受完整 Request（HTTP 路径）或仅 { headers }（SSR caller 路径）
type ContextInput = Request | { headers: Headers };

function extractIp(headers: Headers): string {
  // Cloudflare 真实 IP → Nginx X-Forwarded-For 首段 → X-Real-IP → 未知
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',').at(0)?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  );
}

export const createTRPCContext = (input: ContextInput) => {
  const headers = input instanceof Request ? input.headers : input.headers;
  // SSR caller（非 HTTP 请求）没有真实 IP，限流对其无意义，统一为 'unknown'
  const ip = input instanceof Request ? extractIp(headers) : 'unknown';
  return {
    headers,
    // 用于在 tRPC Procedure 内向响应追加 Set-Cookie 等响应头。
    // 仅在 HTTP 适配器路径（/api/trpc）下有效，SSR local link 路径不会转发此对象。
    resHeaders: new Headers(),
    ip,
  };
};
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
