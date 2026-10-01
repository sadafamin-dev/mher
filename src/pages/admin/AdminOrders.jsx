import { useState } from 'react'
import { ClipboardList, X, ImageOff } from 'lucide-react'
import { getOrders, updateOrderStatus } from '../../data/orders'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled']

export default function AdminOrders() {
  const [orders, setOrders] = useState(getOrders())
  const [viewingScreenshot, setViewingScreenshot] = useState(null)

  function handleStatusChange(trackingId, status) { updateOrderStatus(trackingId, status); setOrders(getOrders()) }

  return (
    <div>
      <h1 className="font-display text-2xl text-navy flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center text-navy"><ClipboardList size={18} /></span>
        Orders
      </h1>
      <p className="text-sm text-navy/60 mt-1">
        Orders placed through checkout on this device. Check each payment screenshot against
        your bank record before moving an order past "Pending".
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 text-center py-16 border border-line rounded-2xl bg-white/60">
          <p className="text-navy/60 text-sm">No orders yet — they'll appear here as customers check out.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.trackingId} className="border border-line rounded-2xl p-5 bg-white/70 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-navy">{order.trackingId}</p>
                  <p className="text-xs text-navy/50">{new Date(order.placedAt).toLocaleString()} · {order.shippingName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-navy">PKR {order.total.toLocaleString()}</span>
                  <select value={order.status} onChange={(e) => handleStatusChange(order.trackingId, e.target.value)}
                    className="text-sm border border-line rounded-full px-3 py-1.5 bg-white focus:border-royal outline-none">
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 border-t border-line pt-3">
                <ul className="flex-1 min-w-[200px] space-y-2">
                  {order.items.map((item) => (
                    <li key={item.lineId} className="text-sm">
                      <span className="text-navy">{item.title} × {item.quantity}</span>
                      {item.customInstructions && (<span className="block text-xs text-navy/50 mt-0.5">Custom: {item.customInstructions}</span>)}
                    </li>
                  ))}
                </ul>

                <div>
                  <p className="text-xs text-navy/50 font-mono uppercase tracking-wide mb-2">Payment proof</p>
                  {order.paymentScreenshot ? (
                    <button
                      onClick={() => setViewingScreenshot(order.paymentScreenshot)}
                      className="block w-20 h-20 rounded-lg overflow-hidden border border-line hover:border-royal transition-colors"
                    >
                      <img src={order.paymentScreenshot} alt="Payment screenshot" className="w-full h-full object-cover" />
                    </button>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border border-dashed border-line flex flex-col items-center justify-center text-navy/30 text-[10px] gap-1">
                      <ImageOff size={16} />
                      None
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingScreenshot && (
        <div
          className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingScreenshot(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewingScreenshot(null)}
              className="absolute -top-10 right-0 text-paper hover:text-sky"
            >
              <X size={24} />
            </button>
            <img src={viewingScreenshot} alt="Payment screenshot" className="w-full rounded-2xl shadow-xl" />
          </div>
        </div>
      )}
    </div>
  )
}
