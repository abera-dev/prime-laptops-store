import { memo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const RAM_OPTIONS = [4, 8, 16, 32];
const EMPTY_FILTERS = { brand: '', ram_gb: '', max_price: '', search: '' };
const GRID_CLASS = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),340px))] justify-start gap-6';

/* sessionStorage key — survives tab navigation but not tab close,
   so repeat visits within the same session load instantly.              */
const CACHE_KEY = 'products_cache';

const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="card h-[382px] animate-pulse">
      <div className="h-48 w-full bg-white/10" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-white/10" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 rounded bg-white/10" />
          <div className="h-4 rounded bg-white/10" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-20 rounded bg-white/10" />
          <div className="h-3 w-14 rounded bg-white/10" />
        </div>
        <div className="h-10 rounded bg-white/10" />
      </div>
    </div>
  );
});

const FilterPanel = memo(function FilterPanel({ brands, filters, activeBrand, onClear, onFilter, onSearchChange, onMaxPriceChange, onClose }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold uppercase text-slate-50">Filters</h2>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="text-xs text-cyan hover:underline">Clear all</button>
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

      <div className="mb-5">
        <label className="font-mono text-xs font-semibold uppercase tracking-normal text-slate-500">Search</label>
        <input
          type="text"
          className="input mt-1"
          placeholder="Brand, CPU, name..."
          value={filters.search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label className="font-mono text-xs font-semibold uppercase tracking-normal text-slate-500">Brand</label>
        <div className="mt-2 space-y-1">
          {brands.map(b => (
            <button
              key={b}
              onClick={() => onFilter('brand', b)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                activeBrand === b ? 'bg-electric font-semibold text-white shadow-lg shadow-electric/20' : 'text-slate-300 hover:bg-white/10 hover:text-cyan'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="font-mono text-xs font-semibold uppercase tracking-normal text-slate-500">Min RAM</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {RAM_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => onFilter('ram_gb', String(r))}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                filters.ram_gb === String(r) ? 'border-electric bg-electric text-white' : 'border-white/10 text-slate-300 hover:border-cyan/50 hover:text-cyan'
              }`}
            >
              {r}GB+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-mono text-xs font-semibold uppercase tracking-normal text-slate-500">Max Price</label>
        <input
          type="number"
          className="input mt-1"
          placeholder="e.g. 1500"
          value={filters.max_price}
          onChange={e => onMaxPriceChange(e.target.value)}
        />
      </div>
    </div>
  );
});

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  /* Skip skeleton on mount when cached data exists */
  const hasCache = products.length > 0;
  const [loading, setLoading] = useState(!hasCache);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(hasCache);
  const [brands, setBrands] = useState([]);
  const [showColdStartMsg, setShowColdStartMsg] = useState(false);
  const [filters, setFilters]   = useState({
    brand:     searchParams.get('brand') || '',
    ram_gb:    '',
    max_price: '',
    search:    '',
  });

  const fetchProducts = useCallback(async (signal) => {
    setLoading(true);
    try {
      const params = {};
      if (filters.brand)     params.brand     = filters.brand;
      if (filters.ram_gb)    params.ram_gb    = filters.ram_gb;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.search)    params.search    = filters.search;
      const res = await api.get('/products', { params, signal });
      const items = res.data.products ?? res.data;
      setProducts(current => {
        const currentIds = current.map(p => p.id).join(',');
        const nextIds = items.map(p => p.id).join(',');
        return currentIds === nextIds ? current : items;
      });
      /* Persist to sessionStorage so repeat navigation is instant */
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(items));
      } catch {
        /* storage full or unavailable — non-critical */
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') setProducts([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  useEffect(() => {
    api.get('/products/brands').then(r => setBrands(r.data.brands)).catch(() => {});
  }, []);

  const handleFilter = useCallback((key, val) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
  }, []);

  const updateFilter = useCallback((key, val) => {
    setFilters(prev => prev[key] === val ? prev : { ...prev, [key]: val });
  }, []);

  const updateSearch = useCallback((val) => updateFilter('search', val), [updateFilter]);
  const updateMaxPrice = useCallback((val) => updateFilter('max_price', val), [updateFilter]);

  const clearFilters = useCallback(() => {
    setFilters(prev => (
      prev.brand || prev.ram_gb || prev.max_price || prev.search ? EMPTY_FILTERS : prev
    ));
  }, []);

  const openFilters = useCallback(() => setFiltersOpen(true), []);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const hasProducts = products.length > 0;
  const initialLoading = loading && !hasProducts;

  /* ── Brand displayed in heading & active sidebar state — derived
        from the products array, NOT from `filters.brand` which
        updates before the fetch resolves. This keeps the heading,
        active filter badge, and product grid in perfect sync.      ── */
  const allSameBrand = hasProducts && products.every(p => p.brand === products[0].brand);
  const displayBrand = allSameBrand ? products[0].brand : '';

  /* ── Fade-in on first content reveal only ──
    Once contentLoaded flips to true it stays true forever.
    Removing the "if (loading) reset" guard ensures background
    refreshes and brand filter changes never trigger an opacity
    dip — only the initial skeleton→products transition fades in. */
  useEffect(() => {
    if (!loading && hasProducts && !contentLoaded) {
      const raf = requestAnimationFrame(() => setContentLoaded(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [loading, hasProducts]);

  /* ── Cold-start hint after 3 seconds ── */
  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => setShowColdStartMsg(true), 3000);
      return () => clearTimeout(t);
    }
    setShowColdStartMsg(false);
  }, [loading]);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8">

        {/* Sidebar Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterPanel
              brands={brands}
              filters={filters}
              activeBrand={displayBrand}
              onClear={clearFilters}
              onFilter={handleFilter}
              onSearchChange={updateSearch}
              onMaxPriceChange={updateMaxPrice}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openFilters}
                className="theme-toggle lg:hidden"
                aria-label="Open filters"
                title="Open filters"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M4 6h16M7 12h10M10 18h4" />
                </svg>
              </button>
              <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50">
              {displayBrand ? `${displayBrand} Laptops` : 'All Laptops'}
              </h1>
            </div>
            <span className="font-mono text-sm text-slate-500">
              {initialLoading ? '—' : `${products.length} product${products.length === 1 ? '' : 's'}`}
            </span>
          </div>

          <div className="min-h-[640px]" aria-busy={loading}>
            {initialLoading ? (
              <>
                <div className={GRID_CLASS}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>

                {/* Cold-start hint — appears only after 3+ seconds */}
                <div
                  className={`mt-6 text-center transition-opacity duration-500 ${
                    showColdStartMsg ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={!showColdStartMsg}
                >
                  <p className="text-sm text-slate-500">
                    Waking up the server… first load may take a moment.
                  </p>
                </div>
              </>
            ) : products.length === 0 ? (
              <div className="py-20 text-center transition-opacity duration-200">
                <p className="text-slate-400 text-lg">No products match your filters.</p>
                <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
              </div>
            ) : (
              <div
                className={`${GRID_CLASS} transition-all duration-300 ${
                  contentLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
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
          <FilterPanel
            brands={brands}
            filters={filters}
            activeBrand={displayBrand}
            onClear={clearFilters}
            onFilter={handleFilter}
            onSearchChange={updateSearch}
            onMaxPriceChange={updateMaxPrice}
            onClose={closeFilters}
          />
        </div>
      </div>
    </div>
  );
}
