// Generic rate limiter utility
// Ref: SECURITY.md §9 (rate limiting on login, requestPasswordReset)
//
// Simple in-memory rate limiter suitable for single-VPS MVP.
// Each key (e.g., "login:email:user@example.com") tracks request
// count within a sliding window. Returns a deterministic rate-limit
// error rather than silently dropping requests (AGENTS.md §10).

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries to prevent memory growth
const CLEANUP_INTERVAL_MS = 60_000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitConfig {
  /** Maximum number of attempts allowed within the window */
  maxAttempts: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment rate limit for a given key.
 *
 * @param key - Unique identifier (e.g., "login:192.168.1.1")
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed, remaining count, and reset time
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // If no entry or window has expired, start fresh
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetAt,
    };
  }

  // Within the window — check against limit
  if (entry.count >= config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment and allow
  entry.count += 1;
  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetAt: entry.resetAt,
  };
}

// Pre-configured rate limits for auth endpoints
// Ref: SECURITY.md §9
export const AuthRateLimits = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;
