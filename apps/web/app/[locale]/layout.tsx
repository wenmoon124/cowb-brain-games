import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BottomNav } from '@/components/layout/bottom-nav'
import { CookieConsent } from '@/components/layout/cookie-consent'
import { ToastContainer } from '@/components/ui/toast'
import {
  LOCALES,
  LOCALE_HTML_LANG,
  LOCALE_OG,
  isValidLocale,
  type Locale,
} from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'
  const t = await getTranslations(locale as Locale)

  const title = t('landing.hero.title')
  const description = t('landing.hero.subtitle')
  const pathPrefix = `/${locale}`

  return {
    title,
    description,
    alternates: {
      canonical: `${pathPrefix}`,
      languages: {
        en: '/en',
        zh: '/zh',
        ja: '/ja',
        'x-default': '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
      locale: LOCALE_OG[locale as Locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_OG[l]
      ),
    },
    twitter: {
      title,
      description,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!isValidLocale(params.locale)) {
    notFound()
  }

  const locale = params.locale as Locale

  return (
    <div lang={LOCALE_HTML_LANG[locale]} data-locale={locale}>
      <Navbar locale={locale} />
      <main className="min-h-screen pt-14 pb-20 md:pb-0">{children}</main>
      <Footer locale={locale} />
      <BottomNav locale={locale} />
      <CookieConsent locale={locale} />
      <ToastContainer />
    </div>
  )
}
