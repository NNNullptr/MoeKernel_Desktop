import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { type TRPCContext } from './context';

/**
 * 生产环境下需要替换为通用文本的错误码。
 *
 * 保留原文的码：
 *   UNAUTHORIZED       — 认证状态提示，面向用户，无内部信息
 *   BAD_REQUEST        — 输入校验提示，管理员需要看到具体原因
 *   TOO_MANY_REQUESTS  — 限流等待时间提示，用户体验必要
 *
 * 生产环境替换的码：
 *   NOT_FOUND          — 消息含资源 ID，可辅助枚举
 *   CONFLICT           — 消息含资源 ID（如"文档已存在"）
 *   INTERNAL_SERVER_ERROR — 未预期异常，可能携带 DB 报错 / 堆栈信息
 *   FORBIDDEN          — 避免暴露权限边界细节
 *
 * 原始错误消息仍由 loggingMiddleware 完整写入服务端日志，调试信息不丢失。
 */
const SANITIZED_CODES = new Set([
  'NOT_FOUND',
  'CONFLICT',
  'INTERNAL_SERVER_ERROR',
  'FORBIDDEN',
] as const);

const SANITIZED_MESSAGES: Record<string, string> = {
  NOT_FOUND:              '请求的资源不存在',
  CONFLICT:               '操作冲突，请刷新后重试',
  INTERNAL_SERVER_ERROR:  '服务器内部错误，请稍后重试',
  FORBIDDEN:              '无权执行此操作',
};

export const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,

  errorFormatter({ shape }) {
    if (
      process.env.NODE_ENV === 'production' &&
      (SANITIZED_CODES as Set<string>).has(shape.data.code)
    ) {
      const safeMessage = SANITIZED_MESSAGES[shape.data.code] ?? '请求失败，请稍后重试';
      return { ...shape, message: safeMessage };
    }
    return shape;
  },
});

export const createTRPCRouter = t.router;
