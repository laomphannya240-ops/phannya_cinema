import { CalendarDays, Clock, MapPin, Ticket, Armchair } from 'lucide-react'
import { formatCurrency, formatDateLong } from '../../utils/format.js'

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function BookingSummary({
  movie,
  cinema,
  hall,
  date,
  time,
  seats = [],
  subtotal = 0,
  discount = 0,
  total = 0,
  children,
}) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-4">
        <Ticket className="h-5 w-5 text-gold" />
        <h3 className="font-display text-xl font-semibold text-ink">Booking Summary</h3>
      </div>

      <div className="divide-y divide-line/70">
        <Row icon={Ticket} label="Movie" value={movie?.title} />
        <Row icon={MapPin} label="Cinema / Hall" value={`${cinema?.shortName || cinema?.name || '—'} · ${hall?.name || ''}`} />
        <Row icon={CalendarDays} label="Date" value={formatDateLong(date)} />
        <Row icon={Clock} label="Time" value={time} />
        <Row
          icon={Armchair}
          label={`Seats (${seats.length})`}
          value={seats.length ? seats.join(', ') : 'No seats selected'}
        />
      </div>

      <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex items-center justify-between text-muted">
          <span>Subtotal</span>
          <span className="text-ink">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-400">
            <span>Discount</span>
            <span>−{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-3 text-base font-semibold">
          <span>Total</span>
          <span className="font-display text-2xl text-gold">{formatCurrency(total)}</span>
        </div>
      </div>

      {children}
    </div>
  )
}
