import { apiFetch } from './api'
import eventConfig from '../config/eventConfig'

export function formatRegistrationId(seq) {
  return `${eventConfig.eventId}-${String(seq).padStart(4, '0')}`
}

export async function registerStudent(formData) {
  return apiFetch('/api/students', {
    method: 'POST',
    body: JSON.stringify(formData),
  })
}

export async function findStudentByRegistrationId(registrationId) {
  try {
    return await apiFetch(`/api/students/by-reg-id/${encodeURIComponent(registrationId.trim())}`)
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function confirmAttendance(studentDocId) {
  return apiFetch(`/api/students/${studentDocId}/check-in`, {
    method: 'PATCH',
    body: JSON.stringify({ checkedIn: true }),
  })
}

export async function undoAttendance(studentDocId) {
  return apiFetch(`/api/students/${studentDocId}/check-in`, {
    method: 'PATCH',
    body: JSON.stringify({ checkedIn: false }),
  })
}

export async function updateMaterials(studentDocId, materials, distributed) {
  return apiFetch(`/api/students/${studentDocId}/materials`, {
    method: 'PATCH',
    body: JSON.stringify({ materials, distributed }),
  })
}

export async function getStudentById(studentDocId) {
  try {
    return await apiFetch(`/api/students/${studentDocId}`)
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function deleteStudent(studentDocId) {
  return apiFetch(`/api/students/${studentDocId}`, {
    method: 'DELETE',
  })
}

// Live polling listener for attendees dashboard
export function watchAllStudents(callback) {
  let active = true

  const fetchStudents = async () => {
    try {
      const data = await apiFetch('/api/students')
      if (active) callback(data)
    } catch (err) {
      console.error('Error fetching students:', err)
    }
  }

  fetchStudents()
  const interval = setInterval(fetchStudents, 4000)

  return () => {
    active = false
    clearInterval(interval)
  }
}

export async function getAllStudentsOnce() {
  return apiFetch('/api/students')
}

export function tsToDate(ts) {
  if (!ts) return null
  if (ts instanceof Date) return ts
  if (typeof ts === 'string' || typeof ts === 'number') {
    const d = new Date(ts)
    return isNaN(d.getTime()) ? null : d
  }
  if (ts.seconds) return new Date(ts.seconds * 1000)
  return null
}
