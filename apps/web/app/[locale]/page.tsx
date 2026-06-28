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
  Focus,
  Layers,
  Wind,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { DailyRecommendation } from '@/components/home/DailyRecommendation'
import { FeaturedArticles } from '@/components/home/FeaturedArticles'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { ARTICLES } from '@/data/articles'

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
      <section className="gradient-bg-flow px-md py-3xl md:py-5xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="info" className="mb-lg animate-float">
            <Sparkles className="mr-xs h-3 w-3" />
            {t('common.tagline')}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold gradient-text mb-lg leading-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary mb-2xl max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Button variant="primary" size="lg" className="animate-warm-glow" asChild>
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

      {/* Features Section - 为什么选择 CowB.cc? */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text text-center mb-3xl">
            {t('landing.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <Card className="text-center card-lift border-2 border-amber-200 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl">
              <CardHeader>
                <div className="mx-auto mb-lg flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 shadow-lg">
                  <Brain className="h-32 w-32 text-amber-600" />
                </div>
                <CardTitle className="text-2xl font-bold gradient-text">{t('landing.features.brainAge.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-md text-amber-800 leading-relaxed">
                  {t('landing.features.brainAge.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-lift border-2 border-orange-200 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl">
              <CardHeader>
                <div className="mx-auto mb-lg flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 shadow-lg">
                  <Gamepad2 className="h-32 w-32 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold gradient-text">{t('landing.features.games.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-md text-orange-800 leading-relaxed">
                  {t('landing.features.games.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center card-lift border-2 border-yellow-200 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl">
              <CardHeader>
                <div className="mx-auto mb-lg flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 shadow-lg">
                  <TrendingUp className="h-32 w-32 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl font-bold gradient-text">{t('landing.features.growth.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-md text-yellow-800 leading-relaxed">
                  {t('landing.features.growth.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Game Entry Cards Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text text-center mb-md">
            {t('games.title')}
          </h2>
          <p className="text-md text-text-secondary text-center mb-2xl">
            {t('games.description')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
            {dimensions.map((dim) => {
              const dimConfig: Record<string, { icon: typeof Brain; bg: string; text: string }> = {
                memory: { icon: Brain, bg: 'bg-dim-memory/15', text: 'text-dim-memory' },
                attention: { icon: Focus, bg: 'bg-dim-attention/15', text: 'text-dim-attention' },
                reaction: { icon: Zap, bg: 'bg-dim-reaction/15', text: 'text-dim-reaction' },
                executive: { icon: Layers, bg: 'bg-dim-executive/15', text: 'text-dim-executive' },
                relaxation: { icon: Wind, bg: 'bg-dim-relaxation/15', text: 'text-dim-relaxation' },
              }
              const config = dimConfig[dim] ?? { icon: Brain, bg: 'bg-primary/15', text: 'text-primary' }
              const DimIcon = config.icon
              return (
                <Card
                  key={dim}
                  className="card-lift flex flex-col items-center text-center"
                >
                  <CardContent className="flex flex-col items-center gap-sm p-lg">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${config.bg}`}>
                      <DimIcon className={`h-8 w-8 ${config.text}`} />
                    </div>
                    <Badge variant={dim} className="min-w-[80px] justify-center">
                      {t(`games.dimensions.${dim}`)}
                    </Badge>
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
              )
            })}
          </div>
        </div>
      </section>

      {/* Daily Recommendation */}
      <DailyRecommendation locale={locale} />

      {/* Featured Articles */}
      <FeaturedArticles locale={locale} articles={ARTICLES} />

      {/* Testimonials */}
      <TestimonialsSection locale={locale} />

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-md py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-md">
            {t('landing.hero.title')}
          </h2>
          <p className="text-md text-text-secondary mb-2xl">
            {t('landing.hero.subtitle')}
          </p>
          <Button variant="primary" size="xl" className="animate-warm-glow" asChild>
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
