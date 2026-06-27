import type { Locale } from '@/i18n/config'

export type GameDimension =
  | 'memory'
  | 'attention'
  | 'reaction'
  | 'executive'
  | 'relaxation'

export interface GameMeta {
  slug: string
  dimension: GameDimension
  titleKey: string
  descriptionKey: string
}

export const GAMES: readonly GameMeta[] = [
  {
    slug: 'visual-search',
    dimension: 'attention',
    titleKey: 'games.visualSearch.title',
    descriptionKey: 'games.visualSearch.description',
  },
  {
    slug: 'digit-span',
    dimension: 'memory',
    titleKey: 'games.digitSpan.title',
    descriptionKey: 'games.digitSpan.description',
  },
  {
    slug: 'reaction-training',
    dimension: 'reaction',
    titleKey: 'games.reactionTraining.title',
    descriptionKey: 'games.reactionTraining.description',
  },
  {
    slug: 'stroop-challenge',
    dimension: 'executive',
    titleKey: 'games.stroopChallenge.title',
    descriptionKey: 'games.stroopChallenge.description',
  },
  {
    slug: 'spatial-memory',
    dimension: 'memory',
    titleKey: 'games.spatialMemory.title',
    descriptionKey: 'games.spatialMemory.description',
  },
  {
    slug: 'breathing-flow',
    dimension: 'relaxation',
    titleKey: 'games.breathingFlow.title',
    descriptionKey: 'games.breathingFlow.description',
  },
] as const

export const GAME_SLUGS: readonly string[] = GAMES.map((g) => g.slug)

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug)
}

export function gameHref(locale: Locale, slug: string): string {
  return `/${locale}/games/${slug}`
}
