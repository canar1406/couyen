/**
 * gsap-dashboard.js – v2 (safe)
 * Wrapped in try-catch, safety-net đảm bảo UI luôn visible
 */

if (typeof gsap === 'undefined') {
  console.warn('[GSAP] Not loaded on dashboard');
} else {
  try { gsap.registerPlugin(ScrollTrigger); } catch(e) {}

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d = prefersReduced ? 0.01 : 1; // duration multiplier

  // ── Page Entrance Timeline ─────────────────────────────────
  try {
    const hasVisited = sessionStorage.getItem('ue_sidebar_loaded');
    sessionStorage.setItem('ue_sidebar_loaded', 'true');

    const pageTL = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: prefersReduced ? 0 : 0.05
    });

    pageTL
      .fromTo('#sidebar',           { x: hasVisited ? 0 : -55, opacity: hasVisited ? 1 : 0 }, { x: 0, opacity: 1, duration: 0.5 * d })
      .fromTo('.sidebar-logo, .nav-section-title, #sidebar .nav-item', 
        { x: hasVisited ? 0 : -18, opacity: hasVisited ? 1 : 0 }, 
        { x: 0, opacity: 1, duration: 0.38 * d, stagger: hasVisited ? 0 : 0.04 }, '-=0.22')
      .fromTo('.topbar',            { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 * d }, '-=0.28')
      .fromTo('.page-header',       { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 * d }, '-=0.2')
      .fromTo('.countdown-banner',  { y: 38, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.6 * d, ease: 'back.out(1.2)' }, '-=0.15')
      .fromTo('.time-unit',         { y: 18, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.38 * d, stagger: 0.07, ease: 'back.out(1.7)' }, '-=0.28')
      .fromTo('.courses-section',   { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 * d }, '-=0.18')
      .fromTo('.right-column > *',  { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42 * d, stagger: 0.1 }, '-=0.28');

  } catch(e) {
    console.warn('[GSAP] Dashboard entrance error:', e);
    // Show everything
    document.querySelectorAll('#sidebar,.sidebar-logo,.nav-section-title,.nav-item,.topbar,.page-header,.countdown-banner,.time-unit,.courses-section,.right-column > *')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ── Course Cards ───────────────────────────────────────────
  window.animateCourseCards = function() {
    try {
      const cards = document.querySelectorAll('.course-card');
      if (!cards.length || prefersReduced) return;
      gsap.fromTo(cards, 
        { y: 28, opacity: 0, scale: 0.96 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.09, ease: 'back.out(1.3)', clearProps: 'all' }
      );
    } catch(e) {}
  };

  // ── Chart Counter ──────────────────────────────────────────
  window.animateChart = function(pct) {
    try {
      if (prefersReduced) return;
      const el = document.getElementById('chartPct');
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: pct, duration: 1.1, ease: 'power2.out', delay: 0.3,
        onUpdate: () => { el.textContent = Math.round(obj.val) + '%'; }
      });
      gsap.fromTo('#legendDone, #legendLeft', 
        { opacity: 0, y: 8 }, 
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, delay: 0.85, clearProps: 'all' }
      );
    } catch(e) {}
  };

  // ── Calendar ───────────────────────────────────────────────
  window.animateCalendar = function() {
    try {
      if (prefersReduced) return;
      gsap.fromTo('.week-day', 
        { opacity: 0, y: 10, scale: 0.88 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.04, ease: 'back.out(1.5)', delay: 0.8, clearProps: 'all' }
      );
      gsap.fromTo('.upcoming-item', 
        { opacity: 0, x: 12 }, 
        { opacity: 1, x: 0, duration: 0.38, stagger: 0.07, delay: 1.1, ease: 'power2.out', clearProps: 'all' }
      );
    } catch(e) {}
  };

  // ── Progress Bars ──────────────────────────────────────────
  window.animateProgressBars = function() {
    try {
      if (prefersReduced) return;
      document.querySelectorAll('.progress-fill').forEach(bar => {
        const target = bar.style.width;
        gsap.fromTo(bar, 
          { width: 0 }, 
          { width: target, duration: 0.95, ease: 'power2.out', delay: 0.5 }
        );
      });
    } catch(e) {}
  };

  // ── Page Transition Out ────────────────────────────────────
  try {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || prefersReduced) return;
        e.preventDefault();
        gsap.to('.main-content', {
          opacity: 0, y: -16, duration: 0.28, ease: 'power2.in',
          onComplete: () => { window.location.href = href; }
        });
      });
    });
  } catch(e) {}
}
