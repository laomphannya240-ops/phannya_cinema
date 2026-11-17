import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/format.js'

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn('btn', `btn-${variant}`, size !== 'md' && `btn-${size}`, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  )
}
