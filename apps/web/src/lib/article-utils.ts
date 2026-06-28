import type { ArticleCategory } from '@/data/articles'
import { formatDate } from '@/lib/utils'

export { formatDate }

export interface CategoryBadgeConfig {
  variant: 'memory' | 'attention' | 'reaction' | 'executive' | 'relaxation' | 'info'
  className?: string
}

export const CATEGORY_BADGE_CONFIG: Record<ArticleCategory, CategoryBadgeConfig> = {
  memory: { variant: 'memory' },
  attention: { variant: 'attention' },
  reaction: { variant: 'reaction' },
  executive: { variant: 'executive' },
  relaxation: { variant: 'relaxation' },
  'brain-age': { variant: 'info' },
  focus: { variant: 'info', className: 'bg-accent-light text-accent' },
}
