import { Suspense } from 'react'
import { Metadata } from 'next'
import { getProducts } from '@/app/lib/api/products'
import { ProductList } from '@/app/components/product/ProductList'
import { ProductPagination } from '@/app/components/product/ProductPagination'
import { ProductSort } from '@/app/components/product/ProductSort'
import { ProductFilters } from '@/app/components/product/ProductFilters'
import { ProductFilters as ProductFiltersType } from '@/app/types'
import { ErrorBoundary } from '@/app/components/ui/error-boundary'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const search = params.search as string
  const category = params.categories as string
  const page = params.page as string

  let title = 'Ürünler - MCommerce'
  let description = 'En yeni ve popüler ürünleri keşfedin. Kaliteli ürünler, uygun fiyatlar.'

  if (search) {
    title = `"${search}" için arama sonuçları - MCommerce`
    description = `"${search}" araması için bulunan ürünler. En uygun fiyatlar ve hızlı teslimat.`
  }

  if (category) {
    title = `${category} Kategorisi - MCommerce`
    description = `${category} kategorisindeki en iyi ürünler. Kaliteli ${category} ürünleri keşfedin.`
  }

  if (page && parseInt(page) > 1) {
    title += ` - Sayfa ${page}`
  }

  return {
    title,
    description,
    keywords: [
      'e-ticaret', 'online alışveriş', 'ürünler', 'mcommerce',
      search, category
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'tr_TR',
      url: '/products',
      siteName: 'MCommerce',
      images: [
        {
          url: '/og-products.jpg',
          width: 1200,
          height: 630,
          alt: 'MCommerce Ürünler',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-products.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: '/products',
    },
  }
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string
    sortBy?: string
    search?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Parse search params
  const params = await searchParams
  const filters: ProductFiltersType = {
    page: params.page ? parseInt(params.page) : 1,
    sortBy: params.sortBy as ProductFiltersType['sortBy'],
    search: params.search,
    categories: params.category ? params.category.split(',') : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    limit: 12,
  }

  const productData = await getProducts(filters)

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Ürünler</h1>
        </div>
        {filters.search && (
          <p className="text-muted-foreground" role="status" aria-live="polite">
            &quot;{filters.search}&quot; için arama sonuçları ({productData.total} ürün)
          </p>
        )}
      </header>

      <div className="lg:flex lg:gap-8">
        <aside className="lg:w-64 mb-6 lg:mb-0" role="complementary" aria-label="Ürün filtreleri">
          <ProductFilters />
        </aside>

        <section className="lg:flex-1" aria-label="Ürün listesi">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              {productData.total} ürün bulundu
            </p>
            <ProductSort />
          </div>

          <ErrorBoundary>
            <Suspense fallback={<ProductList products={[]} loading={true} />}>
              <ProductList products={productData.products} />
            </Suspense>
          </ErrorBoundary>

          <nav aria-label="Sayfa navigasyonu">
            <ProductPagination
              currentPage={productData.page}
              totalPages={productData.totalPages}
              hasNextPage={productData.hasNextPage}
              hasPrevPage={productData.hasPrevPage}
            />
          </nav>
        </section>
      </div>
    </div>
  )
}