const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars setup
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    stars: (rating) => {
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5 ? 1 : 0;
      const empty = 5 - full - half;
      return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    },
    formatPrice: (price) => '$' + price.toLocaleString(),
    discount: (orig, curr) => Math.round((1 - curr / orig) * 100) + '% OFF',
    eq: (a, b) => a === b,
    includes: (arr, val) => Array.isArray(arr) && arr.includes(val),
    range: (n) => Array.from({ length: n }, (_, i) => i + 1),
    json: (obj) => JSON.stringify(obj)
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404 — Wanderlust' });
});

app.listen(PORT, () => {
  console.log(`\n🌍 Wanderlust Travel Agency running at http://localhost:${PORT}`);
  console.log(`📦 Routes: /, /destinations, /packages, /about, /contact, /book`);
  console.log(`🔌 API:    /api/destinations, /api/packages, /api/bookings\n`);
});
