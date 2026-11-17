import { Link, useNavigate } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import MovieGrid from '../../components/movies/MovieGrid.jsx'
import Button from '../../components/common/Button.jsx'
import { EmptyState } from '../../components/common/States.jsx'
import { PageHeading } from '../../components/common/Display.jsx'
import { movies } from '../../data/movies.js'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites, clearFavorites } = useFavorites()
  const { toast } = useToast()
  const { t } = useLanguage()
  const list = movies.filter((movie) => favorites.includes(movie.id))

  return (
    <div className="section-shell py-10 sm:py-14 lg:py-16">
      <PageHeading
        eyebrow="Saved for later"
        title={t('nav.favorites')}
        description="All the films you've hearted, ready when you are."
      >
        {list.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              clearFavorites()
              toast.info('Your favourites list has been cleared.')
            }}
          >
            Clear all
          </Button>
        )}
      </PageHeading>

      {list.length ? (
        <MovieGrid movies={list} />
      ) : (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Save films you love by tapping the heart icon on any movie card."
          actionLabel="Explore movies"
          onAction={() => navigate('/movies')}
        />
      )}

      <div className="mt-10 text-center">
        <Link to="/movies" className="btn btn-outline">
          Discover more films
        </Link>
      </div>
    </div>
  )
}
