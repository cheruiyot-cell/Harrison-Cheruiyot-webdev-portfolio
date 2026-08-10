/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Production-ready JavaScript: Accessibility, Interactivity, Performance
 * Version 3.0.0 – Lightweight & Fast
 */

(function () {
  'use strict';

  // ---------- DOM READY ----------
  document.addEventListener('DOMContentLoaded', function () {
    initCurrentYear();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavHighlight();
    initFormValidation();
    initWhatsAppInteractions();
    initAccessibilityEnhancements();
    initScrollProgressIndicator();
    initLazyLoadImages();
  });

  // ---------- 1. DYNAMIC COPYRIGHT YEAR ----------
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // ---------- 2. MOBILE MENU (Lightweight) ----------
  function initMobileMenu() {
    const toggleCheckbox = document.getElementById('menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('#primary-navigation .nav-links a');
    const hamburgerLabel = document.querySelector('.hamburger');

    if (!toggleCheckbox || !hamburgerLabel) return;

    function updateAriaAndBody() {
      const isExpanded = toggleCheckbox.checked;
      hamburgerLabel.setAttribute('aria-expanded', isExpanded);
      document.body.style.overflow = isExpanded ? 'hidden' : '';
      
      if (isExpanded && navLinks.length > 0) {
        setTimeout(() => navLinks[0].focus(), 100);
      }
    }

    toggleCheckbox.addEventListener('change', updateAriaAndBody);

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (toggleCheckbox.checked) {
          toggleCheckbox.checked = false;
          updateAriaAndBody();
          hamburgerLabel.focus();
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggleCheckbox.checked) {
        toggleCheckbox.checked = false;
        updateAriaAndBody();
        hamburgerLabel.focus();
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function () {
        if (toggleCheckbox.checked) {
          toggleCheckbox.checked = false;
          updateAriaAndBody();
        }
      });
    }

    updateAriaAndBody();
  }

  // ---------- 3. SMOOTH SCROLL (Lightweight) ----------
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
          const offsetPosition = elementPosition - headerHeight - 24;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  }

  // ---------- 4. SCROLL-TRIGGERED ANIMATIONS (Optimized) ----------
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.fade-up, .project-card, .service-card, .pricing-card, .step, .about-image, .about-content'
    );

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ---------- 5. ACTIVE NAVIGATION HIGHLIGHT (Lightweight) ----------
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight + 50 : 120;

    if (sections.length === 0 || navLinks.length === 0) return;

    let ticking = false;

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
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(highlightNavigation);
        ticking = false;
      }
      ticking = true;
    }, { passive: true });

    highlightNavigation();
  }

  // ---------- 6. FORM VALIDATION (Lightweight) ----------
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = form.querySelector('.btn-submit');

    const inputs = [nameInput, emailInput, messageInput].filter(Boolean);

    inputs.forEach(input => {
      input.addEventListener('blur', function () {
        validateField(input, true);
      });
    });

    function validateField(field, showError = false) {
      const formGroup = field.closest('.form-group');
      if (!formGroup) return true;

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

      if (!isValid && showError) {
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
        if (field.value.trim() !== '') {
          formGroup.classList.add('has-success');
        } else {
          formGroup.classList.remove('has-success');
        }
      }

      return isValid;
    }

    form.addEventListener('submit', function (e) {
      let formValid = true;

      inputs.forEach(input => {
        const valid = validateField(input, true);
        if (!valid) formValid = false;
      });

      if (!formValid) {
        e.preventDefault();
        const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
        if (firstInvalid) firstInvalid.focus();
      } else {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          submitButton.setAttribute('aria-busy', 'true');
        }
      }
    });
  }

  // ---------- 7. WHATSAPP BUTTON INTERACTIONS (Lightweight) ----------
  function initWhatsAppInteractions() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;

    whatsappBtn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.08)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
    });

    whatsappBtn.addEventListener('focus', function () {
      this.style.transform = 'scale(1.08)';
    });
    
    whatsappBtn.addEventListener('blur', function () {
      this.style.transform = 'scale(1)';
    });
  }

  // ---------- 8. ACCESSIBILITY ENHANCEMENTS (Lightweight) ----------
  function initAccessibilityEnhancements() {
    const allButtons = document.querySelectorAll('.btn, .project-link, .hamburger');
    allButtons.forEach(btn => {
      if (!btn.getAttribute('role') && btn.tagName !== 'BUTTON' && btn.tagName !== 'A' && btn.tagName !== 'LABEL') {
        btn.setAttribute('role', 'button');
      }
    });

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

  // ---------- 9. SCROLL PROGRESS INDICATOR (Lightweight) ----------
  function initScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = (window.scrollY / windowHeight) * 100;
          progressBar.style.transform = `scaleX(${scrolled / 100})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- 10. LAZY LOAD IMAGES (Native + Fallback) ----------
  function initLazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    // Use native lazy loading with fallback
    if ('loading' in HTMLImageElement.prototype) {
      images.forEach(img => {
        img.loading = 'lazy';
      });
    } else {
      // Fallback for older browsers using IntersectionObserver
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
              }
              imageObserver.unobserve(img);
            }
          });
        });

        images.forEach(img => {
          // Store original src as data-src if not already set
          if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = '';
          }
          imageObserver.observe(img);
        });
      }
    }
  }

})();