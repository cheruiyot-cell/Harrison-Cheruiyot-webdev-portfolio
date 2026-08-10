/**
 * Digital Maestros - Main Application Script
 * Version: 2.0.0
 * Author: Harrison Cheruiyot
 * 
 * Dependencies: None (Vanilla JS)
 * Browser Support: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
 */

(function() {
    'use strict';

    // ============================================================
    // 1. CONFIGURATION
    // ============================================================
    const CONFIG = {
        TOAST_DURATION: 4000,
        FORM_RESET_DELAY: 3000,
        MOBILE_BREAKPOINT: 768
    };

    // ============================================================
    // 2. DOM READY
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {

        // --- 2.1. Mobile Menu ---
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburger && navLinks) {
            const toggleMenu = function(force) {
                const shouldOpen = typeof force === 'boolean' ? force : !navLinks.classList.contains('active');

                if (shouldOpen) {
                    navLinks.classList.add('active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                    hamburger.setAttribute('aria-label', 'Close menu');
                } else {
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    hamburger.setAttribute('aria-label', 'Open menu');
                }
            };

            // Hamburger click
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu();
            });

            // Keyboard support
            hamburger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu();
                }
            });

            // Close on link click
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    if (navLinks.classList.contains('active')) {
                        setTimeout(function() {
                            toggleMenu(false);
                            hamburger.focus();
                        }, 150);
                    }
                });
            });

            // Close on outside click
            document.addEventListener('click', function(e) {
                if (navLinks.classList.contains('active') &&
                    !hamburger.contains(e.target) &&
                    !navLinks.contains(e.target)) {
                    toggleMenu(false);
                }
            });

            // Close on Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    toggleMenu(false);
                    hamburger.focus();
                }
            });

            // Handle resize
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT && navLinks.classList.contains('active')) {
                        toggleMenu(false);
                    }
                }, 250);
            });
        }

        // --- 2.2. Scroll Animations ---
        const fadeElements = document.querySelectorAll('.fade-up');

        if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const index = Array.from(fadeElements).indexOf(entry.target);
                        const delay = index * 80;

                        setTimeout(function() {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay);

                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -80px 0px',
                threshold: 0.15
            });

            fadeElements.forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                observer.observe(el);
            });
        } else if (fadeElements.length > 0) {
            // Fallback
            fadeElements.forEach(function(el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }

        // --- 2.3. Contact Form ---
        const form = document.getElementById('contactForm');

        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const loader = submitBtn ? submitBtn.querySelector('.loader') : null;
            const originalText = btnText ? btnText.textContent : 'Submit';

            // Validation rules
            const validators = {
                name: {
                    test: function(value) {
                        return value.trim().length >= 2 && /^[a-zA-Z\s]{2,50}$/.test(value.trim());
                    },
                    message: 'Please enter your full name (2-50 characters).'
                },
                email: {
                    test: function(value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
                    },
                    message: 'Please enter a valid email address.'
                },
                service: {
                    test: function(value) {
                        return value && value.trim() !== '';
                    },
                    message: 'Please select a service.'
                },
                budget: {
                    test: function(value) {
                        return value && value.trim() !== '';
                    },
                    message: 'Please select your budget range.'
                }
            };

            // Toast notification
            function showToast(message, type) {
                // Remove existing toast
                const existing = document.querySelector('.form-toast');
                if (existing) {
                    existing.classList.add('removing');
                    setTimeout(function() {
                        if (existing.parentNode) existing.remove();
                    }, 300);
                }

                const toast = document.createElement('div');
                toast.className = 'form-toast ' + type;
                toast.setAttribute('role', 'alert');
                toast.textContent = message;
                document.body.appendChild(toast);

                setTimeout(function() {
                    toast.classList.add('removing');
                    setTimeout(function() {
                        if (toast.parentNode) toast.remove();
                    }, 300);
                }, CONFIG.TOAST_DURATION);
            }

            // Validate form
            function validateForm() {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');

                requiredFields.forEach(function(field) {
                    field.classList.remove('field-error');
                    field.style.borderColor = '';
                    field.style.animation = '';

                    const value = field.value;
                    const fieldName = field.name || field.id;

                    if (!value || !value.trim()) {
                        field.classList.add('field-error');
                        isValid = false;
                    } else if (validators[fieldName] && !validators[fieldName].test(value)) {
                        showToast(validators[fieldName].message, 'error');
                        field.classList.add('field-error');
                        isValid = false;
                    }
                });

                return isValid;
            }

            // Submit handler
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Honeypot check
                const honeyPot = form.querySelector('[name="_gotcha"]');
                if (honeyPot && honeyPot.value.trim() !== '') {
                    return;
                }

                if (!validateForm()) {
                    return;
                }

                // Collect data
                const formData = {
                    name: document.getElementById('name')?.value.trim() || '',
                    email: document.getElementById('email')?.value.trim() || '',
                    phone: document.getElementById('phone')?.value.trim() || 'Not provided',
                    service: document.getElementById('service')?.value || 'Not specified',
                    budget: document.getElementById('budget')?.value || 'Not specified',
                    message: document.getElementById('message')?.value.trim() || 'No additional message'
                };

                // Loading state
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    submitBtn.setAttribute('aria-busy', 'true');
                }
                if (btnText) btnText.textContent = 'Sending...';
                if (loader) loader.style.display = 'inline-block';

                // Submit to Formspree (replace with your endpoint)
                fetch('https://formspree.io/f/yourFormID', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new FormData(form)
                })
                .then(function(response) {
                    if (response.ok) {
                        showToast('Message sent successfully! I\'ll respond within 24 hours.', 'success');
                        form.reset();
                        resetButton();
                    } else {
                        throw new Error('Server error');
                    }
                })
                .catch(function(error) {
                    console.error('Form error:', error);
                    showToast('Unable to send message. Please email me directly at harrisoncheruiyot04@gmail.com', 'error');
                    resetButton();
                });
            });

            // Reset button state
            function resetButton() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.removeAttribute('aria-busy');
                }
                if (btnText) btnText.textContent = originalText;
                if (loader) loader.style.display = 'none';
            }

            // Real-time validation
            form.querySelectorAll('input, select, textarea').forEach(function(input) {
                input.addEventListener('input', function() {
                    this.classList.remove('field-error');
                    this.style.borderColor = '';
                });

                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.classList.add('field-error');
                    }
                });
            });
        }

        // --- 2.4. Smooth Scroll ---
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId) return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();

                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            });
        });

        // --- 2.5. Current Year ---
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // --- 2.6. Keyboard Focus Trap for Mobile Menu ---
        if (navLinks) {
            navLinks.addEventListener('keydown', function(e) {
                if (e.key !== 'Tab' || !navLinks.classList.contains('active')) return;

                const focusable = navLinks.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );

                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            });
        }

        console.log('%c✅ Digital Maestros initialized', 'color: #84CC16; font-weight: bold;');
    });

})();