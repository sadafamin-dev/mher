import { Link } from 'react-router-dom'
import { getOrders } from '../data/orders'

function downloadInvoice(order) {
  const lines = [
    `Mher Resin Studio - Invoice`, `Tracking ID: ${order.trackingId}`, `Date: ${new Date(order.placedAt).toLocaleDateString()}`,
    `Billed to: ${order.shippingName}`, ``,
    ...order.items.map((i) => `${i.title} x${i.quantity} - PKR ${(i.price * i.quantity).toLocaleString()}`),
    ``, `Total: PKR ${order.total.toLocaleString()}`,
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `invoice-${order.trackingId}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Profile() {
  const orders = getOrders()
  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl text-navy">Your account</h1>
      <p className="mt-2 text-navy/60">Order history and invoices.</p>
      {orders.length === 0 ? (
        <div className="mt-10 text-center py-16 border border-line rounded-2xl bg-white/60">
          <p className="font-display text-xl text-navy">No orders yet</p>
          <p className="mt-2 text-sm text-navy/60">Your placed orders will show up here.</p>
          <Link to="/products" className="mt-4 inline-block text-royal hover:underline text-sm">Browse products →</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.trackingId} className="border border-line rounded-2xl p-5 bg-white/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm text-navy">{order.trackingId}</p>
                  <p className="text-xs text-navy/50">{new Date(order.placedAt).toLocaleDateString()} · {order.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-navy">PKR {order.total.toLocaleString()}</span>
                  <button onClick={() => downloadInvoice(order)} className="text-xs px-3 py-1.5 rounded-full border border-line hover:border-navy transition-colors">Download invoice</button>
                  <Link to="/track" className="text-xs px-3 py-1.5 rounded-full bg-navy text-paper hover:bg-royal transition-colors">Track</Link>
                </div>
              </div>
              <ul className="mt-3 text-sm text-navy/60 space-y-1">
                {order.items.map((i) => (<li key={i.lineId}>{i.title} × {i.quantity}</li>))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
