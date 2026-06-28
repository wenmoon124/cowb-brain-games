import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'CowB.cc',
    template: '%s | CowB.cc',
  },
  description:
    'CowB.cc — Science-based brain training to sharpen memory, focus, and cognition. Discover your brain age and train across 5 cognitive dimensions.',
  keywords: [
    'brain training',
    'brain age',
    'cognitive training',
    'memory training',
    'attention training',
    'reaction time',
    'executive function',
    'relaxation',
    'brain games',
    'CowB.cc',
  ],
  authors: [{ name: 'CowB.cc' }],
  creator: 'CowB.cc',
  publisher: 'CowB.cc',
  applicationName: 'CowB.cc',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'CowB.cc',
    locale: 'en_US',
    alternateLocale: ['zh_CN', 'ja_JP'],
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CowB.cc — Train Your Brain, Lower Your Brain Age',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CowB.cc',
    description:
      'Science-based brain training to sharpen memory, focus, and cognition.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
  verification: {
    other: {
      'google-adsense-account': 'ca-pub-4734481133057523',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FF6B35',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* TODO(wenmoon124): Cloudflare Web Analytics — get token from Cloudflare Dashboard, then uncomment:
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "REAL_TOKEN_HERE"}'
          strategy="afterInteractive"
        />
        */}
      </body>
    </html>
  )
}
