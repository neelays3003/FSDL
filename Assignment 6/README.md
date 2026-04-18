# 🗓️ AppointEase — Online Appointment Booking Application

A full-stack appointment booking system built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Pure CSS with CSS Variables |
| HTTP | Axios |

---

## 📁 Project Structure

```
appointment-booking-app/
├── server/                    # Express API
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Service.js         # Medical service schema
│   │   ├── Provider.js        # Doctor/provider schema
│   │   └── Appointment.js     # Appointment schema
│   ├── routes/
│   │   ├── auth.js            # Register, Login, Me
│   │   ├── services.js        # List services
│   │   ├── providers.js       # List providers + slots
│   │   └── appointments.js    # Book, list, cancel
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── utils/
│   │   └── seed.js            # Demo data seeder
│   ├── .env.example
│   └── index.js               # Server entry point
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Landing page
│   │   │   ├── ServicesPage.jsx # Browse services
│   │   │   ├── ProvidersPage.jsx# Browse doctors
│   │   │   ├── BookingPage.jsx  # 3-step booking flow
│   │   │   ├── MyAppointmentsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── utils/
│   │   │   └── api.js          # Axios API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Design system
│   ├── index.html
│   └── vite.config.js
│
└── package.json               # Root scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** v9+

### 1. Clone & Install

```bash
git clone <repository-url>
cd appointment-booking-app

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev        # Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npx vite           # Runs on http://localhost:3000
```

Visit **http://localhost:3000** 🎉

> **Note:** Demo data (6 services, 6 doctors) is automatically seeded on first run.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services |
| GET | `/api/services/:id` | Get service by ID |

### Providers (Doctors)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | Get all providers |
| GET | `/api/providers?serviceId=...` | Filter by service |
| GET | `/api/providers/:id` | Get provider details |
| GET | `/api/providers/:id/slots?date=YYYY-MM-DD` | Get available slots |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Book an appointment (protected) |
| GET | `/api/appointments/my` | Get user's appointments (protected) |
| PATCH | `/api/appointments/:id/cancel` | Cancel appointment (protected) |

---

## ✨ Features

- **User Authentication** — Register/Login with JWT tokens
- **Service Catalog** — Browse 6 medical specializations with filtering
- **Doctor Directory** — View doctor profiles, ratings and specializations
- **3-Step Booking Flow** — Service → Date/Time → Confirm
- **Real-time Slot Availability** — Slots blocked when booked
- **Appointment Management** — View and cancel upcoming appointments
- **Auto-generated Confirmation Codes** — Unique codes per booking
- **Demo Data** — Auto-seeded on first run (no setup needed)
- **Protected Routes** — Auth-required pages redirect to login
- **Toast Notifications** — Feedback on every action

---

## 🎨 Design System

The app uses a warm, editorial aesthetic with:
- **DM Serif Display** — headings
- **DM Sans** — body text
- CSS custom properties for consistent theming
- Smooth animations and micro-interactions
- Mobile-responsive layouts

---

## 🌱 Demo Seed Data

On first run, the server seeds:

**Services:** General Consultation, Dental Cleaning, Physiotherapy, Eye Checkup, Dermatology, Mental Health

**Doctors:**
- Dr. Priya Sharma — General Physician
- Dr. Rahul Mehta — Dentist
- Dr. Anita Verma — Physiotherapist
- Dr. Suresh Kumar — Ophthalmologist
- Dr. Deepa Nair — Dermatologist
- Dr. Amit Joshi — Psychiatrist

Each doctor has Mon–Sat availability with 30-minute slots from 9 AM to 5 PM.

---

## 📦 MongoDB Atlas (Cloud)

To use MongoDB Atlas instead of local MongoDB:

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/appointmentDB
```
