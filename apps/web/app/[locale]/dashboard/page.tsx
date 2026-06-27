import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { gameHref, type GameDimension } from '@/lib/games'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import {
  Gamepad2,
  Trophy,
  Flame,
  Brain,
  ArrowRight,
  LogIn,
  Calendar,
} from 'lucide-react'

type DashboardTexts = {
  title: string
  subtitle: string
  statsSectionTitle: string
  dimensionsSectionTitle: string
  dimensionsSectionSubtitle: string
  recentActivityTitle: string
  recentActivitySubtitle: string
  scoreLabel: string
  loginPromptTitle: string
  loginPromptDesc: string
  signInButton: string
  demoBadge: string
}

const DASHBOARD_TEXTS: Record<Locale, DashboardTexts> = {
  en: {
    title: 'Your Dashboard',
    subtitle:
      'A snapshot of your training progress, dimension scores, and recent activity.',
    statsSectionTitle: 'Overview',
    dimensionsSectionTitle: 'Dimension progress',
    dimensionsSectionSubtitle:
      'Your normalized score (0–100) for each cognitive dimension.',
    recentActivityTitle: 'Recent activity',
    recentActivitySubtitle: 'Your latest training sessions.',
    scoreLabel: 'Score',
    loginPromptTitle: 'Sign in to sync your progress',
    loginPromptDesc:
      'Create an account or sign in to keep your brain age, streaks, and history across devices.',
    signInButton: 'Sign In',
    demoBadge: 'Demo data',
  },
  zh: {
    title: '你的仪表盘',
    subtitle: '查看你的训练进度、各维度分数与近期活动概览。',
    statsSectionTitle: '总览',
    dimensionsSectionTitle: '各维度进度',
    dimensionsSectionSubtitle: '每个认知维度的归一化分数（0–100）。',
    recentActivityTitle: '近期活动',
    recentActivitySubtitle: '你最近的训练记录。',
    scoreLabel: '分数',
    loginPromptTitle: '登录以同步你的进度',
    loginPromptDesc:
      '创建账户或登录，即可在多设备间同步你的大脑年龄、连续打卡与历史记录。',
    signInButton: '登录',
    demoBadge: '示例数据',
  },
  ja: {
    title: 'ダッシュボード',
    subtitle: 'トレーニングの進捗、次元別スコア、最近のアクティビティの概要。',
    statsSectionTitle: '概要',
    dimensionsSectionTitle: '次元別の進捗',
    dimensionsSectionSubtitle: '各認知次元の正規化スコア（0〜100）。',
    recentActivityTitle: '最近のアクティビティ',
    recentActivitySubtitle: '直近のトレーニング履歴。',
    scoreLabel: 'スコア',
    loginPromptTitle: 'サインインして進捗を同期',
    loginPromptDesc:
      'アカウントを作成またはサインインすると、脳年齢・連続日数・履歴を端末間で同期できます。',
    signInButton: 'サインイン',
    demoBadge: 'デモデータ',
  },
}

type StatEntry = {
  icon: LucideIcon
  accent: string
  texts: Record<Locale, { value: string; label: string }>
}

const STATS: ReadonlyArray<StatEntry> = [
  {
    icon: Gamepad2,
    accent: 'bg-primary-light',
    texts: {
      en: { value: '47', label: 'Games Played' },
      zh: { value: '47', label: '已玩游戏' },
      ja: { value: '47', label: 'プレイ数' },
    },
  },
  {
    icon: Trophy,
    accent: 'bg-accent-light',
    texts: {
      en: { value: '3,250', label: 'Best Score' },
      zh: { value: '3,250', label: '最高分' },
      ja: { value: '3,250', label: '最高スコア' },
    },
  },
  {
    icon: Flame,
    accent: 'bg-secondary-light',
    texts: {
      en: { value: '12 days', label: 'Current Streak' },
      zh: { value: '12 天', label: '连续打卡' },
      ja: { value: '12 日', label: '連続日数' },
    },
  },
  {
    icon: Brain,
    accent: 'bg-primary-light',
    texts: {
      en: { value: '28', label: 'Brain Age' },
      zh: { value: '28', label: '大脑年龄' },
      ja: { value: '28', label: '脳年齢' },
    },
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

function formatDate(iso: string, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  return formatter.format(new Date(`${iso}T00:00:00`))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const texts = DASHBOARD_TEXTS[locale]
  const pathPrefix = `/${locale}/dashboard`

  return {
    title: texts.title,
    description: texts.subtitle,
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
      title: texts.title,
      description: texts.subtitle,
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
  const texts = DASHBOARD_TEXTS[locale]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-hero px-md py-3xl md:py-4xl">
        <div className="mx-auto max-w-5xl">
          <Badge variant="info" className="mb-md w-fit">
            {texts.demoBadge}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {texts.title}
          </h1>
          <p className="text-md text-text-secondary max-w-2xl">
            {texts.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-xl">
            {texts.statsSectionTitle}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-lg">
            {STATS.map((stat) => {
              const Icon = stat.icon
              const statText = stat.texts[locale]
              return (
                <Card key={statText.label} className="border-primary-light">
                  <CardContent className="flex items-center gap-md p-lg">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${stat.accent}`}
                    >
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold text-text-primary leading-tight">
                        {statText.value}
                      </span>
                      <span className="text-sm text-text-secondary">
                        {statText.label}
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
              {texts.dimensionsSectionTitle}
            </h2>
            <p className="text-sm text-text-secondary max-w-2xl">
              {texts.dimensionsSectionSubtitle}
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
              {texts.recentActivityTitle}
            </h2>
            <p className="text-sm text-text-secondary max-w-2xl">
              {texts.recentActivitySubtitle}
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
                        {texts.scoreLabel}
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

      {/* Login Prompt */}
      <section className="bg-gradient-hero px-md py-3xl">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary-light">
            <CardContent className="flex flex-col items-center gap-lg p-xl text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col gap-sm">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                  {texts.loginPromptTitle}
                </h2>
                <p className="text-md text-text-secondary max-w-md">
                  {texts.loginPromptDesc}
                </p>
              </div>
              <Button variant="primary" size="lg" asChild>
                <Link href={`/${locale}/signin`}>
                  {texts.signInButton}
                  <ArrowRight className="ml-xs h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
