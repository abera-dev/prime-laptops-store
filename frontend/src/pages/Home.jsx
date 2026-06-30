import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="relative bg-[#070b14] h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#2563eb] rounded-full blur-[80px] opacity-20" />
        <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-[#22d3ee] rounded-full blur-[80px] opacity-[0.18]" />
        <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-[#2563eb] rounded-full blur-[80px] opacity-15" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
        <div className="max-w-4xl">
          <h1 className="mb-4 font-display text-6xl font-extrabold uppercase leading-none sm:text-7xl">
            Find Your Perfect Laptop
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Browse top brands including Dell, HP, Lenovo, Apple, ASUS, and Acer.
            Filter by specs, compare prices, and order with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="btn-primary py-3 px-8">
              Shop Now
            </Link>
            <Link to="/register" className="btn-secondary py-3 px-8">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
