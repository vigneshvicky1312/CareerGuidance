const BASE_URL = '' // Proxy handles /api via Vite or relative paths

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('cgp_token')
  const headers = {
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(errorData.error || `HTTP error! status: ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}
