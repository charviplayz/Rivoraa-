/* ============================================================
   Rivoraa Organics — script.js
   ============================================================ */

/* ── 1. NAV: Shrink on scroll + active link highlighting ── */
(function () {
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
    highlightNavLink();
  });

  /* Highlight current section in nav */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.remove('nav-active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('nav-active');
      }
    });
  }

  /* Inject nav-scrolled styles */
  const style = document.createElement('style');
  style.textContent = `
  nav.nav-scrolled {
    box-shadow: 0 4px 24px rgba(45,90,39,0.15) !important;
    transition: all 0.3s;
  }

  nav.nav-scrolled .nav-logo-img {
    height: 80px !important;
  }


    .nav-links a.nav-active {
      color: #C49A3C !important;
    }
    .nav-links a.nav-active::after {
      transform: scaleX(1) !important;
      background: #C49A3C !important;
    }
  `;
  document.head.appendChild(style);
})();


/* ── 2. MOBILE HAMBURGER MENU ── */
(function () {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');

  /* Create hamburger button */
  const burger = document.createElement('button');
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', 'Toggle menu');
  burger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  nav.appendChild(burger);

  /* Hamburger + mobile nav styles */
  const style = document.createElement('style');
  style.textContent = `
    .nav-burger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      z-index: 200;
    }
    .nav-burger span {
      display: block;
      width: 24px;
      height: 2px;
      background: #2D5A27;
      border-radius: 2px;
      transition: all 0.3s;
    }
    .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-burger.open span:nth-child(2) { opacity: 0; }
    .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 860px) {
      nav { padding: 0 24px !important; }
      .nav-burger { display: flex !important; }
      .nav-links {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 100vh;
        background: white;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 28px !important;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        z-index: 150;
      }
      .nav-links.mobile-open {
        transform: translateX(0);
      }
      .nav-links a {
        font-size: 1.1rem !important;
      }
    }
  `;
  document.head.appendChild(style);

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  /* Close menu when a link is clicked */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── 3. SCROLL-REVEAL ANIMATIONS ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-40px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal-left.visible {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-right {
      opacity: 0;
      transform: translateX(40px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal-right.visible {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);

  /* Assign reveal classes to elements */
  const revealMap = [
    { selector: '.why-card',        cls: 'reveal',       delay: true },
    { selector: '.product-card',    cls: 'reveal',       delay: true },
    { selector: '.pack-card',       cls: 'reveal',       delay: true },
    { selector: '.quality-item',    cls: 'reveal',       delay: true },
    { selector: '.about-visual',    cls: 'reveal-left',  delay: false },
    { selector: '.about-text',      cls: 'reveal-right', delay: false },
    { selector: '.mv-block.mission',cls: 'reveal-left',  delay: false },
    { selector: '.mv-block.vision', cls: 'reveal-right', delay: false },
    { selector: '.products-intro',  cls: 'reveal',       delay: false },
    { selector: '.packaging-intro', cls: 'reveal',       delay: false },
    { selector: '.cta-section',     cls: 'reveal',       delay: false },
  ];

  revealMap.forEach(({ selector, cls, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      if (delay) el.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  /* Observe */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();


/* ── 4. ANIMATED STAT COUNTERS ── */
(function () {
  const statNumbers = document.querySelectorAll('.stat-number');

  const parseValue = (text) => {
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  const animateCounter = (el, target, suffix, prefix) => {
    const duration = 1400;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * target;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseValue(raw);
      if (num === null) return;

      const prefix = raw.match(/^[^\d]*/)[0];
      const suffix = raw.replace(/^[^\d]*[\d.]+/, '');
      el.textContent = prefix + '0' + suffix;
      animateCounter(el, num, suffix, prefix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();


/* ── 5. PRODUCT CARD HOVER EFFECT ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .product-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }
    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 48px rgba(44,36,22,0.14) !important;
    }
    .why-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .why-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 32px rgba(44,36,22,0.10) !important;
    }
    .pack-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .pack-card:hover {
      transform: translateY(-5px);
    }
  `;
  document.head.appendChild(style);
})();


/* ── 6. SMOOTH SCROLL for all anchor links ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 90; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 7. BACK-TO-TOP BUTTON ── */
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  const style = document.createElement('style');
  style.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 32px; right: 32px;
      width: 44px; height: 44px;
      background: #2D5A27;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.3s, transform 0.3s;
      z-index: 500;
      box-shadow: 0 4px 16px rgba(45,90,39,0.30);
    }
    .back-to-top.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .back-to-top:hover {
      background: #1E4020;
    }
    @media (max-width: 600px) {
      .back-to-top { bottom: 20px; right: 20px; }
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 8. TRUST BAR AUTO-SCROLL on mobile ── */
(function () {
  const trustBar = document.querySelector('.trust-bar');
  if (!trustBar) return;

  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 700px) {
      .trust-bar {
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .trust-bar::-webkit-scrollbar { display: none; }
      .trust-item { scroll-snap-align: start; flex-shrink: 0; }
    }
  `;
  document.head.appendChild(style);
})();


/* ── 9. HERO PILLS ENTRANCE ANIMATION ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pill-in {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hero-products-strip .pill {
      animation: pill-in 0.5s ease both;
    }
    .hero-products-strip .pill:nth-child(1) { animation-delay: 0.3s; }
    .hero-products-strip .pill:nth-child(2) { animation-delay: 0.45s; }
    .hero-products-strip .pill:nth-child(3) { animation-delay: 0.6s; }
    .hero-products-strip .pill:nth-child(4) { animation-delay: 0.75s; }

    @keyframes hero-fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hero-eyebrow  { animation: hero-fade-up 0.6s ease 0.1s both; }
    .hero-title    { animation: hero-fade-up 0.6s ease 0.2s both; }
    .hero-subtitle { animation: hero-fade-up 0.6s ease 0.3s both; }
    .hero-buttons  { animation: hero-fade-up 0.6s ease 0.5s both; }
  `;
  document.head.appendChild(style);
})();