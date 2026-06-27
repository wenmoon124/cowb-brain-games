/**
 * Shared types for BrainVerse Workers API.
 *
 * These types are imported by index.ts, middleware, and route files to ensure
 * type-safe access to Cloudflare bindings and per-request context variables.
 */

// ============ Cloudflare Bindings ============

/**
 * Cloudflare Workers bindings configured in wrangler.toml.
 * Includes D1 (database), KV (sessions + cache), R2 (storage), and env vars.
 */
export interface Bindings {
  /** D1 database — primary persistent store (users, scores, articles, etc.) */
  DB: D1Database
  /** KV namespace for session storage (key: `session:{token}`, TTL 7 days) */
  SESSIONS: KVNamespace
  /** KV namespace for cache (leaderboard, config, feature flags, articles) */
  CACHE: KVNamespace
  /** R2 bucket for object storage (avatars, share images, article covers) */
  STORAGE: R2Bucket
  /** Current deployment environment */
  environment: string
  /** Production frontend URL */
  app_url: string
  /** Preview frontend URL */
  preview_url: string
}

// ============ Session & Auth ============

/** Supported user roles */
export type UserRole = 'user' | 'admin'

/** Supported locale codes */
export type Locale = 'en' | 'zh' | 'ja'

/**
 * Session data stored in SESSIONS KV.
 * Key format: `session:{token}` with TTL of 7 days (604800 seconds).
 */
export interface SessionData {
  userId: string
  email: string
  nickname: string
  role: UserRole
  locale: Locale
  /** ISO 8601 expiry timestamp */
  expiresAt: string
}

/**
 * Authenticated user info attached to request context.
 * Derived from SessionData (excludes token/expiry for security).
 */
export interface SessionUser {
  userId: string
  email: string
  nickname: string
  role: UserRole
  locale: Locale
}

// ============ Hono Context Variables ============

/**
 * Per-request variables set by middleware.
 * - `requestId`: set by Request ID middleware, used in logs and error responses
 * - `user`: set by auth middleware (null when not authenticated)
 */
export interface Variables {
  requestId: string
  user: SessionUser | null
}

/**
 * Hono environment type combining Bindings and Variables.
 * Used as the generic parameter for all Hono instances in the API.
 */
export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}

// ============ API Response Types ============

/** Standard error codes matching HTTP status codes */
export type ErrorCode =
  | 'VALIDATION_ERROR' // 400
  | 'UNAUTHORIZED' // 401
  | 'FORBIDDEN' // 403
  | 'NOT_FOUND' // 404
  | 'RATE_LIMITED' // 429
  | 'INTERNAL_ERROR' // 500

/** Standard error response body */
export interface ErrorBody {
  error: {
    code: ErrorCode
    message: string
    requestId: string
  }
}

/** Pagination query parameters */
export interface PaginationQuery {
  page: number
  limit: number
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
