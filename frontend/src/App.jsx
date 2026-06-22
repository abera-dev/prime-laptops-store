import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Orders        from './pages/Orders';
import Login         from './pages/Login';
import Register      from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(13, 19, 32, 0.94)',
                border: '1px solid rgba(32, 240, 255, 0.18)',
                color: '#e2e8f0',
                boxShadow: '0 18px 50px rgba(0, 0, 0, 0.35)',
              },
            }}
          />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/products"     element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login"        element={<Login />} />
                <Route path="/register"     element={<Register />} />
                <Route path="/cart"         element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/orders"       element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/admin"        element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </main>
            <footer className="border-t border-white/10 bg-night/80 py-6 text-center font-mono text-xs text-slate-500 mt-auto backdrop-blur">
              © 2024 LaptopMall / All rights reserved.
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
