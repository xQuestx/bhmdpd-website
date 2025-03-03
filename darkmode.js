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
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
            updateDarkModeIcon(isDarkMode);
            updateThemeColor(isDarkMode);
            
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
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
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