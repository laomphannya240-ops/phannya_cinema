export function cn(...values) {
  return values.filter(Boolean).join(' ')
}

export function formatCurrency(amount = 0, withCents = true) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

export function formatDate(value, options = {}) {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

export function formatDateLong(value) {
  return formatDate(value, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `PHN-${suffix}`
}

export function sleep(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatDuration(minutes = 0) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours ? `${hours}h ${mins ? `${mins}m` : ''}`.trim() : `${mins}m`
}

export function truncate(text = '', length = 120) {
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text
}

export function statusTone(status = '') {
  const map = {
    active: 'badge-green',
    upcoming: 'badge-blue',
    completed: 'badge-green',
    confirmed: 'badge-green',
    available: 'badge-green',
    'now-showing': 'badge-green',
    paid: 'badge-green',
    'coming-soon': 'badge-gold',
    scheduled: 'badge-gold',
    vip: 'badge-gold',
    inactive: 'badge-gray',
    maintenance: 'badge-gray',
    cancelled: 'badge-red',
    occupied: 'badge-red',
    admin: 'badge-red',
    customer: 'badge-blue',
    staff: 'badge-gold',
  }
  return map[status] || 'badge-gray'
}
