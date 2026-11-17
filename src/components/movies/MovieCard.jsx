import { Link } from 'react-router-dom'
import { Clock, Heart, Star } from 'lucide-react'
import MovieArt from '../common/MovieArt.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { cn, formatDuration } from '../../utils/format.js'

export default function MovieCard({ movie, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { t } = useLanguage()
  const favorite = isFavorite(movie.id)
  const comingSoon = movie.status === 'coming-soon'

  return (
    <article className={cn('card card-hover group relative overflow-hidden', className)}>
      <Link to={`/movies/${movie.id}`} className="relative block aspect-[2/3] overflow-hidden">
        <MovieArt
          movie={movie}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span
            className={cn(
              'badge backdrop-blur-md',
              comingSoon ? 'badge-gold' : 'badge-red',
            )}
          >
            {comingSoon ? 'Coming Soon' : 'Now Showing'}
          </span>
          {movie.rating > 0 && (
            <span className="badge border border-white/20 bg-black/55 text-white backdrop-blur-md">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {movie.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            {movie.genres.slice(0, 2).join(' • ')}
          </p>
          <h3 className="line-clamp-2 font-display text-xl font-semibold leading-tight text-white sm:text-2xl">
            {movie.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(movie.duration)}
            <span className="mx-1 h-1 w-1 rounded-full bg-white/40" />
            {movie.certificate}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(movie.id)}
        aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/80 backdrop-blur-md transition hover:border-gold hover:text-gold"
      >
        <Heart className={cn('h-4 w-4', favorite && 'fill-crimson text-crimson')} />
      </button>

      <div className="flex items-center justify-between gap-2 p-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-muted">{movie.titleKh}</p>
          <p className="text-xs font-medium text-ink">
            {comingSoon ? 'Releases ' + new Date(movie.releaseDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }) : 'From $8.00'}
          </p>
        </div>
        <Link
          to={`/movies/${movie.id}`}
          className="btn btn-gold btn-sm shrink-0"
          aria-label={`${t('common.viewDetails')}: ${movie.title}`}
        >
          {comingSoon ? 'Details' : t('common.bookNow')}
        </Link>
      </div>
    </article>
  )
}
