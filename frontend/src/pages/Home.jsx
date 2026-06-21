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
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect Laptop
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Browse top brands including Dell, HP, Lenovo, Apple, ASUS, and Acer.
            Filter by specs, compare prices, and order with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="bg-white text-blue-700 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
              Shop Now
            </Link>
            <Link to="/register" className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-blue-700 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-6">Featured Brands</p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map(brand => (
              <Link
                key={brand}
                to={`/products?brand=${brand}`}
                className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="card p-6 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Shop?</h2>
        <p className="text-gray-500 mb-6">Browse our full catalog of 18+ laptops across 6 top brands.</p>
        <Link to="/products" className="btn-primary text-base py-3 px-10">
          View All Laptops →
        </Link>
      </section>
    </div>
  );
}
