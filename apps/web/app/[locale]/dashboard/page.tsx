import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { gameHref, type GameDimension } from '@/lib/games'
import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RequireAuth } from '@/components/auth/RequireAuth'
import type { LucideIcon } from 'lucide-react'
import {
  Gamepad2,
  Trophy,
  Flame,
  Brain,
  Calendar,
} from 'lucide-react'

type StatKey = 'gamesPlayed' | 'bestScore' | 'currentStreak' | 'brainAge'

type StatEntry = {
  icon: LucideIcon
  accent: string
  statKey: StatKey
}

const STATS: ReadonlyArray<StatEntry> = [
  {
    icon: Gamepad2,
    accent: 'bg-primary-light',
    statKey: 'gamesPlayed',
  },
  {
    icon: Trophy,
    accent: 'bg-accent-light',
    statKey: 'bestScore',
  },
  {
    icon: Flame,
    accent: 'bg-secondary-light',
    statKey: 'currentStreak',
  },
  {
    icon: Brain,
    accent: 'bg-primary-light',
    statKey: 'brainAge',
  },
]

const DIMENSION_STYLES: Record<
  GameDimension,
  { bar: string; text: string; bg: string }
> = {
  memory: {
    bar: 'bg-dim-memory',
    text: 'text-dim-memory-text',
    bg: 'bg-dim-memory/15',
  },
  attention: {
    bar: 'bg-dim-attention',
    text: 'text-dim-attention-text',
    bg: 'bg-dim-attention/15',
  },
  reaction: {
    bar: 'bg-dim-reaction',
    text: 'text-dim-reaction-text',
    bg: 'bg-dim-reaction/15',
  },
  executive: {
    bar: 'bg-dim-executive',
    text: 'text-dim-executive-text',
    bg: 'bg-dim-executive/15',
  },
  relaxation: {
    bar: 'bg-dim-relaxation',
    text: 'text-dim-relaxation-text',
    bg: 'bg-dim-relaxation/15',
  },
}

const DIMENSION_PROGRESS: ReadonlyArray<{
  key: GameDimension
  score: number
}> = [
  { key: 'memory', score: 75 },
  { key: 'attention', score: 60 },
  { key: 'reaction', score: 80 },
  { key: 'executive', score: 55 },
  { key: 'relaxation', score: 70 },
]

type ActivityEntry = {
  slug: string
  titleKey: string
  dimension: GameDimension
  score: number
  dateIso: string
}

const RECENT_ACTIVITY: ReadonlyArray<ActivityEntry> = [
  {
    slug: 'digit-span',
    titleKey: 'games.digitSpan.title',
    dimension: 'memory',
    score: 820,
    dateIso: '2026-06-25',
  },
  {
    slug: 'stroop-challenge',
    titleKey: 'games.stroopChallenge.title',
    dimension: 'executive',
    score: 950,
    dateIso: '2026-06-24',
  },
  {
    slug: 'reaction-training',
    titleKey: 'games.reactionTraining.title',
    dimension: 'reaction',
    score: 680,
    dateIso: '2026-06-23',
  },
  {
    slug: 'memory-matrix',
    titleKey: 'games.memoryMatrix.title',
    dimension: 'memory',
    score: 800,
    dateIso: '2026-06-22',
  },
]

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const pathPrefix = `/${locale}/dashboard`

  return {
    title: t('dashboard.title'),
    description: t('dashboard.subtitle'),
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/dashboard',
        zh: '/zh/dashboard',
        ja: '/ja/dashboard',
        'x-default': '/en/dashboard',
      },
    },
    openGraph: {
      title: t('dashboard.title'),
      description: t('dashboard.subtitle'),
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function DashboardPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  return (
    <RequireAuth locale={locale as Locale} pageKey="dashboard">
      <div className="flex flex-col">
        {/* Header */}
        <section className="bg-gradient-hero px-md py-3xl md:py-4xl">
          <div className="mx-auto max-w-5xl">
            <Badge variant="info" className="mb-md w-fit">
              {t('dashboard.demoBadge')}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
              {t('dashboard.title')}
            </h1>
            <p className="text-md text-text-secondary max-w-2xl">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </section>

      {/* Stats Overview */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xl">
            {t('dashboard.statsSectionTitle')}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg">
            {STATS.map((stat) => {
              const Icon = stat.icon
              const label = t(`dashboard.statsLabels.${stat.statKey}`)
              const value = t(`dashboard.statsValues.${stat.statKey}`)
              return (
                <Card key={stat.statKey} className="border-primary-light">
                  <CardContent className="flex items-center gap-md p-lg">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${stat.accent}`}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                        {value}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dimension Progress */}
      <section className="bg-background-secondary px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <div className="mb-xl">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xs">
              {t('dashboard.dimensionsSectionTitle')}
            </h2>
            <p className="text-sm text-text-secondary max-w-2xl">
              {t('dashboard.dimensionsSectionSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {DIMENSION_PROGRESS.map((dim) => {
              const styles = DIMENSION_STYLES[dim.key]
              return (
                <Card key={dim.key} className="border-primary-light">
                  <CardContent className="flex flex-col gap-md p-lg">
                    <div className="flex items-center justify-between gap-md">
                      <div className="flex items-center gap-sm">
                        <Badge variant={dim.key}>{t(`games.dimensions.${dim.key}`)}</Badge>
                        <span className={`text-sm font-semibold ${styles.text}`}>
                          {t(`games.dimensions.${dim.key}`)}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${styles.text}`}>
                        {dim.score}%
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={dim.score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={t(`games.dimensions.${dim.key}`)}
                    >
                      <div
                        className={`h-full rounded-full ${styles.bar}`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <div className="mb-xl">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xs">
              {t('dashboard.recentActivityTitle')}
            </h2>
            <p className="text-sm text-text-secondary max-w-2xl">
              {t('dashboard.recentActivitySubtitle')}
            </p>
          </div>
          <Card className="border-primary-light">
            <CardContent className="flex flex-col p-0">
              {RECENT_ACTIVITY.map((entry, index) => {
                const styles = DIMENSION_STYLES[entry.dimension]
                return (
                  <div
                    key={entry.slug}
                    className={`flex items-center justify-between gap-md p-lg ${
                      index !== 0 ? 'border-t border-border' : ''
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-md">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${styles.bg}`}
                      >
                        <Calendar className={`h-5 w-5 ${styles.text}`} />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <Link
                          href={gameHref(locale, entry.slug)}
                          className="truncate text-md font-semibold text-text-primary hover:text-primary"
                        >
                          {t(entry.titleKey)}
                        </Link>
                        <span className="text-xs text-text-muted">
                          {formatDate(entry.dateIso, locale)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-sm">
                      <span className="text-xs text-text-muted">
                        {t('dashboard.scoreLabel')}
                      </span>
                      <span className={`text-md font-bold ${styles.text}`}>
                        {entry.score.toLocaleString(locale)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </RequireAuth>
  )
}
