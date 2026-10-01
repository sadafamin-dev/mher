import { Link } from 'react-router-dom'
import { getAllProducts } from '../data/mergedProducts'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const featured = getAllProducts().slice(0, 4)

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-6">
        <img src="/brand/banner.png" alt="Mher Resin Studio — Art in Every Pour" className="w-full rounded-2xl border border-line" />
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-blob bg-gradient-to-br from-sky-light/60 to-sky/40 blur-2xl" aria-hidden="true" />
        <div className="absolute top-32 -right-10 w-64 h-64 rounded-blob bg-gradient-to-br from-royal/30 to-royal/10 blur-xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-steel mb-4">Hand-poured, made to order</p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-navy">
              Every piece starts<span className="italic text-royal"> as a pour.</span>
            </h1>
            <p className="mt-6 text-navy/70 text-lg max-w-md leading-relaxed">
              Mher turns everyday requests — a name, a colour, an occasion —
              into one-of-a-kind resin art. No two pieces set the same way twice.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link to="/products" className="px-6 py-3 rounded-full bg-navy text-paper font-body hover:bg-royal transition-colors">Shop the collection</Link>
              <Link to="/contact" className="px-6 py-3 rounded-full border border-navy/20 text-navy font-body hover:border-navy transition-colors">Request a custom piece</Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-blob bg-gradient-to-br from-sky via-sky-light to-royal shadow-xl flex items-center justify-center">
            <div className="absolute inset-6 rounded-blob border border-paper/40" />
            <img src="/brand/logo.png" alt="Mher Resin Studio" className="relative w-40 h-40 rounded-full shadow-lg object-cover" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8">
        {[
          { title: 'Custom by default', body: 'Add your colours and text at checkout — no back-and-forth messages needed.' },
          { title: 'Real stock counts', body: 'What you see in the shop is what is actually left on the shelf.' },
          { title: 'Tracked end to end', body: 'Follow your order from pending to delivered with one tracking ID.' },
        ].map((item) => (
          <div key={item.title} className="border-t-2 border-sky pt-4">
            <h3 className="font-display text-xl text-navy">{item.title}</h3>
            <p className="mt-2 text-sm text-navy/60 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl text-navy">Recently poured</h2>
          <Link to="/products" className="text-sm text-royal hover:underline">View all products →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (<ProductCard key={product.product_id} product={product} />))}
        </div>
      </section>
    </div>
  )
}
