'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/app/store/cart'
import { Product } from '@/app/types'
import { Locale, getTranslations } from '@/app/i18n'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
  stock: number
  isFeatured?: boolean
  locale: Locale
}

export function AddToCartButton({ product, stock, isFeatured, locale }: AddToCartButtonProps) {
  const { addItem, updateQuantity, getItem, isInCart } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const t = getTranslations(locale)

  const cartItem = getItem(product.id)
  const inCart = isInCart(product.id)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    try {
      if (inCart && cartItem) {
        updateQuantity(product.id, cartItem.quantity + quantity)
        toast.success(`${product.title} - ${t.cart.quantityUpdated}`, {
          description: `${t.cart.total}: ${cartItem.quantity + quantity} ${t.productDetail.pieces}`
        })
      } else {
        addItem(product, quantity)
        toast.success(`${product.title} - ${t.errors.addedToCart}`, {
          description: `${quantity} ${t.productDetail.pieces} ${t.errors.addedToCartDescription}`
        })
      }
      setTimeout(() => setIsAdding(false), 1000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(t.errors.errorAddingToCart)
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className="space-y-4">
      {stock > 0 && (
        <div className="flex items-center justify-center gap-3 p-2 border rounded-lg">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="font-medium min-w-[2rem] text-center">
            {quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= stock}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        disabled={stock === 0 || isAdding}
        onClick={handleAddToCart}
      >
        {isAdding ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            {t.errors.addedToCart}
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {inCart ? t.errors.addToCartWithQuantity.replace('{{quantity}}', (cartItem?.quantity || 0).toString()) : t.common.addToCart}
          </>
        )}
      </Button>
      
      {isFeatured && (
        <Badge variant="outline" className="w-full justify-center py-2">
          {t.errors.featuredProduct}
        </Badge>
      )}
    </div>
  )
}