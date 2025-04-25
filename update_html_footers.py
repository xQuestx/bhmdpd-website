import os
import re
import glob

# Define the required elements
leaflet_css = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />'
leaflet_js = '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>'
footer_loader_js = '<script src="js/footer-loader.js" defer></script>'
# Define the Google Analytics snippet
ga_snippet = '''<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3LBXVRZLEN"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-3LBXVRZLEN');
</script>'''
ga_id = "G-3LBXVRZLEN"

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

        # Check for head tag before attempting inserts
        head_match = re.search(r"</head>", content, re.IGNORECASE)
        if head_match:
            head_insert_point = head_match.start()
            head_content = content[:head_insert_point]

            # Add Leaflet CSS to head if not already present
            if leaflet_css not in head_content:
                content = content[:head_insert_point] + f"  {leaflet_css}\n" + content[head_insert_point:]
                # Adjust insert point for next potential insert
                head_insert_point += len(f"  {leaflet_css}\n")
                needs_update = True
                print(f"  - Added Leaflet CSS to <head>")

            # Add GA Snippet to head if not already present
            if ga_id not in head_content:
                # Ensure we re-calculate insert point based on potentially modified content
                current_head_match = re.search(r"</head>", content, re.IGNORECASE)
                if current_head_match:
                    current_head_insert_point = current_head_match.start()
                    content = content[:current_head_insert_point] + f"  {ga_snippet}\n" + content[current_head_insert_point:]
                    needs_update = True
                    print(f"  - Added Google Analytics snippet to <head>")
                else:
                     print(f"  - Warning: Could not find </head> after potential modification in {filename}.")
        else:
            print(f"  - Warning: Could not find </head> in {filename}. Cannot add head elements.")


        # Add scripts before closing body tag if not already present
        match_body = re.search(r"</body>", content, re.IGNORECASE)
        if match_body:
            insert_point_body = match_body.start()
            body_content = content[:insert_point_body]
            scripts_to_add = []

            if leaflet_js not in body_content:
                scripts_to_add.append(leaflet_js)

            if footer_loader_js not in body_content:
                scripts_to_add.append(footer_loader_js)

            if scripts_to_add:
                # Ensure we re-calculate insert point based on potentially modified content
                current_body_match = re.search(r"</body>", content, re.IGNORECASE)
                if current_body_match:
                    current_body_insert_point = current_body_match.start()
                    content = content[:current_body_insert_point] + "  " + "\n  ".join(scripts_to_add) + "\n" + content[current_body_insert_point:]
                    needs_update = True
                    if leaflet_js in scripts_to_add:
                        print(f"  - Added Leaflet JS")
                    if footer_loader_js in scripts_to_add:
                        print(f"  - Added footer-loader.js")
                else:
                    print(f"  - Warning: Could not find </body> after potential modification in {filename}.")
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
            # Only write if content actually changed to avoid unnecessary modifications
            if content != original_content:
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"  - Updated {filename}")
            else:
                 print(f"  - No actual content change detected for {filename}, skipping write.")
        else:
            print(f"  - No updates needed for {filename}")
    except Exception as e:
        print(f"  - Error processing {filename}: {e}")

print("Finished processing HTML files.")