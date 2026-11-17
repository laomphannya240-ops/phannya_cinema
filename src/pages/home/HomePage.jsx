import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Play,
  Send,
  Sparkles,
  Star,
  Ticket,
} from 'lucide-react'
import MovieArt from '../../components/common/MovieArt.jsx'
import MovieGrid from '../../components/movies/MovieGrid.jsx'
import TrailerModal from '../../components/movies/TrailerModal.jsx'
import { SectionHeading } from '../../components/common/Display.jsx'
import Button from '../../components/common/Button.jsx'
import { Select } from '../../components/common/FormFields.jsx'
import { featuredMovies, nowShowingMovies, comingSoonMovies, popularMovies, trendingMovies, genres } from '../../data/movies.js'
import { cinemas } from '../../data/cinemas.js'
import { dateOptions } from '../../data/showtimes.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { cn, formatDuration, truncate } from '../../utils/format.js'

const categoryStyles = [
  'from-red-900/70 to-black',
  'from-indigo-900/70 to-black',
  'from-emerald-900/70 to-black',
  'from-amber-900/70 to-black',
  'from-fuchsia-900/70 to-black',
  'from-sky-900/70 to-black',
]

export default function HomePage() {
  const [active, setActive] = useState(0)
  const [trailer, setTrailer] = useState(null)
  const [movieId, setMovieId] = useState('all')
  const [cinemaId, setCinemaId] = useState('all')
  const [date, setDate] = useState(dateOptions[0].key)
  const [email, setEmail] = useState('')
  const { t } = useLanguage()
  const { toast } = useToast()
  const navigate = useNavigate()
  const movie = featuredMovies[active]

  useEffect(() => {
    const timer = setInterval(() => setActive((current) => (current + 1) % featuredMovies.length), 8000)
    return () => clearInterval(timer)
  }, [])

  const findShowtimes = () => {
    const params = new URLSearchParams()
    if (movieId !== 'all') params.set('movie', movieId)
    if (cinemaId !== 'all') params.set('cinema', cinemaId)
    if (date) params.set('date', date)
    navigate(`/showtimes?${params.toString()}`)
  }

  const subscribe = (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.', 'Invalid email')
      return
    }
    toast.success('You are on the list. Watch your inbox for new releases!', 'Subscribed')
    setEmail('')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden lg:min-h-[700px]">
        {featuredMovies.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === active ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <MovieArt movie={item} banner className="h-full w-full scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-black/40" />
          </div>
        ))}

        <div className="section-shell relative z-10 w-full pb-24 pt-16 sm:pb-28 lg:pt-0">
          <div className="max-w-2xl">
            <span className="eyebrow mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.tagline')}
            </span>
            <h1 className="font-display text-5xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              {movie.title}
            </h1>
            <p className="mt-3 font-display text-xl italic text-gold sm:text-2xl">
              {movie.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-white/80">
              <span className="badge badge-gold">
                <Star className="h-3 w-3 fill-gold" /> {movie.rating.toFixed(1)} / 10
              </span>
              <span className="badge border-white/20 bg-white/10 text-white">
                <Clock className="h-3 w-3" /> {formatDuration(movie.duration)}
              </span>
              <span className="badge border-white/20 bg-white/10 text-white">
                {movie.genres.join(' · ')}
              </span>
              <span className="badge border-white/20 bg-white/10 text-white">
                {movie.certificate}
              </span>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {truncate(movie.description, 190)}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to={`/showtimes?movie=${movie.id}`} className="btn btn-gold btn-lg">
                <Ticket className="h-4 w-4" />
                {t('common.bookTickets')}
              </Link>
              <button
                type="button"
                onClick={() => setTrailer(movie)}
                className="btn btn-lg border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/60"
              >
                <Play className="h-4 w-4 fill-white" />
                Watch Trailer
              </button>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3 sm:mt-12">
            <button
              type="button"
              onClick={() => setActive((current) => (current - 1 + featuredMovies.length) % featuredMovies.length)}
              className="btn-icon border-white/20 bg-black/30 text-white"
              aria-label="Previous featured movie"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {featuredMovies.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${item.title}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    index === active ? 'w-8 bg-gold' : 'w-4 bg-white/35 hover:bg-white/60',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActive((current) => (current + 1) % featuredMovies.length)}
              className="btn-icon border-white/20 bg-black/30 text-white"
              aria-label="Next featured movie"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs text-white/60">
              0{active + 1} / 0{featuredMovies.length}
            </span>
          </div>
        </div>
      </section>

      {/* Quick booking bar */}
      <div className="section-shell relative z-20 -mt-12 sm:-mt-14">
        <div className="card grid gap-3 p-4 shadow-[var(--shadow)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end lg:p-5">
          <Select value={movieId} onChange={(event) => setMovieId(event.target.value)} label="Movie">
            <option value="all">All movies</option>
            {nowShowingMovies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </Select>
          <Select value={cinemaId} onChange={(event) => setCinemaId(event.target.value)} label="Cinema">
            <option value="all">All cinemas</option>
            {cinemas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.shortName}
              </option>
            ))}
          </Select>
          <div>
            <label className="label" htmlFor="home-date">
              Date
            </label>
            <input
              id="home-date"
              type="date"
              value={date}
              min={dateOptions[0].key}
              onChange={(event) => setDate(event.target.value)}
              className="input"
            />
          </div>
          <Button size="lg" onClick={findShowtimes} icon={CalendarDays} className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto">
            Find Showtimes
          </Button>
        </div>
      </div>

      <div className="section-shell mt-16 space-y-20 lg:mt-24 lg:space-y-28">
        <section>
          <SectionHeading
            eyebrow="Big screen, right now"
            title={t('home.nowShowing')}
            action={
              <Link to="/movies?status=now-showing" className="btn btn-outline btn-sm">
                {t('common.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <MovieGrid movies={nowShowingMovies.slice(0, 5)} />
        </section>

        <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-crimson/25 via-surface to-surface p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-crimson/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4">{t('home.promotions')}</span>
              <h2 className="text-3xl font-semibold text-ink sm:text-5xl">
                Golden Tuesday — <span className="text-gradient">20% off</span> every ticket
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                Make the middle of the week feel like the weekend. Use code{' '}
                <span className="font-bold text-gold">GOLDEN20</span> at checkout, every Tuesday.
              </p>
            </div>
            <Link to="/promotions" className="btn btn-gold btn-lg shrink-0">
              Explore Offers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Get ready for the big screen"
            title={t('home.comingSoon')}
            action={
              <Link to="/movies?status=coming-soon" className="btn btn-outline btn-sm">
                {t('common.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <MovieGrid movies={comingSoonMovies.slice(0, 4)} />
        </section>

        <section>
          <SectionHeading eyebrow="Audience favourites" title={t('home.popular')} />
          <MovieGrid movies={popularMovies.slice(0, 5)} />
        </section>

        <section>
          <SectionHeading eyebrow="What everyone is talking about" title={t('home.trending')} />
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {trendingMovies.map((item) => (
              <Link
                key={item.id}
                to={`/movies/${item.id}`}
                className="card card-hover group relative h-64 w-[260px] shrink-0 snap-start overflow-hidden sm:w-[320px] sm:h-72"
              >
                <MovieArt movie={item} banner className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                    {item.genres[0]}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/70">
                    <Star className="h-3 w-3 fill-gold text-gold" /> {item.rating || 'Coming soon'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Find your mood" title={t('home.categories')} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {genres.slice(0, 12).map((genre, index) => (
              <Link
                key={genre}
                to={`/movies?genre=${encodeURIComponent(genre)}`}
                className={cn(
                  'card card-hover relative flex h-28 items-end overflow-hidden border-0 bg-gradient-to-br p-4 sm:h-32',
                  categoryStyles[index % categoryStyles.length],
                )}
              >
                <span className="relative z-10 font-display text-lg font-semibold text-white">
                  {genre}
                </span>
                <ArrowRight className="absolute right-3 top-3 h-4 w-4 text-white/50 transition group-hover:text-white" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="Closer to you" title={t('home.cinemas')} />
          <div className="grid gap-4 md:grid-cols-3">
            {cinemas.map((cinema) => (
              <div key={cinema.id} className="card card-hover p-5 sm:p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/12 text-crimson">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink">{cinema.name}</h3>
                <p className="mt-1 text-xs text-muted">{cinema.address}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cinema.features.map((feature) => (
                    <span key={feature} className="badge badge-gray">
                      {feature}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/showtimes?cinema=${cinema.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
                >
                  View showtimes <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
            <div>
              <span className="eyebrow mb-4">Newsletter</span>
              <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{t('home.newsletter')}</h2>
              <p className="mt-3 max-w-lg text-sm text-muted sm:text-base">
                Be the first to know about new releases, exclusive previews and member-only offers.
                No spam, just the good stuff.
              </p>
            </div>
            <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="input flex-1"
              />
              <Button type="submit" variant="gold" size="lg" icon={Send} className="sm:w-auto">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>

      <TrailerModal movie={trailer} open={Boolean(trailer)} onClose={() => setTrailer(null)} />
    </div>
  )
}
