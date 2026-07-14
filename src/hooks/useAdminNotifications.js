import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const LAST_SEEN_KEY = 'oasis_admin_last_seen_messages'
const POLL_MS = 30000

export function markContactMessagesSeen() {
  try {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString())
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

export default function useAdminNotifications() {
  const location = useLocation()
  const [counts, setCounts] = useState({ orders: 0, messages: 0, payments: 0 })

  const fetchCounts = useCallback(async () => {
    const lastSeen = getLastSeen()
    const [ordersResult, messagesResult, paymentsResult] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).gt('created_at', lastSeen),
      supabase.from('orders').select('id', { count: 'exact', head: true }).eq('manual_payment_status', 'pending'),
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
    window.addEventListener('oasis-contact-seen', handler)
    return () => window.removeEventListener('oasis-contact-seen', handler)
  }, [fetchCounts])

  return counts
}

export function getNotificationCount(counts, key) {
  if (!key || !counts) return 0
  return Number(counts[key] || 0)
}
