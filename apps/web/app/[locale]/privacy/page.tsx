import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

interface PrivacyPageProps {
  params: { locale: string }
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('pages.privacy.title')
  const description = t('pages.privacy.intro')
  const pathPrefix = `/${locale}/privacy`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/privacy',
        zh: '/zh/privacy',
        ja: '/ja/privacy',
        'x-default': '/en/privacy',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function PrivacyPage({
  params,
}: PrivacyPageProps) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const sections = [
    {
      title: t('pages.privacy.dataWeCollect'),
      description: t('pages.privacy.dataWeCollectDescription'),
    },
    {
      title: t('pages.privacy.howWeUse'),
      description: t('pages.privacy.howWeUseDescription'),
    },
    {
      title: t('pages.privacy.dataSharing'),
      description: t('pages.privacy.dataSharingDescription'),
    },
    {
      title: t('pages.privacy.dataSecurity'),
      description: t('pages.privacy.dataSecurityDescription'),
    },
    {
      title: t('pages.privacy.yourRights'),
      description: t('pages.privacy.yourRightsDescription'),
    },
    {
      title: t('pages.privacy.cookies'),
      description: t('pages.privacy.cookiesDescription'),
    },
  ]

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-3xl">
        <header className="mb-2xl text-center">
          <div className="mx-auto mb-md flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-sm">
            {t('pages.privacy.title')}
          </h1>
          <p className="text-sm text-text-muted">{t('pages.privacy.lastUpdated')}</p>
        </header>

        <Card className="mb-xl">
          <CardContent className="p-xl">
            <p className="text-md text-text-secondary leading-relaxed">
              {t('pages.privacy.intro')}
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
