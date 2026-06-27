// @brainverse/core — Brain Pet companion model.

import type { UserId } from '@brainverse/shared';

/**
 * Pet life-cycle stages. Pets progress egg → baby → child → adult as they
 * accumulate XP from training consistency and achievement unlocks.
 *
 * Modeled as a const object so it is tree-shakable and usable as both a type
 * (via `PetStage`) and a runtime value map (via `PetStage.Egg` etc.).
 */
export const PetStage = {
  Egg: 'egg',
  Baby: 'baby',
  Child: 'child',
  Adult: 'adult',
} as const;

export type PetStage = (typeof PetStage)[keyof typeof PetStage];

/**
 * Ordered evolution stages, lowest to highest. Used by `evolvePet` in the
 * growth-engine to determine the next stage.
 */
export const PET_STAGE_ORDER: readonly PetStage[] = [
  PetStage.Egg,
  PetStage.Baby,
  PetStage.Child,
  PetStage.Adult,
] as const;

/**
 * A user's brain pet companion. Mirrors the `brain_pets` D1 table. `petType`
 * is a stable identifier (e.g. `'fox'`, `'owl'`) chosen at first launch.
 */
export interface BrainPet {
  id: string;
  userId: UserId;
  petType: string;
  petName: string;
  stage: PetStage;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}
