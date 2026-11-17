import { Star } from 'lucide-react'
import { cn, statusTone } from '../../utils/format.js'

export function Spinner({ className = '' }) {
  return (
    <span
      className={cn(
        'inline-block h-5 w-5 animate-spin rounded-full border-2 border-line border-t-gold',
        className,
      )}
    />
  )
}

export function Badge({ children, tone = 'gray', className = '' }) {
  return <span className={cn('badge', `badge-${tone}`, className)}>{children}</span>
}

export function StatusPill({ status, className = '' }) {
  return (
    <span className={cn('badge', statusTone(status), className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {String(status || '').replace('-', ' ')}
    </span>
  )
}

export function RatingStars({ rating = 0, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 10`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating / 2) ? 'fill-gold text-gold' : 'text-line'}
        />
      ))}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, description, action, align = 'left' }) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
      )}
    >
      <div className={cn(align === 'center' && 'flex flex-col items-center')}>
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h1 className="text-4xl font-semibold text-ink sm:text-5xl lg:text-6xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">{description}</p>}
      </div>
      {children}
    </div>
  )
}
