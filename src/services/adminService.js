import { api, demoRequest, isDemoMode } from './api.js'
import { store } from '../data/store.js'

/** Generic CRUD used by the admin resource screens. */
export async function listResource(key) {
  if (!isDemoMode) {
    const { data } = await api.get(`/admin/${key}`)
    return data.data ?? data
  }
  return demoRequest([...store[key]])
}

export async function createResource(key, payload) {
  if (!isDemoMode) {
    const { data } = await api.post(`/admin/${key}`, payload)
    return data.data ?? data
  }
  const item = {
    ...payload,
    id: payload.id || `${key.slice(0, 2)}-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  }
  store[key] = [item, ...store[key]]
  return demoRequest(item)
}

export async function updateResource(key, id, payload) {
  if (!isDemoMode) {
    const { data } = await api.put(`/admin/${key}/${id}`, payload)
    return data.data ?? data
  }
  const index = store[key].findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Record not found')
  store[key][index] = { ...store[key][index], ...payload, id }
  return demoRequest(store[key][index])
}

export async function deleteResource(key, id) {
  if (!isDemoMode) {
    await api.delete(`/admin/${key}/${id}`)
    return { success: true }
  }
  store[key] = store[key].filter((item) => item.id !== id)
  return demoRequest({ success: true })
}
