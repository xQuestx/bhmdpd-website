// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

function initDarkMode() {
    // Get saved preference
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    
    // Set initial state
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        // Update theme-color meta tag
        updateThemeColor(true);
    }

    // Get the toggle button
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (darkModeToggle) {
        // Update button icon based on current state
        updateDarkModeIcon(darkMode);
        
        // Add click listener
        darkModeToggle.addEventListener('click', () => {
            // Add transition class to body before toggling dark mode
            document.body.classList.add('transitioning');
            document.documentElement.classList.add('transitioning');
            
            // Toggle dark mode
            document.body.classList.toggle('dark-mode');
            document.documentElement.classList.toggle('dark-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            updateDarkModeIcon(isDarkMode);
            updateThemeColor(isDarkMode);
            
            // Remove transition class after animation completes
            setTimeout(() => {
                document.body.classList.remove('transitioning');
                document.documentElement.classList.remove('transitioning');
            }, 600); // Slightly longer than the CSS transition duration
            
            // Force repaint of mobile navigation if it's active
            const navWrapper = document.querySelector('.nav-wrapper');
            if (navWrapper && navWrapper.classList.contains('active')) {
                navWrapper.style.display = 'none';
                setTimeout(() => {
                    navWrapper.style.display = 'flex';
                }, 10);
            }
        });
    }
}

function updateDarkModeIcon(isDarkMode) {
    const moonIcon = document.querySelector('.dark-mode-toggle .fa-moon');
    const sunIcon = document.querySelector('.dark-mode-toggle .fa-sun');
    
    if (moonIcon && sunIcon) {
        if (isDarkMode) {
            // Fade out moon, fade in sun
            moonIcon.style.opacity = '0';
            sunIcon.style.opacity = '1';
            
            // After fade animation, update display
            setTimeout(() => {
                moonIcon.style.display = 'none';
                sunIcon.style.display = 'inline-block';
            }, 300);
        } else {
            // Fade out sun, fade in moon
            sunIcon.style.opacity = '0';
            moonIcon.style.opacity = '1';
            
            // After fade animation, update display
            setTimeout(() => {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'inline-block';
            }, 300);
        }
    }
}

function updateThemeColor(isDarkMode) {
    const themeColorMeta = document.getElementById('theme-color');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', isDarkMode ? '#121212' : '#ffffff');
    }
    
    const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatusBarMeta) {
        appleStatusBarMeta.setAttribute('content', isDarkMode ? 'black' : 'default');
    }
} 