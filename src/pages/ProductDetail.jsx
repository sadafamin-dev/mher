import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById } from '../data/mergedProducts'
import { useCart } from '../context/CartContext'
import { iconMap } from '../components/ProductIcons'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = getProductById(id)

  const [quantity, setQuantity] = useState(1)
  const [color, setColor] = useState('')
  const [text, setText] = useState('')
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-navy">Product not found</h1>
        <Link to="/products" className="mt-4 inline-block text-royal hover:underline">← Back to all products</Link>
      </div>
    )
  }

  const outOfStock = product.stock_quantity === 0
  const Icon = iconMap[product.icon]

  function handleAddToCart(e) {
    e.preventDefault()
    const customInstructions = [color && `Colour: ${color}`, text && `Text: "${text}"`].filter(Boolean).join(' · ')
    addToCart(product, quantity, customInstructions)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <Link to="/products" className="text-sm text-royal hover:underline">← Back to all products</Link>
      <div className="mt-6 grid md:grid-cols-2 gap-12">
        <div className={`aspect-square rounded-blob bg-gradient-to-br ${product.swatch} relative flex items-center justify-center overflow-hidden`}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (Icon && <Icon className="text-paper/90" width="140" height="140" style={{ stroke: 'currentColor' }} />)}
          {outOfStock && (<span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-navy text-paper text-xs font-mono uppercase tracking-wide">Out of stock</span>)}
        </div>

        <div>
          <h1 className="font-display text-3xl text-navy">{product.title}</h1>
          <p className="mt-2 text-navy/60 leading-relaxed">{product.description}</p>
          <p className="mt-4 font-mono text-xl text-navy">PKR {product.price.toLocaleString()}</p>
          <p className="mt-1 text-xs text-navy/50">{outOfStock ? 'This piece is currently sold out.' : `${product.stock_quantity} in stock`}</p>

          <form onSubmit={handleAddToCart} className="mt-8 space-y-5">
            <div>
              <label htmlFor="color" className="block text-sm text-navy/70 mb-1">Colour (optional)</label>
              <input id="color" type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. teal with gold flecks" disabled={outOfStock}
                className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none disabled:opacity-50" />
            </div>
            <div>
              <label htmlFor="custom-text" className="block text-sm text-navy/70 mb-1">Custom text (optional)</label>
              <input id="custom-text" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. a name to engrave" disabled={outOfStock}
                className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none disabled:opacity-50" />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="qty" className="text-sm text-navy/70">Quantity</label>
              <input id="qty" type="number" min="1" max={Math.max(product.stock_quantity, 1)} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} disabled={outOfStock}
                className="w-20 px-3 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none disabled:opacity-50" />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button type="submit" disabled={outOfStock} className="px-6 py-3 rounded-full bg-navy text-paper font-body hover:bg-royal transition-colors disabled:opacity-40 disabled:pointer-events-none">
                {outOfStock ? 'Out of stock' : 'Add to cart'}
              </button>
              {added && <span className="text-sm text-steel">Added to cart ✓</span>}
            </div>
          </form>
          <button onClick={() => navigate('/cart')} className="mt-4 text-sm text-navy/60 hover:text-royal underline">Go to cart →</button>
        </div>
      </div>
    </div>
  )
}
