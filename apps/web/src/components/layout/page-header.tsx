import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-3xl text-center', className)}>
      <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-md">
        {title}
      </h1>
      {description && (
        <p className="text-md md:text-lg text-text-secondary max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </header>
  )
}
