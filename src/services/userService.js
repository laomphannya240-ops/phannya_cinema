import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from './adminService.js'

export const listUsers = () => listResource('users')
export const createUser = (payload) =>
  createResource('users', { role: 'customer', status: 'active', joinedAt: new Date().toISOString().slice(0, 10), ...payload })
export const updateUser = (id, payload) => updateResource('users', id, payload)
export const deleteUser = (id) => deleteResource('users', id)
