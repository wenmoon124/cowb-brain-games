import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { requireAuth } from '../middleware/auth'

const app = new Hono<AppEnv>()

// ============ Routes ============

// GET /achievements — Get user's unlocked achievements
app.get('/achievements', requireAuth, async (c) => {
  // TODO(Phase F): Fetch achievements from D1 via AchievementRepository.findByUser

  return c.json({ data: [] })
})

// GET /streak — Get user's streak information
app.get('/streak', requireAuth, async (c) => {
  // TODO(Phase F): Fetch streak from D1 via StreakRepository.findByUser

  return c.json({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  })
})

// GET /pet — Get user's brain pet
app.get('/pet', requireAuth, async (c) => {
  // TODO(Phase F): Fetch brain pet from D1 via BrainPetRepository.findByUser

  return c.json({ pet: null })
})

export default app
