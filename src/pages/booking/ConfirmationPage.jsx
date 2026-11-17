import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Printer, Ticket } from 'lucide-react'
import Stepper from '../../components/booking/Stepper.jsx'
import TicketCard from '../../components/booking/TicketCard.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import Button from '../../components/common/Button.jsx'
import { getMovieById } from '../../data/movies.js'
import { getCinemaById, getHallById } from '../../data/cinemas.js'
import { useBooking } from '../../context/BookingContext.jsx'

export default function ConfirmationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBooking } = useBooking()
  const booking = getBooking(id)

  if (!booking) {
    return (
      <div className="section-shell py-12">
        <EmptyState
          title="Booking not found"
          description="This booking may have been cancelled or the link is incorrect."
          actionLabel="View my bookings"
          onAction={() => navigate('/my-bookings')}
        />
      </div>
    )
  }

  const movie = getMovieById(booking.movieId)
  const cinema = getCinemaById(booking.cinemaId)
  const hall = getHallById(booking.hallId)

  return (
    <div className="section-shell py-8 sm:py-12">
      <Stepper current={3} />

      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="eyebrow justify-center">Booking confirmed</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          See you at the movies!
        </h1>
        <p className="mt-3 text-sm text-muted">
          Your demo ticket is ready below. Present it at the cinema — no payment was processed.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <TicketCard booking={booking} movie={movie} cinema={cinema} hall={hall} />
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="gold" onClick={() => navigate('/my-bookings')} icon={Ticket}>
            View My Bookings
          </Button>
          <Button variant="outline" onClick={() => window.print()} icon={Printer}>
            Print Ticket
          </Button>
          <Button variant="ghost" onClick={() => navigate('/movies')}>
            Book Another Movie
          </Button>
        </div>
      </div>
    </div>
  )
}
