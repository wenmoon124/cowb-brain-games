'use client'

import Link from 'next/link'
import { type Locale } from '@/i18n/config'

interface LogoProps {
  locale: Locale
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ locale, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'h-8 w-8', text: 'text-lg' },
    md: { icon: 'h-10 w-10', text: 'text-xl' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl' },
  }

  const currentSize = sizeClasses[size]

  return (
    <Link
      href={`/${locale}`}
      className="flex items-center gap-sm font-bold text-text-primary hover:opacity-90 transition-opacity"
    >
      {/* 抽象牛头 + 神经元 SVG 图标 */}
      <svg
        className={currentSize.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cowb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>
        </defs>
        
        {/* 抽象牛头轮廓 */}
        <path
          d="M12 16C12 14 13 12 15 11L18 9C20 8 22 8 24 8C26 8 28 8 30 9L33 11C35 12 36 14 36 16V20C36 22 35 24 34 25L32 27C31 28 30 30 30 32V34C30 36 28 38 26 38H22C20 38 18 36 18 34V32C18 30 17 28 16 27L14 25C13 24 12 22 12 20V16Z"
          fill="url(#cowb-gradient)"
          stroke="url(#cowb-gradient)"
          strokeWidth="1.5"
        />
        
        {/* 牛角 */}
        <path
          d="M15 11L11 7M33 11L37 7"
          stroke="url(#cowb-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* 神经元节点 */}
        <circle cx="20" cy="18" r="1.5" fill="white" opacity="0.9" />
        <circle cx="28" cy="18" r="1.5" fill="white" opacity="0.9" />
        <circle cx="24" cy="24" r="1.5" fill="white" opacity="0.9" />
        <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.9" />
        <circle cx="28" cy="30" r="1.5" fill="white" opacity="0.9" />
        
        {/* 神经元连接线 */}
        <path
          d="M20 18L24 24M28 18L24 24M24 24L20 30M24 24L28 30"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      
      <div className="flex items-baseline gap-0.5">
        <span className={`${currentSize.text} bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold tracking-tight`}>
          CowB
        </span>
        <span className={`${currentSize.text} text-text-secondary font-bold`}>
          .cc
        </span>
      </div>
    </Link>
  )
}
