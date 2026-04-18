import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProvider, getProviderSlots, bookAppointment } from '../utils/api';
import { format, addDays, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

const STEPS = ['Service', 'Date & Time', 'Confirm'];

export default function BookingPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const today = startOfDay(new Date());
  const calDays = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  useEffect(() => {
    getProvider(providerId).then(p => { setProvider(p); setLoading(false); });
  }, [providerId]);

  useEffect(() => {
    if (selectedDate && providerId) {
      setSlotsLoading(true);
      getProviderSlots(providerId, format(selectedDate, 'yyyy-MM-dd'))
        .then(data => { setSlots(data.slots || []); setSlotsLoading(false); });
    }
  }, [selectedDate, providerId]);

  const handleBook = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) return;
    setBooking(true);
    try {
      const result = await bookAppointment({
        provider: providerId,
        service: selectedService._id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedSlot,
        notes,
        totalPrice: selectedService.price,
      });
      setConfirmed(result);
      toast.success('Appointment booked successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (confirmed) return <ConfirmationScreen appointment={confirmed} navigate={navigate} />;

  return (
    <div style={{ minHeight: '100vh', padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20, padding: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>← Back</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, background: 'var(--charcoal)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
            }}>{provider?.avatar}</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--charcoal)', letterSpacing: '-0.02em' }}>
                {provider?.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{provider?.specialization}</p>
            </div>
          </div>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i <= step ? 'var(--charcoal)' : 'var(--border)',
                    color: i <= step ? '#fff' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, transition: 'all var(--transition)',
                  }}>{i < step ? '✓' : i + 1}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: i === step ? 'var(--charcoal)' : 'var(--text-muted)' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: i < step ? 'var(--charcoal)' : 'var(--border)', margin: '0 12px', transition: 'all var(--transition)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 0: Service */}
        {step === 0 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 24, color: 'var(--charcoal)' }}>
              Select a Service
            </h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {provider?.services?.map(svc => (
                <div key={svc._id}
                  onClick={() => setSelectedService(svc)}
                  style={{
                    padding: 20, borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `2px solid ${selectedService?._id === svc._id ? svc.color : 'var(--border)'}`,
                    background: selectedService?._id === svc._id ? `${svc.color}08` : '#fff',
                    display: 'flex', alignItems: 'center', gap: 18,
                    transition: 'all var(--transition)',
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: `${svc.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
                  }}>{svc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>{svc.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{svc.description}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: svc.color, fontSize: 18 }}>₹{svc.price}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{svc.duration} min</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!selectedService}
              style={{
                marginTop: 28, padding: '13px 32px', borderRadius: 10, cursor: selectedService ? 'pointer' : 'not-allowed',
                background: selectedService ? 'var(--charcoal)' : 'var(--border)',
                color: selectedService ? '#fff' : 'var(--text-muted)',
                border: 'none', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                transition: 'all var(--transition)',
              }}
            >Continue →</button>
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 24, color: 'var(--charcoal)' }}>
              Choose Date & Time
            </h2>

            {/* Calendar strip */}
            <div style={{ overflowX: 'auto', marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 10, paddingBottom: 8, minWidth: 'max-content' }}>
                {calDays.map(day => {
                  const isPast = isBefore(day, today) && !isSameDay(day, today);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayName = format(day, 'EEE');
                  const dayNum = format(day, 'd');
                  const month = format(day, 'MMM');
                  return (
                    <button key={day.toISOString()}
                      onClick={() => { if (!isPast) { setSelectedDate(day); setSelectedSlot(null); } }}
                      disabled={isPast}
                      style={{
                        width: 64, padding: '12px 8px', borderRadius: 14, cursor: isPast ? 'not-allowed' : 'pointer',
                        border: `2px solid ${isSelected ? 'var(--charcoal)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--charcoal)' : '#fff',
                        color: isPast ? 'var(--text-muted)' : isSelected ? '#fff' : 'var(--text-primary)',
                        textAlign: 'center', transition: 'all var(--transition)',
                        opacity: isPast ? 0.4 : 1,
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, opacity: 0.7 }}>{dayName}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{dayNum}</div>
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>{month}</div>
                      {isToday(day) && <div style={{ width: 5, height: 5, borderRadius: '50%', background: isSelected ? '#fff' : 'var(--accent)', margin: '4px auto 0' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate ? (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 16 }}>
                  Available slots for {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                {slotsLoading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
                    {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 40, borderRadius: 8 }} />)}
                  </div>
                ) : slots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>😔</div>
                    <p>No slots available for this day. Try another date.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
                    {slots.map(slot => (
                      <button key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '10px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                          border: `2px solid ${selectedSlot === slot ? 'var(--charcoal)' : 'var(--border)'}`,
                          background: selectedSlot === slot ? 'var(--charcoal)' : '#fff',
                          color: selectedSlot === slot ? '#fff' : 'var(--text-primary)',
                          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                          transition: 'all var(--transition)',
                        }}
                      >{slot}</button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                <p>Select a date to see available time slots.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(0)} style={{
                padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                border: '1.5px solid var(--border)', background: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
              }}>← Back</button>
              <button onClick={() => setStep(2)} disabled={!selectedDate || !selectedSlot} style={{
                padding: '12px 28px', borderRadius: 10,
                cursor: selectedDate && selectedSlot ? 'pointer' : 'not-allowed',
                background: selectedDate && selectedSlot ? 'var(--charcoal)' : 'var(--border)',
                color: selectedDate && selectedSlot ? '#fff' : 'var(--text-muted)',
                border: 'none', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                transition: 'all var(--transition)',
              }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 24, color: 'var(--charcoal)' }}>
              Confirm Appointment
            </h2>

            <div style={{
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)',
              overflow: 'hidden', marginBottom: 24,
            }}>
              {/* Summary rows */}
              {[
                { label: 'Doctor', value: provider?.name },
                { label: 'Specialization', value: provider?.specialization },
                { label: 'Service', value: `${selectedService?.icon} ${selectedService?.name}` },
                { label: 'Duration', value: `${selectedService?.duration} minutes` },
                { label: 'Date', value: format(selectedDate, 'EEEE, MMMM d, yyyy') },
                { label: 'Time', value: selectedSlot },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 24px',
                  borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'var(--cream)',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontSize: 14, color: 'var(--charcoal)', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ padding: '16px 24px', background: 'var(--charcoal)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Total Amount</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: 'var(--font-display)' }}>₹{selectedService?.price}</span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                Additional Notes (optional)
              </label>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Share any symptoms or special requests..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
                  fontSize: 14, color: 'var(--text-primary)', outline: 'none', resize: 'vertical',
                  background: '#fff', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--charcoal)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{
                padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                border: '1.5px solid var(--border)', background: 'transparent',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
              }}>← Back</button>
              <button onClick={handleBook} disabled={booking} style={{
                flex: 1, padding: '13px', borderRadius: 10, cursor: booking ? 'wait' : 'pointer',
                background: booking ? 'var(--text-muted)' : 'var(--accent)',
                color: '#fff', border: 'none', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700,
                boxShadow: booking ? 'none' : '0 6px 20px rgba(200,75,49,0.35)',
                transition: 'all var(--transition)',
              }}>
                {booking ? '⏳ Confirming...' : '✅ Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmationScreen({ appointment, navigate }) {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-xl)',
        padding: '56px 48px', maxWidth: 480, width: '100%', textAlign: 'center',
        boxShadow: 'var(--shadow-xl)', animation: 'scaleIn 0.4s ease',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: 'rgba(82,183,136,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 24px',
          border: '2px solid var(--mint)',
        }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--charcoal)', marginBottom: 10 }}>
          Booking Confirmed!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
          Your appointment has been successfully scheduled.
        </p>
        <div style={{
          background: 'var(--cream)', borderRadius: 'var(--radius-md)',
          padding: 20, marginBottom: 28,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Confirmation Code
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)', letterSpacing: '0.08em' }}>
            {appointment.confirmationCode}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/appointments')} style={{
            flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
            background: 'var(--charcoal)', color: '#fff', border: 'none',
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
          }}>View My Bookings</button>
          <button onClick={() => navigate('/')} style={{
            flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
            background: 'transparent', color: 'var(--text-secondary)',
            border: '1.5px solid var(--border)',
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
          }}>Go Home</button>
        </div>
      </div>
    </div>
  );
}
