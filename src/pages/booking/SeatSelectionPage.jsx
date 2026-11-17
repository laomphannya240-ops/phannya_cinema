import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import Stepper from '../../components/booking/Stepper.jsx'
import SeatMap from '../../components/booking/SeatMap.jsx'
import BookingSummary from '../../components/booking/BookingSummary.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import Button from '../../components/common/Button.jsx'
import { getMovieById } from '../../data/movies.js'
import { getCinemaById, getHallById } from '../../data/cinemas.js'
import { showtimes } from '../../data/showtimes.js'
import { useBooking } from '../../context/BookingContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { formatCurrency, formatDateLong } from '../../utils/format.js'
import { priceForSeat } from '../../utils/seats.js'

export default function SeatSelectionPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setSelection } = useBooking()
  const { toast } = useToast()
  const { t } = useLanguage()
  const showtime = useMemo(
    () => showtimes.find((item) => item.id === searchParams.get('showtime')) || showtimes[0],
    [searchParams],
  )
  const [selected, setSelected] = useState([])

  if (!showtime) {
    return (
      <div className="section-shell py-16">
        <EmptyState
          title="Showtime not available"
          description="Please choose a screening from the showtimes page."
          actionLabel="Browse showtimes"
          onAction={() => navigate('/showtimes')}
        />
      </div>
    )
  }

  const movie = getMovieById(showtime.movieId)
  const cinema = getCinemaById(showtime.cinemaId)
  const hall = getHallById(showtime.hallId)

  const seatDetails = selected.map((label) => ({
    label,
    price: priceForSeat(showtime, hall, label),
    type: hall.vipRows.includes(label.charCodeAt(0) - 65) ? 'VIP' : 'Standard',
  }))
  const subtotal = seatDetails.reduce((sum, seat) => sum + seat.price, 0)

  const toggleSeat = (seat) => {
    if (!selected.includes(seat.label) && selected.length >= 10) {
      toast.warning('You can select up to 10 seats in one booking.', 'Seat limit')
      return
    }
    setSelected((current) =>
      current.includes(seat.label)
        ? current.filter((label) => label !== seat.label)
        : [...current, seat.label].sort(),
    )
  }

  const proceed = () => {
    if (!selected.length) {
      toast.error('Please select at least one seat to continue.', 'No seats selected')
      return
    }
    setSelection({
      showtime,
      movieId: movie.id,
      cinemaId: cinema.id,
      hallId: hall.id,
      date: showtime.date,
      time: showtime.time,
      seats: selected,
      seatDetails,
      subtotal,
      discount: 0,
      total: subtotal,
    })
    navigate('/booking/checkout')
  }

  return (
    <div className="section-shell py-8 sm:py-12">
      <Stepper current={1} />

      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          {t('booking.seats')}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {movie?.title} · {cinema?.shortName} · {formatDateLong(showtime.date)} · {showtime.time}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
        <div className="min-w-0 space-y-4">
          <SeatMap
            hall={hall}
            occupied={showtime.occupiedSeats}
            selected={selected}
            onToggle={toggleSeat}
          />
          <div className="flex items-start gap-2 rounded-xl border border-line bg-surface-2/60 p-3 text-xs text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            VIP rows (front two rows) include extra legroom and premium service. Prices are demo
            values only.
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary
            movie={movie}
            cinema={cinema}
            hall={hall}
            date={showtime.date}
            time={showtime.time}
            seats={selected}
            subtotal={subtotal}
            total={subtotal}
          >
            <div className="mt-4">
              {seatDetails.length > 0 ? (
                <div className="mb-4 space-y-1.5">
                  {seatDetails.map((seat) => (
                    <div key={seat.label} className="flex justify-between text-xs text-muted">
                      <span>
                        Seat {seat.label}
                        <span className="ml-1 text-gold">{seat.type}</span>
                      </span>
                      <span className="text-ink">{formatCurrency(seat.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-xs text-muted">Select seats on the map to see pricing.</p>
              )}
              <Button onClick={proceed} variant="gold" size="lg" className="w-full">
                {t('common.continue')} <ArrowRight className="h-4 w-4" />
              </Button>
              <Link to="/showtimes" className="btn btn-ghost btn-sm mt-2 w-full">
                Change showtime
              </Link>
            </div>
          </BookingSummary>
        </div>
      </div>
    </div>
  )
}
