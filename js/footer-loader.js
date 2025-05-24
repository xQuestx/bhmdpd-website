/**
 * Footer Loader Script
 * This script dynamically loads the footer content with both Bar Harbor and Mount Desert addresses
 * and updates the map to show both locations.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create the footer HTML content
    const footerHTML = `
    <footer class="footer" role="contentinfo" aria-label="Site Footer">
        <div class="footer-content">
            <div class="footer-logo-container">
                <img alt="Bar Harbor Mount Desert Police Department Logo" class="footer-logo" src="images/branding/logo.png" width="192" height="262"/>
                <p><strong>Bar Harbor Mount Desert Police Department</strong></p>
                <p><i class="fas fa-map-marker-alt"></i> 37 Firefly Lane, Bar Harbor, ME 04609</p>
                <p><i class="fas fa-map-marker-alt"></i> 21 Sea St, Northeast Harbor, ME 04662</p>
                <p>Bar Harbor: (207) 288-3391</p>
                <p>Mount Desert: (207) 276-5111</p>
                <div class="social-icons">
                    <a aria-label="Visit our Facebook page" class="facebook" href="https://www.facebook.com/profile.php?id=61555282019664" target="_blank" rel="noopener" tabindex="0"><i class="fab fa-facebook-f"></i></a>
                    <a aria-label="Visit our YouTube channel" class="youtube" href="https://youtube.com" target="_blank" tabindex="0"><i class="fab fa-youtube"></i></a>
                </div>
            </div>
            <nav class="footer-links" aria-label="Footer Navigation">
                <section class="footer-column" aria-labelledby="footer-divisions">
                    <h3 id="footer-divisions"><i class="fas fa-building"></i> DIVISIONS</h3>
                    <ul>
                        <li><a href="harbor-master-division.html"><i class="fas fa-ship"></i> Harbor Master</a></li>
                        <li><a href="bar-harbor-parking.html"><i class="fas fa-parking"></i> Parking Enforcement</a></li>
                        <li><a href="admin.html"><i class="fas fa-users"></i> Administrative Services</a></li>
                        <li><a href="animalcontrol.html"><i class="fas fa-paw"></i> Animal Control</a></li>
                    </ul>
                </section>
                <section class="footer-column" aria-labelledby="footer-services">
                    <h3 id="footer-services"><i class="fas fa-concierge-bell"></i> SERVICES</h3>
                    <ul>
                        <li><a href="https://www.maine.gov/dps/msp/media-center/alerts/current-alerts" rel="noopener" target="_blank"><i class="fas fa-bullhorn"></i> AMBER Alert</a></li>
                        <li><a href="https://www.maine.gov/dps/msp/investigation-traffic/missing-persons" rel="noopener" target="_blank"><i class="fas fa-user-slash"></i> Missing Persons</a></li>
                        <li><a href="community-outreach.html"><i class="fas fa-hands-helping"></i> Community Programs</a></li>
                        <li><a href="mentalhealth.html"><i class="fas fa-heart"></i> Mental Health Resources</a></li>
                    </ul>
                </section>
                <section class="footer-column" aria-labelledby="footer-careers">
                    <h3 id="footer-careers"><i class="fas fa-user-tie"></i> CAREERS</h3>
                    <ul>
                        <li><a href="application-process.html"><i class="fas fa-file-alt"></i> Application Process</a></li>
                        <li><a href="opportunities.html"><i class="fas fa-briefcase"></i> Career Opportunities</a></li>
                        <li><a href="benefits.html"><i class="fas fa-medal"></i> Benefits</a></li>
                        <li><a href="application-process.html"><i class="fas fa-file-signature"></i> Apply Now</a></li>
                    </ul>
                </section>
                <section class="footer-column" aria-labelledby="footer-about">
                    <h3 id="footer-about"><i class="fas fa-info-circle"></i> ABOUT</h3>
                    <ul>
                        <li><a href="administration.html"><i class="fas fa-user-shield"></i> Administration</a></li>
                        <li><a href="contact.html#administration"><i class="fas fa-users-cog"></i> Command Staff</a></li>
                        <li><a href="contact.html"><i class="fas fa-envelope"></i> Contact Us</a></li>
                        <li><a href="faq.html"><i class="fas fa-question-circle"></i> FAQ</a></li>
                    </ul>
                </section>
            </nav>
            <div class="footer-map" aria-label="Map showing Bar Harbor Police Department locations">
                <h3><i class="fas fa-map-marker-alt"></i> Our Locations</h3>
                <div class="map-container" style="position:relative;">
                    <div id="map" style="height: 250px; width: 100%; border:1px solid black;"></div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 Bar Harbor Police Department. All Rights Reserved.</p>
            <div class="last-updated"><i class="fas fa-clock" aria-hidden="true" style="margin-right:0.5em;"></i>Last updated: <time datetime="2025-05-24">May 24th, 2025</time></div>
        </div>
    </footer>
    `;

    // Find the existing footer element
    const existingFooter = document.querySelector('footer.footer');
    
    // If a footer exists, replace it with the new footer
    if (existingFooter) {
        existingFooter.outerHTML = footerHTML;
    } else {
        // If no footer exists, append it before the closing body tag
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // --- Initialize Leaflet Map ---
    const initializeMap = async () => {
        try {
            // Wait for Leaflet to be loaded if promise exists
            if (window.leafletLoaded) {
                await window.leafletLoaded;
            }
            
            // Check if L is defined
            if (typeof L === 'undefined') {
                console.warn('Leaflet not loaded, skipping map initialization');
                return;
            }
            
            var map = L.map('map').setView([44.34, -68.25], 10); // Centered view, changed zoom to 10
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add markers
        var marker1 = L.marker([44.3882, -68.2061]).addTo(map) // Bar Harbor
            .bindPopup('<b>Bar Harbor Station</b><br>37 Firefly Ln');
        
        var marker2 = L.marker([44.2943, -68.2913]).addTo(map) // Mount Desert (Northeast Harbor)
            .bindPopup('<b>Mount Desert Station</b><br>21 Sea St, Northeast Harbor');

        // Optional: Adjust bounds to fit markers if needed after initial load
        // var group = new L.featureGroup([marker1, marker2]);
        // map.fitBounds(group.getBounds().pad(0.1)); // Add padding if desired

        // Force map size invalidation after a short delay to account for async CSS
        setTimeout(() => {
            if (map) { // Check if map object still exists
                map.invalidateSize();
            }
        }, 1000); // Increased delay significantly to 1000ms (1 second)

        } catch (e) {
            console.error("Error initializing Leaflet map:", e);
            // Optional: Display a message to the user if the map fails
            const mapDiv = document.getElementById('map');
            if (mapDiv) {
                mapDiv.innerHTML = '<p style="padding: 1em; text-align: center;">Could not load map.</p>';
            }
        }
    };
    
    // Call the map initialization
    initializeMap();
    
    // Expose the function globally for Leaflet callback
    window.initializeFooterMap = initializeMap;
    // --- End Leaflet Map ---
});