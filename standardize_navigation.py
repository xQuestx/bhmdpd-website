#!/usr/bin/env python3
"""
Navigation Standardization Script for BHMDPD Website
===================================================

This script standardizes mobile navigation across all HTML files by:
1. Extracting the correct navigation structure from index.html
2. Identifying files with outdated navigation patterns
3. Automatically replacing outdated navigation with standardized version
4. Handling relative path adjustments for subdirectories

Usage: python standardize_navigation.py
"""

import os
import sys
import shutil
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString
from typing import List, Dict, Optional

# Configuration
WEBSITE_ROOT = Path(__file__).parent
TEMPLATE_FILE = WEBSITE_ROOT / "index.html"
BACKUP_SUFFIX = ".backup"

# Files to update (identified as having outdated navigation)
PROBLEMATIC_FILES = [
    "news-detail/officer-keene-graduation-2025.html",
    "news-detail/sro-burne-2024.html", 
    "news-detail/regency-incident-2025.html",
    "news-detail/racial-equality-working-group-2024.html",
    "news-detail/marc-training-2024.html",
    "news-detail/food-drive-2025.html",
    "news-detail/comprehensive-training-2024.html",
    "news-detail/coffee-with-a-cop-2025.html",
    "recruitment-backup.html",
    "recruitment-backup2.html",
]

# Files requiring investigation (may need manual review)
INVESTIGATION_FILES = [
    "administration.html",
    "summer.html", 
    "tabbed-section.html",
    "test-recruitment-fix.html"
]

class NavigationStandardizer:
    def __init__(self, website_root: Path, template_file: Path):
        self.website_root = website_root
        self.template_file = template_file
        self.template_nav = None
        
    def extract_template_navigation(self) -> bool:
        """Extract the correct navigation structure from template file."""
        try:
            with open(self.template_file, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')
            
            # Find the main navigation wrapper
            nav_wrapper = soup.find('div', class_='nav-wrapper')
            if not nav_wrapper:
                print(f"ERROR: Could not find nav-wrapper in {self.template_file}")
                return False
                
            self.template_nav = str(nav_wrapper)
            print(f"✓ Extracted navigation template from {self.template_file}")
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to extract template navigation: {e}")
            return False
    
    def adjust_relative_path(self, original_path: str, current_file_path: Path, 
                           template_file_path: Path) -> str:
        """Adjust relative paths between different directory levels."""
        if (original_path.startswith('/') or '://' in original_path or 
            original_path.startswith('#') or not original_path):
            return original_path
        
        # Calculate absolute path that original_path points to
        template_dir = template_file_path.parent
        abs_target = (template_dir / original_path).resolve()
        
        # Calculate relative path from current file's directory to target
        current_dir = current_file_path.parent
        try:
            adjusted_path = os.path.relpath(abs_target, current_dir)
            return adjusted_path.replace('\\', '/')  # Ensure forward slashes
        except ValueError:
            # Can't create relative path (different drives on Windows)
            return original_path
    
    def update_paths_in_navigation(self, nav_soup: BeautifulSoup, 
                                 current_file_path: Path) -> None:
        """Update all relative paths in navigation for current file location."""
        for tag in nav_soup.find_all(['a', 'link', 'script', 'img']):
            if tag.has_attr('href'):
                original_href = tag['href']
                adjusted_href = self.adjust_relative_path(
                    original_href, current_file_path, self.template_file
                )
                tag['href'] = adjusted_href
                
            if tag.has_attr('src'):
                original_src = tag['src']
                adjusted_src = self.adjust_relative_path(
                    original_src, current_file_path, self.template_file
                )
                tag['src'] = adjusted_src
    
    def backup_file(self, file_path: Path) -> bool:
        """Create backup of file before modification."""
        backup_path = file_path.with_suffix(file_path.suffix + BACKUP_SUFFIX)
        try:
            shutil.copy2(file_path, backup_path)
            return True
        except Exception as e:
            print(f"WARNING: Failed to backup {file_path}: {e}")
            return False
    
    def identify_navigation_issues(self, file_path: Path) -> Dict[str, List[str]]:
        """Analyze file and identify navigation issues."""
        issues = {
            'missing_aria_attributes': [],
            'wrong_dropdown_structure': [],
            'missing_mobile_elements': [],
            'inconsistent_icons': []
        }
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')
            
            # Check for old dropdown structure (a href="#" instead of button)
            old_dropdowns = soup.find_all('a', href='#')
            for dropdown in old_dropdowns:
                if dropdown.find('i', class_='fa-caret-down'):
                    issues['wrong_dropdown_structure'].append(str(dropdown)[:100] + "...")
            
            # Check for missing aria-hidden on icons
            icons = soup.find_all('i', class_=lambda x: x and 'fa-' in x)
            for icon in icons:
                if not icon.get('aria-hidden'):
                    issues['missing_aria_attributes'].append(f"Icon missing aria-hidden: {icon}")
            
            # Check for missing mobile menu elements
            if not soup.find('button', class_='mobile-menu-btn'):
                issues['missing_mobile_elements'].append("Missing mobile-menu-btn")
            
            if not soup.find('button', class_='mobile-close-btn'):
                issues['missing_mobile_elements'].append("Missing mobile-close-btn")
                
        except Exception as e:
            print(f"WARNING: Could not analyze {file_path}: {e}")
        
        return issues
    
    def standardize_file(self, file_path: Path) -> bool:
        """Standardize navigation in a single file."""
        print(f"\\n🔧 Processing {file_path.relative_to(self.website_root)}")
        
        # Analyze current issues
        issues = self.identify_navigation_issues(file_path)
        issue_count = sum(len(v) for v in issues.values())
        
        if issue_count == 0:
            print(f"  ✓ No navigation issues found - skipping")
            return True
            
        print(f"  📊 Found {issue_count} navigation issues:")
        for category, problems in issues.items():
            if problems:
                print(f"    - {category}: {len(problems)} issues")
        
        # Backup original file
        if not self.backup_file(file_path):
            print(f"  ⚠️  Could not backup file - proceeding anyway")
        
        try:
            # Load current file
            with open(file_path, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')
            
            # Create new navigation from template
            new_nav_soup = BeautifulSoup(self.template_nav, 'html.parser')
            
            # Adjust paths for current file location
            self.update_paths_in_navigation(new_nav_soup, file_path)
            
            # Find and replace old navigation
            old_nav = soup.find('div', class_='nav-wrapper')
            if old_nav:
                # Get the new nav-wrapper element
                new_nav_element = new_nav_soup.find('div', class_='nav-wrapper')
                old_nav.replace_with(new_nav_element)
                
                # Write updated file
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(str(soup))
                
                print(f"  ✅ Successfully standardized navigation")
                return True
            else:
                print(f"  ❌ Could not find nav-wrapper to replace")
                return False
                
        except Exception as e:
            print(f"  ❌ Failed to standardize: {e}")
            return False
    
    def run_standardization(self, file_list: List[str], dry_run: bool = False) -> Dict[str, int]:
        """Run standardization on list of files."""
        results = {'success': 0, 'failed': 0, 'skipped': 0}
        
        print(f"\\n🚀 Starting navigation standardization...")
        print(f"📁 Website root: {self.website_root}")
        print(f"📋 Template file: {self.template_file}")
        print(f"🎯 Files to process: {len(file_list)}")
        
        if dry_run:
            print("\\n🔍 DRY RUN MODE - No files will be modified")
        
        for file_rel_path in file_list:
            file_path = self.website_root / file_rel_path
            
            if not file_path.exists():
                print(f"\\n⚠️  File not found: {file_path}")
                results['skipped'] += 1
                continue
            
            if dry_run:
                issues = self.identify_navigation_issues(file_path)
                issue_count = sum(len(v) for v in issues.values())
                print(f"\\n📄 {file_rel_path}: {issue_count} issues found")
                continue
            
            if self.standardize_file(file_path):
                results['success'] += 1
            else:
                results['failed'] += 1
        
        return results

def main():
    """Main execution function."""
    print("=" * 60)
    print("BHMDPD Website Navigation Standardization Script")
    print("=" * 60)
    
    # Check if BeautifulSoup is available
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        print("❌ BeautifulSoup4 is required. Install with:")
        print("   pip install beautifulsoup4 lxml")
        sys.exit(1)
    
    # Initialize standardizer
    standardizer = NavigationStandardizer(WEBSITE_ROOT, TEMPLATE_FILE)
    
    # Extract template navigation
    if not standardizer.extract_template_navigation():
        print("❌ Could not extract template navigation. Exiting.")
        sys.exit(1)
    
    # Check command line arguments
    dry_run = '--dry-run' in sys.argv or '-n' in sys.argv
    
    if dry_run:
        print("\\n🔍 Running in DRY RUN mode - analyzing files only")
    
    # Process problematic files
    print(f"\\n📋 Processing {len(PROBLEMATIC_FILES)} problematic files...")
    results = standardizer.run_standardization(PROBLEMATIC_FILES, dry_run)
    
    # Summary
    print("\\n" + "=" * 60)
    print("STANDARDIZATION COMPLETE")
    print("=" * 60)
    print(f"✅ Successfully processed: {results['success']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"⏭️  Skipped: {results['skipped']}")
    
    if not dry_run and results['success'] > 0:
        print(f"\\n💾 Backup files created with suffix '{BACKUP_SUFFIX}'")
        print(f"🧪 Test your website thoroughly before removing backups")
    
    # Show investigation files
    if INVESTIGATION_FILES:
        print(f"\\n🔍 Files requiring manual investigation:")
        for file_path in INVESTIGATION_FILES:
            if (WEBSITE_ROOT / file_path).exists():
                print(f"  - {file_path}")
    
    print(f"\\n🎉 Navigation standardization complete!")

if __name__ == "__main__":
    main()