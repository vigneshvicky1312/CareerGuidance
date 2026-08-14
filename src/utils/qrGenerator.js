import eventConfig from '../config/eventConfig'

// The QR payload deliberately contains only the minimum needed to
// look the student up server-side — never personal details.
export function buildStudentQrValue(registrationId) {
  return JSON.stringify({
    eventId: eventConfig.eventId,
    registrationId,
  })
}

export function parseStudentQrValue(raw) {
  try {
    const data = JSON.parse(raw)
    if (data && data.eventId && data.registrationId) return data
  } catch {
    // Not JSON — fall back to treating the raw scan as a bare
    // registration ID, in case a plain-text QR was printed.
  }
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return { eventId: eventConfig.eventId, registrationId: raw.trim() }
  }
  return null
}

export function buildLocationQrValue() {
  return eventConfig.googleMapsUrl
}
