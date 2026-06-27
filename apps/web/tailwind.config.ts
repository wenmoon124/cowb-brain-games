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
        primary: {
          DEFAULT: '#4A7CFF',
          hover: '#3A6CEE',
          light: '#4A7CFF20',
          bg: '#4A7CFF08',
        },
        secondary: {
          DEFAULT: '#50C8A8',
          hover: '#3FB898',
          light: '#50C8A820',
        },
        accent: {
          DEFAULT: '#FFB14A',
          hover: '#FFA030',
          light: '#FFB14A20',
        },
        background: {
          DEFAULT: '#F7F9FC',
          secondary: '#EEF1F6',
        },
        card: '#FFFFFF',
        text: {
          primary: '#1A202C',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        border: {
          DEFAULT: '#E2E8F0',
          light: '#F1F5F9',
        },
        success: '#50C8A8',
        warning: '#FFB14A',
        error: '#EF4444',
        info: '#4A7CFF',
        dim: {
          memory: '#8B5CF6',
          attention: '#06B6D4',
          reaction: '#FFB14A',
          executive: '#10B981',
          relaxation: '#4A7CFF',
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
        'glow-primary': '0 0 20px #4A7CFF40',
        'glow-secondary': '0 0 20px #50C8A840',
        'glow-accent': '0 0 20px #FFB14A40',
        'glow-memory': '0 0 20px #8B5CF640',
        'glow-attention': '0 0 20px #06B6D440',
        'glow-reaction': '0 0 20px #FFB14A40',
        'glow-executive': '0 0 20px #10B98140',
        'glow-relaxation': '0 0 20px #4A7CFF40',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4A7CFF, #8B5CF6)',
        'gradient-secondary': 'linear-gradient(135deg, #50C8A8, #10B981)',
        'gradient-accent': 'linear-gradient(135deg, #FFB14A, #FF8C00)',
        'gradient-hero': 'linear-gradient(180deg, #F7F9FC 0%, #EEF1F6 100%)',
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
          '0%, 100%': { boxShadow: '0 0 5px #4A7CFF20' },
          '50%': { boxShadow: '0 0 20px #4A7CFF40, 0 0 40px #4A7CFF20' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
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
