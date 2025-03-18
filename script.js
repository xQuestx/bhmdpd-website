document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Add News Dropdown to Navigation first
    console.log('Adding News dropdown to navigation');
    addNewsDropdown();
    console.log('News dropdown addition complete');
    
    // Then initialize components
    initReadMore();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initAccordions();
    initTabs();
    initModals();
    initTooltips();
    initDropdowns();
    
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

    // Back to Top Button
    function initBackToTop() {
        const button = document.createElement('button');
        button.id = 'back-to-top';
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            button.classList.toggle('visible', window.scrollY > 300);
        });

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

    // Mobile Menu Functionality
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileCloseBtn = document.querySelector('.mobile-close-btn');
        const navWrapper = document.querySelector('.nav-wrapper');
        const body = document.body;
        const dropdowns = document.querySelectorAll('.dropdown > a');

        if (mobileMenuBtn && navWrapper) {
            console.log('Mobile menu initialized');
            
            // Toggle menu on hamburger button click
            mobileMenuBtn.addEventListener('click', function(e) {
                console.log('Mobile menu button clicked');
                e.stopPropagation();
                this.classList.toggle('active');
                navWrapper.classList.toggle('active');
                body.classList.toggle('menu-open');
                
                // Toggle icon
                const icon = this.querySelector('i');
                if (icon) {
                    if (this.classList.contains('active')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                        
                        // Close all dropdowns when closing the menu
                        closeAllDropdowns();
                    }
                }
            });
            
            // Handle close button click
            if (mobileCloseBtn) {
                mobileCloseBtn.addEventListener('click', function(e) {
                    console.log('Mobile close button clicked');
                    e.stopPropagation();
                    navWrapper.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    body.classList.remove('menu-open');
                    
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    
                    // Close all dropdowns
                    closeAllDropdowns();
                });
            }

            // Toggle dropdowns on mobile
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const parent = this.parentElement;
                        
                        // Check if this dropdown is already active
                        const wasActive = parent.classList.contains('active');
                        
                        // First close all dropdowns
                        closeAllDropdowns();
                        
                        // If it wasn't active before, open it
                        if (!wasActive) {
                            // Toggle current dropdown
                            parent.classList.add('active');
                            
                            // Toggle caret icon
                            const caret = this.querySelector('.fa-caret-down');
                            if (caret) {
                                caret.style.transform = 'rotate(180deg)';
                            }
                        }
                    }
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (navWrapper.classList.contains('active') && 
                    !navWrapper.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target)) {
                    console.log('Clicked outside menu, closing');
                    navWrapper.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    body.classList.remove('menu-open');
                    
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    
                    // Close all dropdowns
                    closeAllDropdowns();
                }
            });
        }
    }
    
    // Helper function to close all dropdowns
    function closeAllDropdowns() {
        console.log('Closing all dropdowns');
        const allDropdowns = document.querySelectorAll('.dropdown');
        
        allDropdowns.forEach(dropdown => {
            // Remove active class
            dropdown.classList.remove('active');
            
            // Reset caret rotation
            const caret = dropdown.querySelector('.fa-caret-down');
            if (caret) {
                caret.style.transform = 'rotate(0deg)';
            }
            
            // Hide dropdown content
            const content = dropdown.querySelector('.dropdown-content');
            if (content) {
                content.style.visibility = 'hidden';
                content.style.maxHeight = '0';
                content.style.opacity = '0';
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

    // Helper function to set up mobile dropdown functionality
    function setupMobileDropdown(dropdown) {
        console.log('Setting up mobile dropdown for:', dropdown);
        const dropdownLink = dropdown.querySelector('a');
        const navWrapper = document.querySelector('.nav-wrapper');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        if (!navWrapper) {
            console.log('Nav wrapper not found');
            return;
        }
        
        // Add click event for mobile dropdown toggle
        if (dropdownLink) {
            console.log('Adding click event to dropdown link');
            
            // Remove any existing click event listeners
            const newDropdownLink = dropdownLink.cloneNode(true);
            dropdownLink.parentNode.replaceChild(newDropdownLink, dropdownLink);
            
            newDropdownLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    console.log('Dropdown clicked in mobile view');
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event bubbling
                    
                    // Get all dropdowns
                    const allDropdowns = document.querySelectorAll('.dropdown');
                    const parent = this.parentElement;
                    
                    // Check if this dropdown is already active
                    const wasActive = parent.classList.contains('active');
                    
                    // First, close ALL dropdowns
                    allDropdowns.forEach(item => {
                        // Remove active class
                        item.classList.remove('active');
                        
                        // Reset caret rotation
                        const caret = item.querySelector('.fa-caret-down');
                        if (caret) {
                            caret.style.transform = 'rotate(0deg)';
                        }
                        
                        // Hide dropdown content
                        const content = item.querySelector('.dropdown-content');
                        if (content) {
                            content.style.visibility = 'hidden';
                            content.style.maxHeight = '0';
                            content.style.opacity = '0';
                        }
                    });
                    
                    // If the clicked dropdown wasn't active before, open it
                    if (!wasActive) {
                        // Toggle the current dropdown
                        parent.classList.add('active');
                        console.log('Opening dropdown:', parent);
                        
                        // Rotate caret icon
                        const caretIcon = this.querySelector('.fa-caret-down');
                        if (caretIcon) {
                            caretIcon.style.transform = 'rotate(180deg)';
                        }
                        
                        // Show dropdown content
                        if (dropdownContent) {
                            dropdownContent.style.visibility = 'visible';
                            dropdownContent.style.maxHeight = '500px';
                            dropdownContent.style.opacity = '1';
                        }
                    }
                }
            });
        }
        
        // Add click events to dropdown links
        const dropdownLinks = dropdown.querySelectorAll('.dropdown-content a');
        dropdownLinks.forEach(link => {
            // Remove any existing click event listeners
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    console.log('Dropdown link clicked in mobile view');
                    // Don't prevent default here to allow navigation
                    
                    // Close the menu
                    navWrapper.classList.remove('active');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.remove('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                    document.body.classList.remove('menu-open');
                    
                    // Add visual feedback
                    this.classList.add('clicked');
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 300);
                }
            });
        });
    }

    // Add News Dropdown to Navigation
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
                setupMobileDropdown(existingDropdownLi);
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
        
        // Add mobile menu event listeners to the new dropdown
        setupMobileDropdown(newsDropdown);
        
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
    
    // Initialize dropdowns
    function initDropdowns() {
        console.log('Initializing dropdowns');
        
        // Get all dropdowns
        const allDropdowns = document.querySelectorAll('.dropdown');
        console.log('Found dropdowns:', allDropdowns.length);
        
        // Set up each dropdown
        allDropdowns.forEach(dropdown => {
            console.log('Setting up dropdown:', dropdown);
            setupMobileDropdown(dropdown);
        });
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
});
