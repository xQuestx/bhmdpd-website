document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slider && slides.length > 0) {
        let currentSlideIndex = 0;
        let slideInterval;

        function showSlide(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlideIndex = index;
        }

        function nextSlide() {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(currentSlideIndex);
        }

        // Add click event listeners to dots
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                });
            });
        }

        // Start automatic slideshow
        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        // Pause slideshow
        function pauseSlideshow() {
            clearInterval(slideInterval);
        }

        // Event listeners for pause/resume
        slider.addEventListener('mouseenter', pauseSlideshow);
        slider.addEventListener('mouseleave', startSlideshow);

        // Initialize first slide and start slideshow
        showSlide(0);
        startSlideshow();
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

    // Initialize additional components
    initHeaderScroll();
    initBackToTop();
});
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
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
});
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
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const body = document.body;

    mobileMenuBtn.addEventListener('click', function(e) {
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
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navWrapper.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navWrapper.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
});
