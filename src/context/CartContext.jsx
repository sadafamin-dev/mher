import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'mecasih_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* ignore */ }
  }, [items])

  function addToCart(product, quantity, customInstructions) {
    setItems((prev) => {
      const lineId = `${product.product_id}-${customInstructions || 'none'}`
      const existing = prev.find((i) => i.lineId === lineId)
      if (existing) {
        return prev.map((i) => i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { lineId, product_id: product.product_id, title: product.title, price: product.price, swatch: product.swatch, quantity, customInstructions: customInstructions || '' }]
    })
  }

  function updateQuantity(lineId, quantity) {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)).filter((i) => i.quantity > 0))
  }

  function removeFromCart(lineId) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId))
  }

  function clearCart() { setItems([]) }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
