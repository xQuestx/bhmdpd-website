# CSS Optimization and Standardization Plan

## Project Overview
Transform the BHMDPD website from inline CSS to a fully standardized, modular CSS architecture while maintaining Google Lighthouse performance and current functionality.

---

## Phase 0: Prerequisites & Performance Baseline
**Objective**: Establish safety nets and success metrics before any refactoring

### Git Setup
- [ ] Initialize Git repository (if not present): `git init`
- [ ] Commit current state to main branch
- [ ] Create feature branch: `git checkout -b feature/css-refactor`
- [ ] Document Git workflow for atomic commits

### Performance Baseline (The Contract for Success)
- [ ] **Homepage**: Run Lighthouse audit 3 times, record average scores
- [ ] **Key Service Page** (Harbor Master/Parking): Lighthouse baseline
- [ ] **Form-Heavy Page** (Recruitment/Contact): Lighthouse baseline  
- [ ] **Content/List Page** (News/Announcements): Lighthouse baseline
- [ ] Document baseline metrics: FCP, LCP, TBT, CLS for each page
- [ ] Save baseline report for Phase 6 comparison

### Deliverables
- [ ] Git repository with feature branch ready
- [ ] Baseline performance metrics spreadsheet
- [ ] Rollback strategy documentation

---

## Phase 1: Comprehensive CSS Audit & Prioritization
**Objective**: Inventory inline CSS and create prioritized implementation list

### Mechanical Audit (Bottom-Up)
- [ ] Use "Find in Files" to search for recurring `style=""` attributes
- [ ] Identify most frequent exact-match inline styles
- [ ] Document utility-style patterns (margins, text-align, font-weight, etc.)
- [ ] Create frequency report of duplicate inline styles

### Semantic Audit (Top-Down)  
- [ ] Browse live website to identify visual component patterns
- [ ] Document button variations (primary, secondary, text-only)
- [ ] Catalog card/container patterns across pages
- [ ] Identify form styling patterns
- [ ] Note alert/banner/message components
- [ ] List navigation and layout patterns

### Pattern Synthesis & Prioritization
- [ ] Create Pattern Inventory document
- [ ] For each semantic pattern, list inline style variations found
- [ ] Assess pattern reusability vs. page risk for each HTML file
- [ ] Create prioritized page list: **Low-Risk + High-Pattern-Reusability first**
- [ ] Plan CSS class naming conventions for identified patterns

### Deliverables
- [ ] Complete inline CSS mechanical audit
- [ ] Semantic pattern inventory with variations documented
- [ ] Prioritized page implementation list
- [ ] CSS naming convention standards

---

## Phase 2: Current CSS Architecture Analysis
**Objective**: Map existing modular CSS structure and performance optimizations

### Tasks
- [ ] Examine current base/, layout/, components/, pages/ directory structure
- [ ] Analyze main.css import hierarchy and dependencies
- [ ] Document current critical CSS loading strategy
- [ ] Review existing CSS custom properties and variables
- [ ] Map current theme system implementation
- [ ] Identify optimal placement patterns for extracted CSS

### Deliverables
- [ ] CSS architecture documentation
- [ ] Import dependency diagram
- [ ] Critical CSS loading flow analysis
- [ ] Current CSS organization assessment

---

## Phase 3: CSS Categorization Strategy
**Objective**: Create systematic approach for organizing extracted inline CSS

### Tasks
- [ ] Define CSS categorization rules:
  - [ ] Critical Above-Fold → Inline critical CSS or base/
  - [ ] Page-Specific Layouts → pages/[page-name].css
  - [ ] Reusable Components → components/[component].css
  - [ ] Base Style Overrides → base/[appropriate-file].css
  - [ ] Theme Variations → themes/[theme-name].css
- [ ] Create extraction priority matrix
- [ ] Plan CSS class naming conventions
- [ ] Define reusable component patterns

### Deliverables
- [ ] CSS categorization guidelines document
- [ ] Extraction priority matrix
- [ ] CSS naming convention standards
- [ ] Component pattern library plan

---

## Phase 4: Iterative Implementation & Testing Loop
**Objective**: Execute systematic refactoring using prioritized list from Phase 1

### Implementation Loop Strategy
Work through prioritized page list using this iterative process:

#### For Each Page/Page Group:
- [ ] **Extract Inline CSS**: Move `style=""` attributes to appropriate modular CSS files
- [ ] **Create Reusable Classes**: Use semantic naming from Pattern Inventory
- [ ] **Update HTML**: Replace inline styles with CSS classes
- [ ] **Page-Level Testing**: Visual regression test on current page
- [ ] **Atomic Git Commit**: Commit with descriptive message (e.g., "Extract contact form styles to components/forms.css")

#### After Each Component Completion:
- [ ] **Batch Integration Testing**: Test all pages using new component
- [ ] **Cross-Page Validation**: Check 1-2 unrelated high-traffic pages for side effects
- [ ] **Performance Spot Check**: Quick Lighthouse audit on representative page

### Implementation Sequence (Based on Phase 1 Prioritization)
- [ ] **Round 1**: Low-risk pages with highest pattern reusability
  - [ ] Page: _____________ (fill from Phase 1 results)
  - [ ] Page: _____________
  - [ ] Page: _____________
- [ ] **Round 2**: Medium-risk pages with good component opportunities  
  - [ ] Page: _____________
  - [ ] Page: _____________
  - [ ] Page: _____________
- [ ] **Round 3**: Higher-risk pages (service pages, recruitment)
  - [ ] Page: _____________
  - [ ] Page: _____________
- [ ] **Round 4**: Homepage (final validation)
  - [ ] Homepage refactoring with established component library

### Critical CSS Strategy
- [ ] **Conservative Approach**: Do NOT modify `<style>` blocks in `<head>` sections
- [ ] **Body Styles Only**: Focus exclusively on extracting `style=""` attributes from `<body>` elements
- [ ] **Document Critical CSS**: Note any inline styles that might need critical CSS consideration for post-project evaluation

### Deliverables
- [ ] Updated modular CSS files with new components
- [ ] HTML files with `style=""` attributes removed
- [ ] Comprehensive Git commit history for precise rollback capability
- [ ] Component library documentation
- [ ] Testing reports for each implementation round

---

## Phase 5: Final Performance Validation
**Objective**: Confirm performance maintained/improved after refactoring

### Performance Validation
- [ ] **Lighthouse Re-Baseline**: Run same audit protocol from Phase 0
- [ ] **Homepage**: 3 audits, compare to Phase 0 baseline
- [ ] **Key Service Page**: Compare to baseline metrics  
- [ ] **Form-Heavy Page**: Validate performance maintained
- [ ] **Content/List Page**: Check for any regressions
- [ ] **Success Validation**: Confirm FCP, LCP, TBT, CLS meet or exceed baseline

### CSS Loading Optimization
- [ ] Verify main.css import structure still optimized
- [ ] Confirm asynchronous CSS loading working properly
- [ ] Test CSS delivery timing across devices
- [ ] Validate theme switching performance

### Deliverables
- [ ] Performance comparison report (Phase 0 vs Phase 5)
- [ ] CSS loading validation documentation
- [ ] Regression analysis (if any issues found)

---

## Phase 6: Critical CSS Re-evaluation (Post-Refactor)
**Objective**: Safe optimization of critical CSS now that body styles are clean

### Post-Refactor Critical CSS Analysis
- [ ] **Black Box Approach Complete**: Body inline styles eliminated
- [ ] Generate new critical CSS using tool (e.g., Critical Path CSS Generator)
- [ ] Compare generated critical CSS to current `<head>` styles
- [ ] Analyze potential performance improvements
- [ ] **Conservative Testing**: If changes beneficial, test on non-critical pages first

### Optional Critical CSS Updates
- [ ] **Risk Assessment**: Evaluate benefit vs. risk of critical CSS changes
- [ ] **A/B Testing**: Test new critical CSS on lower-traffic pages
- [ ] **Performance Validation**: Lighthouse audit with new critical CSS
- [ ] **Rollback Plan**: Ensure quick revert capability for critical CSS changes

### Deliverables
- [ ] Critical CSS analysis report
- [ ] Recommended critical CSS optimizations (if any)
- [ ] Updated critical CSS loading documentation

---

## Phase 7: Documentation and Maintenance Guidelines
**Objective**: Ensure long-term maintainability of new CSS system

### Documentation Tasks
- [ ] **CSS Architecture Guide**:
  - [ ] How the modular system works
  - [ ] Directory structure explanation
  - [ ] Import hierarchy documentation
- [ ] **Style Guidelines**:
  - [ ] CSS naming conventions
  - [ ] Component creation patterns
  - [ ] Theme system usage
- [ ] **Development Workflow**:
  - [ ] How to add new styles properly
  - [ ] Testing procedures for CSS changes
  - [ ] Performance guidelines
- [ ] **Troubleshooting Guide**:
  - [ ] Common issues and solutions
  - [ ] CSS loading problems
  - [ ] Performance debugging steps

### Best Practices Documentation
- [ ] No future inline CSS policy
- [ ] CSS class naming conventions
- [ ] Critical CSS maintenance procedures
- [ ] Performance monitoring protocols
- [ ] Git workflow for CSS changes

### Deliverables
- [ ] Complete CSS architecture documentation
- [ ] Development guidelines document
- [ ] Troubleshooting and maintenance guide
- [ ] Best practices checklist

---

## Success Metrics Validation

### Technical Goals
- [ ] Zero inline CSS in HTML files
- [ ] All CSS properly organized in modular files
- [ ] Google Lighthouse performance maintained or improved
- [ ] Consistent CSS patterns across all pages
- [ ] Working theme system with extracted CSS

### Maintainability Goals
- [ ] Clear CSS organization system implemented
- [ ] Documented development guidelines created
- [ ] Easier CSS modification workflow established
- [ ] Reduced duplicate CSS code achieved

---

## Final Checklist

### Project Completion
- [ ] All phases completed successfully
- [ ] Documentation updated and accessible
- [ ] Team training on new CSS system completed
- [ ] Performance benchmarks met or exceeded
- [ ] No outstanding issues or regressions

### Handoff Requirements
- [ ] Updated CLAUDE.md with new CSS guidelines
- [ ] Development team briefed on new workflows
- [ ] Monitoring procedures established
- [ ] Rollback procedures documented

---

## Notes Section
Use this space to track specific findings, issues, or decisions made during implementation:

```
Phase 1 Notes:
- 

Phase 2 Notes:
- 

Phase 3 Notes:
- 

Phase 4 Notes:
- 

Phase 5 Notes:
- 

Phase 6 Notes:
- 

Phase 7 Notes:
- 
```

---

**Project Start Date**: ___________  
**Project Completion Date**: ___________  
**Project Lead**: ___________