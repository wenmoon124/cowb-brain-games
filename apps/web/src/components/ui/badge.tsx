import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-xs rounded-md border-2 px-3 py-1 text-xs font-semibold transition-colors min-w-[80px] justify-center',
  {
    variants: {
      variant: {
        // 维度 Badge：背景用 alpha 色，文字用加深色确保 WCAG AA ≥ 4.5:1，添加边框
        memory: 'border-dim-memory bg-dim-memory/25 text-dim-memory-dark',
        attention: 'border-dim-attention bg-dim-attention/25 text-dim-attention-dark',
        reaction: 'border-dim-reaction bg-dim-reaction/25 text-dim-reaction-dark',
        executive: 'border-dim-executive bg-dim-executive/25 text-dim-executive-dark',
        relaxation:
          'border-dim-relaxation bg-dim-relaxation/25 text-dim-relaxation-dark',
        success: 'border-success bg-success/20 text-text-primary',
        warning: 'border-warning bg-warning/20 text-text-primary',
        error: 'border-error bg-error/20 text-error',
        info: 'border-primary bg-primary/20 text-primary',
        outline: 'border-border bg-transparent text-text-secondary',
        'brain-age': 'border-primary bg-primary/20 text-primary',
        focus: 'border-accent bg-accent/20 text-text-primary',
        sleep: 'border-secondary bg-secondary/20 text-text-primary',
        nutrition: 'border-accent bg-accent/25 text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
