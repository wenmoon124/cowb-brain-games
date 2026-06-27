import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale, LOCALE_NAMES } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import {
  User,
  Settings,
  Award,
  LogIn,
  Globe,
  Zap,
  ArrowRight,
  Bell,
  Clock,
} from 'lucide-react'

type ProfileTexts = {
  title: string
  subtitle: string
  demoBadge: string
  userInfoTitle: string
  guestName: string
  memberSinceLabel: string
  memberSinceValue: string
  levelLabel: string
  levelValue: string
  signInButton: string
  preferencesTitle: string
  preferencesSubtitle: string
  languageLabel: string
  difficultyLabel: string
  difficultyValue: string
  dailyGoalLabel: string
  dailyGoalValue: string
  notificationsLabel: string
  notificationsValue: string
  achievementsTitle: string
  achievementsSubtitle: string
  achievementsViewAll: string
  unlocked: string
  locked: string
  accountActionsTitle: string
  accountActionsDesc: string
  signInCta: string
  signUpCta: string
}

const TEXTS: Record<Locale, ProfileTexts> = {
  en: {
    title: 'Profile',
    subtitle: 'Manage your account and preferences',
    demoBadge: 'Demo account',
    userInfoTitle: 'User information',
    guestName: 'Guest User',
    memberSinceLabel: 'Member since',
    memberSinceValue: '2026',
    levelLabel: 'Level',
    levelValue: 'Apprentice',
    signInButton: 'Sign In',
    preferencesTitle: 'Preferences',
    preferencesSubtitle: 'Your training and display settings.',
    languageLabel: 'Language',
    difficultyLabel: 'Difficulty',
    difficultyValue: 'Medium',
    dailyGoalLabel: 'Daily goal',
    dailyGoalValue: '15 minutes',
    notificationsLabel: 'Notifications',
    notificationsValue: 'Enabled',
    achievementsTitle: 'Achievements preview',
    achievementsSubtitle: 'A glimpse of your latest milestones.',
    achievementsViewAll: 'View all achievements',
    unlocked: 'Unlocked',
    locked: 'Locked',
    accountActionsTitle: 'Account',
    accountActionsDesc: 'Sign in to sync your progress or create a new account.',
    signInCta: 'Sign In',
    signUpCta: 'Sign Up',
  },
  zh: {
    title: '个人资料',
    subtitle: '管理你的账户与偏好设置',
    demoBadge: '示例账户',
    userInfoTitle: '用户信息',
    guestName: '访客用户',
    memberSinceLabel: '加入时间',
    memberSinceValue: '2026',
    levelLabel: '等级',
    levelValue: '学徒',
    signInButton: '登录',
    preferencesTitle: '偏好设置',
    preferencesSubtitle: '你的训练与显示设置。',
    languageLabel: '语言',
    difficultyLabel: '难度',
    difficultyValue: '中等',
    dailyGoalLabel: '每日目标',
    dailyGoalValue: '15 分钟',
    notificationsLabel: '通知',
    notificationsValue: '已开启',
    achievementsTitle: '成就预览',
    achievementsSubtitle: '你最新里程碑的一览。',
    achievementsViewAll: '查看全部成就',
    unlocked: '已解锁',
    locked: '未解锁',
    accountActionsTitle: '账户',
    accountActionsDesc: '登录以同步进度，或创建新账户。',
    signInCta: '登录',
    signUpCta: '注册',
  },
  ja: {
    title: 'プロフィール',
    subtitle: 'アカウントと設定を管理',
    demoBadge: 'デモアカウント',
    userInfoTitle: 'ユーザー情報',
    guestName: 'ゲストユーザー',
    memberSinceLabel: '登録年',
    memberSinceValue: '2026',
    levelLabel: 'レベル',
    levelValue: '見習い',
    signInButton: 'サインイン',
    preferencesTitle: '設定',
    preferencesSubtitle: 'トレーニングと表示の設定。',
    languageLabel: '言語',
    difficultyLabel: '難易度',
    difficultyValue: '中級',
    dailyGoalLabel: '1日の目標',
    dailyGoalValue: '15 分',
    notificationsLabel: '通知',
    notificationsValue: 'オン',
    achievementsTitle: '実績プレビュー',
    achievementsSubtitle: '最近のマイルストーンの一覧。',
    achievementsViewAll: 'すべての実績を見る',
    unlocked: '解放済み',
    locked: '未解放',
    accountActionsTitle: 'アカウント',
    accountActionsDesc: 'サインインして進捗を同期するか、新規アカウントを作成します。',
    signInCta: 'サインイン',
    signUpCta: 'サインアップ',
  },
}

type PreferenceRow = {
  icon: LucideIcon
  label: string
  value: string
}

type PreviewAchievement = {
  icon: LucideIcon
  unlocked: boolean
  tint: string
  iconColor: string
  title: Record<Locale, string>
  description: Record<Locale, string>
}

const PREVIEW_ACHIEVEMENTS: ReadonlyArray<PreviewAchievement> = [
  {
    icon: Award,
    unlocked: true,
    tint: 'bg-dim-memory/15',
    iconColor: 'text-dim-memory-text',
    title: {
      en: 'First Game',
      zh: '首局游戏',
      ja: '初回プレイ',
    },
    description: {
      en: 'Complete your first training game.',
      zh: '完成你的第一局训练游戏。',
      ja: '最初のトレーニングゲームを完了する。',
    },
  },
  {
    icon: Award,
    unlocked: true,
    tint: 'bg-dim-attention/15',
    iconColor: 'text-dim-attention-text',
    title: {
      en: '3-Day Streak',
      zh: '连续 3 天',
      ja: '3日連続',
    },
    description: {
      en: 'Train three days in a row.',
      zh: '连续三天进行训练。',
      ja: '3日連続でトレーニングする。',
    },
  },
  {
    icon: Award,
    unlocked: false,
    tint: 'bg-background-secondary',
    iconColor: 'text-text-muted',
    title: {
      en: 'Memory Novice',
      zh: '记忆新手',
      ja: 'メモリー初心者',
    },
    description: {
      en: 'Score 60+ in any memory game.',
      zh: '在任意记忆游戏中获得 60 分以上。',
      ja: '任意のメモリーゲームで60点以上を獲得する。',
    },
  },
]

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const texts = TEXTS[locale]
  const pathPrefix = `/${locale}/profile`

  return {
    title: texts.title,
    description: texts.subtitle,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/profile',
        zh: '/zh/profile',
        ja: '/ja/profile',
        'x-default': '/en/profile',
      },
    },
    openGraph: {
      title: texts.title,
      description: texts.subtitle,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const texts = TEXTS[locale]

  const preferences: ReadonlyArray<PreferenceRow> = [
    { icon: Globe, label: texts.languageLabel, value: LOCALE_NAMES[locale] },
    { icon: Zap, label: texts.difficultyLabel, value: texts.difficultyValue },
    { icon: Clock, label: texts.dailyGoalLabel, value: texts.dailyGoalValue },
    {
      icon: Bell,
      label: texts.notificationsLabel,
      value: texts.notificationsValue,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-hero px-md py-3xl md:py-4xl">
        <div className="mx-auto max-w-4xl">
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

      {/* User Info + Preferences */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* User Info Card */}
            <Card className="border-primary-light">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {texts.userInfoTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-lg text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="text-xl font-bold text-text-primary">
                    {texts.guestName}
                  </span>
                  <span className="text-sm text-text-muted">
                    {texts.memberSinceLabel}: {texts.memberSinceValue}
                  </span>
                </div>
                <Badge variant="info" className="w-fit">
                  {texts.levelLabel}: {texts.levelValue}
                </Badge>
                <Button variant="primary" size="md" asChild className="w-full">
                  <Link href={`/${locale}/signin`}>
                    <LogIn className="mr-xs h-4 w-4" />
                    {texts.signInButton}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card className="border-primary-light">
              <CardHeader>
                <div className="flex items-center gap-sm">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle className="text-text-primary">
                    {texts.preferencesTitle}
                  </CardTitle>
                </div>
                <p className="text-sm text-text-secondary">
                  {texts.preferencesSubtitle}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-md">
                {preferences.map((pref) => {
                  const Icon = pref.icon
                  return (
                    <div
                      key={pref.label}
                      className="flex items-center justify-between gap-md border-b border-border pb-md last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-light">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-text-secondary">
                          {pref.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-text-primary">
                        {pref.value}
                      </span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements Preview */}
      <section className="bg-background-secondary px-md py-3xl">
        <div className="mx-auto max-w-4xl">
          <div className="mb-xl">
            <div className="flex items-center gap-sm mb-xs">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                {texts.achievementsTitle}
              </h2>
            </div>
            <p className="text-sm text-text-secondary">
              {texts.achievementsSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
            {PREVIEW_ACHIEVEMENTS.map((ach) => {
              const Icon = ach.icon
              return (
                <Card
                  key={ach.title.en}
                  className={`border-primary-light ${ach.unlocked ? '' : 'opacity-75'}`}
                >
                  <CardContent
                    className={`flex flex-col items-center gap-md p-lg text-center ${ach.tint}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card">
                      <Icon className={`h-6 w-6 ${ach.iconColor}`} />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {ach.title[locale]}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {ach.description[locale]}
                    </span>
                    <Badge
                      variant={ach.unlocked ? 'success' : 'info'}
                      className="w-fit"
                    >
                      {ach.unlocked ? texts.unlocked : texts.locked}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="mt-xl text-center">
            <Button variant="secondary" size="md" asChild>
              <Link href={`/${locale}/achievements`}>
                {texts.achievementsViewAll}
                <ArrowRight className="ml-xs h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Account Actions */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-2xl">
          <Card className="border-primary-light">
            <CardContent className="flex flex-col items-center gap-lg p-xl text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col gap-sm">
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                  {texts.accountActionsTitle}
                </h2>
                <p className="text-md text-text-secondary max-w-md">
                  {texts.accountActionsDesc}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-md w-full sm:w-auto">
                <Button variant="primary" size="lg" asChild>
                  <Link href={`/${locale}/signin`}>
                    <LogIn className="mr-xs h-4 w-4" />
                    {texts.signInCta}
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href={`/${locale}/signup`}>
                    {texts.signUpCta}
                    <ArrowRight className="ml-xs h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
