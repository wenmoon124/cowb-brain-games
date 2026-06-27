import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppEnv, Locale, SessionData, SessionUser } from '../types'
import { extractSessionToken, optionalAuth, requireAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

/** Session TTL in seconds (7 days) */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

// ============ Schemas ============

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  nickname: z.string().min(2).max(32),
  locale: z.enum(['en', 'zh', 'ja']).optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ============ Routes ============

// POST /signup — Register a new user and create session
app.post(
  '/signup',
  zValidator('json', signupSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR' as const,
            message: 'Invalid signup data',
            requestId: c.get('requestId') ?? '',
          },
        },
        400
      )
    }
  }),
  async (c) => {
    const body = c.req.valid('json')

    // TODO(Phase F): Check if user already exists via UserRepository.findByEmail
    // TODO(Phase F): Hash password using Web Crypto API (PBKDF2)
    // TODO(Phase F): Create user in D1 via UserRepository.create

    const token = crypto.randomUUID()
    const locale: Locale = body.locale ?? 'en'
    const sessionData: SessionData = {
      userId: crypto.randomUUID(), // TODO: use actual user ID from D1 insert
      email: body.email,
      nickname: body.nickname,
      role: 'user',
      locale,
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
    }

    await c.env.SESSIONS.put(`session:${token}`, JSON.stringify(sessionData), {
      expirationTtl: SESSION_TTL_SECONDS,
    })

    // TODO: Set domain to '.cowb.cc' in production for cross-subdomain cookies
    setCookie(c, 'session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    })

    const user: SessionUser = {
      userId: sessionData.userId,
      email: sessionData.email,
      nickname: sessionData.nickname,
      role: sessionData.role,
      locale: sessionData.locale,
    }

    return c.json({ user, token }, 201)
  }
)

// POST /login — Authenticate user and create session
app.post(
  '/login',
  zValidator('json', loginSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR' as const,
            message: 'Invalid login data',
            requestId: c.get('requestId') ?? '',
          },
        },
        400
      )
    }
  }),
  async (c) => {
    const body = c.req.valid('json')

    // TODO(Phase F): Find user by email via UserRepository.findByEmail
    // TODO(Phase F): Verify password hash using Web Crypto API
    // TODO(Phase F): Return 401 if user not found or password mismatch

    const token = crypto.randomUUID()
    const sessionData: SessionData = {
      userId: crypto.randomUUID(), // TODO: use actual user ID from D1
      email: body.email,
      nickname: 'placeholder_user', // TODO: use actual nickname from D1
      role: 'user',
      locale: 'en',
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
    }

    await c.env.SESSIONS.put(`session:${token}`, JSON.stringify(sessionData), {
      expirationTtl: SESSION_TTL_SECONDS,
    })

    setCookie(c, 'session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    })

    const user: SessionUser = {
      userId: sessionData.userId,
      email: sessionData.email,
      nickname: sessionData.nickname,
      role: sessionData.role,
      locale: sessionData.locale,
    }

    return c.json({ user, token })
  }
)

// POST /logout — Destroy current session
app.post('/logout', requireAuth, async (c) => {
  const token = extractSessionToken(c)
  if (token) {
    await c.env.SESSIONS.delete(`session:${token}`)
  }

  deleteCookie(c, 'session', { path: '/' })

  return c.json({ success: true })
})

// GET /session — Get current session user
app.get('/session', optionalAuth, async (c) => {
  const user = c.get('user')
  if (!user) {
    return c.json({ user: null })
  }
  return c.json({ user })
})

export default app
