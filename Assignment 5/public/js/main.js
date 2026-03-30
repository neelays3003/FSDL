document.addEventListener('DOMContentLoaded', () => {

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // MOBILE MENU
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // SCROLL REVEAL
  if ('IntersectionObserver' in window) {
    const cards = document.querySelectorAll('.dest-card, .pkg-card, .pkg-full-card, .dest-list-card, .testi-card, .value-card, .why-item, .info-card');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    cards.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.6s ease ${(i % 5) * 0.07}s, transform 0.6s ease ${(i % 5) * 0.07}s`;
      obs.observe(el);
    });

    // COUNTER ANIMATION
    const statNums = document.querySelectorAll('.stat-num');
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        counterObs.unobserve(e.target);
        const el = e.target;
        const raw = el.textContent.trim();
        const hasPlus = raw.includes('+');
        const target = parseInt(raw.replace(/\D/g, ''));
        if (isNaN(target)) return;
        const start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target).toLocaleString() + (hasPlus ? '+' : '');
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => counterObs.observe(el));
  }

  // LAZY IMAGE FADE
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    if (img.complete) img.style.opacity = '1';
  });

});
