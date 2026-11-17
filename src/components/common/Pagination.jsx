import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/format.js'

export default function Pagination({ page = 1, totalPages = 1, onChange, total = 0, pageSize = 10 }) {
  if (totalPages <= 1) return null
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 sm:flex-row">
      <p className="text-xs text-muted">
        Showing <span className="font-semibold text-ink">{start}–{end}</span> of {total} entries
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="btn-icon disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => {
          let number = index + 1
          if (totalPages > 7) {
            if (page > 4 && page < totalPages - 2) number = page - 3 + index
            else if (page >= totalPages - 2) number = totalPages - 6 + index
          }
          return (
            <button
              key={number}
              type="button"
              onClick={() => onChange(number)}
              className={cn(
                'h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition',
                number === page
                  ? 'bg-gradient-to-r from-gold to-goldsoft text-[#151006]'
                  : 'border border-line text-muted hover:border-gold hover:text-gold',
              )}
            >
              {number}
            </button>
          )
        })}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="btn-icon disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
