import { buildSeatRows } from '../../utils/seats.js'
import { cn } from '../../utils/format.js'

function Seat({ seat, occupied, selected, onToggle }) {
  const state = occupied
    ? 'seat-occupied'
    : selected
      ? 'seat-selected'
      : seat.vip
        ? 'seat-vip'
        : ''

  return (
    <button
      type="button"
      disabled={occupied}
      onClick={() => onToggle(seat)}
      title={`${seat.label} — ${occupied ? 'Occupied' : seat.vip ? 'VIP' : 'Standard'}`}
      aria-label={`Seat ${seat.label}${occupied ? ', occupied' : seat.vip ? ', VIP' : ''}${selected ? ', selected' : ''}`}
      aria-pressed={selected}
      className={cn('seat', state)}
    >
      {seat.label.replace(/^[A-Z]/, '')}
    </button>
  )
}

export default function SeatMap({ hall, occupied = [], selected = [], onToggle }) {
  const rows = buildSeatRows(hall)
  const occupiedSet = new Set(occupied)
  const selectedSet = new Set(selected)

  return (
    <div className="card min-w-0 p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="h-3 w-3/4 rounded-t-[100%] border-x border-t border-gold/50 bg-gradient-to-b from-gold/25 to-transparent sm:w-2/3" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">Screen</p>
      </div>

      <div className="no-scrollbar overflow-x-auto pb-3">
        <div className="mx-auto w-max space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-2 sm:gap-3">
              <span className="w-4 shrink-0 text-center text-[10px] font-bold text-muted">
                {String.fromCharCode(65 + rowIndex)}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {row.map((seat, seatIndex) => (
                  <div key={seat.label} className="flex items-center gap-1.5 sm:gap-2">
                    <Seat
                      seat={seat}
                      occupied={occupiedSet.has(seat.globalIndex)}
                      selected={selectedSet.has(seat.label)}
                      onToggle={onToggle}
                    />
                    {seatIndex === 7 && <span className="w-3 sm:w-5" />}
                  </div>
                ))}
              </div>
              <span className="w-4 shrink-0 text-center text-[10px] font-bold text-muted">
                {String.fromCharCode(65 + rowIndex)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[11px] text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="seat !h-4 !w-4 !rounded" /> Available
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="seat seat-selected !h-4 !w-4 !rounded" /> Selected
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="seat seat-vip !h-4 !w-4 !rounded" /> VIP
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="seat seat-occupied !h-4 !w-4 !rounded" /> Occupied
        </span>
      </div>
    </div>
  )
}
