import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Ticket, Tag, Info } from 'lucide-react'

const initialNotifications = [
  {
    id: 'n1',
    icon: Ticket,
    title: 'Your seats are ready',
    message: 'The Last Oasis is now showing at Central Tower.',
    time: '2h ago',
    read: false,
  },
  {
    id: 'n2',
    icon: Tag,
    title: 'Golden Tuesday',
    message: 'Enjoy 20% off every ticket this Tuesday with code GOLDEN20.',
    time: 'Yesterday',
    read: false,
  },
  {
    id: 'n3',
    icon: Info,
    title: 'New showtimes added',
    message: 'Evening screenings have been extended for the weekend.',
    time: '3 days ago',
    read: true,
  },
]

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markRead = useCallback((id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }, [])

  const pushNotification = useCallback((notification) => {
    setNotifications((current) => [
      {
        id: `n-${Date.now()}`,
        time: 'Just now',
        read: false,
        icon: Info,
        ...notification,
      },
      ...current,
    ])
  }, [])

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markRead,
      markAllRead,
      pushNotification,
    }),
    [notifications, markRead, markAllRead, pushNotification],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used inside NotificationProvider')
  return context
}
