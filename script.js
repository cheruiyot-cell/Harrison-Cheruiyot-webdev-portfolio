/**
 * Harrison Cheruiyot — Portfolio
 * Production build v6.2
 * --------------------------------------------------------------------------
 * CHANGES IN v6.2
 *  - [FIX]  Added js-ready handshake. On init, documentElement gets the
 *           .js-ready class. If script.js fails to run, the inline head
 *           script removes .js after 2.5s, revealing all content. This
 *           eliminates the "blank sections under JS failure" risk while
 *           keeping zero-flash behavior on success.
 *  - [FIX]  Removed initFaqCloseOnOutside() — it force-closed all open
 *           <details> on any outside click, which is hostile to users
 *           comparing answers. Native <details> gives the user full control.
 *  - [FIX]  Magnetic buttons now gated behind matchMedia for
 *           (hover: hover) and (pointer: fine), matching the CSS gate.
 *           Also removed will-change reliance from the CSS side.
 * --------------------------------------------------------------------------
 * CHANGES IN v6.1
 *  - Removed initHeroEntrance() entirely. Hero is always visible on first
 *    paint (Fix 2b). Improves LCP and eliminates a failure mode.
 * --------------------------------------------------------------------------
 * CHANGES IN v6.0
 *  - Stat counters handle prefix/suffix ("23+", "4.9★", "3 days", "70%")
 *  - Hardened null/undefined checks
 *  - No-JS fallback via the .js class (see <head> + CSS)
 *  - Respects prefers-reduced-motion throughout
 * --------------------------------------------------------------------------
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // [v6.2] Confirm to the head script that we actually ran.
    // If this never fires, the head script's 2.5s timer removes .js.
    document.documentElement.classList.add('js-ready');

    initCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initStatCounters();
    initMagneticButtons();
    initBackToTop();
  }

  /* ----------------------------------------------------------------
     HELPERS
     ---------------------------------------------------------------- */
  const prefersReducedMotion = function () {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const hasFinePointer = function () {
    if (!window.matchMedia) return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  };

  /* ----------------------------------------------------------------
     1. DYNAMIC COPYRIGHT YEAR
     ---------------------------------------------------------------- */
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------
     2. MOBILE MENU
     ---------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle  = document.getElementById('menu-toggle');
    const nav     = document.getElementById('primary-navigation');
    const overlay = document.getElementById('nav-overlay');
    if (!toggle || !nav || !overlay) return;

    let isOpen = false;

    function openMenu() {
      isOpen = true;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
      nav.classList.add('active');
      overlay.classList.add('active');
      overlay.hidden = false;
      document.body.style.overflow = 'hidden';

      const firstLink = nav.querySelector('a');
      if (firstLink) {
        requestAnimationFrame(function () { firstLink.focus(); });
      }
    }

    function closeMenu() {
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      overlay.hidden = true;
      document.body.style.overflow = '';
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    overlay.addEventListener('click', closeMenu);

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });

    const mq = window.matchMedia('(min-width: 769px)');
    const handleResize = function (e) {
      if (e.matches && isOpen) closeMenu();
    };
    if (mq.addEventListener) mq.addEventListener('change', handleResize);
    else if (mq.addListener) mq.addListener(handleResize);
  }

  /* ----------------------------------------------------------------
     3. SMOOTH SCROLL FOR IN-PAGE ANCHORS
     ---------------------------------------------------------------- */
  function initSmoothScroll() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 76;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const position = target.getBoundingClientRect().top + window.pageYOffset;
        const offset   = position - headerHeight - 24;

        window.scrollTo({
          top: offset,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });

        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ----------------------------------------------------------------
     4. SCROLL ANIMATIONS + STAGGER
     ---------------------------------------------------------------- */
  function initScrollAnimations() {
    const elements = document.querySelectorAll(
      '.fade-up, .portfolio-card, .service-card, .pricing-card, .step, .testimonial-card'
    );
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    document.querySelectorAll('.stagger-parent').forEach(function (parent) {
      const children = parent.children;
      for (let i = 0; i < children.length; i++) {
        children[i].style.transitionDelay = (i * 80) + 'ms';
      }
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------------
     5. ACTIVE NAV HIGHLIGHT
     ---------------------------------------------------------------- */
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    const header   = document.querySelector('.site-header');
    if (!sections.length || !navLinks.length) return;

    const offset = header ? header.offsetHeight + 50 : 120;
    let ticking = false;

    function highlightNav() {
      let currentId = '';
      const scrollY = window.scrollY + offset;

      sections.forEach(function (section) {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentId = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active-nav');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === currentId) {
          link.classList.add('active-nav');
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          highlightNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    highlightNav();
  }

  /* ----------------------------------------------------------------
     6. ANIMATED STATISTICS
     Handles: "23" → 23, "23+" → 23+, "4.9★" → 4.9★,
              "3 days" → 3 days, "70%" → 70%
     ---------------------------------------------------------------- */
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.about-stat .number');
    if (!statNumbers.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.15 }
    );

    statNumbers.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    const original = el.textContent.trim();

    const match = original.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const prefix    = match[1];
    const targetNum = parseFloat(match[2]);
    const suffix    = match[3];
    const isDecimal = match[2].indexOf('.') !== -1;

    if (!isFinite(targetNum)) return;

    if (prefersReducedMotion()) {
      el.textContent = original;
      return;
    }

    const duration  = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * targetNum;

      const displayValue = isDecimal
        ? current.toFixed(1)
        : Math.round(current).toString();

      el.textContent = prefix + displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = original;
        el.classList.add('pulse-complete');
        setTimeout(function () {
          el.classList.remove('pulse-complete');
        }, 2000);
      }
    }

    requestAnimationFrame(update);
  }

  /* ----------------------------------------------------------------
     7. MAGNETIC BUTTONS
     [v6.2] Gated to fine-pointer devices with hover capability.
     Touch devices never fire mousemove, so this is a no-op there and
     we avoid attaching useless listeners.
     ---------------------------------------------------------------- */
  function initMagneticButtons() {
    if (prefersReducedMotion()) return;
    if (!hasFinePointer()) return;

    const magneticElements = document.querySelectorAll('.magnetic');
    if (!magneticElements.length) return;

    const strength = 0.3;

    magneticElements.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform =
          'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------------
     8. BACK TO TOP
     ---------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const SHOW_AFTER = 400;

    function updateVisibility() {
      if (window.scrollY > SHOW_AFTER) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });

      const skipLink = document.getElementById('skip-link');
      if (skipLink) skipLink.focus({ preventScroll: true });
    });

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateVisibility();
  }

})();