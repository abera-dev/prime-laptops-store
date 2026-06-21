import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id }            = useParams();
  const [product, setP]   = useState(null);
  const [loading, setL]   = useState(true);
  const [qty, setQty]     = useState(1);
  const { addToCart }     = useCart();
  const { user }          = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setP(r.data))
      .catch(() => setP(null))
      .finally(() => setL(false));
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    try {
      await addToCart(product.id, qty);
      toast.success('Added to cart!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error adding to cart');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>;
  if (!product) return <div className="text-center py-20"><p className="text-gray-400">Product not found.</p><Link to="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link></div>;

  const specs = [
    { label: 'Processor', value: product.cpu },
    { label: 'RAM', value: `${product.ram_gb} GB` },
    { label: 'Storage', value: `${product.storage_gb >= 1000 ? product.storage_gb/1000 + ' TB' : product.storage_gb + ' GB'}` },
    { label: 'Graphics', value: product.gpu },
    { label: 'Brand', value: product.brand },
    { label: 'In Stock', value: product.stock > 0 ? `${product.stock} units` : 'Out of stock' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/products" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Back to Shop</Link>

      <div className="card overflow-visible grid md:grid-cols-2 gap-0">
        <div className="bg-gray-50 p-8 flex items-center justify-center rounded-l-xl">
          <img src={product.image} alt={product.name} className="w-full max-w-sm object-contain rounded-lg"
            onError={e => e.target.src='https://via.placeholder.com/400x300?text=Laptop'} />
        </div>

        <div className="p-8">
          <span className="badge bg-blue-100 text-blue-700 mb-2">{product.brand}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-4 leading-tight">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-700 mb-6">${Number(product.price).toLocaleString()}</p>

          <div className="border-t border-gray-100 pt-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
            <dl className="space-y-2">
              {specs.map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <dt className="text-gray-500">{s.label}</dt>
                  <dd className="font-medium text-gray-900 text-right max-w-xs">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm text-gray-600">Qty:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-2 hover:bg-gray-100 font-bold">−</button>
                <span className="px-4 py-2 text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3 py-2 hover:bg-gray-100 font-bold">+</button>
              </div>
            </div>
          )}

          <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary w-full py-3 text-base">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
