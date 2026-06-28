'use client'

import { useSearchParams } from 'next/navigation'
import { SettingsNav } from '@/components/settings/SettingsNav'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { DataSection } from '@/components/settings/DataSection'
import { AboutSection } from '@/components/settings/AboutSection'
import { type Locale } from '@/i18n/config'
import { useTranslation } from '@/i18n/client'

interface SettingsClientProps {
  locale: Locale
}

export function SettingsClient({ locale }: SettingsClientProps) {
  const searchParams = useSearchParams()
  const { t } = useTranslation(locale)
  const activeTab = searchParams.get('tab') || 'profile'

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">
          {t('settings.title')}
        </h1>
        <p className="text-text-secondary mt-2">
          {t('settings.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SettingsNav locale={locale} activeTab={activeTab} />
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'data' && <DataSection />}
          {activeTab === 'about' && <AboutSection locale={locale} />}
        </div>
      </div>
    </>
  )
}
