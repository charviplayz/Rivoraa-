/* ============================================================
   Rivoraa Organics — product.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ── 1. Parallax effect for Products Hero ── */
  const heroInner = document.querySelector('.products-hero-inner');
  window.addEventListener('scroll', () => {
    if (window.scrollY < 600 && heroInner) {
      // Subtle parallax transform
      heroInner.style.transform = `translateY(${window.scrollY * 0.25}px)`;
      heroInner.style.opacity = 1 - (window.scrollY * 0.0025);
    }
  });

  /* ── 2. Specs Strip Staggered Animation ── */
  // Sets up intersection observer to animate the specification cells
  const specObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cells = entry.target.querySelectorAll('.spec-cell');
        cells.forEach((cell, index) => {
          setTimeout(() => {
            cell.style.opacity = '1';
            cell.style.transform = 'translateY(0)';
          }, index * 80); // Stagger by 80ms
        });
        specObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.specs-strip').forEach(strip => {
    // Set initial hidden state for cells
    strip.querySelectorAll('.spec-cell').forEach(cell => {
      cell.style.opacity = '0';
      cell.style.transform = 'translateY(16px)';
      cell.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    specObserver.observe(strip);
  });

});
