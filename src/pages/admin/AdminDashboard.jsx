import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, TrendingDown, ShoppingBag, Clock, PackageX, Wallet } from 'lucide-react'
import { getOrders } from '../../data/orders'
import { getAllProducts } from '../../data/mergedProducts'

const RANGE_OPTIONS = [{ key: 'daily', label: 'Daily' }, { key: 'monthly', label: 'Monthly' }, { key: 'yearly', label: 'Yearly' }]
const STATUS_COLORS = { Pending: '#B4863B', Processing: '#8A8072', Shipped: '#6E4A20', Delivered: '#1B1912', Canceled: '#D6C9A8' }

function dayKey(date) { return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) }
function monthKey(date) { return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }) }
function yearKey(date) { return String(date.getFullYear()) }

function buildSeries(orders, range) {
  const keyFn = range === 'daily' ? dayKey : range === 'monthly' ? monthKey : yearKey
  const map = new Map()
  orders.forEach((o) => { const key = keyFn(new Date(o.placedAt)); map.set(key, (map.get(key) || 0) + o.total) })
  const seen = new Set(); const ordered = []
  ;[...orders].reverse().forEach((o) => { const key = keyFn(new Date(o.placedAt)); if (!seen.has(key)) { seen.add(key); ordered.push({ label: key, sales: map.get(key) }) } })
  return ordered
}

export default function AdminDashboard() {
  const [range, setRange] = useState('daily')
  const orders = getOrders()
  const allProducts = getAllProducts()

  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0)
    const pending = orders.filter((o) => o.status === 'Pending').length
    const lowStock = allProducts.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 3).length
    const outOfStock = allProducts.filter((p) => p.stock_quantity === 0).length
    const half = Math.floor(orders.length / 2)
    const recentHalf = orders.slice(0, half).reduce((s, o) => s + o.total, 0)
    const olderHalf = orders.slice(half).reduce((s, o) => s + o.total, 0)
    return { totalSales, pending, lowStock, outOfStock, orderCount: orders.length, trendUp: recentHalf >= olderHalf }
  }, [orders, allProducts])

  const series = useMemo(() => buildSeries(orders, range), [orders, range])
  const statusBreakdown = useMemo(() => {
    const counts = {}
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1 })
    return Object.entries(counts).map(([status, count]) => ({ name: status, value: count }))
  }, [orders])

  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-navy">Dashboard</h1>
          <p className="text-sm text-navy/60 mt-1">Live overview of sales, orders, and stock for Mher Resin Studio.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={<Wallet size={18} />} label="Total sales" value={`PKR ${stats.totalSales.toLocaleString()}`} trend={stats.trendUp} />
        <StatCard icon={<ShoppingBag size={18} />} label="Orders placed" value={stats.orderCount} />
        <StatCard icon={<Clock size={18} />} label="Pending orders" value={stats.pending} highlight={stats.pending > 0} />
        <StatCard icon={<PackageX size={18} />} label="Low / out of stock" value={`${stats.lowStock} / ${stats.outOfStock}`} highlight={stats.outOfStock > 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 border border-line rounded-2xl p-6 bg-white/70">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="font-display text-lg text-navy">Sales overview</h2>
            <div className="flex gap-1 bg-paper border border-line rounded-full p-1">
              {RANGE_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => setRange(opt.key)} className={`px-3.5 py-1.5 rounded-full text-xs font-body transition-colors ${range === opt.key ? 'bg-navy text-paper' : 'text-navy/60 hover:text-navy'}`}>{opt.label}</button>
              ))}
            </div>
          </div>
          {series.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-navy/40">No orders placed yet — this chart fills in as customers check out.</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B4863B" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#B4863B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7DFCB" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8A8072' }} axisLine={{ stroke: '#E7DFCB' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A8072' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${v >= 1000 ? `${v / 1000}k` : v}`} />
                <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Sales']} contentStyle={{ borderRadius: 12, border: '1px solid #E7DFCB', fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
                <Area type="monotone" dataKey="sales" stroke="#6E4A20" strokeWidth={2.5} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border border-line rounded-2xl p-6 bg-white/70">
          <h2 className="font-display text-lg text-navy mb-4">Order status</h2>
          {statusBreakdown.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-navy/40 text-center px-4">Status breakdown will show up once orders come in.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusBreakdown.map((entry) => (<Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#8A8072'} />))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7DFCB', fontSize: 12 }} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: '#1B1912' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link to="/admin/orders" className="text-sm text-royal hover:underline">Review pending orders →</Link>
        <span className="text-navy/30">·</span>
        <Link to="/admin/products" className="text-sm text-royal hover:underline">Manage stock →</Link>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, trend, highlight }) {
  return (
    <div className={`border rounded-2xl p-4 ${highlight ? 'border-royal/30 bg-royal/5' : 'border-line bg-white/70'}`}>
      <div className="flex items-center justify-between">
        <span className="w-8 h-8 rounded-full bg-navy/5 text-navy flex items-center justify-center">{icon}</span>
        {trend !== undefined && (<span className={trend ? 'text-emerald-600' : 'text-royal'}>{trend ? <TrendingUp size={16} /> : <TrendingDown size={16} />}</span>)}
      </div>
      <p className="mt-3 text-xs text-navy/50 font-mono uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-display text-2xl text-navy">{value}</p>
    </div>
  )
}
