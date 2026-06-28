'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { gameHref, type GameMeta } from '@/lib/games'
import { ArrowRight, Clock, Target } from 'lucide-react'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

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

  return (
    <Card className="flex flex-col card-lift border-border hover:shadow-glow-primary">
      <CardContent className="flex flex-col gap-md p-xl">
        {/* 顶部：维度Badge + 难度Badge */}
        <div className="flex items-start justify-between gap-sm">
          <Badge variant={game.dimension}>
            {t(`games.dimensions.${game.dimension}`)}
          </Badge>
          <Badge variant={difficultyVariant[game.difficulty]}>
            {t(`games.difficulty.${game.difficulty}`)}
          </Badge>
        </div>

        {/* 游戏名称 */}
        <h2 className="text-xl font-semibold text-text-primary">
          {t(game.titleKey)}
        </h2>

        {/* 详细描述 */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {t(game.descriptionKey)}
        </p>

        {/* 训练目标 */}
        {objectivesArray.length > 0 && (
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-xs font-medium text-text-primary">
              <Target className="h-3.5 w-3.5" />
              <span>Training Objectives</span>
            </div>
            <ul className="flex flex-col gap-xs">
              {objectivesArray.slice(0, 3).map((objective, index) => (
                <li
                  key={index}
                  className="text-xs text-text-secondary flex items-start gap-xs"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{objective}</span>
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
