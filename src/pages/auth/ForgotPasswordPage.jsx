import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Mail, Send } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import Button from '../../components/common/Button.jsx'
import { Input } from '../../components/common/FormFields.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { requestPasswordReset, loading } = useAuth()

  const submit = async (event) => {
    event.preventDefault()
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch {
      /* Toast is handled inside the auth context. */
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to get back in."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-gold hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
          <h2 className="mt-3 font-display text-xl font-semibold text-ink">Check your inbox</h2>
          <p className="mt-2 text-sm text-muted">
            A demo reset link was prepared for <span className="text-ink">{email}</span>. No real email
            was sent.
          </p>
        </div>
      ) : (
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
          <Button type="submit" size="lg" className="w-full" loading={loading} icon={Send}>
            Send Reset Link
          </Button>
          <p className="text-center text-xs text-muted">Demo only — no email is actually sent.</p>
        </form>
      )}
    </AuthLayout>
  )
}
