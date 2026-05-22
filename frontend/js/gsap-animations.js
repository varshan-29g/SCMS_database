/* ============================================================
   SCMS — GSAP ANIMATIONS (gsap-animations.js)
   Page transitions, scroll reveals, counter animations
   ============================================================ */

function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ─── Page Enter Animation ─── */
  gsap.from('.page-header', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' });
  gsap.from('.page-title',  { y: 20, opacity: 0, duration: 0.6, delay: 0.1, ease: 'power3.out' });
  gsap.from('.page-subtitle',{ y: 20, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });

  /* ─── Stat Cards Stagger ─── */
  gsap.from('.stat-card', {
    y: 30, opacity: 0, duration: 0.5,
    stagger: 0.1, delay: 0.3, ease: 'power3.out'
  });

  /* ─── Cards on scroll ─── */
  gsap.utils.toArray('.card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      y: 24, opacity: 0, duration: 0.5, ease: 'power3.out'
    });
  });

  /* ─── Table rows stagger on scroll ─── */
  gsap.utils.toArray('tbody tr').forEach((row, i) => {
    gsap.from(row, {
      scrollTrigger: { trigger: row, start: 'top 95%', once: true },
      x: -10, opacity: 0, duration: 0.3, delay: i * 0.03, ease: 'power2.out'
    });
  });

  /* ─── Feature cards (landing) ─── */
  gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      y: 40, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power3.out'
    });
  });

  /* ─── Hero section ─── */
  const heroTl = gsap.timeline({ delay: 1.8 });
  heroTl
    .from('.hero-badge',    { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' })
    .from('.hero-title',    { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .from('.hero-desc',     { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .from('.hero-actions',  { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('.hero-stat',     { y: 15, opacity: 0, stagger: 0.1, duration: 0.4, ease: 'power3.out' }, '-=0.2');

  /* ─── Sidebar nav items ─── */
  gsap.from('.nav-item', {
    x: -20, opacity: 0, duration: 0.4,
    stagger: 0.05, delay: 0.4, ease: 'power3.out'
  });

  /* ─── Notification items ─── */
  gsap.utils.toArray('.notif-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 95%', once: true },
      x: 10, opacity: 0, duration: 0.3, delay: i * 0.04, ease: 'power2.out'
    });
  });

  /* ─── Book cards ─── */
  gsap.utils.toArray('.book-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      scale: 0.95, opacity: 0, duration: 0.4, delay: i * 0.06, ease: 'back.out(1.7)'
    });
  });

  /* ─── Room cards ─── */
  gsap.utils.toArray('.room-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 92%', once: true },
      y: 16, opacity: 0, duration: 0.35, delay: i * 0.04, ease: 'power3.out'
    });
  });
}

/* ─── Page Transition ─── */
function navigateTo(url) {
  if (typeof gsap === 'undefined') { window.location.href = url; return; }
  const overlay = document.getElementById('page-overlay');
  if (!overlay) { window.location.href = url; return; }
  gsap.to(overlay, {
    scaleY: 1, duration: 0.4, ease: 'power3.inOut',
    onComplete: () => { window.location.href = url; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Intercept nav links for smooth transition
  document.querySelectorAll('.nav-item[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });
  initGSAPAnimations();
});
