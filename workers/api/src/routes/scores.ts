import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppEnv } from '../types'
import { optionalAuth, requireAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

// ============ Schemas ============

const createScoreSchema = z.object({
  gameId: z.string().min(1),
  score: z.number().int().min(0),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  correctCount: z.number().int().min(0).optional(),
  wrongCount: z.number().int().min(0).optional(),
  avgReactionMs: z.number().int().min(0).optional(),
  roundsPlayed: z.number().int().min(1).optional(),
})

// ============ Routes ============

// POST / — Submit a new game score
app.post(
  '/',
  requireAuth,
  zValidator('json', createScoreSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR' as const,
            message: 'Invalid score data',
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

    // TODO(Phase F): Verify gameId exists via GameRepository.findBySlug
    // TODO(Phase F): Insert score into D1 via ScoreRepository.create
    // TODO(Phase F): Update leaderboard cache in KV CACHE namespace

    const score = {
      id: crypto.randomUUID(),
      userId: user.userId,
      gameId: body.gameId,
      score: body.score,
      difficulty: body.difficulty ?? 'medium',
      correctCount: body.correctCount ?? 0,
      wrongCount: body.wrongCount ?? 0,
      avgReactionMs: body.avgReactionMs ?? null,
      roundsPlayed: body.roundsPlayed ?? 1,
      playedAt: new Date().toISOString(),
    }

    return c.json({ score }, 201)
  }
)

// GET /my — Get current user's score history
app.get('/my', requireAuth, async (c) => {
  const gameId = c.req.query('gameId')

  const pageStr = c.req.query('page')
  const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : 1
  const limitStr = c.req.query('limit')
  const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr, 10) || 20)) : 20

  // TODO(Phase F): Fetch scores from D1 via ScoreRepository.findByUser
  // TODO(Phase F): Filter by gameId if provided

  return c.json({
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
  })
})

// GET /leaderboard — Get leaderboard
app.get('/leaderboard', optionalAuth, async (c) => {
  const gameId = c.req.query('gameId')
  const limitStr = c.req.query('limit')
  const limit = limitStr ? Math.min(100, Math.max(1, parseInt(limitStr, 10) || 50)) : 50

  // TODO(Phase F): Try fetching from KV CACHE (key: leaderboard:{gameId})
  // TODO(Phase F): Fallback to D1 via ScoreRepository.findLeaderboard
  // TODO(Phase F): Cache result in KV with 5 minute TTL

  return c.json({
    gameId: gameId ?? 'global',
    limit,
    entries: [],
  })
})

export default app
