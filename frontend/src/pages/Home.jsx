import { Link } from 'react-router-dom';
import heroDark  from '../assets/background_image.png';
import heroLight from '../assets/background_light.png';

export default function Home({ isLight }) {
  return (
    <div className="relative h-full w-full overflow-hidden">

      {/* ── Dark background ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url(${heroDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'opacity 280ms ease',
          opacity: isLight ? 0 : 1,
        }}
        className="absolute inset-0"
      />

      {/* ── Light background ────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url(${heroLight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'opacity 280ms ease',
          opacity: isLight ? 1 : 0,
        }}
        className="absolute inset-0"
      />

      {/* ── Dark overlay — gradient, heavier left for text ──── */}
      <div
        aria-hidden="true"
        style={{
          background: isLight
            ? 'linear-gradient(to right, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.04) 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.30) 100%)',
          transition: 'background 280ms ease',
        }}
        className="absolute inset-0"
      />

      {/* ── Top accent line ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: isLight
            ? 'linear-gradient(to right, transparent, rgba(37,99,235,0.45), transparent)'
            : 'linear-gradient(to right, transparent, rgba(34,211,238,0.55), transparent)',
          transition: 'background 280ms ease',
        }}
      />

      {/* ── Hero content ────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <h1
            className="mb-4 font-display text-6xl font-extrabold uppercase leading-none sm:text-7xl drop-shadow-lg"
            style={{
              color: isLight ? '#0f172a' : '#ffffff',
              transition: 'color 280ms ease',
            }}
          >
            Find Your Perfect Laptop
          </h1>

          <p
            className="text-lg mb-8 max-w-2xl mx-auto drop-shadow"
            style={{
              color: isLight ? '#1e3a5f' : '#cbd5e1',
              transition: 'color 280ms ease',
            }}
          >
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
