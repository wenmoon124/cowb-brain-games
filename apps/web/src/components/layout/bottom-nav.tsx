'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Gamepad2, LayoutDashboard, User } from 'lucide-react'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  locale: Locale
}

export function BottomNav({ locale }: BottomNavProps) {
  const pathname = usePathname()
  const { t } = useTranslation(locale)

  const items = [
    {
      href: `/${locale}`,
      label: t('nav.home'),
      icon: Home,
    },
    {
      href: `/${locale}/games`,
      label: t('nav.games'),
      icon: Gamepad2,
    },
    {
      href: `/${locale}/dashboard`,
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/profile`,
      label: t('nav.profile'),
      icon: User,
    },
  ]

  function isActive(href: string): boolean {
    if (href === `/${locale}`) {
      return pathname === `/${locale}`
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-sticky flex h-16 items-center justify-around border-t border-border bg-card/80 backdrop-blur-glass pb-[env(safe-area-inset-bottom)] md:hidden">
      {items.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 px-sm transition-colors',
              active ? 'text-primary' : 'text-text-muted'
            )}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
