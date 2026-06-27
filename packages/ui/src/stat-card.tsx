// @brainverse/ui — StatCard component.
//
// Displays a single labeled metric (e.g. "Brain Score: 742") with an optional
// icon and trend indicator. Used in the dashboard and game result screens.

import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from './lib/cn.js';

/**
 * Trend descriptor. `direction` controls the icon and color; `value` is the
 * signed delta rendered next to the icon (e.g. `+12%`); `label` is an
 * optional accessible description (e.g. "vs. last week").
 */
export interface StatTrend {
  direction: 'up' | 'down' | 'neutral';
  value: number;
  label?: string;
}

export interface StatCardProps {
  label: string;
  /** Numeric or stringified value to display prominently. */
  value: string | number;
  /** Optional icon node rendered to the left of the value. */
  icon?: ReactNode;
  /** Optional trend indicator rendered below the value. */
  trend?: StatTrend;
  /** Optional unit suffix appended to the value (e.g. "%", "ms"). */
  unit?: string;
  className?: string;
}

const trendConfig: Record<
  StatTrend['direction'],
  { icon: typeof TrendingUp; className: string; sign: string }
> = {
  up: { icon: TrendingUp, className: 'text-emerald-500', sign: '+' },
  down: { icon: TrendingDown, className: 'text-rose-500', sign: '' },
  neutral: { icon: Minus, className: 'text-muted-foreground', sign: '' },
};

/**
 * A compact stat card. The value is the visual anchor; the icon and trend are
 * secondary. When `trend` is omitted the card renders without the trend row.
 */
export function StatCard({
  label,
  value,
  icon,
  trend,
  unit,
  className,
}: StatCardProps): ReactNode {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-border bg-surface p-4',
        'shadow-sm',
        className,
      )}
      role="group"
      aria-label={label}
    >
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {icon ? (
          <span className="text-foreground" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums text-foreground">
          {value}
        </span>
        {unit ? (
          <span className="text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
      {trend ? <TrendRow trend={trend} /> : null}
    </div>
  );
}

function TrendRow({ trend }: { trend: StatTrend }): ReactNode {
  const config = trendConfig[trend.direction];
  const Icon = config.icon;
  const trendText = `${config.sign}${trend.value}%`;
  return (
    <div
      className={cn('flex items-center gap-1 text-xs font-medium', config.className)}
      aria-label={
        trend.label ? `${trendText} ${trend.label}` : trendText
      }
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="tabular-nums">{trendText}</span>
      {trend.label ? (
        <span className="text-muted-foreground">{trend.label}</span>
      ) : null}
    </div>
  );
}
