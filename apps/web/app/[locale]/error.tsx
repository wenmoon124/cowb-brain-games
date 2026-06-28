'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/i18n/client'
import { isValidLocale, type Locale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  const locale: Locale = first && isValidLocale(first) ? first : 'en'
  const { t } = useTranslation(locale)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-lg flex justify-center">
          <AlertCircle className="h-16 w-16 text-accent" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
          {t('errors.generic')}
        </h1>
        <div className="flex flex-col gap-md justify-center sm:flex-row">
          <Button variant="primary" size="lg" onClick={reset}>
            <RotateCcw className="mr-xs h-4 w-4" />
            {t('errors.tryAgain')}
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href={`/${locale}`}>{t('errors.backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
