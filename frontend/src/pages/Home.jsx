import { Link } from 'react-router-dom';

const brands = ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer'];

const features = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $500' },
  { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
  { icon: '↩️', title: '30-Day Returns', desc: 'Hassle-free return policy' },
  { icon: '🎧', title: '24/7 Support', desc: 'Expert tech assistance' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 py-20 text-white"
        style={{
          background:
            'radial-gradient(ellipse at 15% 12%, rgba(29,127,255,0.26), transparent 42%), radial-gradient(ellipse at 86% 48%, rgba(32,240,255,0.16), transparent 38%)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
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
      </section>

      {/* Brands */}
      <section className="border-y border-white/10 bg-white/[0.03] py-12 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-normal text-cyan mb-6">Featured Brands</p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map(brand => (
              <Link
                key={brand}
                to={`/products?brand=${brand}`}
                className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-display text-lg font-bold uppercase text-slate-200 transition-all hover:border-cyan/50 hover:bg-cyan/10 hover:text-cyan"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="card p-6 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display text-xl font-bold text-slate-50 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-white/[0.03] px-4 py-16 text-center">
        <h2 className="text-4xl font-bold uppercase text-slate-50 mb-3">Ready to Shop?</h2>
        <p className="text-slate-400 mb-6">Browse our full catalog of 18+ laptops across 6 top brands.</p>
        <Link to="/products" className="btn-primary text-base py-3 px-10">
          View All Laptops
        </Link>
      </section>
    </div>
  );
}
