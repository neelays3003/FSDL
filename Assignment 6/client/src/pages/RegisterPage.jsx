import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { AuthLayout, FormField } from './LoginPage';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(token, user);
      toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <AuthLayout title="Create account" subtitle="Join AppointEase and book with ease">
      <form onSubmit={handleSubmit}>
        <FormField label="Full Name" type="text" value={form.name} onChange={set('name')} placeholder="Dr. Priya Sharma" required />
        <FormField label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
        <FormField label="Phone Number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
        <FormField label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Minimum 8 characters" required />
        <FormField label="Confirm Password" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Repeat password" required />

        {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
          <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12, marginTop: -10 }}>Passwords don't match</p>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 12, cursor: loading ? 'wait' : 'pointer',
          background: loading ? 'var(--text-muted)' : 'var(--charcoal)',
          color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
          marginTop: 8, transition: 'all var(--transition)',
          boxShadow: loading ? 'none' : '0 4px 16px rgba(26,26,46,0.2)',
        }}>
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
