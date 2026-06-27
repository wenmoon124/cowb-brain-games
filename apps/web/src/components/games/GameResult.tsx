'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RotateCcw, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GameDimension } from '@/lib/games'

/** Brain Identity Tier — 6 levels per PROJECT.md Formula 3 */
export type IdentityTier =
  | 'Novice'
  | 'Apprentice'
  | 'Adept'
  | 'Expert'
  | 'Master'
  | 'Luminary'

interface GameStat {
  label: string
  value: string | number
}

interface GameResultProps {
  /** Final score */
  score: number
  /** Accuracy 0-100 (%) */
  accuracy?: number
  /** Additional stats to display */
  stats?: GameStat[]
  /** Dimension for theming */
  dimension?: GameDimension
  /** Callback when user clicks "Play Again" */
  onRetry?: () => void
  /** Best score (if available) */
  bestScore?: number
  className?: string
}

/** Map score to Brain Identity Tier per PROJECT.md Formula 3 */
export function scoreToTier(score: number): IdentityTier {
  if (score >= 5000) return 'Luminary'
  if (score >= 3000) return 'Master'
  if (score >= 1800) return 'Expert'
  if (score >= 900) return 'Adept'
  if (score >= 300) return 'Apprentice'
  return 'Novice'
}

const TIER_COLORS: Record<IdentityTier, string> = {
  Novice: 'text-text-secondary',
  Apprentice: 'text-dim-attention-text',
  Adept: 'text-dim-reaction-text',
  Expert: 'text-dim-memory-text',
  Master: 'text-dim-executive-text',
  Luminary: 'text-dim-relaxation-text',
}

/**
 * Unified game result panel.
 *
 * Displays:
 * - Final score (large)
 * - Identity tier badge
 * - Accuracy + key stats grid
 * - Best score (if provided)
 * - Play Again button
 */
export function GameResult({
  score,
  accuracy,
  stats = [],
  dimension,
  onRetry,
  bestScore,
  className,
}: GameResultProps) {
  const tier = scoreToTier(score)
  const isNewBest = bestScore !== undefined && score > bestScore

  return (
    <Card className={cn('border-2 border-primary/20', className)}>
      <CardContent className="flex flex-col items-center gap-lg p-2xl text-center">
        {/* Trophy Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <Trophy className="h-8 w-8 text-primary" />
        </div>

        {/* Final Score */}
        <div className="flex flex-col items-center gap-xs">
          <span className="text-sm font-medium uppercase tracking-wider text-text-muted">
            Final Score
          </span>
          <span className="text-5xl font-bold tabular-nums text-text-primary">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Identity Tier */}
        <div className="flex flex-col items-center gap-xs">
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Rank
          </span>
          <span className={cn('text-xl font-bold', TIER_COLORS[tier])}>
            {tier}
          </span>
        </div>

        {/* New Best Badge */}
        {isNewBest && (
          <span className="rounded-full bg-accent/20 px-md py-xs text-sm font-semibold text-accent">
            ★ New Best!
          </span>
        )}

        {/* Stats Grid */}
        {(accuracy !== undefined || stats.length > 0) && (
          <div className="grid w-full grid-cols-2 gap-md sm:grid-cols-3">
            {accuracy !== undefined && (
              <div className="flex flex-col items-center rounded-md bg-background-secondary p-md">
                <span className="text-xs text-text-muted">Accuracy</span>
                <span className="text-lg font-bold text-text-primary">
                  {accuracy}%
                </span>
              </div>
            )}
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-md bg-background-secondary p-md"
              >
                <span className="text-xs text-text-muted">{stat.label}</span>
                <span className="text-lg font-bold text-text-primary">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Best Score */}
        {bestScore !== undefined && (
          <p className="text-sm text-text-secondary">
            Best: <span className="font-semibold">{bestScore.toLocaleString()}</span>
          </p>
        )}

        {/* Play Again */}
        {onRetry && (
          <Button variant="primary" size="lg" onClick={onRetry} className="mt-sm">
            <RotateCcw className="mr-xs h-4 w-4" />
            Play Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
