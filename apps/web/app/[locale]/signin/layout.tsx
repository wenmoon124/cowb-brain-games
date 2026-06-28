import type { Metadata } from 'next'
import { isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)
  const pathPrefix = `/${locale}/signin`

  return {
    title: t('auth.signIn.title'),
    description: t('auth.signIn.subtitle'),
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/signin',
        zh: '/zh/signin',
        ja: '/ja/signin',
        'x-default': '/en/signin',
      },
    },
    openGraph: {
      title: t('auth.signIn.title'),
      description: t('auth.signIn.subtitle'),
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
