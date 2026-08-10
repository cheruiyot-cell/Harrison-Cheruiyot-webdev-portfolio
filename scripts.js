/**
 * Digital Maestros - Main Application Script
 * Version: 2.0.3
 * Description: Handles mobile navigation, scroll animations, contact form with premium UX.
 * Author: Harrison Cheruiyot
 * Last Updated: 2026-08-10
 */

(function() {
    'use strict';

    // ============================================================
    // 1. DOM READY & CONFIGURATION
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        const CONFIG = {
            MOBILE_BREAKPOINT: 768,
            ANIMATION_DELAY: 250,
            TOAST_DURATION: 4000,
            FORM_RESET_DELAY: 3000
        };

        // ============================================================
        // 2. MOBILE MENU TOGGLE (with accessibility & click-outside)
        // ============================================================
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const header = document.querySelector('.site-header');

        if (hamburger && navLinks) {
            /**
             * Toggle mobile menu state with smooth animation
             * @param {boolean} force - true to open, false to close
             */
            const toggleMenu = function(force) {
                const isCurrentlyActive = navLinks.classList.contains('active');
                let shouldBeActive;

                if (typeof force === 'boolean') {
                    shouldBeActive = force;
                } else {
                    shouldBeActive = !isCurrentlyActive;
                }

                // Update nav visibility with animation
                if (shouldBeActive) {
                    navLinks.classList.add('active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden';
                    hamburger.setAttribute('aria-label', 'Close menu');
                    hamburger.classList.add('active');
                    
                    // Focus first link for accessibility
                    const firstLink = navLinks.querySelector('a');
                    if (firstLink) setTimeout(() => firstLink.focus(), 100);
                } else {
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                    hamburger.setAttribute('aria-label', 'Open menu');
                    hamburger.classList.remove('active');
                }
            };

            // Initialize ARIA attributes
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
            hamburger.setAttribute('role', 'button');
            hamburger.setAttribute('tabindex', '0');

            // Click on hamburger
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu();
            });

            // Keyboard support (Enter/Space)
            hamburger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu();
                }
            });

            // Close on nav link click - ensure menu collapses
            const navLinkItems = navLinks.querySelectorAll('a');
            navLinkItems.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    if (navLinks.classList.contains('active')) {
                        // Small delay to allow link navigation
                        setTimeout(() => {
                            toggleMenu(false);
                            hamburger.focus();
                        }, 150);
                    }
                });
            });

            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (navLinks.classList.contains('active') &&
                    !hamburger.contains(e.target) &&
                    !navLinks.contains(e.target)) {
                    toggleMenu(false);
                }
            });

            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    toggleMenu(false);
                    hamburger.focus();
                }
            });

            // Handle resize - close mobile menu on desktop
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT && navLinks.classList.contains('active')) {
                        toggleMenu(false);
                    }
                }, CONFIG.ANIMATION_DELAY);
            });
        }

        // ============================================================
        // 3. SCROLL FADE ANIMATIONS (IntersectionObserver with premium effect)
        // ============================================================
        const fadeElements = document.querySelectorAll('.fade-up');
        
        if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -80px 0px',
                threshold: 0.15
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        // Add staggered delay based on index
                        const index = Array.from(fadeElements).indexOf(entry.target);
                        const delay = index * 80;
                        
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            fadeElements.forEach(function(el) {
                // Set initial state
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                observer.observe(el);
            });

        } else if (fadeElements.length > 0) {
            // Fallback for unsupported browsers
            fadeElements.forEach(function(el) {
                el.classList.add('visible');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }

        // ============================================================
        // 4. CONTACT FORM HANDLER (with validation, UX & premium animations)
        // ============================================================
        const form = document.getElementById('contactForm');
        
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const loader = submitBtn ? submitBtn.querySelector('.loader') : null;
            const originalBtnText = btnText ? btnText.textContent : 'Send Message';

            // Enhanced validation patterns
            const validators = {
                name: {
                    test: function(value) {
                        return value.trim().length >= 2 && /^[a-zA-Z\s]{2,50}$/.test(value.trim());
                    },
                    message: 'Please enter your full name (2-50 characters, letters only).'
                },
                email: {
                    test: function(value) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
                    },
                    message: 'Please enter a valid email address (e.g., name@domain.com).'
                },
                service: {
                    test: function(value) {
                        return value && value.trim() !== '';
                    },
                    message: 'Please select a service you\'re interested in.'
                },
                budget: {
                    test: function(value) {
                        return value && value.trim() !== '';
                    },
                    message: 'Please select your estimated budget range.'
                }
            };

            /**
             * Show error with premium animation
             * @param {HTMLElement} field - The form field
             */
            const showFieldError = function(field) {
                if (!field) return;
                
                field.style.borderColor = '#E63946';
                field.style.transition = 'border-color 0.3s ease, box-shadow 0.3s ease';
                field.classList.add('field-error');
                
                // Shake animation for premium feel
                field.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
                
                setTimeout(function() {
                    field.style.borderColor = '';
                    field.classList.remove('field-error');
                    field.style.animation = '';
                }, 3000);
            };

            /**
             * Validate all required fields with enhanced UX
             * @returns {boolean} - True if valid
             */
            const validateForm = function() {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                let firstError = null;
                
                // Reset all field errors first
                requiredFields.forEach(function(field) {
                    field.style.borderColor = '';
                    field.classList.remove('field-error');
                    field.style.animation = '';
                });
                
                requiredFields.forEach(function(field) {
                    const value = field.value;
                    const fieldName = field.name || field.id;
                    
                    if (!value || !value.trim()) {
                        showFieldError(field);
                        if (!firstError) firstError = field;
                        isValid = false;
                    } else if (validators[fieldName] && !validators[fieldName].test(value)) {
                        showToast(validators[fieldName].message, 'error');
                        showFieldError(field);
                        if (!firstError) firstError = field;
                        isValid = false;
                    }
                });
                
                // Focus first error field
                if (firstError) {
                    setTimeout(() => firstError.focus(), 300);
                }
                
                return isValid;
            };

            /**
             * Premium toast notification with animations
             * @param {string} message - Message to display
             * @param {string} type - 'error' or 'success'
             */
            const showToast = function(message, type) {
                // Remove existing toasts with fade out
                const existingToast = document.querySelector('.form-toast');
                if (existingToast) {
                    existingToast.style.opacity = '0';
                    existingToast.style.transform = 'translateX(100px)';
                    setTimeout(() => existingToast.remove(), 300);
                }
                
                const toast = document.createElement('div');
                toast.className = `form-toast ${type}`;
                toast.setAttribute('role', 'alert');
                toast.setAttribute('aria-live', 'polite');
                toast.textContent = message;
                
                // Premium styling with glassmorphism
                const colors = {
                    error: 'rgba(230, 57, 70, 0.95)',
                    success: 'rgba(16, 185, 129, 0.95)'
                };
                
                toast.style.cssText = `
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: ${colors[type] || colors.error};
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    z-index: 10000;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.1);
                    animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    max-width: 90vw;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.1);
                    transform-origin: right center;
                `;
                
                document.body.appendChild(toast);
                
                setTimeout(function() {
                    toast.style.animation = 'slideOutRight 0.3s ease forwards';
                    setTimeout(function() {
                        if (toast.parentNode) {
                            toast.remove();
                        }
                    }, 300);
                }, CONFIG.TOAST_DURATION);
            };

            // Form submission handler
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // --- HONEYPOT CHECK (anti-spam) ---
                const honeyPot = form.querySelector('[name="_gotcha"]');
                if (honeyPot && honeyPot.value.trim() !== '') {
                    console.log('Spam submission blocked.');
                    return;
                }

                // --- VALIDATE ---
                if (!validateForm()) {
                    return;
                }

                // --- COLLECT FORM DATA ---
                const formData = {
                    name: document.getElementById('name')?.value.trim() || '',
                    email: document.getElementById('email')?.value.trim() || '',
                    phone: document.getElementById('phone')?.value.trim() || 'Not provided',
                    service: document.getElementById('service')?.value || 'Not specified',
                    budget: document.getElementById('budget')?.value || 'Not specified',
                    message: document.getElementById('message')?.value.trim() || 'No additional message'
                };

                // --- UI LOADING STATE with premium animation ---
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    submitBtn.style.transform = 'scale(0.98)';
                    submitBtn.style.cursor = 'not-allowed';
                    submitBtn.setAttribute('aria-busy', 'true');
                }
                if (btnText) {
                    btnText.textContent = 'Sending Your Inquiry...';
                }
                if (loader) {
                    loader.style.display = 'inline-block';
                    loader.style.animation = 'spin 0.8s linear infinite';
                }

                // --- SUBMIT (mailto with fallback) ---
                setTimeout(function() {
                    try {
                        const subject = `Web Design Inquiry from ${formData.name}`;
                        const body = [
                            `Name: ${formData.name}`,
                            `Email: ${formData.email}`,
                            `Phone: ${formData.phone}`,
                            `Service: ${formData.service}`,
                            `Budget: ${formData.budget}`,
                            ``,
                            `Message:`,
                            `${formData.message}`,
                            ``,
                            `---`,
                            `Submitted via Digital Maestros portfolio`
                        ].join('\n');

                        const mailtoLink = `mailto:harrisoncheruiyot04@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                        // Show success state
                        if (btnText) {
                            btnText.textContent = '✓ Message Ready! Check Your Email';
                            btnText.style.color = '#10B981';
                        }
                        if (loader) {
                            loader.style.display = 'none';
                        }
                        
                        showToast('Opening your email client...', 'success');

                        // Open email client
                        window.location.href = mailtoLink;

                        // Reset form after delay
                        setTimeout(function() {
                            form.reset();
                            resetSubmitButton();
                        }, CONFIG.FORM_RESET_DELAY);

                    } catch (error) {
                        console.error('Form submission error:', error);
                        showToast('Unable to open email client. Please email me directly at harrisoncheruiyot04@gmail.com', 'error');
                        form.reset();
                        resetSubmitButton();
                    }
                }, 1000);
            });
            
            /**
             * Reset submit button to initial state
             */
            const resetSubmitButton = function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.transform = 'scale(1)';
                    submitBtn.style.cursor = 'pointer';
                    submitBtn.removeAttribute('aria-busy');
                }
                if (btnText) {
                    btnText.textContent = originalBtnText;
                    btnText.style.color = '';
                }
                if (loader) {
                    loader.style.display = 'none';
                    loader.style.animation = '';
                }
            };

            // Real-time validation feedback
            const formInputs = form.querySelectorAll('input, select, textarea');
            formInputs.forEach(function(input) {
                input.addEventListener('input', function() {
                    if (this.classList.contains('field-error')) {
                        this.style.borderColor = '';
                        this.classList.remove('field-error');
                        this.style.animation = '';
                    }
                });

                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required')) {
                        if (!this.value.trim()) {
                            this.style.borderColor = '#E63946';
                            this.classList.add('field-error');
                        } else {
                            this.style.borderColor = '#10B981';
                            this.style.transition = 'border-color 0.3s ease';
                            setTimeout(() => {
                                this.style.borderColor = '';
                            }, 2000);
                        }
                    }
                });
            });
        }

        // ============================================================
        // 5. SMOOTH SCROLL FOR ANCHOR LINKS (enhanced)
        // ============================================================
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId) return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                e.preventDefault();
                
                const headerHeight = header ? header.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }

                // Focus target for accessibility
                setTimeout(function() {
                    if (!targetElement.hasAttribute('tabindex')) {
                        targetElement.setAttribute('tabindex', '-1');
                    }
                    targetElement.focus({ preventScroll: true });
                }, 100);
            });
        });

        // ============================================================
        // 6. KEYBOARD ACCESSIBILITY: Focus trap for mobile menu
        // ============================================================
        if (navLinks) {
            navLinks.addEventListener('keydown', function(e) {
                if (e.key !== 'Tab' || !navLinks.classList.contains('active')) return;

                const focusableElements = navLinks.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;

                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        }

        // ============================================================
        // 7. LOGO MICRO-INTERACTION (enhanced)
        // ============================================================
        const logo = document.querySelector('.logo');
        if (logo) {
            if (!logo.getAttribute('tabindex') && logo.tagName !== 'A') {
                logo.setAttribute('tabindex', '0');
                logo.setAttribute('role', 'button');
                logo.setAttribute('aria-label', 'Go to homepage');
            }
            
            logo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) rotate(-1deg)';
                this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            
            logo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
            
            logo.addEventListener('click', function(e) {
                if (this.tagName !== 'A') {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                }
            });
            
            logo.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }

        // ============================================================
        // 8. CURRENT YEAR IN FOOTER
        // ============================================================
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        // ============================================================
        // 9. ADD CSS ANIMATIONS & STYLES
        // ============================================================
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100px);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .field-error {
                border-color: #E63946 !important;
                box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.1) !important;
            }
            
            .form-toast {
                transform-origin: right center;
            }
            
            .form-toast.error {
                border-left: 4px solid #ff6b6b;
            }
            
            .form-toast.success {
                border-left: 4px solid #6bffb8;
            }
            
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
            
            /* Premium nav link hover effect */
            .nav-links a {
                position: relative;
                transition: color 0.3s ease;
            }
            
            .nav-links a::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 0;
                height: 2px;
                background: #84CC16;
                transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .nav-links a:hover::after,
            .nav-links a:focus::after {
                width: 100%;
            }
        `;
        document.head.appendChild(styleSheet);

        // ============================================================
        // 10. ERROR HANDLING & LOGGING
        // ============================================================
        window.addEventListener('error', function(e) {
            if (window.location.hostname !== 'localhost') {
                console.error('Digital Maestros - Error:', e.message);
            }
        });

        window.addEventListener('unhandledrejection', function(e) {
            console.error('Digital Maestros - Unhandled Promise Rejection:', e.reason);
        });

        // ============================================================
        // 11. INITIALIZATION COMPLETE
        // ============================================================
        console.log('%c🚀 Digital Maestros %cReady', 'font-weight: bold; color: #84CC16;', 'color: #94A3B8;');
        
    });

})();