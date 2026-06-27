/**
 * Repository layer barrel + factory.
 *
 * `createRepositories(db)` is the single entry point used by middleware to
 * build a fresh set of repositories per request (cheap — they hold only a
 * reference to the `Database` wrapper). Route handlers obtain them via
 * `c.get('repos')`.
 */

import { Database } from '../database'
import { UserRepository } from './user-repo'
import { SessionRepository } from './session-repo'
import { ScoreRepository } from './score-repo'
import { GameRepository } from './game-repo'
import { BrainAgeRepository } from './brain-age-repo'
import { AchievementRepository } from './achievement-repo'
import { StreakRepository } from './streak-repo'
import { BrainPetRepository } from './brain-pet-repo'
import { ChallengeRepository } from './challenge-repo'
import { ArticleRepository } from './article-repo'
import { FeatureFlagRepository } from './feature-flag-repo'

export {
  UserRepository,
  SessionRepository,
  ScoreRepository,
  GameRepository,
  BrainAgeRepository,
  AchievementRepository,
  StreakRepository,
  BrainPetRepository,
  ChallengeRepository,
  ArticleRepository,
  FeatureFlagRepository,
}

/** Bundle of every repository, keyed by table/group name. */
export interface Repositories {
  userRepository: UserRepository
  sessionRepository: SessionRepository
  scoreRepository: ScoreRepository
  gameRepository: GameRepository
  brainAgeRepository: BrainAgeRepository
  achievementRepository: AchievementRepository
  streakRepository: StreakRepository
  brainPetRepository: BrainPetRepository
  challengeRepository: ChallengeRepository
  articleRepository: ArticleRepository
  featureFlagRepository: FeatureFlagRepository
}

/**
 * Build a full set of repositories bound to the given `Database` wrapper.
 * Re-use across the lifetime of a request — each repository stores only the
 * `Database` reference, so this allocation is effectively free.
 */
export function createRepositories(db: Database): Repositories {
  return {
    userRepository: new UserRepository(db),
    sessionRepository: new SessionRepository(db),
    scoreRepository: new ScoreRepository(db),
    gameRepository: new GameRepository(db),
    brainAgeRepository: new BrainAgeRepository(db),
    achievementRepository: new AchievementRepository(db),
    streakRepository: new StreakRepository(db),
    brainPetRepository: new BrainPetRepository(db),
    challengeRepository: new ChallengeRepository(db),
    articleRepository: new ArticleRepository(db),
    featureFlagRepository: new FeatureFlagRepository(db),
  }
}
