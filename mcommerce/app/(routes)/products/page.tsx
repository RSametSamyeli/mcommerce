import { Suspense } from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/app/lib/api/products'
import { ProductList } from '@/app/components/product/ProductList'
import { ProductPagination } from '@/app/components/product/ProductPagination'
import { ProductSort } from '@/app/components/product/ProductSort'
import { ProductFilters } from '@/app/components/product/ProductFilters'
import { ProductFilters as ProductFiltersType } from '@/app/types'

export const metadata: Metadata = {
  title: 'Ürünler',
  description: 'En yeni ürünleri keşfedin',
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60

interface ProductsPageProps {
  searchParams: {
    page?: string
    sortBy?: string
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse search params
  const filters: ProductFiltersType = {
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    sortBy: searchParams.sortBy as ProductFiltersType['sortBy'],
    search: searchParams.search,
    categories: searchParams.category ? searchParams.category.split(',') : undefined,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    limit: 12,
  }

  const productData = await getProducts(filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ürünler</h1>
        {filters.search && (
          <p className="text-muted-foreground">
            &quot;{filters.search}&quot; için arama sonuçları ({productData.total} ürün)
          </p>
        )}
      </div>

      <div className="lg:flex lg:gap-8">
        <ProductFilters />

        <div className="lg:flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              {productData.total} ürün bulundu
            </p>
            <ProductSort />
          </div>

          <Suspense fallback={<ProductList products={[]} loading={true} />}>
            <ProductList products={productData.products} />
          </Suspense>

          <ProductPagination
            currentPage={productData.page}
            totalPages={productData.totalPages}
            hasNextPage={productData.hasNextPage}
            hasPrevPage={productData.hasPrevPage}
          />
        </div>
      </div>
    </div>
  )
}