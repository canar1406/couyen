/**
 * gsap-course.js – v2 (safe)
 */

if (typeof gsap === 'undefined') {
  console.warn('[GSAP] Not loaded on course page');
} else {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d = prefersReduced ? 0.01 : 1;

  // ── Page Entrance ──────────────────────────────────────────
  try {
    const hasVisited = sessionStorage.getItem('ue_sidebar_loaded');
    sessionStorage.setItem('ue_sidebar_loaded', 'true');

    const pageTL = gsap.timeline({
      defaults: { ease: 'power3.out' },
      delay: prefersReduced ? 0 : 0.05
    });
    pageTL
      .fromTo('#mainSidebar',         { x: hasVisited ? 0 : -45, opacity: hasVisited ? 1 : 0 }, { x: 0, opacity: 1, duration: 0.45 * d })
      .fromTo('.course-progress-bar', { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 * d }, '-=0.18')
      .fromTo('.course-sidebar',      { x: -25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 * d }, '-=0.18')
      .fromTo('#contentArea .topbar', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 * d }, '-=0.28')
      .fromTo('#contentPanel',        { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.42 * d }, '-=0.18');

  } catch(e) {
    console.warn('[GSAP] Course entrance error:', e);
    document.querySelectorAll('#mainSidebar,.course-progress-bar,.course-sidebar,#contentArea .topbar,#contentPanel')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  // ── TOC Stagger ────────────────────────────────────────────
  window.animateTOC = function() {
    try {
      if (prefersReduced) return;
      const delay = 0.55;
      gsap.fromTo('.week-header', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.38, stagger: 0.06, delay, ease: 'power2.out' });
      gsap.fromTo('.file-item',   { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.28, stagger: 0.02, delay: delay + 0.28, ease: 'power2.out' });
      gsap.fromTo('.session-header', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.04, delay: delay + 0.15, ease: 'power2.out' });
    } catch(e) {}
  };

  // ── Progress Bar ───────────────────────────────────────────
  window.animateProgressBar = function(pct) {
    try {
      if (prefersReduced) {
        document.getElementById('courseProgressFill').style.width = pct + '%';
        document.getElementById('coursePctText').textContent = pct + '%';
        document.getElementById('tocProgressFill').style.width = pct + '%';
        return;
      }
      gsap.to('#courseProgressFill', { width: pct + '%', duration: 0.95, ease: 'power2.out' });
      gsap.to('#tocProgressFill',    { width: pct + '%', duration: 0.95, ease: 'power2.out' });
      const obj = { val: parseFloat(document.getElementById('coursePctText').textContent) || 0 };
      gsap.to(obj, {
        val: pct, duration: 0.95, ease: 'power2.out',
        onUpdate: () => {
          const el = document.getElementById('coursePctText');
          if (el) el.textContent = Math.round(obj.val) + '%';
        }
      });
    } catch(e) {
      // fallback
      try {
        document.getElementById('courseProgressFill').style.width = pct + '%';
        document.getElementById('coursePctText').textContent = pct + '%';
      } catch(e2) {}
    }
  };

  // ── Content Crossfade ──────────────────────────────────────
  window.animateContentIn = function() {
    try {
      if (prefersReduced) return;
      gsap.fromTo('#activeContent',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    } catch(e) {
      const el = document.getElementById('activeContent');
      if (el) el.style.opacity = '1';
    }
  };

  // ── Nav Transition ─────────────────────────────────────────
  window.animateNavTransition = function() {
    try {
      if (prefersReduced) return;
      gsap.from('#activeContent', { x: 20, opacity: 0, duration: 0.3, ease: 'power2.out' });
    } catch(e) {}
  };

  // ── Completed Tick ─────────────────────────────────────────
  window.animateCompletedTick = function(fileId) {
    try {
      if (prefersReduced) return;
      const el = document.getElementById(`status-${fileId}`);
      if (!el) return;
      gsap.fromTo(el, { scale: 0, rotation: -25 }, { scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(2.5)' });
    } catch(e) {}
  };

  // ── TOC Toggle ─────────────────────────────────────────────
  window.toggleTOCAnimation = function(open) {
    try {
      const sidebar = document.getElementById('courseSidebar');
      if (!sidebar) return;
      gsap.to(sidebar, {
        width: open ? 320 : 0,
        opacity: open ? 1 : 0,
        duration: prefersReduced ? 0 : 0.32,
        ease: open ? 'power2.out' : 'power2.in',
        onComplete: () => { sidebar.style.overflow = open ? 'hidden' : 'hidden'; }
      });
    } catch(e) {
      const sidebar = document.getElementById('courseSidebar');
      if (sidebar) sidebar.style.width = open ? '320px' : '0';
    }
  };
}
