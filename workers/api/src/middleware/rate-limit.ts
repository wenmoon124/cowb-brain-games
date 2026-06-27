import { createMiddleware } from 'hono/factory'
import type { AppEnv } from '../types'

/** Maximum requests per IP per minute window */
const RATE_LIMIT_MAX = 60

/** Rate limit window duration in seconds (1 minute) */
const RATE_LIMIT_WINDOW_SECONDS = 60

/**
 * Simple IP-based rate limiting using KV.
 *
 * Key format: `rate_limit:{ip}:{minute}`
 * Limit: 60 requests per minute per IP.
 * Returns 429 with Retry-After header when exceeded.
 *
 * TODO(Phase F): Consider KV write quota optimization — current approach writes
 * to KV on every request. Production optimization should aggregate counts or
 * use a different strategy to stay within the 1K writes/day free plan quota.
 */
export const rateLimit = createMiddleware<AppEnv>(async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const minuteBucket = Math.floor(Date.now() / (RATE_LIMIT_WINDOW_SECONDS * 1000))
  const key = `rate_limit:${ip}:${minuteBucket}`

  const countStr = await c.env.CACHE.get(key)
  const count = countStr ? parseInt(countStr, 10) : 0

  if (count >= RATE_LIMIT_MAX) {
    const elapsedSeconds = Math.floor(Date.now() / 1000) % RATE_LIMIT_WINDOW_SECONDS
    const retryAfter = RATE_LIMIT_WINDOW_SECONDS - elapsedSeconds
    c.header('Retry-After', String(retryAfter))
    return c.json(
      {
        error: {
          code: 'RATE_LIMITED' as const,
          message: 'Too many requests. Please try again later.',
          requestId: c.get('requestId') ?? '',
        },
      },
      429
    )
  }

  await c.env.CACHE.put(key, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  })

  await next()
})
