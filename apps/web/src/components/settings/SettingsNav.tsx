'use client'

import Link from 'next/link'
import { User, Shield, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SettingsNavProps {
  locale: string
  activeTab: string
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'data', label: 'Privacy & Data', icon: Shield },
  { id: 'about', label: 'About', icon: Info },
]

export function SettingsNav({ locale, activeTab }: SettingsNavProps) {
  return (
    <nav className="space-y-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <Link
            key={tab.id}
            href={`/${locale}/settings?tab=${tab.id}`}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-background-secondary'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
