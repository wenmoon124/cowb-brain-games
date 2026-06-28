'use client'

import { useState } from 'react'
import { GAMES, type GameDimension } from '@/lib/games'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameCard } from './game-card'

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
          <GameCard key={game.slug} game={game} locale={locale} />
        ))}
      </div>
    </>
  )
}
