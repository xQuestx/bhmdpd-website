document.addEventListener('DOMContentLoaded', function() {
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
                if (this.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    
                    // Close all dropdowns when closing the menu
                    const activeDropdowns = navWrapper.querySelectorAll('.dropdown.active');
                    activeDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                        const caretIcon = dropdown.querySelector('.fa-caret-down');
                        if (caretIcon) {
                            caretIcon.style.transform = 'rotate(0deg)';
                        }
                    });
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
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    
                    // Close all dropdowns
                    const activeDropdowns = navWrapper.querySelectorAll('.dropdown.active');
                    activeDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                        const caretIcon = dropdown.querySelector('.fa-caret-down');
                        if (caretIcon) {
                            caretIcon.style.transform = 'rotate(0deg)';
                        }
                    });
                });
            }

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
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    
                    // Close all dropdowns
                    const activeDropdowns = navWrapper.querySelectorAll('.dropdown.active');
                    activeDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                        const caretIcon = dropdown.querySelector('.fa-caret-down');
                        if (caretIcon) {
                            caretIcon.style.transform = 'rotate(0deg)';
                        }
                    });
                }
            });

            // Handle dropdowns in mobile menu
            const dropdowns = navWrapper.querySelectorAll('.dropdown > a');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        console.log('Dropdown clicked in mobile view');
                        e.preventDefault();
                        e.stopPropagation(); // Prevent event bubbling
                        
                        // Close other dropdowns
                        const allDropdowns = navWrapper.querySelectorAll('.dropdown');
                        allDropdowns.forEach(item => {
                            if (item !== this.parentElement) {
                                item.classList.remove('active');
                                const otherCaret = item.querySelector('.fa-caret-down');
                                if (otherCaret) {
                                    otherCaret.style.transform = 'rotate(0deg)';
                                }
                            }
                        });
                        
                        // Toggle the current dropdown
                        this.parentElement.classList.toggle('active');
                        
                        // Toggle caret icon rotation
                        const caretIcon = this.querySelector('.fa-caret-down');
                        if (caretIcon) {
                            caretIcon.style.transform = this.parentElement.classList.contains('active') 
                                ? 'rotate(180deg)' 
                                : 'rotate(0deg)';
                        }
                    }
                });
            });
            
            // Handle all navigation links in mobile view for consistent behavior
            const allNavLinks = navWrapper.querySelectorAll('.nav-links > li > a:not(.dropdown > a)');
            allNavLinks.forEach(link => {
                if (!link.closest('.dropdown')) {
                    link.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            console.log('Nav link clicked in mobile view');
                            // Don't prevent default to allow navigation
                            
                            // Close the menu
                            navWrapper.classList.remove('active');
                            mobileMenuBtn.classList.remove('active');
                            body.classList.remove('menu-open');
                            const icon = mobileMenuBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                            
                            // Add visual feedback
                            this.classList.add('clicked');
                            setTimeout(() => {
                                this.classList.remove('clicked');
                            }, 300);
                        }
                    });
                }
            });
            
            // Allow clicking on dropdown links in mobile view
            const dropdownLinks = navWrapper.querySelectorAll('.dropdown-content a');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        console.log('Dropdown link clicked');
                        // Don't prevent default here to allow navigation
                        // Just close the menu
                        navWrapper.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                        body.classList.remove('menu-open');
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                        
                        // Add visual feedback
                        this.classList.add('clicked');
                        setTimeout(() => {
                            this.classList.remove('clicked');
                        }, 300);
                    }
                });
            });
            
            // Add resize handler to reset mobile menu when switching to desktop view
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768 && navWrapper.classList.contains('active')) {
                    console.log('Window resized to desktop, resetting mobile menu');
                    navWrapper.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    body.classList.remove('menu-open');
                    
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                    
                    // Reset all dropdowns
                    const activeDropdowns = navWrapper.querySelectorAll('.dropdown.active');
                    activeDropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                        const caretIcon = dropdown.querySelector('.fa-caret-down');
                        if (caretIcon) {
                            caretIcon.style.transform = 'rotate(0deg)';
                        }
                    });
                }
            });
        }
    }

    // Initialize all components
    initHeaderScroll();
    initBackToTop();
    initTabs();
    initReadMore();
    initMobileMenu();

    // Initialize scroll progress if element exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        initScrollProgress();
    }

    function initKeyboardNav() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const content = dropdown.querySelector('.dropdown-content');
            
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    content.style.display = content.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    }

    // Add to your initialization
    initKeyboardNav();

    function initShareButtons() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const card = btn.closest('.news-card');
                const title = card.querySelector('h3').textContent;
                const text = card.querySelector('.news-preview p').textContent;
                
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: title,
                            text: text,
                            url: window.location.href
                        });
                    } catch (err) {
                        console.log('Error sharing:', err);
                    }
                } else {
                    // Fallback copy to clipboard
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                }
            });
        });
    }

    // Add to your initialization
    initShareButtons();

    function initScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            window.addEventListener('scroll', () => {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (window.scrollY / totalHeight) * 100;
                scrollProgress.style.width = `${progress}%`;
            });
        }
    }

    // Make sure to call it after DOM is loaded
    initScrollProgress();

    // Add this function to handle anchor navigation
    function handleAnchorLinks() {
        // Check if we have a hash in the URL (anchor link)
        if (window.location.hash) {
            // Prevent the default scroll
            event.preventDefault();
            
            // Get the target element
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Wait a brief moment for page to settle
                setTimeout(() => {
                    // Get header height for offset
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    
                    // Calculate position
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                    
                    // Smooth scroll to element
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }

    // Add to your initialization
    handleAnchorLinks();
    
    // Handle dynamic navigation to anchor links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
