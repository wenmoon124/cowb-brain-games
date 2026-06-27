import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cowb.cc'),
  title: {
    default: 'BrainVerse',
    template: '%s | BrainVerse',
  },
  description:
    'BrainVerse — Science-based brain training to sharpen memory, focus, and cognition. Discover your brain age and train across 5 cognitive dimensions.',
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
    'BrainVerse',
  ],
  authors: [{ name: 'BrainVerse' }],
  creator: 'BrainVerse',
  publisher: 'BrainVerse',
  applicationName: 'BrainVerse',
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
    siteName: 'BrainVerse',
    locale: 'en_US',
    alternateLocale: ['zh_CN', 'ja_JP'],
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BrainVerse — Train Your Brain, Lower Your Brain Age',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrainVerse',
    description:
      'Science-based brain training to sharpen memory, focus, and cognition.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
  themeColor: '#4A7CFF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734481133057523"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
