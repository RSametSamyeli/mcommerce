import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/app/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // TODO: add to cart fonksiyonunu implemente et
    console.log('Add to cart:', product.id)
  }

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discount && (
            <Badge className="absolute left-2 top-2" variant="destructive">
              {product.discount}% İndirim
            </Badge>
          )}
          {product.isNew && (
            <Badge className="absolute right-2 top-2" variant="secondary">
              Yeni
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold">Stokta Yok</span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <p className="text-sm text-muted-foreground mb-1">{product.categoryInfo.name}</p>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating.rate}</span>
            <span className="text-sm text-muted-foreground">({product.rating.count})</span>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold">{formatPrice(product.priceInTRY)}</p>
          {product.originalPriceInTRY && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPriceInTRY)}
            </p>
          )}
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}