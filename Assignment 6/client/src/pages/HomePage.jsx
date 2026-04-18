import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getServices } from '../utils/api';

export default function HomePage() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
  }, []);

  const stats = [
    { value: '500+', label: 'Appointments Booked' },
    { value: '50+', label: 'Expert Doctors' },
    { value: '6', label: 'Specializations' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--charcoal)',
        padding: '80px 0 100px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[
          { size: 400, top: -100, right: -80, opacity: 0.06 },
          { size: 250, top: 60, right: 200, opacity: 0.04 },
          { size: 180, bottom: -60, left: 100, opacity: 0.05 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            width: c.size, height: c.size,
            top: c.top, right: c.right, bottom: c.bottom, left: c.left,
            background: 'white', opacity: c.opacity,
            pointerEvents: 'none',
          }} />
        ))}

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 99,
              background: 'rgba(244,162,97,0.15)', marginBottom: 28,
            }}>
              <span style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 500 }}>
                ✦ Healthcare made simple
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(42px, 6vw, 72px)',
              color: '#fff', lineHeight: 1.1,
              marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              Book Your <br />
              <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Perfect</span> Appointment
            </h1>
            <p style={{
              fontSize: 18, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7, marginBottom: 40, maxWidth: 520,
            }}>
              Connect with top healthcare professionals and schedule appointments in seconds — no waiting, no hassle.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/services" style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 99,
                background: 'var(--accent)', color: '#fff',
                fontWeight: 600, fontSize: 15,
                boxShadow: '0 8px 24px rgba(200,75,49,0.4)',
                transition: 'all var(--transition)',
              }}>
                Book Now →
              </Link>
              <Link to="/providers" style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 99,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontWeight: 500, fontSize: 15,
              }}>
                Meet Our Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--warm-white)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0, borderLeft: '1px solid var(--border)',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                padding: '32px 28px',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                borderTop: '1px solid var(--border)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 36, color: 'var(--charcoal)', marginBottom: 4,
                }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40, color: 'var(--charcoal)', marginBottom: 14,
              letterSpacing: '-0.02em',
            }}>Our Specializations</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              From routine check-ups to specialized consultations — we've got you covered.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {services.slice(0, 6).map((svc, i) => (
              <ServiceCard key={svc._id} service={svc} delay={i * 60} navigate={navigate} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/services" style={{
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 99,
              border: '1.5px solid var(--border-strong)',
              color: 'var(--text-primary)', fontWeight: 500, fontSize: 14,
              transition: 'all var(--transition)',
            }}>View All Services →</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--warm-white)', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40, color: 'var(--charcoal)', marginBottom: 14,
              letterSpacing: '-0.02em',
            }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
            {[
              { step: '01', icon: '🔍', title: 'Choose a Service', desc: 'Browse our range of medical specializations and select the one you need.' },
              { step: '02', icon: '👨‍⚕️', title: 'Pick a Doctor', desc: 'View profiles, ratings and select a doctor that suits your needs.' },
              { step: '03', icon: '✅', title: 'Confirm Booking', desc: 'Choose your preferred date & time slot and receive instant confirmation.' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: 'var(--cream)', border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, margin: '0 auto 20px',
                  boxShadow: 'var(--shadow-sm)',
                }}>{step.icon}</div>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase',
                }}>Step {step.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: 'var(--charcoal)' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 0',
        textAlign: 'center',
        color: 'var(--text-muted)', fontSize: 13,
      }}>
        <div className="container">
          © 2024 AppointEase — Healthcare Appointments Made Easy
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ service, delay, navigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/providers?serviceId=${service._id}`)}
      style={{
        background: hovered ? 'var(--warm-white)' : '#fff',
        border: `1.5px solid ${hovered ? service.color : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 28,
        cursor: 'pointer',
        transition: 'all var(--transition)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 12px 32px ${service.color}22` : 'var(--shadow-sm)',
        animation: `fadeIn 0.5s ease ${delay}ms both`,
      }}
    >
      <div style={{
        width: 54, height: 54, borderRadius: 14,
        background: `${service.color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, marginBottom: 16,
        transition: 'all var(--transition)',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>{service.icon}</div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: service.color, marginBottom: 6, textTransform: 'uppercase' }}>
        {service.category}
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 8 }}>{service.name}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{service.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>⏱ {service.duration} min</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: service.color }}>₹{service.price}</span>
      </div>
    </div>
  );
}
