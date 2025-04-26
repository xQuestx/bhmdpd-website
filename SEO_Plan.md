# SEO Action Plan for bhmdpd.com

This plan outlines the key steps to improve the Search Engine Optimization (SEO) of the Bar Harbor Mount Desert Police Department website (bhmdpd.com), incorporating insights from technical analysis, keyword research, and content strategy discussions.

## Phase 1: Technical SEO Foundation

-   [x] **Robots.txt Review:** Verify `robots.txt` exists and correctly allows crawling of all important pages and resources (CSS, JS) while disallowing sensitive areas (if any). (Verified: Allows all, points to sitemap)
-   [ ] **XML Sitemap:** Generate (or verify existing) an accurate XML sitemap listing all indexable pages. Submit it via Google Search Console. (Action: Verify completeness - add missing pages like opportunities.html, hire.html? Ensure submitted to GSC.)
-   [ ] **Google Search Console Setup:** Ensure the website is verified in Google Search Console (GSC). Review for any existing manual actions or crawl errors. (Action: Verify property in GSC, check for errors, submit sitemap.xml)
-   [ ] **Google Analytics Setup:** Ensure Google Analytics (GA4 recommended) is properly installed and tracking website traffic. (Action: GA4 tracking code G-3LBXVRZLEN added via script. Verify data reporting in GA account.)
-   [ ] **HTTPS:** Confirm the entire site uses HTTPS for security. (Seems to be the case). (Action: HTTPS available, but HTTP does not redirect. Configure server-side 301 redirects from HTTP to HTTPS.)
-   [ ] **Mobile-Friendliness Check:** Although the site uses responsive design, perform tests using Google's Mobile-Friendly Test tool and real devices to ensure seamless usability.
-   [ ] **Core Web Vitals (CWV) Audit:** (Mobile Score: 77 - Needs Improvement)
    -   [x] Measure LCP, FID (or INP), and CLS using Google PageSpeed Insights and GSC's Core Web Vitals report. (Lighthouse Mobile: LCP=6.0s [Poor], TBT=0ms [Good], CLS=0 [Good])
    -   [x] Identify specific elements/scripts causing poor scores. (LCP Element: `h1.hero-title`. Cause: High Render Delay [~5.5s], preceded by Render-Blocking Resources [~1.2s total: `leaflet.css`, Cloudflare Rocket Loader].)
    -   [ ] Implement optimizations to meet "Good" thresholds (LCP ≤ 2.5s).
        - [x] **Action 1 (High Priority):** Eliminate render-blocking `leaflet.css`. Modify HTML/script to load it asynchronously (e.g., via `rel="preload" as="style" onload="..."`). (Done via update script)
        - [x] **Action 2 (High Priority):** Eliminate render-blocking Cloudflare Rocket Loader. Disable Rocket Loader in Cloudflare dashboard. (User confirmed done)
        - [ ] **Action 3 (After 1 & 2):** Re-test LCP. If `h1.hero-title` render delay is still high, investigate CSS complexity/font rendering further.
        - [ ] **Action 4 (Medium Priority):** Optimize image sizes identified in Lighthouse (e.g., `bbq.webp`, `goodmorningkev.webp`).
        - [ ] **Action 5 (Medium Priority):** Reduce unused CSS, particularly from Font Awesome (`all.min.css`).
-   [ ] **Structured Data (Schema) Review:**
    -   [ ] Validate existing `PoliceStation` schema using the Schema Markup Validator.
    -   [ ] Identify opportunities for additional schema on relevant pages (e.g., `Article` for news, `JobPosting` for careers, `FAQPage` for FAQs, `Event` for events).
-   [ ] **URL Structure Review:** Evaluate the current `.html` structure. Consider planning a migration to a more hierarchical structure (e.g., `/services/parking`, `/community/programs`) for better organization, if feasible long-term.
-   [ ] **Broken Link Check:** Run a crawl (using GSC or other tools) to find and fix any broken internal or external links.

## Phase 2: Keyword Integration & On-Page Optimization

-   [x] **Keyword Mapping:** Systematically map the keywords identified in the research (Location-Based, Service, Informational, Career, Long-Tail) to the most relevant existing pages on `bhmdpd.com`.
-   [x] **Homepage Optimization:** Integrate primary location keywords ("Bar Harbor Police Department", "Mount Desert Police Department", etc.) into the homepage (`index.html`) content, title tag, and H1 tag naturally.
-   [x] **Service/Division Page Optimization:** Optimize each service/division page (`patrol-division.html`, `harbor-master-division.html`, `bar-harbor-parking.html`, `admin.html`, `animalcontrol.html`, `mentalhealth.html`) using relevant *service* and *location* keywords in:
    -   [x] Title Tags (under 60 chars)
    -   [x] Meta Descriptions (around 150-160 chars, compelling CTR focus)
    -   [x] Header Tags (H1 for main topic, H2s/H3s for sub-sections)
    -   [ ] Body Content (natural integration, clarity, E-E-A-T focus)
-   [x] **Recruitment Page Optimization:** Optimize recruitment-related pages (`bhmdrec.html`, `application-process.html`, `benefits.html`, `academy-training.html`) using *career* keywords ("police jobs", "recruitment", "salary", "benefits", etc.).
    -   [x] Title Tags (under 60 chars)
    -   [x] Meta Descriptions (around 150-160 chars, compelling CTR focus)
    -   [x] Header Tags (H1 for main topic, H2s/H3s for sub-sections)
-   [ ] **Image Optimization:** Ensure all images have descriptive `alt` text incorporating relevant keywords where appropriate. Use descriptive file names.
-   [x] **Internal Linking:** Add contextual internal links between related pages (e.g., link from a news article about MARC training to a general training page, link from service pages to the contact page or relevant forms). (Action: Added links to index.html, news.html, and all division pages. Review program pages and news articles.)

## Phase 3: Content Strategy & Creation

-   [x] **FAQ Expansion:** Use the *informational* keywords ("How to...", "department hours", "contact info") and *long-tail* keywords to significantly expand the `faq.html` page, providing direct answers. Consider `FAQPage` schema.
    -   [x] Title Tags (under 60 chars)
    -   [x] Meta Descriptions (around 150-160 chars, compelling CTR focus)
    -   [x] Header Tags (H1 for main topic)
-   [ ] **Service Guides/Details:** Enhance service pages with more detailed information, explaining processes, requirements, and contact details clearly.
-   [x] **Program Pages:** Detail community programs (`good-morning-program.html`, `community-outreach.html`) using relevant keywords and providing clear information on participation.
    -   [x] Title Tags (under 60 chars)
    -   [x] Meta Descriptions (around 150-160 chars, compelling CTR focus)
    -   [x] Header Tags (H1 for main topic)
-   [x] **News & Updates:** Maintain a regular cadence of posting news updates (like the MARC training or SRO articles) to keep content fresh and engage the community. Target relevant long-tail keywords here.
    -   [x] Title Tags (under 60 chars)
    -   [x] Meta Descriptions (around 150-160 chars, compelling CTR focus)
    -   [x] Header Tags (H1 for main topic)
-   [ ] **E-E-A-T Focus:** Ensure all content clearly demonstrates Expertise, Experience, Authoritativeness, and Trustworthiness. Highlight officer experience, official procedures, and community focus.
-   [ ] **Content Audit:** Periodically review existing content for accuracy, relevance, and optimization opportunities.

## Phase 4: Local SEO Enhancement

-   [ ] **Google Business Profile (GBP):** Claim and fully optimize the Google Business Profile(s) for the department locations. Ensure accurate Name, Address, Phone (NAP), hours, services, and photos. Post updates via GBP.
-   [ ] **NAP Consistency:** Verify that the department's Name, Address, and Phone number are consistent across all online directories and citations (e.g., Yelp, government listings, community sites).
-   [ ] **Local Citations:** Identify and build citations on relevant local and government directories.
-   [ ] **Location-Specific Content:** Ensure website content clearly mentions service areas (Bar Harbor, Mount Desert) where appropriate.

## Phase 5: Link Building (Ongoing)

-   [ ] **Identify Opportunities:** Look for opportunities to earn links from relevant local government sites, community organizations, news outlets covering the department, and partner agencies.
-   [ ] **Content Promotion:** Promote high-quality content (guides, important news, program details) that naturally attracts links.
-   [ ] **Unlinked Mentions:** Monitor the web for mentions of "Bar Harbor Mount Desert Police Department" or "BHMDPD" and request links where appropriate.

## Phase 6: Monitoring & Reporting (Ongoing)

-   [ ] **Track Keyword Rankings:** Use GSC or other tools to monitor rankings for target keywords.
-   [ ] **Monitor Organic Traffic:** Use GA4 and GSC to track organic traffic volume, traffic to key pages, and user engagement metrics.
-   [ ] **Analyze CWV Reports:** Regularly check GSC for Core Web Vitals performance and address any regressions.
-   [ ] **Review GSC Errors:** Monitor GSC for new crawl errors, indexing issues, or security problems.
-   [ ] **Regular Reporting:** Establish a schedule (e.g., monthly) to review key metrics and report on progress.
-   [ ] **Adapt Strategy:** Use data and insights from monitoring to continually refine the SEO strategy.

This plan provides a comprehensive roadmap. Prioritize based on potential impact and available resources, starting with the Technical SEO foundation and On-Page Optimization.
