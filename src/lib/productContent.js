import { ALL_CATEGORIES, COLLECTION_META } from '../data/alainContent'

const AR_REPLACEMENTS = [
  [/Al Ain Water/gi, 'مياه العين'],
  [/Al Ain/gi, 'العين'],
  [/VOSS/gi, 'فوس'],
  [/Bottled Drinking Water/gi, 'مياه شرب معبأة'],
  [/Natural Mineral Water/gi, 'مياه معدنية طبيعية'],
  [/Sparkling Water/gi, 'مياه غازية'],
  [/Still Water/gi, 'مياه ساكنة'],
  [/Alkaline Water/gi, 'مياه قلوية'],
  [/Functional Water/gi, 'مياه وظيفية'],
  [/Recycled PET Bottle/gi, 'زجاجة PET معاد تدويرها'],
  [/Plant Based Bottled Drinking Water/gi, 'مياه معبأة بعبوة نباتية'],
  [/Glass Bottle/gi, 'زجاجة زجاج'],
  [/Zero Sodium/gi, 'خالية من الصوديوم'],
  [/Fortified with Zinc/gi, 'مدعمة بالزنك'],
  [/Pack of/gi, 'عبوة'],
  [/Pack Of/gi, 'عبوة'],
  [/Top Load Electric Hot & Cold Water Water Dispenser/gi, 'برادة ماء كهربائية ساخن وبارد تحميل علوي'],
  [/Disposable Paper Cup/gi, 'كوب ورقي للاستخدام مرة واحدة'],
  [/Cup Holder Transparent/gi, 'حامل أكواب شفاف'],
  [/Matungi/gi, 'متونجي'],
  [/Gallon/gi, 'جالون'],
  [/Sparkling/gi, 'غازية'],
  [/Still/gi, 'ساكنة'],
  [/Zero/gi, 'زيرو'],
  [/Bambini/gi, 'بامبيني'],
  [/Lime/gi, 'ليمون'],
  [/Strawberry/gi, 'فراولة'],
  [/Plain/gi, 'سادة'],
  [/Shrink/gi, 'شرنك'],
  [/Can/gi, 'علبة'],
  [/Bottles/gi, 'زجاجات'],
  [/Bottle/gi, 'زجاجة'],
  [/Water/gi, 'مياه'],
  [/RPET/gi, 'RPET'],
  [/PET/gi, 'PET'],
]

const CATEGORY_COPY = {
  'bottled-water': {
    en: 'Pure bottled drinking water from Al Ain Water — trusted hydration for every home.',
    ar: 'مياه شرب معبأة نقية من مياه العين — ترطيب موثوق لكل منزل.',
  },
  'functional-water': {
    en: 'Functional hydration with enhanced minerals and zero-sodium options for everyday wellness.',
    ar: 'ترطيب وظيفي بمعادن معززة وخيارات خالية من الصوديوم لصحة يومية أفضل.',
  },
  'premium-range': {
    en: 'Premium still and sparkling selections crafted for refined taste occasions.',
    ar: 'مجموعة مميزة من المياه الساكنة والغازية لمناسبات الذوق الرفيع.',
  },
  'special-offers': {
    en: 'Special value packs and limited offers with free home delivery across the UAE.',
    ar: 'باقات وعروض خاصة مع توصيل منزلي مجاني في أنحاء الإمارات.',
  },
  'dispenser-accessories': {
    en: 'Dispensers and accessories to complete your Al Ain Water home setup.',
    ar: 'برادات وإكسسوارات لإكمال تجهيز مياه العين في منزلك.',
  },
  subscriptions: {
    en: 'Convenient gallon refill options for continuous home and office hydration.',
    ar: 'خيارات جالون مريحة للترطيب المستمر في المنزل والمكتب.',
  },
}

export function slugifyProduct(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

export function translateProductNameToAr(englishName) {
  let result = String(englishName || '')
  for (const [pattern, replacement] of AR_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result.replace(/\s+/g, ' ').trim() || englishName
}

export function buildProductBullets(product, lang = 'en') {
  if (Array.isArray(product.bullets) && product.bullets.length) {
    return product.bullets
  }

  const name = product.name?.en || product.nameEn || ''
  const isAr = lang === 'ar' || lang === 'ur'

  const bulletsEn = [
    'Trusted Al Ain Water quality',
    'Free home delivery across the UAE',
    'Ideal for home, office, and on-the-go',
  ]

  if (/zero/i.test(name)) bulletsEn.unshift('Zero sodium formula')
  if (/alkaline/i.test(name)) bulletsEn.unshift('Alkaline hydration support')
  if (/sparkling/i.test(name)) bulletsEn.unshift('Crisp sparkling refreshment')
  if (/gallon/i.test(name)) bulletsEn.unshift('Large-format value for everyday use')
  if (/zinc/i.test(name)) bulletsEn.unshift('Fortified with zinc')
  if (/recycled|rpet|plant based/i.test(name)) bulletsEn.unshift('More sustainable packaging')
  if (/glass/i.test(name)) bulletsEn.unshift('Premium glass bottle presentation')
  if (/dispenser/i.test(name)) bulletsEn.unshift('Hot & cold convenience for home or office')

  if (!isAr) return bulletsEn.slice(0, 5)

  return bulletsEn.slice(0, 5).map((item) => {
    if (item.includes('Zero sodium')) return 'تركيبة خالية من الصوديوم'
    if (item.includes('Alkaline')) return 'ترطيب قلوي داعم'
    if (item.includes('sparkling')) return 'انتعاش غازي منعش'
    if (item.includes('Large-format')) return 'حجم كبير مناسب للاستخدام اليومي'
    if (item.includes('zinc')) return 'مدعم بالزنك'
    if (item.includes('sustainable')) return 'تغليف أكثر استدامة'
    if (item.includes('glass')) return 'تقديم فاخر بزجاجة زجاج'
    if (item.includes('Hot & cold')) return 'راحة ساخن وبارد للمنزل أو المكتب'
    if (item.includes('Trusted')) return 'جودة مياه العين الموثوقة'
    if (item.includes('Free home')) return 'توصيل منزلي مجاني في أنحاء الإمارات'
    return 'مناسب للمنزل والمكتب والتنقل'
  })
}

export function buildProductDescription(product, lang = 'en') {
  const custom = lang === 'ar' || lang === 'ur' ? product.descriptionAr || product.description_ar : product.description
  if (custom) return custom

  const category = product.category || ''
  const copy = CATEGORY_COPY[category]
  if (copy) return lang === 'ar' || lang === 'ur' ? copy.ar : copy.en

  return lang === 'ar' || lang === 'ur'
    ? 'منتج من مياه العين بأعلى معايير النقاء والجودة.'
    : 'An Al Ain Water product crafted for purity, taste, and everyday hydration.'
}

export function getCategoryMeta(categoryId) {
  const fromAll = ALL_CATEGORIES.find((c) => c.id === categoryId)
  if (fromAll) return fromAll

  const collection = Object.entries(COLLECTION_META).find(([, meta]) => meta.id === categoryId)
  if (collection) {
    return {
      id: categoryId,
      slug: collection[0],
      title: collection[1].heading,
    }
  }

  return null
}

export function enrichStoreProduct(product) {
  const nameEn = product.name?.en || product.nameEn || product.name || ''
  const rawAr = product.name?.ar || product.nameAr || product.name_ar || ''
  const nameAr =
    rawAr && rawAr !== nameEn ? rawAr : translateProductNameToAr(nameEn) || nameEn
  const slug = product.slug || slugifyProduct(nameEn) || String(product.id)

  return {
    ...product,
    slug,
    name: { en: nameEn, ar: nameAr },
    nameEn,
    nameAr,
    description: product.description || buildProductDescription({ ...product, name: { en: nameEn } }, 'en'),
    descriptionAr:
      product.descriptionAr ||
      product.description_ar ||
      buildProductDescription({ ...product, name: { en: nameEn }, category: product.category }, 'ar'),
    bullets: product.bullets?.length ? product.bullets : buildProductBullets({ ...product, name: { en: nameEn } }, 'en'),
  }
}
