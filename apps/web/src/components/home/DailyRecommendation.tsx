'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Target, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GAMES } from '@/lib/games'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'

interface DailyRecommendationProps {
  locale: Locale
}

export function DailyRecommendation({ locale }: DailyRecommendationProps) {
  const { t } = useTranslation(locale)
  const dailyGame = useMemo(() => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const index = dayOfYear % GAMES.length
    return GAMES[index]
  }, [])

  if (!dailyGame) return null

  const dimensionLabel = t(`games.dimensions.${dailyGame.dimension}`)
  const difficultyLabel = t(`games.difficulty.${dailyGame.difficulty}`)

  return (
    <section className="px-md py-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-sm mb-lg">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            {t('home.dailyRecommendation.title')}
          </h2>
        </div>

        <Card className="overflow-hidden border-2 border-primary/20 shadow-glow-primary">
          <div className="grid md:grid-cols-2 gap-0">
            {/* 左侧：游戏信息 */}
            <div className="p-xl flex flex-col">
              <div className="flex items-center gap-sm mb-md">
                <Badge variant={dailyGame.dimension}>{dimensionLabel}</Badge>
                <Badge variant="outline">{difficultyLabel}</Badge>
              </div>

              <h3 className="text-2xl font-bold text-text-primary mb-md">
                {t(dailyGame.titleKey)}
              </h3>

              <p className="text-text-secondary mb-lg leading-relaxed">
                {t(dailyGame.descriptionKey)}
              </p>

              <div className="flex items-center gap-xs text-sm text-text-muted mb-lg">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(dailyGame.durationSec / 60)} min</span>
              </div>

              <div className="mt-auto">
                <Button variant="primary" size="lg" asChild className="w-full md:w-auto">
                  <Link href={`/${locale}/games/${dailyGame.slug}`}>
                    {t('home.dailyRecommendation.startTraining')}
                    <ArrowRight className="ml-xs h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* 右侧：训练目标 */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-xl flex flex-col justify-center">
              <div className="flex items-center gap-sm mb-md">
                <Target className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold text-text-primary">
                  {t('home.dailyRecommendation.trainingGoals')}
                </h4>
              </div>

              <ul className="space-y-sm">
                {(() => {
                  const objectives = t(dailyGame.objectivesKey) as string[] | string
                  const arr = Array.isArray(objectives) ? objectives : []
                  return arr.slice(0, 3).map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-text-secondary text-sm leading-relaxed">
                        {objective}
                      </span>
                    </li>
                  ))
                })()}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
