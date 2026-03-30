/* ============================================================
   MAISON — Luxury Fashion Store
   script.js
   ============================================================ */

/* ── PRODUCT DATA ── */
const products = [
  {
    id: 1,
    name: 'Silk Bias Slip Dress',
    brand: 'Maison',
    category: 'women',
    price: 385,
    oldPrice: null,
    tag: 'new',
    rating: 5,
    colors: ['#1a1a1a', '#e8e0d0', '#c5a882'],
    img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80'
  },
  {
    id: 2,
    name: 'Cashmere Wrap Coat',
    brand: 'Maison',
    category: 'women',
    price: 695,
    oldPrice: null,
    tag: 'new',
    rating: 5,
    colors: ['#6b4f3a', '#e8e0d0', '#1a1a1a'],
    img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80'
  },
  {
    id: 3,
    name: 'Tailored Linen Blazer',
    brand: 'Maison',
    category: 'men',
    price: 420,
    oldPrice: 580,
    tag: 'sale',
    rating: 4,
    colors: ['#c5a882', '#1a1a1a', '#4a6741'],
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'
  },
  {
    id: 4,
    name: 'Pleated Wide-Leg Trousers',
    brand: 'Maison',
    category: 'women',
    price: 285,
    oldPrice: null,
    tag: null,
    rating: 5,
    colors: ['#1a1a1a', '#8b7355', '#e8e0d0'],
    img: 'https://images.unsplash.com/photo-1551854838-212c9a5a9853?w=600&q=80'
  },
  {
    id: 5,
    name: 'Leather Crossbody Bag',
    brand: 'Maison',
    category: 'accessories',
    price: 450,
    oldPrice: 620,
    tag: 'sale',
    rating: 5,
    colors: ['#1a1a1a', '#8b4a3a', '#c5a882'],
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'
  },
  {
    id: 6,
    name: 'Merino Turtleneck',
    brand: 'Maison',
    category: 'men',
    price: 195,
    oldPrice: null,
    tag: null,
    rating: 4,
    colors: ['#c5a882', '#1a1a1a', '#4a5568'],
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'
  },
  {
    id: 7,
    name: 'Silk Scarf — Botanica',
    brand: 'Maison',
    category: 'accessories',
    price: 125,
    oldPrice: null,
    tag: 'new',
    rating: 5,
    colors: ['#4a6741', '#b8955a', '#1a1a1a'],
    img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80'
  },
  {
    id: 8,
    name: 'Double-Breasted Suit',
    brand: 'Maison',
    category: 'men',
    price: 880,
    oldPrice: 1100,
    tag: 'sale',
    rating: 5,
    colors: ['#1a1a1a', '#2d3a2e', '#5c4a3a'],
    img: 'https://images.unsplash.com/photo-1555069519-127aadecd74s?w=600&q=80'
  }
];

/* ── FALLBACK IMAGE ── */
const fallbackImg = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80';

/* ── STATE ── */
let cart = [];
let wishlist = new Set();
let currentFilter = 'all';


/* ============================================================
   RENDER PRODUCTS
   ============================================================ */
function renderProducts(filter = 'all') {
  currentFilter = filter;
  const grid = document.getElementById('productGrid');

  const filtered =
    filter === 'all'  ? products :
    filter === 'sale' ? products.filter(p => p.tag === 'sale') :
    products.filter(p => p.category === filter);

  document.getElementById('productCount').textContent = filtered.length;

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5"
           style="color:var(--muted);font-family:'Cormorant Garamond',serif;font-size:1.2rem;">
        No products found in this category.
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="product-card" id="card-${p.id}">
        <div class="product-img-wrap">
          <img class="product-img"
               src="${p.img}"
               alt="${p.name}"
               onerror="this.src='${fallbackImg}'"/>

          ${p.tag ? `
            <div class="product-tag ${p.tag === 'sale' ? 'sale' : 'new'}">
              ${p.tag === 'sale' ? 'Sale' : 'New In'}
            </div>` : ''}

          <button class="wishlist-btn ${wishlist.has(p.id) ? 'active' : ''}"
                  onclick="toggleWishlist(${p.id}, this)"
                  title="Wishlist">
            <i class="bi bi-heart${wishlist.has(p.id) ? '-fill' : ''}"></i>
          </button>

          <div class="product-actions">
            <button class="product-action-btn" onclick="addToCart(${p.id})">Add to Bag</button>
            <button class="product-action-btn"
                    onclick="quickView(${p.id})"
                    style="flex:0;padding:0.65rem 0.75rem;">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>

        <div class="product-info">
          <div class="product-brand">${p.brand}</div>
          <div class="stars">${'★'.repeat(p.rating)}${'☆'.repeat(5 - p.rating)}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">
            <span class="price-current">$${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="product-colors">
            ${p.colors.map(c => `<div class="color-dot" style="background:${c}" title="${c}"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}


/* ============================================================
   FILTER PRODUCTS
   ============================================================ */
function filterProducts(filter, el) {
  currentFilter = filter;

  // Reset active states
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  renderProducts(filter);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ============================================================
   CART — ADD / REMOVE / QUANTITY
   ============================================================ */
function addToCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...p, qty: 1 });
  }

  updateCartUI();
  showToast(`${p.name} added to bag`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderCartItems();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }

  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const subtotal   = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  document.getElementById('cartBadge').textContent = totalItems;
  document.getElementById('cartHeaderCount').textContent = totalItems ? `(${totalItems})` : '';
  document.getElementById('cartTotal').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('cartFooter').style.display = cart.length ? 'block' : 'none';
}

function renderCartItems() {
  const el = document.getElementById('cartItems');

  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-bag"></i>
        <p style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;">Your bag is empty</p>
        <p style="font-size:0.8rem;color:var(--muted);margin-top:0.5rem;">Add something beautiful</p>
      </div>`;
    return;
  }

  el.innerHTML = cart.map(c => `
    <div class="cart-item">
      <img class="cart-item-img"
           src="${c.img}"
           alt="${c.name}"
           onerror="this.src='${fallbackImg}'"/>
      <div class="cart-item-info">
        <div class="cart-item-brand">${c.brand}</div>
        <div class="cart-item-name">${c.name}</div>
        <div class="cart-item-price">$${c.price.toLocaleString()}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${c.id}, -1)">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${c.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart(${c.id})">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `).join('');
}


/* ============================================================
   CART DRAWER — OPEN / CLOSE
   ============================================================ */
function openCart() {
  renderCartItems();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}


/* ============================================================
   WISHLIST TOGGLE
   ============================================================ */
function toggleWishlist(id, btn) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.innerHTML = '<i class="bi bi-heart"></i>';
    btn.classList.remove('active');
    showToast('Removed from wishlist');
  } else {
    wishlist.add(id);
    btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
    btn.classList.add('active');
    showToast('Saved to wishlist ♥');
  }
}


/* ============================================================
   QUICK VIEW
   ============================================================ */
function quickView(id) {
  const p = products.find(x => x.id === id);
  showToast(`Viewing: ${p.name}`);
}


/* ============================================================
   SEARCH
   ============================================================ */
function toggleSearch() {
  const sb = document.getElementById('searchBar');
  sb.classList.toggle('open');
  if (sb.classList.contains('open')) {
    document.getElementById('searchInput').focus();
  }
}

// Close search on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('searchBar').classList.remove('open');
  }
});

// Live search input handler
document.getElementById('searchInput')?.addEventListener('input', function () {
  const q = this.value.toLowerCase();
  const grid = document.getElementById('productGrid');

  const filtered = q
    ? products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
    : products;

  document.getElementById('productCount').textContent = filtered.length;

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5" style="color:var(--muted);">
        No results for "${this.value}"
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="product-card">
        <div class="product-img-wrap">
          <img class="product-img"
               src="${p.img}"
               alt="${p.name}"
               onerror="this.src='${fallbackImg}'"/>
          ${p.tag ? `<div class="product-tag ${p.tag}">${p.tag === 'sale' ? 'Sale' : 'New In'}</div>` : ''}
          <div class="product-actions">
            <button class="product-action-btn" onclick="addToCart(${p.id})">Add to Bag</button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">
            <span class="price-current">$${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
        </div>
      </div>
    </div>
  `).join('');
});


/* ============================================================
   NEWSLETTER SUBSCRIPTION
   ============================================================ */
function subscribeNewsletter() {
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email');
    return;
  }
  document.getElementById('newsletterEmail').value = '';
  showToast('Welcome to the Inner Circle ✦');
}


/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}


/* ============================================================
   INITIALISE
   ============================================================ */
renderProducts('all');