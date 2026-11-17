import { Link } from 'react-router-dom'
import { Clapperboard, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <Clapperboard className="h-20 w-20 text-gold/30" />
        <span className="absolute -right-3 -top-3 font-display text-3xl font-bold text-crimson">404</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink sm:text-6xl">Scene not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        This page has left the theatre. Let's get you back to the good part.
      </p>
      <Link to="/" className="btn btn-gold mt-7">
        <Home className="h-4 w-4" /> Back to home
      </Link>
    </div>
  )
}
