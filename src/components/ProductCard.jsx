import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { iconMap } from './ProductIcons'

export default function ProductCard({ product }) {
  const outOfStock = product.stock_quantity === 0
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 3
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(product.product_id)
  const Icon = iconMap[product.icon]

  return (
    <article className="group rounded-2xl border border-line bg-white/60 overflow-hidden flex flex-col">
      <div className={`relative aspect-square bg-gradient-to-br ${product.swatch}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {Icon && <Icon className="text-paper/90" style={{ stroke: 'currentColor' }} />}
          </div>
        )}
        {outOfStock && (<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-navy text-paper text-xs font-mono uppercase tracking-wide">Out of stock</span>)}
        {!outOfStock && lowStock && (<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-royal text-paper text-xs font-mono uppercase tracking-wide">Only {product.stock_quantity} left</span>)}
        <button onClick={() => toggleWishlist(product.product_id)} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={saved}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper/80 backdrop-blur flex items-center justify-center text-sm hover:bg-paper transition-colors">
          <span className={saved ? 'text-royal' : 'text-navy/50'}>{saved ? '♥' : '♡'}</span>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg text-navy leading-snug">{product.title}</h3>
        <p className="mt-1 text-sm text-navy/60 flex-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-base text-navy">PKR {product.price.toLocaleString()}</span>
          <Link to={`/products/${product.product_id}`} aria-disabled={outOfStock}
            className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${outOfStock ? 'bg-line text-navy/40 pointer-events-none' : 'bg-navy text-paper hover:bg-royal'}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
