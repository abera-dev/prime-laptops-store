import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';

export default function ProductDetail() {
  const { id }            = useParams();
  const [product, setP]   = useState(null);
  const [loading, setL]   = useState(true);
  const [qty, setQty]     = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan"/></div>;
  if (!product) return <div className="text-center py-20"><p className="text-slate-400">Product not found.</p><Link to="/products" className="btn-primary mt-4 inline-block">Back to Shop</Link></div>;

  const images = [product.image, product.image2, product.image3].filter(Boolean);

  const specs = [
    { label: 'Processor', value: product.cpu },
    { label: 'RAM', value: `${product.ram_gb} GB` },
    { label: 'Storage', value: `${product.storage_gb} ${product.storage_unit || 'GB'}` },
    { label: 'Graphics', value: product.gpu },
    { label: 'Screen Size', value: `${product.size_inches} inches` },
    { label: 'Brand', value: product.brand },
    { label: 'In Stock', value: product.stock > 0 ? `${product.stock} units` : 'Out of stock' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/products" className="text-sm text-cyan hover:underline mb-6 inline-block">Back to Shop</Link>

      <div className="card overflow-visible grid md:grid-cols-2 gap-0">
        <div className="bg-white/[0.03] p-8 flex flex-col items-center justify-center rounded-l-lg">
          <img src={images[selectedImg]} alt={product.name} className="w-full max-w-sm object-contain rounded-lg"
            onError={e => e.target.src='https://via.placeholder.com/400x300?text=Laptop'} />
          {images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-16 h-12 rounded overflow-hidden border-2 transition-colors ${selectedImg === i ? 'border-cyan' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover"
                    onError={e => e.target.src='https://via.placeholder.com/64x48?text=Img'} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-8">
          <span className="badge mb-2">{product.brand}</span>
          <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50 mt-2 mb-4 leading-none">{product.name}</h1>
          <p className="tech-price text-3xl mb-6">${Number(product.price).toLocaleString()}</p>

          <div className="border-t border-white/10 pt-4 mb-6">
            <h3 className="font-display text-2xl font-bold text-slate-50 mb-3">Specifications</h3>
            <dl className="space-y-2">
              {specs.map(s => (
                <div key={s.label} className="flex justify-between text-sm">
                  <dt className="text-slate-500">{s.label}</dt>
                  <dd className="font-mono font-medium text-slate-200 text-right max-w-xs">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm text-slate-400">Qty:</label>
              <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-2 hover:bg-white/10 font-bold">-</button>
                <span className="px-4 py-2 text-sm font-mono font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3 py-2 hover:bg-white/10 font-bold">+</button>
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
