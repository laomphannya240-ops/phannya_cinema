import { CalendarDays, Clock, MapPin, Ticket } from 'lucide-react'
import { formatDate, formatCurrency } from '../../utils/format.js'

/** Decorative QR-style pattern generated from the booking reference (demo only). */
export function DemoQR({ seed = 'PHN-DEMO', size = 88 }) {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0
  }
  const cells = Array.from({ length: 81 }, (_, index) => {
    const noise = Math.sin(hash * 0.001 + index * 12.9898) * 43758.5453
    return noise - Math.floor(noise) > 0.48
  })
  const isFinder = (row, col) =>
    (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3)

  return (
    <div
      className="grid shrink-0 gap-[1px] rounded-lg bg-white p-2"
      style={{ width: size, height: size, gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)' }}
      aria-label="Demo QR ticket code"
      role="img"
    >
      {cells.map((filled, index) => {
        const row = Math.floor(index / 9)
        const col = index % 9
        const finder = isFinder(row, col)
        const finderFilled =
          finder &&
          ((row % 3 !== 1 && col % 3 !== 1) ||
            (row > 5 && col > 5 && row % 3 !== 1 && col % 3 !== 1))
        return (
          <span
            key={index}
            className="rounded-[1px]"
            style={{ background: finder ? (finderFilled ? '#101218' : '#ffffff') : filled ? '#101218' : '#ffffff' }}
          />
        )
      })}
    </div>
  )
}

export default function TicketCard({ booking, movie, cinema, hall, compact = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-2">
      <div className="relative flex items-center justify-between gap-3 border-b border-dashed border-line bg-gradient-to-r from-crimson/20 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-gold" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Phannya Cinema
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-ink">{booking.reference}</span>
      </div>

      <div className={`flex items-center justify-between gap-4 p-4 ${compact ? '' : 'sm:p-5'}`}>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-display text-xl font-semibold text-ink">
            {movie?.title || 'Movie'}
          </h4>
          <div className="mt-2 space-y-1 text-xs text-muted">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-gold" /> {formatDate(booking.date)}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gold" /> {booking.time}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gold" /> {cinema?.shortName} · {hall?.name}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {booking.seats.map((seat) => (
              <span key={seat} className="badge badge-gold">
                {seat}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Total <span className="font-semibold text-ink">{formatCurrency(booking.total)}</span>
          </p>
        </div>
        <DemoQR seed={booking.reference} size={compact ? 72 : 92} />
      </div>
      <p className="border-t border-line px-4 py-2 text-center text-[10px] text-muted">
        Demo ticket — not valid for entry
      </p>
    </div>
  )
}
