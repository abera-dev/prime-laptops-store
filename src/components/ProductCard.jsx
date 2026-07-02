import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user }      = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const BRAND_COLORS = {
    Dell:      'bg-blue-600',
    HP:        'bg-indigo-600',
    Apple:     'bg-gray-600',
    Lenovo:    'bg-red-600',
    ASUS:      'bg-purple-600',
    Acer:      'bg-green-600',
    Microsoft: 'bg-teal-600',
  };

  function brandBadgeColor(brand) {
    if (!brand) return 'bg-cyan-600';
    const b = brand.trim();
    if (BRAND_COLORS[b]) return BRAND_COLORS[b];
    const key = Object.keys(BRAND_COLORS).find(
      k => k.toLowerCase() === b.toLowerCase()
    );
    return key ? BRAND_COLORS[key] : 'bg-cyan-600';
  }

  const brandColor = brandBadgeColor(product.brand);
  const badgeText = product.brand || '—';
  const isNew = new Date() - new Date(product.created_at) < 28 * 24 * 60 * 60 * 1000;

  const stockLabel = product.stock === 0
    ? 'Out of Stock'
    : product.stock <= 5
      ? `Only ${product.stock} left!`
      : product.stock <= 10
        ? `${product.stock} left`
        : `${product.stock} in stock`;

  const stockColor = product.stock === 0
    ? 'text-red-400'
    : product.stock <= 5
      ? 'text-red-400'
      : product.stock <= 10
        ? 'text-orange-400'
        : 'text-gray-400';

  return (
    <div className="card group relative flex min-h-[382px] flex-col transition-all duration-200 hover:-translate-y-1 hover:border-cyan/35 hover:shadow-cyan/10">
      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative block h-48 overflow-hidden bg-white/[0.03]"
        aria-label={`View specifications for ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Laptop'; }}
        />
        <span className={`absolute top-2 left-2 rounded px-2 py-0.5 text-xs font-bold text-white ${brandColor}`}>
          {badgeText}
        </span>
        {isNew && (
          <span className="absolute top-2 right-2 rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
            NEW
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-rose-600 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-display text-xl font-bold leading-tight text-gray-900 dark:text-slate-50 hover:text-cyan transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-1 mb-3">
          {[
            { icon: '🔲', label: product.cpu.split(' ').slice(0, 3).join(' '), title: product.cpu },
            { icon: '💾', label: `${product.ram_gb}GB RAM`, title: `${product.ram_gb}GB RAM` },
            { icon: '💽', label: `${product.storage_gb} SSD`, title: `${product.storage_gb} SSD` },
            { icon: '🎮', label: product.gpu.split(' ').slice(-2).join(' '), title: product.gpu },
          ].map((spec, i) => (
            <span key={i} className="flex items-center gap-1 overflow-hidden text-gray-800 dark:text-gray-200 text-xs">
              <span className="shrink-0 text-gray-800 dark:text-gray-200">{spec.icon}</span>
              <span className="truncate max-w-[120px] text-gray-800 dark:text-gray-200" title={spec.title}>{spec.label}</span>
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-1">
          {product.review_count > 0 ? (
            <>
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-sm text-gray-600 dark:text-slate-300 font-medium">{Number(product.avg_rating).toFixed(1)}</span>
              <span className="text-xs text-gray-500 dark:text-slate-500">({product.review_count})</span>
            </>
          ) : (
            <span className="text-xs text-gray-500 dark:text-slate-600">No reviews</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="tech-price text-xl">${product.price.toLocaleString()}</span>
          <span className={`font-mono text-xs ${stockColor}`}>{stockLabel}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full mt-3 text-sm py-2 rounded-lg font-semibold transition-colors ${
            product.stock === 0
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-cyan/90 text-white hover:bg-cyan'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
