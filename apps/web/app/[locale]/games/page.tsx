import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GAMES, gameHref, type GameDimension } from '@/lib/games'
import { ArrowRight } from 'lucide-react'

type BadgeVariant = GameDimension

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

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {GAMES.map((game) => (
            <Card
              key={game.slug}
              className="flex flex-col transition-transform hover:-translate-y-1 hover:shadow-glow-primary"
            >
              <CardContent className="flex flex-col gap-md p-xl">
                <div className="flex items-start justify-between gap-md">
                  <h2 className="text-xl font-semibold text-text-primary">
                    {t(game.titleKey)}
                  </h2>
                  <Badge variant={game.dimension as BadgeVariant}>
                    {t(`games.dimensions.${game.dimension}`)}
                  </Badge>
                </div>
                <p className="text-sm text-text-secondary">
                  {t(game.descriptionKey)}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-sm w-full sm:w-auto sm:self-start"
                  asChild
                >
                  <Link href={gameHref(locale, game.slug)}>
                    {t('games.playNow')}
                    <ArrowRight className="ml-xs h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
