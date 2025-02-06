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