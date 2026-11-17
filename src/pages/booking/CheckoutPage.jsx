import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, CreditCard, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react'
import Stepper from '../../components/booking/Stepper.jsx'
import BookingSummary from '../../components/booking/BookingSummary.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import Button from '../../components/common/Button.jsx'
import { Input } from '../../components/common/FormFields.jsx'
import { getMovieById } from '../../data/movies.js'
import { getCinemaById, getHallById } from '../../data/cinemas.js'
import { promotions } from '../../data/promotions.js'
import { useBooking } from '../../context/BookingContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

const paymentMethods = [
  { id: 'Card (Demo)', icon: CreditCard, label: 'Credit / Debit Card', hint: 'Demo only — no card details needed' },
  { id: 'QR Wallet (Demo)', icon: BadgeCheck, label: 'QR Wallet', hint: 'Scan a demo QR at the counter' },
  { id: 'Counter (Demo)', icon: ShieldCheck, label: 'Pay at Counter', hint: 'Collect and pay when you arrive' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { draft, createBooking, loading } = useBooking()
  const { user } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [paymentMethod, setPaymentMethod] = useState('Card (Demo)')
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [errors, setErrors] = useState({})

  if (!draft?.seats?.length) {
    return (
      <div className="section-shell py-12">
        <EmptyState
          title="Your cart is empty"
          description="Choose a film, a showtime and your seats before checking out."
          actionLabel="Browse showtimes"
          onAction={() => navigate('/showtimes')}
        />
      </div>
    )
  }

  const movie = getMovieById(draft.movieId)
  const cinema = getCinemaById(draft.cinemaId)
  const hall = getHallById(draft.hallId)
  const subtotal = draft.seatDetails?.reduce((sum, seat) => sum + seat.price, 0) ?? draft.subtotal
  const discount = promo
    ? promo.type === 'percentage'
      ? (subtotal * promo.discount) / 100
      : Math.min(promo.discount, subtotal)
    : 0
  const total = Math.max(0, subtotal - discount)

  const applyPromo = () => {
    const match = promotions.find(
      (item) => item.code.toLowerCase() === promoInput.trim().toLowerCase() && item.status === 'active',
    )
    if (!match) {
      setPromo(null)
      toast.error('That promo code is invalid or inactive.', 'Promo code')
      return
    }
    setPromo(match)
    toast.success(`${match.title} applied — you saved ${match.discount}${match.type === 'percentage' ? '%' : '$'}!`, 'Promo applied')
  }

  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!customer.name.trim()) nextErrors.name = 'Please enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) nextErrors.email = 'Please enter a valid email.'
    if (!customer.phone.trim()) nextErrors.phone = 'Please enter a phone number.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      toast.error('Please check the highlighted fields.', 'Missing information')
      return
    }

    const booking = await createBooking({
      showtimeId: draft.showtime?.id,
      movieId: draft.movieId,
      cinemaId: draft.cinemaId,
      hallId: draft.hallId,
      date: draft.date,
      time: draft.time,
      seats: draft.seats,
      ticketCount: draft.seats.length,
      subtotal,
      discount,
      total,
      paymentMethod,
      promoCode: promo?.code || null,
      customer,
    })
    toast.success('Your booking is confirmed!', 'All set')
    navigate(`/booking/confirmation/${booking.id}`)
  }

  return (
    <div className="section-shell py-8 sm:py-12">
      <Stepper current={2} />

      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {t('booking.checkout')}
          </h1>
          <p className="mt-1 text-sm text-muted">Just a few details and your seats are reserved.</p>
        </div>
        <Link to="/booking/seats" className="btn btn-ghost btn-sm hidden sm:inline-flex">
          <ArrowLeft className="h-3.5 w-3.5" /> Change seats
        </Link>
      </div>

      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h2 className="mb-5 font-display text-xl font-semibold text-ink">Customer Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                name="name"
                icon={User}
                placeholder="Your full name"
                value={customer.name}
                onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                error={errors.name}
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={customer.email}
                onChange={(event) => setCustomer({ ...customer, email: event.target.value })}
                error={errors.email}
              />
              <Input
                label="Phone number"
                name="phone"
                type="tel"
                icon={Phone}
                placeholder="+855 12 345 678"
                value={customer.phone}
                onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
                error={errors.phone}
                className="sm:col-span-2"
              />
            </div>
            <p className="mt-4 text-xs text-muted">
              Your ticket will be shown on the next screen. No sensitive information is stored.
            </p>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-1 font-display text-xl font-semibold text-ink">Payment Method</h2>
            <p className="mb-5 text-xs text-crimson">
              Demo checkout only — no real payment is collected or processed.
            </p>
            <div className="space-y-2.5">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const active = paymentMethod === method.id
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                      active ? 'border-gold bg-gold/8' : 'border-line hover:border-gold/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={active}
                      onChange={() => setPaymentMethod(method.id)}
                      className="h-4 w-4 accent-[var(--gold)]"
                    />
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-gold/15 text-gold' : 'bg-surface-2 text-muted'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{method.label}</span>
                      <span className="block text-xs text-muted">{method.hint}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Promo Code</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
                placeholder="e.g. GOLDEN20"
                className="input flex-1 uppercase"
                aria-label="Promo code"
              />
              <Button type="button" variant="outline" onClick={applyPromo} className="sm:w-auto">
                Apply
              </Button>
            </div>
            {promo && (
              <p className="mt-3 text-xs text-emerald-400">
                {promo.title} applied — {promo.description}
              </p>
            )}
            <p className="mt-3 text-xs text-muted">
              Try <span className="font-bold text-gold">PHANNYA10</span> for 10% off this demo booking.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary
            movie={movie}
            cinema={cinema}
            hall={hall}
            date={draft.date}
            time={draft.time}
            seats={draft.seats}
            subtotal={subtotal}
            discount={discount}
            total={total}
          >
            <div className="mt-5">
              <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading}>
                <Lock className="h-4 w-4" /> {t('booking.confirm')}
              </Button>
              <p className="mt-3 text-center text-[10px] text-muted">
                By confirming you agree to the demo booking terms.
              </p>
            </div>
          </BookingSummary>
        </div>
      </form>
    </div>
  )
}
