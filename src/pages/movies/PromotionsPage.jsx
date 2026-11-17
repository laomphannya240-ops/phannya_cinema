import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgePercent, CalendarDays, Copy, Sparkles, Tag, Ticket } from 'lucide-react'
import { PageHeading, Badge } from '../../components/common/Display.jsx'
import Button from '../../components/common/Button.jsx'
import { promotions } from '../../data/promotions.js'
import { useToast } from '../../context/ToastContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { formatDate } from '../../utils/format.js'

export default function PromotionsPage() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [copied, setCopied] = useState(null)

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      toast.success(`${code} copied to clipboard.`, 'Promo code')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.info(`Use code ${code} at checkout.`, 'Promo code')
    }
  }

  return (
    <div className="section-shell py-10 sm:py-14 lg:py-16">
      <PageHeading
        eyebrow="More cinema, less spend"
        title={t('home.promotions')}
        description="Discover the offers that make every screening a little sweeter."
      />

      <div className="relative mb-8 overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-crimson/30 via-surface to-surface p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="eyebrow mb-3">Featured offer</span>
            <h2 className="text-3xl font-semibold text-ink sm:text-5xl">
              Golden Tuesday — <span className="text-gradient">20% off</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Every Tuesday, all seats, all movies. Use code GOLDEN20 at checkout. Valid all week.
            </p>
          </div>
          <Button variant="gold" size="lg" onClick={() => copyCode('GOLDEN20')} icon={Copy}>
            {copied === 'GOLDEN20' ? 'Copied!' : 'Copy code'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="card card-hover flex flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/12 text-gold">
                <Tag className="h-5 w-5" />
              </span>
              <Badge tone={promotion.status === 'active' ? 'green' : 'gold'}>{promotion.status}</Badge>
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink">{promotion.title}</h3>
            <p className="mt-1 text-xs text-muted">{promotion.titleKh}</p>
            <p className="mt-3 flex-1 text-sm text-muted">{promotion.description}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <BadgePercent className="h-4 w-4 text-gold" />
              <span className="font-semibold text-ink">
                {promotion.type === 'percentage' ? `${promotion.discount}% off` : `$${promotion.discount} off`}
              </span>
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-muted">
              <CalendarDays className="h-4 w-4 text-gold" />
              {formatDate(promotion.startDate, { year: undefined })} — {formatDate(promotion.endDate)}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => copyCode(promotion.code)}
                className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-dashed border-gold/50 bg-gold/5 px-3 py-2 font-mono text-xs font-bold text-gold transition hover:bg-gold/12"
              >
                {promotion.code}
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center">
        <Sparkles className="h-5 w-5 text-gold" />
        <p className="text-sm text-muted">Ready to use an offer? Pick your next film.</p>
        <Link to="/showtimes" className="btn btn-gold">
          <Ticket className="h-4 w-4" /> Find Showtimes
        </Link>
      </div>
    </div>
  )
}
