# ✦ WANDERLUST — Luxury Travel Agency Website
### Built with Node.js · Express · Handlebars · In-Memory NoSQL Data Store

---

## 🚀 Quick Start

```bash
# 1. Navigate into the project folder
cd travel-agency

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open your browser
http://localhost:3000
```

---

## 📁 Project Structure

```
travel-agency/
├── server.js                 # Express app entry point
├── package.json
├── data/
│   └── db.js                 # In-memory NoSQL-style data store
│                               (destinations, packages, testimonials, bookings)
├── routes/
│   └── index.js              # All page + API routes
├── views/
│   ├── layouts/
│   │   └── main.hbs          # Root HTML layout (nav + footer)
│   ├── partials/
│   │   ├── navbar.hbs
│   │   └── footer.hbs
│   ├── home.hbs              # Homepage
│   ├── destinations.hbs      # Destinations listing (with search + filter)
│   ├── destination-detail.hbs # Individual destination page
│   ├── packages.hbs          # Packages listing (with type filter)
│   ├── book.hbs              # Booking form
│   ├── booking-confirmation.hbs
│   ├── about.hbs
│   ├── contact.hbs
│   ├── contact-success.hbs
│   └── 404.hbs
└── public/
    ├── css/
    │   └── style.css         # Full responsive stylesheet
    └── js/
        └── main.js           # Navbar scroll, mobile menu, animations
```

---

## 🌐 Pages & Routes

| URL                       | Description                              |
|---------------------------|------------------------------------------|
| `/`                       | Homepage — hero, destinations, packages, testimonials |
| `/destinations`           | Destinations grid with continent filter + search |
| `/destinations/:id`       | Destination detail with highlights + packages |
| `/packages`               | All packages with type filter            |
| `/book`                   | Booking form (pre-selects package via `?packageId=`) |
| `/about`                  | About page with team story + values      |
| `/contact`                | Contact form                             |

## 🔌 JSON API Endpoints

| Endpoint              | Returns                         |
|-----------------------|---------------------------------|
| `GET /api/destinations` | All destinations as JSON       |
| `GET /api/packages`     | All packages as JSON           |
| `GET /api/bookings`     | All submitted bookings as JSON |

---

## 🗄️ Data Store (NoSQL-style)

`data/db.js` acts as an in-memory document store simulating MongoDB collections:

- **destinations** — 6 luxury destinations (Santorini, Kyoto, Amalfi Coast, Marrakech, Patagonia, Bali)
- **packages** — 4 curated packages with pricing, inclusions, duration
- **testimonials** — 4 traveler reviews
- **bookings** — empty array filled at runtime (resets on server restart)

### To connect real MongoDB:

```js
// Install mongoose
npm install mongoose

// In server.js, add:
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wanderlust');

// Replace imports in routes/index.js with Mongoose models
```

---

## 🎨 Design System

- **Display Font:** Cormorant Garamond (serif, editorial luxury)
- **Body Font:** DM Sans (clean, modern)
- **Palette:** Warm ink `#1a1612`, sand `#f7f3ee`, gold `#c9a96e`, terracotta `#e85d26`
- **Animations:** Hero zoom, scroll reveal, stat counters, image lazy-fade
- **Fully responsive** — mobile nav, stacked layouts at 768px

---

## ✨ Features

- ✅ Full multi-page navigation with active states
- ✅ Destination search + continent filter
- ✅ Package type filter
- ✅ Live booking form with price calculator
- ✅ Booking confirmation with generated ID
- ✅ Contact form with success page
- ✅ Sticky navbar with scroll effect
- ✅ Mobile hamburger menu
- ✅ Scroll-reveal card animations
- ✅ Animated stat counters
- ✅ Lazy-loaded images with fade-in
- ✅ REST API endpoints for data
- ✅ 404 error page
- ✅ Fully responsive (desktop → tablet → mobile)

---

*Crafted with passion. Travel is not an escape — it is a return to yourself.*
