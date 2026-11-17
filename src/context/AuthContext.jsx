import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Ticket as TicketIcon } from 'lucide-react'
import { useToast } from './ToastContext.jsx'
import { useNotifications } from './NotificationContext.jsx'
import * as authService from '../services/authService.js'
import { getInitials } from '../utils/format.js'

const AuthContext = createContext(null)

/** Session lives in memory only — no tokens or personal data in localStorage. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { pushNotification } = useNotifications()

  const login = useCallback(
    async (email, password) => {
      setLoading(true)
      try {
        const result = await authService.login(email, password)
        setUser({ ...result, avatarInitials: result.avatarInitials || getInitials(result.name) })
        toast.success(`Welcome back, ${result.name.split(' ')[0]}!`, 'Signed in')
        pushNotification({
          icon: TicketIcon,
          title: 'Welcome back',
          message: 'You are signed in to Phannya Cinema.',
        })
        return result
      } finally {
        setLoading(false)
      }
    },
    [toast, pushNotification],
  )

  const register = useCallback(
    async (payload) => {
      setLoading(true)
      try {
        const result = await authService.register(payload)
        setUser({ ...result, avatarInitials: getInitials(result.name) })
        toast.success('Your account has been created.', 'Welcome to Phannya')
        return result
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const requestPasswordReset = useCallback(
    async (email) => {
      setLoading(true)
      try {
        await authService.requestPasswordReset(email)
        toast.success('A demo reset link has been prepared for your email.', 'Password reset')
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const updateProfile = useCallback(
    (changes) => {
      setUser((current) => (current ? { ...current, ...changes } : current))
      toast.success('Profile updated successfully.', 'Saved')
    },
    [toast],
  )

  const logout = useCallback(() => {
    setUser(null)
    authService.logout?.()
    toast.info('You have been signed out.', 'See you soon')
  }, [toast])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      loading,
      login,
      register,
      requestPasswordReset,
      updateProfile,
      logout,
    }),
    [user, loading, login, register, requestPasswordReset, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
