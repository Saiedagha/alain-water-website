import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const LAST_SEEN_KEY = 'alain_admin_last_seen_messages'
const LAST_SEEN_PAYMENTS_KEY = 'alain_admin_last_seen_payments'
const POLL_MS = 30000

export function markContactMessagesSeen() {
  try {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString())
  } catch {
    // ignore
  }
}

export function markPaymentsSeen() {
  try {
    localStorage.setItem(LAST_SEEN_PAYMENTS_KEY, new Date().toISOString())
    window.dispatchEvent(new Event('alain-payments-seen'))
  } catch {
    // ignore
  }
}

function getLastSeen() {
  try {
    return localStorage.getItem(LAST_SEEN_KEY) || '1970-01-01T00:00:00.000Z'
  } catch {
    return '1970-01-01T00:00:00.000Z'
  }
}

function getPaymentsLastSeen() {
  try {
    return localStorage.getItem(LAST_SEEN_PAYMENTS_KEY) || '1970-01-01T00:00:00.000Z'
  } catch {
    return '1970-01-01T00:00:00.000Z'
  }
}

export default function useAdminNotifications() {
  const location = useLocation()
  const [counts, setCounts] = useState({ orders: 0, messages: 0, payments: 0 })

  const fetchCounts = useCallback(async () => {
    const lastSeen = getLastSeen()
    const paymentsLastSeen = getPaymentsLastSeen()
    const [ordersResult, messagesResult, paymentsResult] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).gt('created_at', lastSeen),
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('manual_payment_status', 'pending')
        .gt('updated_at', paymentsLastSeen),
    ])

    setCounts({
      orders: ordersResult.count || 0,
      messages: messagesResult.count || 0,
      payments: paymentsResult.count || 0,
    })
  }, [])

  useEffect(() => {
    fetchCounts()
    const id = window.setInterval(fetchCounts, POLL_MS)
    return () => window.clearInterval(id)
  }, [fetchCounts, location.pathname])

  useEffect(() => {
    const handler = () => fetchCounts()
    window.addEventListener('alain-contact-seen', handler)
    window.addEventListener('alain-payments-seen', handler)
    return () => {
      window.removeEventListener('alain-contact-seen', handler)
      window.removeEventListener('alain-payments-seen', handler)
    }
  }, [fetchCounts])

  return counts
}

export function getNotificationCount(counts, key) {
  if (!key || !counts) return 0
  return Number(counts[key] || 0)
}
