/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Version 5.0.1 – Accessible, Optimized, Conversion-Focused
 *
 * Features:
 * - Mobile menu (button, ARIA, focus management)
 * - Smooth scrolling with offset
 * - Scroll-triggered animations
 * - Active navigation highlighting
 * - FAQ accordion (native details, minimal JS)
 * - Animated statistics counters
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
  });

  // ==============================================
  // 1. DYNAMIC COPYRIGHT YEAR
  // ==============================================
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // ==============================================
  // 2. MOBILE MENU (accessible button)
  // ==============================================
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
      // Focus first link
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

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // Close on overlay click
    overlay.addEventListener('click', closeMenu);

    // Close on nav link click
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
  }

  // ==============================================
  // 3. SMOOTH SCROLL (with header offset)
  // ==============================================
  function initSmoothScroll() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 76;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const position = target.getBoundingClientRect().top + window.pageYOffset;
          const offset = position - headerHeight - 24;

          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });

          // Set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // ==============================================
  // 4. SCROLL-TRIGGERED ANIMATIONS
  // ==============================================
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up, .project-card, .service-card, .pricing-card, .step, .benefit-item');

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ==============================================
  // 5. ACTIVE NAVIGATION HIGHLIGHT
  // ==============================================
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    const header = document.querySelector('.site-header');
    const offset = header ? header.offsetHeight + 50 : 120;

    if (!sections.length || !navLinks.length) return;

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

  // ==============================================
  // 6. FAQ ACCORDION – Close others on click outside
  // (native details handles open/close)
  // ==============================================
  function initFaqCloseOnOutside() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.faq-item')) {
        faqItems.forEach(function (item) {
          item.open = false;
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        faqItems.forEach(function (item) {
          item.open = false;
        });
      }
    });
  }

  // ==============================================
  // 7. ANIMATED STATISTICS COUNTERS
  // ==============================================
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
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
      {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
      }
    );

    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/,/g, ''), 10);
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
})();