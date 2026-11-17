import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Phone, User } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import Button from '../../components/common/Button.jsx'
import { Input } from '../../components/common/FormFields.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })

  const submit = async (event) => {
    event.preventDefault()
    try {
      await register(form)
      navigate('/profile')
    } catch {
      /* Toast is handled inside the auth context. */
    }
  }

  return (
    <AuthLayout
      title="Join Phannya"
      subtitle="Create an account to book faster and save your favourite films."
      footer={
        <>
          Already a member?{' '}
          <Link to="/login" className="font-semibold text-gold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" name="name" icon={User} placeholder="Your name" value={form.name} onChange={update('name')} required />
        <Input label="Email address" name="email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={update('email')} required />
        <Input label="Phone number" name="phone" type="tel" icon={Phone} placeholder="+855 12 345 678" value={form.phone} onChange={update('phone')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Password" name="password" type="password" icon={Lock} placeholder="Min. 6 characters" value={form.password} onChange={update('password')} minLength={6} required />
          <Input label="Confirm password" name="confirmPassword" type="password" icon={Lock} placeholder="Repeat password" value={form.confirmPassword} onChange={update('confirmPassword')} minLength={6} required />
        </div>
        <label className="flex items-start gap-2 text-xs text-muted">
          <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5 accent-[var(--gold)]" />
          <span>
            I agree to the <span className="text-gold">Terms of Service</span> and{' '}
            <span className="text-gold">Privacy Policy</span>.
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>
    </AuthLayout>
  )
}
