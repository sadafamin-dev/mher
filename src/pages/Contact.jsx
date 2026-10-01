import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  function update(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }
  function handleSubmit(e) { e.preventDefault(); setSent(true); setForm({ name: '', email: '', message: '' }) }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-navy">Contact us</h1>
      <p className="mt-2 text-navy/60">Have a question or a custom idea in mind? Reach out using the form below.</p>
      {sent ? (
        <div className="mt-8 rounded-2xl border border-steel/30 bg-steel/10 px-6 py-8 text-center">
          <p className="font-display text-xl text-navy">Message sent</p>
          <p className="mt-2 text-sm text-navy/60">We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm text-navy/70 mb-1">Name</label>
            <input id="name" required value={form.name} onChange={update('name')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-navy/70 mb-1">Email</label>
            <input id="email" type="email" required value={form.email} onChange={update('email')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-navy/70 mb-1">Message</label>
            <textarea id="message" required rows={5} value={form.message} onChange={update('message')} className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none resize-y" />
          </div>
          <button type="submit" className="px-6 py-3 rounded-full bg-navy text-paper hover:bg-royal transition-colors">Send message</button>
        </form>
      )}
    </div>
  )
}
