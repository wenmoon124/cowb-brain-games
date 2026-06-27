import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Card, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'

interface TermsPageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('pages.terms.title')
  const description = t('pages.terms.intro')
  const pathPrefix = `/${locale}/terms`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/terms',
        zh: '/zh/terms',
        ja: '/ja/terms',
        'x-default': '/en/terms',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function TermsPage({
  params,
}: TermsPageProps) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const sections = [
    {
      title: t('pages.terms.acceptance'),
      description: t('pages.terms.acceptanceDescription'),
    },
    {
      title: t('pages.terms.useOfService'),
      description: t('pages.terms.useOfServiceDescription'),
    },
    {
      title: t('pages.terms.accounts'),
      description: t('pages.terms.accountsDescription'),
    },
    {
      title: t('pages.terms.intellectualProperty'),
      description: t('pages.terms.intellectualPropertyDescription'),
    },
    {
      title: t('pages.terms.disclaimer'),
      description: t('pages.terms.disclaimerDescription'),
    },
    {
      title: t('pages.terms.liability'),
      description: t('pages.terms.liabilityDescription'),
    },
    {
      title: t('pages.terms.changes'),
      description: t('pages.terms.changesDescription'),
    },
  ]

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-3xl">
        <header className="mb-2xl text-center">
          <div className="mx-auto mb-md flex h-14 w-14 items-center justify-center rounded-full bg-secondary-light">
            <FileText className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-sm">
            {t('pages.terms.title')}
          </h1>
          <p className="text-sm text-text-muted">{t('pages.terms.lastUpdated')}</p>
        </header>

        <Card className="mb-xl">
          <CardContent className="p-xl">
            <p className="text-md text-text-secondary leading-relaxed">
              {t('pages.terms.intro')}
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-md">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardContent className="p-lg">
                <h2 className="text-lg font-semibold text-text-primary mb-sm">
                  {section.title}
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
