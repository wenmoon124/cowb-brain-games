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

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email || !password) {
      setError(t('errors.validation.required'))
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setError(t('auth.errors.invalidCredentials'))
        return
      }

      router.push(`/${locale}/dashboard`)
    } catch {
      setError(t('errors.network'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-hero px-md py-3xl md:py-5xl">
      <div className="mx-auto max-w-md">
        <div className="mb-2xl text-center">
          <div className="mx-auto mb-md flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <Brain className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-xs">
            {t('auth.signIn.title')}
          </h1>
          <p className="text-sm text-text-secondary">
            {t('auth.signIn.subtitle')}
          </p>
        </div>

        <Card>
          <CardContent className="p-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-md" noValidate>
              <div className="flex flex-col gap-sm">
                <Label htmlFor="email">{t('auth.signIn.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-sm">
                <Label htmlFor="password">{t('auth.signIn.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
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
                className="mt-sm w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-xs h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-xs h-4 w-4" />
                )}
                {t('auth.signIn.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-lg text-center text-sm text-text-secondary">
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
