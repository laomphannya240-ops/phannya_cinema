import MovieCard from './MovieCard.jsx'
import { EmptyState } from '../common/States.jsx'

export default function MovieGrid({ movies = [], onClear, className = '' }) {
  if (!movies.length) {
    return (
      <EmptyState
        title="No movies found"
        description="Try a different genre, year or search term to discover more films."
        actionLabel="Clear filters"
        onAction={onClear}
      />
    )
  }

  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 ${className}`}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
