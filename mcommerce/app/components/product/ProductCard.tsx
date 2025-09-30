'use client'

import { useState, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Check } from 'lucide-react'
import { Product } from '@/app/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/app/store/cart'
import { useHydration } from '@/app/hooks/useHydration'

interface ProductCardProps {
  product: Product
}

const ProductCardComponent = ({ product }: ProductCardProps) => {
  const { addItem, isInCart, getItem } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const isHydrated = useHydration()
  
  const inCart = isHydrated ? isInCart(product.id) : false
  const cartItem = isHydrated ? getItem(product.id) : undefined

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock === 0) return
    
    setIsAdding(true)
    
    try {
      addItem(product, 1)
      setTimeout(() => setIsAdding(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(false)
    }
  }

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform group-hover:scale-105"
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
          variant={inCart ? "default" : "outline"}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
          title={inCart ? `Sepette (${cartItem?.quantity || 0} adet)` : 'Sepete Ekle'}
        >
          {isAdding ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export const ProductCard = memo(ProductCardComponent)