/**
 * Portfolio Website JavaScript
 * Main functionality for the portfolio website
 * Improved with modern ES6+ practices and better architecture
 */

// Configuration
const CONFIG = {
    RESUME_URL: "https://vishalmewada.github.io/VishalMewara/Vishal%20Mewara%20-%20Resume%20-%20Assistant%20Manager%20L&D.pdf",
    RESUME_FILENAME: "Vishal_Mewara_Resume.pdf",
    SOCIAL_LINKS: {
        twitter: "https://x.com/VishalMewara_ID",
        linkedin: "https://www.linkedin.com/in/vishalmewara/"
    },
    ANIMATION_DELAY: 100,
    NOTIFICATION_DURATION: 3000,
    EMAILJS: {
        PUBLIC_KEY: "oFiLURRvxACzTkodG",
        TEMPLATE_ID: "template_ikji9av",
        SERVICE_ID: "service_f9sv6am"
    }
};

/**
 * Utility functions
 */
const Utils = {
    /**
     * Set the current year in the footer
     */
    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    },

    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of notification (success, error, warning, info)
     */
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        // Set background color based on type
        const bgColor = type === 'success' ? 'bg-green-500' : 
                       type === 'error' ? 'bg-red-500' : 
                       type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
        
        notification.className += ` ${bgColor} text-white`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, CONFIG.ANIMATION_DELAY);

        // Remove after specified duration
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, CONFIG.NOTIFICATION_DURATION);
    },

    /**
     * Smooth scroll to element
     * @param {string} elementId - The ID of the element to scroll to
     */
    smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    /**
     * Debounce function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function for performance optimization
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/**
 * Mobile menu functionality
 */
const MobileMenu = {
    /**
     * Toggle mobile menu visibility
     */
    toggle() {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('mobile-menu-btn');
        
        if (menu && button) {
            const isHidden = menu.classList.contains('hidden');
            
            if (isHidden) {
                menu.classList.remove('hidden');
                menu.classList.add('block');
                button.setAttribute('aria-expanded', 'true');
            } else {
                menu.classList.remove('block');
                menu.classList.add('hidden');
                button.setAttribute('aria-expanded', 'false');
            }
        }
    },

    /**
     * Close mobile menu
     */
    close() {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('mobile-menu-btn');
        
        if (menu && button) {
            menu.classList.remove('block');
            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
        }
    },

    /**
     * Initialize mobile menu event listeners
     */
    init() {
        const button = document.getElementById('mobile-menu-btn');
        
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('mobile-menu');
            const menuButton = document.getElementById('mobile-menu-btn');
            
            if (menu && menuButton && !menu.contains(e.target) && !menuButton.contains(e.target)) {
                this.close();
            }
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth >= 768) { // md breakpoint
                this.close();
            }
        }, 250));

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
};

/**
 * Download functionality
 */
const DownloadManager = {
    /**
     * Download the resume PDF
     */
    downloadResume() {
        try {
    const link = document.createElement('a');
            link.href = CONFIG.RESUME_URL;
            link.download = CONFIG.RESUME_FILENAME;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
            
            Utils.showNotification('Resume download started!', 'success');
        } catch (error) {
            console.error('Error downloading resume:', error);
            Utils.showNotification('Failed to download resume. Please try again.', 'error');
        }
    },

    /**
     * Initialize download event listeners
     */
    init() {
        const downloadButton = document.getElementById('download-cv-btn');
        
        if (downloadButton) {
            downloadButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }
    }
};

/**
 * Animation and interaction functionality
 */
const Animations = {
    /**
     * Initialize scroll animations
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.project-card, .skill-progress');
        animateElements.forEach(el => observer.observe(el));
    },

    /**
     * Initialize project card hover effects
     */
    initProjectCardEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    },

    /**
     * Initialize smooth scrolling for anchor links
     */
    initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    Utils.smoothScrollTo(href.substring(1));
                }
            });
        });
    }
};

/**
 * Form handling functionality
 */
const FormHandler = {
    /**
     * Initialize EmailJS
     */
    initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(CONFIG.EMAILJS.PUBLIC_KEY);
            console.log('EmailJS initialized successfully');
        } else {
            console.error('EmailJS not loaded');
        }
    },

    /**
     * Handle contact form submission
     * @param {Event} event - Form submission event
     */
    async handleContactForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="mdi mdi-loading mdi-spin mr-2" aria-hidden="true"></i>Sending...';
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.message) {
                Utils.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!this.isValidEmail(data.email)) {
                Utils.showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Prepare template parameters - try multiple common variable names
            const templateParams = {
                // Common EmailJS template variable names
                from_name: data.name,
                from_email: data.email,
                name: data.name,
                email: data.email,
                subject: data.subject || 'New Contact Form Submission',
                message: data.message,
                // Additional variations that might be used in templates
                user_name: data.name,
                user_email: data.email,
                contact_name: data.name,
                contact_email: data.email,
                sender_name: data.name,
                sender_email: data.email
            };
            
            console.log('Form data collected:', data);
            console.log('Template parameters:', templateParams);
            console.log('EmailJS config:', CONFIG.EMAILJS);
            
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS not loaded');
            }
            
            // Send email using EmailJS
            const response = await emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID,
                CONFIG.EMAILJS.TEMPLATE_ID,
                templateParams
            );
            
            if (response.status === 200) {
                Utils.showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send email');
            }
            
        } catch (error) {
            console.error('Error sending email:', error);
            Utils.showNotification('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Test EmailJS connection
     */
    async testEmailJS() {
        try {
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS not loaded');
                return false;
            }
            
            console.log('Testing EmailJS connection...');
            console.log('Service ID:', CONFIG.EMAILJS.SERVICE_ID);
            console.log('Template ID:', CONFIG.EMAILJS.TEMPLATE_ID);
            console.log('Public Key:', CONFIG.EMAILJS.PUBLIC_KEY);
            
            // Test with minimal data
            const testParams = {
                from_name: 'Test User',
                from_email: 'test@example.com',
                name: 'Test User',
                email: 'test@example.com',
                subject: 'Test Email',
                message: 'This is a test email from the contact form.'
            };
            
            const response = await emailjs.send(
                CONFIG.EMAILJS.SERVICE_ID,
                CONFIG.EMAILJS.TEMPLATE_ID,
                testParams
            );
            
            console.log('EmailJS test successful:', response);
            return true;
        } catch (error) {
            console.error('EmailJS test failed:', error);
            return false;
        }
    },

    /**
     * Initialize form event listeners
     */
    init() {
        // Initialize EmailJS with retry mechanism
        this.initEmailJS();
        
        // Retry EmailJS initialization if not loaded initially
        if (typeof emailjs === 'undefined') {
            setTimeout(() => {
                console.log('Retrying EmailJS initialization...');
                this.initEmailJS();
            }, 1000);
        }
        
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
            console.log('Contact form event listener attached');
        } else {
            console.error('Contact form not found');
        }
        
        // Test EmailJS connection after a delay
        setTimeout(() => {
            this.testEmailJS();
        }, 2000);
    }
};

/**
 * Performance optimization functionality
 */
const Performance = {
    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    },

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.as = 'style';
        criticalCSS.href = 'style.css';
        document.head.appendChild(criticalCSS);

        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'font';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);
    }
};

/**
 * Accessibility functionality
 */
const Accessibility = {
    /**
     * Initialize keyboard navigation
     */
    initKeyboardNavigation() {
        // Handle keyboard navigation for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                MobileMenu.close();
            }
        });

        // Handle focus management for modals (if any)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    },

    /**
     * Handle tab navigation for accessibility
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    },

    /**
     * Enhance ARIA attributes
     */
    enhanceARIA() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add ARIA descriptions to complex elements
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            if (title) {
                card.setAttribute('aria-labelledby', `project-${index + 1}`);
                title.id = `project-${index + 1}`;
            }
        });
    }
};

/**
 * Analytics functionality
 */
const Analytics = {
    /**
     * Track page view
     */
    trackPageView() {
        // Placeholder for analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    },

    /**
     * Initialize click tracking
     */
    initClickTracking() {
        // Track download button clicks
        const downloadButton = document.getElementById('download-cv-btn');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                this.trackEvent('download', 'resume');
            });
        }

        // Track project link clicks
        const projectLinks = document.querySelectorAll('a[href="Project.html"]');
        projectLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.trackEvent('navigation', 'projects_page');
            });
        });
    },

    /**
     * Track custom events
     * @param {string} action - Action being tracked
     * @param {string} label - Label for the action
     */
    trackEvent(action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'engagement',
                event_label: label
            });
        }
    }
};

/**
 * Main initialization function
 */
function init() {
    // Set current year
    Utils.setCurrentYear();

    // Initialize all modules
    MobileMenu.init();
    DownloadManager.init();
    FormHandler.init();
    Performance.initLazyLoading();
    Performance.preloadCriticalResources();
    Accessibility.initKeyboardNavigation();
    Accessibility.enhanceARIA();
    Analytics.trackPageView();
    Analytics.initClickTracking();

    // Initialize animations
    Animations.initScrollAnimations();
    Animations.initProjectCardEffects();
    Animations.initSmoothScrolling();

    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        Utils.showNotification('An error occurred. Please refresh the page.', 'error');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        Utils.showNotification('An error occurred. Please try again.', 'error');
    });

    console.log('Portfolio website initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

