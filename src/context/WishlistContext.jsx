import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'mecasih_wishlist'

export function WishlistProvider({ children }) {
  const [productIds, setProductIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds)) } catch { /* ignore */ }
  }, [productIds])

  function toggleWishlist(productId) {
    setProductIds((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId])
  }
  function isWishlisted(productId) { return productIds.includes(productId) }

  return (
    <WishlistContext.Provider value={{ productIds, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}
