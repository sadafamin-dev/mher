const STORAGE_KEY = 'mecasih_product_overrides'

export function getOverrides() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

export function setOverride(product_id, patch) {
  try {
    const overrides = getOverrides()
    overrides[product_id] = { ...overrides[product_id], ...patch }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch { /* ignore */ }
}

export function clearOverride(product_id) {
  try {
    const overrides = getOverrides()
    delete overrides[product_id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch { /* ignore */ }
}
