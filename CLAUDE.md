# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for the Bar Harbor & Mount Desert Police Department (BHMDPD) serving two Maine communities. The site provides public safety information, recruitment resources, community programs, and departmental services.

## Architecture

### Static Site Structure
- **No build system**: Pure HTML/CSS/JavaScript static site
- **No dependencies**: No package.json, npm, or build tools required
- **Direct deployment**: Ready for static hosting (currently at bhmdpd.com)
- **Version control**: Git-based development workflow

### CSS Architecture (Modular ITCSS-inspired)
The CSS follows a hierarchical import structure in `css/main.css`:

```
css/
├── main.css (imports all modules)
├── base/ (foundational styles - variables, reset, typography)
├── layout/ (structural - grid, header, footer, containers)
├── components/ (reusable UI - buttons, cards, navigation, forms)
├── pages/ (page-specific styles)
└── themes/ (light/dark mode support)
```

Key architectural decisions:
- **CSS Custom Properties** for theming and consistent values
- **Modular imports** for maintainability
- **Dark/light theme system** with smooth transitions
- **Mobile-first responsive design**
- **Print styles** included for accessibility

### JavaScript Architecture
- **Vanilla JavaScript**: No frameworks or bundlers
- **Modular files**: Separate concerns across multiple files
- **Key files**:
  - `script.js` - Main site functionality
  - `darkmode.js` - Theme switching logic
  - `theme-init.js` - Early theme initialization (prevents flash)
  - `js/footer-loader.js` - Dynamic footer content loading

### Performance Optimizations
- **Critical CSS inlined** in HTML `<head>` for above-the-fold content
- **Asynchronous CSS loading** for non-critical stylesheets
- **Deferred JavaScript** loading for non-essential functionality
- **WebP images** with fallbacks
- **Font optimization** using system fonts
- **Lazy loading** implemented where appropriate

## Common Development Tasks

### Adding New Pages
1. Create HTML file in root directory following existing template structure
2. Add corresponding CSS file in `css/pages/` if needed
3. Import page CSS in `css/main.css`
4. Update navigation in header across all relevant pages
5. Add to `sitemap.xml` for SEO

### Modifying Styles
1. Identify the appropriate CSS module (base/layout/components/pages)
2. Update CSS custom properties in `css/base/variables.css` for global changes
3. Test both light and dark themes
4. Ensure responsive behavior across breakpoints

### Content Updates
- **News articles**: Create individual HTML files in `news-detail/` directory
- **Images**: Organize in categorized directories (`staff/`, `services/`, `divisions/`)
- **Forms and documents**: Update links in relevant pages

### Theme System
The site supports dark/light mode with:
- **CSS custom properties** for color management
- **localStorage persistence** of user preference
- **Smooth transitions** between themes
- **System preference detection** on first visit

### Navigation System
- **Dropdown menus** with hover and click support
- **Mobile hamburger menu** with slide-in animation
- **Active page highlighting** for current location
- **Accessibility attributes** (ARIA labels, keyboard navigation)

## Testing and Validation

Since this is a static site with no automated testing:
1. **Manual testing** across browsers (Chrome, Firefox, Safari, Edge)
2. **Responsive testing** on mobile, tablet, desktop viewports
3. **Accessibility testing** with screen readers and keyboard navigation
4. **Performance testing** with browser dev tools or Lighthouse
5. **Dark/light theme testing** for complete coverage

## Deployment

- **Static hosting**: No server-side processing required
- **CDN compatible**: All assets are static files
- **Domain**: Currently deployed at bhmdpd.com
- **Git workflow**: Use feature branches, test locally before merging

## Key Features

### Multi-Municipality Support
- Serves both Bar Harbor and Mount Desert communities
- Shared resources with community-specific information

### Department Structure
- **Patrol Division**: Primary law enforcement
- **Harbor Master Division**: Marine safety and enforcement
- **Parking Division**: Municipal parking management
- **Administrative Services**: Permits, forms, and citizen services

### Community Integration
- **Recruitment section** with salary information and benefits
- **Community programs**: Coffee with a Cop, Citizens Academy
- **Emergency information** and contact details
- **News and announcements** system
- **Online forms** and permit applications

## Accessibility and SEO

- **Semantic HTML5** structure throughout
- **ARIA labels** and screen reader support
- **Skip navigation** links for keyboard users
- **Alt text** for all images
- **Structured data** for search engines
- **OpenGraph meta tags** for social media sharing
- **Responsive images** with appropriate sizing

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Graceful degradation** for older browsers
- **Progressive enhancement** approach

When working on this site, always test both theme modes and ensure responsive behavior across device sizes. The modular CSS architecture makes it easy to isolate changes to specific components or pages.