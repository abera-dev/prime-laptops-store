import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer'];
const RAM_OPTIONS = [4, 8, 16, 32];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filters, setFilters]   = useState({
    brand:     searchParams.get('brand') || '',
    ram_gb:    '',
    max_price: '',
    search:    '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.brand)     params.brand     = filters.brand;
      if (filters.ram_gb)    params.ram_gb    = filters.ram_gb;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.search)    params.search    = filters.search;
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
  };

  const clearFilters = () => setFilters({ brand: '', ram_gb: '', max_price: '', search: '' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="card p-5 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-2xl font-bold uppercase text-slate-50">Filters</h2>
              <button onClick={clearFilters} className="text-xs text-cyan hover:underline">Clear all</button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-normal">Search</label>
              <input
                type="text"
                className="input mt-1"
                placeholder="Brand, CPU, name…"
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              />
            </div>

            {/* Brand */}
            <div className="mb-5">
              <label className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-normal">Brand</label>
              <div className="mt-2 space-y-1">
                {BRANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => handleFilter('brand', b)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.brand === b ? 'bg-electric text-white font-semibold shadow-lg shadow-electric/20' : 'text-slate-300 hover:bg-white/10 hover:text-cyan'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* RAM */}
            <div className="mb-5">
              <label className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-normal">Min RAM</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {RAM_OPTIONS.map(r => (
                  <button
                    key={r}
                    onClick={() => handleFilter('ram_gb', String(r))}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      filters.ram_gb === String(r) ? 'bg-electric text-white border-electric' : 'border-white/10 text-slate-300 hover:border-cyan/50 hover:text-cyan'
                    }`}
                  >
                    {r}GB+
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-normal">Max Price</label>
              <input
                type="number"
                className="input mt-1"
                placeholder="e.g. 1500"
                value={filters.max_price}
                onChange={e => setFilters(p => ({ ...p, max_price: e.target.value }))}
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50">
              {filters.brand ? `${filters.brand} Laptops` : 'All Laptops'}
            </h1>
            <span className="font-mono text-sm text-slate-500">{products.length} products</span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-white/10 h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <div className="bg-white/10 h-4 rounded w-3/4" />
                    <div className="bg-white/10 h-3 rounded w-1/2" />
                    <div className="bg-white/10 h-8 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No products match your filters.</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
