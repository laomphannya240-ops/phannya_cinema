import axios from 'axios'

/**
 * Single Axios client for the future Laravel backend.
 * Copy `.env.example` to `.env` and set VITE_API_URL to enable real requests.
 * Without it the app runs in demo mode using the local in-memory store.
 */
const baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const isDemoMode = !baseURL

let authToken = null

export function setAuthToken(token) {
  authToken = token || null
}

export function getAuthToken() {
  return authToken
}

export const api = axios.create({
  baseURL: baseURL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  },
)

/** Resolve demo data asynchronously so components exercise real loading states. */
export function demoRequest(data, delay = 180) {
  return new Promise((resolve) => setTimeout(() => resolve(structuredCloneSafe(data)), delay))
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      /* fall through */
    }
  }
  return JSON.parse(JSON.stringify(value))
}
