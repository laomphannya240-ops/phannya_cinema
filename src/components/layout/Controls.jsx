import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Languages, LogOut, Moon, Shield, Sun, User, Heart, Ticket } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import useClickOutside from '../../hooks/useClickOutside.js'
import { getInitials } from '../../utils/format.js'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-icon"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="btn-icon gap-1 text-[10px] font-bold"
      aria-label="Switch language"
      title="Khmer / English"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'KM'}</span>
    </button>
  )
}

export function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications()
  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="btn-icon relative"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="animate-scale-in absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-medium text-gold hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted">You're all caught up.</p>
            )}
            {notifications.map((item) => {
              const Icon = item.icon || Bell
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markRead(item.id)}
                  className={`flex w-full gap-3 border-b border-line/60 px-4 py-3 text-left transition hover:bg-surface-2 ${
                    item.read ? 'opacity-60' : ''
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                    <span className="block text-xs text-muted">{item.message}</span>
                    <span className="mt-1 block text-[10px] text-muted/70">{item.time}</span>
                  </span>
                  {!item.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-crimson" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { t } = useLanguage()
  useClickOutside(ref, () => setOpen(false), open)

  if (!isAuthenticated) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link to="/login" className="btn btn-ghost btn-sm">
          {t('auth.login')}
        </Link>
        <Link to="/register" className="btn btn-gold btn-sm">
          {t('auth.register')}
        </Link>
      </div>
    )
  }

  const links = [
    { to: '/profile', label: t('auth.profile'), icon: User },
    { to: '/my-bookings', label: t('nav.myBookings'), icon: Ticket },
    { to: '/favorites', label: t('nav.favorites'), icon: Heart },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: Shield }] : []),
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2 transition hover:border-gold"
        aria-label="Account menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-gold to-goldsoft text-[10px] font-bold text-[#151006]">
          {user.avatarInitials || getInitials(user.name)}
        </span>
        <span className="hidden max-w-24 truncate text-xs font-medium text-ink lg:block">
          {user.name.split(' ')[0]}
        </span>
      </button>
      {open && (
        <div className="animate-scale-in absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow)]">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-gold">
              {user.role}
            </span>
          </div>
          <div className="py-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted transition hover:bg-surface-2 hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              setOpen(false)
              navigate('/')
            }}
            className="flex w-full items-center gap-3 border-t border-line px-4 py-3 text-sm text-crimson transition hover:bg-crimson/10"
          >
            <LogOut className="h-4 w-4" />
            {t('auth.logout')}
          </button>
        </div>
      )}
    </div>
  )
}
