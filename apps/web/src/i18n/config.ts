export const LOCALES = ['en', 'zh', 'ja'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
  ja: '日本語',
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
}

export const LOCALE_OG: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
}

export const LOCALE_DISPLAY: Record<Locale, string> = {
  en: 'EN',
  zh: '中',
  ja: '日',
}

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale)
}
