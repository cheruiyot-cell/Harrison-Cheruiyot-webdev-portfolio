/**
 * Harrison Cheruiyot - Portfolio Application Script
 * Premium Web Development for SMEs
 * Dependencies: None (Vanilla JS)
 * Version: 2.0.0
 */
(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        TOAST_DURATION: 4000,
        MOBILE_BREAKPOINT: 768,
        FORM_ENDPOINT: 'https://formspree.io/f/yourFormID', // Replace with your actual Formspree endpoint
        ANIMATION_OFFSET: '0px 0px -80px 0px',
        ANIMATION_THRESHOLD: 0.15,
        DEBOUNCE_DELAY: 250
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const Utils = {
        /**
         * Debounce function to limit rapid function calls
         */
        debounce: function(func, delay) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },

        /**
         * Check if device is mobile based on breakpoint
         */
        isMobile: function() {
            return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        },

        /**
         * Get element with error handling
         */
        getElement: function(selector, context = document) {
            const element = context.querySelector(selector);
            if (!element && selector.startsWith('#')) {
                console.warn(`Element ${selector} not found`);
            }
            return element;
        },

        /**
         * Get all elements with error handling
         */
        getElements: function(selector, context = document) {
            return context.querySelectorAll(selector);
        }
    };

    // ============================================
    // MOBILE MENU CONTROLLER
    // ============================================
    const MobileMenu = {
        menuToggle: null,
        navLinks: null,
        navList: null,

        /**
         * Initialize mobile menu functionality
         */
        init: function() {
            this.menuToggle = Utils.getElement('#menu-toggle');
            this.navLinks = Utils.getElement('#primary-navigation');
            
            if (!this.menuToggle || !this.navLinks) {
                console.warn('Mobile menu elements not found. Skipping initialization.');
                return;
            }

            this.navList = Utils.getElement('.nav-links', this.navLinks);
            if (!this.navList) return;

            this.setupEventListeners();
        },

        /**
         * Set up all event listeners for mobile menu
         */
        setupEventListeners: function() {
            // Close menu when a navigation link is clicked
            const navLinks = Utils.getElements('a', this.navList);
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu on Escape key press
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.menuToggle.checked) {
                    this.closeMenu();
                }
            });

            // Close menu when clicking overlay
            const overlay = Utils.getElement('.nav-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.closeMenu());
            }

            // Close menu on window resize (debounced)
            const handleResize = Utils.debounce(() => {
                if (!Utils.isMobile() && this.menuToggle.checked) {
                    this.closeMenu();
                }
            }, CONFIG.DEBOUNCE_DELAY);

            window.addEventListener('resize', handleResize);

            // Prevent body scroll when menu is open
            this.menuToggle.addEventListener('change', () => {
                document.body.style.overflow = this.menuToggle.checked ? 'hidden' : '';
            });
        },

        /**
         * Close mobile menu
         */
        closeMenu: function() {
            if (this.menuToggle) {
                this.menuToggle.checked = false;
                document.body.style.overflow = '';
            }
        }
    };

    // ============================================
    // SCROLL ANIMATIONS CONTROLLER
    // ============================================
    const ScrollAnimations = {
        fadeElements: null,
        observer: null,

        /**
         * Initialize scroll animations using Intersection Observer
         */
        init: function() {
            this.fadeElements = Utils.getElements('.fade-up');
            
            if (this.fadeElements.length === 0) {
                return;
            }

            if (!('IntersectionObserver' in window)) {
                // Fallback: show all elements immediately
                this.fadeElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                return;
            }

            this.setupObserver();
        },

        /**
         * Set up Intersection Observer for scroll animations
         */
        setupObserver: function() {
            const options = {
                root: null,
                rootMargin: CONFIG.ANIMATION_OFFSET,
                threshold: CONFIG.ANIMATION_THRESHOLD
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);

            // Set initial states and observe elements
            this.fadeElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                
                // Add staggered delay for multiple elements
                if (index > 0) {
                    el.style.transitionDelay = `${index * 0.1}s`;
                }
                
                this.observer.observe(el);
            });
        },

        /**
         * Animate a single element into view
         */
        animateElement: function(element) {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }
    };

    // ============================================
    // CONTACT FORM CONTROLLER
    // ============================================
    const ContactForm = {
        form: null,
        submitBtn: null,
        btnText: null,
        loader: null,
        originalText: 'Schedule Your Free Strategy Call',
        isSubmitting: false,

        /**
         * Initialize contact form functionality
         */
        init: function() {
            this.form = Utils.getElement('#contactForm');
            if (!this.form) {
                console.warn('Contact form not found. Skipping initialization.');
                return;
            }

            this.submitBtn = Utils.getElement('button[type="submit"]', this.form);
            this.btnText = this.submitBtn ? Utils.getElement('.btn-text', this.submitBtn) : null;
            this.loader = this.submitBtn ? Utils.getElement('.loader', this.submitBtn) : null;
            
            if (this.btnText) {
                this.originalText = this.btnText.textContent || this.originalText;
            }

            this.setupEventListeners();
        },

        /**
         * Set up form event listeners
         */
        setupEventListeners: function() {
            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time field validation
            const requiredFields = Utils.getElements('[required]', this.form);
            requiredFields.forEach(field => {
                field.addEventListener('input', () => {
                    field.classList.remove('field-error');
                });

                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            });
        },

        /**
         * Handle form submission
         */
        handleSubmit: function(e) {
            e.preventDefault();

            // Prevent double submission
            if (this.isSubmitting) return;

            // Honeypot check
            const gotcha = Utils.getElement('[name="_gotcha"]', this.form);
            if (gotcha && gotcha.value.trim() !== '') {
                console.warn('Honeypot triggered - possible spam');
                return;
            }

            // Validate all fields
            if (!this.validateForm()) {
                this.showToast('Please fill in all required fields correctly.', 'error');
                return;
            }

            // Submit the form
            this.submitForm();
        },

        /**
         * Validate a single field
         */
        validateField: function(field) {
            if (!field.value.trim()) {
                field.classList.add('field-error');
                return false;
            }

            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    field.classList.add('field-error');
                    return false;
                }
            }

            field.classList.remove('field-error');
            return true;
        },

        /**
         * Validate all required fields
         */
        validateForm: function() {
            let isValid = true;
            const requiredFields = Utils.getElements('[required]', this.form);

            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        /**
         * Submit form data to endpoint
         */
        submitForm: function() {
            this.isSubmitting = true;
            this.setLoadingState(true);

            const formData = new FormData(this.form);

            fetch(CONFIG.FORM_ENDPOINT, {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json' 
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                this.showToast('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                this.form.reset();
                this.removeFieldErrors();
            })
            .catch(error => {
                console.error('Form submission error:', error);
                this.showToast('Error sending message. Please email me directly at harrison@cheruiyot.dev', 'error');
            })
            .finally(() => {
                this.setLoadingState(false);
                this.isSubmitting = false;
            });
        },

        /**
         * Set loading state for submit button
         */
        setLoadingState: function(isLoading) {
            if (this.submitBtn) {
                this.submitBtn.disabled = isLoading;
            }
            if (this.btnText) {
                this.btnText.textContent = isLoading ? 'Sending...' : this.originalText;
            }
            if (this.loader) {
                this.loader.style.display = isLoading ? 'inline-block' : 'none';
            }
        },

        /**
         * Remove all field error classes
         */
        removeFieldErrors: function() {
            const errorFields = Utils.getElements('.field-error', this.form);
            errorFields.forEach(field => field.classList.remove('field-error'));
        },

        /**
         * Show toast notification
         */
        showToast: function(message, type = 'success') {
            // Remove existing toast
            const existingToast = Utils.getElement('.form-toast');
            if (existingToast) {
                existingToast.remove();
            }

            // Create new toast
            const toast = document.createElement('div');
            toast.className = `form-toast form-toast-${type}`;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');
            toast.textContent = message;

            // Add icon based on type
            const icon = type === 'success' ? '✓' : '✕';
            toast.setAttribute('data-icon', icon);

            document.body.appendChild(toast);

            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('form-toast-visible');
            });

            // Remove after duration
            setTimeout(() => {
                toast.classList.remove('form-toast-visible');
                toast.classList.add('form-toast-hiding');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, CONFIG.TOAST_DURATION);
        }
    };

    // ============================================
    // SMOOTH SCROLL CONTROLLER
    // ============================================
    const SmoothScroll = {
        /**
         * Initialize smooth scrolling for anchor links
         */
        init: function() {
            const anchorLinks = Utils.getElements('a[href^="#"]');
            
            anchorLinks.forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
            });
        },

        /**
         * Handle smooth scroll when anchor link is clicked
         */
        handleSmoothScroll: function(e, anchor) {
            const targetId = anchor.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (!targetId || targetId === '#') return;

            const targetElement = Utils.getElement(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = Utils.getElement('.site-header')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL hash without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        }
    };

    // ============================================
    // FOOTER YEAR UPDATER
    // ============================================
    const FooterYear = {
        /**
         * Update copyright year in footer
         */
        init: function() {
            const yearSpan = Utils.getElement('#currentYear');
            if (yearSpan) {
                const currentYear = new Date().getFullYear();
                yearSpan.textContent = currentYear;
            }
        }
    };

    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================
    const PerformanceOptimizer = {
        /**
         * Initialize performance optimizations
         */
        init: function() {
            this.lazyLoadImages();
            this.handleReducedMotion();
        },

        /**
         * Add native lazy loading to images that don't have it
         */
        lazyLoadImages: function() {
            if ('loading' in HTMLImageElement.prototype) {
                // Native lazy loading is supported
                const images = Utils.getElements('img:not([loading])');
                images.forEach(img => {
                    img.setAttribute('loading', 'lazy');
                });
            }
        },

        /**
         * Handle users who prefer reduced motion
         */
        handleReducedMotion: function() {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (mediaQuery.matches) {
                this.disableAnimations();
            }

            mediaQuery.addEventListener('change', (e) => {
                if (e.matches) {
                    this.disableAnimations();
                }
            });
        },

        /**
         * Disable all animations
         */
        disableAnimations: function() {
            const fadeElements = Utils.getElements('.fade-up');
            fadeElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.transition = 'none';
            });

            document.documentElement.style.scrollBehavior = 'auto';
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        MobileMenu.init();
        ScrollAnimations.init();
        ContactForm.init();
        SmoothScroll.init();
        FooterYear.init();
        PerformanceOptimizer.init();

        // Log initialization
        console.log(
            '%c🚀 Harrison Cheruiyot Portfolio %cReady',
            'color: #84CC16; font-weight: bold; font-size: 1.1em;',
            'color: #94A3B8;'
        );
        console.log(
            '%c💡 Tip: Check out the source code on GitHub!',
            'color: #2563EB; font-style: italic;'
        );
    }

    // Start the application when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded
        init();
    }

})();