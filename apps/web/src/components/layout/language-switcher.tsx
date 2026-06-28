'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, Check } from 'lucide-react'
import { LOCALES, LOCALE_NAMES, type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  locale: Locale
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation(locale)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split('/')
    if (segments.length > 1 && LOCALES.includes(segments[1] as Locale)) {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    const newPath = segments.join('/') || `/${newLocale}`
    router.push(newPath)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-xs rounded-md px-sm py-sm text-sm font-medium text-text-secondary transition-colors hover:bg-primary-bg hover:text-text-primary"
        aria-label={t('common.languageSwitcher')}
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
      </button>
      {open && (
        <ul
          className="absolute right-0 top-full mt-xs w-40 overflow-hidden rounded-md border border-border bg-card py-xs shadow-lg z-dropdown"
          role="menu"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => switchLocale(l)}
                className={cn(
                  'flex w-full items-center justify-between px-md py-sm text-sm transition-colors hover:bg-primary-bg',
                  l === locale
                    ? 'font-semibold text-primary'
                    : 'text-text-secondary'
                )}
                role="menuitem"
              >
                {LOCALE_NAMES[l]}
                {l === locale && <Check className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
