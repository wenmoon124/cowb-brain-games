import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale, LOCALE_NAMES } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
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

type PreferenceRow = {
  icon: LucideIcon
  label: string
  value: string
}

type PreviewAchievement = {
  id: string
  icon: LucideIcon
  unlocked: boolean
  tint: string
  iconColor: string
}

const PREVIEW_ACHIEVEMENTS: ReadonlyArray<PreviewAchievement> = [
  {
    id: 'first-game',
    icon: Award,
    unlocked: true,
    tint: 'bg-dim-memory/15',
    iconColor: 'text-dim-memory-text',
  },
  {
    id: '3-day-streak',
    icon: Award,
    unlocked: true,
    tint: 'bg-dim-attention/15',
    iconColor: 'text-dim-attention-text',
  },
  {
    id: 'memory-novice',
    icon: Award,
    unlocked: false,
    tint: 'bg-background-secondary',
    iconColor: 'text-text-muted',
  },
]

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('profile.title')
  const description = t('profile.subtitle')
  const pathPrefix = `/${locale}/profile`

  return {
    title,
    description,
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
      title,
      description,
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
  const t = await getTranslations(locale as Locale)

  const preferences: ReadonlyArray<PreferenceRow> = [
    { icon: Globe, label: t('profile.languageLabel'), value: LOCALE_NAMES[locale] },
    { icon: Zap, label: t('profile.difficultyLabel'), value: t('profile.difficultyValue') },
    { icon: Clock, label: t('profile.dailyGoalLabel'), value: t('profile.dailyGoalValue') },
    {
      icon: Bell,
      label: t('profile.notificationsLabel'),
      value: t('profile.notificationsValue'),
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-hero px-md py-3xl md:py-4xl">
        <div className="mx-auto max-w-4xl">
          <Badge variant="info" className="mb-md w-fit">
            {t('profile.demoBadge')}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {t('profile.title')}
          </h1>
          <p className="text-md text-text-secondary max-w-2xl">
            {t('profile.subtitle')}
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
                  {t('profile.userInfoTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-lg text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="text-xl font-bold text-text-primary">
                    {t('profile.guestName')}
                  </span>
                  <span className="text-sm text-text-muted">
                    {t('profile.memberSinceLabel')}: {t('profile.memberSinceValue')}
                  </span>
                </div>
                <Badge variant="info" className="w-fit">
                  {t('profile.levelLabel')}: {t('profile.levelValue')}
                </Badge>
                <Button variant="primary" size="md" asChild className="w-full">
                  <Link href={`/${locale}/signin`}>
                    <LogIn className="mr-xs h-4 w-4" />
                    {t('profile.signInButton')}
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
                    {t('profile.preferencesTitle')}
                  </CardTitle>
                </div>
                <p className="text-sm text-text-secondary">
                  {t('profile.preferencesSubtitle')}
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
                {t('profile.achievementsTitle')}
              </h2>
            </div>
            <p className="text-sm text-text-secondary">
              {t('profile.achievementsSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
            {PREVIEW_ACHIEVEMENTS.map((ach) => {
              const Icon = ach.icon
              return (
                <Card
                  key={ach.id}
                  className={`border-primary-light ${ach.unlocked ? '' : 'opacity-75'}`}
                >
                  <CardContent
                    className={`flex flex-col items-center gap-md p-lg text-center ${ach.tint}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card">
                      <Icon className={`h-6 w-6 ${ach.iconColor}`} />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {t(`profile.previewAchievements.${ach.id}.title`)}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {t(`profile.previewAchievements.${ach.id}.description`)}
                    </span>
                    <Badge
                      variant={ach.unlocked ? 'success' : 'info'}
                      className="w-fit"
                    >
                      {ach.unlocked ? t('profile.unlocked') : t('profile.locked')}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="mt-xl text-center">
            <Button variant="secondary" size="md" asChild>
              <Link href={`/${locale}/achievements`}>
                {t('profile.achievementsViewAll')}
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
                  {t('profile.accountActionsTitle')}
                </h2>
                <p className="text-md text-text-secondary max-w-md">
                  {t('profile.accountActionsDesc')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-md w-full sm:w-auto">
                <Button variant="primary" size="lg" asChild>
                  <Link href={`/${locale}/signin`}>
                    <LogIn className="mr-xs h-4 w-4" />
                    {t('profile.signInCta')}
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href={`/${locale}/signup`}>
                    {t('profile.signUpCta')}
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
