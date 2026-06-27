import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-background-secondary',
        'after:absolute after:inset-0 after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:bg-[length:200%_100%] dark:after:via-white/5',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
