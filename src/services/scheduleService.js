import { apiFetch } from './api'

export async function getScheduleOnce() {
  return apiFetch('/api/schedule')
}

export async function getActiveScheduleOnce() {
  return apiFetch('/api/schedule/active')
}

export function watchSchedule(callback, intervalMs = 5000) {
  let active = true

  const fetchSchedule = async () => {
    try {
      const data = await apiFetch('/api/schedule')
      if (active) callback(data)
    } catch (err) {
      console.error('Error watching schedule:', err)
    }
  }

  fetchSchedule()
  const interval = setInterval(fetchSchedule, intervalMs)

  return () => {
    active = false
    clearInterval(interval)
  }
}

export async function updateScheduleSettings(settings) {
  return apiFetch('/api/schedule/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
}

export async function addScheduleItem(item) {
  return apiFetch('/api/schedule/items', {
    method: 'POST',
    body: JSON.stringify(item),
  })
}

export async function updateScheduleItem(id, item) {
  return apiFetch(`/api/schedule/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  })
}

export async function deleteScheduleItem(id) {
  return apiFetch(`/api/schedule/items/${id}`, {
    method: 'DELETE',
  })
}

export async function reorderScheduleItems(orderedIds) {
  return apiFetch('/api/schedule/reorder', {
    method: 'POST',
    body: JSON.stringify({ orderedIds }),
  })
}

export async function resetScheduleToDefaults() {
  return apiFetch('/api/schedule/reset', {
    method: 'POST',
  })
}
