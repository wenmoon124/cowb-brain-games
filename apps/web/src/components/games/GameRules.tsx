'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Award, Lightbulb } from 'lucide-react'
import type { GameDimension } from '@/lib/games'
import type { Translator } from '@/i18n/translations'

interface GameRulesProps {
  /** Game title */
  title: string
  /** Dimension for badge */
  dimension: GameDimension
  /** Dimension label (localized) */
  dimensionLabel: string
  /** How to play — array of rule strings */
  rules: string[]
  /** How scoring works — array of scoring explanations */
  scoring: string[]
  /** Tips for better performance */
  tips?: string[]
  /** Translator function for i18n labels */
  t: Translator
  /** Start button (rendered by parent) */
  children?: React.ReactNode
}

/**
 * Game rules display card — shown before game starts.
 *
 * Displays:
 * - Game title + dimension badge
 * - "How to Play" rules list
 * - "Scoring" explanation
 * - "Tips" (optional)
 * - Start button (passed as children)
 */
export function GameRules({
  title,
  dimension,
  dimensionLabel,
  rules,
  scoring,
  tips,
  t,
  children,
}: GameRulesProps) {
  return (
    <Card className="border-2 border-primary/10">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-md">
          <CardTitle className="text-2xl text-text-primary">{title}</CardTitle>
          <Badge variant={dimension}>{dimensionLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-xl">
        {/* How to Play */}
        <section className="flex flex-col gap-sm">
          <h3 className="flex items-center gap-xs text-lg font-semibold text-text-primary">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('games.rules.howToPlay')}
          </h3>
          <ul className="flex flex-col gap-xs pl-xl">
            {rules.map((rule, i) => (
              <li
                key={i}
                className="list-disc text-sm text-text-secondary"
              >
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* Scoring */}
        <section className="flex flex-col gap-sm">
          <h3 className="flex items-center gap-xs text-lg font-semibold text-text-primary">
            <Award className="h-5 w-5 text-secondary" />
            {t('games.rules.scoring')}
          </h3>
          <ul className="flex flex-col gap-xs pl-xl">
            {scoring.map((item, i) => (
              <li
                key={i}
                className="list-disc text-sm text-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Tips */}
        {tips && tips.length > 0 && (
          <section className="flex flex-col gap-sm">
            <h3 className="flex items-center gap-xs text-lg font-semibold text-text-primary">
              <Lightbulb className="h-5 w-5 text-accent" />
              {t('games.rules.tips')}
            </h3>
            <ul className="flex flex-col gap-xs pl-xl">
              {tips.map((tip, i) => (
                <li
                  key={i}
                  className="list-disc text-sm text-text-secondary"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Start Button */}
        {children && <div className="flex justify-center pt-md">{children}</div>}
      </CardContent>
    </Card>
  )
}
