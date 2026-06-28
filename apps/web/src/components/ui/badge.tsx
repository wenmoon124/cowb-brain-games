import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-xs rounded-full border px-xs py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // 维度 Badge：背景用 alpha 色，文字用加深色确保 WCAG AA ≥ 4.5:1
        memory: 'border-transparent bg-dim-memory/25 text-dim-memory-dark',
        attention: 'border-transparent bg-dim-attention/25 text-dim-attention-dark',
        reaction: 'border-transparent bg-dim-reaction/25 text-dim-reaction-dark',
        executive: 'border-transparent bg-dim-executive/25 text-dim-executive-dark',
        relaxation:
          'border-transparent bg-dim-relaxation/25 text-dim-relaxation-dark',
        success: 'border-transparent bg-success/20 text-text-primary',
        warning: 'border-transparent bg-warning/20 text-text-primary',
        error: 'border-transparent bg-error/20 text-error',
        info: 'border-transparent bg-primary/20 text-primary',
        outline: 'border-border bg-transparent text-text-secondary',
        'brain-age': 'border-transparent bg-primary/20 text-primary',
        focus: 'border-transparent bg-accent/20 text-text-primary',
        sleep: 'border-transparent bg-secondary/20 text-text-primary',
        nutrition: 'border-transparent bg-accent/25 text-text-primary',
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
