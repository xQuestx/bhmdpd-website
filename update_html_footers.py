import os
import re
import glob

# Define the required elements
leaflet_css = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />'
leaflet_js = '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>'
footer_loader_js = '<script src="js/footer-loader.js" defer></script>'

# Find all HTML files
html_files = glob.glob("*.html")
# Include index.html in the processing
print(f"Found {len(html_files)} HTML files to process.")

for filename in html_files:
    print(f"Processing {filename}...")
    needs_update = False
    try:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        original_content = content

        # Add Leaflet CSS to head if not already present
        if leaflet_css not in content:
            match = re.search(r"</head>", content, re.IGNORECASE)
            if match:
                insert_point = match.start()
                content = content[:insert_point] + f"  {leaflet_css}\n" + content[insert_point:]
                needs_update = True
                print(f"  - Added Leaflet CSS to <head>")
            else:
                print(f"  - Warning: Could not find </head> in {filename}.")

        # Add scripts before closing body tag if not already present
        match_body = re.search(r"</body>", content, re.IGNORECASE)
        if match_body:
            insert_point_body = match_body.start()
            scripts_to_add = []
            
            if leaflet_js not in content:
                scripts_to_add.append(leaflet_js)
            
            if footer_loader_js not in content:
                scripts_to_add.append(footer_loader_js)
            
            if scripts_to_add:
                content = content[:insert_point_body] + "  " + "\n  ".join(scripts_to_add) + "\n" + content[insert_point_body:]
                needs_update = True
                if leaflet_js in scripts_to_add:
                    print(f"  - Added Leaflet JS")
                if footer_loader_js in scripts_to_add:
                    print(f"  - Added footer-loader.js")
        else:
            print(f"  - Warning: Could not find </body> in {filename}.")

        # Remove Google Maps iframe if present and replace with Leaflet map div
        google_maps_pattern = r'<iframe[^>]*src="https://www\.google\.com/maps/embed[^>]*></iframe>'
        if re.search(google_maps_pattern, content):
            # Replace Google Maps iframe with a div for Leaflet
            content = re.sub(google_maps_pattern, '<div id="map" style="height: 250px; width: 100%; border:1px solid black;"></div>', content)
            needs_update = True
            print(f"  - Replaced Google Maps iframe with Leaflet map div")

        # Update "Our Location" to "Our Locations" in the footer
        location_pattern = r'<h3><i class="fas fa-map-marker-alt"></i> Our Location</h3>'
        locations_replacement = '<h3><i class="fas fa-map-marker-alt"></i> Our Locations</h3>'
        if re.search(location_pattern, content):
            content = re.sub(location_pattern, locations_replacement, content)
            needs_update = True
            print(f"  - Updated 'Our Location' to 'Our Locations'")

        # Remove map badge marker if present
        badge_marker_pattern = r'<img[^>]*class="map-badge-marker"[^>]*>'
        if re.search(badge_marker_pattern, content):
            content = re.sub(badge_marker_pattern, '', content)
            needs_update = True
            print(f"  - Removed map badge marker")

        # Write the updated content back to the file
        if needs_update:
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"  - Updated {filename}")
        else:
            print(f"  - No updates needed for {filename}")
    except Exception as e:
        print(f"  - Error processing {filename}: {e}")

print("Finished processing HTML files.")