import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  Clapperboard,
  DollarSign,
  Ticket,
  TrendingUp,
  Users,
} from 'lucide-react'
import { StatusPill } from '../../components/common/Display.jsx'
import { store } from '../../data/store.js'
import { getMovieById } from '../../data/movies.js'
import { formatCurrency, formatDate } from '../../utils/format.js'

const revenueBars = [
  { day: 'Mon', value: 420 },
  { day: 'Tue', value: 560 },
  { day: 'Wed', value: 380 },
  { day: 'Thu', value: 640 },
  { day: 'Fri', value: 910 },
  { day: 'Sat', value: 1180 },
  { day: 'Sun', value: 870 },
]
const maxBar = Math.max(...revenueBars.map((item) => item.value))

export default function AdminDashboardPage() {
  const revenue = store.bookings
    .filter((booking) => booking.status !== 'cancelled')
    .reduce((sum, booking) => sum + booking.total, 0)
  const stats = [
    { label: 'Total Movies', value: store.movies.length, icon: Clapperboard, tone: 'text-crimson' },
    { label: 'Total Bookings', value: store.bookings.length, icon: Ticket, tone: 'text-gold' },
    { label: 'Total Customers', value: store.users.filter((user) => user.role === 'customer').length, icon: Users, tone: 'text-sky-400' },
    { label: 'Total Revenue', value: formatCurrency(revenue, false), icon: DollarSign, tone: 'text-emerald-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Overview</p>
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Welcome back, Admin
          </h2>
          <p className="mt-1 text-sm text-muted">Here's what's happening at Phannya Cinema.</p>
        </div>
        <Link to="/admin/movies" className="btn btn-gold">
          <Clapperboard className="h-4 w-4" /> Add new movie
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted">{stat.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-ink">{stat.value}</p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-400">
                <TrendingUp className="h-3 w-3" /> Live demo data
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="card p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">Revenue overview</h3>
              <p className="text-xs text-muted">Demo figures for the last seven days</p>
            </div>
            <span className="badge badge-green">+12.4%</span>
          </div>
          <div className="flex h-56 items-end gap-2 sm:gap-4">
            {revenueBars.map((bar) => (
              <div key={bar.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-muted">${bar.value}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-crimson/30 to-gold transition-all duration-500 hover:from-crimson/60"
                  style={{ height: `${(bar.value / maxBar) * 100}%` }}
                />
                <span className="text-[10px] font-semibold text-muted">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h3 className="mb-4 font-display text-xl font-semibold text-ink">Quick actions</h3>
          <div className="space-y-2">
            {[
              { to: '/admin/movies', label: 'Manage movies', icon: Clapperboard },
              { to: '/admin/showtimes', label: 'Schedule showtimes', icon: CalendarClock },
              { to: '/admin/bookings', label: 'Review bookings', icon: Ticket },
              { to: '/admin/promotions', label: 'Create promotion', icon: DollarSign },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm text-ink transition hover:border-gold hover:bg-gold/5"
                >
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-xl font-semibold text-ink">Recent bookings</h3>
            <Link to="/admin/bookings" className="text-xs font-semibold text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Movie</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {store.bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id}>
                    <td className="font-mono text-xs text-gold">{booking.reference}</td>
                    <td>{getMovieById(booking.movieId)?.title}</td>
                    <td className="text-muted">{formatDate(booking.date)}</td>
                    <td className="font-semibold text-ink">{formatCurrency(booking.total)}</td>
                    <td><StatusPill status={booking.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h3 className="mb-4 font-display text-xl font-semibold text-ink">Top rated movies</h3>
          <div className="space-y-3">
            {[...store.movies].sort((a, b) => b.rating - a.rating).slice(0, 5).map((movie, index) => (
              <div key={movie.id} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-muted">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{movie.title}</p>
                  <p className="text-xs text-muted">{movie.genres[0]}</p>
                </div>
                <span className="text-sm font-semibold text-gold">★ {movie.rating.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
