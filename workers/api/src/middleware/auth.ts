import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import type { Context } from 'hono'
import type { AppEnv, SessionData, SessionUser } from '../types'

const SESSION_KEY_PREFIX = 'session:'

/**
 * Extract session token from cookie or Authorization header.
 * Checks cookie `session` first, then falls back to `Bearer` token.
 */
export function extractSessionToken(c: Context<AppEnv>): string | null {
  const cookieToken = getCookie(c, 'session')
  if (cookieToken) return cookieToken

  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return null
}

/**
 * Load session user from SESSIONS KV by token.
 * Returns null if token is missing, session not found, or expired.
 */
async function loadSessionUser(c: Context<AppEnv>): Promise<SessionUser | null> {
  const token = extractSessionToken(c)
  if (!token) return null

  const data = await c.env.SESSIONS.get<SessionData>(`${SESSION_KEY_PREFIX}${token}`, 'json')
  if (!data) return null

  // Check session expiry
  const expiresAt = new Date(data.expiresAt)
  if (expiresAt.getTime() < Date.now()) {
    return null
  }

  return {
    userId: data.userId,
    email: data.email,
    nickname: data.nickname,
    role: data.role,
    locale: data.locale,
  }
}

/** Build a 401 Unauthorized JSON response */
function unauthorizedResponse(c: Context<AppEnv>, message: string): Response {
  return c.json(
    {
      error: {
        code: 'UNAUTHORIZED' as const,
        message,
        requestId: c.get('requestId') ?? '',
      },
    },
    401
  )
}

/** Build a 403 Forbidden JSON response */
function forbiddenResponse(c: Context<AppEnv>, message: string): Response {
  return c.json(
    {
      error: {
        code: 'FORBIDDEN' as const,
        message,
        requestId: c.get('requestId') ?? '',
      },
    },
    403
  )
}

/**
 * getSession middleware — reads session token, looks up in SESSIONS KV,
 * and attaches user to context (null if not authenticated). Always continues.
 */
export const getSession = createMiddleware<AppEnv>(async (c, next) => {
  const user = await loadSessionUser(c)
  c.set('user', user)
  await next()
})

/**
 * optionalAuth middleware — same as getSession.
 * Attaches user if a valid session exists, continues otherwise.
 */
export const optionalAuth = getSession

/**
 * requireAuth middleware — loads session and returns 401 if not authenticated.
 * Attaches user to context on success.
 */
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = await loadSessionUser(c)
  if (!user) {
    return unauthorizedResponse(c, 'Authentication required')
  }
  c.set('user', user)
  await next()
})

/**
 * requireAdmin middleware — loads session, returns 401 if not authenticated,
 * returns 403 if user role is not 'admin'. Attaches user to context on success.
 */
export const requireAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const user = await loadSessionUser(c)
  if (!user) {
    return unauthorizedResponse(c, 'Authentication required')
  }
  if (user.role !== 'admin') {
    return forbiddenResponse(c, 'Admin access required')
  }
  c.set('user', user)
  await next()
})
