import { useCallback, useEffect, useState } from 'react'
import { ALL_PRODUCTS } from '../data/alainContent'
import { ALL_PRODUCTS_RAW } from '../data/catalog'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

function parseGallery(gallery) {
  if (Array.isArray(gallery)) return gallery.filter(Boolean)
  if (typeof gallery === 'string') {
    try {
      const parsed = JSON.parse(gallery)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : []
    } catch {
      return []
    }
  }
  return []
}

function parseBullets(bullets) {
  if (Array.isArray(bullets)) return bullets.filter(Boolean)
  if (typeof bullets === 'string') {
    try {
      const parsed = JSON.parse(bullets)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : []
    } catch {
      return bullets ? [bullets] : []
    }
  }
  return []
}

function findCatalogMeta(product) {
  const nameEn = product.name?.en || product.name || product.nameEn || ''
  const nameAr = product.name?.ar || product.name_ar || product.nameAr || ''
  return (
    ALL_PRODUCTS_RAW.find((c) => c.slug && c.slug === product.slug) ||
    ALL_PRODUCTS_RAW.find((c) => c.name?.en === nameEn || c.name?.ar === nameAr) ||
    null
  )
}

/** Normalize DB or static catalog product into Al Ain storefront shape */
export function mapDbProduct(product) {
  const catalog = findCatalogMeta(product)
  const gallery = parseGallery(product.gallery_urls)
  const imageUrl = product.image_url || product.image || catalog?.image || ''
  const catalogImages = catalog?.images?.length ? catalog.images : catalog?.image ? [catalog.image] : []
  const images = imageUrl
    ? [imageUrl, ...gallery.filter((url) => url !== imageUrl)]
    : gallery.length
      ? gallery
      : catalogImages
  const fallbackImage =
    images[0] || 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80'

  const nameEn = product.name?.en || product.name || product.nameEn || catalog?.name?.en || ''
  const nameAr =
    product.name?.ar || product.name_ar || product.nameAr || catalog?.name?.ar || nameEn

  return {
    id: product.id,
    slug: product.slug || catalog?.slug || '',
    category: product.category || catalog?.category || '',
    badge: product.badge || catalog?.badge || null,
    bullets: parseBullets(product.bullets?.length ? product.bullets : catalog?.bullets),
    name: { en: nameEn, ar: nameAr },
    nameEn,
    nameAr,
    description: product.description || '',
    descriptionAr: product.description_ar || product.descriptionAr || product.description || '',
    price: Number(product.price || catalog?.price || 0),
    featured: Boolean(product.is_featured ?? product.featured ?? catalog?.featured),
    image: fallbackImage,
    images: images.length ? images : [fallbackImage],
    isVisible: product.is_visible !== false,
    isInStock: product.is_in_stock !== false && product.isInStock !== false,
    sortOrder: product.sort_order || product.sortOrder || 0,
  }
}

function mapCatalogFallback() {
  return ALL_PRODUCTS.map((p) => mapDbProduct(p))
}

export default function useProducts() {
  const [products, setProducts] = useState(() =>
    isSupabaseConfigured ? [] : mapCatalogFallback()
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [fromDb, setFromDb] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProducts(mapCatalogFallback())
      setLoading(false)
      setFromDb(false)
      return
    }

    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      setProducts([])
      setFromDb(false)
    } else if (!data?.length) {
      setProducts([])
      setFromDb(true)
    } else {
      setProducts(data.map(mapDbProduct))
      setFromDb(true)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    load()

    if (!isSupabaseConfigured || !supabase) return undefined

    const channel = supabase
      .channel('storefront-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        load()
      })
      .subscribe()

    const onFocus = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [load])

  return { products, loading, fromDb, error, reload: load }
}
