# Mobile Optimization Plan (Based on WebPageTest Results)

This plan outlines steps to improve the mobile performance, usability, and resilience of the website based on diagnostic checks from WebPageTest.

## High Priority Issues

### 1. Render-Blocking JavaScript

*   **Issue:** `/theme-init.js` and `/script.js` block page rendering.
*   **Action:** Add the `defer` attribute to the `<script>` tags for these files in the HTML. This allows the browser to download the scripts in parallel with page rendering and execute them in order after the HTML is parsed.
    ```html
    <!-- Example -->
    <script src="/theme-init.js" defer></script>
    <script src="/script.js" defer></script>
    ```
*   **Note:** Test thoroughly after applying `defer` to ensure no functionality breaks. If `theme-init.js` is small and critical for initial styling, consider inlining it instead, but try `defer` first.

### 2. Layout Shifts (CLS) due to Images Missing Dimensions

*   **Issue:** CLS score is 0.089, caused by `images/branding/logo.png` lacking width and height attributes.
*   **Action:** Find the actual dimensions (width and height in pixels) of `logo.png`. Add `width="..."` and `height="..."` attributes to all `<img>` tags referencing this logo in the HTML.
    ```html
    <!-- Example (replace ... with actual dimensions) -->
    <img src="images/branding/logo.png" alt="Site Logo" width="..." height="...">
    ```

### 3. Lazy-Load Offscreen Images

*   **Issue:** Images outside the initial viewport are loaded immediately, potentially delaying more critical resources.
*   **Action:** Add the `loading="lazy"` attribute to the `<img>` tags for the following images identified by the report:
    *   `images/staff/bbq.webp`
    *   `images/services/emergency/police_lights.webp`
    *   `images/staff/goodmorningkev.webp`
    *   `images/marc training/marc_training_001_resized.webp`
    *   `images/staff/sroburne.webp`
    *   `images/misc/234.webp`
    ```html
    <!-- Example -->
    <img src="images/staff/bbq.webp" alt="..." loading="lazy">
    ```

### 4. Fonts Hiding Text During Load (`font-display: swap`)

*   **Issue:** Font Awesome fonts use default display settings (`block`), causing text to be invisible while the font loads.
*   **Action:** Locate the `@font-face` rules for "Font Awesome 6 Brands" and "Font Awesome 6 Free" (likely in a CSS file, potentially `main.css` or a dedicated font CSS file). Add `font-display: swap;` to these rules. This tells the browser to show text immediately using a fallback font and then swap to Font Awesome once it loads.
    ```css
    /* Example */
    @font-face {
      font-family: 'Font Awesome 6 Free';
      font-style: normal;
      font-weight: 900;
      font-display: swap; /* Add this line */
      src: url(...) format(...);
    }

    @font-face {
      font-family: 'Font Awesome 6 Brands';
      font-style: normal;
      font-weight: 400;
      font-display: swap; /* Add this line */
      src: url(...) format(...);
    }
    ```

## Medium Priority Issues

### 5. High Largest Contentful Paint (LCP) & Main Thread Blocking

*   **Issue:** LCP is high (>2.5s), and the main thread is blocked for a significant duration (915ms), partly by `script.js`.
*   **Action:**
    *   Implementing step 1 (deferring JS) should help significantly.
    *   Re-run performance tests after applying the high-priority fixes.
    *   If LCP and main thread blocking remain high, analyze `script.js` for:
        *   Long-running tasks.
        *   Inefficient code.
        *   Opportunities to break down the script or delay execution of non-critical parts.

### 6. HTML DOM Size Increase / Client-Side Rendering

*   **Issue:** The final DOM is larger than the initially delivered HTML, indicating JavaScript is generating content/HTML. This can delay usability, accessibility, and make the site fragile.
*   **Action:**
    *   Identify which parts of the page are rendered by JavaScript.
    *   Evaluate if this content is critical for the initial view.
    *   If feasible, consider moving the rendering logic to the server-side (e.g., using a static site generator, server-side includes, or backend templating) to deliver more complete HTML initially. This might require more significant refactoring.

## Lower Priority / Infrastructure

### 7. No CDN Used for Assets

*   **Issue:** 52 static assets (CSS, JS, images) are served directly from the origin server, increasing latency for users geographically distant from the server.
*   **Action:**
    *   Evaluate CDN providers (e.g., Cloudflare free tier, Netlify, Vercel, AWS CloudFront, etc.).
    *   Configure the chosen CDN to serve the website's static assets. This typically involves DNS changes and potentially adjustments to the build/deployment process.

## Next Steps

1.  Implement the "High Priority" fixes (1-4).
2.  Test the site thoroughly for visual regressions and functional issues.
3.  Re-run WebPageTest or use browser developer tools (Lighthouse) to measure the impact of the changes.
4.  Address "Medium Priority" issues (5-6) if necessary based on re-testing.
5.  Consider implementing a CDN (7) for further improvements. 