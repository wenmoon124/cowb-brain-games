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
      <section className="px-md py-3xl">
        <div className="mx-auto max-w-6xl">
          <div className="mb-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
              {t('brainAge.dimensionsSectionTitle')}
            </h2>
            <p className="text-sm md:text-md text-text-secondary max-w-2xl mx-auto">
              {t('brainAge.dimensionsSectionSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-lg">
            {DIMENSIONS.map((dim) => {
              const count = getGamesByDimension(dim.key).length
              const Icon = dim.icon
              return (
                <Card
                  key={dim.key}
                  className="border-primary-light flex flex-col"
                >
                  <CardHeader>
                    <div className="mb-md flex h-10 w-10 items-center justify-center rounded-md bg-primary-light">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant={dim.key} className="mb-xs w-fit">
                      {t(`games.dimensions.${dim.key}`)}
                    </Badge>
                    <CardTitle className="text-text-primary">
                      {t(`games.dimensions.${dim.key}`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-md">
                    <p className="text-sm text-text-secondary flex-1">
                      {t(`brainAge.dimensionDescriptions.${dim.key}`)}
                    </p>
                    <div
                      className={`flex items-center gap-xs rounded-md ${dim.bgClass} px-md py-sm`}
                    >
                      <Clock className={`h-3 w-3 ${dim.textClass}`} />
                      <span className={`text-xs font-medium ${dim.textClass}`}>
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
                        <ArrowRight className="ml-xs h-3 w-3" />
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
      <section className="bg-background-secondary px-md py-3xl">
        <div className="mx-auto max-w-5xl">
          <div className="mb-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-md">
              {t('brainAge.processTitle')}
            </h2>
            <p className="text-sm md:text-md text-text-secondary max-w-2xl mx-auto">
              {t('brainAge.processSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <Card key={step.step} className="border-primary-light text-center">
                  <CardHeader>
                    <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mx-auto mb-xs flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {step.step}
                    </div>
                    <CardTitle className="text-text-primary">
                      {t(`brainAge.${step.titleKey}`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary">
                      {t(`brainAge.${step.descKey}`)}
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
