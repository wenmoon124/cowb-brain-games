import type { Locale } from './config'

type Messages = Record<string, unknown>

/**
 * Get a nested value from a messages object using dot notation.
 */
function getValue(messages: Messages, key: string): string {
  const parts = key.split('.')
  let current: unknown = messages
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return key
    }
  }
  return typeof current === 'string' ? current : key
}

/**
 * Interpolate {variable} placeholders in a template string.
 */
function interpolate(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in vars ? String(vars[name]) : `{${name}}`
  )
}

export type Translator = (
  key: string,
  vars?: Record<string, string | number>
) => string

/**
 * Load translation messages for a locale and return a translator function.
 * Uses dot notation keys (e.g., "landing.hero.title").
 */
export async function getTranslations(locale: Locale): Promise<Translator> {
  const messages = (await import(`@/i18n/${locale}.json`)).default as Messages
  return (key: string, vars?: Record<string, string | number>): string => {
    const value = getValue(messages, key)
    return interpolate(value, vars)
  }
}

/**
 * Get raw messages object for client-side providers.
 */
export async function getMessages(locale: Locale): Promise<Messages> {
  const messages = (await import(`@/i18n/${locale}.json`)).default as Messages
  return messages
}
