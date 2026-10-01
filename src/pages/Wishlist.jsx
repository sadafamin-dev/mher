import { Link } from 'react-router-dom'
import { getAllProducts } from '../data/mergedProducts'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { productIds } = useWishlist()
  const saved = getAllProducts().filter((p) => productIds.includes(p.product_id))
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-navy">Your wishlist</h1>
      <p className="mt-2 text-navy/60">Pieces you've saved for later.</p>
      {saved.length === 0 ? (
        <div className="mt-10 text-center py-16 border border-line rounded-2xl bg-white/60">
          <p className="font-display text-xl text-navy">Nothing saved yet</p>
          <p className="mt-2 text-sm text-navy/60">Tap the heart on any product to save it here.</p>
          <Link to="/products" className="mt-4 inline-block text-royal hover:underline text-sm">Browse products →</Link>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {saved.map((product) => (<ProductCard key={product.product_id} product={product} />))}
        </div>
      )}
    </div>
  )
}
