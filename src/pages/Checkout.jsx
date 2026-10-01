import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { saveOrder } from '../data/orders'
import { fileToResizedDataUrl } from '../data/imageUtils'

function generateTrackingId() {
  return 'MCS-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function Checkout() {
  const { items, subtotal, clearCart, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotFile, setScreenshotFile] = useState(null)
  const [screenshotError, setScreenshotError] = useState('')

  function update(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }

  async function handleScreenshotChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshotFile(file)
    setScreenshotError('')
    const dataUrl = await fileToResizedDataUrl(file)
    setScreenshot(dataUrl)
  }

  function handlePlaceOrder(e) {
    e.preventDefault()
    if (!screenshot) {
      setScreenshotError('Please upload a screenshot of your payment before placing the order.')
      return
    }
    setPlacing(true)
    setTimeout(() => {
      const id = generateTrackingId()
      saveOrder({
        trackingId: id, placedAt: new Date().toISOString(), items, total: subtotal,
        status: 'Pending', shippingName: form.name, paymentScreenshot: screenshot,
      })
      setOrderId(id)
      clearCart()
      setPlacing(false)
    }, 900)
  }

  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-navy">Order placed</h1>
        <p className="mt-3 text-navy/60">Your tracking ID is <span className="font-mono text-navy">{orderId}</span>. Save it to check your order status.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/track" className="px-6 py-3 rounded-full bg-navy text-paper hover:bg-royal transition-colors">Track this order</Link>
          <Link to="/products" className="px-6 py-3 rounded-full border border-navy/20 text-navy hover:border-navy transition-colors">Keep shopping</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-navy">Your cart is empty</h1>
        <Link to="/products" className="mt-4 inline-block text-royal hover:underline">Go find something to pour →</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-navy mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
          <fieldset className="space-y-4">
            <legend className="font-display text-lg text-navy mb-2">Shipping details</legend>
            <div>
              <label htmlFor="name" className="block text-sm text-navy/70 mb-1">Full name</label>
              <input id="name" required value={form.name} onChange={update('name')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm text-navy/70 mb-1">Address</label>
              <input id="address" required value={form.address} onChange={update('address')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm text-navy/70 mb-1">City</label>
                <input id="city" required value={form.city} onChange={update('city')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm text-navy/70 mb-1">Phone</label>
                <input id="phone" required value={form.phone} onChange={update('phone')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-lg text-navy mb-2">Payment</legend>
            <div className="rounded-2xl border border-line bg-sky-light/10 p-5">
              <p className="text-sm font-body text-navy mb-3">Accounts for Payment</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-navy/70">🛑 UBL Account</p>
                  <p className="text-navy">Aqsa Hanif</p>
                  <p className="font-mono text-navy">0360288195203</p>
                  <p className="text-xs text-navy/50 mt-0.5">IBAN: <span className="font-mono">PK30UNIL0109000288195203</span></p>
                </div>
                <div className="border-t border-line pt-3">
                  <p className="text-navy/70">🛑 JazzCash</p>
                  <p className="text-navy">Aqsa Hanif</p>
                  <p className="font-mono text-navy">0328 6420747</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-navy/50">
              Send the amount to one of the accounts above, then upload a screenshot of the
              payment here. Your order stays "Pending" until we manually verify it against
              our bank record.
            </p>
            <div>
              <label className="block text-sm text-navy/70 mb-1">Payment screenshot</label>
              <div className="flex items-center gap-4">
                {screenshot && (
                  <img src={screenshot} alt="Payment screenshot preview" className="w-20 h-20 rounded-lg object-cover border border-line" />
                )}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-line text-sm text-navy/60 hover:border-royal hover:text-navy cursor-pointer transition-colors">
                  <Upload size={15} />
                  {screenshotFile ? screenshotFile.name : 'Upload screenshot'}
                  <input type="file" accept="image/*" onChange={handleScreenshotChange} className="hidden" />
                </label>
              </div>
              {screenshotError && (
                <p className="mt-2 text-xs text-royal">{screenshotError}</p>
              )}
            </div>
          </fieldset>

          <button type="submit" disabled={placing} className="px-6 py-3 rounded-full bg-navy text-paper hover:bg-royal transition-colors disabled:opacity-50">
            {placing ? 'Placing order…' : `Place order — PKR ${subtotal.toLocaleString()}`}
          </button>
        </form>

        <div className="border border-line rounded-2xl p-6 bg-white/60 h-fit">
          <h2 className="font-display text-lg text-navy mb-4">Order summary</h2>
          <ul className="space-y-3 mb-4">
            {items.map((item) => (
              <li key={item.lineId} className="flex items-start justify-between gap-3 text-sm text-navy/70">
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span>{item.title} × {item.quantity}</span>
                    <span className="font-mono text-navy shrink-0">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    {item.customInstructions ? (
                      <p className="text-xs text-navy/40">{item.customInstructions}</p>
                    ) : <span />}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.lineId)}
                      className="text-xs text-royal hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-body border-t border-line pt-3">
            <span>Total</span>
            <span className="font-mono text-navy">PKR {subtotal.toLocaleString()}</span>
          </div>
          {items.length === 0 && (
            <p className="mt-3 text-xs text-navy/50">Your cart is now empty — go back to browse more pieces.</p>
          )}
        </div>
      </div>
    </div>
  )
}
