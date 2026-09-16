/**
 * Harrison Cheruiyot – Premium Portfolio
 * Version 5.4 – FAQ accordion close-on-outside fix
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initFaqCloseOnOutside();
    initStatCounters();
    initMagneticButtons();
    initHeroEntrance();
    initBackToTop();
  });

  // ============ 1. DYNAMIC COPYRIGHT ============
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // ============ 2. MOBILE MENU ============
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-navigation');
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
      if (firstLink) firstLink.focus();
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
  }

  // ============ 3. SMOOTH SCROLL ============
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
        const offset = position - headerHeight - 24;

        window.scrollTo({ top: offset, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  // ============ 4. SCROLL ANIMATIONS + STAGGER ============
  function initScrollAnimations() {
    const elements = document.querySelectorAll(
      '.fade-up, .portfolio-card, .service-card, .pricing-card, .step, .testimonial-card'
    );

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // Pre-compute stagger delays for children of .stagger-parent
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

  // ============ 5. ACTIVE NAV HIGHLIGHT ============
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    const header = document.querySelector('.site-header');

    if (!sections.length || !navLinks.length) return;

    const offset = header ? header.offsetHeight + 50 : 120;
    let ticking = false;

    function highlightNav() {
      let currentId = '';
      const scrollY = window.scrollY + offset;

      sections.forEach(function (section) {
        const top = section.offsetTop;
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

  // ============ 6. FAQ ACCORDION — CLOSE ON OUTSIDE ============
  function initFaqCloseOnOutside() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    // Click anywhere:
    // - Outside all FAQ items → close every FAQ.
    // - On a different FAQ than the one currently open → close the others.
    // - Inside an FAQ's own content/summary → leave it alone (native toggle handles it).
    document.addEventListener('click', function (e) {
      const target = e.target;

      faqItems.forEach(function (item) {
        // `contains` safely returns false for non-Node targets.
        if (!item.contains(target)) {
          item.open = false;
        }
      });
    });

    // Escape key closes all FAQs.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        faqItems.forEach(function (item) {
          item.open = false;
        });
      }
    });
  }

  // ============ 7. ANIMATED STATISTICS ============
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.about-stat .number');
    if (!statNumbers.length || !('IntersectionObserver' in window)) return;

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

    statNumbers.forEach(function (el) {
      if (/^\d+(\.\d+)?$/.test(el.textContent.trim())) {
        observer.observe(el);
      }
    });
  }

  function animateCounter(el) {
    const raw = el.textContent.replace(/[^0-9]/g, '');
    const target = parseInt(raw, 10) || 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString();
      el.style.opacity = Math.min(1, eased * 1.5);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
        el.style.opacity = '1';
        el.classList.add('pulse-complete');
        setTimeout(function () {
          el.classList.remove('pulse-complete');
        }, 2000);
      }
    }

    requestAnimationFrame(update);
  }

  // ============ 8. MAGNETIC BUTTONS ============
  function initMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const magneticElements = document.querySelectorAll('.magnetic');
    if (!magneticElements.length) return;

    const strength = 0.3;

    magneticElements.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  // ============ 9. HERO ENTRANCE ANIMATION ============
  function initHeroEntrance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hero.classList.add('hero-animate');
      return;
    }

    setTimeout(function () {
      hero.classList.add('hero-animate');
    }, 100);
  }

  // ============ 10. BACK TO TOP ============
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const SHOW_AFTER = 400; // px scrolled before showing the button

    function updateVisibility() {
      if (window.scrollY > SHOW_AFTER) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Move focus to top for keyboard / screen-reader users.
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