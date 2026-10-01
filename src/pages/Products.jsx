import { useMemo, useState } from 'react'
import { getAllProducts, categories } from '../data/mergedProducts'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const allProducts = getAllProducts()

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category_id === Number(activeCategory)
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query, allProducts])

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-steel mb-2">The collection</p>
          <h1 className="font-display text-4xl text-navy">All products</h1>
        </div>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" aria-label="Search products"
          className="w-full sm:w-64 px-4 py-2 rounded-full border border-line bg-white/70 text-sm placeholder:text-navy/40 focus:border-royal outline-none" />
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <button onClick={() => setActiveCategory('all')} className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${activeCategory === 'all' ? 'bg-navy text-paper' : 'bg-white/70 text-navy/70 border border-line hover:border-navy/40'}`}>All</button>
        {categories.map((cat) => (
          <button key={cat.category_id} onClick={() => setActiveCategory(String(cat.category_id))}
            className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${activeCategory === String(cat.category_id) ? 'bg-navy text-paper' : 'bg-white/70 text-navy/70 border border-line hover:border-navy/40'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-navy">Nothing poured yet in this search.</p>
          <p className="mt-2 text-navy/60 text-sm">Try a different category, or clear the search box.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filtered.map((product) => (<ProductCard key={product.product_id} product={product} />))}
        </div>
      )}
    </div>
  )
}
