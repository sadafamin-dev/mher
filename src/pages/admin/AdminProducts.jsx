import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Package, Trash2, Pencil, Upload, X, RotateCcw } from 'lucide-react'
import { getAllProducts, categories } from '../../data/mergedProducts'
import { products as baseProducts } from '../../data/products'
import { addAdminProduct, deleteAdminProduct, updateAdminProduct } from '../../data/adminProducts'
import { setOverride, clearOverride, getOverrides } from '../../data/productOverrides'
import { fileToResizedDataUrl } from '../../data/imageUtils'

const emptyForm = {
  title: '', category_id: categories[0]?.category_id ?? 1, price: '', stock_quantity: '',
  description: '', image_url: '',
}

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const [refreshTick, setRefreshTick] = useState(0)
  const allProducts = useMemo(() => getAllProducts(), [refreshTick])
  const overrides = getOverrides()

  const [form, setForm] = useState(emptyForm)
  const [addImageFile, setAddImageFile] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  function refresh() { setRefreshTick((t) => t + 1) }

  const filtered = allProducts.filter(
    (p) => activeCategory === 'all' || p.category_id === Number(activeCategory)
  )

  function update(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }

  async function handleAddImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAddImageFile(file)
    const dataUrl = await fileToResizedDataUrl(file)
    setForm((f) => ({ ...f, image_url: dataUrl }))
  }

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title || !form.price || form.stock_quantity === '') return
    addAdminProduct({
      title: form.title,
      category_id: Number(form.category_id),
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      description: form.description,
      image_url: form.image_url || null,
      icon: 'coaster',
      swatch: 'from-sky-light to-sky',
    })
    setForm(emptyForm)
    setAddImageFile(null)
    refresh()
  }

  function handleDelete(product) {
    const confirmed = window.confirm(`Delete "${product.title}"? This can be undone from the note below the table.`)
    if (!confirmed) return
    if (typeof product.product_id === 'string') {
      deleteAdminProduct(product.product_id)
    } else {
      setOverride(product.product_id, { deleted: true })
    }
    refresh()
  }

  function handleSaveEdit(patch) {
    const product_id = editingProduct.product_id
    if (typeof product_id === 'string') {
      updateAdminProduct(product_id, patch)
    } else {
      setOverride(product_id, patch)
    }
    setEditingProduct(null)
    refresh()
  }

  function handleResetOverride(product_id) {
    clearOverride(product_id)
    setEditingProduct(null)
    refresh()
  }

  const deletedSamples = baseProducts.filter((p) => overrides[p.product_id]?.deleted)

  return (
    <div>
      <h1 className="font-display text-2xl text-navy flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center text-navy">
          <Package size={18} />
        </span>
        Products
      </h1>
      <p className="text-sm text-navy/60 mt-1">
        Click any product to edit its price, stock, photo, or details.
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-1.5 rounded-full text-xs font-body transition-colors ${
            activeCategory === 'all' ? 'bg-navy text-paper' : 'bg-white/70 text-navy/70 border border-line hover:border-navy/40'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => setSearchParams({ category: String(cat.category_id) })}
            className={`px-4 py-1.5 rounded-full text-xs font-body transition-colors ${
              String(activeCategory) === String(cat.category_id)
                ? 'bg-navy text-paper'
                : 'bg-white/70 text-navy/70 border border-line hover:border-navy/40'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-6 border border-line rounded-2xl bg-white/70 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy/[0.03] border-b border-line text-left text-navy/50 text-xs uppercase tracking-wide font-mono">
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const isAdminAdded = typeof p.product_id === 'string'
              return (
                <tr
                  key={p.product_id}
                  onClick={() => setEditingProduct(p)}
                  className="border-b border-line last:border-0 hover:bg-navy/[0.03] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${p.swatch} overflow-hidden`}>
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-navy">PKR {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock_quantity === 0 ? 'text-royal font-medium' : 'text-navy'}>{p.stock_quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-navy/40 text-xs">
                    {isAdminAdded ? 'Added here' : overrides[p.product_id] ? 'Sample · edited' : 'Sample catalogue'}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setEditingProduct(p)} className="text-xs text-royal hover:underline inline-flex items-center gap-1">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p)} className="text-xs text-royal hover:underline inline-flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-navy/40 text-sm">No products in this category yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deletedSamples.length > 0 && (
        <div className="mt-4 text-xs text-navy/50">
          Deleted from sample catalogue:{' '}
          {deletedSamples.map((p, i) => (
            <span key={p.product_id} className="inline-flex items-center gap-1 ml-1">
              {p.title}
              <button onClick={() => { clearOverride(p.product_id); refresh() }} className="text-royal hover:underline inline-flex items-center gap-0.5">
                <RotateCcw size={10} /> restore
              </button>
              {i < deletedSamples.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 border border-line rounded-2xl p-6 bg-white/70 shadow-sm max-w-xl">
        <h2 className="font-display text-lg text-navy mb-4">Add a product</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm text-navy/70 mb-1">Title</label>
            <input id="title" required value={form.title} onChange={update('title')}
              className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm text-navy/70 mb-1">Category</label>
              <select id="category" value={form.category_id} onChange={update('category_id')}
                className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none">
                {categories.map((c) => (<option key={c.category_id} value={c.category_id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm text-navy/70 mb-1">Price (PKR)</label>
              <input id="price" type="number" min="0" required value={form.price} onChange={update('price')}
                className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm text-navy/70 mb-1">Stock quantity</label>
            <input id="stock" type="number" min="0" required value={form.stock_quantity} onChange={update('stock_quantity')}
              className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm text-navy/70 mb-1">Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={update('description')}
              className="w-full px-4 py-2 rounded-lg border border-line bg-white/70 text-sm focus:border-royal outline-none resize-y" />
          </div>
          <div>
            <label className="block text-sm text-navy/70 mb-1">Photo</label>
            <div className="flex items-center gap-4">
              {form.image_url && (<img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-line" />)}
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-line text-sm text-navy/60 hover:border-royal hover:text-navy cursor-pointer transition-colors">
                <Upload size={15} />
                {addImageFile ? addImageFile.name : 'Upload a photo'}
                <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
              </label>
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-full bg-navy text-paper hover:bg-royal transition-colors text-sm">Add product</button>
        </form>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          isOverridden={!!overrides[editingProduct.product_id]}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
          onResetOverride={handleResetOverride}
        />
      )}
    </div>
  )
}

function EditProductModal({ product, isOverridden, onClose, onSave, onResetOverride }) {
  const [form, setForm] = useState({
    title: product.title,
    category_id: product.category_id,
    price: product.price,
    stock_quantity: product.stock_quantity,
    description: product.description || '',
    image_url: product.image_url || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const isAdminAdded = typeof product.product_id === 'string'

  function update(field) { return (e) => setForm((f) => ({ ...f, [field]: e.target.value })) }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const dataUrl = await fileToResizedDataUrl(file)
    setForm((f) => ({ ...f, image_url: dataUrl }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      title: form.title,
      category_id: Number(form.category_id),
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      description: form.description,
      image_url: form.image_url || null,
    })
  }

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-paper rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-paper rounded-t-2xl">
          <h2 className="font-display text-lg text-navy">Edit product</h2>
          <button onClick={onClose} className="text-navy/50 hover:text-navy"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm text-navy/70 mb-1">Title</label>
            <input id="edit-title" required value={form.title} onChange={update('title')}
              className="w-full px-4 py-2 rounded-lg border border-line bg-white text-sm focus:border-royal outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-category" className="block text-sm text-navy/70 mb-1">Category</label>
              <select id="edit-category" value={form.category_id} onChange={update('category_id')}
                className="w-full px-4 py-2 rounded-lg border border-line bg-white text-sm focus:border-royal outline-none">
                {categories.map((c) => (<option key={c.category_id} value={c.category_id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-price" className="block text-sm text-navy/70 mb-1">Price (PKR)</label>
              <input id="edit-price" type="number" min="0" required value={form.price} onChange={update('price')}
                className="w-full px-4 py-2 rounded-lg border border-line bg-white text-sm focus:border-royal outline-none" />
            </div>
          </div>
          <div>
            <label htmlFor="edit-stock" className="block text-sm text-navy/70 mb-1">Stock quantity</label>
            <input id="edit-stock" type="number" min="0" required value={form.stock_quantity} onChange={update('stock_quantity')}
              className="w-full px-4 py-2 rounded-lg border border-line bg-white text-sm focus:border-royal outline-none" />
          </div>
          <div>
            <label htmlFor="edit-description" className="block text-sm text-navy/70 mb-1">Description</label>
            <textarea id="edit-description" rows={3} value={form.description} onChange={update('description')}
              className="w-full px-4 py-2 rounded-lg border border-line bg-white text-sm focus:border-royal outline-none resize-y" />
          </div>
          <div>
            <label className="block text-sm text-navy/70 mb-1">Photo</label>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg overflow-hidden border border-line bg-gradient-to-br ${product.swatch}`}>
                {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-line text-sm text-navy/60 hover:border-royal hover:text-navy cursor-pointer transition-colors">
                <Upload size={15} />
                {imageFile ? imageFile.name : 'Change photo'}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              {!isAdminAdded && isOverridden && (
                <button type="button" onClick={() => onResetOverride(product.product_id)} className="text-xs text-navy/50 hover:text-royal inline-flex items-center gap-1">
                  <RotateCcw size={12} /> Reset to original sample data
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-line text-navy/70 text-sm hover:border-navy/40">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-full bg-navy text-paper hover:bg-royal transition-colors text-sm">Save changes</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
