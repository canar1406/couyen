/**
 * gsap-login.js – v2 (safe)
 */

if (typeof gsap === 'undefined') {
  console.warn('[GSAP] Not loaded on login page');
} else {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d = prefersReduced ? 0.01 : 1;

  // ── Page Entrance ──────────────────────────────────────────
  try {
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: prefersReduced ? 0 : 0.05
    });

    tl
      .fromTo('.login-left',          { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55 * d })
      .fromTo('.login-brand-icon',    { scale: 0, rotation: -18 }, { scale: 1, rotation: 0, duration: 0.45 * d, ease: 'back.out(2)' }, '-=0.28')
      .fromTo('.login-brand-name, .login-brand-sub', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 * d, stagger: 0.08 }, '-=0.18')
      .fromTo('.login-feature-item',  { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42 * d, stagger: 0.09 }, '-=0.18')
      .fromTo('.login-right',         { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 * d }, '-=0.45')
      .fromTo('.login-header-tag',    { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 * d }, '-=0.28')
      .fromTo('.login-title, .login-subtitle', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 * d, stagger: 0.07 }, '-=0.18')
      .fromTo('.form-group',          { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 * d, stagger: 0.06 }, '-=0.18')
      .fromTo('.login-options',       { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 * d }, '-=0.1')
      .fromTo('.btn-login',           { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 * d }, '-=0.1')
      .fromTo('.demo-accounts',       { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 * d }, '-=0.08');

  } catch(e) {
    console.warn('[GSAP] Login entrance error:', e);
    document.querySelectorAll('.login-left,.login-right,.login-brand-icon,.form-group,.btn-login,.demo-accounts')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ── Error Shake ────────────────────────────────────────────
  window.shakeError = function() {
    try {
      if (prefersReduced) return;
      gsap.fromTo('#loginForm',
        { x: 0 },
        { keyframes: [{ x: -10 }, { x: 10 }, { x: -7 }, { x: 7 }, { x: -4 }, { x: 4 }, { x: 0 }], duration: 0.45, ease: 'power2.inOut' }
      );
      gsap.to('.form-input', { borderColor: '#ef4444', duration: 0.12, yoyo: true, repeat: 3 });
    } catch(e) {}
  };

  // ── Success Flash ──────────────────────────────────────────
  window.successAnimation = function() {
    try {
      if (prefersReduced) return;
      gsap.to('.btn-login', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    } catch(e) {}
  };

  // ── Demo item hover ────────────────────────────────────────
  try {
    if (!prefersReduced) {
      document.querySelectorAll('.demo-item').forEach(item => {
        item.addEventListener('mouseenter', () => gsap.to(item, { x: 3, duration: 0.18, ease: 'power2.out' }));
        item.addEventListener('mouseleave', () => gsap.to(item, { x: 0, duration: 0.22, ease: 'power2.out' }));
        item.addEventListener('click', () => gsap.fromTo(item, { scale: 0.96 }, { scale: 1, duration: 0.28, ease: 'back.out(2)' }));
      });
    }
  } catch(e) {}

  // ── Input focus lift ───────────────────────────────────────
  try {
    if (!prefersReduced) {
      document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => {
          const g = input.closest('.form-group') || input.closest('.input-group');
          if (g) gsap.to(g, { y: -2, duration: 0.18, ease: 'power2.out' });
        });
        input.addEventListener('blur', () => {
          const g = input.closest('.form-group') || input.closest('.input-group');
          if (g) gsap.to(g, { y: 0, duration: 0.22, ease: 'power2.out' });
        });
      });
    }
  } catch(e) {}
}
