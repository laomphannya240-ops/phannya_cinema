import { Link } from 'react-router-dom'
import { Camera, Clapperboard, Mail, MapPin, MessageCircle, Phone, Play } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const currentYear = new Date().getFullYear()

const columns = [
  {
    key: 'footer.experience',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Now Showing', to: '/movies?status=now-showing' },
      { label: 'Coming Soon', to: '/movies?status=coming-soon' },
      { label: 'Showtimes', to: '/showtimes' },
      { label: 'Promotions', to: '/promotions' },
    ],
  },
  {
    key: 'footer.help',
    links: [
      { label: 'My Bookings', to: '/my-bookings' },
      { label: 'Favourite Movies', to: '/favorites' },
      { label: 'My Profile', to: '/profile' },
      { label: 'Sign In', to: '/login' },
      { label: 'Create Account', to: '/register' },
    ],
  },
]

export default function Footer() {
  const { t } = useLanguage()
  const { toast } = useToast()

  return (
    <footer className="mt-16 border-t border-line bg-surface/60">
      <div className="section-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-crimson to-[#7d0f18] text-white">
              <Clapperboard className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold tracking-[0.08em] text-ink">
                PHANNYA
              </span>
              <span className="block text-[8px] font-semibold uppercase tracking-[0.42em] text-gold">
                Cinema
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">
            A premium cinema experience with the finest screens, the richest sound and stories
            worth sharing.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { icon: MessageCircle, label: 'Facebook' },
              { icon: Camera, label: 'Instagram' },
              { icon: Play, label: 'YouTube' },
            ].map((social) => {
              const Icon = social.icon
              return (
                <button
                  key={social.label}
                  type="button"
                  onClick={() => toast.info(`${social.label} page coming soon.`, 'Follow us')}
                  className="btn-icon"
                  aria-label={social.label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              )
            })}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.key}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              {t(column.key)}
            </h3>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Get in touch
          </h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
              Central Tower, Norodom Blvd, Phnom Penh
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
              +855 23 999 101
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
              hello@phannya.cinema
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Phannya Cinema. {t('footer.rights')}</p>
          <p>{t('footer.demo')}</p>
        </div>
      </div>
    </footer>
  )
}
