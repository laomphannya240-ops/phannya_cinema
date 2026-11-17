import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Shield, User } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import Button from '../../components/common/Button.jsx'
import { Input } from '../../components/common/FormFields.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (event) => {
    event.preventDefault()
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? (location.state?.from || '/admin') : (location.state?.from || '/profile'))
    } catch {
      /* Toast is handled inside the auth context. */
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your bookings and enjoy a faster checkout."
      footer={
        <>
          New to Phannya?{' '}
          <Link to="/register" className="font-semibold text-gold hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-[34px] text-muted transition hover:text-ink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" className="h-3.5 w-3.5 accent-[var(--gold)]" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-xs font-medium text-gold hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-line bg-surface-2/60 p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-ink">
          <Shield className="h-4 w-4 text-gold" /> Demo accounts
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setEmail('guest@phannya.demo')
              setPassword('demo1234')
            }}
            className="btn btn-outline btn-sm justify-start"
          >
            <User className="h-3.5 w-3.5" /> Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@phannya.demo')
              setPassword('demo1234')
            }}
            className="btn btn-outline btn-sm justify-start"
          >
            <Shield className="h-3.5 w-3.5" /> Admin
          </button>
        </div>
        <p className="mt-3 text-[11px] text-muted">
          Demo login runs entirely in memory. Any email with “admin” signs in as an administrator.
        </p>
      </div>
    </AuthLayout>
  )
}
