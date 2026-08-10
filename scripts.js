/**
 * Harrison Cheruiyot – Premium Portfolio
 * Senior Web Developer | Nairobi, Kenya
 * Production-ready JavaScript: Accessibility, Animations, Interactivity
 * Version 2.0.0 – Premium Animation Suite
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
    initParallaxHeroEffect();
    initCounterAnimation();
    initWhatsAppPulse();
    initAccessibilityEnhancements();
    initCursorGlow();
    initTextReveal();
    initCard3DTilt();
    initSmoothPageLoad();
    initStaggeredReveal();
    initFloatingElements();
    initGoldParticleEffect();
    initScrollProgressIndicator();
    initMagneticButtons();
    initImageParallax();
    initGlitchTextEffect();
  });

  // ---------- 1. DYNAMIC COPYRIGHT YEAR ----------
  function initCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  // ---------- 2. MOBILE MENU (Premium Drawer with Animation) ----------
  function initMobileMenu() {
    const toggleCheckbox = document.getElementById('menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('#primary-navigation .nav-links a');
    const hamburgerLabel = document.querySelector('.hamburger');
    const navItems = document.querySelectorAll('.nav-links li');

    if (!toggleCheckbox || !hamburgerLabel) return;

    // Add staggered animation delay to nav items
    navItems.forEach((item, index) => {
      item.style.setProperty('--item-index', index);
      item.style.transitionDelay = `${index * 0.1}s`;
    });

    function updateAriaAndBody() {
      const isExpanded = toggleCheckbox.checked;
      hamburgerLabel.setAttribute('aria-expanded', isExpanded);
      
      if (isExpanded) {
        document.body.style.overflow = 'hidden';
        // Animate nav items in
        navItems.forEach((item, index) => {
          item.style.animation = `slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`;
        });
        if (navLinks.length > 0) {
          setTimeout(() => navLinks[0].focus(), 300);
        }
      } else {
        document.body.style.overflow = '';
        // Reset animations
        navItems.forEach(item => {
          item.style.animation = '';
          item.style.opacity = '';
          item.style.transform = '';
        });
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
      navOverlay.addEventListener('click', function (e) {
        if (toggleCheckbox.checked) {
          toggleCheckbox.checked = false;
          updateAriaAndBody();
        }
      });
    }

    updateAriaAndBody();
  }

  // ---------- 3. SMOOTH SCROLL (Premium easing) ----------
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

          // Premium smooth scroll with custom easing
          smoothScrollTo(offsetPosition, 1200);

          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });

    // Custom smooth scroll function with easing
    function smoothScrollTo(targetPosition, duration) {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Premium ease-out-expo curve
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  }

  // ---------- 4. SCROLL-TRIGGERED ANIMATIONS (Reveal on scroll) ----------
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
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add stagger delay based on element index
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          const delay = index * 0.08;
          
          entry.target.style.transitionDelay = `${delay}s`;
          entry.target.classList.add('is-visible');
          
          // Premium reveal animation
          entry.target.style.animation = `revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`;
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ---------- 5. ACTIVE NAVIGATION HIGHLIGHT (Glow effect) ----------
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight + 50 : 120;

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
          // Premium glow pulse on active link
          link.style.textShadow = '0 0 20px rgba(201, 164, 62, 0.3)';
        } else {
          link.style.textShadow = 'none';
        }
      });
    }

    window.addEventListener('scroll', highlightNavigation, { passive: true });
    highlightNavigation(); 
  }

  // ---------- 6. FORM VALIDATION (Shake animation on error) ----------
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = form.querySelector('.btn-submit');

    const inputs = [nameInput, emailInput, messageInput].filter(Boolean);

    inputs.forEach(input => {
      input.addEventListener('input', function () {
        validateField(input);
      });
      input.addEventListener('blur', function () {
        validateField(input, true);
      });
      input.addEventListener('focus', function() {
        // Premium focus animation
        input.parentElement.style.transform = 'scale(1.02)';
      });
      input.addEventListener('blur', function() {
        input.parentElement.style.transform = 'scale(1)';
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

      if (!isValid && (showError || field.dataset.touched === 'true')) {
        formGroup.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');
        
        // Shake animation on error
        formGroup.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
        setTimeout(() => formGroup.style.animation = '', 500);
        
        const errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.setAttribute('role', 'alert');
        errorSpan.textContent = errorMessage;
        formGroup.appendChild(errorSpan);
      } else {
        formGroup.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
        // Success indicator
        if (field.value.trim() !== '') {
          formGroup.classList.add('has-success');
        } else {
          formGroup.classList.remove('has-success');
        }
      }

      if (showError) {
        field.dataset.touched = 'true';
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

        const alertDiv = document.createElement('div');
        alertDiv.setAttribute('role', 'alert');
        alertDiv.className = 'sr-only';
        alertDiv.textContent = 'Please correct the errors in the form before submitting.';
        form.prepend(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
      } else {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
          submitButton.setAttribute('aria-busy', 'true');
          
          // Success animation on button
          submitButton.style.transform = 'scale(0.98)';
          setTimeout(() => {
            submitButton.style.transform = 'scale(1)';
          }, 150);
        }
      }
    });
  }

  // ---------- 7. HERO PARALLAX (Premium layered effect) ----------
  function initParallaxHeroEffect() {
    const hero = document.querySelector('.hero');
    if (!hero || window.innerWidth < 768) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;
          const scrollDelta = scrollY - lastScrollY;

          if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            const translateY = scrollY * 0.3;
            const scale = 1 + (progress * 0.05);
            const opacity = 1 - progress * 1.2;
            
            hero.style.transform = `translateY(${translateY}px) scale(${scale})`;
            hero.style.opacity = Math.max(opacity, 0.6);
            
            // Parallax for hero content
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
              heroContent.style.transform = `translateY(${scrollY * -0.15}px)`;
            }
          }
          
          lastScrollY = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---------- 8. COUNTER ANIMATION (Premium easing) ----------
  function initCounterAnimation() {
    const stats = document.querySelectorAll('.about-stats strong');
    if (stats.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
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
      stats.forEach((stat, index) => {
        const text = stat.textContent || '';
        const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
        const suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');

        if (isNaN(numericValue)) return;

        let startValue = 0;
        const duration = 2000 + (index * 300);
        const startTime = performance.now();

        // Add glow effect during counting
        stat.style.textShadow = '0 0 20px rgba(201, 164, 62, 0.5)';

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Premium elastic easing
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(eased * numericValue);

          stat.textContent = current + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = numericValue + suffix;
            // Remove glow after animation completes
            setTimeout(() => {
              stat.style.textShadow = 'none';
            }, 300);
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }
  }

  // ---------- 9. WHATSAPP BUTTON PULSE ----------
  function initWhatsAppPulse() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;

    // Create ripple effect on click
    whatsappBtn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'whatsapp-ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });

    whatsappBtn.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.15) rotate(10deg)';
      this.style.boxShadow = '0 12px 32px rgba(37, 211, 102, 0.5)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1) rotate(0deg)';
      this.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.35)';
    });

    whatsappBtn.addEventListener('focus', function () {
      this.style.transform = 'scale(1.15) rotate(10deg)';
    });
    
    whatsappBtn.addEventListener('blur', function () {
      this.style.transform = 'scale(1) rotate(0deg)';
    });
  }

  // ---------- 10. ACCESSIBILITY ENHANCEMENTS ----------
  function initAccessibilityEnhancements() {
    const allButtons = document.querySelectorAll('.btn, .project-link, .hamburger');
    allButtons.forEach(btn => {
      if (!btn.getAttribute('role') && btn.tagName !== 'BUTTON' && btn.tagName !== 'A' && btn.tagName !== 'LABEL') {
        btn.setAttribute('role', 'button');
      }
      if (btn.tagName !== 'A' && btn.tagName !== 'BUTTON' && btn.tagName !== 'LABEL' && !btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
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

  // ---------- 11. CURSOR GLOW EFFECT (Premium) ----------
  function initCursorGlow() {
    if (window.innerWidth < 768) return;
    
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      
      cursorGlow.style.left = `${cursorX}px`;
      cursorGlow.style.top = `${cursorY}px`;
      
      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Enhance glow on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .pricing-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(201, 164, 62, 0.3) 0%, transparent 70%)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(201, 164, 62, 0.15) 0%, transparent 70%)';
      });
    });
  }

  // ---------- 12. TEXT REVEAL ANIMATION ----------
  function initTextReveal() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (!heroTitle) return;

    // Split text into characters for reveal animation
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.overflow = 'hidden';
      wordSpan.style.verticalAlign = 'top';
      
      const wordInner = document.createElement('span');
      wordInner.style.display = 'inline-block';
      wordInner.style.animation = `revealText 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${wordIndex * 0.12}s forwards`;
      wordInner.textContent = word + (wordIndex < words.length - 1 ? '\u00A0' : '');
      
      wordSpan.appendChild(wordInner);
      heroTitle.appendChild(wordSpan);
    });
  }

  // ---------- 13. 3D CARD TILT EFFECT ----------
  function initCard3DTilt() {
    if (window.innerWidth < 768) return;
    
    const cards = document.querySelectorAll('.project-card, .service-card, .pricing-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Add shine effect
        const shine = (x / rect.width) * 100;
        card.style.background = `linear-gradient(${shine}deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.background = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // ---------- 14. SMOOTH PAGE LOAD ----------
  function initSmoothPageLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    
    window.addEventListener('load', () => {
      document.body.style.opacity = '1';
      
      // Animate header
      const header = document.querySelector('.site-header');
      if (header) {
        header.style.animation = 'slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
    });
  }

  // ---------- 15. STAGGERED REVEAL ON LOAD ----------
  function initStaggeredReveal() {
    const elements = document.querySelectorAll('.hero-content > *, .hero-trust span');
    
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.animation = `revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + index * 0.15}s forwards`;
    });
  }

  // ---------- 16. FLOATING ELEMENTS ----------
  function initFloatingElements() {
    const floatElements = document.querySelectorAll('.service-icon, .step-number');
    
    floatElements.forEach((el, index) => {
      el.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
    });
  }

  // ---------- 17. GOLD PARTICLE EFFECT ON HERO ----------
  function initGoldParticleEffect() {
    if (window.innerWidth < 768) return;
    
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * 100;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${startX}%;
        animation: floatUp ${duration}s ${delay}s linear infinite;
        opacity: ${Math.random() * 0.3 + 0.1};
      `;
      
      hero.appendChild(particle);
      
      setTimeout(() => particle.remove(), (duration + delay) * 1000);
    };

    // Create particles periodically
    setInterval(() => {
      if (document.hidden) return;
      createParticle();
    }, 300);
  }

  // ---------- 18. SCROLL PROGRESS INDICATOR ----------
  function initScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.transform = `scaleX(${scrolled / 100})`;
    }, { passive: true });
  }

  // ---------- 19. MAGNETIC BUTTONS ----------
  function initMagneticButtons() {
    if (window.innerWidth < 768) return;
    
    const buttons = document.querySelectorAll('.btn-accent, .btn-primary');
    
    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
        button.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      
      button.addEventListener('mouseenter', () => {
        button.style.transition = 'transform 0.1s linear';
      });
    });
  }

  // ---------- 20. IMAGE PARALLAX ON HOVER ----------
  function initImageParallax() {
    const images = document.querySelectorAll('.project-image-wrapper img, .about-image img');
    
    images.forEach(img => {
      const wrapper = img.parentElement;
      
      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const moveX = (x / rect.width - 0.5) * 20;
        const moveY = (y / rect.height - 0.5) * 20;
        
        img.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      });
      
      wrapper.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) translate(0, 0)';
        img.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      
      wrapper.addEventListener('mouseenter', () => {
        img.style.transition = 'transform 0.1s linear';
      });
    });
  }

  // ---------- 21. GLITCH TEXT EFFECT ON SPECIAL ELEMENTS ----------
  function initGlitchTextEffect() {
    const specialTexts = document.querySelectorAll('.text-accent');
    
    specialTexts.forEach(text => {
      text.addEventListener('mouseenter', () => {
        text.style.animation = 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both';
        setTimeout(() => {
          text.style.animation = '';
        }, 300);
      });
    });
  }

})();