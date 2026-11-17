import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Heart,
  Play,
  Share2,
  Star,
  Ticket,
  User,
  Users,
} from 'lucide-react'
import MovieArt from '../../components/common/MovieArt.jsx'
import MovieGrid from '../../components/movies/MovieGrid.jsx'
import TrailerModal from '../../components/movies/TrailerModal.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import { Badge, SectionHeading } from '../../components/common/Display.jsx'
import { movies, getMovieById } from '../../data/movies.js'
import { cinemas, halls } from '../../data/cinemas.js'
import { dateOptions, findShowtimes } from '../../data/showtimes.js'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { cn, formatCurrency, formatDate, formatDuration } from '../../utils/format.js'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = getMovieById(id)
  const [date, setDate] = useState(dateOptions[0].key)
  const [trailerOpen, setTrailerOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { t } = useLanguage()
  const { toast } = useToast()

  if (!movie) {
    return (
      <div className="section-shell py-16">
        <EmptyState
          title="Movie not found"
          description="The film you're looking for isn't in our catalogue."
          actionLabel="Browse all movies"
          onAction={() => navigate('/movies')}
        />
      </div>
    )
  }

  const showtimes = findShowtimes({ movieId: movie.id, date })
  const groupedByCinema = cinemas
    .map((cinema) => ({ cinema, times: showtimes.filter((slot) => slot.cinemaId === cinema.id) }))
    .filter((group) => group.times.length > 0)
  const similar = movies.filter((item) => item.id !== movie.id && item.genres.some((genre) => movie.genres.includes(genre))).slice(0, 5)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Movie link copied to clipboard.', 'Shared')
    } catch {
      toast.info('Share this page with your friends!', 'Share')
    }
  }

  return (
    <div className="pb-4">
      {/* Backdrop */}
      <section className="relative min-h-[380px] overflow-hidden sm:min-h-[460px]">
        <MovieArt movie={movie} banner className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-black/60 to-black/30" />
        <div className="section-shell relative z-10 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        </div>
      </section>

      <div className="section-shell relative z-20 -mt-28 sm:-mt-36">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Poster */}
          <div className="mx-auto w-44 shrink-0 sm:w-56 lg:mx-0 lg:w-full">
            <div className="overflow-hidden rounded-2xl border border-line shadow-[var(--shadow)]">
              <MovieArt movie={movie} className="aspect-[2/3] w-full" />
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(movie.id)}
              className={cn('btn mt-3 w-full', isFavorite(movie.id) ? 'btn-gold' : 'btn-outline')}
            >
              <Heart className={cn('h-4 w-4', isFavorite(movie.id) && 'fill-current')} />
              {isFavorite(movie.id) ? 'In Favourites' : 'Add to Favourites'}
            </button>
          </div>

          {/* Info */}
          <div className="pt-2 text-white lg:pt-16">
            <div className="mb-3 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} tone="gold">
                  {genre}
                </Badge>
              ))}
              <Badge tone={movie.status === 'now-showing' ? 'green' : 'gold'}>
                {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
              </Badge>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>
            <p className="mt-2 font-display text-lg italic text-gold sm:text-xl">{movie.tagline}</p>
            <p className="mt-2 text-sm text-white/60">{movie.titleKh}</p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              {movie.rating > 0 && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-gold">
                  <Star className="h-4 w-4 fill-gold" /> {movie.rating.toFixed(1)}
                  <span className="font-normal text-white/60">({movie.votes.toLocaleString()} votes)</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-white/70">
                <Clock className="h-4 w-4" /> {formatDuration(movie.duration)}
              </span>
              <span className="flex items-center gap-1.5 text-white/70">
                <CalendarDays className="h-4 w-4" /> {formatDate(movie.releaseDate)}
              </span>
              <span className="badge border-white/25 bg-white/10 text-white">{movie.certificate}</span>
              <span className="text-white/60">{movie.language}</span>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
              {movie.description}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Director</p>
                  <p className="mt-0.5 text-sm font-medium">{movie.director}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Cast</p>
                  <p className="mt-0.5 text-sm font-medium">{movie.cast.join(', ')}</p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {movie.status === 'now-showing' && (
                <Link to={`/showtimes?movie=${movie.id}`} className="btn btn-gold btn-lg">
                  <Ticket className="h-4 w-4" /> {t('common.bookNow')}
                </Link>
              )}
              <button
                type="button"
                onClick={() => setTrailerOpen(true)}
                className="btn btn-lg border border-white/25 bg-white/10 text-white"
              >
                <Play className="h-4 w-4 fill-white" /> Watch Trailer
              </button>
              <button
                type="button"
                onClick={share}
                className="btn btn-lg border border-white/25 bg-white/10 text-white"
              >
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Choose your moment"
            title="Available Showtimes"
            description="Select a date, then pick a time that works for you."
          />
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
            {dateOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setDate(option.key)}
                className={cn(
                  'flex min-w-[76px] shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition',
                  date === option.key
                    ? 'border-gold bg-gold/12 text-gold'
                    : 'border-line bg-surface text-muted hover:border-gold/50',
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

          {groupedByCinema.length === 0 ? (
            <EmptyState
              title="No showtimes on this date"
              description="Try another day — new screenings are added regularly."
              actionLabel="Show today"
              onAction={() => setDate(dateOptions[0].key)}
            />
          ) : (
            <div className="space-y-4">
              {groupedByCinema.map(({ cinema, times }) => {
                const hallNames = [...new Set(times.map((slot) => halls.find((hall) => hall.id === slot.hallId)?.name))]
                return (
                  <div key={cinema.id} className="card p-4 sm:p-5">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-ink">{cinema.name}</h3>
                        <p className="text-xs text-muted">{cinema.address}</p>
                      </div>
                      <p className="text-xs text-muted">{hallNames.join(' • ')}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
                      {times.map((slot) => (
                        <Link
                          key={slot.id}
                          to={`/booking/seats?showtime=${slot.id}`}
                          className="btn btn-outline btn-sm flex-col gap-0.5 !py-2.5 hover:!border-gold hover:!text-gold"
                        >
                          <span className="text-sm font-bold">{slot.time}</span>
                          <span className="text-[10px] font-normal text-muted">
                            from {formatCurrency(slot.price, false)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {similar.length > 0 && (
          <section className="mt-16">
            <SectionHeading eyebrow="If you liked this" title="You may also enjoy" />
            <MovieGrid movies={similar} />
          </section>
        )}
      </div>

      <TrailerModal movie={movie} open={trailerOpen} onClose={() => setTrailerOpen(false)} />
    </div>
  )
}
