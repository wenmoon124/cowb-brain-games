import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages
    if (currentPage <= 3) return [...pages.slice(0, 5), -1, totalPages]
    if (currentPage >= totalPages - 2) return [1, -1, ...pages.slice(-5)]
    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages]
  }

  const visiblePages = getVisiblePages()

  return (
    <nav
      className={cn('flex items-center justify-center gap-2', className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          'text-text-secondary hover:bg-primary-light hover:text-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, idx) => {
          if (page === -1 || page === -2) {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-text-muted">
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-[36px] h-9 px-3 text-sm font-medium rounded-lg transition-colors',
                currentPage === page
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:bg-primary-light hover:text-primary'
              )}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          'text-text-secondary hover:bg-primary-light hover:text-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Next page"
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
