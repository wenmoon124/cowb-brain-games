'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Brain } from 'lucide-react'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { LanguageSwitcher } from './language-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  locale: Locale
}

export function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname()
  const { t } = useTranslation(locale)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: `/${locale}`, label: t('nav.home'), key: 'home' },
    { href: `/${locale}/games`, label: t('nav.games'), key: 'games' },
    { href: `/${locale}/brain-age`, label: t('nav.brainAge'), key: 'brain-age' },
    { href: `/${locale}/articles`, label: t('nav.articles'), key: 'articles' },
    {
      href: `/${locale}/dashboard`,
      label: t('nav.dashboard'),
      key: 'dashboard',
    },
    {
      href: `/${locale}/achievements`,
      label: t('nav.achievements'),
      key: 'achievements',
    },
    { href: `/${locale}/about`, label: t('nav.about'), key: 'about' },
  ]

  function isActive(href: string): boolean {
    if (href === `/${locale}`) {
      return pathname === `/${locale}`
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-sticky h-14 border-b border-border bg-card/80 backdrop-blur-glass">
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-md">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-sm font-bold text-text-primary"
        >
          <Brain className="h-6 w-6 text-primary" />
          <span className="text-lg">{t('common.appName')}</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-md">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className={cn(
                  'rounded-sm px-sm py-xs text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-bg'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-sm">
          <LanguageSwitcher locale={locale} />
          <Button
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
            asChild
          >
            <Link href={`/${locale}/signin`}>{t('common.buttons.signIn')}</Link>
          </Button>
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-sm text-text-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <ul className="flex flex-col gap-xs p-md">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={cn(
                    'block rounded-md px-md py-sm text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-primary-light text-primary'
                      : 'text-text-secondary hover:bg-primary-bg hover:text-text-primary'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${locale}/signin`}
                className="block rounded-md bg-primary px-md py-sm text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t('common.buttons.signIn')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
