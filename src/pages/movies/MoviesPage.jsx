import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Film, Sparkles } from 'lucide-react'
import MovieGrid from '../../components/movies/MovieGrid.jsx'
import MovieFilterBar from '../../components/movies/MovieFilterBar.jsx'
import Tabs from '../../components/common/Tabs.jsx'
import { GridSkeleton } from '../../components/common/States.jsx'
import { PageHeading } from '../../components/common/Display.jsx'
import { genres, movies } from '../../data/movies.js'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { cn } from '../../utils/format.js'

const years = [...new Set(movies.map((movie) => movie.releaseDate.slice(0, 4)))].sort().reverse()

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useLanguage()
  const status = searchParams.get('status') || 'all'
  const [search, setSearch] = useState('')
  const genre = searchParams.get('genre') || 'all'
  const [year, setYear] = useState('all')
  const [rating, setRating] = useState('all')
  const [sort, setSort] = useState('popular')
  const [loading, setLoading] = useState(false)

  const updateWithLoading = (setter) => (value) => {
    setLoading(true)
    setter(value)
  }

  const changeSearch = updateWithLoading(setSearch)
  const changeYear = updateWithLoading(setYear)
  const changeRating = updateWithLoading(setRating)
  const changeSort = updateWithLoading(setSort)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 220)
    return () => clearTimeout(timer)
  }, [status, search, genre, year, rating, sort])

  const counts = useMemo(
    () => ({
      all: movies.length,
      'now-showing': movies.filter((movie) => movie.status === 'now-showing').length,
      'coming-soon': movies.filter((movie) => movie.status === 'coming-soon').length,
    }),
    [],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const result = movies.filter((movie) => {
      if (status !== 'all' && movie.status !== status) return false
      if (genre !== 'all' && !movie.genres.includes(genre)) return false
      if (year !== 'all' && !movie.releaseDate.startsWith(year)) return false
      if (rating !== 'all' && movie.rating < Number(rating)) return false
      if (
        term &&
        !movie.title.toLowerCase().includes(term) &&
        !movie.titleKh.includes(term) &&
        !movie.director.toLowerCase().includes(term) &&
        !movie.genres.some((item) => item.toLowerCase().includes(term))
      ) {
        return false
      }
      return true
    })

    return result.sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return b.releaseDate.localeCompare(a.releaseDate)
        case 'oldest':
          return a.releaseDate.localeCompare(b.releaseDate)
        case 'title':
          return a.title.localeCompare(b.title)
        case 'duration':
          return b.duration - a.duration
        default:
          return b.popular - a.popular || b.rating - a.rating
      }
    })
  }, [status, search, genre, year, rating, sort])

  const changeStatus = (key) => {
    setLoading(true)
    const next = new URLSearchParams(searchParams)
    if (key === 'all') next.delete('status')
    else next.set('status', key)
    setSearchParams(next, { replace: true })
  }

  const changeGenre = (value) => {
    setLoading(true)
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete('genre')
    else next.set('genre', value)
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    setLoading(true)
    setSearch('')
    setYear('all')
    setRating('all')
    setSort('popular')
    setSearchParams({}, { replace: true })
  }

  const activeFilters =
    [search && `"${search}"`, genre !== 'all' && genre, year !== 'all' && year, rating !== 'all' && `${rating}+`].filter(
      Boolean,
    )

  return (
    <div className="section-shell py-10 sm:py-14 lg:py-16">
      <PageHeading eyebrow="The big screen awaits" title={t('movies.title')} description={t('movies.subtitle')}>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Film className="h-4 w-4 text-gold" />
          <span>
            Showing <span className="font-bold text-ink">{filtered.length}</span> of {movies.length} films
          </span>
        </div>
      </PageHeading>

      <div className="mb-6">
        <Tabs
          value={status}
          onChange={changeStatus}
          items={[
            { key: 'all', label: t('common.all'), count: counts.all },
            { key: 'now-showing', label: t('home.nowShowing'), count: counts['now-showing'] },
            { key: 'coming-soon', label: t('home.comingSoon'), count: counts['coming-soon'] },
          ]}
        />
      </div>

      <MovieFilterBar
        search={search}
        onSearch={changeSearch}
        genre={genre}
        onGenre={changeGenre}
        year={year}
        onYear={changeYear}
        rating={rating}
        onRating={changeRating}
        sort={sort}
        onSort={changeSort}
        genres={genres}
        years={years}
        onClear={clearFilters}
      />

      {activeFilters.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Active:</span>
          {activeFilters.map((filter) => (
            <span key={filter} className="badge badge-gold">
              <Sparkles className="h-3 w-3" /> {filter}
            </span>
          ))}
          <button type="button" onClick={clearFilters} className={cn('text-xs text-crimson hover:underline')}>
            Clear all
          </button>
        </div>
      )}

      {loading ? <GridSkeleton count={10} /> : <MovieGrid movies={filtered} onClear={clearFilters} />}
    </div>
  )
}
