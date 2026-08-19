/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Version 4.0.0 – Clean, Professional, Conversion-Focused
 * 
 * Features:
 * - Mobile menu with click-outside close
 * - Smooth scrolling with offset
 * - Scroll-triggered animations
 * - Active navigation highlighting
 * - Form validation with inline errors
 * - FAQ accordion with auto-close
 * - Animated statistics counters
 * - Scroll progress indicator
 * - WhatsApp button interactions
 */

(function () {
  'use strict';

  // ==============================================
  // DOM READY – Initialize all modules
  // ==============================================
  document.addEventListener('DOMContentLoaded', function () {
    initCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initFormValidation();
    initWhatsAppInteractions();
    initScrollProgressIndicator();
    initFaqAccordion();
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
  // 2. MOBILE MENU (with click-outside close)
  // ==============================================
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const overlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('#primary-navigation .nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('primary-navigation');

    // Exit if required elements are missing
    if (!toggle || !hamburger || !nav) return;

    /**
     * Update ARIA attributes and body scroll lock
     * @param {boolean} isOpen - Whether the menu is open
     */
    function updateMenuState(isOpen) {
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Focus first nav link when menu opens
      if (isOpen && navLinks.length > 0) {
        setTimeout(() => navLinks[0].focus(), 100);
      }
    }

    // Toggle change event
    toggle.addEventListener('change', function () {
      updateMenuState(this.checked);
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (toggle.checked) {
          toggle.checked = false;
          updateMenuState(false);
          hamburger.focus();
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.checked) {
        toggle.checked = false;
        updateMenuState(false);
        hamburger.focus();
      }
    });

    // Close menu when overlay is clicked
    if (overlay) {
      overlay.addEventListener('click', function () {
        if (toggle.checked) {
          toggle.checked = false;
          updateMenuState(false);
        }
      });
    }

    /**
     * Close menu when clicking outside the menu area
     * Uses event delegation to detect clicks outside the nav and hamburger
     */
    document.addEventListener('click', function (e) {
      if (!toggle.checked) return;

      const isInsideNav = nav.contains(e.target);
      const isHamburger = hamburger.contains(e.target);
      const isToggle = e.target === toggle;

      if (!isInsideNav && !isHamburger && !isToggle) {
        toggle.checked = false;
        updateMenuState(false);
      }
    });

    // Initialize menu state
    updateMenuState(toggle.checked);
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

          // Make focusable and set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // ==============================================
  // 4. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
  // ==============================================
  function initScrollAnimations() {
    const elements = document.querySelectorAll(
      '.fade-up, .project-card, .service-card, .pricing-card, .step, .benefit-item'
    );

    // Fallback for older browsers
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
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

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            highlightNav();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    highlightNav();
  }

  // ==============================================
  // 6. FORM VALIDATION (with inline errors)
  // ==============================================
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitBtn = form.querySelector('.btn-submit');

    const inputs = [name, email, message].filter(Boolean);

    // Validate on blur
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input, true);
      });
    });

    /**
     * Validate a single form field
     * @param {HTMLElement} field - The input/textarea element
     * @param {boolean} showError - Whether to display error messages
     * @returns {boolean} - Whether the field is valid
     */
    function validateField(field, showError) {
      const group = field.closest('.form-group');
      if (!group) return true;

      // Remove existing error
      const existingError = group.querySelector('.field-error');
      if (existingError) existingError.remove();

      let isValid = true;
      let errorMsg = '';

      // Check required
      if (field.hasAttribute('required') && field.value.trim() === '') {
        isValid = false;
        errorMsg = 'This field is required.';
      }

      // Check email format
      if (isValid && field.type === 'email' && field.value.trim() !== '') {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(field.value.trim())) {
          isValid = false;
          errorMsg = 'Please enter a valid email address.';
        }
      }

      if (!isValid && showError) {
        group.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');

        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.setAttribute('role', 'alert');
        errorSpan.textContent = errorMsg;
        group.appendChild(errorSpan);
      } else {
        group.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
        if (field.value.trim() !== '') {
          group.classList.add('has-success');
        } else {
          group.classList.remove('has-success');
        }
      }

      return isValid;
    }

    // Form submit handler
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

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = Math.min(100, (window.scrollY / scrollHeight) * 100);
            progress.style.transform = 'scaleX(' + scrolled / 100 + ')';
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ==============================================
  // 9. FAQ ACCORDION (auto-close others)
  // ==============================================
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    function closeAll(exclude) {
      items.forEach(function (item) {
        if (item !== exclude && item.open) {
          item.open = false;
        }
      });
    }

    items.forEach(function (item) {
      const summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function (e) {
        const isOpen = item.open;
        closeAll(item);
        if (!isOpen) {
          item.open = true;
        }
        e.preventDefault();
      });
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.faq-item')) {
        closeAll();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAll();
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

  /**
   * Animate a counter from 0 to its target value
   * @param {HTMLElement} el - The element containing the number
   */
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