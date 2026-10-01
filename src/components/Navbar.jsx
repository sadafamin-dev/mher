import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/track', label: 'Track order' },
]

export default function Navbar() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/brand/logo.png" alt="Mher Resin Studio logo" className="w-11 h-11 rounded-full object-cover shrink-0" />
          <span className="font-display text-xl leading-tight text-navy">
            Mher
            <span className="block text-[11px] font-mono tracking-[0.2em] uppercase text-steel">Resin Studio</span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) => `pb-1 border-b-2 transition-colors ${isActive ? 'border-royal text-navy' : 'border-transparent text-navy/70 hover:text-navy hover:border-sky'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 font-body text-sm">
          <NavLink to="/wishlist" className="text-navy/80 hover:text-navy transition-colors hidden sm:inline">Wishlist</NavLink>
          <NavLink to="/cart" className="text-navy/80 hover:text-navy transition-colors">Cart ({itemCount})</NavLink>
          <NavLink to="/profile" className="text-navy/80 hover:text-navy transition-colors hidden sm:inline">Account</NavLink>
        </div>
      </div>
    </header>
  )
}
