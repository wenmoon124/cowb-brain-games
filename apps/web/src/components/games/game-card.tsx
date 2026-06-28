'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { gameHref, type GameMeta } from '@/lib/games'
import { ArrowRight, Clock, Target } from 'lucide-react'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { getGameIcon } from '@/lib/game-icons'

interface GameCardProps {
  game: GameMeta
  locale: Locale
}

export function GameCard({ game, locale }: GameCardProps) {
  const { t } = useTranslation(locale)

  // 获取训练目标（从翻译文件）
  const objectivesRaw = game.objectivesKey ? t(game.objectivesKey) : []
  const objectivesArray = Array.isArray(objectivesRaw) ? objectivesRaw : []

  // 难度Badge颜色映射
  const difficultyVariant = {
    easy: 'success' as const,
    medium: 'warning' as const,
    hard: 'error' as const,
  }

  // 预计时间（分钟）
  const durationMinutes = Math.ceil(game.durationSec / 60)

  // 获取游戏图标
  const GameIcon = getGameIcon(game.slug)

  return (
    <Card className="flex flex-col card-lift border-2 border-primary-light hover:shadow-glow-primary h-full">
      {/* 游戏图标区域 */}
      <div className="aspect-video bg-gradient-primary flex items-center justify-center rounded-t-md">
        <GameIcon className="h-20 w-20 text-white" />
      </div>

      <CardContent className="flex flex-col gap-md p-xl flex-1">
        {/* 顶部：维度Badge + 难度Badge */}
        <div className="flex items-start justify-between gap-sm">
          <Badge variant={game.dimension} className="min-w-[80px] justify-center">
            {t(`games.dimensions.${game.dimension}`)}
          </Badge>
          <Badge variant={difficultyVariant[game.difficulty]} className="min-w-[80px] justify-center">
            {t(`games.difficulty.${game.difficulty}`)}
          </Badge>
        </div>

        {/* 游戏名称 */}
        <h2 className="text-lg font-bold text-text-primary line-clamp-2">
          {t(game.titleKey)}
        </h2>

        {/* 详细描述 */}
        <p className="text-md text-text-secondary leading-relaxed line-clamp-3 flex-1">
          {t(game.descriptionKey)}
        </p>

        {/* 训练目标 */}
        {objectivesArray.length > 0 && (
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-xs font-semibold text-text-primary">
              <Target className="h-3.5 w-3.5" />
              <span>{t('games.trainingGoals')}</span>
            </div>
            <ul className="flex flex-col gap-xs">
              {objectivesArray.slice(0, 2).map((objective, index) => (
                <li
                  key={index}
                  className="text-xs text-text-secondary flex items-start gap-xs"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-2">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 底部：预计时间 + 开始按钮 */}
        <div className="flex items-center justify-between gap-md mt-auto pt-md border-t border-border-light">
          <div className="flex items-center gap-xs text-xs text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            <span>{durationMinutes} min</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 sm:flex-none"
            asChild
          >
            <Link href={gameHref(locale, game.slug)}>
              {t('games.playNow')}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
