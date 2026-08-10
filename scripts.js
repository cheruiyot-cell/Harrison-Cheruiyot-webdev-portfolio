/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Production-ready JavaScript: Accessibility, Animations, Interactivity
 * Version 1.0.0
 */

(function () {
  'use strict';

  // ---------- DOM READY ----------
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initFormValidation();
    initParallaxHeroEffect();
    initCounterAnimation();
    initWhatsAppPulse();
    initAccessibilityEnhancements();
  });

  // ---------- 1. DYNAMIC COPYRIGHT YEAR ----------
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // ---------- 2. MOBILE MENU (Accessible & Robust) ----------
  function initMobileMenu() {
    const toggleCheckbox = document.getElementById('menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('#primary-navigation .nav-links a');
    const hamburgerLabel = document.querySelector('.hamburger');

    if (!toggleCheckbox || !hamburgerLabel) return;

    // Update ARIA expanded attribute on toggle
    function updateAriaExpanded() {
      const isExpanded = toggleCheckbox.checked;
      if (hamburgerLabel) {
        hamburgerLabel.setAttribute('aria-expanded', isExpanded);
      }
      // Prevent body scroll when menu open
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    }

    toggleCheckbox.addEventListener('change', updateAriaExpanded);

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (toggleCheckbox.checked) {
          toggleCheckbox.checked = false;
          updateAriaExpanded();
        }
      });
    });

    // Close menu when overlay is clicked (label triggers checkbox)
    if (navOverlay) {
      navOverlay.addEventListener('click', function (e) {
        // The label toggles the checkbox, so we just ensure state is updated
        setTimeout(updateAriaExpanded, 50);
      });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggleCheckbox.checked) {
        toggleCheckbox.checked = false;
        updateAriaExpanded();
        // Return focus to hamburger
        if (hamburgerLabel) hamburgerLabel.focus();
      }
    });

    // Initialize ARIA
    updateAriaExpanded();
  }

  // ---------- 3. SMOOTH SCROLL (with offset for sticky header) ----------
  function initSmoothScroll() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 76;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight - 16;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Set focus to target for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  }

  // ---------- 4. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer) ----------
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.fade-up, .project-card, .service-card, .pricing-card, .step, .about-image, .about-content'
    );

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Add stagger effect for cards inside grids
          if (entry.target.classList.contains('project-card') ||
              entry.target.classList.contains('service-card') ||
              entry.target.classList.contains('pricing-card')) {
            entry.target.style.transitionDelay = '0.1s';
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      // Preserve initial animation state
      el.classList.add('will-animate');
      observer.observe(el);
    });
  }

  // ---------- 5. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL ----------
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight + 30 : 100;

    if (sections.length === 0 || navLinks.length === 0) return;

    function highlightNavigation() {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + headerHeight;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active-nav');
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref.substring(1) === currentSectionId) {
          link.classList.add('active-nav');
        }
      });

      // If at bottom of page, highlight last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        navLinks.forEach(link => link.classList.remove('active-nav'));
        const lastLink = navLinks[navLinks.length - 1];
        if (lastLink && lastLink.getAttribute('href') !== '#contact') {
          // keep last visible
        }
      }
    }

    window.addEventListener('scroll', highlightNavigation, { passive: true });
    highlightNavigation(); // initial call
  }

  // ---------- 6. FORM VALIDATION & ACCESSIBLE ERROR HANDLING ----------
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = form.querySelector('.btn-submit');

    // Real-time validation feedback
    const inputs = [nameInput, emailInput, messageInput].filter(Boolean);

    inputs.forEach(input => {
      input.addEventListener('input', function () {
        validateField(input);
      });

      input.addEventListener('blur', function () {
        validateField(input, true);
      });
    });

    function validateField(field, showError = false) {
      const formGroup = field.closest('.form-group');
      if (!formGroup) return true;

      // Remove existing error message
      const existingError = formGroup.querySelector('.field-error');
      if (existingError) existingError.remove();

      let isValid = true;
      let errorMessage = '';

      if (field.hasAttribute('required') && field.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required.';
      } else if (field.type === 'email' && field.value.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
      }

      // Toggle error class and message
      if (!isValid && (showError || field.dataset.touched === 'true')) {
        formGroup.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.setAttribute('role', 'alert');
        errorSpan.textContent = errorMessage;
        formGroup.appendChild(errorSpan);
      } else {
        formGroup.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
      }

      if (showError) {
        field.dataset.touched = 'true';
      }

      return isValid;
    }

    // Form submission
    form.addEventListener('submit', function (e) {
      let formValid = true;

      inputs.forEach(input => {
        const valid = validateField(input, true);
        if (!valid) formValid = false;
      });

      if (!formValid) {
        e.preventDefault();
        // Focus first invalid field
        const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();

        // Announce error to screen readers
        const alertDiv = document.createElement('div');
        alertDiv.setAttribute('role', 'alert');
        alertDiv.className = 'sr-only';
        alertDiv.textContent = 'Please correct the errors in the form before submitting.';
        form.prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
      } else {
        // Show loading state
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          submitButton.setAttribute('aria-busy', 'true');
        }
        // Form will submit normally to Formspree
      }
    });
  }

  // ---------- 7. HERO PARALLAX / SUBTLE MOVEMENT ----------
  function initParallaxHeroEffect() {
    const hero = document.querySelector('.hero');
    if (!hero || window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;

          if (scrollY < heroHeight) {
            const translateY = scrollY * 0.15;
            const opacity = 1 - scrollY / (heroHeight * 1.2);
            hero.style.transform = `translateY(${translateY}px)`;
            hero.style.opacity = Math.max(opacity, 0.7);
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- 8. COUNTER ANIMATION FOR ABOUT STATS ----------
  function initCounterAnimation() {
    const stats = document.querySelectorAll('.about-stats strong');
    if (stats.length === 0) return;

    const observerOptions = {
      threshold: 0.6,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const aboutSection = document.querySelector('.about');
    if (aboutSection) observer.observe(aboutSection);

    function animateCounters() {
      stats.forEach(stat => {
        const text = stat.textContent || '';
        const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
        const suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');

        if (isNaN(numericValue)) return;

        let startValue = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * numericValue);

          stat.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = numericValue + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }
  }

  // ---------- 9. WHATSAPP BUTTON SUBTLE PULSE ----------
  function initWhatsAppPulse() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;

    // Add a gentle pulse that stops on hover/focus
    whatsappBtn.addEventListener('mouseenter', function () {
      this.style.animationPlayState = 'paused';
    });

    whatsappBtn.addEventListener('mouseleave', function () {
      this.style.animationPlayState = 'running';
    });

    whatsappBtn.addEventListener('focus', function () {
      this.style.animationPlayState = 'paused';
    });

    whatsappBtn.addEventListener('blur', function () {
      this.style.animationPlayState = 'running';
    });
  }

  // ---------- 10. ACCESSIBILITY ENHANCEMENTS ----------
  function initAccessibilityEnhancements() {
    // Ensure all interactive elements are keyboard accessible
    const allButtons = document.querySelectorAll('.btn, .project-link, .hamburger');
    allButtons.forEach(btn => {
      if (!btn.getAttribute('role') && btn.tagName !== 'BUTTON' && btn.tagName !== 'A' && btn.tagName !== 'LABEL') {
        btn.setAttribute('role', 'button');
      }
      if (btn.tagName !== 'A' && btn.tagName !== 'BUTTON' && btn.tagName !== 'LABEL' && !btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
    });

    // Add skip-to-content link (in case it's missing)
    if (!document.querySelector('.skip-to-content')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#work';
      skipLink.className = 'skip-to-content';
      skipLink.textContent = 'Skip to main content';
      document.body.prepend(skipLink);
    }

    // Enhance form field accessibility
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
      const label = field.closest('.form-group')?.querySelector('label');
      if (label && !field.getAttribute('aria-labelledby') && !field.getAttribute('aria-label')) {
        const labelId = label.getAttribute('for') || (label.textContent.trim().replace(/\s+/g, '-').toLowerCase());
        if (labelId) {
          field.setAttribute('aria-labelledby', labelId);
        }
      }
    });
  }

  // ---------- UTILITY: Throttle function (if needed elsewhere) ----------
  function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // ---------- SERVICE WORKER REGISTRATION (optional for PWA) ----------
  // Uncomment if you have a service worker file
  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker.register('/sw.js').then(registration => {
  //       console.log('SW registered:', registration.scope);
  //     }).catch(err => console.log('SW registration failed:', err));
  //   });
  // }

})();