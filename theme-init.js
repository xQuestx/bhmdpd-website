// Run immediately to set theme colors before rendering to prevent flash
if (localStorage.getItem('darkMode') === 'enabled') {
    // Set the browser theme color meta tag for dark mode
    const themeColorMeta = document.getElementById('theme-color');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', '#121212');
    }
    
    // Set the status bar style for iOS web apps in dark mode
    const appleStatusBarStyleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatusBarStyleMeta) {
        appleStatusBarStyleMeta.setAttribute('content', 'black');
    }
}
