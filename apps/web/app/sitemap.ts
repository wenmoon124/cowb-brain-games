import type { MetadataRoute } from 'next'

const BASE_URL = 'https://cowb.cc'
const LOCALES = ['en', 'zh', 'ja'] as const
const LAST_MODIFIED = new Date('2026-06-27T00:00:00.000Z')

/**
 * Sitemap entries — only includes routes that are actually generated.
 * Additional routes (games, articles, brain-age, etc.) will be appended
 * here as their page.tsx files are implemented.
 */
const CORE_PATHS = [''] as const

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
        changeFrequency: 'daily',
        priority: 1.0,
        alternates: {
          languages: alternates,
        },
      })
    }
  }

  return entries
}
