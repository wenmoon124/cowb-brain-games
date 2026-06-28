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
  const pathPrefix = `/${locale}/signup`

  return {
    title: t('auth.signUp.title'),
    description: t('auth.signUp.subtitle'),
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/signup',
        zh: '/zh/signup',
        ja: '/ja/signup',
        'x-default': '/en/signup',
      },
    },
    openGraph: {
      title: t('auth.signUp.title'),
      description: t('auth.signUp.subtitle'),
      url: `https://cowb.cc${pathPrefix}`,
    },
  }
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
