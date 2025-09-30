import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartStore, CartItem } from '@/app/types/cart'
import { Product } from '@/app/types/product'

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      totalPriceInTRY: 0,

      addItem: (product: Product, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          set((state) => {
            const updatedItems = state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
            return {
              ...state,
              items: updatedItems,
              ...calculateTotals(updatedItems)
            }
          })
        } else {
          const newItem: CartItem = {
            id: Date.now(),
            product,
            quantity,
            addedAt: new Date()
          }
          
          set((state) => {
            const updatedItems = [...state.items, newItem]
            return {
              ...state,
              items: updatedItems,
              ...calculateTotals(updatedItems)
            }
          })
        }
      },

      removeItem: (productId: number) => {
        set((state) => {
          const updatedItems = state.items.filter(item => item.product.id !== productId)
          return {
            ...state,
            items: updatedItems,
            ...calculateTotals(updatedItems)
          }
        })
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => {
          const updatedItems = state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
          return {
            ...state,
            items: updatedItems,
            ...calculateTotals(updatedItems)
          }
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          totalPriceInTRY: 0
        })
      },

      getItem: (productId: number) => {
        const { items } = get()
        return items.find(item => item.product.id === productId)
      },

      isInCart: (productId: number) => {
        const { items } = get()
        return items.some(item => item.product.id === productId)
      }
    }),
    {
      name: 'mcommerce-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        totalPriceInTRY: state.totalPriceInTRY
      }),
    }
  )
)

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const totalPriceInTRY = items.reduce((sum, item) => sum + (item.product.priceInTRY * item.quantity), 0)

  return {
    totalItems,
    totalPrice,
    totalPriceInTRY
  }
}

export { useCartStore }