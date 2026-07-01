import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from '../utils/toast';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setL]       = useState(false);
  const [formError, setFormErr] = useState('');
  const [fieldErr, setFieldErr] = useState({ name: '', email: '', password: '', confirm: '' });
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const update = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (fieldErr[key]) setFieldErr(p => ({ ...p, [key]: '' }));
    if (formError) setFormErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');
    setFieldErr({ name: '', email: '', password: '', confirm: '' });

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setFieldErr(p => ({ ...p, email: 'Please enter a valid email address' }));
      return;
    }
    if (form.password.length < 6) {
      setFieldErr(p => ({ ...p, password: 'Password must be at least 6 characters' }));
      return;
    }
    if (form.password !== form.confirm) {
      setFieldErr(p => ({ ...p, confirm: 'Passwords do not match' }));
      return;
    }

    setL(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome!');
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setFormErr('Unable to connect. Please check your connection.');
      } else if (err.response.status === 409) {
        setFieldErr(p => ({ ...p, email: 'An account with this email already exists.' }));
      } else if (err.response.status === 429) {
        setFormErr('Too many attempts. Please wait a few minutes.');
      } else if (err.response?.data?.errors?.length) {
        const serverErr = err.response.data.errors[0];
        if (serverErr.param === 'email') setFieldErr(p => ({ ...p, email: serverErr.msg }));
        else if (serverErr.param === 'password') setFieldErr(p => ({ ...p, password: serverErr.msg }));
        else if (serverErr.param === 'name') setFieldErr(p => ({ ...p, name: serverErr.msg }));
        else setFormErr(serverErr.msg);
      } else {
        setFormErr(err.response?.data?.message || 'Registration failed');
      }
    } finally { setL(false); }
  };

  const cls = (key) => `input ${fieldErr[key] ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`;

  const field = (key, label, type = 'text', placeholder = '', attrs = {}) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <input type={type} required className={cls(key)} placeholder={placeholder}
        value={form[key]} onChange={e => update(key, e.target.value)} {...attrs} />
      {fieldErr[key] && <p className="text-rose-400 text-xs mt-1">{fieldErr[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">💻</span>
          <h1 className="font-display text-4xl font-extrabold uppercase text-slate-50 mt-2">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Join PrimeLaptops today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('name', 'Full Name', 'text', 'Abera Hagazi')}
          {field('email', 'Email', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', '••••••')}
          {field('confirm', 'Confirm Password', 'password', '••••••')}

          {formError && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-4 py-3">
              <p className="text-rose-300 text-sm font-medium">{formError}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
