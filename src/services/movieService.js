import { api, demoRequest, isDemoMode } from './api.js'
import { store } from '../data/store.js'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from './adminService.js'

export const listMovies = () => listResource('movies')

export async function getMovieById(id) {
  if (!isDemoMode) {
    const { data } = await api.get(`/movies/${id}`)
    return data.data ?? data
  }
  return demoRequest(store.movies.find((movie) => movie.id === id))
}

export const createMovie = (payload) =>
  createResource('movies', {
    status: 'coming-soon',
    rating: 0,
    votes: 0,
    art: 'nebula',
    palette: ['#0b1026', '#3b1d6e', '#c56bff'],
    genres: [],
    cast: [],
    ...payload,
  })

export const updateMovie = (id, payload) => updateResource('movies', id, payload)
export const deleteMovie = (id) => deleteResource('movies', id)
