/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Production-ready JavaScript: Accessibility, Interactivity, Performance
 * Version 3.1.0 – Lightweight & Fast
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
    initFaqAccordion();
    initStatCounters();
  });

  // ---------- 1. DYNAMIC COPYRIGHT YEAR ----------
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // ---------- 2. MOBILE MENU ----------
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

    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (toggleCheckbox.checked) {
          toggleCheckbox.checked = false;
          updateAriaAndBody();
          hamburgerLabel.focus();
        }
      });
    });

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

  // ---------- 3. SMOOTH SCROLL ----------
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

  // ---------- 4. SCROLL-TRIGGERED ANIMATIONS ----------
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

  // ---------- 5. ACTIVE NAVIGATION HIGHLIGHT ----------
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

  // ---------- 6. FORM VALIDATION ----------
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

  // ---------- 7. WHATSAPP BUTTON INTERACTIONS ----------
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

  // ---------- 8. ACCESSIBILITY ENHANCEMENTS ----------
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

  // ---------- 9. SCROLL PROGRESS INDICATOR ----------
  function initScrollProgressIndicator() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = Math.min(100, (window.scrollY / windowHeight) * 100);
          progressBar.style.transform = `scaleX(${scrolled / 100})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- 10. LAZY LOAD IMAGES ----------
  function initLazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
      images.forEach(img => {
        img.loading = 'lazy';
      });
    } else {
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
          if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = '';
          }
          imageObserver.observe(img);
        });
      }
    }
  }

  // ---------- 11. FAQ ACCORDION (Auto-close on outside click) ----------
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    function closeAllAccordions(excludeItem = null) {
      faqItems.forEach(item => {
        if (item !== excludeItem && item.open) {
          item.open = false;
        }
      });
    }

    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function (e) {
        // Toggle current accordion
        const isOpen = item.open;
        closeAllAccordions(item);
        if (!isOpen) {
          item.open = true;
        }
        e.preventDefault(); // Prevent default toggle behavior
      });
    });

    // Close on click outside any FAQ
    document.addEventListener('click', function (e) {
      const isInsideFaq = e.target.closest('.faq-item');
      if (!isInsideFaq) {
        closeAllAccordions();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllAccordions();
      }
    });
  }

  // ---------- 12. ANIMATED STATISTICS COUNTERS (With Pulse & Confetti) ----------
  function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length || !('IntersectionObserver' in window)) return;

    // Responsive confetti instance
    const confetti = new ConfettiBurst({
      colors: ['#00d4ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#ff6bff', '#ff9f43']
    });

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target.closest('.stat-item');
          if (item) item.classList.add('is-visible');

          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/,/g, ''), 10);
          const duration = 1800;
          const startTime = performance.now();

          function animateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(eased * target);
            
            el.textContent = currentValue.toLocaleString();
            el.style.opacity = Math.min(1, eased * 1.5);

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              el.textContent = target.toLocaleString();
              el.style.opacity = '1';
              
              // Pulse + Confetti
              el.classList.add('pulse-complete');
              
              const rect = el.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              
              const isMobile = window.innerWidth < 768;
              const adjustedX = isMobile ? Math.min(x, window.innerWidth - 50) : x;
              const adjustedY = isMobile ? Math.min(y, window.innerHeight - 50) : y;
              
              confetti.burst(adjustedX, adjustedY);

              setTimeout(() => {
                el.classList.remove('pulse-complete');
              }, 2000);
            }
          }

          requestAnimationFrame(animateCounter);
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    statNumbers.forEach(el => {
      observer.observe(el);
    });
  }

  // ---------- 13. RESPONSIVE CONFETTI BURST ENGINE ----------
  class ConfettiBurst {
    constructor(options = {}) {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'confetti-canvas';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animationId = null;
      this.isActive = false;
      this.colors = options.colors || [
        '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
        '#ff6bff', '#ff9f43', '#00d4ff', '#ff4757'
      ];
      this.onComplete = options.onComplete || null;
      
      this.updateResponsiveSettings();
      window.addEventListener('resize', () => {
        this.resize();
        this.updateResponsiveSettings();
      });
    }

    updateResponsiveSettings() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const screenArea = width * height;
      const baseArea = 1920 * 1080;

      this.scaleFactor = Math.max(0.3, Math.min(1.2, screenArea / baseArea));
      this.particleCount = Math.floor(80 * this.scaleFactor);
      this.duration = Math.max(800, Math.min(1800, 1200 * this.scaleFactor));
      this.baseVelocity = 2 + 4 * this.scaleFactor;
      this.baseSize = 4 + 6 * this.scaleFactor;
      this.gravity = 0.08 + 0.04 * this.scaleFactor;
      this.decayBase = 0.005 + 0.015 * this.scaleFactor;
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst(x, y) {
      if (this.isActive) return;
      this.resize();
      this.isActive = true;
      this.canvas.classList.add('active');

      const centerX = x || this.canvas.width / 2;
      const centerY = y || this.canvas.height / 2;

      const burstRadius = Math.min(
        window.innerWidth * 0.3,
        window.innerHeight * 0.25,
        250
      );

      this.particles = [];

      for (let i = 0; i < this.particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = this.baseVelocity * (0.5 + Math.random() * 0.5);
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        const spread = Math.random() * burstRadius * 0.2;
        
        this.particles.push({
          x: centerX + (Math.random() - 0.5) * spread,
          y: centerY + (Math.random() - 0.5) * spread,
          vx: Math.cos(angle) * velocity * (0.8 + Math.random() * 0.4),
          vy: Math.sin(angle) * velocity * (0.8 + Math.random() * 0.4) - 1.5,
          size: this.baseSize * (0.6 + Math.random() * 0.8),
          color: color,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          life: 1,
          decay: this.decayBase * (0.8 + Math.random() * 0.4),
          gravity: this.gravity * (0.8 + Math.random() * 0.4),
          shape: Math.random() > 0.5 ? 'circle' : 'rect',
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.04
        });
      }

      this.animate();
    }

    animate() {
      if (!this.isActive) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let alive = false;

      this.particles.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.vx += Math.sin(p.wobble) * 0.05;
        p.vy += Math.cos(p.wobble) * 0.05;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.rotation += p.rotSpeed;
        p.life -= p.decay;

        if (p.life > 0) {
          alive = true;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = p.life * Math.min(1, (p.life / 0.3));

          if (p.shape === 'rect') {
            this.ctx.fillStyle = p.color;
            const w = p.size * 0.8;
            const h = p.size * 0.4;
            this.ctx.fillRect(-w / 2, -h / 2, w, h);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
          }
          this.ctx.restore();
        }
      });

      if (alive) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        this.cleanup();
      }
    }

    cleanup() {
      this.isActive = false;
      this.canvas.classList.remove('active');
      this.particles = [];
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.onComplete) this.onComplete();
    }

    destroy() {
      this.cleanup();
      if (this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

})();