import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-navy">Your cart is empty</h1>
        <p className="mt-2 text-navy/60">Nothing poured yet — go find something you like.</p>
        <Link to="/products" className="mt-6 inline-block px-6 py-3 rounded-full bg-navy text-paper hover:bg-royal transition-colors">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-navy mb-8">Your cart</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.lineId} className="flex gap-4 border border-line rounded-2xl p-4 bg-white/60">
              <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.swatch} shrink-0`} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-display text-navy">{item.title}</h3>
                  <button onClick={() => removeFromCart(item.lineId)} className="text-xs text-royal hover:underline">Remove</button>
                </div>
                {item.customInstructions && <p className="text-xs text-navy/50 mt-1">{item.customInstructions}</p>}
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 text-sm text-navy/70">
                    Qty
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.lineId, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
                  </label>
                  <span className="font-mono text-sm text-navy">PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-line rounded-2xl p-6 bg-white/60 h-fit">
          <h2 className="font-display text-lg text-navy mb-4">Order summary</h2>
          <div className="flex justify-between text-sm text-navy/70 mb-2">
            <span>Subtotal</span>
            <span className="font-mono">PKR {subtotal.toLocaleString()}</span>
          </div>
          <p className="text-xs text-navy/50 mb-4">Shipping calculated at checkout.</p>
          <Link to="/checkout" className="block text-center px-6 py-3 rounded-full bg-navy text-paper hover:bg-royal transition-colors">Proceed to checkout</Link>
        </div>
      </div>
    </div>
  )
}
