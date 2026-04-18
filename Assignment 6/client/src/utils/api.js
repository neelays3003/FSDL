import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

// Services
export const getServices = () => api.get('/services').then(r => r.data);
export const getService = (id) => api.get(`/services/${id}`).then(r => r.data);

// Providers
export const getProviders = (serviceId) =>
  api.get('/providers', { params: serviceId ? { serviceId } : {} }).then(r => r.data);
export const getProvider = (id) => api.get(`/providers/${id}`).then(r => r.data);
export const getProviderSlots = (id, date) =>
  api.get(`/providers/${id}/slots`, { params: { date } }).then(r => r.data);

// Appointments
export const bookAppointment = (data) => api.post('/appointments', data).then(r => r.data);
export const getMyAppointments = () => api.get('/appointments/my').then(r => r.data);
export const cancelAppointment = (id) => api.patch(`/appointments/${id}/cancel`).then(r => r.data);

// Auth
export const loginUser = (data) => api.post('/auth/login', data).then(r => r.data);
export const registerUser = (data) => api.post('/auth/register', data).then(r => r.data);
