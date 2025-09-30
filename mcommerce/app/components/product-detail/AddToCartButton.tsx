'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AddToCartButtonProps {
  productId: number
  stock: number
  isFeatured?: boolean
}

export function AddToCartButton({ productId, stock, isFeatured }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    // TODO: zustand'a bagla
    console.log('Add to cart:', productId)
  }

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full"
        disabled={stock === 0}
        onClick={handleAddToCart}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Sepete Ekle
      </Button>
      
      {isFeatured && (
        <Badge variant="outline" className="w-full justify-center py-2">
          Öne Çıkan Ürün
        </Badge>
      )}
    </div>
  )
}