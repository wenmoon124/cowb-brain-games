import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { AppEnv } from './types'
import { rateLimit } from './middleware/rate-limit'
import auth from './routes/auth'
import scores from './routes/scores'
import brainAge from './routes/brain-age'
import games from './routes/games'
import growth from './routes/growth'
import challenges from './routes/challenges'
import content from './routes/content'
import admin from './routes/admin'

const app = new Hono<AppEnv>()

// ============ Error Handler ============

app.onError((err, c) => {
  const requestId = c.get('requestId') ?? ''
  console.error(
    JSON.stringify({
      level: 'error',
      requestId,
      method: c.req.method,
      path: c.req.path,
      error: err.message,
      stack: err.stack,
    })
  )
  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR' as const,
        message: 'An unexpected error occurred',
        requestId,
      },
    },
    500
  )
})

// ============ Not Found Handler ============

app.notFound((c) => {
  const requestId = c.get('requestId') ?? ''
  return c.json(
    {
      error: {
        code: 'NOT_FOUND' as const,
        message: 'Resource not found',
        requestId,
      },
    },
    404
  )
})

// ============ CORS Middleware ============

app.use(
  '*',
  cors({
    origin: ['https://cowb.cc', 'https://preview.cowb.cc'],
    allowCredentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Requested-With'],
    exposeHeaders: ['X-Request-Id'],
    maxAge: 86400,
  })
)

// ============ Request ID Middleware ============

app.use('*', async (c, next) => {
  const requestId = c.req.header('X-Request-Id') ?? crypto.randomUUID()
  c.set('requestId', requestId)
  c.header('X-Request-Id', requestId)
  await next()
})

// ============ Rate Limit Middleware ============

app.use('*', rateLimit)

// ============ Request Logging Middleware ============

app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  const requestId = c.get('requestId') ?? ''
  console.log(
    JSON.stringify({
      level: 'info',
      requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs: duration,
    })
  )
})

// ============ Health & API Info Routes ============

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api', (c) => {
  return c.json({
    name: 'BrainVerse API',
    version: '0.1.0',
  })
})

// ============ Route Groups ============

app.route('/api/auth', auth)
app.route('/api/scores', scores)
app.route('/api/brain-age', brainAge)
app.route('/api/games', games)
app.route('/api/growth', growth)
app.route('/api/challenges', challenges)
app.route('/api/content', content)
app.route('/api/admin', admin)

export default app
