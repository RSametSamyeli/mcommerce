import { Product, ProductFilters, ProductListResponse, Category } from '@/app/types'
import { Locale, getTranslations } from '@/app/i18n'

const USD_TO_TRY = 41.59

const categoryMapping: Record<string, { slug: string; id: string; translationKey: string }> = {
  'electronics': { slug: 'electronics', id: '1', translationKey: 'electronics' },
  'jewelery': { slug: 'jewelery', id: '2', translationKey: 'jewelery' },
  "men's clothing": { slug: 'mens-clothing', id: '3', translationKey: 'mensClothing' },
  "women's clothing": { slug: 'womens-clothing', id: '4', translationKey: 'womensClothing' },
}

interface ApiProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

function enhanceProduct(apiProduct: ApiProduct, locale: Locale = 'en'): Product {
  const t = getTranslations(locale)
  const categoryConfig = categoryMapping[apiProduct.category]
  const categoryInfo = categoryConfig ? {
    name: t.categories[categoryConfig.translationKey as keyof typeof t.categories],
    slug: categoryConfig.slug,
    id: categoryConfig.id
  } : {
    name: apiProduct.category,
    slug: apiProduct.category.toLowerCase().replace(/\s+/g, '-'),
    id: '0'
  }

  const hasDiscount = Math.random() > 0.7
  const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : undefined
  const priceInTRY = apiProduct.price * USD_TO_TRY
  const originalPriceInTRY = discount ? priceInTRY : undefined
  const finalPriceInTRY = discount ? priceInTRY * (1 - discount / 100) : priceInTRY
  const originalPrice = discount ? apiProduct.price : undefined
  const finalPrice = discount ? apiProduct.price * (1 - discount / 100) : apiProduct.price

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    price: finalPrice,
    originalPrice,
    description: apiProduct.description,
    category: apiProduct.category,
    image: apiProduct.image,
    rating: apiProduct.rating,

    slug: apiProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    priceInTRY: finalPriceInTRY,
    originalPriceInTRY,
    categoryInfo,
    stock: Math.floor(Math.random() * 50) + 1,
    isNew: Math.random() > 0.8,
    isFeatured: Math.random() > 0.9,
    discount,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

async function fetchProducts(locale: Locale = 'en'): Promise<Product[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const apiProducts = await response.json()
    return apiProducts.map((product: ApiProduct) => enhanceProduct(product, locale))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

let cachedProducts: Product[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60 * 1000 

export async function getProducts(filters?: ProductFilters, locale: Locale = 'en'): Promise<ProductListResponse> {
  const now = Date.now()
  if (!cachedProducts || now - cacheTimestamp > CACHE_DURATION) {
    cachedProducts = await fetchProducts(locale)
    cacheTimestamp = now
  }

  let filteredProducts = [...cachedProducts]

  if (filters) {
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        filters.categories!.includes(product.categoryInfo.slug)
      )
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.priceInTRY >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.priceInTRY <= filters.maxPrice!)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.categoryInfo.name.toLowerCase().includes(searchTerm)
      )
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.priceInTRY - b.priceInTRY)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.priceInTRY - a.priceInTRY)
        break
      case 'name-asc':
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'popular':
        filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate)
        break
    }
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 12
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredProducts.length / limit)

  return {
    products: paginatedProducts,
    total: filteredProducts.length,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export async function getProductBySlug(slug: string, locale: Locale = 'en'): Promise<Product | null> {
  if (!cachedProducts) {
    cachedProducts = await fetchProducts(locale)
    cacheTimestamp = Date.now()
  }

  const product = cachedProducts.find(p => p.slug === slug)
  return product || null
}

export async function getCategories(locale: Locale = 'en'): Promise<Category[]> {
  const t = getTranslations(locale)
  return Object.values(categoryMapping).map(category => ({
    name: t.categories[category.translationKey as keyof typeof t.categories],
    slug: category.slug,
    id: category.id
  }))
}