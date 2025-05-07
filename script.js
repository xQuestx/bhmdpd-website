document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Initialize critical components first
    console.log('Initializing critical components');
    initHeaderScroll(); // Critical for header appearance
    // Only initialize mobile menu on mobile screen sizes
    if (window.innerWidth <= 768) {
        initMobileMenu(); // Critical for mobile navigation
    }
    
    // Add News Dropdown to Navigation
    console.log('Adding News dropdown to navigation');
    addNewsDropdown();
    console.log('News dropdown addition complete');
    
    // Lightbox Initialization (REMOVED)
    // initLightbox(); 
    
    // Defer non-critical initializations
    setTimeout(function() {
        // Initialize non-critical components
        initReadMore();
        initSmoothScroll();
        initAnimations();
        initAccordions();
        initTabs();
        initModals();
        initTooltips();
        initBackToTop();
        initScrollAnimations();
        console.log('Non-critical components initialized');
    }, 100); // Short delay to prioritize critical rendering
    
    // Log initialization complete
    console.log('All components initialized');
    
    // Force check mobile menu visibility on page load
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
        } else {
            mobileMenuBtn.style.display = 'none';
        }
    }

    // Add this debugging code at the top
    console.log('Script loaded');
    
    // Handle all links that go to contact.html#scott-pinkham specifically
    document.querySelectorAll('a[href="contact.html#scott-pinkham"]').forEach(link => {
        console.log('Found parking manager link:', link);
        link.addEventListener('click', function(e) {
            console.log('Parking manager link clicked');
            e.preventDefault();
            
            // Store the hash for after page load
            sessionStorage.setItem('scrollTarget', 'scott-pinkham');
            window.location.href = this.href;
        });
    });

    // Check if we need to scroll after page load
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    if (scrollTarget) {
        console.log('Found scroll target:', scrollTarget);
        const targetElement = document.getElementById(scrollTarget);
        if (targetElement) {
            console.log('Found target element:', targetElement);
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                console.log('Scrolling to element');
            }, 500);
        }
        sessionStorage.removeItem('scrollTarget');
    }

    // Modern Hero Parallax Effect
    const heroSection = document.querySelector('.modern-hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroSection && heroImage) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < heroSection.offsetHeight) {
                // Create a subtle parallax effect
                heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            }
        });
    }

    // FAQ Accordion Functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
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

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
    }

    // Back to Top Button (Updated)
    function initBackToTop() {
        const button = document.createElement('button');
        button.id = 'backToTopBtn'; // Use the ID from the new CSS
        // No need for extra class, ID is sufficient for styling
        button.innerHTML = '<i class="fas fa-arrow-up"></i>'; // Keep Font Awesome icon
        document.body.appendChild(button);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            // Check both documentElement and body for cross-browser compatibility
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                button.style.display = "block";
            } else {
                button.style.display = "none";
            }
        });

        // Scroll to top on click
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Tab Functionality
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach((button) => {
            // Add ripple effect to tab buttons
            button.addEventListener('click', function(e) {
                // Create ripple element
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                // Set position
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                // Remove after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Remove .active from all tab buttons
                tabButtons.forEach((btn) => btn.classList.remove('active'));
                // Remove .active from all tab contents
                tabContents.forEach((tab) => tab.classList.remove('active'));

                // Add .active to the clicked button
                button.classList.add('active');
                // Get the ID from data-tab="..."
                const tabId = button.getAttribute('data-tab');
                // Activate the matching tab content
                document.getElementById(tabId).classList.add('active');
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

    // Mobile Menu Functionality - Restoring to best known working state
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileCloseBtn = document.querySelector('.mobile-close-btn'); // Restoring close button
        const navWrapper = document.querySelector('.nav-wrapper');
        const body = document.body;
        const dropdownTriggers = document.querySelectorAll('.nav-wrapper .dropdown > a'); // General selector for all dropdown triggers

        if (mobileMenuBtn && navWrapper) {
            // Main mobile menu toggle
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const menuIsNowActive = navWrapper.classList.toggle('active');
                body.classList.toggle('menu-open', menuIsNowActive);
                const icon = this.querySelector('i');
                if (icon) {
                    menuIsNowActive ? icon.classList.replace('fa-bars', 'fa-times') : icon.classList.replace('fa-times', 'fa-bars');
                }
                if (!menuIsNowActive) {
                    closeAllMobileDropdowns(); // Close all sub-dropdowns when main menu closes
                }
            });

            // Close button handler (restored)
            if (mobileCloseBtn) {
                mobileCloseBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    navWrapper.classList.remove('active');
                    body.classList.remove('menu-open');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) { icon.classList.replace('fa-times', 'fa-bars'); }
                    mobileMenuBtn.classList.remove('active'); // Ensure button state is reset
                    closeAllMobileDropdowns();
                });
            }

            // Handler for all dropdown triggers
            dropdownTriggers.forEach(trigger => {
                // Ensure a listener isn't added multiple times if initMobileMenu could be recalled
                // (Using a data attribute is a robust way, but for this revert, direct attachment)
                if (trigger.dataset.mobileListenerAttached === 'true') return;
                trigger.dataset.mobileListenerAttached = 'true';

                trigger.addEventListener('click', function(e) {
                    if (window.innerWidth > 768) return; // Only on mobile

                    e.preventDefault();
                    e.stopPropagation();

                    const parentLi = this.closest('li.dropdown');
                    if (!parentLi) return;
                    const dropdownContent = parentLi.querySelector('.dropdown-content');
                    if (!dropdownContent) return;

                    const GIsCurrentlyActive = parentLi.classList.contains('active');
                    const caret = this.querySelector('.fa-caret-down');

                    // Step 1: Handle OTHER dropdowns
                    if (!GIsCurrentlyActive) { // If we intend to OPEN this one, close others
                        document.querySelectorAll('.nav-wrapper .dropdown').forEach(otherLi => {
                            if (otherLi !== parentLi && otherLi.classList.contains('active')) {
                                otherLi.classList.remove('active');
                                const otherContent = otherLi.querySelector('.dropdown-content');
                                const otherCaret = otherLi.querySelector('a > .fa-caret-down');
                                if (otherCaret) otherCaret.style.transform = 'rotate(0deg)';
                                if (otherContent) {
                                    setTimeout(() => {
                                        otherContent.style.display = 'none';
                                    }, 0);
                                }
                            }
                        });
                    }

                    // Step 2: Toggle THIS dropdown
                    if (GIsCurrentlyActive) { // It WAS active, so now we close it
                        parentLi.classList.remove('active');
                        if (caret) caret.style.transform = 'rotate(0deg)';
                        setTimeout(() => {
                            dropdownContent.style.display = 'none';
                        }, 0);
                    } else { // It WAS NOT active, so now we open it
                        parentLi.classList.add('active');
                        if (caret) caret.style.transform = 'rotate(180deg)';
                        setTimeout(() => {
                            dropdownContent.style.display = 'block';
                        }, 0);
                    }
                });
            });

            // Click outside to close (restored)
            document.addEventListener('click', function(e) {
                if (navWrapper.classList.contains('active') && 
                    !navWrapper.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target)) {
                    navWrapper.classList.remove('active');
                    body.classList.remove('menu-open');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) { icon.classList.replace('fa-times', 'fa-bars'); }
                    mobileMenuBtn.classList.remove('active');
                    closeAllMobileDropdowns();
                }
            });
            
            // Escape key to close (restored)
             document.addEventListener('keydown', function(e) {
                 if (e.key === 'Escape' && navWrapper.classList.contains('active')) {
                      navWrapper.classList.remove('active');
                      body.classList.remove('menu-open');
                      const icon = mobileMenuBtn.querySelector('i');
                      if (icon) { icon.classList.replace('fa-times', 'fa-bars'); }
                      mobileMenuBtn.classList.remove('active');
                      closeAllMobileDropdowns();
                 }
             });
        }
    }
    
    // This is the general helper to close all dropdowns
    function closeAllMobileDropdowns() { 
        document.querySelectorAll('.nav-wrapper .dropdown').forEach(dropdownLi => {
            if (dropdownLi.classList.contains('active')) {
                dropdownLi.classList.remove('active');
                const caret = dropdownLi.querySelector('a > .fa-caret-down');
                if (caret) caret.style.transform = 'rotate(0deg)';
                const content = dropdownLi.querySelector('.dropdown-content');
                // Use setTimeout here as well for consistency if called from a problematic context
                if (content) {
                    setTimeout(() => {
                         content.style.display = 'none';
                    }, 0);
                }
            }
        });
    }

    // Initialize all components
    function initAll() {
        console.log('Initializing all components');
        // These are already called at the top of the file
        // initHeaderScroll();
        // initBackToTop();
        // initTabs();
        // initReadMore();
        // initMobileMenu();
        // initKeyboardNav();
        // initShareButtons();
        // initScrollProgress();
        // handleAnchorLinks();
        // addNewsDropdown();
    }

    // Don't call the initialization function again
    // initAll();

    // Helper function to set up mobile dropdown functionality - REMOVED
    /* 
    function setupMobileDropdown(dropdown) { 
        // ... implementation removed ...
    } 
    */

    // Restore addNewsDropdown to use the same logic
    function addNewsDropdown() {
        console.log('Starting addNewsDropdown function');
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) {
            console.log('Nav links not found');
            return;
        }
        
        console.log('Nav links found:', navLinks);
        
        // Check if News dropdown already exists
        const existingNewsDropdown = navLinks.querySelector('li.dropdown a i.fa-newspaper');
        if (existingNewsDropdown) {
            console.log('News dropdown already exists');
            // Even if it exists, make sure it has proper event listeners
            const existingDropdownLi = existingNewsDropdown.closest('li.dropdown');
            if (existingDropdownLi) {
                console.log('Setting up existing News dropdown');
                // setupMobileDropdown(existingDropdownLi); // REMOVED - initMobileMenu listener should cover this now
            }
            return;
        }
        
        // Find the Contact link to insert before
        const contactLink = Array.from(navLinks.children).find(li => {
            const anchor = li.querySelector('a');
            return anchor && anchor.textContent.trim().includes('Contact');
        });
        
        // Create the News dropdown HTML
        const newsDropdown = document.createElement('li');
        newsDropdown.className = 'dropdown';
        
        // Create the dropdown HTML structure
        const dropdownHTML = `
            <a href="#"><i class="fas fa-newspaper"></i> News <i class="fas fa-caret-down"></i></a>
            <ul class="dropdown-content">
                <li><a href="news.html"><i class="fas fa-list"></i> All News</a></li>
                <li><a href="news.html#department-updates"><i class="fas fa-bullhorn"></i> Department Updates</a></li>
                <li><a href="news.html#community-news"><i class="fas fa-users"></i> Community News</a></li>
                <li><a href="news.html#press-releases"><i class="fas fa-file-alt"></i> Press Releases</a></li>
            </ul>
        `;
        
        newsDropdown.innerHTML = dropdownHTML;
        console.log('Created news dropdown element:', newsDropdown);
        
        // Fix paths for subdirectory pages
        fixNewsDropdownPaths(newsDropdown);
        
        // Insert the dropdown in the correct position
        if (contactLink) {
            console.log('Contact link found, inserting before it');
            navLinks.insertBefore(newsDropdown, contactLink);
        } else {
            console.log('Contact link not found, appending to end');
            navLinks.appendChild(newsDropdown);
        }
        
        console.log('News dropdown added to DOM');
        
        // Manually trigger listener attachment for the new dropdown link
        const newDropdownLink = newsDropdown.querySelector('a');
        if (newDropdownLink && !newDropdownLink.dataset.mobileListenerAttached) {
            newDropdownLink.dataset.mobileListenerAttached = 'true'; // Mark as attached
            newDropdownLink.addEventListener('click', function(e) {
                if (window.innerWidth > 768) return; // Only on mobile

                e.preventDefault();
                e.stopPropagation();

                const parentLi = this.closest('li.dropdown');
                if (!parentLi) return;
                const dropdownContent = parentLi.querySelector('.dropdown-content');
                if (!dropdownContent) return;

                const GIsCurrentlyActive = parentLi.classList.contains('active');
                const caret = this.querySelector('.fa-caret-down');

                // Step 1: Handle OTHER dropdowns
                if (!GIsCurrentlyActive) { // If we intend to OPEN this one, close others
                    document.querySelectorAll('.nav-wrapper .dropdown').forEach(otherLi => {
                        if (otherLi !== parentLi && otherLi.classList.contains('active')) {
                            otherLi.classList.remove('active');
                            const otherContent = otherLi.querySelector('.dropdown-content');
                            const otherCaret = otherLi.querySelector('a > .fa-caret-down');
                            if (otherCaret) otherCaret.style.transform = 'rotate(0deg)';
                            if (otherContent) {
                                setTimeout(() => {
                                    otherContent.style.display = 'none';
                                }, 0);
                            }
                        }
                    });
                }

                // Step 2: Toggle THIS dropdown
                if (GIsCurrentlyActive) { // It WAS active, so now we close it
                    parentLi.classList.remove('active');
                    if (caret) caret.style.transform = 'rotate(0deg)';
                    // console.log('Closing (dynamic News):', this.textContent.trim());
                    setTimeout(() => {
                        dropdownContent.style.display = 'none';
                    }, 0);
                } else { // It WAS NOT active, so now we open it
                    parentLi.classList.add('active');
                    if (caret) caret.style.transform = 'rotate(180deg)';
                    // console.log('Opening (dynamic News):', this.textContent.trim());
                    setTimeout(() => {
                        dropdownContent.style.display = 'block';
                    }, 0);
                }
            });
        }
        
        // Force a redraw to ensure the dropdown is visible
        setTimeout(() => {
            newsDropdown.style.display = 'none';
            newsDropdown.offsetHeight; // Force reflow
            newsDropdown.style.display = '';
        }, 100);
    }

    // Helper function to fix paths for subdirectory pages
    function fixNewsDropdownPaths(dropdown) {
        console.log('Fixing paths for news dropdown');
        const path = window.location.pathname;
        if (path.includes('/news-detail/') || path.includes('/subdirectory/')) {
            console.log('In subdirectory, adjusting paths');
            const links = dropdown.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('news.html')) {
                    const newHref = '../' + href;
                    console.log(`Updating href from ${href} to ${newHref}`);
                    link.setAttribute('href', newHref);
                }
            });
        }
    }

    // Initialize smooth scrolling
    function initSmoothScroll() {
        console.log('Initializing smooth scroll');
        // Implementation for smooth scrolling
    }
    
    // Initialize animations
    function initAnimations() {
        console.log('Initializing animations');
        // Implementation for animations
    }
    
    // Initialize accordions
    function initAccordions() {
        console.log('Initializing accordions');
        // Implementation for accordions
    }
    
    // Initialize modals
    function initModals() {
        console.log('Initializing modals');
        // Implementation for modals
    }
    
    // Initialize tooltips
    function initTooltips() {
        console.log('Initializing tooltips');
        // Implementation for tooltips
    }
    
    // Accordion functionality for permit types
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
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
            icon.classList.toggle('rotate');
        });
    });
    
    // Show more/less permits functionality
    const showMoreBtn = document.querySelector('.show-more-permits');
    const showLessBtn = document.querySelector('.show-less-permits');
    const hiddenPermits = document.querySelector('.hidden-permits');
    
    if (showMoreBtn && showLessBtn && hiddenPermits) {
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

    // Scroll Animation Functionality
    function initScrollAnimations() {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        
        if (!elementsToAnimate.length) {
            console.log('No elements found for scroll animation.');
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
                    console.log('Element is visible, animating:', entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
        
        console.log(`Scroll animation observer initialized for ${elementsToAnimate.length} elements.`);
    }

    // Add ripple effect to all .btn elements
    function initButtonRipples() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                // Remove any existing ripple
                const oldRipple = this.querySelector('.ripple');
                if (oldRipple) oldRipple.remove();
                // Create ripple element
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                // Set position
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                // Remove after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    initButtonRipples();
});

// Lightbox Functionality (REMOVED)
/*
function initLightbox() {
    console.log('Initializing lightbox');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (!lightboxOverlay || !lightboxImage || !lightboxClose || lightboxTriggers.length === 0) {
        console.warn('Lightbox elements not found, skipping initialization.');
        return; 
    }

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            const imageSrc = this.getAttribute('href');
            lightboxImage.setAttribute('src', imageSrc);
            lightboxOverlay.classList.add('lightbox-active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            console.log('Lightbox opened with image:', imageSrc);
        });
    });

    const closeLightbox = () => {
        lightboxOverlay.classList.remove('lightbox-active');
        document.body.style.overflow = ''; // Restore background scroll
        console.log('Lightbox closed');
    };

    // Close lightbox when clicking the close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking on the overlay background (but not the image itself)
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === lightboxOverlay) { // Only close if clicking the overlay itself
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('lightbox-active')) {
            closeLightbox();
        }
    });
    console.log('Lightbox event listeners added');
}
*/
