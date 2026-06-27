// @brainverse/growth-engine — Brain Pet companion logic.
//
// Drives pet XP accrual and stage evolution. Decoupled from brain-engine so
// growth-engine has no inbound dependency on the protected system; the caller
// passes already-computed growth inputs in.

import type { BrainPet, PetStage } from '@brainverse/core';
import { PET_STAGE_ORDER } from '@brainverse/core';

/**
 * A selectable pet type. `id` is the stable identifier persisted on
 * {@link BrainPet}.`petType`; `nameKey` / `descriptionKey` are i18n keys.
 */
export interface PetTypeDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  /** lucide-react icon name shown in the pet picker. */
  icon: string;
}

/**
 * Catalog of selectable pet types. Extend freely; do not rename existing ids.
 */
export const petTypes: readonly PetTypeDefinition[] = [
  {
    id: 'fox',
    nameKey: 'pets.fox.name',
    descriptionKey: 'pets.fox.description',
    icon: 'Fox',
  },
  {
    id: 'owl',
    nameKey: 'pets.owl.name',
    descriptionKey: 'pets.owl.description',
    icon: 'Bird',
  },
  {
    id: 'cat',
    nameKey: 'pets.cat.name',
    descriptionKey: 'pets.cat.description',
    icon: 'Cat',
  },
  {
    id: 'rabbit',
    nameKey: 'pets.rabbit.name',
    descriptionKey: 'pets.rabbit.description',
    icon: 'Rabbit',
  },
] as const;

/**
 * XP thresholds for each evolution stage transition. A pet with XP >= the
 * threshold for a stage belongs to that stage or higher.
 *
 * Index aligns with {@link PET_STAGE_ORDER}: thresholds[0] is the XP needed
 * to leave the egg stage, etc.
 */
export const evolutionStages: readonly {
  stage: PetStage;
  minXp: number;
}[] = [
  { stage: 'egg', minXp: 0 },
  { stage: 'baby', minXp: 100 },
  { stage: 'child', minXp: 400 },
  { stage: 'adult', minXp: 1000 },
] as const;

/**
 * Inputs to {@link calculatePetGrowth}. The caller computes these from the
 * user's recent activity and passes them in — growth-engine does not call
 * brain-engine directly (keeps the dependency graph one-way).
 */
export interface PetGrowthInput {
  /** 0–1 fraction of expected sessions completed. */
  trainingConsistency: number;
  /** Signed delta of average score vs. the previous window. */
  scoreGrowth: number;
  /** Number of achievements unlocked in the window. */
  achievements: number;
}

/**
 * Result of a pet growth calculation. `xpGained` is added to the pet's XP;
 * `reason` is a short machine-readable tag for the activity feed.
 */
export interface PetGrowthResult {
  xpGained: number;
  reason: string;
}

/**
 * Calculate how much XP the user's pet gains for a given activity window.
 *
 * Weighting: consistency is the dominant signal (training habit > spike
 * performance), with smaller bonuses for score growth and achievement unlocks.
 */
export function calculatePetGrowth(
  trainingConsistency: number,
  scoreGrowth: number,
  achievements: number,
): PetGrowthResult {
  const consistency = Math.max(0, Math.min(1, trainingConsistency));
  const consistencyXp = Math.round(consistency * 50);
  const scoreXp = Math.max(0, Math.round(scoreGrowth * 0.2));
  const achievementXp = achievements * 20;
  const xpGained = consistencyXp + scoreXp + achievementXp;

  let reason = 'training';
  if (achievementXp > 0) {
    reason = 'achievement';
  } else if (scoreXp > consistencyXp) {
    reason = 'score-growth';
  }

  return { xpGained, reason };
}

/**
 * Evolve a pet to the appropriate stage for its XP total. Returns the new
 * stage (which may equal `currentStage` if no threshold was crossed) plus the
 * pet's level (1-based index within the stage's XP bracket).
 */
export function evolvePet(
  currentStage: PetStage,
  xp: number,
): { stage: PetStage; level: number } {
  let stage = evolutionStages[0]!.stage;
  for (const s of evolutionStages) {
    if (xp >= s.minXp) {
      stage = s.stage;
    }
  }

  // Level within the current stage: 1 + how many full 100-XP brackets the
  // pet has accumulated inside this stage.
  const stageIdx = PET_STAGE_ORDER.indexOf(stage);
  const stageFloorXp = evolutionStages[stageIdx]!.minXp;
  const nextStage = evolutionStages[stageIdx + 1];
  const stageCeilingXp = nextStage ? nextStage.minXp : Number.POSITIVE_INFINITY;
  const xpInStage = Math.max(0, xp - stageFloorXp);
  const stageSpan = Math.max(1, stageCeilingXp - stageFloorXp);
  const level = 1 + Math.floor(xpInStage / (stageSpan / 4));

  void currentStage;
  return { stage, level };
}

/**
 * Apply a growth result to a pet, returning a new (immutable) pet record.
 * Does not mutate the input.
 */
export function applyPetGrowth(
  pet: BrainPet,
  growth: PetGrowthResult,
): BrainPet {
  const newXp = pet.xp + growth.xpGained;
  const { stage, level } = evolvePet(pet.stage, newXp);
  return {
    ...pet,
    xp: newXp,
    stage,
    level,
    updatedAt: new Date().toISOString(),
  };
}
