'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/client'
import { type Locale, isValidLocale } from '@/i18n/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, LogIn, AlertCircle, Loader2 } from 'lucide-react'
import { API_BASE_URL } from '@/lib/config'

interface SigninPageProps {
  params: { locale: string }
}

export default function SigninPage({ params }: SigninPageProps) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : 'en'
  const { t } = useTranslation(locale)
  const router = useRouter()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!loginId || !password) {
      setError(t('errors.validation.required'))
      return
    }

    setIsSubmitting(true)
    try {
      // Determine if loginId is email or username
      const isEmail = loginId.includes('@')
      const payload = isEmail
        ? { email: loginId, password }
        : { username: loginId, password }

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        setError(t('auth.errors.invalidCredentials'))
        return
      }

      // Set localStorage session flag for client-side auth check
      try {
        localStorage.setItem('cowbcc_session', 'true')
      } catch {
        // localStorage may be unavailable
      }

      router.push(`/${locale}/brain-age`)
    } catch {
      setError(t('errors.network'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-md py-3xl md:py-5xl min-h-[calc(100vh-3.5rem)] flex items-center">
      <div className="mx-auto max-w-md w-full">
        <div className="mb-2xl text-center">
          <div className="mx-auto mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Brain className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-sm">
            {t('auth.signIn.title')}
          </h1>
          <p className="text-md text-text-secondary">
            {t('auth.signIn.subtitle')}
          </p>
        </div>

        <Card className="border-2 border-amber-200 card-lift bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-2xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-lg" noValidate>
              <div className="flex flex-col gap-sm">
                <Label htmlFor="loginId" className="text-sm font-semibold text-text-primary">
                  {t('auth.signIn.emailOrUsername')}
                </Label>
                <Input
                  id="loginId"
                  type="text"
                  autoComplete="username"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={t('auth.signIn.emailOrUsernamePlaceholder')}
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-col gap-sm">
                <Label htmlFor="password" className="text-sm font-semibold text-text-primary">
                  {t('auth.signIn.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="h-12 bg-white border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-sm rounded-md bg-error/10 px-md py-sm text-sm text-error"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="mt-sm w-full h-12"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-xs h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-xs h-5 w-5" />
                )}
                <span className="text-md">{t('auth.signIn.submit')}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-xl text-center text-md text-text-secondary">
          {t('auth.signIn.noAccount')}{' '}
          <Link
            href={`/${locale}/signup`}
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            {t('auth.signIn.signUpLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
