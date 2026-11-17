import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Ticket, XCircle } from 'lucide-react'
import Tabs from '../../components/common/Tabs.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import { PageHeading, StatusPill } from '../../components/common/Display.jsx'
import MovieArt from '../../components/common/MovieArt.jsx'
import TicketCard from '../../components/booking/TicketCard.jsx'
import Button from '../../components/common/Button.jsx'
import { getMovieById } from '../../data/movies.js'
import { getCinemaById, getHallById } from '../../data/cinemas.js'
import { useBooking } from '../../context/BookingContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { formatCurrency, formatDate } from '../../utils/format.js'

export default function MyBookingsPage() {
  const [tab, setTab] = useState('all')
  const [details, setDetails] = useState(null)
  const [toCancel, setToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()
  const { bookings, cancelBooking } = useBooking()
  const { t } = useLanguage()

  const filtered = bookings.filter((booking) => tab === 'all' || booking.status === tab)
  const counts = {
    all: bookings.length,
    upcoming: bookings.filter((booking) => booking.status === 'upcoming').length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
    cancelled: bookings.filter((booking) => booking.status === 'cancelled').length,
  }

  const doCancel = async () => {
    setCancelling(true)
    try {
      await cancelBooking(toCancel.id)
      setToCancel(null)
      setDetails(null)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="section-shell py-10 sm:py-14 lg:py-16">
      <PageHeading
        eyebrow="Your cinema journey"
        title={t('nav.myBookings')}
        description="Review upcoming screenings, past visits and cancelled bookings."
      />

      <Tabs
        value={tab}
        onChange={setTab}
        className="mb-6"
        items={[
          { key: 'all', label: t('common.all'), count: counts.all },
          { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
          { key: 'completed', label: 'Completed', count: counts.completed },
          { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings here"
          description="Your tickets will appear here after you complete a booking."
          actionLabel="Explore movies"
          onAction={() => navigate('/movies')}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const movie = getMovieById(booking.movieId)
            const cinema = getCinemaById(booking.cinemaId)
            const hall = getHallById(booking.hallId)
            return (
              <div key={booking.id} className="card overflow-hidden">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                  <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl sm:h-36 sm:w-24">
                    <MovieArt movie={movie} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-[10px] font-bold tracking-wider text-gold">
                          {booking.reference}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
                          {movie?.title || 'Movie'}
                        </h3>
                      </div>
                      <StatusPill status={booking.status} />
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-gold" /> {formatDate(booking.date)}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-gold" /> {booking.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-gold" /> {cinema?.shortName} · {hall?.name}
                      </p>
                      <p className="flex items-center gap-2">
                        <Ticket className="h-3.5 w-3.5 text-gold" /> {booking.seats.join(', ')}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                      <div>
                        <span className="text-xs text-muted">Total paid </span>
                        <span className="font-display text-xl font-semibold text-gold">
                          {formatCurrency(booking.total)}
                        </span>
                        <span className="ml-2 text-xs text-muted">({booking.ticketCount} tickets)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setDetails(booking)}>
                          View ticket
                        </Button>
                        {booking.status === 'upcoming' && (
                          <Button
                            variant="danger"
                            size="sm"
                            icon={XCircle}
                            onClick={() => setToCancel(booking)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={Boolean(details)}
        onClose={() => setDetails(null)}
        title="Your Ticket"
        subtitle={details?.reference}
        size="md"
      >
        {details && (
          <>
            <TicketCard
              booking={details}
              movie={getMovieById(details.movieId)}
              cinema={getCinemaById(details.cinemaId)}
              hall={getHallById(details.hallId)}
            />
            <div className="mt-4 grid gap-3 rounded-xl border border-line bg-surface-2/60 p-4 text-xs sm:grid-cols-2">
              <div>
                <p className="text-muted">Customer</p>
                <p className="font-medium text-ink">{details.customer?.name}</p>
              </div>
              <div>
                <p className="text-muted">Email</p>
                <p className="font-medium text-ink">{details.customer?.email}</p>
              </div>
              <div>
                <p className="text-muted">Payment method</p>
                <p className="font-medium text-ink">{details.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted">Status</p>
                <StatusPill status={details.status} />
              </div>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toCancel)}
        onClose={() => setToCancel(null)}
        onConfirm={doCancel}
        title="Cancel this booking?"
        message={`Booking ${toCancel?.reference} will be marked as cancelled. This cannot be undone.`}
        confirmLabel="Yes, cancel booking"
        loading={cancelling}
      />
    </div>
  )
}
