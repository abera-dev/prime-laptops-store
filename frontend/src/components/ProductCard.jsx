import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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

  const brandColors = {
    Dell: 'border-electric/40 bg-electric/15 text-cyan',
    HP: 'border-cyan/40 bg-cyan/10 text-cyan',
    Lenovo: 'border-rose-400/40 bg-rose-500/10 text-rose-200',
    Apple: 'border-slate-300/30 bg-white/10 text-slate-200',
    ASUS: 'border-amber-300/40 bg-amber-400/10 text-amber-200',
    Acer: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
  };

  return (
    <div className="card group flex min-h-[382px] flex-col transition-all duration-200 hover:-translate-y-1 hover:border-cyan/35 hover:shadow-cyan/10">
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
        <span className={`absolute top-2 left-2 badge ${brandColors[product.brand] || 'border-white/10 bg-white/10 text-slate-200'}`}>
          {product.brand}
        </span>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-rose-600 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-display text-xl font-bold leading-tight text-slate-50 hover:text-cyan transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-1 mb-3">
          {[
            { icon: '🔲', label: product.cpu.split(' ').slice(0, 3).join(' ') },
            { icon: '💾', label: `${product.ram_gb}GB RAM` },
            { icon: '💽', label: `${product.storage_gb} ${product.storage_unit || 'GB'}` },
            { icon: '🎮', label: product.gpu.split(' ').slice(-2).join(' ') },
          ].map((spec, i) => (
            <span key={i} className="tech-spec flex items-center gap-1">
              {spec.icon} {spec.label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="tech-price text-xl">${product.price.toLocaleString()}</span>
          <span className="font-mono text-xs text-slate-500">{product.stock > 0 ? `${product.stock} left` : 'Sold out'}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn-primary w-full mt-3 text-sm"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
