import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProviders, getServices } from '../utils/api';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const serviceId = searchParams.get('serviceId');

  useEffect(() => {
    Promise.all([getProviders(serviceId), getServices()]).then(([p, s]) => {
      setProviders(p); setServices(s); setLoading(false);
    });
  }, [serviceId]);

  const filtered = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const activeService = services.find(s => s._id === serviceId);

  return (
    <div style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
            {activeService ? `For ${activeService.name}` : 'All Specialists'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--charcoal)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Our Doctors
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480 }}>
            Experienced professionals committed to your wellbeing.
          </p>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text" placeholder="Search doctors..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 18px', borderRadius: 10, border: '1.5px solid var(--border)',
              fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
              background: '#fff', color: 'var(--text-primary)', minWidth: 220,
              transition: 'border-color var(--transition)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--charcoal)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {serviceId && (
            <button onClick={() => setSearchParams({})} style={{
              padding: '10px 18px', borderRadius: 10,
              border: '1.5px solid var(--accent)',
              background: 'rgba(200,75,49,0.08)', color: 'var(--accent)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {activeService?.icon} {activeService?.name} ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 240, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map((provider, i) => (
              <ProviderCard key={provider._id} provider={provider} delay={i * 50} navigate={navigate} />
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p>No doctors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProviderCard({ provider, delay, navigate }) {
  const [hovered, setHovered] = useState(false);
  const stars = '★'.repeat(Math.round(provider.rating)) + '☆'.repeat(5 - Math.round(provider.rating));

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        border: `1.5px solid ${hovered ? 'var(--charcoal)' : 'var(--border)'}`,
        padding: 28, cursor: 'pointer',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transition: 'all var(--transition)',
        animation: `fadeIn 0.5s ease ${delay}ms both`,
      }}
    >
      <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'var(--charcoal)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, flexShrink: 0,
          fontFamily: 'var(--font-display)',
        }}>{provider.avatar}</div>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>{provider.name}</h3>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{provider.specialization}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#f59e0b', fontSize: 12, letterSpacing: 1 }}>{stars}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{provider.rating}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({provider.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 18 }}>
        {provider.bio}
      </p>

      {provider.services?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {provider.services.map(s => (
            <span key={s._id} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 99,
              background: `${s.color || '#6366f1'}15`, color: s.color || '#6366f1',
              fontWeight: 600,
            }}>{s.name}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate(`/book/${provider._id}`)}
        style={{
          width: '100%', padding: '11px', borderRadius: 10, cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          border: 'none',
          background: hovered ? 'var(--charcoal)' : 'var(--cream)',
          color: hovered ? '#fff' : 'var(--charcoal)',
          transition: 'all var(--transition)',
        }}
      >
        Book Appointment →
      </button>
    </div>
  );
}
