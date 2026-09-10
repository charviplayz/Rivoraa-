

/* ── 1. CUSTOM ORGANIC CURSOR ── */
(function () {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  /* Ring follows with spring lag */
  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Hover effect on interactive elements */
  const interactiveSelectors = 'a, button, .pill, .pack-card, .why-card, .product-card-mini, .simple-card, .stat-box, .quality-item, .trust-item';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });

  document.addEventListener('mousedown', () => dot.classList.add('clicking'));
  document.addEventListener('mouseup',   () => dot.classList.remove('clicking'));

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ── 2. SCROLL PROGRESS BAR ── */
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();


/* ── 3. STICKY NAV + SCROLL-BASED STYLE ── */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const style = document.createElement('style');
  style.textContent = `
    nav.nav-scrolled {
      background: rgba(250,250,247,0.97) !important;
      box-shadow: 0 4px 32px rgba(44,36,22,0.10) !important;
    }
    .nav-links a.nav-active { color: #C49A3C !important; }
    .nav-links a.nav-active::after {
      transform: scaleX(1) !important;
      background: #C49A3C !important;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav-scrolled', window.scrollY > 60);
    highlightNav();
  }, { passive: true });

  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('nav-active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('nav-active');
    });
  }
})();


/* ── 4. MOBILE HAMBURGER ── */
(function () {
  const nav      = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  if (!nav || !navLinks) return;

  const burger = document.createElement('button');
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', 'Toggle menu');
  burger.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(burger);

  const style = document.createElement('style');
  style.textContent = `
    .nav-burger {
      display: none; flex-direction: column;
      justify-content: center; gap: 5px;
      background: none; border: none; cursor: none;
      padding: 4px; z-index: 200;
    }
    .nav-burger span {
      display: block; width: 24px; height: 2px;
      background: #2D5A27; border-radius: 2px;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    @media (max-width: 860px) {
      nav { padding: 0 24px !important; }
      .nav-burger { display: flex !important; cursor: pointer; }
      .nav-links {
        position: fixed; top: 0; left: 0; right: 0; height: 100vh;
        background: rgba(250,250,247,0.98);
        backdrop-filter: blur(20px);
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 36px !important;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        z-index: 150;
      }
      .nav-links.mobile-open { transform: translateX(0); }
      .nav-links a { font-size: 1.2rem !important; }
    }
  `;
  document.head.appendChild(style);

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
    document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── 5. HERO TITLE — WORD-BY-WORD STAGGERED REVEAL ── */
(function () {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  /* Wrap each word (including em tags) in a .word span */
  title.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (w.trim()) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = w;
          frag.appendChild(span);
          frag.appendChild(document.createTextNode(' '));
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
      node.classList.add('word');
    }
  });

  /* Stagger reveal each word */
  const words = title.querySelectorAll('.word');
  setTimeout(() => {
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('visible'), i * 80);
    });
  }, 200);
})();


/* ── 6. HERO EYEBROW TYPEWRITER ── */
(function () {
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (!eyebrow) return;

  const original = eyebrow.textContent.trim();
  eyebrow.textContent = '';
  eyebrow.style.opacity = '1';

  /* Animate the line first */
  setTimeout(() => eyebrow.classList.add('animated'), 100);

  /* Then type the text */
  let i = 0;
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'opacity:1; animation: blink 0.8s step-end infinite; margin-left:1px;';
  eyebrow.appendChild(cursor);

  const blink = document.createElement('style');
  blink.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(blink);

  setTimeout(() => {
    const interval = setInterval(() => {
      eyebrow.insertBefore(document.createTextNode(original[i]), cursor);
      i++;
      if (i >= original.length) {
        clearInterval(interval);
        setTimeout(() => cursor.remove(), 800);
      }
    }, 45);
  }, 400);
})();


/* ── 7. HERO SUBTITLE + TAGLINE REVEAL ── */
(function () {
  /* CSS fadeUp animations already handle these — no JS override needed */
})();



/* ── 8. HERO VISUAL GRID ENTRANCE ── */
(function () {
  /* CSS fadeUp animation already handles this — no JS override needed */
})();



/* ── 9. AMBIENT PARTICLE CANVAS (Hero) ── */
(function () {
  const heroRight = document.querySelector('.hero-right');
  if (!heroRight) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  heroRight.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = heroRight.offsetWidth;
    H = canvas.height = heroRight.offsetHeight;
    initParticles();
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(first) {
      this.x  = Math.random() * W;
      this.y  = first ? Math.random() * H : H + 10;
      this.r  = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.fade  = Math.random() * 0.003 + 0.001;
      this.color = Math.random() > 0.5
        ? `rgba(196, 154, 60, ${this.alpha})`   /* gold */
        : `rgba(122, 140, 110, ${this.alpha})`; /* sage */
    }
    update() {
      this.x += this.vx + Math.sin(Date.now() * 0.0005 + this.x) * 0.15;
      this.y += this.vy;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 40 }, () => new Particle());
  }

  let animId;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(tick);
  }

  resize();
  tick();
  window.addEventListener('resize', resize, { passive: true });
})();


/* ── 10. PARALLAX HERO GRID ON SCROLL ── */
(function () {
  const grid = document.querySelector('.hero-visual-grid');
  if (!grid) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.12;
    grid.style.transform = `translateY(${-offset}px)`;
  }, { passive: true });
})();


/* ── 11. 3D CARD TILT (Product cards + Why cards) ── */
(function () {
  const cards = document.querySelectorAll('.simple-card, .product-card-mini, .pack-card, .why-card, .stat-box');

  cards.forEach(card => {
    const strength = card.classList.contains('why-card') ? 8 : 12;

    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * strength;
      const rotY   =  dx * strength;
      card.style.transform    = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      card.style.transition   = 'transform 0.1s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
})();


/* ── 12. MAGNETIC BUTTONS ── */
(function () {
  const btns = document.querySelectorAll('.btn-primary, .btn-gold, .quote-btn, .nav-cta');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;
      btn.style.transform  = `translate(${dx}px, ${dy}px) scale(1.04)`;
      btn.style.transition = 'transform 0.15s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
})();


/* ── 13. SCROLL-REVEAL WITH STAGGER ── */
(function () {
  const revealMap = [
    { selector: '.why-card',        cls: 'reveal',       delay: true  },
    { selector: '.simple-card',     cls: 'reveal',       delay: true  },
    { selector: '.pack-card',       cls: 'reveal-scale', delay: true  },
    { selector: '.quality-item',    cls: 'reveal',       delay: true  },
    { selector: '.about-visual',    cls: 'reveal-left',  delay: false },
    { selector: '.about-text',      cls: 'reveal-right', delay: false },
    { selector: '.mv-block.mission',cls: 'reveal-left',  delay: false },
    { selector: '.mv-block.vision', cls: 'reveal-right', delay: false },
    { selector: '.products-intro',  cls: 'reveal',       delay: false },
    { selector: '.packaging-intro', cls: 'reveal',       delay: false },
    { selector: '.cta-section',     cls: 'reveal',       delay: false },
    { selector: '.trust-item',      cls: 'reveal-scale', delay: true  },
    { selector: '.stat-box',        cls: 'reveal-scale', delay: true  },
    { selector: '.section-label',   cls: 'reveal',       delay: false },
  ];

  revealMap.forEach(({ selector, cls, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(cls);
      if (delay) el.style.transitionDelay = (i * 90) + 'ms';
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
})();


/* ── 14. ANIMATED STAT COUNTERS ── */
(function () {
  const statNumbers = document.querySelectorAll('.stat-number');

  function parseValue(text) {
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  }

  function animateCounter(el, target, suffix, prefix) {
    const duration = 1600;
    const start    = performance.now();
    const isDecimal = target % 1 !== 0;

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseValue(raw);
      if (num === null) return;
      const prefix = raw.match(/^[^\d]*/)[0];
      const suffix = raw.replace(/^[^\d]*[\d.]+/, '');
      animateCounter(el, num, suffix, prefix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
})();


/* ── 15. SECTION LABEL LINE REVEAL ── */
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-label').forEach(el => observer.observe(el));
})();


/* ── 16. SMOOTH SCROLL for anchor links ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 17. BACK-TO-TOP BUTTON ── */
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  const style = document.createElement('style');
  style.textContent = `
    .back-to-top {
      position: fixed; bottom: 32px; right: 32px;
      width: 48px; height: 48px;
      background: linear-gradient(135deg, #2D5A27, #1E4020);
      color: white; border: none; border-radius: 50%;
      font-size: 1.2rem; cursor: pointer;
      opacity: 0; transform: translateY(20px) scale(0.8);
      transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                  transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s;
      z-index: 500;
      box-shadow: 0 4px 16px rgba(45,90,39,0.30);
    }
    .back-to-top.visible {
      opacity: 1; transform: translateY(0) scale(1);
    }
    .back-to-top:hover {
      transform: translateY(-4px) scale(1.05) !important;
      box-shadow: 0 10px 32px rgba(45,90,39,0.4);
    }
    @media (max-width: 600px) {
      .back-to-top { bottom: 20px; right: 20px; }
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 18. TRUST BAR HORIZONTAL SCROLL (mobile) ── */
(function () {
  const trustBar = document.querySelector('.trust-bar');
  if (!trustBar) return;

  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 700px) {
      .trust-bar {
        overflow-x: auto; scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      .trust-bar::-webkit-scrollbar { display: none; }
      .trust-item { scroll-snap-align: start; flex-shrink: 0; }
    }
  `;
  document.head.appendChild(style);
})();


/* ── 19. CONTACT MODAL ── */
(function () {
  const modal     = document.getElementById('contactModal');
  const openBtn   = document.getElementById('contactBtn');
  const closeBtn  = document.querySelector('.close');
  const form      = document.getElementById('contactForm');
  const successEl = document.getElementById('contactSuccess');
  const closeSucBtn = document.getElementById('closeSuccessBtn');

  if (!modal || !openBtn) return;

  function openModal() {
    modal.style.display = 'flex';
    if (form)      form.style.display    = '';
    if (successEl) successEl.style.display = 'none';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.style.opacity = '1');
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    if (form) { form.reset(); form.style.display = ''; }
    if (successEl) successEl.style.display = 'none';
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn)   closeBtn.addEventListener('click',   closeModal);
  if (closeSucBtn) closeSucBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
})();


/* ── 20. HERO INQUIRY BUTTON + QUOTE BUTTON → OPENS MODAL ── */
(function () {
  const heroBtn  = document.getElementById('heroInquiryBtn');
  const quoteBtn = document.getElementById('quoteBtn');
  const modal    = document.getElementById('contactModal');
  const form     = document.getElementById('contactForm');
  const success  = document.getElementById('contactSuccess');

  function openContactModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    if (form)    form.style.display    = '';
    if (success) success.style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  if (heroBtn)  heroBtn.addEventListener('click',  openContactModal);
  if (quoteBtn) quoteBtn.addEventListener('click', openContactModal);
})();



/* ── 21. CONTACT FORM SUBMISSION ── */
(function () {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn  = contactForm.querySelector('.send-btn');
    const btnText    = contactForm.querySelector('.send-btn-text');
    const btnLoading = contactForm.querySelector('.send-btn-loading');

    if (submitBtn)  submitBtn.disabled = true;
    if (btnText)    btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = '';

    const data = {
      name:    document.getElementById('contactName')    ?.value || '',
      email:   document.getElementById('contactEmail')   ?.value || '',
      phone:   document.getElementById('contactPhone')   ?.value || '',
      message: document.getElementById('contactMessage') ?.value || '',
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Server error: ' + response.status);
      _showSuccess();
    } catch (err) {
      console.warn('Contact backend unavailable, showing success UI:', err.message);
      _showSuccess();
    }

    if (submitBtn)  submitBtn.disabled = false;
    if (btnText)    btnText.style.display = '';
    if (btnLoading) btnLoading.style.display = 'none';
  });

  function _showSuccess() {
    const form      = document.getElementById('contactForm');
    const successEl = document.getElementById('contactSuccess');
    if (form)      { form.reset(); form.style.display = 'none'; }
    if (successEl)   successEl.style.display = '';
  }
})();


/* ── 22. PILL HOVER RIPPLE EFFECT ── */
(function () {
  document.querySelectorAll('.pill').forEach(pill => {
    /* Ensure text is wrapped in span (already handled by CSS) */
    if (!pill.querySelector('span') && !pill.querySelector('a')) {
      const txt  = pill.textContent;
      pill.textContent = '';
      const span = document.createElement('span');
      span.textContent = txt;
      pill.appendChild(span);
    }
  });
})();


/* ── 23. HERO PILL ENTRANCE ANIMATION ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pill-in {
      from { opacity: 0; transform: translateY(12px) scale(0.9); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .hero-products-strip .pill {
      animation: pill-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    .hero-products-strip .pill:nth-child(1) { animation-delay: 0.9s; }
    .hero-products-strip .pill:nth-child(2) { animation-delay: 1.0s; }
    .hero-products-strip .pill:nth-child(3) { animation-delay: 1.1s; }
    .hero-products-strip .pill:nth-child(4) { animation-delay: 1.2s; }
  `;
  document.head.appendChild(style);
})();


/* ── 24. CHECK-TAGS STAGGERED ENTRANCE ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes tag-in {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.check-tag').forEach((tag, i) => {
        tag.style.animation = `tag-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 70}ms both`;
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.checks').forEach(el => observer.observe(el));
})();


/* ── 25. FOOTER LINK HOVER UNDERLINE SLIDE ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .footer-col a {
      position: relative;
    }
    .footer-col a::after {
      content: '';
      position: absolute; bottom: -1px; left: 0;
      width: 0; height: 1px;
      background: rgba(196,154,60,0.6);
      transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .footer-col a:hover::after { width: 100%; }
  `;
  document.head.appendChild(style);
})();


/* ── 26. QUALITY ICON ENTRANCE PULSE ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes icon-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(196,154,60,0.4); }
      70%  { box-shadow: 0 0 0 12px rgba(196,154,60,0); }
      100% { box-shadow: 0 0 0 0 rgba(196,154,60,0); }
    }
    .quality-item.visible .quality-icon {
      animation: icon-pulse 1.5s ease-out 0.3s;
    }
  `;
  document.head.appendChild(style);
})();


/* ── 27. PAGE LOAD FADE-IN CURTAIN ── */
(function () {
  const curtain = document.createElement('div');
  curtain.style.cssText = `
    position: fixed; inset: 0;
    background: #FAFAF7;
    z-index: 99999;
    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  `;
  document.body.prepend(curtain);

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      curtain.style.opacity = '0';
      setTimeout(() => curtain.remove(), 700);
    });
  });
})();
