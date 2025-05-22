// Optimized JavaScript for Parking Page
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('a');
        
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) return; // Let mobile menu handle it
            
            // If the dropdown has a submenu, prevent navigation
            if (dropdown.querySelector('.dropdown-content')) {
                e.preventDefault();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    // Initialize tabs immediately to prevent layout shift
    const tabContentsWrapper = document.querySelector('.tab-contents');
    if (tabContentsWrapper) {
        tabContentsWrapper.classList.add('initialized');
    }
    
    // Tab functionality with passive listeners
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Ensure first tab is active to prevent shift
    if (tabButtons.length > 0 && !document.querySelector('.tab-button.active')) {
        tabButtons[0].classList.add('active');
    }
    if (tabContents.length > 0 && !document.querySelector('.tab-content.active')) {
        tabContents[0].classList.add('active');
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Prevent redundant clicks
            if (this.classList.contains('active')) return;
            
            // Update buttons with minimal reflow
            requestAnimationFrame(() => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update content
                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    });
    
    // Remove unnecessary scroll listeners for better performance
    
    // Mobile menu with passive listeners
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navWrapper.classList.add('active');
            document.body.classList.add('menu-open');
        });
    }
    
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function() {
            navWrapper.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    }
    
    // Lazy load images in tabs
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Accordion functionality
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const accordionContent = accordionItem.querySelector('.accordion-content');
            
            // Toggle active state
            this.classList.toggle('active');
            accordionContent.classList.toggle('active');
        });
    });
    
    // Show more/less permits functionality
    const showMoreBtn = document.querySelector('.show-more-permits');
    const showLessBtn = document.querySelector('.show-less-permits');
    const hiddenPermits = document.querySelector('.hidden-permits');
    
    if (showMoreBtn && hiddenPermits) {
        showMoreBtn.addEventListener('click', function() {
            hiddenPermits.classList.add('show');
            this.style.display = 'none';
            if (showLessBtn) showLessBtn.style.display = 'inline-block';
        });
    }
    
    if (showLessBtn && hiddenPermits) {
        showLessBtn.addEventListener('click', function() {
            hiddenPermits.classList.remove('show');
            this.style.display = 'none';
            if (showMoreBtn) showMoreBtn.style.display = 'inline-block';
        });
    }
});