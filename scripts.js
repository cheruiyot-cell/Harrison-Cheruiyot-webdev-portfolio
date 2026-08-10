/**
 * Digital Maestros - Main Application Script
 * Version: 2.0.1
 * Description: Handles mobile navigation, scroll animations, contact form with premium UX.
 * Author: Harrison Cheruiyot
 * Last Updated: 2026-08-10
 */

(function() {
    'use strict';

    // --- DOM READY ---
    document.addEventListener('DOMContentLoaded', function() {

        // ============================================================
        // 1. MOBILE MENU TOGGLE (with accessibility & click-outside)
        // ============================================================
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburger && navLinks) {
            /**
             * Toggle mobile menu state
             * @param {boolean|null} force - true to close, false to open, null to toggle
             */
            const toggleMenu = function(force) {
                const isCurrentlyActive = navLinks.classList.contains('active');
                let shouldBeActive;

                if (typeof force === 'boolean') {
                    shouldBeActive = force;
                } else {
                    shouldBeActive = !isCurrentlyActive;
                }

                // Update nav visibility
                if (shouldBeActive) {
                    navLinks.classList.add('active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    document.body.style.overflow = 'hidden'; // Prevent background scroll
                } else {
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = ''; // Restore scroll
                }
            };

            // Click on hamburger
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu();
            });

            // Close on nav link click
            const navLinkItems = navLinks.querySelectorAll('a');
            navLinkItems.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (navLinks.classList.contains('active')) {
                        toggleMenu(false); // Close menu
                    }
                });
            });

            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (navLinks.classList.contains('active') &&
                    !hamburger.contains(e.target) &&
                    !navLinks.contains(e.target)) {
                    toggleMenu(false); // Close menu
                }
            });

            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    toggleMenu(false); // Close menu
                    hamburger.focus(); // Return focus to hamburger
                }
            });

            // Handle resize - close mobile menu on desktop
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                    toggleMenu(false); // Close menu
                }
            });
        }

        // ============================================================
        // 2. SCROLL FADE ANIMATIONS (IntersectionObserver)
        // ============================================================
        const fadeElements = document.querySelectorAll('.fade-up');
        
        if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Unobserve after animation to free resources
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all fade elements
            fadeElements.forEach(function(el) {
                observer.observe(el);
            });

        } else if (fadeElements.length > 0) {
            // Fallback for browsers without IntersectionObserver support
            fadeElements.forEach(function(el) {
                el.classList.add('visible');
            });
        }

        // ============================================================
        // 3. CONTACT FORM HANDLER (with validation & UX)
        // ============================================================
        const form = document.getElementById('contactForm');
        
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const loader = submitBtn ? submitBtn.querySelector('.loader') : null;

            // Validation patterns
            const validators = {
                name: {
                    test: function(value) {
                        return value.trim().length >= 2;
                    },
                    message: 'Please enter your full name (minimum 2 characters).'
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
             * Show error on a specific field
             * @param {HTMLElement} field - The form field
             */
            const showFieldError = function(field) {
                if (!field) return;
                field.style.borderColor = '#E63946';
                field.style.transition = 'border-color 0.3s ease';
                
                // Remove error state after delay
                setTimeout(function() {
                    field.style.borderColor = '';
                }, 3000);
            };

            /**
             * Validate all required fields
             * @returns {boolean} - True if valid
             */
            const validateForm = function() {
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(function(field) {
                    const value = field.value;
                    const fieldName = field.name || field.id;
                    
                    if (!value || !value.trim()) {
                        showFieldError(field);
                        isValid = false;
                    } else if (validators[fieldName] && !validators[fieldName].test(value)) {
                        alert(validators[fieldName].message);
                        showFieldError(field);
                        field.focus();
                        isValid = false;
                    }
                });
                
                return isValid;
            };

            // Form submission handler
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // --- HONEYPOT CHECK (anti-spam) ---
                const honeyPot = form.querySelector('[name="_gotcha"]');
                if (honeyPot && honeyPot.value.trim() !== '') {
                    // Silently reject bot submissions
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

                // --- UI LOADING STATE ---
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    submitBtn.style.cursor = 'not-allowed';
                }
                if (btnText) {
                    btnText.textContent = 'Sending Your Inquiry...';
                }
                if (loader) {
                    loader.style.display = 'inline-block';
                }

                // --- SUBMIT (simulated with mailto fallback) ---
                setTimeout(function() {
                    try {
                        // Build mailto link
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
                        }
                        if (loader) {
                            loader.style.display = 'none';
                        }

                        // Open email client
                        window.location.href = mailtoLink;

                        // Reset form after delay
                        setTimeout(function() {
                            form.reset();
                            
                            // Reset button state
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.style.opacity = '1';
                                submitBtn.style.cursor = 'pointer';
                            }
                            if (btnText) {
                                btnText.textContent = 'Schedule Your Free Strategy Call';
                            }
                        }, 3000);

                    } catch (error) {
                        console.error('Form submission error:', error);
                        
                        // Show fallback message
                        alert('Unable to open email client. Please email me directly at:\n\nharrisoncheruiyot04@gmail.com\n\nThank you!');
                        
                        // Reset form state
                        form.reset();
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.style.opacity = '1';
                            submitBtn.style.cursor = 'pointer';
                        }
                        if (btnText) {
                            btnText.textContent = 'Schedule Your Free Strategy Call';
                        }
                        if (loader) {
                            loader.style.display = 'none';
                        }
                    }
                }, 1000);

            });

            // Real-time validation feedback
            const formInputs = form.querySelectorAll('input, select, textarea');
            formInputs.forEach(function(input) {
                // Clear error state on input
                input.addEventListener('input', function() {
                    if (this.style.borderColor === 'rgb(230, 57, 70)' || this.style.borderColor === '#E63946') {
                        this.style.borderColor = '';
                    }
                });

                // Validate on blur for better UX
                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.style.borderColor = '#E63946';
                    }
                });
            });
        }

        // ============================================================
        // 4. SMOOTH SCROLL FOR ANCHOR LINKS
        // ============================================================
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (targetId === '#' || !targetId) return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Calculate offset for sticky header
                    const header = document.querySelector('.site-header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const extraOffset = 20; // Additional padding
                    
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - extraOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL hash without jumping (accessibility)
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }
                }
            });
        });

        // ============================================================
        // 5. KEYBOARD ACCESSIBILITY: Focus trap for mobile menu
        // ============================================================
        if (navLinks) {
            navLinks.addEventListener('keydown', function(e) {
                if (e.key !== 'Tab') return;
                if (!navLinks.classList.contains('active')) return;

                const focusableElements = navLinks.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return;

                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    // Shift + Tab: move to last if on first
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab: move to first if on last
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        }

        // ============================================================
        // 6. LOGO MICRO-INTERACTION
        // ============================================================
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            
            logo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Reset transform on click for mobile
            logo.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }

        // ============================================================
        // 7. CURRENT YEAR IN FOOTER
        // ============================================================
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        // ============================================================
        // 8. PERFORMANCE: Service Worker Registration (if applicable)
        // ============================================================
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            window.addEventListener('load', function() {
                // Uncomment when you have a service worker file
                // navigator.serviceWorker.register('/sw.js').catch(function(err) {
                //     console.log('ServiceWorker registration failed:', err);
                // });
            });
        }

        // ============================================================
        // 9. ERROR HANDLING & LOGGING
        // ============================================================
        window.addEventListener('error', function(e) {
            // Log errors in production (could send to monitoring service)
            if (window.location.hostname !== 'localhost') {
                console.error('Digital Maestros - Error:', e.message, 'at', e.filename, 'line', e.lineno);
            }
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Digital Maestros - Unhandled Promise Rejection:', e.reason);
        });

        // ============================================================
        // 10. INITIALIZATION COMPLETE
        // ============================================================
        console.log('%c🚀 Digital Maestros %cReady', 'font-weight: bold; color: #84CC16;', 'color: #94A3B8;');
        
    });

})();