/**
 * Sync exact product content from alainwater.com Shopify product JSON into Supabase.
 * Pulls title, body_html, featured image, gallery images, and price.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  const envPath = join(root, '.env')
  if (!existsSync(envPath)) throw new Error('Missing .env file')
  const env = {}
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) throw new Error('Missing Supabase URL or service role key')

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const catalogPath = join(root, 'src', 'data', 'catalog.js')
const { ALL_PRODUCTS_RAW } = await import(`file:///${catalogPath.replace(/\\/g, '/')}`)

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function normalizeShopifyUrl(url) {
  if (!url) return null
  return String(url).startsWith('//') ? `https:${url}` : String(url)
}

function normalizePrice(value) {
  const numeric = Number(value || 0)
  if (!Number.isFinite(numeric)) return 0
  return numeric > 100 ? numeric / 100 : numeric
}

async function fetchProduct(handle) {
  const response = await fetch(`https://alainwater.com/products/${handle}.js`)
  if (!response.ok) throw new Error(`Fetch failed for ${handle}: ${response.status}`)
  return response.json()
}

async function main() {
  const { data: existing, error: readError } = await supabase
    .from('products')
    .select('id, slug, name_ar, description_ar, category, badge, bullets, sort_order, is_featured')

  if (readError) throw new Error(`Failed to read products: ${readError.message}`)

  const bySlug = new Map((existing || []).map((row) => [row.slug, row]))
  let updated = 0

  for (const catalogProduct of ALL_PRODUCTS_RAW) {
    const remote = await fetchProduct(catalogProduct.slug)
    const row = bySlug.get(catalogProduct.slug)
    if (!row) continue

    const images = Array.isArray(remote.images)
      ? remote.images.map((img) => normalizeShopifyUrl(img.src)).filter(Boolean)
      : []
    const imageUrl =
      normalizeShopifyUrl(remote.featured_image) || images[0] || catalogProduct.image || null
    const galleryUrls = images.length > 1 ? images.slice(1) : catalogProduct.images?.slice(1) || []
    const price = normalizePrice(remote.variants?.[0]?.price || catalogProduct.price || 0)

    const payload = {
      name: cleanText(remote.title || catalogProduct.name?.en),
      name_ar: row.name_ar || cleanText(remote.title || catalogProduct.name?.ar || catalogProduct.name?.en),
      description: remote.description || remote.body_html || '',
      description_ar: row.description_ar || remote.description || remote.body_html || '',
      image_url: imageUrl,
      gallery_urls: galleryUrls,
      price,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('products').update(payload).eq('id', row.id)
    if (error) throw new Error(`Update failed for ${catalogProduct.slug}: ${error.message}`)
    updated += 1
  }

  console.log(`Synced ${updated} products from reference.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})