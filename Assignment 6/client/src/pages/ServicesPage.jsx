import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices } from '../utils/api';

const categories = ['All', 'Medical', 'Dental', 'Therapy', 'Ophthalmology', 'Dermatology', 'Psychiatry'];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getServices().then(data => {
      setServices(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFiltered(activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory));
  }, [activeCategory, services]);

  return (
    <div style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>
            What we offer
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--charcoal)', letterSpacing: '-0.02em', marginBottom: 16 }}>
            Our Services
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>
            Choose from a wide range of medical specializations. Our experts are ready to help you.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 20px', borderRadius: 99, cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              transition: 'all var(--transition)',
              border: activeCategory === cat ? 'none' : '1.5px solid var(--border)',
              background: activeCategory === cat ? 'var(--charcoal)' : 'transparent',
              color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map((svc, i) => (
              <ServiceCard key={svc._id} service={svc} delay={i * 50} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ service, delay, navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hovered ? service.color : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', padding: 28, cursor: 'pointer',
        transition: 'all var(--transition)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 12px 32px ${service.color}22` : 'var(--shadow-sm)',
        animation: `fadeIn 0.5s ease ${delay}ms both`,
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `${service.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 18,
        transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'none',
        transition: 'transform var(--transition)',
      }}>{service.icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: service.color, marginBottom: 6, textTransform: 'uppercase' }}>
        {service.category}
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>{service.name}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>{service.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {service.duration} min</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: service.color }}>₹{service.price}</span>
        </div>
      </div>
      <button
        onClick={() => navigate(`/providers?serviceId=${service._id}`)}
        style={{
          width: '100%', padding: '10px', borderRadius: 10, cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          border: `1.5px solid ${service.color}`,
          background: hovered ? service.color : 'transparent',
          color: hovered ? '#fff' : service.color,
          transition: 'all var(--transition)',
        }}
      >
        Find Doctors →
      </button>
    </div>
  );
}
