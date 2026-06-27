import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-xs whitespace-nowrap rounded-md font-semibold transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white shadow-sm hover:bg-primary-hover hover:shadow-glow-primary hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
        secondary:
          'bg-transparent text-primary border-2 border-primary hover:bg-primary-light hover:shadow-glow-primary active:bg-primary-bg',
        accent:
          'bg-accent text-white shadow-sm hover:bg-accent-hover hover:shadow-glow-accent hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
        ghost:
          'bg-transparent text-text-secondary hover:text-text-primary hover:bg-primary-bg',
      },
      size: {
        sm: 'h-8 px-md text-xs rounded-sm',
        md: 'h-10 px-lg text-sm',
        lg: 'h-12 px-xl text-md rounded-lg',
        xl: 'h-14 px-2xl text-lg rounded-lg',
        icon: 'h-10 w-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
