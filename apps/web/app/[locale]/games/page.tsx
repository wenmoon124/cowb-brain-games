import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { GamesExplorer } from '@/components/games/GamesExplorer'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('games.title')
  const description = t('games.description')
  const pathPrefix = `/${locale}/games`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/games',
        zh: '/zh/games',
        ja: '/ja/games',
        'x-default': '/en/games',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function GamesPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {t('games.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary max-w-2xl mx-auto">
            {t('games.description')}
          </p>
        </header>

        {/* Games Explorer with dimension filter */}
        <GamesExplorer locale={locale} />
      </div>
    </div>
  )
}
