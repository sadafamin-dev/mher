import { useState } from 'react'

const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered']
function mockStatusFor(trackingId) {
  let hash = 0
  for (const char of trackingId) hash = (hash * 31 + char.charCodeAt(0)) % 97
  return hash % STEPS.length
}

export default function TrackOrder() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  function handleSubmit(e) { e.preventDefault(); const trimmed = input.trim(); if (!trimmed) return; setResult({ id: trimmed, stepIndex: mockStatusFor(trimmed) }) }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-navy">Track your order</h1>
      <p className="mt-2 text-navy/60">Enter the tracking ID you got at checkout to see where your piece is.</p>
      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. MCS-7F3K9Q" aria-label="Tracking ID" className="flex-1 px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
        <button type="submit" className="px-6 py-2 rounded-full bg-navy text-paper hover:bg-royal transition-colors">Track</button>
      </form>
      {result && (
        <div className="mt-10 border border-line rounded-2xl p-6 bg-white/60">
          <p className="text-sm text-navy/60 mb-6">Order <span className="font-mono text-navy">{result.id}</span></p>
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono ${i <= result.stepIndex ? 'bg-royal text-paper' : 'bg-line text-navy/40'}`}>{i + 1}</div>
                  <span className={`mt-2 text-xs text-center ${i <= result.stepIndex ? 'text-navy' : 'text-navy/40'}`}>{step}</span>
                </div>
                {i < STEPS.length - 1 && (<div className={`flex-1 h-0.5 mx-2 mb-5 ${i < result.stepIndex ? 'bg-royal' : 'bg-line'}`} />)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
