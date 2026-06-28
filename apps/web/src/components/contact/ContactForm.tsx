'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Send } from 'lucide-react'
import { useTranslation } from '@/i18n/client'
import type { Locale } from '@/i18n/config'

const CONTACT_EMAIL = 'wenmoon124@gmail.com'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactFormProps {
  locale: Locale
}

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactForm({ locale }: ContactFormProps) {
  const { t } = useTranslation(locale)
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!form.name.trim()) {
      next.name = t('pages.contact.nameRequired')
    }
    if (!form.email.trim()) {
      next.email = t('pages.contact.emailRequired')
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = t('pages.contact.emailInvalid')
    }
    if (!form.message.trim()) {
      next.message = t('pages.contact.messageRequired')
    } else if (form.message.trim().length < 10) {
      next.message = t('pages.contact.messageTooShort')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (
    field: keyof FormState,
    value: string
  ): void => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const subject = `Contact from ${form.name.trim()}`
    const body = `${form.message.trim()}\n\n---\nReply to: ${form.email.trim()}`
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
    // Reset submitting state after a delay (mailto is synchronous)
    setTimeout(() => setSubmitting(false), 1500)
  }

  return (
    <Card className="mt-xl border-primary-light bg-card">
      <CardHeader>
        <CardTitle className="text-text-primary">
          {t('pages.contact.formTitle')}
        </CardTitle>
        <p className="text-sm text-text-secondary mt-xs">
          {t('pages.contact.formDescription')}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-md" noValidate>
          <div className="flex flex-col gap-xs">
            <Label htmlFor="contact-name">
              {t('pages.contact.name')}
            </Label>
            <Input
              id="contact-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('pages.contact.namePlaceholder')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
              required
            />
            {errors.name && (
              <p id="contact-name-error" className="text-xs text-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label htmlFor="contact-email">
              {t('pages.contact.emailField')}
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t('pages.contact.emailPlaceholder')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              required
            />
            {errors.email && (
              <p id="contact-email-error" className="text-xs text-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label htmlFor="contact-message">
              {t('pages.contact.message')}
            </Label>
            <textarea
              id="contact-message"
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t('pages.contact.messagePlaceholder')}
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              required
              className="flex w-full rounded-md border border-border bg-card px-md py-sm text-md text-text-primary placeholder:text-text-muted transition-colors duration-fast focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-light disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px]"
            />
            {errors.message && (
              <p id="contact-message-error" className="text-xs text-error" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="mt-sm"
          >
            <Send className="mr-xs h-4 w-4" />
            {submitting ? t('pages.contact.submitting') : t('pages.contact.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
