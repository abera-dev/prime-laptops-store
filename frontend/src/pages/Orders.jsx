import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const statusColors = {
  Pending:    'badge border-amber-300/40 bg-amber-400/10 text-amber-200',
  Processing: 'badge border-cyan/40 bg-cyan/10 text-cyan',
  Shipped:    'badge border-electric/40 bg-electric/15 text-sky-200',
  Delivered:  'badge border-emerald-300/40 bg-emerald-400/10 text-emerald-200',
  Cancelled:  'badge border-rose-400/40 bg-rose-500/10 text-rose-200',
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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan"/></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-400 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div>
                <p className="font-mono font-bold text-slate-100">Order #{order.id}</p>
                <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={statusColors[order.status] || 'badge'}>
                  {order.status}
                </span>
                <p className="tech-price text-lg">${Number(order.total_price).toLocaleString()}</p>
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
