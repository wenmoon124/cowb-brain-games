import type { Metadata } from 'next'
import { LOCALES, isValidLocale, type Locale } from '@/i18n/config'
import { getTranslations } from '@/i18n/translations'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { PageHeader } from '@/components/layout/page-header'
import { ARTICLES } from '@/data/articles'
import { ArticlesFilterClient } from './ArticlesFilterClient'

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
  const title = t('articles.pageText.title')
  const description = t('articles.pageText.subtitle')
  const pathPrefix = `/${locale}/articles`

  return {
    title,
    description,
    alternates: {
      canonical: pathPrefix,
      languages: {
        en: '/en/articles',
        zh: '/zh/articles',
        ja: '/ja/articles',
        'x-default': '/en/articles',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://cowb.cc${pathPrefix}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.svg'],
    },
  }
}

export default async function ArticlesPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = isValidLocale(params.locale) ? (params.locale as Locale) : 'en'
  const t = await getTranslations(locale)

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <BreadcrumbJsonLd
        items={[
          { name: t('nav.home'), url: `https://cowb.cc/${locale}` },
          { name: t('articles.pageText.title'), url: `https://cowb.cc/${locale}/articles` },
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title={t('articles.pageText.title')}
          description={t('articles.pageText.subtitle')}
        />

        {/* Client-side filter and list */}
        <ArticlesFilterClient
          articles={ARTICLES}
          locale={locale}
        />
      </div>
    </div>
  )
}
