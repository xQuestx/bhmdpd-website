// Footer Updater Script
document.addEventListener('DOMContentLoaded', function() {
    // Update the address section to include both locations
    const addressContainer = document.querySelector('.footer-logo-container');
    if (addressContainer) {
        // Find the Bar Harbor address paragraph
        const barHarborAddress = addressContainer.querySelector('p:nth-of-type(2)');
        
        if (barHarborAddress) {
            // Create a new element for the Mount Desert address
            const mountDesertAddress = document.createElement('p');
            mountDesertAddress.innerHTML = '<i class="fas fa-map-marker-alt"></i> 21 Sea St, Northeast Harbor, ME 04662';
            
            // Insert the Mount Desert address after the Bar Harbor address
            barHarborAddress.insertAdjacentElement('afterend', mountDesertAddress);
            
            // Update the Bar Harbor address to include an icon
            barHarborAddress.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + barHarborAddress.innerHTML;
        }
    }
    
    // Update the map section title
    const mapTitle = document.querySelector('.footer-map h3');
    if (mapTitle) {
        mapTitle.innerHTML = '<i class="fas fa-map-marker-alt"></i> Our Locations';
    }
    
    // Update the map to show both locations
    const mapIframe = document.querySelector('.footer-map iframe');
    if (mapIframe) {
        // Replace with a map that shows both locations
        mapIframe.src = "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d106989.19727148522!2d-68.33562121640625!3d44.35478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x4caebf7cae314357%3A0xb7e0edbf086c978c!2s37%20Firefly%20Ln%2C%20Bar%20Harbor%2C%20ME%2004609!3m2!1d44.3882138!2d-68.2061151!4m5!1s0x4caea3b20ea22925%3A0x99c63ebf2c3ad3c0!2s21%20Sea%20St%2C%20Northeast%20Harbor%2C%20ME%2004662!3m2!1d44.2946698!2d-68.2910502!5m1!1e1";
        
        // Remove the badge marker since we now have two locations
        const badgeMarker = document.querySelector('.map-badge-marker');
        if (badgeMarker) {
            badgeMarker.remove();
        }
    }
});