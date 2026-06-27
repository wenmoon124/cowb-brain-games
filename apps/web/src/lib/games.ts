import type { Locale } from '@/i18n/config'

export type GameDimension =
  | 'memory'
  | 'attention'
  | 'reaction'
  | 'executive'
  | 'relaxation'

export type GameDifficulty = 'easy' | 'medium' | 'hard'

export interface GameMeta {
  slug: string
  dimension: GameDimension
  difficulty: GameDifficulty
  titleKey: string
  descriptionKey: string
  /** Estimated session duration in seconds */
  durationSec: number
  /** Lucide icon name for the game */
  icon: string
}

/**
 * All 21 brain training games across 5 cognitive dimensions.
 *
 * Memory (6): digit-span, spatial-memory, memory-matrix, backward-digit-span,
 *             spatial-sequence, pattern-match
 * Attention (5): visual-search, attention-span, eagle-eye, distraction-filter,
 *                 split-focus
 * Reaction (2): reaction-training, click-horizon
 * Executive (5): stroop-challenge, tower-of-logic, change-flex, path-finder,
 *                 matrix-reasoning
 * Relaxation (3): breathing-flow, audio-alpha-diver, stress-sandbox
 */
export const GAMES: readonly GameMeta[] = [
  // ============ Memory (6) ============
  {
    slug: 'digit-span',
    dimension: 'memory',
    difficulty: 'easy',
    titleKey: 'games.digitSpan.title',
    descriptionKey: 'games.digitSpan.description',
    durationSec: 120,
    icon: 'Hash',
  },
  {
    slug: 'spatial-memory',
    dimension: 'memory',
    difficulty: 'medium',
    titleKey: 'games.spatialMemory.title',
    descriptionKey: 'games.spatialMemory.description',
    durationSec: 180,
    icon: 'Grid3x3',
  },
  {
    slug: 'memory-matrix',
    dimension: 'memory',
    difficulty: 'medium',
    titleKey: 'games.memoryMatrix.title',
    descriptionKey: 'games.memoryMatrix.description',
    durationSec: 180,
    icon: 'LayoutGrid',
  },
  {
    slug: 'backward-digit-span',
    dimension: 'memory',
    difficulty: 'hard',
    titleKey: 'games.backwardDigitSpan.title',
    descriptionKey: 'games.backwardDigitSpan.description',
    durationSec: 150,
    icon: 'ReverseDirection',
  },
  {
    slug: 'spatial-sequence',
    dimension: 'memory',
    difficulty: 'hard',
    titleKey: 'games.spatialSequence.title',
    descriptionKey: 'games.spatialSequence.description',
    durationSec: 200,
    icon: 'ListOrdered',
  },
  {
    slug: 'pattern-match',
    dimension: 'memory',
    difficulty: 'easy',
    titleKey: 'games.patternMatch.title',
    descriptionKey: 'games.patternMatch.description',
    durationSec: 120,
    icon: 'Shapes',
  },
  // ============ Attention (5) ============
  {
    slug: 'visual-search',
    dimension: 'attention',
    difficulty: 'easy',
    titleKey: 'games.visualSearch.title',
    descriptionKey: 'games.visualSearch.description',
    durationSec: 120,
    icon: 'Search',
  },
  {
    slug: 'attention-span',
    dimension: 'attention',
    difficulty: 'easy',
    titleKey: 'games.attentionSpan.title',
    descriptionKey: 'games.attentionSpan.description',
    durationSec: 180,
    icon: 'Timer',
  },
  {
    slug: 'eagle-eye',
    dimension: 'attention',
    difficulty: 'hard',
    titleKey: 'games.eagleEye.title',
    descriptionKey: 'games.eagleEye.description',
    durationSec: 150,
    icon: 'Eye',
  },
  {
    slug: 'distraction-filter',
    dimension: 'attention',
    difficulty: 'medium',
    titleKey: 'games.distractionFilter.title',
    descriptionKey: 'games.distractionFilter.description',
    durationSec: 150,
    icon: 'Filter',
  },
  {
    slug: 'split-focus',
    dimension: 'attention',
    difficulty: 'hard',
    titleKey: 'games.splitFocus.title',
    descriptionKey: 'games.splitFocus.description',
    durationSec: 180,
    icon: 'Columns2',
  },
  // ============ Reaction (3) ============
  {
    slug: 'reaction-training',
    dimension: 'reaction',
    difficulty: 'easy',
    titleKey: 'games.reactionTraining.title',
    descriptionKey: 'games.reactionTraining.description',
    durationSec: 120,
    icon: 'Zap',
  },
  {
    slug: 'stroop-challenge',
    dimension: 'executive',
    difficulty: 'hard',
    titleKey: 'games.stroopChallenge.title',
    descriptionKey: 'games.stroopChallenge.description',
    durationSec: 180,
    icon: 'Palette',
  },
  {
    slug: 'click-horizon',
    dimension: 'reaction',
    difficulty: 'medium',
    titleKey: 'games.clickHorizon.title',
    descriptionKey: 'games.clickHorizon.description',
    durationSec: 120,
    icon: 'Target',
  },
  // ============ Executive (5) ============
  {
    slug: 'tower-of-logic',
    dimension: 'executive',
    difficulty: 'hard',
    titleKey: 'games.towerOfLogic.title',
    descriptionKey: 'games.towerOfLogic.description',
    durationSec: 300,
    icon: 'Building2',
  },
  {
    slug: 'change-flex',
    dimension: 'executive',
    difficulty: 'hard',
    titleKey: 'games.changeFlex.title',
    descriptionKey: 'games.changeFlex.description',
    durationSec: 180,
    icon: 'Shuffle',
  },
  {
    slug: 'path-finder',
    dimension: 'executive',
    difficulty: 'medium',
    titleKey: 'games.pathFinder.title',
    descriptionKey: 'games.pathFinder.description',
    durationSec: 240,
    icon: 'Route',
  },
  {
    slug: 'matrix-reasoning',
    dimension: 'executive',
    difficulty: 'hard',
    titleKey: 'games.matrixReasoning.title',
    descriptionKey: 'games.matrixReasoning.description',
    durationSec: 240,
    icon: 'Grid2x2',
  },
  // ============ Relaxation (3) ============
  {
    slug: 'breathing-flow',
    dimension: 'relaxation',
    difficulty: 'easy',
    titleKey: 'games.breathingFlow.title',
    descriptionKey: 'games.breathingFlow.description',
    durationSec: 300,
    icon: 'Wind',
  },
  {
    slug: 'audio-alpha-diver',
    dimension: 'relaxation',
    difficulty: 'easy',
    titleKey: 'games.audioAlphaDiver.title',
    descriptionKey: 'games.audioAlphaDiver.description',
    durationSec: 300,
    icon: 'Waves',
  },
  {
    slug: 'stress-sandbox',
    dimension: 'relaxation',
    difficulty: 'easy',
    titleKey: 'games.stressSandbox.title',
    descriptionKey: 'games.stressSandbox.description',
    durationSec: 180,
    icon: 'HeartHandshake',
  },
] as const

export const GAME_SLUGS: readonly string[] = GAMES.map((g) => g.slug)

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug)
}

export function getGamesByDimension(dimension: GameDimension): GameMeta[] {
  return GAMES.filter((g) => g.dimension === dimension)
}

export function gameHref(locale: Locale, slug: string): string {
  return `/${locale}/games/${slug}`
}

/** Dimension display info */
export const DIMENSION_INFO: Record<
  GameDimension,
  { color: string; icon: string }
> = {
  memory: { color: '#EC4899', icon: 'Brain' },
  attention: { color: '#F97316', icon: 'Focus' },
  reaction: { color: '#FBBF24', icon: 'Zap' },
  executive: { color: '#F472B6', icon: 'Layers' },
  relaxation: { color: '#FB7185', icon: 'Wind' },
}
