// @brainverse/shared — shared type definitions used across all packages and apps.

/**
 * Supported UI locales. Aligned with the /[locale]/ App Router segment.
 */
export type Locale = 'en' | 'zh' | 'ja';

/**
 * The five cognitive dimensions tracked by BrainVerse games and Brain Engine.
 */
export type GameDimension =
  | 'memory'
  | 'attention'
  | 'reaction'
  | 'executive'
  | 'relaxation';

/**
 * Difficulty tiers used by the adaptive difficulty engine and game configs.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Branded primitive ids. Using intersection with a brand marker prevents
 * accidental mixing of unrelated string ids at compile time while remaining
 * a `string` at runtime.
 */
export type UserId = string & { readonly __brand: 'UserId' };
export type GameId = string & { readonly __brand: 'GameId' };
export type ScoreId = string & { readonly __brand: 'ScoreId' };

/**
 * Standard error payload returned by the Workers API for any failed request.
 * `requestId` is optional because some client-side errors are not tied to a
 * server request.
 */
export interface ErrorResponse {
  code: string;
  message: string;
  requestId?: string;
}

/**
 * Unified API response envelope. Every Workers API endpoint returns either a
 * successful payload (`success: true` with `data`) or an error
 * (`success: false` with `error`). Discriminated union so callers can narrow
 * via `response.success`.
 */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResponse };

/**
 * Paginated list payload. `hasMore` is derived from total/page/pageSize and
 * is provided for client convenience.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
