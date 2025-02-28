document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.getElementById('theme-color').setAttribute('content', '#121212');
    }
});