// Environment detection for conditional logging
const IS_PRODUCTION = window.location.hostname !== 'localhost' && 
                     !window.location.hostname.startsWith('127.0.0.1') && 
                     !window.location.hostname.startsWith('192.168.');

function log(...args) {
    if (!IS_PRODUCTION) {
        console.log(...args);
    }
}

// Reusable ripple effect helper
function applyRippleEffect(button, event) {
    // Remove any existing ripple to prevent multiple ripples on fast clicks
    const oldRipple = button.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Hero Parallax Effect (moved from inline)
function initHeroParallax() {
    const heroSection = document.querySelector('.modern-hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroSection || !heroImage) return;
    
    let ticking = false;
    
    const updateParallax = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < heroSection.offsetHeight) {
            heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        }
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// FAQ Accordion functionality (moved from inline)
function initFaqAccordions() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length === 0) return;
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle the active class on the parent faq-item
            const faqItem = question.closest('.faq-item');
            faqItem.classList.toggle('active');
            
            // Get the answer element
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle the answer's visibility
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0px';
            }
        });
    });
}

// Permit Accordion functionality (moved from inline)
function initPermitAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    if (accordionButtons.length === 0) return;
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class on the button
            this.classList.toggle('active');
            
            // Toggle the accordion content
            const content = this.parentElement.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
            
            // Toggle the chevron icon
            const icon = this.querySelector('.accordion-icon');
            if (icon) {
                icon.classList.toggle('rotate');
            }
        });
    });
}

// Show more/less permits functionality (moved from inline)
function initShowMoreLessPermits() {
    const showMoreBtn = document.querySelector('.show-more-permits');
    const showLessBtn = document.querySelector('.show-less-permits');
    const hiddenPermits = document.querySelector('.hidden-permits');
    
    if (!showMoreBtn || !showLessBtn || !hiddenPermits) return;
    
    showMoreBtn.addEventListener('click', function() {
        hiddenPermits.style.display = 'block';
        showMoreBtn.style.display = 'none';
        showLessBtn.style.display = 'inline-block';
        
        // Smooth scroll to the first hidden permit
        const firstHiddenPermit = hiddenPermits.querySelector('.accordion-item');
        if (firstHiddenPermit) {
            firstHiddenPermit.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    showLessBtn.addEventListener('click', function() {
        hiddenPermits.style.display = 'none';
        showMoreBtn.style.display = 'inline-block';
        showLessBtn.style.display = 'none';
        
        // Scroll back to the show more button
        showMoreBtn.scrollIntoView({ behavior: 'smooth' });
    });
}

// Cross-page scroll targeting (moved from inline)
function handleCrossPageScrollTarget() {
    // Handle all links that go to contact.html#scott-pinkham specifically
    document.querySelectorAll('a[href="contact.html#scott-pinkham"]').forEach(link => {
        log('Found parking manager link:', link);
        link.addEventListener('click', function(e) {
            log('Parking manager link clicked');
            e.preventDefault();
            
            // Store the hash for after page load
            sessionStorage.setItem('scrollTarget', 'scott-pinkham');
            window.location.href = this.href;
        });
    });

    // Check if we need to scroll after page load
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    if (scrollTarget) {
        log('Found scroll target:', scrollTarget);
        const targetElement = document.getElementById(scrollTarget);
        if (targetElement) {
            log('Found target element:', targetElement);
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add accessibility focus
                if (!targetElement.hasAttribute('tabindex') && 
                    !targetElement.isContentEditable && 
                    !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(targetElement.tagName)) {
                    targetElement.setAttribute('tabindex', '-1');
                }
                targetElement.focus({ preventScroll: true });
                
                log('Scrolling to and focusing element');
            }, 500);
        }
        sessionStorage.removeItem('scrollTarget');
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const body = document.body;
    const dropdownTriggers = document.querySelectorAll('.nav-wrapper .dropdown > button');

    if (!mobileMenuBtn || !navWrapper) return;

    const toggleMenu = (forceClose = false) => {
        const menuIsActive = navWrapper.classList.contains('active');
        if (forceClose || menuIsActive) {
            navWrapper.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            closeAllMobileDropdowns();
        } else {
            navWrapper.classList.add('active');
            body.classList.add('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            mobileMenuBtn.querySelector('i').classList.replace('fa-bars', 'fa-times');
        }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(true);
        });
    }

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth > 768) return;
            e.preventDefault();
            e.stopPropagation();

            const parentLi = this.closest('li.dropdown');
            const dropdownContent = parentLi.querySelector('.dropdown-content');
            const isCurrentlyActive = parentLi.classList.contains('active');

            // Close other dropdowns before opening a new one
            if (!isCurrentlyActive) {
                closeAllMobileDropdowns();
            }

            // Toggle the current dropdown
            parentLi.classList.toggle('active');
            this.setAttribute('aria-expanded', !isCurrentlyActive);
            dropdownContent.style.display = isCurrentlyActive ? 'none' : 'block';
            const caret = this.querySelector('.fa-caret-down');
            if (caret) {
                caret.style.transform = isCurrentlyActive ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (navWrapper.classList.contains('active') && !navWrapper.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMenu(true);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navWrapper.classList.contains('active')) {
            toggleMenu(true);
        }
    });
}

function closeAllMobileDropdowns() {
    document.querySelectorAll('.nav-wrapper .dropdown').forEach(dropdownLi => {
        dropdownLi.classList.remove('active');
        const trigger = dropdownLi.querySelector('button[aria-expanded]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        const content = dropdownLi.querySelector('.dropdown-content');
        if (content) content.style.display = 'none';
        const caret = dropdownLi.querySelector('.fa-caret-down');
        if (caret) caret.style.transform = 'rotate(0deg)';
    });
}

// Back to Top Button
function initBackToTop() {
    const button = document.createElement('button');
    button.id = 'backToTopBtn';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('title', 'Back to top');
    button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    }, { passive: true });

    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Tab Functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabLinks = document.querySelectorAll('.tab-link');

    // Function to switch tabs
    function switchTab(tabId) {
        // Remove .active from all tab buttons
        tabButtons.forEach((btn) => btn.classList.remove('active'));
        // Remove .active from all tab contents
        tabContents.forEach((tab) => tab.classList.remove('active'));

        // Find and activate the corresponding tab button
        const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Activate the matching tab content
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Handle special tab functionality
        if (tabId === 'tides') {
            log('Tides tab clicked, checking tide chart...');
            if (!window.tideChartInstance) {
                log('Creating new tide chart instance...');
                window.tideChartInstance = new window.TideChart();
            } else if (!window.tideChartInstance.chart) {
                log('Tide chart not loaded, attempting to fetch data...');
                window.tideChartInstance.waitForChartJS();
            } else {
                // Chart exists or data is ready, render/refresh it
                setTimeout(() => {
                    if (window.tideChartInstance.chart) {
                        window.tideChartInstance.refreshChart();
                    } else if (window.tideChartInstance.chartData) {
                        // Data is ready but chart hasn't been rendered yet
                        log('Rendering deferred chart...');
                        window.tideChartInstance.renderChart();
                    }
                }, 100);
            }
        }
    }

    tabButtons.forEach((button) => {
        // Add ripple effect to tab buttons
        button.addEventListener('click', function(e) {
            applyRippleEffect(this, e);
            
            // Get the ID from data-tab="..."
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Handle tab links (like parking map link in quick links)
    tabLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
            }
        });
    });
}

// Read More Functionality
function initReadMore() {
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function() {
            const newsCard = this.closest('.news-card');
            const preview = newsCard.querySelector('.news-preview');
            const fullContent = newsCard.querySelector('.news-full');
            
            if (fullContent.style.display === 'none') {
                preview.style.display = 'none';
                fullContent.style.display = 'block';
                this.innerHTML = 'Read Less <i class="fas fa-arrow-left"></i>';
            } else {
                preview.style.display = 'block';
                fullContent.style.display = 'none';
                this.innerHTML = 'Read More <i class="fas fa-arrow-right"></i>';
            }
        });
    });
}


// Initialize accordions (consolidated)
function initAccordions() {
    log('Initializing accordions');
    initFaqAccordions();
    initPermitAccordions();
}

// Scroll Animation Functionality
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    
    if (!elementsToAnimate.length) {
        log('No elements found for scroll animation.');
        return;
    }

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
                log('Element is visible, animating:', entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    log(`Scroll animation observer initialized for ${elementsToAnimate.length} elements.`);
}

// Add ripple effect to all .btn elements
function initButtonRipples() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            applyRippleEffect(this, e);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    log('DOM fully loaded and parsed');
    
    // Initialize critical components first
    log('Initializing critical components');
    initHeaderScroll(); // Critical for header appearance
    initMobileMenu(); // Critical for all navigation
    
    // Initialize critical components specific to page load
    handleCrossPageScrollTarget(); // Handle cross-page navigation with scroll targeting
    initHeroParallax(); // Initialize parallax effect (needs scroll listener from start)
    
    // Defer non-critical initializations
    setTimeout(function() {
        // Initialize non-critical components
        initReadMore();
        initAccordions(); // This now calls both FAQ and Permit accordions
        initTabs();
        initBackToTop();
        initScrollAnimations();
        initShowMoreLessPermits(); // Initialize show more/less permits functionality
        log('Non-critical components initialized');
    }, 100); // Short delay to prioritize critical rendering
    
    // Initialize button ripples (visual enhancement)
    initButtonRipples();
    
    // Log initialization complete
    log('All components initialized');
});

