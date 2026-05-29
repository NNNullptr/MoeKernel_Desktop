/**
 * @file rate-limiter.ts
 * @description 登录接口内存限流器
 *
 * 策略：同一 IP 连续登录失败 MAX_ATTEMPTS 次后，锁定 LOCK_DURATION_MS 毫秒。
 * 成功登录后立即清零该 IP 的计数。
 *
 * 实现说明：
 *   - 纯内存 Map，无需额外依赖，重启后自动清零（可接受：攻击窗口重启后仍需重新积累失败次数）
 *   - check() 调用时自动清理已过期条目，防止 Map 无限增长
 *   - IP 为 'unknown'（SSR 内部调用）时直接放行，不参与限流
 */

const MAX_ATTEMPTS    = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 分钟

interface RateLimitEntry {
  /** 累计失败次数（锁定期间停止计数） */
  attempts: number;
  /** 锁定到期时间戳（ms），null 表示未锁定 */
  lockedUntil: number | null;
}

class LoginRateLimiter {
  private readonly store = new Map<string, RateLimitEntry>();

  /**
   * 检查该 IP 是否允许尝试登录。
   * @returns `{ allowed: true }` 或 `{ allowed: false, retryAfterSec: number }`
   */
  check(ip: string): { allowed: true } | { allowed: false; retryAfterSec: number } {
    if (ip === 'unknown') return { allowed: true };

    const entry = this.store.get(ip);
    if (!entry) return { allowed: true };

    const now = Date.now();

    if (entry.lockedUntil !== null) {
      if (now < entry.lockedUntil) {
        // 仍在锁定期内
        const retryAfterSec = Math.ceil((entry.lockedUntil - now) / 1000);
        return { allowed: false, retryAfterSec };
      }
      // 锁定已过期 → 清理条目，放行
      this.store.delete(ip);
    }

    return { allowed: true };
  }

  /**
   * 记录一次登录失败。
   * 累计达到 MAX_ATTEMPTS 次时触发锁定。
   */
  recordFailure(ip: string): void {
    if (ip === 'unknown') return;

    const now     = Date.now();
    const entry   = this.store.get(ip) ?? { attempts: 0, lockedUntil: null };

    // 若锁已过期则重置为第一次失败
    if (entry.lockedUntil !== null && now >= entry.lockedUntil) {
      this.store.set(ip, { attempts: 1, lockedUntil: null });
      return;
    }

    const attempts = entry.attempts + 1;

    if (attempts >= MAX_ATTEMPTS) {
      this.store.set(ip, { attempts, lockedUntil: now + LOCK_DURATION_MS });
    } else {
      this.store.set(ip, { attempts, lockedUntil: null });
    }
  }

  /**
   * 登录成功后清零该 IP 的失败计数。
   */
  recordSuccess(ip: string): void {
    if (ip === 'unknown') return;
    this.store.delete(ip);
  }
}

/** 单例：全进程共享同一个限流状态 */
export const loginRateLimiter = new LoginRateLimiter();
