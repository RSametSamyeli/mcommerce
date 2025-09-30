import { Product, ProductFilters, ProductListResponse, Category } from '@/app/types'

const USD_TO_TRY = 41.59

const categoryMapping: Record<string, { name: string; slug: string; id: string }> = {
  'electronics': { name: 'Elektronik', slug: 'elektronik', id: '1' },
  'jewelery': { name: 'Takı & Aksesuar', slug: 'taki-aksesuar', id: '2' },
  "men's clothing": { name: 'Erkek Giyim', slug: 'erkek-giyim', id: '3' },
  "women's clothing": { name: 'Kadın Giyim', slug: 'kadin-giyim', id: '4' },
}

function enhanceProduct(apiProduct: any): Product {
  const categoryInfo = categoryMapping[apiProduct.category] || {
    name: apiProduct.category,
    slug: apiProduct.category.toLowerCase().replace(/\s+/g, '-'),
    id: '0'
  }

  const hasDiscount = Math.random() > 0.7
  const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : undefined
  const priceInTRY = apiProduct.price * USD_TO_TRY
  const originalPriceInTRY = discount ? priceInTRY : undefined
  const finalPriceInTRY = discount ? priceInTRY * (1 - discount / 100) : priceInTRY

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    price: apiProduct.price,
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

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    const apiProducts = await response.json()
    return apiProducts.map(enhanceProduct)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

let cachedProducts: Product[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 60 * 1000 

export async function getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
  const now = Date.now()
  if (!cachedProducts || now - cacheTimestamp > CACHE_DURATION) {
    cachedProducts = await fetchProducts()
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!cachedProducts) {
    cachedProducts = await fetchProducts()
    cacheTimestamp = Date.now()
  }

  const product = cachedProducts.find(p => p.slug === slug)
  return product || null
}

export async function getCategories(): Promise<Category[]> {
  return Object.values(categoryMapping)
}