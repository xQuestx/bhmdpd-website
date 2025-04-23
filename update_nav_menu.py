import os
import re
import glob

# Define the new patrol division link to add
patrol_division_link = '''<li>
<a href="patrol-division.html">
<i class="fas fa-shield-alt"></i> Patrol Division
                                </a>
</li>'''

# Define the patrol division link for the footer
footer_patrol_link = '<li><a href="patrol-division.html"><i class="fas fa-shield-alt"></i> Patrol Division</a></li>'

# Find all HTML files
html_files = glob.glob("*.html")
print(f"Found {len(html_files)} HTML files to process.")

for filename in html_files:
    print(f"Processing {filename}...")
    needs_update = False
    try:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        original_content = content

        # Check if the file already has the patrol division link
        if "patrol-division.html" not in content:
            # Add to dropdown menu - look for Harbor Master link as insertion point
            harbor_master_pattern = r'<li>\s*<a href="harbor-master-division.html">'
            match = re.search(harbor_master_pattern, content, re.MULTILINE)
            
            if match:
                # Insert the patrol division link before the harbor master link
                insert_point = match.start()
                content = content[:insert_point] + patrol_division_link + "\n" + content[insert_point:]
                needs_update = True
                print(f"  - Added Patrol Division link to dropdown menu")
            
            # Add to footer - look for footer divisions section
            footer_pattern = r'<section class="footer-column" aria-labelledby="footer-divisions">.*?<ul>(.*?)</ul>'
            match = re.search(footer_pattern, content, re.DOTALL)
            
            if match:
                # Insert the patrol division link at the beginning of the list
                list_content = match.group(1)
                updated_list = footer_patrol_link + "\n" + list_content
                content = content.replace(list_content, updated_list)
                needs_update = True
                print(f"  - Added Patrol Division link to footer menu")

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