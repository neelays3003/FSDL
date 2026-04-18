import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await loginUser(form);
      login(token, user);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your appointments">
      <form onSubmit={handleSubmit}>
        <FormField label="Email Address" type="email" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="you@example.com" required />
        <FormField label="Password" type="password" value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          placeholder="••••••••" required />
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 12, cursor: loading ? 'wait' : 'pointer',
          background: loading ? 'var(--text-muted)' : 'var(--charcoal)',
          color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
          marginTop: 8, transition: 'all var(--transition)',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(26,26,46,0.2)',
        }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px',
      background: 'radial-gradient(ellipse at top, rgba(26,26,46,0.04) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, animation: 'scaleIn 0.35s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🗓️</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--charcoal)' }}>AppointEase</span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: 'var(--charcoal)', marginBottom: 8, letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{subtitle}</p>
        </div>
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border)', padding: '36px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function FormField({ label, type, value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 7 }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
          border: `1.5px solid ${focused ? 'var(--charcoal)' : 'var(--border)'}`,
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)',
          background: '#fff', transition: 'border-color var(--transition)', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
