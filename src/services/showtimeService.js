import { api, demoRequest, isDemoMode } from './api.js'
import { store } from '../data/store.js'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from './adminService.js'

export const listShowtimes = () => listResource('showtimes')

export async function getShowtimeById(id) {
  if (!isDemoMode) {
    const { data } = await api.get(`/showtimes/${id}`)
    return data.data ?? data
  }
  return demoRequest(store.showtimes.find((showtime) => showtime.id === id))
}

export async function queryShowtimes(filters = {}) {
  if (!isDemoMode) {
    const { data } = await api.get('/showtimes', { params: filters })
    return data.data ?? data
  }
  const results = store.showtimes.filter((showtime) =>
    Object.entries(filters).every(([key, value]) => !value || showtime[key] === value),
  )
  return demoRequest(results)
}

export const createShowtime = (payload) =>
  createResource('showtimes', { occupiedSeats: [], totalSeats: 160, ...payload })
export const updateShowtime = (id, payload) => updateResource('showtimes', id, payload)
export const deleteShowtime = (id) => deleteResource('showtimes', id)
