const STORAGE_KEY = 'mecasih_admin_products'

export function getAdminProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

export function addAdminProduct(product) {
  try {
    const items = getAdminProducts()
    const withId = { ...product, product_id: `admin-${Date.now()}` }
    items.unshift(withId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return withId
  } catch { return null }
}

export function deleteAdminProduct(product_id) {
  try {
    const items = getAdminProducts().filter((p) => p.product_id !== product_id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* ignore */ }
}

export function updateAdminProduct(product_id, patch) {
  try {
    const items = getAdminProducts().map((p) => p.product_id === product_id ? { ...p, ...patch } : p)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* ignore */ }
}
