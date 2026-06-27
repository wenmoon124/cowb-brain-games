import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  LOCALES,
  isValidLocale,
  type Locale,
} from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GAMES, GAME_SLUGS, getGameBySlug, type GameDimension } from '@/lib/games'
import { ArrowLeft } from 'lucide-react'
import { VisualSearchGame } from '@/components/games/VisualSearchGame'
import { DigitSpanGame } from '@/components/games/DigitSpanGame'
import { ReactionTrainingGame } from '@/components/games/ReactionTrainingGame'
import { StroopChallengeGame } from '@/components/games/StroopChallengeGame'
import { SpatialMemoryGame } from '@/components/games/SpatialMemoryGame'
import { BreathingFlowGame } from '@/components/games/BreathingFlowGame'

type BadgeVariant = GameDimension

interface GameComponentProps {
  locale: string
}

const GAME_COMPONENTS: Record<string, ComponentType<GameComponentProps>> = {
  'visual-search': VisualSearchGame,
  'digit-span': DigitSpanGame,
  'reaction-training': ReactionTrainingGame,
  'stroop-challenge': StroopChallengeGame,
  'spatial-memory': SpatialMemoryGame,
  'breathing-flow': BreathingFlowGame,
}

export function generateStaticParams() {
  const params: { locale: string; gameId: string }[] = []
  for (const locale of LOCALES) {
    for (const slug of GAME_SLUGS) {
      params.push({ locale, gameId: slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; gameId: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const game = getGameBySlug(params.gameId)
  const title = game ? t(game.titleKey) : t('games.title')
  const description = game ? t(game.descriptionKey) : t('games.description')
  const pathPrefix = `/${locale}/games/${params.gameId}`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: `/en/games/${params.gameId}`,
        zh: `/zh/games/${params.gameId}`,
        ja: `/ja/games/${params.gameId}`,
        'x-default': `/en/games/${params.gameId}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function GameDetailPage({
  params,
}: {
  params: { locale: string; gameId: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const game = getGameBySlug(params.gameId)

  if (!game) {
    notFound()
  }

  const relatedGames = GAMES.filter(
    (g) => g.slug !== game.slug && g.dimension === game.dimension
  ).slice(0, 2)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-lg" asChild>
          <Link href={`/${locale}/games`}>
            <ArrowLeft className="mr-xs h-4 w-4" />
            {t('games.backToGames')}
          </Link>
        </Button>

        {/* Game Info Card */}
        <Card className="mb-xl">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-md">
              <CardTitle className="text-2xl md:text-3xl text-text-primary">
                {t(game.titleKey)}
              </CardTitle>
              <Badge variant={game.dimension as BadgeVariant}>
                {t(`games.dimensions.${game.dimension}`)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-md text-text-secondary">
              {t(game.descriptionKey)}
            </p>
          </CardContent>
        </Card>

        {/* Playable Game Area */}
        {(() => {
          const GameComponent = GAME_COMPONENTS[game.slug]
          if (!GameComponent) {
            return null
          }
          return <GameComponent locale={locale} />
        })()}

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section className="mt-3xl">
            <h2 className="text-xl font-semibold text-text-primary mb-lg">
              {t('games.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {relatedGames.map((related) => (
                <Card
                  key={related.slug}
                  className="transition-transform hover:-translate-y-1"
                >
                  <CardContent className="flex flex-col gap-sm p-lg">
                    <div className="flex items-center justify-between gap-sm">
                      <h3 className="text-md font-semibold text-text-primary">
                        {t(related.titleKey)}
                      </h3>
                      <Badge variant={related.dimension as BadgeVariant}>
                        {t(`games.dimensions.${related.dimension}`)}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {t(related.descriptionKey)}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-xs w-full sm:w-auto sm:self-start"
                      asChild
                    >
                      <Link href={`/${locale}/games/${related.slug}`}>
                        {t('games.playNow')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
