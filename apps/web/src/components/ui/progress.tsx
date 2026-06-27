'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressFillVariants = cva('h-full w-full flex-1 rounded-full transition-all duration-slow', {
  variants: {
    dimension: {
      default: 'bg-gradient-primary',
      memory: 'bg-gradient-to-r from-dim-memory to-purple-400',
      attention: 'bg-gradient-to-r from-dim-attention to-cyan-400',
      reaction: 'bg-gradient-to-r from-dim-reaction to-yellow-400',
      executive: 'bg-gradient-to-r from-dim-executive to-green-400',
      relaxation: 'bg-gradient-to-r from-dim-relaxation to-indigo-400',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-info',
    },
  },
  defaultVariants: {
    dimension: 'default',
  },
})

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressFillVariants> {
  value?: number
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, dimension, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-background-secondary',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressFillVariants({ dimension }))}
      style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, progressFillVariants }
