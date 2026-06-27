// PROTECTED SYSTEM — Do not modify without explicit approval
//
// @brainverse/brain-engine — Brain Age Formula.
//
// Computes a single "Brain Age" number from per-dimension scores and optional
// demographic context. Lower numbers indicate younger-performing cognition.
//
// The actual formula is intentionally a placeholder — the production algorithm
// is calibrated against a normative dataset and lands in a later task. The
// signature and types here are stable and consumed by both the frontend
// (display) and the Workers API (server-side re-validation).

import type { GameDimension } from '@brainverse/shared';

/**
 * Per-dimension raw scores (0–100 normalized) used as input to the Brain Age
 * calculation. All five dimensions are required so the formula always has full
 * coverage of the cognitive profile.
 */
export type DimensionScores = Record<GameDimension, number>;

/**
 * Optional demographic context. `chronologicalAge` lets the formula compute a
 * relative (rather than absolute) brain age. Fields are optional because some
 * calls (e.g. anonymous previews) will not have demographics.
 */
export interface Demographics {
  chronologicalAge?: number;
  gender?: 'male' | 'female' | 'other';
  educationYears?: number;
}

/**
 * Result of a Brain Age calculation. `brainAge` is the headline number;
 * `dimensionScores` is echoed back for the radar chart; `confidence` is a
 * 0–1 measure of how complete the input was (fewer demographics → lower
 * confidence).
 */
export interface BrainAgeResult {
  brainAge: number;
  dimensionScores: DimensionScores;
  confidence: number;
}

/**
 * Calculate Brain Age from dimension scores and demographics.
 *
 * TODO(brain-engine): Replace placeholder with the calibrated normative
 * formula. The current implementation returns the chronological age (or a
 * default of 30) so the rest of the system can wire up against a real return
 * value. The signature MUST NOT change without Lead Architect sign-off.
 */
export function calculateBrainAge(
  dimensionScores: DimensionScores,
  demographics?: Demographics,
): BrainAgeResult {
  // TODO: implement weighted regression against normative dataset.
  const defaultAge = 30;
  const brainAge = demographics?.chronologicalAge ?? defaultAge;
  const confidence = demographics ? 1 : 0.6;

  return {
    brainAge,
    dimensionScores,
    confidence,
  };
}
