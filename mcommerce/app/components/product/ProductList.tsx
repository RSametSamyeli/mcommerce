'use client'

import { memo, useMemo } from 'react'
import { Product } from '@/app/types'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Locale, getTranslations } from '@/app/i18n'

interface ProductListProps {
  products: Product[]
  locale: Locale
  loading?: boolean
}

const ProductListComponent = ({ products, locale, loading }: ProductListProps) => {
  const t = getTranslations(locale)
  
  const skeletonItems = useMemo(() => 
    Array.from({ length: 12 }).map((_, index) => (
      <ProductListSkeleton key={index} />
    )), 
    []
  )

  const productItems = useMemo(() => 
    products.map((product) => (
      <ProductCard key={product.id} product={product} locale={locale} />
    )), 
    [products, locale]
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletonItems}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">{t.products.noResults}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {t.errors.noResultsDescription}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productItems}
    </div>
  )
}

const ProductListSkeleton = memo(() => {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-6 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  )
})

ProductListSkeleton.displayName = 'ProductListSkeleton'

export const ProductList = memo(ProductListComponent)