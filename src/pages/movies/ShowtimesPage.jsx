import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Armchair, CalendarDays, MapPin, MonitorPlay, Sparkles } from 'lucide-react'
import { PageHeading } from '../../components/common/Display.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import { Select } from '../../components/common/FormFields.jsx'
import { nowShowingMovies, getMovieById } from '../../data/movies.js'
import { cinemas, getHallById } from '../../data/cinemas.js'
import { dateOptions, findShowtimes } from '../../data/showtimes.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { cn, formatCurrency } from '../../utils/format.js'

export default function ShowtimesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useLanguage()
  const [movieId, setMovieId] = useState(searchParams.get('movie') || 'all')
  const [cinemaId, setCinemaId] = useState(searchParams.get('cinema') || 'all')
  const [date, setDate] = useState(searchParams.get('date') || dateOptions[0].key)

  const results = useMemo(
    () => findShowtimes({ movieId: movieId === 'all' ? null : movieId, cinemaId: cinemaId === 'all' ? null : cinemaId, date }),
    [movieId, cinemaId, date],
  )

  const grouped = useMemo(() => {
    return cinemas
      .filter((cinema) => cinemaId === 'all' || cinema.id === cinemaId)
      .map((cinema) => ({
        cinema,
        slots: results.filter((slot) => slot.cinemaId === cinema.id),
      }))
      .filter((group) => group.slots.length > 0)
  }, [results, cinemaId])

  const updateParam = (key, value, setter) => {
    setter(value)
    const next = new URLSearchParams(searchParams)
    if (value === 'all' || !value) next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="section-shell py-10 sm:py-14 lg:py-16">
      <PageHeading eyebrow="Plan your movie night" title={t('showtimes.title')} description={t('showtimes.subtitle')} />

      <div className="card mb-6 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Movie"
            value={movieId}
            onChange={(event) => updateParam('movie', event.target.value, setMovieId)}
          >
            <option value="all">All movies</option>
            {nowShowingMovies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </Select>
          <Select
            label="Cinema"
            value={cinemaId}
            onChange={(event) => updateParam('cinema', event.target.value, setCinemaId)}
          >
            <option value="all">All cinemas</option>
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </Select>
          <div className="flex items-end">
            <div className="w-full rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-muted">
              <CalendarDays className="mr-2 inline h-3.5 w-3.5 text-gold" />
              {results.length} screening{results.length === 1 ? '' : 's'} available
            </div>
          </div>
        </div>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {dateOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => updateParam('date', option.key, setDate)}
              className={cn(
                'flex min-w-[78px] shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition',
                date === option.key
                  ? 'border-gold bg-gold/12 text-gold'
                  : 'border-line text-muted hover:border-gold/50 hover:text-ink',
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {option.isToday ? 'Today' : option.day}
              </span>
              <span className="font-display text-2xl font-semibold">{option.date}</span>
              <span className="text-[10px]">{option.month}</span>
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No screenings found"
          description="Try changing the movie, cinema or date to see more showtimes."
          actionLabel="Reset filters"
          onAction={() => {
            updateParam('movie', 'all', setMovieId)
            updateParam('cinema', 'all', setCinemaId)
            updateParam('date', dateOptions[0].key, setDate)
          }}
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(({ cinema, slots }) => {
            const hallIds = [...new Set(slots.map((slot) => slot.hallId))]
            return (
              <div key={cinema.id} className="card overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-line p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-crimson/12 text-crimson">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-ink">{cinema.name}</h2>
                      <p className="text-xs text-muted">{cinema.address}</p>
                      <p className="mt-1 text-xs text-muted">{cinema.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cinema.features.map((feature) => (
                      <span key={feature} className="badge badge-gray">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  {hallIds.map((hallId) => {
                    const hall = getHallById(hallId)
                    const hallSlots = slots.filter((slot) => slot.hallId === hallId)
                    if (!hall) return null
                    return (
                      <div key={hallId} className="rounded-xl border border-line bg-surface-2/60 p-3 sm:p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <MonitorPlay className="h-4 w-4 text-gold" />
                            <p className="text-sm font-semibold text-ink">{hall.name}</p>
                            <span className="badge badge-gold">{hall.type}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-muted">
                            <span className="flex items-center gap-1">
                              <Armchair className="h-3.5 w-3.5" /> {hall.rows * hall.seatsPerRow} seats
                            </span>
                            <span>from {formatCurrency(hall.price, false)}</span>
                          </div>
                        </div>
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {hall.features.map((feature) => (
                            <span key={feature} className="text-[11px] text-muted">
                              • {feature}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                          {hallSlots.map((slot) => {
                            const movie = getMovieById(slot.movieId)
                            const seatsLeft = slot.totalSeats - slot.occupiedSeats.length
                            return (
                              <Link
                                key={slot.id}
                                to={`/booking/seats?showtime=${slot.id}`}
                                className="btn btn-outline btn-sm flex-col gap-0.5 !py-2.5 hover:!border-gold hover:!text-gold"
                              >
                                <span className="text-sm font-bold">{slot.time}</span>
                                <span className="w-full truncate text-center text-[10px] font-normal text-muted">
                                  {movieId === 'all' ? movie?.title : `${seatsLeft} seats`}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        All prices are demo values in USD. No payment is processed.
      </p>
    </div>
  )
}
