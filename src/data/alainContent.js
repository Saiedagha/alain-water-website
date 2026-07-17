import { ALL_PRODUCTS_RAW } from './catalog'

export const LOGO_URL =
  'https://alainwater.com/cdn/shop/files/Logo_Small_8efe5185-9bae-4d27-9986-a7c64b62bf21.png?v=1712162622'

export const HERO_SLIDES = [
  {
    id: 1,
    image:
      'https://alainwater.com/cdn/shop/files/sparkling_can_banner_1_4000x938_crop_center.jpg?v=1760346604',
    mobileImage: 'https://alainwater.com/cdn/shop/files/SecondaryInformation_1-11.jpg?v=1757581874',
    alt: 'Sparkling Water — Now Available in Cans',
    bg: '#1a7a3c',
  },
  {
    id: 2,
    image:
      'https://alainwater.com/cdn/shop/files/sparkling_can_banner_2_4001x939_crop_center.jpg?v=1760346604',
    mobileImage: 'https://alainwater.com/cdn/shop/files/SecondaryInformation_1-13.jpg?v=1757581874',
    alt: 'Sparkling Water — 0 Calories, 0 Sugar',
    bg: '#1a7a3c',
  },
  {
    id: 3,
    image:
      'https://alainwater.com/cdn/shop/files/sparkling_can_banner_3_4001x938_crop_center.jpg?v=1760346604',
    mobileImage: 'https://alainwater.com/cdn/shop/files/SecondaryInformation_1-12.jpg?v=1757581874',
    alt: 'Made with Zero Calories | Sugar',
    bg: '#1a7a3c',
  },
  {
    id: 4,
    image:
      'https://alainwater.com/cdn/shop/files/Web_Banner_Main_Screen_Mobile_View_1920x450-08.jpg?v=1738902149',
    mobileImage: 'https://alainwater.com/cdn/shop/files/SecondaryInformation_1-11.jpg?v=1757581874',
    alt: 'Choose Quality, Choose Al Ain',
    bg: '#0b5f9e',
  },
]

export const CATEGORIES = [
  {
    id: 'bottled-water',
    slug: 'drinking-water',
    title: { en: 'Bottled Water', ar: 'مياه معبأة' },
    explore: { en: 'Explore', ar: 'استكشف' },
    image:
      'https://alainwater.com/cdn/shop/files/circle-09_80eae81c-71ad-4289-b757-aa35fad06075.png?v=1738297241',
  },
  {
    id: 'functional-water',
    slug: 'functional-range',
    title: { en: 'Functional Water', ar: 'مياه وظيفية' },
    explore: { en: 'Explore', ar: 'استكشف' },
    image: 'https://alainwater.com/cdn/shop/files/circle-10.png?v=1738237613',
  },
  {
    id: 'premium-range',
    slug: 'premium-range',
    title: { en: 'Premium Range', ar: 'المجموعة المميزة' },
    explore: { en: 'Explore', ar: 'استكشف' },
    image:
      'https://alainwater.com/cdn/shop/files/circle-11_eed6d7c0-aa34-4de9-9d4f-508aeb6fce0a.png?v=1738297304',
  },
  {
    id: 'special-offers',
    slug: 'special-offers',
    title: { en: 'Special Offers', ar: 'عروض خاصة' },
    explore: { en: 'Explore', ar: 'استكشف' },
    image:
      'https://alainwater.com/cdn/shop/files/circle-12_ee3a354e-62dc-4401-bcc8-b9849ed1bc63.png?v=1738297343',
  },
]

/** Full shop-by-category list (collections page) — matches alainwater.com */
export const ALL_CATEGORIES = [
  ...CATEGORIES,
  {
    id: 'dispenser-accessories',
    slug: 'dispenser-accessories',
    title: { en: 'Dispenser & Accessories', ar: 'برادة وإكسسوارات' },
    explore: { en: 'Explore', ar: 'استكشف' },
    image:
      'https://alainwater.com/cdn/shop/files/dispenser_78e8d119-3dd3-44a6-9356-3b143dc34036_596x596_crop_center.jpg?v=1741694518',
  },
]

/** Exact Our Products dropdown order from alainwater.com */
export const NAV_PRODUCT_LINKS = [
  { slug: 'subscriptions', title: { en: 'Subscriptions', ar: 'الاشتراكات' } },
  { slug: 'special-offers', title: { en: 'Special Offers', ar: 'عروض خاصة' } },
  { slug: 'drinking-water', title: { en: 'Bottled Water', ar: 'مياه معبأة' } },
  { slug: 'functional-range', title: { en: 'Functional Water', ar: 'مياه وظيفية' } },
  { slug: 'premium-range', title: { en: 'Premium Range', ar: 'المجموعة المميزة' } },
  { slug: 'dispenser-accessories', title: { en: 'Dispenser & Accessories', ar: 'برادة وإكسسوارات' } },
]

export const COLLECTION_META = {
  subscriptions: {
    id: 'subscriptions',
    heading: { en: 'SUBSCRIPTIONS', ar: 'الاشتراكات' },
    banner: 'blue',
    image: '/assets/s.jpeg',
  },
  'special-offers': {
    id: 'special-offers',
    heading: { en: 'WEEKLY HASSLE FREE DELIVERY', ar: 'توصيل أسبوعي بدون عناء' },
    sub: { en: 'SIGNUP NOW', ar: 'سجّل الآن' },
    banner: 'offers',
  },
  'drinking-water': {
    id: 'bottled-water',
    heading: { en: 'DRINKING WATER', ar: 'مياه الشرب' },
    banner: 'blue',
  },
  'functional-range': {
    id: 'functional-water',
    heading: { en: 'FUNCTIONAL WATER', ar: 'مياه وظيفية' },
    sub: {
      en: 'FORTIFIED WITH ZINC · MAGNESIUM · ZERO SODIUM',
      ar: 'مدعمة بالزنك · المغنيسيوم · خالية من الصوديوم',
    },
    banner: 'functional',
  },
  'premium-range': {
    id: 'premium-range',
    heading: { en: 'PREMIUM RANGE', ar: 'المجموعة المميزة' },
    banner: 'blue',
  },
  'dispenser-accessories': {
    id: 'dispenser-accessories',
    heading: { en: 'DISPENSER ACCESSORIES', ar: 'إكسسوارات البرادة' },
    banner: 'dispenser',
  },
}

export const ALL_PRODUCTS = ALL_PRODUCTS_RAW.map((p) => {
  const product = {
    ...p,
    nameEn: p.name.en,
    nameAr: p.name.ar,
    images: p.images?.length ? p.images : [p.image],
    isInStock: true,
  }

  if (p.slug === '6x250ml-aa-shrink-lime-sparkling-can' && !product.bullets?.length) {
    product.bullets = [
      'Zesty Lime Twist — Lime flavor adds a refreshing burst of citrus',
      'ZERO Sugar, ZERO Calorie — Light and refreshing; guilt-free refreshment',
      'On-the-Go Size — Convenient 250ml can for anytime hydration',
      'Smart Refreshment — Light, crisp, and a great alternative to sugary drinks',
      "Trusted Al Ain Quality — UAE's leading water brand",
    ]
  }

  return product
})

export const BESTSELLERS = ALL_PRODUCTS.filter((p) => p.featured)

export const NEWS_POSTS = [
  {
    id: 1,
    date: 'February 25 2025',
    title: {
      en: 'Al Ain Hydrates the UAE National Team',
      ar: 'العين تروي المنتخب الوطني الإماراتي',
    },
    excerpt: {
      en: "We're the Official Hydration Partner of the UAE Football Association! We're incredibly excited to announce a major partnership...",
      ar: 'نحن الشريك الرسمي للترطيب لاتحاد كرة القدم الإماراتي! يسعدنا الإعلان عن شراكة كبيرة...',
    },
    image:
      'https://alainwater.com/cdn/shop/articles/uae_fa_blog_post_320x200_crop_center.png?v=1751861906',
    href: '/news/uae-national-team',
  },
  {
    id: 2,
    date: 'February 25 2025',
    title: {
      en: 'Al Ain Water Leads the Way in Sustainable Packaging with 100% Recycled PET Bottles',
      ar: 'مياه العين تقود الطريق في التغليف المستدام بعبوات PET معاد تدويرها ١٠٠٪',
    },
    excerpt: {
      en: "Al Ain Water has launched the UAE's first locally produced 100% recycled PET (rPET) bottle...",
      ar: 'أطلقت مياه العين أول عبوة PET معاد تدويرها ١٠٠٪ منتجة محلياً في الإمارات...',
    },
    image:
      'https://alainwater.com/cdn/shop/articles/image_2025_02_25T07_31_35_979Z_320x200_crop_center.png?v=1742251362',
    href: '/news/sustainable-packaging',
  },
  {
    id: 3,
    date: 'February 25 2025',
    title: {
      en: 'Al Hosn Festival: Celebrating Heritage, Hydrated by Al Ain',
      ar: 'مهرجان الحصن: احتفال بالتراث بترطيب من العين',
    },
    excerpt: {
      en: "The Al Hosn Festival is more than just an event; it's a vibrant tapestry woven from the threads of Abu...",
      ar: 'مهرجان الحصن أكثر من مجرد فعالية؛ إنه نسيج نابض من تراث أبوظبي...',
    },
    image:
      'https://alainwater.com/cdn/shop/articles/image_2025_02_25T07_29_48_205Z_320x200_crop_center.png?v=1742251963',
    href: '/news/al-hosn-festival',
  },
]

export const BRAND_STORY = {
  title: {
    en: "UAE'S FAVORITE WATER BRAND.",
    ar: 'العلامة المفضلة للمياه في الإمارات',
  },
  body: {
    en: 'With a strong heritage of purity and natural goodness, Al Ain Water is recognized as the preferred brand of choice among consumers. Al Ain Water has the right balance of minerals to make sure you stay healthy and hydrated.',
    ar: 'بتراث قوي من النقاء والطيب الطبيعي، تُعرف مياه العين كالخيار المفضل لدى المستهلكين. مياه العين تحتوي على التوازن الصحيح من المعادن للحفاظ على ترطيبك وصحتك.',
  },
  videoThumb:
    'https://alainwater.com/cdn/shop/files/drop_Blue_325x504_crop_center.png?v=1712162623',
}

export const SITE_CONTACT = {
  phone: '80025246',
  phoneDisplay: '800 25246 (ALAIN)',
  email: 'help@alainwater.com',
  address: {
    en: 'Sky Tower, 17th Floor, Al Reem Island, P. O. Box 37725, Abu Dhabi, UAE',
    ar: 'برج سكاي، الطابق ١٧، جزيرة الريم، ص.ب ٣٧٧٢٥، أبوظبي، الإمارات',
  },
  hours: {
    en: 'Sat - Thu: 9:00 - 21:00',
    ar: 'السبت - الخميس: ٩:٠٠ - ٢١:٠٠',
  },
  whatsapp: '97180025246',
  social: {
    facebook: 'https://www.facebook.com/alainwater',
    instagram: 'https://www.instagram.com/alainwaterofficial',
    twitter: 'https://twitter.com/alainwater',
    youtube: 'https://www.youtube.com/@alainwater',
    tiktok: 'https://www.tiktok.com/@alainwaterme',
  },
}

export const UI = {
  en: {
    products: 'Our Products',
    story: 'Our Story',
    contact: 'Contact Us',
    faq: 'FAQ',
    login: 'Login',
    signUp: 'Sign Up',
    search: 'Search',
    searchPlaceholder: 'Search for anything',
    langSwitch: 'العربية',
    bestsellers: 'Bestsellers',
    news: 'News and Updates',
    newsShort: 'News',
    newsSub: "Al Ain's Water and Product News",
    readMore: 'Read more',
    viewAll: 'View all posts',
    explore: 'Explore',
    cart: 'Your cart',
    cartEmpty: 'Your cart is currently empty.',
    cartReady: 'Ready to find your new favorite products?',
    shopNow: 'Shop Now',
    home: 'Home',
    freeDelivery: 'Free Home Delivery',
    freeDeliverySub: 'Convenience with no more heavy lifting.',
    fastDelivery: 'Fast, hassle-free delivery across the UAE.',
    offers: 'Exciting offers',
    connect: 'Connect with Us',
    allProducts: 'All Products',
    shopByCategory: 'Shop by Category',
    usefulLinks: 'Useful Links',
    privacy: 'Privacy Policy',
    refund: 'Refund Policy',
    terms: 'Terms of Service',
    copyright: '© 2026 Al Ain Water, All rights reserved.',
    addToCart: 'Add to cart',
    checkout: 'Checkout',
    continueShopping: 'Continue shopping',
    quantity: 'Quantity',
    total: 'Total',
    aed: 'AED',
    chatWithUs: 'Chat with us',
    remove: 'Remove',
  },
  ar: {
    products: 'منتجاتنا',
    story: 'قصتنا',
    contact: 'تواصل معنا',
    faq: 'الأسئلة الشائعة',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن أي شيء',
    langSwitch: 'English',
    bestsellers: 'الأكثر مبيعاً',
    news: 'الأخبار والتحديثات',
    newsShort: 'الأخبار',
    newsSub: 'أخبار مياه العين ومنتجاتها',
    readMore: 'اقرأ المزيد',
    viewAll: 'عرض كل المقالات',
    explore: 'استكشف',
    cart: 'سلة التسوق',
    cartEmpty: 'سلتك فارغة حالياً.',
    cartReady: 'جاهز لاكتشاف منتجاتك المفضلة؟',
    shopNow: 'تسوق الآن',
    home: 'الرئيسية',
    freeDelivery: 'توصيل منزلي مجاني',
    freeDeliverySub: 'راحة بدون حمل ثقيل.',
    fastDelivery: 'توصيل سريع وسهل في أنحاء الإمارات.',
    offers: 'عروض مميزة',
    connect: 'تواصل معنا',
    allProducts: 'كل المنتجات',
    shopByCategory: 'تسوق حسب الفئة',
    usefulLinks: 'روابط مفيدة',
    privacy: 'سياسة الخصوصية',
    refund: 'سياسة الاسترجاع',
    terms: 'شروط الخدمة',
    copyright: '© 2026 مياه العين، جميع الحقوق محفوظة.',
    addToCart: 'أضف إلى السلة',
    checkout: 'إتمام الطلب',
    continueShopping: 'متابعة التسوق',
    quantity: 'الكمية',
    total: 'الإجمالي',
    aed: 'د.إ',
    chatWithUs: 'تواصل معنا',
    remove: 'إزالة',
  },
}
