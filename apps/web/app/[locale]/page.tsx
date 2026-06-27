import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Gamepad2,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  return {
    title: t('landing.hero.title'),
    description: t('landing.hero.subtitle'),
  }
}

export default async function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const dimensions = [
    'memory',
    'attention',
    'reaction',
    'executive',
    'relaxation',
  ] as const

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-hero px-md py-3xl md:py-5xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="info" className="mb-lg">
            <Sparkles className="mr-xs h-3 w-3" />
            {t('common.tagline')}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-lg leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary mb-2xl max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href={`/${locale}/brain-age`}>
                {t('landing.hero.cta')}
                <ArrowRight className="ml-xs h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href={`/${locale}/about`}>
                {t('common.buttons.learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-2xl">
            {t('landing.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-md bg-primary-light">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('landing.features.brainAge.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {t('landing.features.brainAge.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-md bg-secondary-light">
                  <Gamepad2 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>{t('landing.features.games.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {t('landing.features.games.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-md bg-accent-light">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>{t('landing.features.growth.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {t('landing.features.growth.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Game Entry Cards Section */}
      <section className="bg-background-secondary px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-md">
            {t('games.title')}
          </h2>
          <p className="text-sm text-text-secondary text-center mb-2xl">
            {t('games.description')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
            {dimensions.map((dim) => (
              <Card
                key={dim}
                className="transition-transform hover:-translate-y-1"
              >
                <CardContent className="flex flex-col items-center gap-sm p-lg text-center">
                  <Badge variant={dim}>{t(`games.dimensions.${dim}`)}</Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href={`/${locale}/games?dimension=${dim}`}>
                      {t('games.playNow')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
            {t('landing.hero.title')}
          </h2>
          <p className="text-md text-text-secondary mb-2xl">
            {t('landing.hero.subtitle')}
          </p>
          <Button variant="primary" size="xl" asChild>
            <Link href={`/${locale}/games`}>
              {t('common.buttons.start')}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
