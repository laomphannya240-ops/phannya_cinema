import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Ticket as TicketIcon } from 'lucide-react'
import { store } from '../data/store.js'
import * as bookingService from '../services/bookingService.js'
import { useToast } from './ToastContext.jsx'
import { useNotifications } from './NotificationContext.jsx'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(null)
  const [bookings, setBookings] = useState(() => [...store.bookings])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { pushNotification } = useNotifications()

  const setSelection = useCallback((selection) => {
    setDraft((current) => ({ ...current, ...selection }))
  }, [])

  const clearDraft = useCallback(() => setDraft(null), [])

  const createBooking = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const created = await bookingService.createBooking(payload)
        setBookings((current) => [created, ...current])
        setDraft(null)
        pushNotification({
          icon: TicketIcon,
          title: 'Booking confirmed',
          message: `Reference ${created.reference} is ready in My Bookings.`,
        })
        return created
      } finally {
        setLoading(false)
      }
    },
    [pushNotification],
  )

  const cancelBooking = useCallback(
    async (id) => {
      const updated = await bookingService.cancelBooking(id)
      setBookings((current) =>
        current.map((booking) => (booking.id === id ? { ...booking, status: 'cancelled' } : booking)),
      )
      toast.success('Booking cancelled.', 'Updated')
      return updated
    },
    [toast],
  )

  const value = useMemo(
    () => ({
      draft,
      setSelection,
      clearDraft,
      bookings,
      loading,
      createBooking,
      cancelBooking,
      getBooking: (id) => bookings.find((booking) => booking.id === id || booking.reference === id),
      refresh: async () => setBookings(await bookingService.listBookings()),
    }),
    [draft, setSelection, clearDraft, bookings, loading, createBooking, cancelBooking],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used inside BookingProvider')
  return context
}
