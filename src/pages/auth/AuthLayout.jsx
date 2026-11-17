import { Link } from 'react-router-dom'
import { Clapperboard, Quote } from 'lucide-react'
import MovieArt from '../../components/common/MovieArt.jsx'
import { movies } from '../../data/movies.js'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-5rem)] lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-crimson to-[#7d0f18] text-white">
              <Clapperboard className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold leading-none tracking-[0.08em] text-ink">
                PHANNYA
              </span>
              <span className="block text-[8px] font-semibold uppercase tracking-[0.42em] text-gold">
                Cinema
              </span>
            </span>
          </Link>

          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <MovieArt movie={movies[0]} banner className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
          <Quote className="mb-4 h-8 w-8 text-gold" />
          <p className="max-w-lg font-display text-3xl italic leading-snug text-white xl:text-4xl">
            Cinema is not just what you watch. It's what you feel when the lights go down.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.25em] text-gold">
            Phannya Cinema · Premium Experience
          </p>
        </div>
      </div>
    </div>
  )
}
