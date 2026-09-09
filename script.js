/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Version 5.0.0 – Accessible, Optimized, Conversion-Focused
 *
 * Features:
 * - Mobile menu (button, ARIA, focus management)
 * - Smooth scrolling with offset
 * - Scroll-triggered animations
 * - Active navigation highlighting
 * - Form validation with inline errors
 * - Animated statistics counters
 * - Scroll progress indicator
 * - WhatsApp button interactions
 * - FAQ accordion (native details, minimal JS)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initFormValidation();
    initWhatsAppInteractions();
    initScrollProgressIndicator();
    initStatCounters();
    initFaqCloseOnOutside();
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
  // 6. FORM VALIDATION
  // ==============================================
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitBtn = form.querySelector('.btn-submit');

    const inputs = [name, email, message].filter(Boolean);

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input, true);
      });
    });

    function validateField(field, showError) {
      const group = field.closest('.form-group');
      if (!group) return true;

      let errorSpan = group.querySelector('.field-error');
      if (errorSpan) errorSpan.remove();

      let isValid = true;
      let errorMsg = '';

      if (field.hasAttribute('required') && field.value.trim() === '') {
        isValid = false;
        errorMsg = 'This field is required.';
      } else if (field.type === 'email' && field.value.trim() !== '') {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(field.value.trim())) {
          isValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      }

      if (!isValid && showError) {
        group.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');

        errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.setAttribute('role', 'alert');
        errorSpan.id = field.id + '-error';
        errorSpan.textContent = errorMsg;
        group.appendChild(errorSpan);

        // Set aria-describedby
        field.setAttribute('aria-describedby', errorSpan.id);
      } else {
        group.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        if (field.value.trim() !== '') {
          group.classList.add('has-success');
        } else {
          group.classList.remove('has-success');
        }
      }

      return isValid;
    }

    form.addEventListener('submit', function (e) {
      let isValid = true;

      inputs.forEach(function (input) {
        if (!validateField(input, true)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();
      } else {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
          submitBtn.setAttribute('aria-busy', 'true');
        }
      }
    });
  }

  // ==============================================
  // 7. WHATSAPP BUTTON INTERACTIONS
  // ==============================================
  function initWhatsAppInteractions() {
    const btn = document.querySelector('.whatsapp-float');
    if (!btn) return;

    function scaleUp() { btn.style.transform = 'scale(1.08)'; }
    function scaleDown() { btn.style.transform = 'scale(1)'; }

    btn.addEventListener('mouseenter', scaleUp);
    btn.addEventListener('mouseleave', scaleDown);
    btn.addEventListener('focus', scaleUp);
    btn.addEventListener('blur', scaleDown);
  }

  // ==============================================
  // 8. SCROLL PROGRESS INDICATOR
  // ==============================================
  function initScrollProgressIndicator() {
    const progress = document.querySelector('.scroll-progress');
    if (!progress) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = Math.min(100, (window.scrollY / scrollHeight) * 100);
          progress.style.transform = 'scaleX(' + scrolled / 100 + ')';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ==============================================
  // 9. FAQ ACCORDION – Close others on click outside
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
  // 10. ANIMATED STATISTICS COUNTERS
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