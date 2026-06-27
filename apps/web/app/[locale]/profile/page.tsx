import type { Metadata } from 'next'
import Link from 'next/link'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, LogIn } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const title = t('nav.profile')
  const description = t('pages.profile.loginRequiredDescription')
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

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary-light">
          <CardContent className="flex flex-col items-center justify-center gap-lg p-3xl text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-light">
              <User className="h-8 w-8 text-secondary" />
            </div>
            <div className="flex flex-col gap-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                {t('nav.profile')}
              </h1>
              <p className="text-md text-text-secondary max-w-md">
                {t('pages.profile.loginRequired')}
              </p>
              <p className="text-sm text-text-muted max-w-md">
                {t('pages.profile.loginRequiredDescription')}
              </p>
            </div>
            <Button variant="primary" size="lg" asChild>
              <Link href={`/${locale}/signin`}>
                <LogIn className="mr-xs h-4 w-4" />
                {t('pages.dashboard.signInButton')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
