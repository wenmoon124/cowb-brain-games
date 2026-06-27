// @brainverse/ui — LifeBar component.
//
// Displays the player's remaining lives as a row of heart icons. Used by
// game UIs that track lives (e.g. Visual Search, Stroop Challenge).

import { Heart } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from './lib/cn.js';

export interface LifeBarProps {
  /** Current number of lives (clamped to [0, maxLives]). */
  lives: number;
  /** Maximum number of life slots. Defaults to 3. */
  maxLives?: number;
  /** Accessible label template; `{lives}` and `{max}` are interpolated. */
  labelTemplate?: string;
  className?: string;
}

/**
 * A heart-based life counter. Filled hearts represent remaining lives; empty
 * (outlined) hearts represent lost lives. The whole bar is annotated with
 * an accessible label so screen readers announce "2 of 3 lives remaining".
 */
export function LifeBar({
  lives,
  maxLives = 3,
  labelTemplate = '{lives} of {max} lives remaining',
  className,
}: LifeBarProps): ReactNode {
  const clampedLives = Math.max(0, Math.min(lives, maxLives));
  const slots = Array.from({ length: maxLives }, (_, i) => i);

  const ariaLabel = labelTemplate
    .replace('{lives}', String(clampedLives))
    .replace('{max}', String(maxLives));

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      data-lives={clampedLives}
      data-max-lives={maxLives}
    >
      {slots.map((i) => {
        const filled = i < clampedLives;
        return (
          <Heart
            key={i}
            className={cn(
              'h-5 w-5 transition-colors',
              filled
                ? 'fill-rose-500 text-rose-500'
                : 'fill-transparent text-muted-foreground',
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
