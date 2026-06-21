import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
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
    Dell: 'bg-blue-100 text-blue-700',
    HP: 'bg-indigo-100 text-indigo-700',
    Lenovo: 'bg-red-100 text-red-700',
    Apple: 'bg-gray-100 text-gray-700',
    ASUS: 'bg-yellow-100 text-yellow-700',
    Acer: 'bg-green-100 text-green-700',
  };

  return (
    <div className="card group hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Laptop'; }}
        />
        <span className={`absolute top-2 left-2 badge ${brandColors[product.brand] || 'bg-gray-100 text-gray-700'}`}>
          {product.brand}
        </span>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-1 mb-3">
          {[
            { icon: '🔲', label: product.cpu.split(' ').slice(0, 3).join(' ') },
            { icon: '💾', label: `${product.ram_gb}GB RAM` },
            { icon: '💽', label: `${product.storage_gb >= 1000 ? product.storage_gb/1000 + 'TB' : product.storage_gb + 'GB'}` },
            { icon: '🎮', label: product.gpu.split(' ').slice(-2).join(' ') },
          ].map((spec, i) => (
            <span key={i} className="text-xs text-gray-500 flex items-center gap-1">
              {spec.icon} {spec.label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-700">${product.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400">{product.stock > 0 ? `${product.stock} left` : 'Sold out'}</span>
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
