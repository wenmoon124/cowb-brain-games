import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '16px',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        // 金黄琥珀系
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#F59E0B20',
          bg: '#F59E0B08',
        },
        // 日落金
        secondary: {
          DEFAULT: '#FBBF24',
          hover: '#F59E0B',
          light: '#FBBF2420',
        },
        // 暖沙金
        accent: {
          DEFAULT: '#FCD34D',
          hover: '#FBBF24',
          light: '#FCD34D20',
        },
        // 暖象牙白/奶油白背景
        background: {
          DEFAULT: '#FFFBEB',
          secondary: '#FEF3C7',
        },
        card: '#FFFBEB',
        // 深琥珀/焦糖棕文字
        text: {
          primary: '#78350F',
          secondary: '#92400E',
          muted: '#B45309',
        },
        // 暖金色调边框
        border: {
          DEFAULT: '#FDE68A',
          light: '#FEF3C7',
        },
        // 暖色扩展色
        peach: {
          DEFAULT: '#FBBF24',
          light: '#FBBF2420',
        },
        coral: {
          DEFAULT: '#F59E0B',
          light: '#F59E0B20',
        },
        caramel: '#92400E',
        // 语义色金黄琥珀系
        success: '#F59E0B',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#F59E0B',
        // 维度色更暖的色调
        dim: {
          memory: '#E91E63',       // 热情玫红
          attention: '#FF5722',    // 暖橙红
          reaction: '#FF9800',     // 暖橙
          executive: '#E91E63',    // 玫红
          relaxation: '#F44336',   // 珊瑚红
          // 文字专用色：加深至 WCAG AA ≥ 4.5:1
          memoryText: '#880E4F',
          attentionText: '#BF360C',
          reactionText: '#E65100',
          executiveText: '#880E4F',
          relaxationText: '#C62828',
          // 更深色文字：用于 Badge 文字确保高对比度
          memoryDark: '#880E4F',
          attentionDark: '#BF360C',
          reactionDark: '#E65100',
          executiveDark: '#880E4F',
          relaxationDark: '#C62828',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      fontSize: {
        xs: ['12px', '1.5'],
        sm: ['14px', '1.5'],
        md: ['16px', '1.5'],
        lg: ['18px', '1.5'],
        xl: ['24px', '1.3'],
        '2xl': ['32px', '1.25'],
        '3xl': ['40px', '1.2'],
        '4xl': ['48px', '1.15'],
        '5xl': ['64px', '1.1'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 8px 24px rgba(0,0,0,0.12)',
        xl: '0 16px 48px rgba(0,0,0,0.16)',
        'glow-primary': '0 0 20px #F59E0B40',
        'glow-secondary': '0 0 20px #FBBF2440',
        'glow-accent': '0 0 20px #FCD34D40',
        'glow-memory': '0 0 20px #E91E6340',
        'glow-attention': '0 0 20px #FF572240',
        'glow-reaction': '0 0 20px #FBBF2440',
        'glow-executive': '0 0 20px #E91E6340',
        'glow-relaxation': '0 0 20px #F4433640',
      },
      backgroundImage: {
        // 金黄琥珀系渐变
        'gradient-primary': 'linear-gradient(135deg, #F59E0B, #FBBF24)',
        'gradient-secondary': 'linear-gradient(135deg, #FBBF24, #FCD34D)',
        'gradient-accent': 'linear-gradient(135deg, #FCD34D, #FDE68A)',
        'gradient-hero': 'linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F59E0B, #FBBF24, #FCD34D)',
        'gradient-sunset': 'linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.2)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        confetti: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0) rotate(0deg) scale(1)',
          },
          '25%': {
            opacity: '1',
            transform: 'translateY(-40px) rotate(90deg) scale(1.1)',
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(-80px) rotate(180deg) scale(0.9)',
          },
          '75%': {
            opacity: '0.5',
            transform: 'translateY(-120px) rotate(270deg) scale(1.05)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-160px) rotate(360deg) scale(0.5)',
          },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #F59E0B20' },
          '50%': { boxShadow: '0 0 20px #F59E0B40, 0 0 40px #F59E0B20' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        warmGlow: {
          '0%, 100%': { boxShadow: '0 0 20px #F59E0B40' },
          '50%': { boxShadow: '0 0 40px #F59E0B60, 0 0 60px #FBBF2440' },
        },
        shimmerBorder: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease',
        'slide-up': 'slideUp 300ms ease',
        'slide-down': 'slideDown 300ms ease',
        'scale-in': 'scaleIn 300ms ease',
        pulse: 'pulse 2s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        confetti: 'confetti 1.5s ease-in-out forwards',
        'bounce-in': 'bounceIn 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        shake: 'shake 0.5s ease-in-out',
        glow: 'glow 2s ease-in-out infinite',
        spin: 'spin 1s linear infinite',
        'gradient-flow': 'gradientFlow 8s ease infinite',
        'warm-glow': 'warmGlow 3s ease-in-out infinite',
        'shimmer-border': 'shimmerBorder 3s linear infinite',
      },
      zIndex: {
        base: '1',
        dropdown: '100',
        sticky: '200',
        overlay: '300',
        modal: '400',
        toast: '500',
      },
      backdropBlur: {
        glass: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
