import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../utils/format.js'

const ToastContext = createContext(null)

const variants = {
  success: { icon: CheckCircle2, className: 'text-emerald-400' },
  error: { icon: XCircle, className: 'text-red-400' },
  info: { icon: Info, className: 'text-sky-400' },
  warning: { icon: AlertCircle, className: 'text-amber-400' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, variant = 'info', title) => {
      counter.current += 1
      const id = `toast-${counter.current}`
      setToasts((current) => [...current, { id, message, variant, title }])
      setTimeout(() => dismiss(id), 4000)
      return id
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      push,
      success: (message, title) => push(message, 'success', title),
      error: (message, title) => push(message, 'error', title),
      info: (message, title) => push(message, 'info', title),
      warning: (message, title) => push(message, 'warning', title),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end">
        {toasts.map((item) => {
          const Icon = variants[item.variant]?.icon || Info
          return (
            <div
              key={item.id}
              role="status"
              className="glass animate-slide-right pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line px-4 py-3 shadow-[var(--shadow)]"
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', variants[item.variant]?.className)} />
              <div className="min-w-0 flex-1">
                {item.title && <p className="text-sm font-semibold text-ink">{item.title}</p>}
                <p className="text-sm text-muted">{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded p-0.5 text-muted transition hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
