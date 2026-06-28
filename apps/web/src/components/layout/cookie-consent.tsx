'use client'

import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

interface CookieConsentProps {
  locale: Locale
}

interface CookieConsentPayload {
  strictlyNecessary: boolean
  performanceAnalytics: boolean
  targetingAds: boolean
  consentedAt: string
  consentVersion: string
}

const CONSENT_VERSION = '2.0'
const STORAGE_KEY = 'cowbcc-cookie-consent'

export function CookieConsent({ locale }: CookieConsentProps) {
  const { t } = useTranslation(locale)
  const [visible, setVisible] = useState(false)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [targeting, setTargeting] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function persist(payload: CookieConsentPayload) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // storage may be unavailable
    }
    setVisible(false)
    setPrefsOpen(false)
  }

  function handleAcceptAll() {
    setAnalytics(true)
    setTargeting(true)
    persist({
      strictlyNecessary: true,
      performanceAnalytics: true,
      targetingAds: true,
      consentedAt: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
    })
  }

  function handleRejectOptional() {
    setAnalytics(false)
    setTargeting(false)
    persist({
      strictlyNecessary: true,
      performanceAnalytics: false,
      targetingAds: false,
      consentedAt: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
    })
  }

  function handleSavePrefs() {
    persist({
      strictlyNecessary: true,
      performanceAnalytics: analytics,
      targetingAds: targeting,
      consentedAt: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
    })
  }

  if (!visible) return null

  return (
    <>
      {/* Banner */}
      {!prefsOpen && (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-overlay p-md transition-transform duration-slow',
            'data-[hidden=true]:translate-y-full'
          )}
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-lg rounded-xl border border-border bg-card/80 p-lg shadow-xl backdrop-blur-glass md:flex-row md:text-left">
            <div className="flex flex-1 items-start gap-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-light">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="mb-xs text-md font-bold text-text-primary">
                  {t('cookie.title')}
                </p>
                <p className="text-sm text-text-secondary">
                  {t('cookie.description')}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-center gap-sm md:w-auto">
              <Button variant="primary" size="sm" onClick={handleAcceptAll}>
                {t('cookie.acceptAll')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRejectOptional}
              >
                {t('cookie.rejectOptional')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPrefsOpen(true)}
              >
                {t('cookie.savePreferences')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Panel */}
      {prefsOpen && (
        <>
          <div
            className="fixed inset-0 z-overlay bg-primary/30 backdrop-blur-sm"
            onClick={() => setPrefsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-0 right-0 z-modal flex justify-center p-md">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-xl shadow-xl">
              <div className="mb-lg flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">
                  {t('cookie.savePreferences')}
                </h2>
                <button
                  type="button"
                  onClick={() => setPrefsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-background-secondary text-text-muted transition-colors hover:bg-border"
                  aria-label={t('common.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Strictly Necessary */}
              <div className="flex items-center justify-between border-b border-border-light py-md">
                <div className="flex-1 pr-md">
                  <p className="text-sm font-semibold text-text-primary">
                    {t('cookie.strictlyNecessary')}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {t('cookie.strictlyNecessaryDescription')}
                  </p>
                  <span className="mt-xs inline-flex items-center rounded-full bg-primary-light px-xs py-0.5 text-xs font-semibold text-primary">
                    {t('cookie.alwaysActive')}
                  </span>
                </div>
                <Toggle
                  size="sm"
                  pressed
                  disabled
                  aria-label={t('cookie.strictlyNecessary')}
                />
              </div>

              {/* Performance Analytics */}
              <div className="flex items-center justify-between border-b border-border-light py-md">
                <div className="flex-1 pr-md">
                  <p className="text-sm font-semibold text-text-primary">
                    {t('cookie.performanceAnalytics')}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {t('cookie.performanceAnalyticsDescription')}
                  </p>
                </div>
                <Toggle
                  size="sm"
                  pressed={analytics}
                  onPressedChange={setAnalytics}
                  aria-label={t('cookie.performanceAnalytics')}
                />
              </div>

              {/* Targeting Ads */}
              <div className="flex items-center justify-between py-md">
                <div className="flex-1 pr-md">
                  <p className="text-sm font-semibold text-text-primary">
                    {t('cookie.targetingAds')}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {t('cookie.targetingAdsDescription')}
                  </p>
                </div>
                <Toggle
                  size="sm"
                  pressed={targeting}
                  onPressedChange={setTargeting}
                  aria-label={t('cookie.targetingAds')}
                />
              </div>

              <div className="mt-lg flex justify-end gap-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrefsOpen(false)}
                >
                  {t('common.buttons.cancel')}
                </Button>
                <Button variant="primary" size="sm" onClick={handleSavePrefs}>
                  {t('cookie.savePreferences')}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
