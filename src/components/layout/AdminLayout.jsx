import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Armchair,
  Building2,
  CalendarClock,
  Clapperboard,
  DoorOpen,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Settings,
  Tag,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { LanguageToggle, NotificationMenu, ProfileMenu, ThemeToggle } from './Controls.jsx'
import ScrollToTop from '../common/ScrollToTop.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { cn, getInitials } from '../../utils/format.js'

const groups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/admin/movies', label: 'Movies', icon: Clapperboard },
      { to: '/admin/cinemas', label: 'Cinema Locations', icon: Building2 },
      { to: '/admin/halls', label: 'Cinema Halls', icon: DoorOpen },
      { to: '/admin/seats', label: 'Seats', icon: Armchair },
      { to: '/admin/showtimes', label: 'Showtimes', icon: CalendarClock },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/bookings', label: 'Bookings', icon: Ticket },
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/promotions', label: 'Promotions', icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
]

function Sidebar({ onNavigate }) {
  const { user } = useAuth()
  return (
    <div className="flex h-full flex-col border-r border-line bg-surface">
      <div className="flex h-16 items-center gap-2.5 border-b border-line px-5 lg:h-20">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-goldsoft text-[#151006]">
          <Clapperboard className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-lg font-bold leading-none tracking-wide text-ink">
            PHANNYA
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-gold">
            Admin Studio
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/70">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                      isActive
                        ? 'bg-gold/12 text-gold'
                        : 'text-muted hover:bg-surface-2 hover:text-ink',
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3 rounded-xl bg-surface-2 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-goldsoft text-xs font-bold text-[#151006]">
            {user ? getInitials(user.name) : 'AD'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.name || 'Admin'}</p>
            <p className="truncate text-xs text-muted">{user?.email || 'admin@phannya.demo'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const activeItem = groups.flatMap((group) => group.items).find((item) => item.to === location.pathname)

  return (
    <div className="min-h-screen bg-canvas">
      <ScrollToTop />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="animate-fade-in absolute inset-0 bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="animate-slide-right absolute left-0 top-0 h-full w-72 max-w-[85%]">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="btn-icon absolute right-3 top-4"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="glass sticky top-0 z-30 border-b border-line">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="btn-icon lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                  Admin / {activeItem?.label || 'Dashboard'}
                </p>
                <h1 className="truncate font-display text-xl font-semibold text-ink sm:text-2xl">
                  {activeItem?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link to="/" className="btn btn-outline btn-sm hidden sm:inline-flex">
                <ExternalLink className="h-3.5 w-3.5" />
                View site
              </Link>
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>
              <ThemeToggle />
              <NotificationMenu />
              <ProfileMenu />
            </div>
          </div>
        </header>

        <main key={location.pathname} className="page-enter p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
