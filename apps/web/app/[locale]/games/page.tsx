import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { GamesExplorer } from '@/components/games/GamesExplorer'
import { PageHeader } from '@/components/layout/page-header'

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
        <PageHeader
          title={t('games.title')}
          description={t('games.description')}
        />

        {/* Games Explorer with dimension filter */}
        <GamesExplorer locale={locale} />
      </div>
    </div>
  )
}
