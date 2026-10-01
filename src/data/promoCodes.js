const STORAGE_KEY = 'mecasih_promo_codes'

export function getPromoCodes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch { return [] }
}

export function addPromoCode(code) {
  try {
    const codes = getPromoCodes()
    codes.unshift({ ...code, id: `promo-${Date.now()}` })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  } catch { /* ignore */ }
}

export function deletePromoCode(id) {
  try {
    const codes = getPromoCodes().filter((c) => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  } catch { /* ignore */ }
}
