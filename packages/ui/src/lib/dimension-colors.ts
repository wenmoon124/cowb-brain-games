// @brainverse/ui — dimension color tokens.
//
// Centralizes the per-dimension color mapping used by GameCard and
// DimensionBadge. The hex values mirror the `dim.*` palette in
// `globals.css` / `tailwind.config.ts` so the UI package stays in sync with
// the app's design tokens without depending on Tailwind config at type-check
// time.

import type { GameDimension } from '@brainverse/shared';

/** Per-dimension accent color (hex). Matches globals.css `--dim-*`. */
export const DIMENSION_COLORS: Record<GameDimension, string> = {
  memory: '#8B5CF6',
  attention: '#06B6D4',
  reaction: '#FFB14A',
  executive: '#10B981',
  relaxation: '#4A7CFF',
};

/** i18n key for each dimension's localized label. */
export const DIMENSION_LABEL_KEYS: Record<GameDimension, string> = {
  memory: 'dimensions.memory',
  attention: 'dimensions.attention',
  reaction: 'dimensions.reaction',
  executive: 'dimensions.executive',
  relaxation: 'dimensions.relaxation',
};
