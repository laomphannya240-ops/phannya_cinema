import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from './adminService.js'

export const listCinemas = () => listResource('cinemas')
export const listHalls = () => listResource('halls')
export const listSeats = () => listResource('seats')

export const createCinema = (payload) => createResource('cinemas', payload)
export const updateCinema = (id, payload) => updateResource('cinemas', id, payload)
export const deleteCinema = (id) => deleteResource('cinemas', id)

export const createHall = (payload) => createResource('halls', payload)
export const updateHall = (id, payload) => updateResource('halls', id, payload)
export const deleteHall = (id) => deleteResource('halls', id)

export const createSeat = (payload) => createResource('seats', payload)
export const updateSeat = (id, payload) => updateResource('seats', id, payload)
export const deleteSeat = (id) => deleteResource('seats', id)
