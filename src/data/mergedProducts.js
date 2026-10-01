import { products as baseProducts, categories } from './products'
import { getOverrides } from './productOverrides'
import { getAdminProducts } from './adminProducts'

export { categories }

export function getAllProducts() {
  const overrides = getOverrides()
  const merged = baseProducts
    .map((p) => ({ ...p, ...overrides[p.product_id] }))
    .filter((p) => !p.deleted)
  return [...merged, ...getAdminProducts()]
}

export function getProductById(product_id) {
  const idAsNumber = Number(product_id)
  const idToMatch = Number.isNaN(idAsNumber) ? product_id : idAsNumber
  return getAllProducts().find((p) => p.product_id === idToMatch || p.product_id === product_id)
}
