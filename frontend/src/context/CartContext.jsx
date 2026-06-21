import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch { setCart([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product_id, quantity = 1) => {
    await api.post('/cart/add', { product_id, quantity });
    await fetchCart();
  };

  const updateItem = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart([]);
  };

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const total     = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, total, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
