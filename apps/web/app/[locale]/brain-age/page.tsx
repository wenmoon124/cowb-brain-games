import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { getGamesByDimension, type GameDimension } from '@/lib/games'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import {
  Brain,
  Focus,
  Zap,
  Layers,
  Wind,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

type DimensionEntry = {
  key: GameDimension
  icon: LucideIcon
  bgClass: string
  textClass: string
}

const DIMENSIONS: ReadonlyArray<DimensionEntry> = [
  {
    key: 'memory',
    icon: Brain,
    bgClass: 'bg-dim-memory/15',
    textClass: 'text-dim-memory-text',
  },
  {
    key: 'attention',
    icon: Focus,
    bgClass: 'bg-dim-attention/15',
    textClass: 'text-dim-attention-text',
  },
  {
    key: 'reaction',
    icon: Zap,
    bgClass: 'bg-dim-reaction/15',
    textClass: 'text-dim-reaction-text',
  },
  {
    key: 'executive',
    icon: Layers,
    bgClass: 'bg-dim-executive/15',
    textClass: 'text-dim-executive-text',
  },
  {
    key: 'relaxation',
    icon: Wind,
    bgClass: 'bg-dim-relaxation/15',
    textClass: 'text-dim-relaxation-text',
  },
]

const PROCESS_STEPS = [
  { icon: Brain, step: 1, titleKey: 'step1Title', descKey: 'step1Desc' },
  { icon: Target, step: 2, titleKey: 'step2Title', descKey: 'step2Desc' },
  { icon: CheckCircle, step: 3, titleKey: 'step3Title', descKey: 'step3Desc' },
] as const

const BENEFITS = [
  { key: 'improvedMemory', icon: Brain },
  { key: 'betterFocus', icon: Focus },
  { key: 'fasterReaction', icon: Zap },
  { key: 'enhancedProblemSolving', icon: Layers },
  { key: 'reducedStress', icon: Wind },
  { key: 'betterSleep', icon: Sparkles },
  { key: 'increasedProductivity', icon: TrendingUp },
  { key: 'sharperMind', icon: Target },
] as const

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('brainAge.title')
  const description = t('brainAge.subtitle')
  const pathPrefix = `/${locale}/brain-age`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/brain-age',
        zh: '/zh/brain-age',
        ja: '/ja/brain-age',
        'x-default': '/en/brain-age',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function BrainAgePage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-hero px-md py-3xl md:py-5xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="info" className="mb-lg">
            <Sparkles className="mr-xs h-3 w-3" />
            {t('brainAge.heroBadge')}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-lg leading-tight">
            {t('brainAge.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary mb-2xl max-w-2xl mx-auto">
            {t('brainAge.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href={`/${locale}/games`}>
                {t('brainAge.heroCta')}
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

      {/* Five Dimensions Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3xl text-center">
            <Badge variant="info" className="mb-md">
              <Sparkles className="mr-xs h-3 w-3" />
              {t('brainAge.dimensionsBadge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-md">
              {t('brainAge.dimensionsSectionTitle')}
            </h2>
            <p className="text-md text-text-secondary max-w-2xl mx-auto">
              {t('brainAge.dimensionsSectionSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-xl">
            {DIMENSIONS.map((dim) => {
              const count = getGamesByDimension(dim.key).length
              const Icon = dim.icon
              return (
                <Card
                  key={dim.key}
                  className="border-2 border-primary-light flex flex-col card-lift hover:shadow-glow-primary bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-lg flex h-40 w-40 items-center justify-center rounded-full ${dim.bgClass} shadow-lg`}>
                      <Icon className={`h-20 w-20 ${dim.textClass}`} />
                    </div>
                    <Badge variant={dim.key} className="mb-sm w-fit mx-auto">
                      {t(`games.dimensions.${dim.key}`)}
                    </Badge>
                    <CardTitle className="text-text-primary text-xl font-bold">
                      {t(`games.dimensions.${dim.key}`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-md">
                    <p className="text-sm text-text-secondary flex-1 text-center leading-relaxed">
                      {t(`brainAge.dimensionDescriptions.${dim.key}`)}
                    </p>
                    <div
                      className={`flex items-center gap-xs rounded-md ${dim.bgClass} px-md py-sm`}
                    >
                      <Clock className={`h-4 w-4 ${dim.textClass}`} />
                      <span className={`text-sm font-semibold ${dim.textClass}`}>
                        {t('brainAge.gamesLabel', { count })}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href={`/${locale}/games?dimension=${dim.key}`}>
                        {t('brainAge.exploreLabel')}
                        <ArrowRight className="ml-xs h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Assessment Process Section */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <div className="mb-3xl text-center">
            <Badge variant="info" className="mb-md">
              <Target className="mr-xs h-3 w-3" />
              {t('brainAge.processBadge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-md">
              {t('brainAge.processTitle')}
            </h2>
            <p className="text-md text-text-secondary max-w-2xl mx-auto">
              {t('brainAge.processSubtitle')}
            </p>
          </div>
          <div className="relative">
            {/* Vertical connecting line with gradient */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent md:left-1/2 md:-translate-x-1/2 rounded-full" />

            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0
              return (
                <div
                  key={step.step}
                  className={`relative mb-2xl last:mb-0 md:flex md:items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step circle with glow */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-2xl shadow-glow-primary animate-warm-glow">
                      <Icon className="h-10 w-10" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-28 md:ml-0 md:w-1/2 ${
                      isEven ? 'md:pr-3xl' : 'md:pl-3xl'
                    }`}
                  >
                    <Card className="border-2 border-primary-light card-lift bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-glow-primary">
                      <CardContent className="p-xl">
                        <div className="flex items-center gap-md mb-md">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-lg font-bold text-text-primary shadow-md">
                            {step.step}
                          </div>
                          <h3 className="text-xl font-bold gradient-text">
                            {t(`brainAge.${step.titleKey}`)}
                          </h3>
                        </div>
                        <p className="text-md text-text-secondary leading-relaxed">
                          {t(`brainAge.${step.descKey}`)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3xl text-center">
            <Badge variant="info" className="mb-md">
              <TrendingUp className="mr-xs h-3 w-3" />
              {t('brainAge.benefitsBadge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-md">
              {t('brainAge.benefitsTitle')}
            </h2>
            <p className="text-md text-text-secondary max-w-2xl mx-auto">
              {t('brainAge.benefitsSubtitle')}
            </p>
          </div>
          <div className="flex gap-xl overflow-x-auto pb-xl snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary scrollbar-track-background-secondary">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={benefit.key}
                  className="flex-shrink-0 w-[320px] snap-start card-lift border-2 border-primary-light bg-white/90 backdrop-blur-sm hover:shadow-glow-primary"
                >
                  <CardContent className="p-xl">
                    <div className="mb-lg flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-md">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold gradient-text mb-md">
                      {t(`brainAge.benefits.${benefit.key}.title`)}
                    </h3>
                    <p className="text-md text-text-secondary leading-relaxed">
                      {t(`brainAge.benefits.${benefit.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-3xl">
          <Card className="border-primary-light">
            <CardContent className="p-xl">
              <div className="mb-md flex items-center gap-sm">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                  {t('brainAge.scienceTitle')}
                </h2>
              </div>
              <p className="text-md text-text-secondary leading-relaxed mb-md">
                {t('brainAge.scienceBody')}
              </p>
              <p className="text-xs text-text-muted italic">
                {t('brainAge.scienceCitation')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-hero px-md py-3xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
            {t('brainAge.finalCtaTitle')}
          </h2>
          <p className="text-md text-text-secondary mb-2xl max-w-xl mx-auto">
            {t('brainAge.finalCtaSubtitle')}
          </p>
          <Button variant="primary" size="xl" asChild>
            <Link href={`/${locale}/games`}>
              {t('brainAge.startButton')}
              <ArrowRight className="ml-xs h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
