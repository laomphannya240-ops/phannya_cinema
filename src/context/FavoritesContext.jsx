import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { useToast } from './ToastContext.jsx'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('phannya-favorites', [])
  const { toast } = useToast()

  const toggleFavorite = useCallback(
    (movieId) => {
      const exists = favorites.includes(movieId)
      setFavorites((current) =>
        exists ? current.filter((id) => id !== movieId) : [...current, movieId],
      )
      toast.info(exists ? 'Removed from your favourites.' : 'Added to your favourites.')
    },
    [favorites, setFavorites, toast],
  )

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite: (movieId) => favorites.includes(movieId),
      clearFavorites: () => setFavorites([]),
    }),
    [favorites, toggleFavorite, setFavorites],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider')
  return context
}
