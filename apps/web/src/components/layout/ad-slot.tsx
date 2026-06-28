import { cn } from '@/lib/utils'

interface AdSlotProps {
  size?: 'banner' | 'rectangle' | 'leaderboard'
  className?: string
}

const sizeConfig = {
  banner: { height: 'h-[90px]', label: 'Banner' },
  rectangle: { height: 'h-[250px]', label: 'Rectangle' },
  leaderboard: { height: 'h-[90px]', label: 'Leaderboard' },
}

export function AdSlot({ size = 'rectangle', className }: AdSlotProps) {
  const config = sizeConfig[size]

  return (
    <div
      className={cn(
        'w-full my-lg flex items-center justify-center',
        'bg-gradient-to-br from-primary/5 to-secondary/5',
        'border border-dashed border-border rounded-lg',
        config.height,
        className
      )}
      data-ad-slot={size}
    >
      <div className="text-center">
        <p className="text-sm text-text-muted font-medium">Advertisement</p>
        <p className="text-xs text-text-muted/60 mt-1">{config.label}</p>
      </div>
    </div>
  )
}
