/**
 * Seed Al Ain catalog products into Supabase `products` table.
 * Uses Shopify CDN URLs (no storage upload required).
 *
 * Prefers SUPABASE_SERVICE_ROLE_KEY for inserts (bypasses RLS).
 * Falls back to anon key + optional admin login via SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync, writeFileSync } from 'fs'
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
const anonKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY
if (!url || (!serviceKey && !anonKey)) throw new Error('Supabase env vars missing')

const supabase = createClient(url, serviceKey || anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Dynamic import of catalog (ESM)
const catalogPath = join(root, 'src', 'data', 'catalog.js')
const { ALL_PRODUCTS_RAW } = await import(`file:///${catalogPath.replace(/\\/g, '/')}`)

function escSql(value) {
  if (value == null) return 'NULL'
  return `'${String(value).replace(/'/g, "''")}'`
}

function toSqlJson(value) {
  return escSql(JSON.stringify(value ?? []))
}

async function ensureAdminSession() {
  if (serviceKey) return true
  const email = env.SEED_ADMIN_EMAIL
  const password = env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    console.warn(
      'No SERVICE_ROLE_KEY or SEED_ADMIN_EMAIL/PASSWORD — inserts may fail under RLS. Generating SQL file instead.'
    )
    return false
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(`Admin login failed: ${error.message}`)
  return true
}

function buildPayload(product, index) {
  const images = product.images?.length ? product.images : [product.image]
  const [image_url, ...gallery] = images
  return {
    slug: product.slug,
    category: product.category || null,
    badge: product.badge || null,
    bullets: product.bullets || [],
    name: product.name?.en || product.slug,
    name_ar: product.name?.ar || product.name?.en || product.slug,
    description: '',
    description_ar: '',
    price: Number(product.price) || 0,
    image_url: image_url || null,
    gallery_urls: gallery,
    is_visible: true,
    is_featured: Boolean(product.featured),
    is_in_stock: true,
    stock_quantity: 999,
    sort_order: index + 1,
    updated_at: new Date().toISOString(),
  }
}

function writeSqlSeed(rows) {
  const lines = [
    '-- Al Ain products seed (run after products-slug-category.sql)',
    'BEGIN;',
  ]
  for (const row of rows) {
    lines.push(`
INSERT INTO products (
  slug, category, badge, bullets, name, name_ar, description, description_ar,
  price, image_url, gallery_urls, is_visible, is_featured, is_in_stock, stock_quantity, sort_order, updated_at
) VALUES (
  ${escSql(row.slug)}, ${escSql(row.category)}, ${escSql(row.badge)}, ${toSqlJson(row.bullets)}::jsonb,
  ${escSql(row.name)}, ${escSql(row.name_ar)}, ${escSql(row.description)}, ${escSql(row.description_ar)},
  ${row.price}, ${escSql(row.image_url)}, ${toSqlJson(row.gallery_urls)}::jsonb,
  true, ${row.is_featured}, true, 999, ${row.sort_order}, NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  category = EXCLUDED.category,
  badge = EXCLUDED.badge,
  bullets = EXCLUDED.bullets,
  name = EXCLUDED.name,
  name_ar = EXCLUDED.name_ar,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  gallery_urls = EXCLUDED.gallery_urls,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();`)
  }
  lines.push('COMMIT;')
  const out = join(root, 'supabase', 'seed-alain-products.sql')
  writeFileSync(out, lines.join('\n'), 'utf8')
  console.log(`Wrote ${out} (${rows.length} products)`)
}

async function main() {
  // Unique index on slug requires NOT NULL unique constraint for ON CONFLICT(slug)
  // Ensure migration applied: products-slug-category.sql

  const canWrite = await ensureAdminSession()
  const payloads = ALL_PRODUCTS_RAW.map((p, i) => buildPayload(p, i))
  writeSqlSeed(payloads)

  if (!canWrite && !serviceKey) {
    console.log('Skipping live insert — run supabase/seed-alain-products.sql in SQL Editor.')
    return
  }

  // Prefer upsert by slug: fetch existing
  const { data: existing, error: readError } = await supabase
    .from('products')
    .select('id, slug')

  if (readError) {
    console.error('Could not read products:', readError.message)
    console.log('Run supabase/seed-alain-products.sql in the SQL Editor instead.')
    process.exit(1)
  }

  const bySlug = new Map((existing || []).map((row) => [row.slug, row.id]))
  let inserted = 0
  let updated = 0

  for (const payload of payloads) {
    const id = bySlug.get(payload.slug)
    if (id) {
      const { error } = await supabase.from('products').update(payload).eq('id', id)
      if (error) console.error(`Update failed ${payload.slug}:`, error.message)
      else updated += 1
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) console.error(`Insert failed ${payload.slug}:`, error.message)
      else inserted += 1
    }
  }

  console.log(`Done. inserted=${inserted} updated=${updated} total=${payloads.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
