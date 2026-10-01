import { useState } from 'react'
import { Tag, Trash2 } from 'lucide-react'
import { getPromoCodes, addPromoCode, deletePromoCode } from '../../data/promoCodes'

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState(getPromoCodes())
  const [form, setForm] = useState({ code: '', discount: '', expiry: '' })
  function update(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }
  function handleAdd(e) { e.preventDefault(); if (!form.code || !form.discount) return; addPromoCode({ code: form.code.toUpperCase(), discount: Number(form.discount), expiry: form.expiry }); setCodes(getPromoCodes()); setForm({ code: '', discount: '', expiry: '' }) }
  function handleDelete(id) { deletePromoCode(id); setCodes(getPromoCodes()) }

  return (
    <div>
      <h1 className="font-display text-2xl text-navy flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center text-navy"><Tag size={18} /></span>
        Promo Codes
      </h1>
      <p className="text-sm text-navy/60 mt-1">Create discount codes buyers can enter at checkout.</p>
      <div className="mt-6 border border-line rounded-2xl bg-white/70 overflow-hidden shadow-sm">
        {codes.length === 0 ? (
          <p className="p-6 text-sm text-navy/50 text-center">No promo codes yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-navy/50 text-xs uppercase tracking-wide font-mono">
                <th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-navy">{c.code}</td>
                  <td className="px-4 py-3 text-navy">{c.discount}%</td>
                  <td className="px-4 py-3 text-navy/60">{c.expiry || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(c.id)} className="text-xs text-royal hover:underline inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-8 border border-line rounded-2xl p-6 bg-white/70 shadow-sm max-w-md">
        <h2 className="font-display text-lg text-navy mb-4">Create a code</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm text-navy/70 mb-1">Code name</label>
            <input id="code" required placeholder="e.g. EID20" value={form.code} onChange={update('code')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discount" className="block text-sm text-navy/70 mb-1">Discount %</label>
              <input id="discount" type="number" min="1" max="100" required value={form.discount} onChange={update('discount')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
            </div>
            <div>
              <label htmlFor="expiry" className="block text-sm text-navy/70 mb-1">Expiry date</label>
              <input id="expiry" type="date" value={form.expiry} onChange={update('expiry')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-full bg-navy text-paper hover:bg-royal transition-colors text-sm">Create code</button>
        </form>
      </div>
    </div>
  )
}
