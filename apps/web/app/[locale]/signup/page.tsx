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
import { Brain, UserPlus, AlertCircle, Loader2 } from 'lucide-react'

interface SignupPageProps {
  params: { locale: string }
}

const API_BASE = 'https://cowb-brain-games-api.wenmoon124.workers.dev'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage({ params }: SignupPageProps) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : 'en'
  const { t } = useTranslation(locale)
  const router = useRouter()

  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): string | null {
    if (!nickname || !email || !password || !confirmPassword) {
      return t('errors.validation.required')
    }
    if (!EMAIL_REGEX.test(email)) {
      return t('errors.validation.invalidEmail')
    }
    if (password.length < 8) {
      return t('errors.validation.passwordTooShort')
    }
    if (password !== confirmPassword) {
      return t('errors.validation.passwordsDoNotMatch')
    }
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, password }),
      })

      if (!response.ok) {
        setError(t('auth.errors.emailExists'))
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
          <div className="mx-auto mb-md flex h-14 w-14 items-center justify-center rounded-full bg-secondary-light">
            <Brain className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-xs">
            {t('auth.signUp.title')}
          </h1>
          <p className="text-sm text-text-secondary">
            {t('auth.signUp.subtitle')}
          </p>
        </div>

        <Card>
          <CardContent className="p-xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-md" noValidate>
              <div className="flex flex-col gap-sm">
                <Label htmlFor="nickname">{t('auth.signUp.nickname')}</Label>
                <Input
                  id="nickname"
                  type="text"
                  autoComplete="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-sm">
                <Label htmlFor="email">{t('auth.signUp.email')}</Label>
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
                <Label htmlFor="password">{t('auth.signUp.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-sm">
                <Label htmlFor="confirmPassword">
                  {t('auth.signUp.confirmPassword')}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <UserPlus className="mr-xs h-4 w-4" />
                )}
                {t('auth.signUp.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-lg text-center text-sm text-text-secondary">
          {t('auth.signUp.hasAccount')}{' '}
          <Link
            href={`/${locale}/signin`}
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            {t('auth.signUp.signInLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
