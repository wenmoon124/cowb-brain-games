import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Clock, MessageCircle } from 'lucide-react'

const CONTACT_EMAIL = 'wenmoon124@gmail.com'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('pages.contact.title')
  const description = t('pages.contact.description')
  const pathPrefix = `/${locale}/contact`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/contact',
        zh: '/zh/contact',
        ja: '/ja/contact',
        'x-default': '/en/contact',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const items = [
    {
      icon: Mail,
      label: t('pages.contact.email'),
      value: CONTACT_EMAIL,
      description: t('pages.contact.emailDescription'),
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: Clock,
      label: t('pages.contact.responseTime'),
      value: '',
      description: t('pages.contact.responseTime'),
      href: null,
    },
    {
      icon: MessageCircle,
      label: t('pages.contact.title'),
      value: '',
      description: t('pages.contact.description'),
      href: null,
    },
  ]

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <header className="mb-3xl text-center">
          <div className="mx-auto mb-lg flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-md">
            {t('pages.contact.title')}
          </h1>
          <p className="text-md md:text-lg text-text-secondary max-w-2xl mx-auto">
            {t('pages.contact.description')}
          </p>
        </header>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 gap-md">
          {items.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-start gap-md p-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary-light">
                  <item.icon className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex flex-col gap-xs">
                  <h2 className="text-md font-semibold text-text-primary">
                    {item.label}
                  </h2>
                  {item.value && (
                    <p className="text-sm text-text-secondary">
                      {item.value}
                    </p>
                  )}
                  <p className="text-sm text-text-secondary">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Email Card */}
        <Card className="mt-xl border-primary-light bg-card">
          <CardHeader>
            <CardTitle className="text-text-primary">
              {t('pages.contact.email')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-sm rounded-md bg-primary-bg px-md py-sm text-md font-medium text-primary transition-colors hover:bg-primary-light"
            >
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
            <p className="mt-md text-sm text-text-secondary">
              {t('pages.contact.responseTime')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
