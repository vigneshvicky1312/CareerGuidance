import { apiFetch } from './api'

export function watchSponsors(callback) {
  let active = true

  const fetchSponsors = async () => {
    try {
      const data = await apiFetch('/api/sponsors')
      if (active) callback(data)
    } catch (err) {
      console.error('Error watching sponsors:', err)
    }
  }

  fetchSponsors()
  const interval = setInterval(fetchSponsors, 5000)

  return () => {
    active = false
    clearInterval(interval)
  }
}

export async function getActiveSponsorsOnce() {
  return apiFetch('/api/sponsors/active')
}

export async function addSponsor(sponsor) {
  return apiFetch('/api/sponsors', {
    method: 'POST',
    body: JSON.stringify(sponsor),
  })
}

export async function updateSponsor(id, sponsor) {
  return apiFetch(`/api/sponsors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sponsor),
  })
}

export async function deleteSponsor(id) {
  return apiFetch(`/api/sponsors/${id}`, {
    method: 'DELETE',
  })
}

export async function uploadSponsorLogo(file) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await apiFetch('/api/sponsors/upload', {
    method: 'POST',
    body: formData,
  })
  return data.url
}

export async function submitSponsorEnquiry(enquiry) {
  return apiFetch('/api/sponsors/enquiry', {
    method: 'POST',
    body: JSON.stringify(enquiry),
  })
}

export function watchSponsorEnquiries(callback) {
  let active = true

  const fetchEnquiries = async () => {
    try {
      const data = await apiFetch('/api/sponsors/enquiries')
      if (active) callback(data)
    } catch (err) {
      console.error('Error watching enquiries:', err)
    }
  }

  fetchEnquiries()
  const interval = setInterval(fetchEnquiries, 5000)

  return () => {
    active = false
    clearInterval(interval)
  }
}
