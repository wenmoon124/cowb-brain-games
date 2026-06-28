'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GAMES, gameHref, type GameDimension } from '@/lib/games'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

type BadgeVariant = GameDimension

const DIMENSIONS: Array<GameDimension | 'all'> = [
  'all',
  'memory',
  'attention',
  'reaction',
  'executive',
  'relaxation',
]

interface GamesExplorerProps {
  locale: Locale
}

export function GamesExplorer({ locale }: GamesExplorerProps) {
  const { t } = useTranslation(locale)
  const [selected, setSelected] = useState<GameDimension | 'all'>('all')

  const filteredGames =
    selected === 'all'
      ? GAMES
      : GAMES.filter((g) => g.dimension === selected)

  return (
    <>
      {/* Dimension Filter */}
      <div className="mb-2xl flex flex-wrap items-center justify-center gap-sm">
        {DIMENSIONS.map((dim) => {
          const isActive = selected === dim
          const label =
            dim === 'all'
              ? t('games.dimensions.all')
              : t(`games.dimensions.${dim}`)
          return (
            <button
              key={dim}
              type="button"
              onClick={() => setSelected(dim)}
              className={
                isActive
                  ? 'rounded-md border border-primary bg-primary px-md py-xs text-sm font-semibold text-white transition-colors'
                  : 'rounded-md border border-border bg-card px-md py-xs text-sm font-medium text-text-secondary transition-colors hover:bg-primary-bg hover:text-text-primary'
              }
              aria-pressed={isActive}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredGames.map((game) => (
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
    </>
  )
}
