'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCartStore } from '@/app/store/cart'
import { Locale, getTranslations, formatCurrency } from '@/app/i18n'

interface CartDrawerProps {
  children: React.ReactNode
  locale: Locale
}

export function CartDrawer({ children, locale }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { items, totalItems, totalPrice, totalPriceInTRY, updateQuantity, removeItem, clearCart } = useCartStore()
  const t = getTranslations(locale)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t.cart.title} ({totalItems} {t.cart.itemsCount.replace('{{count}}', totalItems.toString())})
          </SheetTitle>
        </SheetHeader>
        
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
          role="status"
        >
          {t.cart.title} {totalItems} {t.cart.itemsCount.replace('{{count}}', totalItems.toString())}, {t.cart.total} {formatCurrency(locale === 'en' ? totalPrice : totalPriceInTRY, locale)}
        </div>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t.cart.empty}</h3>
              <p className="text-muted-foreground mb-4">
                {t.cart.emptyDescription}
              </p>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href={`/${locale}/products`}>{t.cart.continueShopping}</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Link 
                        href={`/${locale}/products/${item.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/${locale}/products/${item.product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-medium text-sm hover:text-primary line-clamp-2"
                        >
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(locale === 'en' ? item.product.price : item.product.priceInTRY, locale)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border rounded">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            aria-label={`${item.product.title} ${t.cart.decreaseQuantity}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 text-sm font-medium" aria-label={`${t.cart.quantity}: ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            aria-label={`${item.product.title} ${t.cart.increaseQuantity}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                          aria-label={`${item.product.title} ${t.cart.removeFromCart}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="w-full"
                  aria-label={t.cart.clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t.cart.clearCart}
                </Button>

                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t.cart.subtotal}:</span>
                    <span>{formatCurrency(locale === 'en' ? totalPrice : totalPriceInTRY, locale)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                    <Link href={`/${locale}/cart`}>{t.cart.title}</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}