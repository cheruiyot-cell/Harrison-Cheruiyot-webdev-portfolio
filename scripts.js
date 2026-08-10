/**
 * Digital Maestros - Application Script
 * Dependencies: None
 */
(function() {
    'use strict';

    const CONFIG = {
        TOAST_DURATION: 4000,
        MOBILE_BREAKPOINT: 768
    };

    document.addEventListener('DOMContentLoaded', function() {

        // --- 1. Mobile Menu Enhancements (JS handles closing logic only) ---
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('navLinks');

        if (menuToggle && navLinks) {
            // Close menu when a navigation link is clicked
            navLinks.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    if (menuToggle.checked) {
                        menuToggle.checked = false;
                    }
                });
            });

            // Close menu on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && menuToggle.checked) {
                    menuToggle.checked = false;
                }
            });

            // Close if resized to desktop
            let resizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT && menuToggle.checked) {
                        menuToggle.checked = false;
                    }
                }, 250);
            });
        }

        // --- 2. Intersection Observer for Scroll Animations ---
        const fadeElements = document.querySelectorAll('.fade-up');
        if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.15 });

            fadeElements.forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                observer.observe(el);
            });
        }

        // --- 3. Contact Form with Toast Notifications ---
        const form = document.getElementById('contactForm');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const loader = submitBtn ? submitBtn.querySelector('.loader') : null;
            const originalText = btnText ? btnText.textContent : 'Submit';

            const showToast = function(message, type) {
                const existing = document.querySelector('.form-toast');
                if (existing) existing.remove();

                const toast = document.createElement('div');
                toast.className = `form-toast ${type}`;
                toast.setAttribute('role', 'alert');
                toast.textContent = message;
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.classList.add('removing');
                    setTimeout(() => toast.remove(), 300);
                }, CONFIG.TOAST_DURATION);
            };

            const validateForm = function() {
                let isValid = true;
                form.querySelectorAll('[required]').forEach(function(field) {
                    field.classList.remove('field-error');
                    if (!field.value.trim()) {
                        field.classList.add('field-error');
                        isValid = false;
                    }
                });
                return isValid;
            };

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Honeypot check
                if (form.querySelector('[name="_gotcha"]')?.value.trim() !== '') return;
                if (!validateForm()) return;

                // Loading state
                if (submitBtn) { submitBtn.disabled = true; }
                if (btnText) btnText.textContent = 'Sending...';
                if (loader) loader.style.display = 'inline-block';

                // Simulated fetch (Replace URL with your endpoint)
                fetch('https://formspree.io/f/yourFormID', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(form)
                })
                .then(res => {
                    if (res.ok) {
                        showToast('Message sent successfully!', 'success');
                        form.reset();
                    } else throw new Error('Server error');
                })
                .catch(() => {
                    showToast('Error sending. Please email me directly.', 'error');
                })
                .finally(() => {
                    if (submitBtn) submitBtn.disabled = false;
                    if (btnText) btnText.textContent = originalText;
                    if (loader) loader.style.display = 'none';
                });
            });
        }

        // --- 4. Dynamic Year ---
        const yearSpan = document.getElementById('currentYear');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // --- 5. Smooth Scroll Fallback ---
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId) return;
                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                const offset = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            });
        });

        console.log('%c✅ Digital Maestros ready', 'color: #84CC16; font-weight: bold;');
    });
})();