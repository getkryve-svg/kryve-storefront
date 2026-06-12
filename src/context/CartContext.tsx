import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem, CartState, CartAction } from '../types'

const CART_KEY = 'kryve_cart'

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.variantId === action.payload.variantId)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.variantId === action.payload.variantId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.variantId !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map(i => i.variantId === action.payload.variantId ? { ...i, quantity: action.payload.quantity } : i)
          .filter(i => i.quantity > 0),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

interface CartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  itemCount: number
  subtotal: number
  addItem: (item: CartItem) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCart(),
    isOpen: false,
  })

  // Persist cart items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items))
    } catch { /* quota exceeded — ignore */ }
  }, [state.items])

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0)

  function addItem(item: CartItem) {
    dispatch({ type: 'ADD_ITEM', payload: item })
    dispatch({ type: 'OPEN_CART' })
    // Fire analytics events (picked up by Analytics component listeners)
    window.dispatchEvent(new CustomEvent('kryve:add_to_cart', { detail: item }))
  }

  function clearCart() {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{ state, dispatch, itemCount, subtotal, addItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
