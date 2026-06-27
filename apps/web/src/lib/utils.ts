import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isValidLocale, LOCALES, DEFAULT_LOCALE, type Locale } from '@/i18n/config'

/**
 * Merge Tailwind CSS classes with proper precedence.
 * Combines clsx (conditional classes) and tailwind-merge (dedup conflicting classes).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format a date according to the given locale using Intl.DateTimeFormat.
 */
export function formatDate(date: Date | string, locale: Locale | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const localeTag = isValidLocale(locale) ? LOCALE_HTML_LANG[locale] : locale
  return new Intl.DateTimeFormat(localeTag, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a number according to the given locale using Intl.NumberFormat.
 */
export function formatNumber(num: number, locale: Locale | string): string {
  const localeTag = isValidLocale(locale) ? LOCALE_HTML_LANG[locale] : locale
  return new Intl.NumberFormat(localeTag).format(num)
}

/**
 * Extract the locale segment from a URL pathname.
 * Returns the default locale if no valid locale is found.
 */
export function getLocale(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  if (first && isValidLocale(first)) {
    return first
  }
  return DEFAULT_LOCALE
}

/**
 * Validate that a string is a supported locale.
 */
export function validateLocale(locale: string): locale is Locale {
  return isValidLocale(locale)
}

export { LOCALES, DEFAULT_LOCALE, type Locale }
