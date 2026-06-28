import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Home, Compass } from 'lucide-react'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'

export default async function NotFound() {
  const t = await getTranslations(DEFAULT_LOCALE as Locale)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-hero px-md py-3xl">
      <div className="mx-auto flex max-w-md flex-col items-center gap-lg text-center">
        <Link
          href={`/${DEFAULT_LOCALE}`}
          className="flex items-center gap-sm font-bold text-text-primary"
        >
          <Brain className="h-7 w-7 text-primary" />
          <span className="text-lg">BrainVerse</span>
        </Link>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
          <Compass className="h-10 w-10 text-primary" />
        </div>

        <div className="flex flex-col gap-sm">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            {t('pages.notFound.title')}
          </h2>
          <p className="text-md text-text-secondary max-w-sm">
            {t('pages.notFound.description')}
          </p>
        </div>

        <Button variant="primary" size="lg" asChild>
          <Link href={`/${DEFAULT_LOCALE}`}>
            <Home className="mr-xs h-4 w-4" />
            {t('pages.notFound.backHome')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
