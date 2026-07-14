export const OMAN_CENTER = { lat: 23.588, lng: 58.3829 }
export const OMAN_BOUNDS = [
  [16.4, 52.0],
  [26.6, 60.0],
]

export function isInsideOman(lat, lng) {
  return lat >= 16.4 && lat <= 26.6 && lng >= 52.0 && lng <= 60.0
}

export function parseMapLocation(value) {
  if (!value) return null

  if (typeof value === 'object' && value.lat != null && value.lng != null) {
    const lat = Number(value.lat)
    const lng = Number(value.lng)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng, label: value.label || '' }
    }
    return null
  }

  const raw = String(value).trim()
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.lat != null && parsed?.lng != null) {
      const lat = Number(parsed.lat)
      const lng = Number(parsed.lng)
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng, label: parsed.label || '' }
      }
    }
  } catch {
    const match = raw.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/)
    if (match) {
      const lat = Number(match[1])
      const lng = Number(match[2])
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng, label: raw }
      }
    }
  }

  return null
}

export function stringifyMapLocation(location) {
  if (location?.lat == null || location?.lng == null) return ''
  return JSON.stringify({
    lat: Number(location.lat),
    lng: Number(location.lng),
    label: location.label || '',
  })
}

export function getGoogleMapsLink(location) {
  if (!location) return ''
  return `https://www.google.com/maps?q=${location.lat},${location.lng}`
}
