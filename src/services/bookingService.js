import { api, demoRequest, isDemoMode } from './api.js'
import { store } from '../data/store.js'
import { generateBookingReference } from '../utils/format.js'
import { createResource, deleteResource, listResource, updateResource } from './adminService.js'

export const listBookings = () => listResource('bookings')

export async function getBookingById(id) {
  if (!isDemoMode) {
    const { data } = await api.get(`/bookings/${id}`)
    return data.data ?? data
  }
  return demoRequest(store.bookings.find((booking) => booking.id === id))
}

export async function createBooking(payload) {
  if (!isDemoMode) {
    const { data } = await api.post('/bookings', payload)
    return data.data ?? data
  }
  return createResource('bookings', {
    status: 'upcoming',
    reference: generateBookingReference(),
    createdAt: new Date().toISOString(),
    ...payload,
  })
}

export const updateBooking = (id, payload) => updateResource('bookings', id, payload)
export const cancelBooking = (id) => updateBooking(id, { status: 'cancelled' })
export const deleteBooking = (id) => deleteResource('bookings', id)
