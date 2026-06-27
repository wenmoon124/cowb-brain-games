'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-primary-bg hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary-light data-[state=on]:text-primary',
  {
    variants: {
      size: {
        sm: 'h-8 px-md text-xs',
        md: 'h-10 px-lg text-sm',
        lg: 'h-12 px-xl text-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ size, className }))}
    {...props}
  />
))
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
