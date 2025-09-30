import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { AlertCircle, Package } from 'lucide-react'
import { getProductBySlug, getProducts } from '@/app/lib/api/products'
import { Card } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ImageGallery } from '@/app/components/product-detail/ImageGallery'
import { RelatedProducts } from '@/app/components/product-detail/RelatedProducts'
import { ShareButtons } from '@/app/components/product-detail/ShareButtons'
import { AddToCartButton } from '@/app/components/product-detail/AddToCartButton'
import { Product } from '@/app/types/product'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
    }
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 100 })
  
  return products.map((product: Product) => ({
    slug: product.slug,
  }))
}

// ISR - Revalidate every 60 seconds
export const revalidate = 60

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Ürünler</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products?category=${product.categoryInfo.slug}`}>
              {product.categoryInfo.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGallery
          image={product.image}
          title={product.title}
          discount={product.discount}
          isNew={product.isNew}
        />

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.categoryInfo.name}</p>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <ShareButtons title={product.title} url={currentUrl} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating.rate)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">{product.rating.rate}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.rating.count} değerlendirme)</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.priceInTRY)}</span>
              {product.originalPriceInTRY && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPriceInTRY)}
                </span>
              )}
            </div>
            {product.price && (
              <p className="text-sm text-muted-foreground">
                USD: ${product.price.toFixed(2)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Package className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Stokta var</span>
                <span className="text-sm text-muted-foreground">({product.stock} adet)</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-600 font-medium">Stokta yok</span>
              </>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="font-semibold">Ürün Açıklaması</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <AddToCartButton 
            product={product}
            stock={product.stock}
            isFeatured={product.isFeatured}
          />

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Ürün Özellikleri</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Kategori:</dt>
                <dd className="font-medium">{product.categoryInfo.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ürün Kodu:</dt>
                <dd className="font-medium">#{product.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Eklenme Tarihi:</dt>
                <dd className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString('tr-TR')}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <RelatedProducts 
          currentProductId={product.id} 
          categorySlug={product.categoryInfo.slug} 
        />
      </div>
    </div>
  )
}