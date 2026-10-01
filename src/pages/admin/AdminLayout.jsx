import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ClipboardList, Tag, ChevronDown } from 'lucide-react'
import { categories } from '../../data/mergedProducts'

export default function AdminLayout() {
  const location = useLocation()
  const isOnProducts = location.pathname.startsWith('/admin/products')
  const [productsOpen, setProductsOpen] = useState(isOnProducts)
  const params = new URLSearchParams(location.search)
  const activeCategory = params.get('category')

  return (
    <div className="min-h-screen flex bg-paper font-body">
      <aside className="w-64 shrink-0 bg-navy text-paper/85 flex flex-col">
        <div className="px-6 py-6 border-b border-paper/10">
          <div className="flex items-center gap-3">
            <img src="/brand/logo.png" alt="Mher logo" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="font-display text-base text-paper leading-tight">Mher</p>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-sky-light">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-sky/20 text-paper font-medium' : 'text-paper/70 hover:bg-paper/5 hover:text-paper'}`}>
            <LayoutDashboard size={17} /> Dashboard
          </NavLink>

          <div>
            <button onClick={() => setProductsOpen((v) => !v)} className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isOnProducts ? 'bg-sky/20 text-paper font-medium' : 'text-paper/70 hover:bg-paper/5 hover:text-paper'}`}>
              <span className="flex items-center gap-3"><Package size={17} /> Products</span>
              <ChevronDown size={15} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
            </button>
            {productsOpen && (
              <div className="mt-1 ml-4 pl-3 border-l border-paper/10 space-y-0.5">
                <NavLink to="/admin/products" end className={() => `block px-3 py-1.5 rounded-lg text-xs transition-colors ${isOnProducts && !activeCategory ? 'bg-sky/20 text-paper' : 'text-paper/60 hover:bg-paper/5 hover:text-paper'}`}>All products</NavLink>
                {categories.map((cat) => (
                  <NavLink key={cat.category_id} to={`/admin/products?category=${cat.category_id}`}
                    className={() => `block px-3 py-1.5 rounded-lg text-xs transition-colors ${String(activeCategory) === String(cat.category_id) ? 'bg-sky/20 text-paper' : 'text-paper/60 hover:bg-paper/5 hover:text-paper'}`}>
                    {cat.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/admin/orders" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-sky/20 text-paper font-medium' : 'text-paper/70 hover:bg-paper/5 hover:text-paper'}`}>
            <ClipboardList size={17} /> Orders
          </NavLink>
          <NavLink to="/admin/promo-codes" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-sky/20 text-paper font-medium' : 'text-paper/70 hover:bg-paper/5 hover:text-paper'}`}>
            <Tag size={17} /> Promo Codes
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-paper/10">
          <NavLink to="/" className="text-xs text-paper/50 hover:text-paper/80">← Back to customer site</NavLink>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="bg-royal/10 border-b border-line px-8 py-2 text-xs text-navy/70 font-body">
          Demo UI only — not password-protected yet. Real admin authentication must be added by the backend before this goes live.
        </div>
        <main className="p-8 max-w-6xl"><Outlet /></main>
      </div>
    </div>
  )
}
