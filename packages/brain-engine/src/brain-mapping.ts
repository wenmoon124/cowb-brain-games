// PROTECTED SYSTEM — Do not modify without explicit approval
//
// @brainverse/brain-engine — Brain Mapping Formula.
//
// Transforms raw per-dimension scores into the radar-chart dataset consumed by
// the Brain Age result page and the dashboard widget.

import type { GameDimension } from '@brainverse/shared';
import type { DimensionScores } from './brain-age.js';

/**
 * A single axis on the brain radar chart. `dimension` is the axis identity,
 * `labelKey` is the i18n key for the localized axis label, `value` is the
 * normalized 0–100 score, `percentile` is the rank within the normative
 * population (0–100).
 */
export interface BrainDimensionAxis {
  dimension: GameDimension;
  labelKey: string;
  value: number;
  percentile: number;
}

/**
 * Radar-chart dataset returned by {@link mapBrainDimensions}. The charting
 * library (recharts/visx) consumes `axes` directly; `overall` is the
 * geometric mean used for the center label.
 */
export interface BrainMappingResult {
  axes: BrainDimensionAxis[];
  overall: number;
}

const DIMENSION_LABEL_KEYS: Record<GameDimension, string> = {
  memory: 'dimensions.memory',
  attention: 'dimensions.attention',
  reaction: 'dimensions.reaction',
  executive: 'dimensions.executive',
  relaxation: 'dimensions.relaxation',
};

/**
 * Map per-dimension scores to radar-chart data.
 *
 * TODO(brain-engine): Replace placeholder percentile (echoes `value`) with the
 * real normative percentile lookup. The signature MUST NOT change without
 * Lead Architect sign-off.
 */
export function mapBrainDimensions(
  scores: DimensionScores,
): BrainMappingResult {
  const axes: BrainDimensionAxis[] = (
    Object.keys(scores) as GameDimension[]
  ).map((dimension) => {
    const value = scores[dimension];
    return {
      dimension,
      labelKey: DIMENSION_LABEL_KEYS[dimension],
      value,
      // TODO: real percentile from normative distribution.
      percentile: value,
    };
  });

  const overall =
    axes.length > 0
      ? Math.round(
          axes.reduce((acc, a) => acc + a.value, 0) / axes.length,
        )
      : 0;

  return { axes, overall };
}
