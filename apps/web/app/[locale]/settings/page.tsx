import { isValidLocale, type Locale } from '@/i18n/config'
import { SettingsClient } from './SettingsClient'
import { RequireAuth } from '@/components/auth/RequireAuth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences',
}

interface SettingsPageProps {
  params: { locale: string }
}

export default async function SettingsPage({
  params,
}: SettingsPageProps) {
  const locale = isValidLocale(params.locale) ? params.locale : 'en'

  return (
    <RequireAuth locale={locale as Locale} pageKey="dashboard">
      <div className="container mx-auto px-4 py-8">
        <SettingsClient locale={locale as Locale} />
      </div>
    </RequireAuth>
  )
}
