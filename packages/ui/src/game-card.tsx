// @brainverse/ui — GameCard component.
//
// Card representing a single game in the game hub. Renders the game's icon,
// name, description and a "Play" button. The accent color is derived from
// the game's cognitive dimension via the `--dim-color` CSS variable.

import { cva, type VariantProps } from 'class-variance-authority';
import { Play } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

import type { GameDimension } from '@brainverse/shared';

import { cn } from './lib/cn.js';
import {
  DIMENSION_COLORS,
  DIMENSION_LABEL_KEYS,
} from './lib/dimension-colors.js';

/**
 * View-model for a game passed to GameCard. Decoupled from the persistence
 * `Game` model so the card can be used in marketing/preview contexts where
 * only display fields are known.
 */
export interface GameCardGame {
  slug: string;
  name: string;
  dimension: GameDimension;
  description: string;
  /** Rendered icon node (typically a lucide-react element). */
  icon: ReactNode;
}

export interface GameCardProps {
  game: GameCardGame;
  /** Called when the user clicks the Play button. */
  onPlay: (slug: string) => void;
  /** Optional aria-label override for the Play button. */
  playLabel?: string;
  className?: string;
}

/**
 * Card surface variant. `compact` shrinks the card for use in carousels /
 * sidebars. The dimension accent is always applied via the `--dim-color` CSS
 * variable set on the root element.
 */
const cardVariants = cva(
  [
    'group relative flex flex-col gap-3 rounded-2xl border border-border',
    'bg-surface p-5 text-left shadow-sm transition-all',
    'hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md',
  ].join(' '),
  {
    variants: {
      compact: {
        true: 'p-3 gap-2',
        false: '',
      },
    },
    defaultVariants: { compact: false },
  },
);

type CardVariants = VariantProps<typeof cardVariants>;

/** Build the root inline style: dimension accent + left border color. */
function rootStyle(dimension: GameDimension): CSSProperties {
  const color = DIMENSION_COLORS[dimension];
  return {
    ['--dim-color']: color,
    borderLeftColor: color,
    borderWidth: '1px',
    borderLeftWidth: '4px',
  } as CSSProperties;
}

/** Tinted background style for the icon container (10% accent color). */
function iconWrapperStyle(dimension: GameDimension): CSSProperties {
  return {
    backgroundColor: `${DIMENSION_COLORS[dimension]}1a`,
    color: DIMENSION_COLORS[dimension],
  } as CSSProperties;
}

/** Solid background style for the Play button. */
function playButtonStyle(dimension: GameDimension): CSSProperties {
  return {
    backgroundColor: DIMENSION_COLORS[dimension],
  } as CSSProperties;
}

/**
 * A game card. Click the Play button to trigger `onPlay(slug)`. The accent
 * color is derived from `game.dimension`.
 */
export function GameCard({
  game,
  onPlay,
  playLabel,
  className,
  compact,
}: GameCardProps & CardVariants): ReactNode {
  const label = playLabel ?? `Play ${game.name}`;
  return (
    <article
      className={cn(cardVariants({ compact }), className)}
      style={rootStyle(game.dimension)}
      aria-label={game.name}
      data-dimension={game.dimension}
      data-game-slug={game.slug}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={iconWrapperStyle(game.dimension)}
          aria-hidden="true"
        >
          {game.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-foreground">
            {game.name}
          </h3>
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: DIMENSION_COLORS[game.dimension] }}
            data-testid="game-card-dimension"
          >
            <DimensionLabel dimension={game.dimension} />
          </p>
        </div>
      </div>
      {!compact ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {game.description}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => onPlay(game.slug)}
        aria-label={label}
        style={playButtonStyle(game.dimension)}
        className={cn(
          'mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg',
          'px-3 py-2 text-sm font-medium text-white transition-all',
          'hover:brightness-110 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-offset-2',
        )}
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        <span>{label}</span>
      </button>
    </article>
  );
}

/**
 * Inline dimension label. Renders the raw dimension id as fallback text and
 * exposes the i18n key via `data-locale-key` so the host app's i18n layer can
 * swap the text at runtime.
 */
function DimensionLabel({ dimension }: { dimension: GameDimension }): ReactNode {
  return (
    <span data-locale-key={DIMENSION_LABEL_KEYS[dimension]}>{dimension}</span>
  );
}
