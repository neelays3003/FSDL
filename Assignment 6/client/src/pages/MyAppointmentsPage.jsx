import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyAppointments, cancelAppointment } from '../utils/api';
import { format, isPast, parseISO } from 'date-fns';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: '#fff8e1', color: '#f59e0b', dot: '#f59e0b' },
  confirmed: { label: 'Confirmed', bg: '#e8f5e9', color: '#22c55e', dot: '#22c55e' },
  cancelled: { label: 'Cancelled', bg: '#fce4e4', color: '#ef4444', dot: '#ef4444' },
  completed: { label: 'Completed', bg: '#e3f2fd', color: '#3b82f6', dot: '#3b82f6' },
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyAppointments().then(data => { setAppointments(data); setLoading(false); });
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setCancelling(id);
    try {
      await cancelAppointment(id);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
  const counts = appointments.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {});

  return (
    <div style={{ minHeight: '100vh', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12 }}>Your schedule</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, color: 'var(--charcoal)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            My Appointments
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track all your medical appointments.</p>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 36 }}>
          {[
            { key: 'all', label: 'Total', count: appointments.length, color: 'var(--charcoal)' },
            { key: 'pending', label: 'Pending', count: counts.pending || 0, color: '#f59e0b' },
            { key: 'confirmed', label: 'Confirmed', count: counts.confirmed || 0, color: '#22c55e' },
            { key: 'cancelled', label: 'Cancelled', count: counts.cancelled || 0, color: '#ef4444' },
          ].map(({ key, label, count, color }) => (
            <div key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '16px 18px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                border: `2px solid ${filter === key ? color : 'var(--border)'}`,
                background: filter === key ? `${color}10` : '#fff',
                transition: 'all var(--transition)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color, marginBottom: 2 }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 16 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: '#fff', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 10 }}>No appointments found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
              {filter === 'all' ? "You haven't booked any appointments yet." : `No ${filter} appointments.`}
            </p>
            <button onClick={() => navigate('/services')} style={{
              padding: '12px 28px', borderRadius: 99, cursor: 'pointer',
              background: 'var(--charcoal)', color: '#fff', border: 'none',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            }}>Book an Appointment</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {filtered.map((appt, i) => (
              <AppointmentCard key={appt._id} appt={appt} onCancel={handleCancel} cancelling={cancelling} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ appt, onCancel, cancelling, delay }) {
  const cfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
  const apptDate = new Date(appt.date);
  const isUpcoming = !isPast(apptDate) && appt.status !== 'cancelled';

  return (
    <div style={{
      background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)',
      padding: 24, display: 'flex', gap: 20, alignItems: 'flex-start',
      animation: `fadeIn 0.5s ease ${delay}ms both`,
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: `${appt.service?.color || '#6366f1'}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
      }}>{appt.service?.icon || '🗓️'}</div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 2 }}>
              {appt.service?.name}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              with <strong>{appt.provider?.name}</strong> · {appt.provider?.specialization}
            </p>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
            background: cfg.bg, color: cfg.color, flexShrink: 0,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
            {cfg.label}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            📅 {format(apptDate, 'EEE, MMM d, yyyy')}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            🕐 {appt.timeSlot}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
            ⏱ {appt.service?.duration} min
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: appt.service?.color || 'var(--charcoal)' }}>
            ₹{appt.totalPrice}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Code: <strong style={{ color: 'var(--charcoal)', fontFamily: 'monospace' }}>{appt.confirmationCode}</strong>
          </span>
          {isUpcoming && (
            <button onClick={() => onCancel(appt._id)} disabled={cancelling === appt._id} style={{
              padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid #fca5a5', background: 'transparent',
              color: '#ef4444', fontSize: 12, fontWeight: 500,
              fontFamily: 'var(--font-body)',
              transition: 'all var(--transition)',
              opacity: cancelling === appt._id ? 0.6 : 1,
            }}>
              {cancelling === appt._id ? 'Cancelling...' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
