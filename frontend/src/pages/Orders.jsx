import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const statusColors = {
  Pending:    'badge bg-yellow-100 text-yellow-700',
  Processing: 'badge bg-blue-100 text-blue-700',
  Shipped:    'badge bg-indigo-100 text-indigo-700',
  Delivered:  'badge bg-green-100 text-green-700',
  Cancelled:  'badge bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setL]     = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(r => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setL(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="font-bold text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={statusColors[order.status] || 'badge bg-gray-100 text-gray-600'}>
                  {order.status}
                </span>
                <p className="font-bold text-blue-700 text-lg">${Number(order.total_price).toLocaleString()}</p>
                <Link to={`/orders/${order.id}`} className="btn-secondary text-sm py-1.5 px-3">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
