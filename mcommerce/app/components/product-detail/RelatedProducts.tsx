'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '../product/ProductCard'
import { getProducts } from '@/app/lib/api/products'
import { Product } from '@/app/types'
import { Locale, getTranslations } from '@/app/i18n'

interface RelatedProductsProps {
  currentProductId: number
  categorySlug: string
  locale: Locale
}

export function RelatedProducts({ currentProductId, categorySlug, locale }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const t = getTranslations(locale)

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true)
        const { products } = await getProducts({
          categories: [categorySlug],
          limit: 5,
        }, locale)
        

        const filtered = products
          .filter(product => product.id !== currentProductId)
          .slice(0, 4)
        
        setRelatedProducts(filtered)
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, categorySlug])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t.productDetail.relatedProducts}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.productDetail.relatedProducts}</h2>
        <Link 
          href={`/${locale}/products?category=${categorySlug}`}
          className="text-sm text-primary hover:underline"
        >
          {t.productDetail.viewAll}
        </Link>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  )
}