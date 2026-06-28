'use client'

import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/client'
import { isValidLocale, type Locale } from '@/i18n/config'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  const locale: Locale = first && isValidLocale(first) ? first : 'en'
  const { t } = useTranslation(locale)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-md flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <p className="text-lg text-text-secondary">
          {t('common.loading')}
        </p>
      </div>
    </div>
  )
}
