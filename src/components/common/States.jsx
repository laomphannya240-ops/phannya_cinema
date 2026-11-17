import { AlertTriangle, Inbox } from 'lucide-react'
import Button from './Button.jsx'
import { cn } from '../../utils/format.js'

export function Skeleton({ className = '' }) {
  return <div className={cn('skeleton', className)} />
}

export function MovieCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6">
      {Array.from({ length: count }, (_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="card space-y-3 p-5">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-11 w-full" />
      ))}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'Try adjusting your search or filters.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="card animate-fade-in flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface-2">
        <Icon className="h-7 w-7 text-muted" />
      </div>
      <h3 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {actionLabel && (
        <Button variant="outline" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="We couldn't load this"
      description={message}
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
    />
  )
}
