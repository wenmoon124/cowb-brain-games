// @brainverse/shared — pure utility helpers shared by frontend and Workers.
//
// All functions are side-effect free (except `hashPassword`/`verifyPassword`
// which delegate to the Web Crypto API) and dependency-free so they can run
// in both the browser and the Workers runtime.

/**
 * Generate a RFC 4122 v4 UUID using the platform `crypto.randomUUID()`
 * implementation (available in modern browsers and the Workers runtime, and
 * in Node >= 19).
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Hash a password using the Web Crypto API SHA-256 algorithm.
 *
 * NOTE: SHA-256 is fast and suitable for demo/prototype use. Production
 * password storage should use a slow KDF (bcrypt / scrypt / argon2); replace
 * this implementation before launching real user accounts.
 *
 * Returns the digest as a lowercase hex string.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  let hex = '';
  for (let i = 0; i < hashArray.length; i += 1) {
    hex += hashArray[i]!.toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Verify a plaintext password against a previously computed SHA-256 hex digest
 * produced by {@link hashPassword}. Uses a constant-time string comparison to
 * avoid trivial timing leaks.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const computed = await hashPassword(password);
  if (computed.length !== hash.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < computed.length; i += 1) {
    mismatch |= computed.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Format a millisecond duration as `MM:SS`. Negative inputs are clamped to 0.
 */
export function formatTime(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Clamp `value` into the inclusive range `[min, max]`. When `min > max` the
 * arguments are swapped so the result is always finite and well-defined.
 */
export function clamp(value: number, min: number, max: number): number {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}

/**
 * Return a uniformly random element from a non-empty array.
 * Throws if the array is empty so callers cannot silently get `undefined`.
 */
export function randomChoice<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('randomChoice: array must not be empty');
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index]!;
}

/**
 * Return a new array containing the elements of `array` in a random order
 * (Fisher–Yates shuffle). The input array is not mutated.
 */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = result[i]!;
    const b = result[j]!;
    result[i] = b;
    result[j] = a;
  }
  return result;
}
