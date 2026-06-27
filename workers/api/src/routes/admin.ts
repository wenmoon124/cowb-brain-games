import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppEnv } from '../types'
import { requireAdmin } from '../middleware/auth'

const app = new Hono<AppEnv>()

// ============ Schemas ============

const upsertFeatureFlagSchema = z.object({
  key: z.string().min(1).max(128),
  enabled: z.boolean(),
  label: z.string().min(1).max(256).optional(),
  description: z.string().max(1024).optional(),
})

// ============ Routes ============

// GET /feature-flags — List all feature flags
app.get('/feature-flags', requireAdmin, async (c) => {
  // TODO(Phase F): Fetch feature flags from D1 via FeatureFlagRepository.findAll
  // TODO(Phase F): Cache result in KV (key: feature_flags:all) with 60s TTL

  return c.json({ data: [] })
})

// PUT /feature-flags — Upsert a feature flag
app.put(
  '/feature-flags',
  requireAdmin,
  zValidator('json', upsertFeatureFlagSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'VALIDATION_ERROR' as const,
            message: 'Invalid feature flag data',
            requestId: c.get('requestId') ?? '',
          },
        },
        400
      )
    }
  }),
  async (c) => {
    const body = c.req.valid('json')

    // TODO(Phase F): Upsert feature flag in D1 via FeatureFlagRepository.upsert
    // TODO(Phase F): Invalidate KV cache (delete key: feature_flags:all)

    const flag = {
      id: crypto.randomUUID(),
      key: body.key,
      label: body.label ?? body.key,
      description: body.description ?? null,
      enabled: body.enabled,
      updatedAt: new Date().toISOString(),
    }

    return c.json({ flag })
  }
)

export default app
