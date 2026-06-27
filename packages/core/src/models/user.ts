// @brainverse/core — User domain model.

import type { Locale, UserId } from '@brainverse/shared';

/**
 * Authorization role. `admin` grants access to /api/admin/* endpoints and the
 * Admin Panel; `user` is the default for all signed-up accounts.
 */
export type UserRole = 'user' | 'admin';

/**
 * Top-level user account record. Mirrors the `users` D1 table.
 *
 * Timestamps are ISO 8601 strings (UTC) because JSON has no native Date type
 * and D1 stores them as TEXT.
 */
export interface User {
  id: UserId;
  email: string;
  nickname: string;
  locale: Locale;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Per-user preference overrides stored alongside the user record (or in a
 * separate `user_preferences` table). All fields have explicit defaults
 * applied server-side, so callers can patch individual fields.
 */
export interface UserPreferences {
  locale: Locale;
  /** 'system' follows the OS prefers-color-scheme media query. */
  theme: 'light' | 'dark' | 'system';
  notifications: {
    /** Daily training reminder + streak about-to-break nudge. */
    dailyReminder: boolean;
    /** Friend challenge invitations. */
    challenges: boolean;
    /** Achievement unlock + level-up announcements. */
    achievements: boolean;
  };
}
