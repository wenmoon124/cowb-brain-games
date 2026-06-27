// @brainverse/ui — barrel entry. Re-exports all shared components.

export { GameCard } from './game-card.js';
export type { GameCardGame, GameCardProps } from './game-card.js';

export { StatCard } from './stat-card.js';
export type { StatCardProps, StatTrend } from './stat-card.js';

export { LifeBar } from './life-bar.js';
export type { LifeBarProps } from './life-bar.js';

export { DimensionBadge } from './dimension-badge.js';
export type { DimensionBadgeProps } from './dimension-badge.js';

// Exposed so consumers can compose dimension-colored elements consistently
// with the built-in components.
export { cn } from './lib/cn.js';
export {
  DIMENSION_COLORS,
  DIMENSION_LABEL_KEYS,
} from './lib/dimension-colors.js';
