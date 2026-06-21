import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer'];
const EMPTY_FORM = { name: '', brand: 'Dell', price: '', cpu: '', ram_gb: '', storage_gb: '', gpu: '', stock: '', image: '' };

export default function AdminDashboard() {
  const [tab, setTab]         = useState('products');
  const [products, setProds]  = useState([]);
  const [orders, setOrders]   = useState([]);
  const [stats, setStats]     = useState(null);
  const [showForm, setShowF]  = useState(false);
  const [editProd, setEditP]  = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    const [pRes, oRes, sRes] = await Promise.all([
      api.get('/products'),
      api.get('/orders'),
      api.get('/orders/stats'),
    ]);
    setProds(pRes.data);
    setOrders(oRes.data);
    setStats(sRes.data);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditP(null); setShowF(true); };
  const openEdit   = (p) => { setForm({ ...p, price: p.price, ram_gb: p.ram_gb, storage_gb: p.storage_gb, stock: p.stock }); setEditP(p); setShowF(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editProd) {
        await api.put(`/products/${editProd.id}`, form);
        toast.success('Product updated!');
      } else {
        await api.post('/products', form);
        toast.success('Product created!');
      }
      setShowF(false);
      await fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error saving product');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      await fetchAll();
    } catch (err) { toast.error('Failed to delete product'); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      await fetchAll();
    } catch { toast.error('Failed to update status'); }
  };

  const statCards = stats ? [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-green-50 text-green-700' },
    { label: 'Total Orders',  value: stats.totalOrders,  icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'Products',      value: stats.totalProducts, icon: '💻', color: 'bg-purple-50 text-purple-700' },
    { label: 'Customers',     value: stats.totalCustomers,icon: '👥', color: 'bg-orange-50 text-orange-700' },
  ] : [];

  const statusColors = { Pending:'bg-yellow-100 text-yellow-700', Processing:'bg-blue-100 text-blue-700', Shipped:'bg-indigo-100 text-indigo-700', Delivered:'bg-green-100 text-green-700', Cancelled:'bg-red-100 text-red-700' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage products, orders, and inventory</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className={`card p-5 flex items-center gap-4 ${s.color}`}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {['products', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            {t} {t === 'products' ? `(${products.length})` : `(${orders.length})`}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openCreate} className="btn-primary">+ Add Product</button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Image','Name','Brand','Price','RAM','Storage','Stock','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.name} className="w-14 h-10 object-cover rounded" onError={e=>e.target.src='https://via.placeholder.com/56x40?text=Img'} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                    <td className="px-4 py-3 font-semibold text-blue-700">${Number(p.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{p.ram_gb}GB</td>
                    <td className="px-4 py-3 text-gray-600">{p.storage_gb}GB</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs btn-secondary py-1 px-3">Edit</button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-xs btn-danger py-1 px-3">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Order ID','Customer','Total','Status','Date','Update Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-700">#{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{o.customer_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{o.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-700">${Number(o.total_price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-screen overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editProd ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowF(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required className="input" placeholder="e.g. Dell XPS 15 9530" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select className="input" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}>
                  {BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input type="number" required min="0" step="0.01" className="input" placeholder="1299.99" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CPU</label>
                <input required className="input" placeholder="Intel Core i7-13700H" value={form.cpu} onChange={e => setForm(p => ({ ...p, cpu: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RAM (GB)</label>
                <input type="number" required min="1" className="input" placeholder="16" value={form.ram_gb} onChange={e => setForm(p => ({ ...p, ram_gb: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage (GB)</label>
                <input type="number" required min="1" className="input" placeholder="512" value={form.storage_gb} onChange={e => setForm(p => ({ ...p, storage_gb: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">GPU</label>
                <input required className="input" placeholder="NVIDIA GeForce RTX 4060" value={form.gpu} onChange={e => setForm(p => ({ ...p, gpu: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" required min="0" className="input" placeholder="25" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input required className="input" placeholder="https://..." value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
                  {loading ? 'Saving…' : editProd ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowF(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
