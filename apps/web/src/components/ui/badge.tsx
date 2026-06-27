import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-xs rounded-full border px-xs py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        memory: 'border-transparent bg-dim-memory/15 text-dim-memory',
        attention: 'border-transparent bg-dim-attention/15 text-dim-attention',
        reaction: 'border-transparent bg-dim-reaction/15 text-dim-reaction',
        executive: 'border-transparent bg-dim-executive/15 text-dim-executive',
        relaxation:
          'border-transparent bg-dim-relaxation/15 text-dim-relaxation',
        success: 'border-transparent bg-success/15 text-success',
        warning: 'border-transparent bg-warning/15 text-warning',
        error: 'border-transparent bg-error/15 text-error',
        info: 'border-transparent bg-primary-light text-info',
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
