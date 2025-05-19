# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the official website for the Bar Harbor and Mount Desert Police Department (BHMDPD). The site is a static HTML/CSS/JS website without a framework or build system, though it does have CSS organization and some JavaScript functionality.

## Technology Stack

- **Frontend**: Static HTML, CSS, and vanilla JavaScript
- **CSS Organization**: Structured in directories (`base`, `components`, `layout`, `pages`, `themes`)
- **JavaScript**: Vanilla JS with modular functions
- **Icons**: Font Awesome
- **Maps**: Leaflet.js
- **Analytics**: Google Analytics (G-3LBXVRZLEN)
- **Hosting**: Static hosting (unknown host, likely Cloudflare or similar based on references)

## Project Structure

- **HTML Files**: Root level, organized by department sections and features
- **CSS**: 
  - `css/base/`: Base styles (reset, typography, variables, utilities)
  - `css/components/`: UI components (buttons, cards, navigation, etc.)
  - `css/layout/`: Layout styles (containers, footer, grid, header)
  - `css/pages/`: Page-specific styles
  - `css/themes/`: Light and dark theme styles
  - `css/main.css`: Main CSS file that imports or contains all styles
- **JavaScript**:
  - `script.js`: Main JavaScript functionality
  - `darkmode.js`: Dark mode toggle implementation
  - `theme-init.js`: Theme initialization
  - `js/`: Additional JavaScript files including footer scripts
- **Images**: 
  - `images/`: Organized in directories by purpose (branding, divisions, hero, etc.)

## Main Features

1. **Responsive Design**: Mobile-friendly with a responsive navigation system
2. **Dark Mode**: Toggle between light and dark themes
3. **Department Sections**: Separate pages for different police divisions and services
4. **Interactive Elements**: FAQ accordions, tabs, modals, image galleries
5. **News System**: News articles section with categories
6. **Recruitment Tools**: Application guides and forms
7. **Parking Information**: Maps, permits, and parking guides

## Performance Optimization Focus

The website has been heavily optimized for performance, particularly focusing on:

1. **LCP (Largest Contentful Paint)** optimization
2. **CSS Loading Strategy**: Critical CSS inline, async loading of non-critical CSS
3. **Image Optimization**: Proper sizing, explicit dimensions, and prioritization
4. **JavaScript Deferral**: Non-critical JS execution delay
5. **Font Loading**: System fonts with optional Font Awesome

## SEO Implementation

There's a comprehensive SEO plan (`SEO_Plan.md`) that outlines strategies for:
- Technical SEO
- Keyword optimization
- Local SEO
- Content strategy
- Analytics integration

Key SEO considerations when making changes:
- Maintain proper HTML semantic structure
- Preserve meta tags and schema.org structured data
- Ensure all images have descriptive alt text
- Maintain internal linking structure
- Follow keyword integration in headings and content

## Development Workflow

### Running the Site Locally

Since this is a simple static website:

1. Clone the repository
2. Open any HTML file in a web browser to view it
3. No build process or package installation required

### Making Changes

1. Edit HTML files directly for content changes
2. Modify CSS files in their appropriate directories
3. Update JavaScript as needed
4. Test in multiple browsers and screen sizes before deployment

### Testing

Test the website across devices and browsers to ensure:
- Responsive layout works properly
- Dark mode functions correctly
- Interactive elements (accordions, tabs, dropdowns) work
- All links point to correct destinations
- Images load properly with appropriate alt text

### Performance Testing

Use Chrome DevTools or Lighthouse to:
- Monitor Core Web Vitals (LCP, FID/INP, CLS)
- Check for render-blocking resources
- Verify CSS and JavaScript optimization
- Evaluate overall page load performance

## Editing Guidelines

1. **CSS**:
   - Add new styles to appropriate directories
   - Follow existing naming conventions
   - Consider CSS impact on performance (LCP)
   - Use critical inline CSS for above-the-fold content

2. **JavaScript**:
   - Use the modular pattern established in script.js
   - Defer non-critical scripts
   - Check mobile/desktop compatibility
   - Maintain the dark mode functionality

3. **Images**:
   - Follow the guidelines in images/README.md
   - Use appropriate formats (JPG, PNG, SVG, WebP)
   - Optimize for web
   - Follow the established naming conventions
   - Always include width and height attributes for all images

4. **Content**:
   - Follow consistent structure for new pages
   - Update sitemap.xml when adding new pages
   - Include proper meta tags and SEO elements
   - Add structured data where appropriate

## Important Notes

1. The site has undergone significant performance optimization for Core Web Vitals, especially LCP.
2. There's careful attention to CSS loading strategy to prevent render blocking.
3. Image optimization and explicit sizing are critical for performance.
4. Any CSS changes should be carefully considered for their impact on rendering performance.
5. There's no database or backend - all content is static.
6. The mobile menu system has been carefully implemented - make changes with caution.
7. The site implements a dark mode toggle that persists user preferences.