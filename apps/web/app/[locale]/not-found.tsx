'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isValidLocale, type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  const locale: Locale = first && isValidLocale(first) ? first : 'en'
  const { t } = useTranslation(locale)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-md">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-md">
          {t('pages.notFound.title')}
        </h2>
        <p className="text-md text-text-secondary mb-2xl">
          {t('pages.notFound.description')}
        </p>
        <Button variant="primary" size="lg" asChild>
          <Link href={`/${locale}`}>{t('pages.notFound.backHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
