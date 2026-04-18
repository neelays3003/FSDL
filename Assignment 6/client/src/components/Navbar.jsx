import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(250,248,244,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 0 var(--border)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--charcoal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🗓️</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, color: 'var(--charcoal)', letterSpacing: '-0.02em',
          }}>AppointEase</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/services', label: 'Services' },
            { to: '/providers', label: 'Doctors' },
            ...(isAuth ? [{ to: '/appointments', label: 'My Bookings' }] : []),
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              textDecoration: 'none',
              padding: '7px 16px', borderRadius: 99,
              fontSize: 14, fontWeight: 500,
              color: isActive(to) ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive(to) ? 'rgba(200,75,49,0.08)' : 'transparent',
              transition: 'all var(--transition)',
            }}
              onMouseEnter={e => { if (!isActive(to)) e.target.style.background = 'rgba(26,26,46,0.05)'; e.target.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!isActive(to)) { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; } }}
            >{label}</Link>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAuth ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px 6px 8px', borderRadius: 99,
                background: 'var(--warm-white)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--charcoal)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
              <button onClick={handleLogout} style={{
                padding: '7px 16px', borderRadius: 99,
                border: '1px solid var(--border)',
                background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                transition: 'all var(--transition)',
              }}
                onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.color = '#fff'; e.target.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary)'; e.target.style.borderColor = 'var(--border)'; }}
              >Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={{
                textDecoration: 'none', padding: '8px 18px', borderRadius: 99,
                border: '1px solid var(--border)', background: 'transparent',
                fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
                transition: 'all var(--transition)',
              }}>Login</Link>
              <Link to="/register" style={{
                textDecoration: 'none', padding: '8px 18px', borderRadius: 99,
                background: 'var(--charcoal)', color: '#fff',
                fontSize: 13, fontWeight: 600,
                transition: 'all var(--transition)',
              }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
