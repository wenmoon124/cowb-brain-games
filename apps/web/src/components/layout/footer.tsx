'use client'

import Link from 'next/link'
import { Twitter, Github, Mail } from 'lucide-react'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { Logo } from './logo'

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  const { t } = useTranslation(locale)
  const year = new Date().getFullYear()

  const links = [
    {
      href: `/${locale}/about`,
      label: t('nav.about'),
    },
    {
      href: `/${locale}/privacy`,
      label: t('footer.privacyPolicy'),
    },
    {
      href: `/${locale}/terms`,
      label: t('footer.termsOfService'),
    },
    {
      href: `/${locale}/contact`,
      label: t('footer.contactUs'),
    },
  ]

  const socials = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Mail, href: 'mailto:wenmoon124@gmail.com', label: 'Email' },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-md py-2xl">
        <div className="flex flex-col items-center gap-lg md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-sm md:items-start">
            <Logo locale={locale} size="md" />
            <p className="text-sm text-text-muted">{t('common.tagline')}</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-md">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-sm">
            <span className="text-sm text-text-muted">
              {t('footer.followUs')}
            </span>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary-bg hover:text-primary"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-lg border-t border-border-light pt-md text-center">
          <p className="text-xs text-text-muted">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}
