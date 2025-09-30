import { Product } from './product'

export interface CartItem {
  id: number
  product: Product
  quantity: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  totalPriceInTRY: number
}

export interface CartActions {
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getItem: (productId: number) => CartItem | undefined
  isInCart: (productId: number) => boolean
}

export type CartStore = CartState & CartActions