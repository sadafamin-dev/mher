const STORAGE_KEY = 'mecasih_orders'

export function getOrders() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

export function saveOrder(order) {
  try {
    const orders = getOrders()
    orders.unshift(order)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch { /* ignore */ }
}

export function updateOrderStatus(trackingId, status) {
  try {
    const orders = getOrders().map((o) => o.trackingId === trackingId ? { ...o, status } : o)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch { /* ignore */ }
}
