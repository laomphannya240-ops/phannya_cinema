import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  Heart,
  Languages,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  Ticket,
  User,
} from 'lucide-react'
import Tabs from '../../components/common/Tabs.jsx'
import Button from '../../components/common/Button.jsx'
import { Input } from '../../components/common/FormFields.jsx'
import MovieGrid from '../../components/movies/MovieGrid.jsx'
import { PageHeading, StatusPill } from '../../components/common/Display.jsx'
import { movies } from '../../data/movies.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatCurrency, formatDate, getInitials } from '../../utils/format.js'

export default function ProfilePage() {
  const [tab, setTab] = useState('overview')
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [notify, setNotify] = useState({ releases: true, offers: true, reminders: false })
  const { user, isAuthenticated, logout, updateProfile, t } = useAuth()
  const { bookings } = useBooking()
  const { favorites } = useFavorites()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="section-shell py-16">
        <div className="card mx-auto max-w-lg p-8 text-center">
          <User className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Sign in to see your profile</h1>
          <p className="mt-2 text-sm text-muted">
            Access your bookings, favourites and account settings in one place.
          </p>
          <Link to="/login" className="btn btn-gold mt-6">
            {t('auth.login')}
          </Link>
        </div>
      </div>
    )
  }

  const favouriteMovies = movies.filter((movie) => favorites.includes(movie.id))
  const myBookings = bookings.slice(0, 4)

  const changePassword = (event) => {
    event.preventDefault()
    if (!password.current || !password.next) {
      toast.error('Please fill in both password fields.', 'Password')
      return
    }
    if (password.next !== password.confirm) {
      toast.error('New passwords do not match.', 'Password')
      return
    }
    toast.success('Demo password updated successfully.', 'Saved')
    setPassword({ current: '', next: '', confirm: '' })
  }

  return (
    <div className="section-shell py-10 sm:py-14 lg:py-16">
      <PageHeading eyebrow="Your account" title={t('auth.profile')} description="Manage your details and preferences." />

      <div className="card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-goldsoft font-display text-2xl font-bold text-[#151006]">
          {user.avatarInitials || getInitials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-semibold text-ink">{user.name}</h2>
          <p className="text-sm text-muted">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={user.role} />
            <span className="text-xs text-muted">Member since 2026</span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setTab('security')} icon={ShieldCheck}>
          Security
        </Button>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        className="mb-6"
        items={[
          { key: 'overview', label: 'Overview', icon: User },
          { key: 'favorites', label: 'Favourites', icon: Heart, count: favorites.length },
          { key: 'settings', label: 'Settings', icon: Bell },
          { key: 'security', label: 'Security', icon: ShieldCheck },
        ]}
      />

      {tab === 'overview' && (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-4 lg:col-span-3 xl:grid-cols-3">
            {[
              { label: 'Total bookings', value: bookings.length, icon: Ticket },
              { label: 'Upcoming', value: bookings.filter((item) => item.status === 'upcoming').length, icon: CalendarDays },
              { label: 'Favourite films', value: favorites.length, icon: Heart },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="card flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/12 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-semibold text-ink">{stat.value}</p>
                    <p className="text-xs text-muted">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card p-5 lg:col-span-2 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-ink">Recent bookings</h3>
              <Link to="/my-bookings" className="text-xs font-semibold text-gold hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {myBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{booking.reference}</p>
                    <p className="text-xs text-muted">
                      {formatDate(booking.date)} · {booking.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gold">{formatCurrency(booking.total)}</span>
                    <StatusPill status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-display text-xl font-semibold text-ink">Quick actions</h3>
            <div className="space-y-2">
              <Link to="/movies" className="btn btn-gold w-full justify-start">Browse movies</Link>
              <Link to="/showtimes" className="btn btn-outline w-full justify-start">Find showtimes</Link>
              <Link to="/favorites" className="btn btn-outline w-full justify-start">My favourites</Link>
            </div>
            <p className="mt-5 rounded-lg bg-surface-2 p-3 text-xs text-muted">
              Demo account — profile changes are kept in memory for this session only.
            </p>
          </div>
        </div>
      )}

      {tab === 'favorites' && (
        <>
          {favouriteMovies.length ? (
            <MovieGrid movies={favouriteMovies} />
          ) : (
            <div className="card p-10 text-center">
              <Heart className="mx-auto h-9 w-9 text-muted" />
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">No favourites yet</h3>
              <p className="mt-2 text-sm text-muted">Tap the heart on a movie to save it here.</p>
              <Link to="/movies" className="btn btn-gold mt-5">Explore movies</Link>
            </div>
          )}
        </>
      )}

      {tab === 'settings' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-5 font-display text-xl font-semibold text-ink">Appearance</h3>
            <p className="label">Theme</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`btn ${theme === 'dark' ? 'btn-gold' : 'btn-outline'}`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`btn ${theme === 'light' ? 'btn-gold' : 'btn-outline'}`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
            </div>
            <p className="label mt-6">Language</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`btn ${language === 'en' ? 'btn-gold' : 'btn-outline'}`}
              >
                <Languages className="h-4 w-4" /> English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`btn ${language === 'km' ? 'btn-gold' : 'btn-outline'}`}
              >
                <Languages className="h-4 w-4" /> ខ្មែរ
              </button>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="mb-5 font-display text-xl font-semibold text-ink">Notifications</h3>
            <div className="space-y-3">
              {[
                { key: 'releases', label: 'New releases', desc: 'News about films you follow.' },
                { key: 'offers', label: 'Special offers', desc: 'Promotions and member discounts.' },
                { key: 'reminders', label: 'Showtime reminders', desc: 'A nudge before your film starts.' },
              ].map((item) => (
                <label key={item.key} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line p-3.5">
                  <span>
                    <span className="block text-sm font-medium text-ink">{item.label}</span>
                    <span className="block text-xs text-muted">{item.desc}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={notify[item.key]}
                    onChange={(event) => setNotify({ ...notify, [item.key]: event.target.checked })}
                    className="h-4 w-4 accent-[var(--gold)]"
                  />
                </label>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-5 w-full"
              onClick={() => toast.success('Notification preferences saved.', 'Saved')}
            >
              Save preferences
            </Button>
          </div>

          <div className="card p-5 sm:p-6 lg:col-span-2">
            <h3 className="mb-4 font-display text-xl font-semibold text-ink">Display name</h3>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                const input = event.currentTarget.elements.displayName.value
                updateProfile({ name: input })
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input name="displayName" defaultValue={user.name} className="input flex-1" aria-label="Display name" />
              <Button type="submit" variant="outline">Save name</Button>
            </form>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-1 font-display text-xl font-semibold text-ink">Change password</h3>
            <p className="mb-5 text-xs text-muted">Demo only — no credentials are stored.</p>
            <form onSubmit={changePassword} className="space-y-4">
              <Input label="Current password" type="password" value={password.current} onChange={(event) => setPassword({ ...password, current: event.target.value })} />
              <Input label="New password" type="password" value={password.next} onChange={(event) => setPassword({ ...password, next: event.target.value })} />
              <Input label="Confirm new password" type="password" value={password.confirm} onChange={(event) => setPassword({ ...password, confirm: event.target.value })} />
              <Button type="submit" variant="gold">Update password</Button>
            </form>
          </div>
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-display text-xl font-semibold text-ink">Session</h3>
            <p className="text-sm text-muted">
              You are signed in as <span className="text-ink">{user.email}</span>. Your session is
              stored in memory and ends when you close or refresh the page.
            </p>
            <Button
              variant="danger"
              className="mt-5"
              icon={LogOut}
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
