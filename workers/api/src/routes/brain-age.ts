import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppEnv } from '../types'
import { requireAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

// ============ Schemas ============

const calculateSchema = z.object({
  dimensionScores: z.object({
    memory: z.number().min(0).max(100),
    attention: z.number().min(0).max(100),
    reaction: z.number().min(0).max(100),
    executive: z.number().min(0).max(100),
    relaxation: z.number().min(0).max(100),
  }),
})

// ============ Routes ============

// POST /calculate — Calculate brain age from dimension scores
app.post(
  '/calculate',
  requireAuth,
  zValidator('json', calculateSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR' as const,
            message: 'Invalid dimension scores',
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

    // TODO(Phase F): Calculate brain age using protected Brain Age Formula
    //   (packages/brain-engine) — PROTECTED SYSTEM
    // TODO(Phase F): Store result in D1 via BrainAgeRepository.create
    // TODO(Phase F): Update KV normative comparison cache

    const brainAge = 25 // TODO: replace with actual Brain Age Formula calculation

    const result = {
      id: crypto.randomUUID(),
      userId: user.userId,
      brainAge,
      dimensionScores: body.dimensionScores,
      testDate: new Date().toISOString(),
    }

    return c.json({ result }, 201)
  }
)

// GET /history — Get user's brain age test history
app.get('/history', requireAuth, async (c) => {
  const pageStr = c.req.query('page')
  const page = pageStr ? Math.max(1, parseInt(pageStr, 10) || 1) : 1
  const limitStr = c.req.query('limit')
  const limit = limitStr ? Math.min(50, Math.max(1, parseInt(limitStr, 10) || 20)) : 20

  // TODO(Phase F): Fetch history from D1 via BrainAgeRepository.findByUser

  return c.json({
    data: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
  })
})

export default app
