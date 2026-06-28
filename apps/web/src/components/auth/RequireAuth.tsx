'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

type PageKey = 'dashboard' | 'profile' | 'achievements'

type AuthState = 'checking' | 'guest' | 'user'

export interface RequireAuthProps {
  locale: Locale
  pageKey: PageKey
  children: ReactNode
}

/**
 * Client-side route guard for static export.
 * Checks localStorage for a session flag; shows a sign-in prompt for guests.
 * Note: This is a soft guard for UX, not a security boundary.
 */
export function RequireAuth({ locale, pageKey, children }: RequireAuthProps) {
  const { t } = useTranslation(locale)
  const [authState, setAuthState] = useState<AuthState>('checking')

  useEffect(() => {
    try {
      const flag = localStorage.getItem('cowbcc_session')
      setAuthState(flag ? 'user' : 'guest')
    } catch {
      // localStorage may be unavailable (private mode); treat as guest
      setAuthState('guest')
    }
  }, [])

  if (authState === 'checking') {
    return (
      <div className="flex items-center justify-center py-5xl">
        <div className="flex flex-col items-center gap-md">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-text-muted">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (authState === 'guest') {
    const titleKey = `pages.${pageKey}.loginRequired`
    const descKey = `pages.${pageKey}.loginRequiredDescription`
    const title = t(titleKey)
    const description = t(descKey)
    const signInLabel = t('common.buttons.signIn')
    const signUpLabel = t('common.buttons.signUp')

    return (
      <div className="bg-gradient-hero px-md py-5xl">
        <div className="mx-auto max-w-2xl">
          <Card className="border-primary-light bg-card">
            <CardContent className="flex flex-col items-center gap-lg p-3xl text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col gap-sm">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                  {title}
                </h2>
                <p className="text-md text-text-secondary max-w-md">
                  {description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-sm mt-sm">
                <Button variant="primary" size="lg" asChild>
                  <a href={`/${locale}/signin`}>
                    <LogIn className="mr-xs h-4 w-4" />
                    {signInLabel}
                  </a>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <a href={`/${locale}/signup`}>
                    <UserPlus className="mr-xs h-4 w-4" />
                    {signUpLabel}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
