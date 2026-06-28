'use client'

import { useState, useMemo } from 'react'
import { GAMES, type GameDimension } from '@/lib/games'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { GameCard } from './game-card'
import { Button } from '@/components/ui/button'

const DIMENSIONS: Array<GameDimension | 'all'> = [
  'all',
  'memory',
  'attention',
  'reaction',
  'executive',
  'relaxation',
]

const GAMES_PER_PAGE = 9

interface GamesExplorerProps {
  locale: Locale
}

export function GamesExplorer({ locale }: GamesExplorerProps) {
  const { t } = useTranslation(locale)
  const [selected, setSelected] = useState<GameDimension | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredGames = useMemo(
    () =>
      selected === 'all'
        ? GAMES
        : GAMES.filter((g) => g.dimension === selected),
    [selected]
  )

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE)
  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * GAMES_PER_PAGE
    return filteredGames.slice(start, start + GAMES_PER_PAGE)
  }, [filteredGames, currentPage])

  const handleDimensionChange = (dim: GameDimension | 'all') => {
    setSelected(dim)
    setCurrentPage(1)
  }

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
              onClick={() => handleDimensionChange(dim)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg min-h-[600px]">
        {paginatedGames.map((game) => (
          <GameCard key={game.slug} game={game} locale={locale} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-xl flex justify-center gap-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </>
  )
}
