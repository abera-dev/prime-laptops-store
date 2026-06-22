import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setL]     = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setL(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setL(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">💻</span>
          <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50 mt-2">Sign in to LaptopMall</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input type="email" required className="input" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input type="password" required className="input" placeholder="••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan font-semibold hover:underline">Create one</Link>
        </p>

        {/* Demo credentials hint */}
        <div className="mt-4 rounded-lg border border-cyan/20 bg-cyan/10 p-3 font-mono text-xs text-cyan">
          <strong>Demo:</strong> admin@laptopmall.com / admin123
        </div>
      </div>
    </div>
  );
}
