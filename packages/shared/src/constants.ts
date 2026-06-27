// @brainverse/shared — application-wide constants.
//
// Single source of truth for locales, dimensions, difficulties, API route
// paths, storage keys and cookie keys. Anything that needs to be consistent
// between the Next.js frontend and the Workers API lives here.

import type {
  Difficulty,
  GameDimension,
  Locale,
} from './types.js';

export const LOCALES: readonly Locale[] = ['en', 'zh', 'ja'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

export const DIMENSIONS: readonly GameDimension[] = [
  'memory',
  'attention',
  'reaction',
  'executive',
  'relaxation',
] as const;

export const DIFFICULTIES: readonly Difficulty[] = [
  'easy',
  'medium',
  'hard',
] as const;

/**
 * Canonical API route paths. Used by the frontend fetch layer and the Workers
 * router so the two sides never drift.
 */
export const API_ROUTES = {
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
  },
  scores: {
    base: '/api/scores',
    my: '/api/scores/my',
    leaderboard: '/api/scores/leaderboard',
  },
  brainAge: {
    calculate: '/api/brain-age/calculate',
    history: '/api/brain-age/history',
  },
  games: {
    base: '/api/games',
    bySlug: '/api/games/:slug',
  },
  growth: {
    achievements: '/api/growth/achievements',
    streak: '/api/growth/streak',
    pet: '/api/growth/pet',
    identity: '/api/growth/identity',
  },
  challenges: {
    base: '/api/challenges',
    byId: '/api/challenges/:id',
  },
  content: {
    articles: '/api/content/articles',
    articleBySlug: '/api/content/articles/:slug',
  },
  admin: {
    featureFlags: '/api/admin/feature-flags',
  },
} as const;

/**
 * KV cache namespace key prefixes. Mirrors the KV usage described in
 * context/02-architecture.md (SESSIONS + CACHE namespaces).
 */
export const STORAGE_KEYS = {
  session: (token: string) => `session:${token}`,
  leaderboard: (gameId: string, scope: string) => `lb:${gameId}:${scope}`,
  config: (key: string) => `config:${key}`,
  featureFlags: 'flags:all',
  article: (slug: string, locale: Locale) => `article:${slug}:${locale}`,
} as const;

/**
 * Cookie names used by the auth + i18n + consent layers. All cookies are set
 * HttpOnly + Secure + SameSite=Lax where the runtime allows it (session is
 * always HttpOnly; locale and consent are readable by the client).
 */
export const COOKIE_KEYS = {
  session: 'bv_session',
  locale: 'bv_locale',
  consent: 'bv_consent',
} as const;
