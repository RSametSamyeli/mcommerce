'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCartStore } from '@/app/store/cart'

export default function CartPage() {
  const { items, totalItems, totalPriceInTRY, updateQuantity, removeItem, clearCart } = useCartStore()
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  const shippingCost = totalPriceInTRY > 500 ? 0 : 29.99
  const finalTotal = totalPriceInTRY + shippingCost

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
          <p className="text-muted-foreground mb-6">
            Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimizi inceleyin.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ürünleri İncele
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Sepetim</h1>
        </div>
        <p className="text-muted-foreground">
          {totalItems} ürün sepetinizde
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center gap-4">
                <Link 
                  href={`/products/${item.product.slug}`}
                  className="relative flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </Link>

                <div className="flex-1 space-y-2">
                  <Link 
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:text-primary line-clamp-2"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.product.categoryInfo.name}
                  </p>
                  <p className="font-semibold">
                    {formatPrice(item.product.priceInTRY)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="font-semibold">
                      {formatPrice(item.product.priceInTRY * item.quantity)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Kaldır
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sepeti Temizle
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Sipariş Özeti</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span>{formatPrice(totalPriceInTRY)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-muted-foreground">
                  500₺ üzeri kargo ücretsiz
                </p>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Toplam:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button className="w-full" size="lg">
                Ödemeye Geç
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Alışverişe Devam Et</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}