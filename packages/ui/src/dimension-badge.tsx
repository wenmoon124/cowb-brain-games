// @brainverse/ui — DimensionBadge component.
//
// Small pill-shaped badge that signals which cognitive dimension a game /
// article / stat belongs to, colored with the dimension's accent color.

import { cva, type VariantProps } from 'class-variance-authority';
import type { CSSProperties, ReactNode } from 'react';

import type { GameDimension } from '@brainverse/shared';

import { cn } from './lib/cn.js';
import {
  DIMENSION_COLORS,
  DIMENSION_LABEL_KEYS,
} from './lib/dimension-colors.js';

export interface DimensionBadgeProps {
  dimension: GameDimension;
  /** Optional override label; defaults to the dimension id (i18n-swappable). */
  label?: string;
  className?: string;
}

/**
 * Badge size + tone. `solid` uses the dimension color as background (white
 * text); `soft` uses a 15% tinted background with the dimension color as text.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide',
  {
    variants: {
      tone: {
        solid: 'text-white',
        soft: '',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
      },
    },
    defaultVariants: { tone: 'soft', size: 'md' },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

/** Inline style for the `solid` tone: dimension color as background. */
function solidStyle(dimension: GameDimension): CSSProperties {
  return { backgroundColor: DIMENSION_COLORS[dimension] } as CSSProperties;
}

/** Inline style for the `soft` tone: tinted background + colored text. */
function softStyle(dimension: GameDimension): CSSProperties {
  return {
    backgroundColor: `${DIMENSION_COLORS[dimension]}26`,
    color: DIMENSION_COLORS[dimension],
  } as CSSProperties;
}

/**
 * A dimension badge. The dimension's accent color is applied via inline style
 * so the badge renders correctly regardless of the host app's Tailwind config.
 * The label is exposed via `data-locale-key` for runtime i18n swapping.
 */
export function DimensionBadge({
  dimension,
  label,
  className,
  tone,
  size,
}: DimensionBadgeProps & BadgeVariants): ReactNode {
  const style = tone === 'solid' ? solidStyle(dimension) : softStyle(dimension);
  const text = label ?? dimension;
  return (
    <span
      className={cn(badgeVariants({ tone, size }), className)}
      style={style}
      data-dimension={dimension}
      data-locale-key={DIMENSION_LABEL_KEYS[dimension]}
    >
      {text}
    </span>
  );
}
