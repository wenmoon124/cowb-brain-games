import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RequireAuth } from '@/components/auth/RequireAuth'
import type { GameDimension } from '@/lib/games'
import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Trophy,
  Medal,
  Flame,
  Brain,
  Focus,
  Zap,
  Layers,
  Wind,
  ArrowRight,
} from 'lucide-react'

type AchievementCategory = 'game' | 'streak' | 'dimension'

type Achievement = {
  id: string
  icon: LucideIcon
  unlocked: boolean
  progress: number
  category: AchievementCategory
  dimension?: GameDimension
}

const ACHIEVEMENTS: ReadonlyArray<Achievement> = [
  // Game Achievements (8)
  {
    id: 'first-game',
    icon: Award,
    unlocked: true,
    progress: 100,
    category: 'game',
  },
  {
    id: 'perfect-score',
    icon: Trophy,
    unlocked: false,
    progress: 60,
    category: 'game',
  },
  {
    id: 'speed-demon',
    icon: Medal,
    unlocked: true,
    progress: 100,
    category: 'game',
  },
  {
    id: 'marathon-player',
    icon: Trophy,
    unlocked: false,
    progress: 80,
    category: 'game',
  },
  {
    id: 'dimension-master',
    icon: Award,
    unlocked: false,
    progress: 40,
    category: 'game',
  },
  {
    id: 'century-club',
    icon: Medal,
    unlocked: true,
    progress: 100,
    category: 'game',
  },
  {
    id: 'flawless-victory',
    icon: Trophy,
    unlocked: false,
    progress: 20,
    category: 'game',
  },
  {
    id: 'comeback-king',
    icon: Award,
    unlocked: false,
    progress: 0,
    category: 'game',
  },
  // Streak Achievements (6)
  {
    id: 'streak-3',
    icon: Flame,
    unlocked: true,
    progress: 100,
    category: 'streak',
  },
  {
    id: 'streak-7',
    icon: Flame,
    unlocked: true,
    progress: 100,
    category: 'streak',
  },
  {
    id: 'streak-30',
    icon: Medal,
    unlocked: false,
    progress: 40,
    category: 'streak',
  },
  {
    id: 'streak-100',
    icon: Trophy,
    unlocked: false,
    progress: 12,
    category: 'streak',
  },
  {
    id: 'year-excellence',
    icon: Award,
    unlocked: false,
    progress: 0,
    category: 'streak',
  },
  {
    id: 'unbreakable',
    icon: Trophy,
    unlocked: false,
    progress: 0,
    category: 'streak',
  },
  // Dimension Mastery (10)
  {
    id: 'memory-novice',
    icon: Brain,
    unlocked: true,
    progress: 100,
    category: 'dimension',
    dimension: 'memory',
  },
  {
    id: 'memory-expert',
    icon: Brain,
    unlocked: false,
    progress: 70,
    category: 'dimension',
    dimension: 'memory',
  },
  {
    id: 'attention-adept',
    icon: Focus,
    unlocked: true,
    progress: 100,
    category: 'dimension',
    dimension: 'attention',
  },
  {
    id: 'attention-master',
    icon: Focus,
    unlocked: false,
    progress: 50,
    category: 'dimension',
    dimension: 'attention',
  },
  {
    id: 'reaction-rookie',
    icon: Zap,
    unlocked: true,
    progress: 100,
    category: 'dimension',
    dimension: 'reaction',
  },
  {
    id: 'reaction-pro',
    icon: Zap,
    unlocked: false,
    progress: 30,
    category: 'dimension',
    dimension: 'reaction',
  },
  {
    id: 'executive-apprentice',
    icon: Layers,
    unlocked: false,
    progress: 60,
    category: 'dimension',
    dimension: 'executive',
  },
  {
    id: 'executive-expert',
    icon: Layers,
    unlocked: false,
    progress: 10,
    category: 'dimension',
    dimension: 'executive',
  },
  {
    id: 'relaxation-seeker',
    icon: Wind,
    unlocked: false,
    progress: 40,
    category: 'dimension',
    dimension: 'relaxation',
  },
  {
    id: 'relaxation-sage',
    icon: Wind,
    unlocked: false,
    progress: 20,
    category: 'dimension',
    dimension: 'relaxation',
  },
]

const DIMENSION_STYLES: Record<
  GameDimension,
  { bg: string; text: string }
> = {
  memory: { bg: 'bg-dim-memory/15', text: 'text-dim-memory-text' },
  attention: { bg: 'bg-dim-attention/15', text: 'text-dim-attention-text' },
  reaction: { bg: 'bg-dim-reaction/15', text: 'text-dim-reaction-text' },
  executive: { bg: 'bg-dim-executive/15', text: 'text-dim-executive-text' },
  relaxation: { bg: 'bg-dim-relaxation/15', text: 'text-dim-relaxation-text' },
}

type AchievementStyle = {
  cardTint: string
  iconColor: string
  iconBg: string
}

function getAchievementStyle(ach: Achievement): AchievementStyle {
  if (!ach.unlocked) {
    return {
      cardTint: 'bg-background-secondary',
      iconColor: 'text-text-muted',
      iconBg: 'bg-border',
    }
  }
  if (ach.dimension) {
    const styles = DIMENSION_STYLES[ach.dimension]
    return {
      cardTint: styles.bg,
      iconColor: styles.text,
      iconBg: 'bg-card',
    }
  }
  return {
    cardTint: 'bg-primary-light',
    iconColor: 'text-primary',
    iconBg: 'bg-card',
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const pathPrefix = `/${locale}/achievements`

  return {
    title: t('achievements.title'),
    description: t('achievements.subtitle'),
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/achievements',
        zh: '/zh/achievements',
        ja: '/ja/achievements',
        'x-default': '/en/achievements',
      },
    },
    openGraph: {
      title: t('achievements.title'),
      description: t('achievements.subtitle'),
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function AchievementsPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const totalAchievements = ACHIEVEMENTS.length
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length
  const progressPercent = Math.round(
    (unlockedCount / totalAchievements) * 100
  )

  const stats: ReadonlyArray<{
    icon: LucideIcon
    value: string
    label: string
    accent: string
  }> = [
    {
      icon: Trophy,
      value: String(totalAchievements),
      label: t('achievements.statTotalLabel'),
      accent: 'bg-primary-light',
    },
    {
      icon: Award,
      value: String(unlockedCount),
      label: t('achievements.statUnlockedLabel'),
      accent: 'bg-accent-light',
    },
    {
      icon: Medal,
      value: `${progressPercent}%`,
      label: t('achievements.statProgressLabel'),
      accent: 'bg-secondary-light',
    },
  ]

  const categories: ReadonlyArray<{
    key: AchievementCategory
    title: string
    subtitle: string
  }> = [
    {
      key: 'game',
      title: t('achievements.gameCategoryTitle'),
      subtitle: t('achievements.gameCategorySubtitle'),
    },
    {
      key: 'streak',
      title: t('achievements.streakCategoryTitle'),
      subtitle: t('achievements.streakCategorySubtitle'),
    },
    {
      key: 'dimension',
      title: t('achievements.dimensionCategoryTitle'),
      subtitle: t('achievements.dimensionCategorySubtitle'),
    },
  ]

  return (
    <RequireAuth locale={locale as Locale} pageKey="achievements">
      <div className="flex flex-col">
        {/* Header */}
      <section className="bg-gradient-hero px-md py-3xl md:py-4xl">
        <div className="mx-auto max-w-5xl">
          <Badge variant="info" className="mb-md w-fit">
            {t('achievements.demoBadge')}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {t('achievements.title')}
          </h1>
          <p className="text-md text-text-secondary max-w-2xl">
            {t('achievements.subtitle')}
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xl">
            {t('achievements.statsTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label} className="border-primary-light">
                  <CardContent className="flex items-center gap-md p-lg">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${stat.accent}`}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                        {stat.value}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {stat.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Achievement Categories */}
      {categories.map((category) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === category.key)
        return (
          <section
            key={category.key}
            className={
              category.key === 'streak'
                ? 'bg-background-secondary px-md py-3xl'
                : 'px-md py-3xl'
            }
          >
            <div className="mx-auto max-w-5xl">
              <div className="mb-xl">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xs">
                  {category.title}
                </h2>
                <p className="text-sm text-text-secondary max-w-2xl">
                  {category.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                {items.map((ach) => {
                  const Icon = ach.icon
                  const style = getAchievementStyle(ach)
                  return (
                    <Card
                      key={ach.id}
                      className={`border-primary-light flex flex-col ${ach.unlocked ? '' : 'opacity-75'}`}
                    >
                      <CardContent
                        className={`flex flex-1 flex-col items-center gap-md p-lg text-center ${style.cardTint}`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg}`}
                        >
                          <Icon className={`h-6 w-6 ${style.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {t(`achievements.items.${ach.id}.title`)}
                        </span>
                        <span className="text-xs text-text-secondary flex-1">
                          {t(`achievements.items.${ach.id}.description`)}
                        </span>
                        <Badge
                          variant={ach.unlocked ? 'success' : 'info'}
                          className="w-fit"
                        >
                          {ach.unlocked
                            ? t('achievements.unlockedLabel')
                            : t('achievements.lockedLabel')}
                        </Badge>
                        {!ach.unlocked && (
                          <div className="flex w-full flex-col gap-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-muted">
                                {t('achievements.progressLabel')}
                              </span>
                              <span className="text-xs font-semibold text-text-secondary">
                                {ach.progress}%
                              </span>
                            </div>
                            <Progress
                              value={ach.progress}
                              dimension={ach.dimension ?? null}
                              aria-label={`${t(`achievements.items.${ach.id}.title`)} ${t('achievements.progressLabel')}`}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="bg-gradient-hero px-md py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
            {t('achievements.ctaTitle')}
          </h2>
          <p className="text-md text-text-secondary mb-2xl max-w-xl mx-auto">
            {t('achievements.ctaSubtitle')}
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href={`/${locale}/games`}>
              {t('achievements.ctaButton')}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      </div>
    </RequireAuth>
  )
}
