import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, LogIn, Sparkles } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('nav.achievements')
  const description = t('pages.achievements.loginRequiredDescription')
  const pathPrefix = `/${locale}/achievements`

  return {
    title,
    description,
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
      title,
      description,
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

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-2xl">
        <Card className="border-accent-light">
          <CardContent className="flex flex-col items-center justify-center gap-lg p-3xl text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light">
              <Trophy className="h-8 w-8 text-accent" />
            </div>
            <div className="flex flex-col gap-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                {t('nav.achievements')}
              </h1>
              <p className="text-md text-text-secondary max-w-md">
                {t('pages.achievements.loginRequired')}
              </p>
              <p className="text-sm text-text-muted max-w-md">
                {t('pages.achievements.loginRequiredDescription')}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-md">
              <Button variant="primary" size="lg" asChild>
                <Link href={`/${locale}/signin`}>
                  <LogIn className="mr-xs h-4 w-4" />
                  {t('pages.dashboard.signInButton')}
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href={`/${locale}/games`}>
                  <Sparkles className="mr-xs h-4 w-4" />
                  {t('games.title')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
