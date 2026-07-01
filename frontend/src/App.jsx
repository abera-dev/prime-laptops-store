import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import logo from './assets/Screenshot From 2026-06-30 13-30-57.png';

import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Orders        from './pages/Orders';
import Login         from './pages/Login';
import Register      from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night/80 py-4 backdrop-blur flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="Prime Laptops" className="w-32 sm:w-36 h-auto object-contain" />
        </Link>
        <p className="font-mono text-xs text-slate-500">
          © 2026 PrimeLaptops. All rights reserved.
        </p>
        <p className="font-mono text-xs text-slate-500">
          Designed &amp; Developed by Abera Hagazi
        </p>
      </div>
    </footer>
  );
}

/**
 * Single persistent shell — Navbar and Footer are NEVER unmounted during
 * route changes. This eliminates the flash caused by the two-layout split.
 *
 * Home: h-screen + overflow-hidden (no scroll, footer pinned).
 * All other routes: min-h-screen, scrollable normally.
 */
function AppLayout({ theme, isLight, toggleTheme }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={isHome ? 'h-screen flex flex-col overflow-hidden' : 'min-h-screen flex flex-col'}>
      <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className={isHome ? 'flex-1 overflow-hidden' : 'flex-1'}>
        <Routes>
          <Route path="/"               element={<Home isLight={isLight} />} />
          <Route path="/products"       element={<Products />} />
          <Route path="/products/:id"   element={<ProductDetail />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/cart"           element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders"         element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings theme={theme} onToggleTheme={toggleTheme} /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
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
          <AppLayout theme={theme} isLight={isLight} toggleTheme={toggleTheme} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
