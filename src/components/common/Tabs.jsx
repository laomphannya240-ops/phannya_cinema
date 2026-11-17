import { cn } from '../../utils/format.js'

export default function Tabs({ items = [], value, onChange, className = '' }) {
  return (
    <div
      role="tablist"
      className={cn(
        'no-scrollbar inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.key === value
        const Icon = item.icon
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition sm:px-4',
              active
                ? 'bg-gradient-to-r from-gold to-goldsoft text-[#151006] shadow-sm'
                : 'text-muted hover:bg-surface-2 hover:text-ink',
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  active ? 'bg-black/15' : 'bg-surface-2',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
