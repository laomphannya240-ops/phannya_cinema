import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import SearchInput from '../common/SearchInput.jsx'
import { Select } from '../common/FormFields.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function MovieFilterBar({
  search,
  onSearch,
  genre,
  onGenre,
  year,
  onYear,
  rating,
  onRating,
  sort,
  onSort,
  genres = [],
  years = [],
  onClear,
}) {
  const { t } = useLanguage()

  return (
    <div className="card mb-6 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4 text-gold" />
          {t('common.filter')}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-gold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SearchInput
          value={search}
          onChange={onSearch}
          placeholder={t('common.searchPlaceholder')}
          className="xl:col-span-1"
        />
        <Select value={genre} onChange={(event) => onGenre(event.target.value)}>
          <option value="all">All genres</option>
          {genres.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={year} onChange={(event) => onYear(event.target.value)}>
          <option value="all">All years</option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={rating} onChange={(event) => onRating(event.target.value)}>
          <option value="all">Any rating</option>
          <option value="8">8.0 and above</option>
          <option value="7">7.0 and above</option>
          <option value="6">6.0 and above</option>
        </Select>
        <Select value={sort} onChange={(event) => onSort(event.target.value)}>
          <option value="popular">Most popular</option>
          <option value="rating">Highest rated</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A–Z</option>
          <option value="duration">Longest first</option>
        </Select>
      </div>
    </div>
  )
}
