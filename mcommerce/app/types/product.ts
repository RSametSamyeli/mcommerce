export interface Product {
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
  slug: string
  priceInTRY: number
  originalPriceInTRY?: number
  categoryInfo: Category
  stock: number
  isNew?: boolean
  isFeatured?: boolean
  discount?: number
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary?: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
}

export interface ProductFilters {
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'popular'
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  currency: string
  itemCount: number
}