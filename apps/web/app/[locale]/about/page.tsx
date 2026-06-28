import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Code2, FlaskConical, Rocket } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('pages.about.title')
  const description = t('pages.about.missionDescription')
  const pathPrefix = `/${locale}/about`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/about',
        zh: '/zh/about',
        ja: '/ja/about',
        'x-default': '/en/about',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const pillars = [
    {
      icon: Brain,
      title: t('pages.about.mission'),
      description: t('pages.about.missionDescription'),
      accent: 'bg-primary-light text-primary',
    },
    {
      icon: Code2,
      title: t('pages.about.technology'),
      description: t('pages.about.technologyDescription'),
      accent: 'bg-secondary-light text-secondary',
    },
    {
      icon: FlaskConical,
      title: t('pages.about.science'),
      description: t('pages.about.scienceDescription'),
      accent: 'bg-accent-light text-accent',
    },
  ]

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <header className="mb-3xl text-center">
          <div className="mx-auto mb-lg flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <Rocket className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {t('pages.about.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary max-w-2xl mx-auto">
            {t('pages.about.storyDescription')}
          </p>
        </header>

        {/* Pillars */}
        <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="card-lift border-primary-light">
              <CardHeader>
                <div
                  className={`mb-md flex h-16 w-16 items-center justify-center rounded-full ${pillar.accent}`}
                >
                  <pillar.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-text-primary text-lg">
                  {pillar.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Card */}
        <Card className="mt-2xl border-2 border-primary-light bg-card card-lift">
          <CardContent className="p-2xl">
            <h2 className="text-2xl font-bold text-text-primary mb-lg">
              {t('pages.about.story')}
            </h2>
            <p className="text-md text-text-secondary leading-relaxed">
              {t('pages.about.storyDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
