'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { GameDimension } from '@/lib/games'

interface GameTimerProps {
  /** Remaining time in milliseconds */
  timeLeft: number
  /** Total time in milliseconds */
  totalTime: number
  /** Dimension for color theming */
  dimension?: GameDimension | 'default'
  /** Show numeric countdown (e.g. "3s") */
  showNumber?: boolean
  /** Current round (e.g. "Round 5/20") */
  roundLabel?: string
  className?: string
}

/**
 * Unified game countdown timer bar.
 *
 * Features:
 * - Height h-2.5 (10px) — visible but not intrusive
 * - Numeric countdown display
 * - Urgency feedback: remaining < 30% turns red + pulse animation
 * - Dimension-colored fill
 */
export function GameTimer({
  timeLeft,
  totalTime,
  dimension = 'default',
  showNumber = true,
  roundLabel,
  className,
}: GameTimerProps) {
  const percent = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const seconds = Math.ceil(timeLeft / 1000)
  const isUrgent = percent < 30

  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      {(showNumber || roundLabel) && (
        <div className="flex items-center justify-between text-xs">
          {roundLabel && (
            <span className="font-medium text-text-secondary">{roundLabel}</span>
          )}
          {showNumber && (
            <span
              className={cn(
                'font-bold tabular-nums',
                isUrgent ? 'text-error animate-pulse' : 'text-text-secondary'
              )}
            >
              {seconds}s
            </span>
          )}
        </div>
      )}
      <Progress
        value={percent}
        dimension={isUrgent ? 'error' : dimension}
        className={cn('h-2.5', isUrgent && 'animate-pulse')}
      />
    </div>
  )
}
