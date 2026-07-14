/** Omani mobile: +968 then 8 digits starting with 7 or 9. */

export function sanitizeOmaniPhoneInput(input) {
  return String(input || '')
    .replace(/\D/g, '')
    .slice(0, 8)
}

export function normalizeOmaniPhone(input) {
  const digits = String(input || '').replace(/\D/g, '')
  if (!digits) return null

  let national = ''

  if (digits.startsWith('00968') && digits.length >= 12) {
    national = digits.slice(5, 13)
  } else if (digits.startsWith('968') && digits.length === 11) {
    national = digits.slice(3)
  } else if (digits.length === 8) {
    national = digits
  } else {
    return null
  }

  if (!/^[79]\d{7}$/.test(national)) {
    return null
  }

  return `+968${national}`
}

export function formatOmaniPhoneDisplay(input) {
  const normalized = normalizeOmaniPhone(input)
  if (!normalized) {
    const partial = sanitizeOmaniPhoneInput(input)
    return partial
  }

  const national = normalized.slice(4)
  return `${national.slice(0, 4)} ${national.slice(4)}`
}

export function isValidOmaniPhone(input) {
  return normalizeOmaniPhone(input) !== null
}

export function formatOmaniPhoneForDisplay(stored) {
  const normalized = normalizeOmaniPhone(stored)
  if (!normalized) return stored || '—'
  const national = normalized.slice(4)
  return `+968 ${national.slice(0, 4)} ${national.slice(4)}`
}
