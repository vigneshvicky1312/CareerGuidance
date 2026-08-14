import { apiFetch } from './api'

export async function loginAdmin(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data.token) {
    localStorage.setItem('cgp_token', data.token)
  }
  return data.user
}

export async function logoutAdmin() {
  localStorage.removeItem('cgp_token')
  return Promise.resolve()
}

// Subscribes to auth state; returns an unsubscribe function.
export function watchAuthState(callback) {
  let active = true

  const checkAuth = async () => {
    const token = localStorage.getItem('cgp_token')
    if (!token) {
      if (active) callback(null)
      return
    }
    try {
      const data = await apiFetch('/api/auth/me')
      if (active) callback(data.user)
    } catch {
      localStorage.removeItem('cgp_token')
      if (active) callback(null)
    }
  }

  checkAuth()

  return () => {
    active = false
  }
}
