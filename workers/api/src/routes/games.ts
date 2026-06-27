import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { optionalAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

// ============ Routes ============

// GET / — List all games
app.get('/', optionalAuth, async (c) => {
  const dimension = c.req.query('dimension')
  const activeStr = c.req.query('active')
  const active = activeStr === undefined ? undefined : activeStr === 'true'

  // TODO(Phase F): Fetch games from D1 via GameRepository.findAll
  // TODO(Phase F): Filter by dimension if provided
  // TODO(Phase F): Filter by active flag if provided

  return c.json({ data: [], filters: { dimension, active } })
})

// GET /:slug — Get game by slug
app.get('/:slug', optionalAuth, async (c) => {
  const slug = c.req.param('slug')

  // TODO(Phase F): Fetch game from D1 via GameRepository.findBySlug

  return c.json(
    {
      error: {
        code: 'NOT_FOUND' as const,
        message: `Game '${slug}' not found`,
        requestId: c.get('requestId') ?? '',
      },
    },
    404
  )
})

export default app
