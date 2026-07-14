import { createClient } from '@supabase/supabase-js'
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs'
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
const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY
if (!url || !key) throw new Error('Supabase env vars missing')

const supabase = createClient(url, key)

const CATALOG = [
  {
    slug: 'dispenser-hot-cold',
    name: 'Oasis Hot & Cold Water Dispenser',
    name_ar: 'موزع مياه الواحة حار وبارد',
    description: 'Reliable hot and cold water dispenser for home, office, and business use.',
    description_ar:
      'استمتع بالمياه الباردة والمنعشة أو الساخنة في أي وقت مع موزع مياه الواحة. يعمل مع عبوات المياه القابلة للاسترداد، ويوفر سهولة الاستخدام مع جودة عالية وأداء عملي للاستخدام اليومي.',
    price: 25,
    is_featured: true,
    sort_order: 1,
    imageSources: [
      'https://oasis-oman.fit/opengraph.jpg',
    ],
  },
  {
    slug: 'water-200ml',
    name: 'Oasis Water 200ml',
    name_ar: 'مياه الواحة 200 مل',
    description: 'Pure drinking water 200ml — carton of 40 bottles.',
    description_ar:
      'مياه شرب نقية وعالية الجودة، معبأة وفق أعلى معايير السلامة. مناسبة للاستخدام اليومي والفعاليات والمكاتب والمدارس. الكرتونة: 40 عبوة × 200 مل.',
    price: 0.35,
    is_featured: true,
    sort_order: 2,
    imageSources: [],
  },
  {
    slug: 'water-330ml',
    name: 'Oasis Water 330ml',
    name_ar: 'مياه الواحة 330 مل',
    description: 'Pure drinking water 330ml — carton of 24 bottles.',
    description_ar:
      'مياه شرب نقية وعالية الجودة، معبأة وفق أعلى معايير الجودة والسلامة. عبوة عملية وسهلة الحمل. الكرتونة: 24 عبوة × 330 مل.',
    price: 0.4,
    is_featured: false,
    sort_order: 3,
    imageSources: [],
  },
  {
    slug: 'water-500ml',
    name: 'Oasis Water 500ml',
    name_ar: 'مياه الواحة 500 مل',
    description: 'Pure drinking water 500ml — carton of 24 bottles.',
    description_ar:
      'مياه شرب نقية وعالية الجودة بحجم عملي مناسب للاستخدام اليومي في المنزل والعمل والمدرسة والرحلات. الكرتونة: 24 عبوة × 500 مل.',
    price: 0.4,
    is_featured: true,
    sort_order: 4,
    imageSources: [],
  },
  {
    slug: 'water-1-5l',
    name: 'Oasis Water 1.5L',
    name_ar: 'مياه الواحة 1.5 لتر',
    description: 'Family-size purified water 1.5L — carton of 12 bottles.',
    description_ar:
      'مياه شرب نقية وعالية الجودة بحجم عائلي مناسب للمنازل والمكاتب والمطاعم. الكرتونة: 12 عبوة × 1.5 لتر.',
    price: 0.4,
    is_featured: true,
    sort_order: 5,
    imageSources: [],
  },
  {
    slug: 'gallon-5l-returnable',
    name: 'Oasis Water Gallon 5L Returnable',
    name_ar: 'جالون مياه الواحة 5 لتر (قابل للاسترداد)',
    description: 'Returnable 5L refillable water gallon for home and office.',
    description_ar:
      'جالون مياه شرب نقية بسعة 5 لترات، عبوة قابلة للاسترداد وإعادة الاستخدام. مثالي للمنازل والمكاتب والشركات.',
    price: 0.4,
    is_featured: true,
    sort_order: 6,
    imageSources: [],
  },
]

async function downloadImage(sourceUrl, destPath) {
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error(`Download failed ${response.status}: ${sourceUrl}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  writeFileSync(destPath, buffer)
  return destPath
}

async function uploadImage(localPath, storagePath) {
  const file = readFileSync(localPath)
  const ext = localPath.endsWith('.png') ? 'png' : 'jpg'
  const { error } = await supabase.storage.from('product-images').upload(storagePath, file, {
    upsert: true,
    contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
  })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(storagePath)
  return data.publicUrl
}

async function resolveImage(product, publicDir) {
  for (const source of product.imageSources) {
    try {
      const ext = source.includes('.png') ? 'png' : 'jpg'
      const localPath = join(publicDir, `${product.slug}.${ext}`)
      await downloadImage(source, localPath)
      return `/products/${product.slug}.${ext}`
    } catch {
      // try next
    }
  }
  return `/products/${product.slug}.svg`
}

function buildPlaceholderSvg(nameAr) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#043348"/>
      <stop offset="100%" stop-color="#0d6b8a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="620" cy="180" r="120" fill="rgba(255,255,255,0.08)"/>
  <circle cx="180" cy="620" r="160" fill="rgba(255,255,255,0.06)"/>
  <text x="400" y="360" fill="#ffffff" font-size="42" font-family="Segoe UI, Arial, sans-serif" font-weight="700" text-anchor="middle">${nameAr}</text>
  <text x="400" y="430" fill="#bae6fd" font-size="28" font-family="Segoe UI, Arial, sans-serif" font-weight="600" text-anchor="middle">OASIS OMAN</text>
  <text x="400" y="500" fill="#e2e8f0" font-size="22" font-family="Segoe UI, Arial, sans-serif" text-anchor="middle">مياه نقية • عُمان</text>
</svg>`
}

async function main() {
  const publicProductsDir = join(root, 'public', 'products')
  mkdirSync(publicProductsDir, { recursive: true })

  const { data: existing, error: readError } = await supabase
    .from('products')
    .select('id,name_ar,image_url')

  if (readError) {
    console.error('Could not read products:', readError.message)
    process.exit(1)
  }

  console.log(`Existing products in database: ${existing?.length || 0}`)

  for (const product of CATALOG) {
    const svgPath = join(publicProductsDir, `${product.slug}.svg`)
    if (!existsSync(svgPath)) {
      writeFileSync(svgPath, buildPlaceholderSvg(product.name_ar), 'utf8')
    }

    let imageUrl = await resolveImage(product, publicProductsDir)
    if (imageUrl.endsWith('.svg')) {
      imageUrl = `/products/${product.slug}.svg`
    }

    const payload = {
      name: product.name,
      name_ar: product.name_ar,
      description: product.description,
      description_ar: product.description_ar,
      price: product.price,
      image_url: imageUrl,
      is_visible: true,
      is_featured: product.is_featured,
      is_in_stock: true,
      stock_quantity: 999,
      sort_order: product.sort_order,
      updated_at: new Date().toISOString(),
    }

    const match = existing?.find((row) => row.name_ar === product.name_ar)
    if (match) {
      const { error } = await supabase.from('products').update(payload).eq('id', match.id)
      if (error) {
        console.error(`Update failed for ${product.name_ar}:`, error.message)
      } else {
        console.log(`Updated: ${product.name_ar}`)
      }
      continue
    }

    const { error } = await supabase.from('products').insert(payload)
    if (error) {
      console.error(`Insert failed for ${product.name_ar}:`, error.message)
    } else {
      console.log(`Inserted: ${product.name_ar}`)
    }
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
