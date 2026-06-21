import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await api.post('/orders/checkout');
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>;

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some laptops to get started!</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({cart.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="card p-4 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                onError={e => e.target.src='https://via.placeholder.com/100x80?text=Laptop'} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{item.brand}</p>
                <p className="text-blue-700 font-bold mt-1">${Number(item.price).toLocaleString()}</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                  className="px-2.5 py-1.5 hover:bg-gray-100 text-sm font-bold disabled:opacity-40">−</button>
                <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => updateItem(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}
                  className="px-2.5 py-1.5 hover:bg-gray-100 text-sm font-bold disabled:opacity-40">+</button>
              </div>
              <p className="font-bold text-gray-800 w-20 text-right">${(item.price * item.quantity).toLocaleString()}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 ml-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span className="truncate mr-2">{item.name.split(' ').slice(0,3).join(' ')} ×{item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 mb-5">
            <div className="flex justify-between font-bold text-gray-900 text-lg">
              <span>Total</span>
              <span className="text-blue-700">${total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full py-3 text-base mb-2">
            Place Order →
          </button>
          <Link to="/products" className="btn-secondary w-full py-2 text-sm text-center block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
