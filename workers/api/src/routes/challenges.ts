import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppEnv } from '../types'
import { requireAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

// ============ Schemas ============

const createChallengeSchema = z.object({
  gameId: z.string().min(1),
  targetScore: z.number().int().min(0).optional(),
  targetId: z.string().min(1).optional(),
})

// ============ Routes ============

// POST / — Create a new challenge
app.post(
  '/',
  requireAuth,
  zValidator('json', createChallengeSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR' as const,
            message: 'Invalid challenge data',
            requestId: c.get('requestId') ?? '',
          },
        },
        400
      )
    }
  }),
  async (c) => {
    const user = c.get('user')!
    const body = c.req.valid('json')

    // TODO(Phase F): Verify gameId exists via GameRepository
    // TODO(Phase F): Verify targetId is a valid user (if provided)
    // TODO(Phase F): Insert challenge into D1 via ChallengeRepository.create

    const challenge = {
      id: crypto.randomUUID(),
      creatorId: user.userId,
      targetId: body.targetId ?? null,
      gameId: body.gameId,
      targetScore: body.targetScore ?? null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    return c.json({ challenge }, 201)
  }
)

// GET / — List challenges for current user
app.get('/', requireAuth, async (c) => {
  const status = c.req.query('status')

  const pageStr = c.req.query('page')
  const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : 1
  const limitStr = c.req.query('limit')
  const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr, 10) || 20)) : 20

  // TODO(Phase F): Fetch challenges from D1 via ChallengeRepository.findByCreator
  // TODO(Phase F): Also fetch challenges where user is the target
  // TODO(Phase F): Filter by status if provided

  return c.json({
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
  })
})

// POST /:id/accept — Accept a challenge
app.post('/:id/accept', requireAuth, async (c) => {
  const user = c.get('user')!
  const challengeId = c.req.param('id')

  // TODO(Phase F): Fetch challenge from D1 via ChallengeRepository.findById
  // TODO(Phase F): Verify user is the target of the challenge
  // TODO(Phase F): Update challenge status to 'accepted' via ChallengeRepository.updateStatus

  return c.json(
    {
      error: {
        code: 'NOT_FOUND' as const,
        message: `Challenge '${challengeId}' not found`,
        requestId: c.get('requestId') ?? '',
      },
    },
    404
  )
})

export default app
