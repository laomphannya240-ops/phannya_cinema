import { api, demoRequest, isDemoMode, setAuthToken } from './api.js'
import { sleep } from '../utils/format.js'

/** Demo authentication. No credentials or tokens are persisted to localStorage. */
export async function login(email, password) {
  if (!isDemoMode) {
    const { data } = await api.post('/auth/login', { email, password })
    const token = data.token || data.data?.token
    if (token) setAuthToken(token)
    return data.user ?? data.data?.user ?? data
  }
  await sleep(420)
  if (!email || !password) throw new Error('Email and password are required.')
  if (password.length < 4) throw new Error('Password must be at least 4 characters.')
  const isAdmin = email.toLowerCase().includes('admin')
  return {
    id: isAdmin ? 'u1' : 'u2',
    name: isAdmin ? 'Sophea Admin' : email.split('@')[0].replace(/[._-]/g, ' '),
    email,
    role: isAdmin ? 'admin' : 'customer',
    avatarInitials: isAdmin ? 'SA' : undefined,
  }
}

export async function register(payload) {
  if (!isDemoMode) {
    const { data } = await api.post('/auth/register', payload)
    return data.user ?? data.data?.user ?? data
  }
  await sleep(450)
  if (payload.password !== payload.confirmPassword) {
    throw new Error('Passwords do not match.')
  }
  return demoRequest({
    id: 'u-new',
    name: payload.name,
    email: payload.email,
    role: 'customer',
  })
}

export function logout() {
  setAuthToken(null)
}

export async function requestPasswordReset(email) {
  if (!isDemoMode) {
    await api.post('/auth/forgot-password', { email })
    return { success: true }
  }
  await sleep(400)
  if (!email) throw new Error('Please enter your email address.')
  return { success: true }
}
