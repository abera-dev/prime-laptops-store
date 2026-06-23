import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer'];
const RAM_OPTIONS = [4, 8, 16, 32];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filtersOpen]);

  const renderFilterPanel = (onClose) => (
    <div className="card p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl font-bold uppercase text-slate-50">Filters</h2>
        <div className="flex items-center gap-3">
          <button onClick={clearFilters} className="text-xs text-cyan hover:underline">Clear all</button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="theme-toggle h-9 w-9 lg:hidden"
              aria-label="Close filters"
              title="Close filters"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-normal">Search</label>
        <input
          type="text"
          className="input mt-1"
          placeholder="Brand, CPU, name..."
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
  );

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">

        {/* Sidebar Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            {renderFilterPanel()}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="theme-toggle lg:hidden"
                aria-label="Open filters"
                title="Open filters"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </button>
              <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50">
              {filters.brand ? `${filters.brand} Laptops` : 'All Laptops'}
              </h1>
            </div>
            <span className="font-mono text-sm text-slate-500">{products.length} products</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),300px))] justify-start gap-6">
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,240px),300px))] justify-start gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${filtersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!filtersOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${filtersOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setFiltersOpen(false)}
          aria-label="Close filters"
        />
        <div
          className={`absolute left-0 top-0 h-full w-[min(300px,calc(100vw-32px))] overflow-y-auto p-4 transition-transform duration-300 ${
            filtersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          {renderFilterPanel(() => setFiltersOpen(false))}
        </div>
      </div>
    </div>
  );
}
