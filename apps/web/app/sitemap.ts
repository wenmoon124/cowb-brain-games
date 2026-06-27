import type { MetadataRoute } from 'next'

const BASE_URL = 'https://cowb.cc'
const LOCALES = ['en', 'zh', 'ja'] as const
const LAST_MODIFIED = new Date('2026-06-27T00:00:00.000Z')

/**
 * Static core pages (excluding /articles/* which are seeded from D1).
 * Article URLs will be appended after D1 re-seeding in a follow-up task.
 */
const CORE_PATHS = [
  '',
  '/games',
  '/games/visual-search',
  '/games/digit-span',
  '/games/reaction-training',
  '/games/stroop-challenge',
  '/games/spatial-memory',
  '/games/breathing-flow',
  '/brain-age-assessment',
  '/dashboard',
  '/profile',
  '/articles',
  '/articles/brain-age',
  '/articles/memory',
  '/articles/attention',
  '/articles/focus',
  '/articles/relaxation',
  '/about',
  '/contact',
  '/leaderboard',
  '/achievements',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const path of CORE_PATHS) {
      const url = `${BASE_URL}/${locale}${path}`
      const alternates: Record<string, string> = {}
      for (const altLocale of LOCALES) {
        alternates[altLocale] = `${BASE_URL}/${altLocale}${path}`
      }
      entries.push({
        url,
        lastModified: LAST_MODIFIED,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : path.startsWith('/games/') ? 0.9 : 0.7,
        alternates: {
          languages: alternates,
        },
      })
    }
  }

  return entries
}
