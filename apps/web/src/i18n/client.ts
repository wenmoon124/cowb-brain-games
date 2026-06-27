'use client'

import { useCallback, useMemo } from 'react'
import en from '@/i18n/en.json'
import zh from '@/i18n/zh.json'
import ja from '@/i18n/ja.json'
import type { Locale } from '@/i18n/config'

type Messages = Record<string, unknown>

const messagesMap: Record<Locale, Messages> = {
  en: en as Messages,
  zh: zh as Messages,
  ja: ja as Messages,
}

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
 * Client-side translation hook.
 * Provides a synchronous `t()` function for client components.
 */
export function useTranslation(locale: Locale): { t: Translator } {
  const messages = messagesMap[locale]

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getValue(messages, key)
      return interpolate(value, vars)
    },
    [messages]
  )

  return useMemo(() => ({ t }), [t])
}
