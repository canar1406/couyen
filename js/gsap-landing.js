/**
 * gsap-landing.js – v2 (safe)
 * Fix: CSS safety-net first, GSAP runs after, try-catch bảo vệ
 * frontend-design: < 600ms load, 100ms stagger, no jank
 */

// ── Safety: ensure nav visible regardless of JS errors ──────
// These will be overridden by GSAP if it runs correctly
const _navEl = document.getElementById('landingNav');
if (_navEl) _navEl.style.opacity = '1';

// ── Guard: run only when GSAP is available ───────────────────
if (typeof gsap === 'undefined') {
  console.warn('[GSAP] Library not loaded – animations skipped');
  // Make sure everything is visible
  document.querySelectorAll('.hero-badge,.hero-title,.hero-desc,.hero-stats,.hero-actions,.teacher-card,.float-badge-1,.float-badge-2')
    .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
} else {
  // ── Register Plugins ──────────────────────────────────────
  try { gsap.registerPlugin(ScrollTrigger); } catch(e) {}
  try { gsap.registerPlugin(TextPlugin); } catch(e) {}

  // ── Reduced Motion: use instant reveals, NOT timeScale(0) ─
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dur = prefersReduced ? 0 : 1; // scale factor

  // ── Scroll Progress Bar ───────────────────────────────────
  try {
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar && !prefersReduced) {
      gsap.to(progressBar, {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: document.body, start: 'top top',
          end: 'bottom bottom', scrub: 0.3
        }
      });
    }
  } catch(e) {}

  // ── Cursor Glow ───────────────────────────────────────────
  try {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && !prefersReduced) {
      const hero = document.getElementById('home');
      if (hero) {
        let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
        hero.addEventListener('mousemove', (e) => { targetX = e.clientX; targetY = e.clientY; });
        hero.addEventListener('mouseleave', () => gsap.to(cursorGlow, { opacity: 0, duration: 0.4 }));
        hero.addEventListener('mouseenter', () => gsap.to(cursorGlow, { opacity: 1, duration: 0.4 }));
        gsap.ticker.add(() => {
          glowX += (targetX - glowX) * 0.08;
          glowY += (targetY - glowY) * 0.08;
          gsap.set(cursorGlow, { x: glowX, y: glowY });
        });
      }
    }
  } catch(e) {}

  // ── Hero Entrance Timeline ────────────────────────────────
  try {
    const heroTL = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: prefersReduced ? 0 : 0.05
    });

    // Nav loads FIRST (fromTo ensures no flash and overrides FOUC class)
    heroTL.fromTo('#landingNav', 
      { y: -60, opacity: 0, visibility: 'hidden' }, 
      { y: 0, opacity: 1, visibility: 'visible', duration: 0.45 * dur || 0.45 }
    );
    
    // Then the rest staggered
    heroTL
      .fromTo('.hero-badge',        
        { y: 20, opacity: 0, scale: 0.9, visibility: 'hidden' }, 
        { y: 0, opacity: 1, scale: 1, visibility: 'visible', duration: 0.38 * dur || 0.38 }, '-=0.15')
      .fromTo('.hero-title',        
        { y: 40, opacity: 0, visibility: 'hidden' }, 
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.5 * dur || 0.5 }, '-=0.15')
      .fromTo('.hero-desc',         
        { y: 22, opacity: 0, visibility: 'hidden' }, 
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.4 * dur || 0.4 }, '-=0.25')
      .fromTo('.hero-stats .hero-stat', 
        { y: 18, opacity: 0, visibility: 'hidden' }, 
        { y: 0, opacity: 1, visibility: 'visible', duration: 0.35 * dur || 0.35, stagger: 0.08 }, '-=0.2')
      .fromTo('.hero-actions .btn', 
        { y: 14, opacity: 0, scale: 0.95, visibility: 'hidden' }, 
        { y: 0, opacity: 1, scale: 1, visibility: 'visible', duration: 0.35 * dur || 0.35, stagger: 0.1 }, '-=0.2')
      .fromTo('.teacher-card',      
        { x: 55, opacity: 0, visibility: 'hidden' }, 
        { x: 0, opacity: 1, visibility: 'visible', duration: 0.6 * dur || 0.6, ease: 'back.out(1.4)' }, '-=0.38')
      .fromTo('.float-badge-1',     
        { x: -28, opacity: 0, visibility: 'hidden' }, 
        { x: 0, opacity: 1, visibility: 'visible', duration: 0.4 * dur || 0.4, ease: 'back.out(1.7)' }, '-=0.28')
      .fromTo('.float-badge-2',     
        { x: 28, opacity: 0, visibility: 'hidden' }, 
        { x: 0, opacity: 1, visibility: 'visible', duration: 0.4 * dur || 0.4, ease: 'back.out(1.7)' }, '-=0.32');

    // Smooth float animation managed by GSAP (no conflicts with CSS transforms)
    if (!prefersReduced) {
      gsap.to('.teacher-card', {
        y: -12,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1 // Start floating after entrance animation finishes
      });
    }

  } catch(e) {
    console.warn('[GSAP] Hero timeline error:', e);
    // Fallback: remove FOUC class and ensure visibility
    document.querySelectorAll('.gsap-fouc').forEach(el => el.classList.remove('gsap-fouc'));
    document.querySelectorAll('#landingNav,.hero-badge,.hero-title,.hero-desc,.hero-stats .hero-stat,.hero-actions .btn,.teacher-card,.float-badge-1,.float-badge-2')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ── Mesh Orb Parallax ─────────────────────────────────────
  try {
    if (!prefersReduced) {
      document.querySelectorAll('.mesh-orb').forEach((orb, i) => {
        const speed = [0.12, 0.08, 0.15][i];
        gsap.to(orb, {
          y: () => -window.innerHeight * speed, ease: 'none',
          scrollTrigger: {
            trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5
          }
        });
      });
    }
  } catch(e) {}

  // ── Stats Bar entrance ────────────────────────────────────
  try {
    if (!prefersReduced) {
      gsap.from('.stats-bar-container .stat-item', {
        y: 28, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.stats-bar', start: 'top 85%', once: true }
      });
    }
  } catch(e) {}

  // ── Feature Cards – Reliable Scroll Trigger ──────────────
  try {
    if (!prefersReduced) {
      gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          opacity: 0, y: 35, scale: 0.96,
          duration: 0.55, ease: 'power2.out',
          delay: (i % 3) * 0.1, // Stagger per row logically
          scrollTrigger: { trigger: card, start: 'top 90%', once: true }
        });
      });
    }
  } catch(e) {}

  // ── Section headers ───────────────────────────────────────
  try {
    if (!prefersReduced) {
      gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      });
    }
  } catch(e) {}

  // ── Achievement Rows ──────────────────────────────────────
  try {
    if (!prefersReduced) {
      gsap.utils.toArray('.achievement-row').forEach((row, i) => {
        gsap.from(row, {
          opacity: 0, x: -25, duration: 0.5, ease: 'power2.out', delay: i * 0.07,
          scrollTrigger: { trigger: row, start: 'top 90%', once: true }
        });
      });
    }
  } catch(e) {}

  // ── Scores Card ───────────────────────────────────────────
  try {
    if (!prefersReduced) {
      gsap.from('.score-row', { 
        opacity: 0, x: 18, duration: 0.4, stagger: 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: '.scores-card', start: 'top 80%', once: true }
      });
    }
  } catch(e) {}

  // ── Register Card ─────────────────────────────────────────
  try {
    gsap.from('.register-card', {
      opacity: 0, y: 45, scale: 0.97, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: '.register-section', start: 'top 75%', once: true }
    });
  } catch(e) {}

  // ── Nav scroll class (Native for reliability) ─────────────
  try {
    window.addEventListener('scroll', () => {
      const nav = document.getElementById('landingNav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  } catch(e) {}

  // ── Magnetic buttons ──────────────────────────────────────
  try {
    if (!prefersReduced) {
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const moveX = (e.clientX - rect.left - rect.width / 2) * 0.12;
          const moveY = (e.clientY - rect.top - rect.height / 2) * 0.12;
          gsap.to(btn, { x: moveX, y: moveY, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }
  } catch(e) {}

  // ── Floating Particles ────────────────────────────────────
  try {
    if (!prefersReduced) {
      const container = document.querySelector('.particles-container');
      if (container) {
        for (let i = 0; i < 16; i++) {
          const p = document.createElement('div');
          p.className = 'particle';
          const size = gsap.utils.random(3, 6);
          gsap.set(p, { left: `${gsap.utils.random(5, 95)}%`, width: size, height: size });
          container.appendChild(p);
          gsap.to(p, {
            y: -window.innerHeight * gsap.utils.random(0.8, 1.2),
            duration: gsap.utils.random(8, 16),
            delay: gsap.utils.random(0, 10),
            repeat: -1, ease: 'none', opacity: 0
          });
        }
      }
    }
  } catch(e) {}

  // ── Page Transition Out ───────────────────────────────────
  try {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        e.preventDefault();
        const overlay = document.querySelector('.page-transition');
        if (overlay && !prefersReduced) {
          gsap.to(overlay, {
            y: 0, duration: 0.35, ease: 'power3.in',
            onComplete: () => { window.location.href = href; }
          });
        } else {
          window.location.href = href;
        }
      });
    });
  } catch(e) {}
}
