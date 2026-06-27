import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-xs rounded-full border px-xs py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        // 维度 Badge：背景用 alpha 色，文字用加深色确保 WCAG AA ≥ 4.5:1
        memory: 'border-transparent bg-dim-memory/15 text-dim-memory-text',
        attention: 'border-transparent bg-dim-attention/15 text-dim-attention-text',
        reaction: 'border-transparent bg-dim-reaction/15 text-dim-reaction-text',
        executive: 'border-transparent bg-dim-executive/15 text-dim-executive-text',
        relaxation:
          'border-transparent bg-dim-relaxation/15 text-dim-relaxation-text',
        success: 'border-transparent bg-success/15 text-success',
        warning: 'border-transparent bg-warning/15 text-warning',
        error: 'border-transparent bg-error/15 text-error',
        info: 'border-transparent bg-primary-light text-primary',
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
