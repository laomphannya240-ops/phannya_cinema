import { useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Clapperboard, Menu, Search, X, Film, MapPin, ArrowUpRight } from 'lucide-react'
import { movies } from '../../data/movies.js'
import { cinemas } from '../../data/cinemas.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import useClickOutside from '../../hooks/useClickOutside.js'
import { LanguageToggle, NotificationMenu, ProfileMenu, ThemeToggle } from './Controls.jsx'
import { cn } from '../../utils/format.js'

function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex shrink-0 items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-crimson to-[#7d0f18] text-white shadow-lg shadow-crimson/20">
        <Clapperboard className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-bold tracking-[0.08em] text-ink sm:text-xl">
          PHANNYA
        </span>
        <span className="block text-[8px] font-semibold uppercase tracking-[0.42em] text-gold">
          Cinema
        </span>
      </span>
    </Link>
  )
}

export default function Header() {
  const { t } = useLanguage()
  const { isAuthenticated, isAdmin } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const searchRef = useRef(null)
  useClickOutside(searchRef, () => setSearchOpen(false), searchOpen)

  const navItems = useMemo(
    () => [
      { to: '/', label: t('nav.home'), end: true },
      { to: '/movies', label: t('nav.movies') },
      { to: '/showtimes', label: t('nav.showtimes') },
      { to: '/promotions', label: t('nav.promotions') },
      { to: '/my-bookings', label: t('nav.myBookings') },
      ...(isAdmin ? [{ to: '/admin', label: t('nav.admin') }] : []),
    ],
    [t, isAdmin],
  )

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return { movies: movies.slice(0, 4), cinemas: [] }
    return {
      movies: movies
        .filter(
          (movie) =>
            movie.title.toLowerCase().includes(term) ||
            movie.genres.some((genre) => genre.toLowerCase().includes(term)),
        )
        .slice(0, 5),
      cinemas: cinemas.filter((cinema) => cinema.name.toLowerCase().includes(term)).slice(0, 3),
    }
  }, [query])

  const goTo = (path) => {
    navigate(path)
    setSearchOpen(false)
    setQuery('')
    setMobileOpen(false)
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-line/80">
      <div className="section-shell flex h-16 items-center justify-between gap-3 lg:h-20">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-3.5 py-2 text-sm font-medium transition xl:px-4',
                  isActive ? 'text-gold' : 'text-muted hover:bg-surface-2 hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-gold" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="relative" ref={searchRef}>
            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              className="btn-icon"
              aria-label="Global search"
            >
              {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
            {searchOpen && (
              <div className="animate-scale-in absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow)]">
                <div className="border-b border-line p-3">
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('common.searchPlaceholder')}
                    className="input"
                  />
                </div>
                <div className="max-h-[22rem] overflow-y-auto p-2">
                  <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                    Movies
                  </p>
                  {results.movies.map((movie) => (
                    <button
                      key={movie.id}
                      type="button"
                      onClick={() => goTo(`/movies/${movie.id}`)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-surface-2"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gold/10 text-gold">
                        <Film className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{movie.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {movie.genres.join(', ')}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted" />
                    </button>
                  ))}
                  {results.cinemas.length > 0 && (
                    <>
                      <p className="mt-2 px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                        Cinemas
                      </p>
                      {results.cinemas.map((cinema) => (
                        <button
                          key={cinema.id}
                          type="button"
                          onClick={() => goTo(`/showtimes?cinema=${cinema.id}`)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-surface-2"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-crimson/10 text-crimson">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm text-ink">
                            {cinema.name}
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-muted" />
                        </button>
                      ))}
                    </>
                  )}
                  {!results.movies.length && !results.cinemas.length && (
                    <p className="px-2 py-6 text-center text-sm text-muted">No matches found.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <LanguageToggle />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden sm:block">
            <NotificationMenu />
          </div>
          <div className="hidden sm:block">
            <ProfileMenu />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="btn-icon lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-slide-right absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col border-l border-line bg-surface">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo onClick={() => setMobileOpen(false)} />
              <button type="button" onClick={() => setMobileOpen(false)} className="btn-icon" aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted">
                Menu
              </p>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-gold/12 text-gold'
                        : 'text-muted hover:bg-surface-2 hover:text-ink',
                    )
                  }
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4" />
                </NavLink>
              ))}
              <div className="my-5 divider" />
              <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-muted">
                Preferences
              </p>
              <div className="flex items-center gap-2 px-2">
                <LanguageToggle />
                <ThemeToggle />
                <NotificationMenu />
              </div>
            </nav>
            <div className="border-t border-line p-5">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    navigate('/profile')
                  }}
                  className="btn btn-outline w-full"
                >
                  My Profile
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-outline">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-gold">
                    Register
                  </Link>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  toast.info('Follow us on social media for the latest releases.', 'Stay connected')
                  setMobileOpen(false)
                }}
                className="mt-3 w-full text-center text-xs text-muted"
              >
                Phannya Cinema · Since 2018
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
