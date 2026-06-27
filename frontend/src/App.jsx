import { useEffect, useState } from 'react';
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
import AdminSettings from './pages/AdminSettings';

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const nextTheme = theme === 'light' ? 'light' : 'dark';
    const themeColor = nextTheme === 'light' ? '#f5f8ff' : '#07090f';
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    if (themeMeta) themeMeta.setAttribute('content', themeColor);
    window.localStorage.setItem('theme', nextTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  };

  const isLight = theme === 'light';

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(13, 19, 32, 0.94)',
                border: isLight ? '1px solid rgba(29, 127, 255, 0.18)' : '1px solid rgba(32, 240, 255, 0.18)',
                color: isLight ? '#0f172a' : '#e2e8f0',
                boxShadow: isLight ? '0 18px 50px rgba(15, 23, 42, 0.16)' : '0 18px 50px rgba(0, 0, 0, 0.35)',
              },
            }}
          />
          <div className="min-h-screen flex flex-col">
            <Navbar theme={theme} onToggleTheme={toggleTheme} />
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
                <Route path="/admin/settings" element={<AdminRoute><AdminSettings theme={theme} onToggleTheme={toggleTheme} /></AdminRoute>} />
              </Routes>
            </main>
            <footer className="border-t border-white/10 bg-night/80 py-6 text-center font-mono text-xs text-slate-500 mt-auto backdrop-blur">
              © 2026 Prime laptops  All rights reserved.
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
