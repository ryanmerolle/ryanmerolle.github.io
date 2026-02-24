# Frontend & Codebase Review: Ryan Merolle's Website

Below is a comprehensive, brutal, and constructive review of your personal site's frontend experience and codebase architecture, broken down by the 5 pillars. As an expert acting on your request, I didn’t hold back. Read through the analysis, and apply the top 6 highest-impact changes listed right after to dramatically elevate your website.

---

## The Top 6 Highest-Impact Changes 🚀

If you do nothing else, tackle these 6 prioritized actions first.

1. **Wrap Content in Semantic `<main>` (Accessibility & SEO)**
   _Why:_ Screen readers, keyboard navigators, and search engine crawlers rely on semantic markup to understand the primary content structure.
   _Action:_ Edit [_layouts/default.html](file:///Users/rmerolle/repos/ryanmerolle.github.io/_layouts/default.html) and change `<div class="content-wrapper">` to `<main class="content-wrapper">`.
   ```html
   <!-- Before -->
   <div class="content-wrapper">
     <div class="content-wrapper__inner">
       {{ content }}
   ...
   <!-- After -->
   <main class="content-wrapper">
     <div class="content-wrapper__inner">
       {{ content }}
   ...
   ```

2. **Fix Mobile Menu Button Accessibility (Accessibility & UX)**
   _Why:_ Currently, the mobile menu overlay uses a `<span>` as a trigger. This isn’t keyboard-focusable by default properly and breaks screen-reader interaction.
   _Action:_ Edit [_includes/header.html](file:///Users/rmerolle/repos/ryanmerolle.github.io/_includes/header.html). Change the menu trigger to a `<button>` with an `aria-label`.
   ```html
   <!-- Before -->
   <span id="mobile-menu-button" data-turbo-permanent="true" class="mobile btn-mobile-menu">
     <i class="fa-solid fa-bars btn-mobile-menu__icon"></i>...
   </span>

   <!-- After -->
   <button id="mobile-menu-button" data-turbo-permanent="true" class="mobile btn-mobile-menu" aria-label="Toggle navigation" aria-expanded="false">
     <i class="fa-solid fa-bars btn-mobile-menu__icon" aria-hidden="true"></i>...
   </button>
   ```

3. **Defer Render-Blocking JS (Performance)**
   _Why:_ Hotwire Turbo blocks the parser because it is included in `<head>` without a `defer` or `async` attribute.
   _Action:_ Edit [_includes/head.html](file:///Users/rmerolle/repos/ryanmerolle.github.io/_includes/head.html) and add `defer`.
   ```html
   <!-- Before -->
   <script src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@..."></script>
   <!-- After -->
   <script defer src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@..."></script>
   ```

4. **Implement Lazy Loading on Images Below the Fold (Performance)**
   _Why:_ The browser shouldn’t penalize first load on content the user hasn't scrolled to yet. (Note: Only do this for images *below* the fold or not immediately critical. The profile image in [header.html](file:///Users/rmerolle/repos/ryanmerolle.github.io/_includes/header.html) should be eager).
   _Action:_ Ensure standard `<img>` tags on pages and posts have `loading="lazy"`, e.g., `<img src="..." alt="..." loading="lazy" />`.

5. **Transition CSS to Modern SCSS Partials and Variables (Architecture)**
   _Why:_ Your [uno.scss](file:///Users/rmerolle/repos/ryanmerolle.github.io/_sass/uno.scss) is ~750 lines containing a mix of resets from early 2010s (`/* http://meyerweb.com/eric/tools/css/reset/ */`), layout, and modules. Desktop-first media queries (`max-width`) cause bloated cascades. 
   _Action:_ 
   - Extract colors to CSS native variables: `:root { --primary-red: #e25440; --text-color: #666666; }`
   - Split [uno.scss](file:///Users/rmerolle/repos/ryanmerolle.github.io/_sass/uno.scss) into partials: `_reset.scss`, `_typography.scss`, `_layout.scss`, `_components.scss`.
   - Update [main.scss](file:///Users/rmerolle/repos/ryanmerolle.github.io/css/main.scss) to use them. Start migrating to Mobile-first queries (`@media (min-width: ...)`).

6. **Clean Up Content Document Structure (Agent/LLM & Maintainability)**
   _Why:_ Pages like [_pages/links_projects.md](file:///Users/rmerolle/repos/ryanmerolle.github.io/_pages/links_projects.md) have raw HTML structured tags (`<h2>`, `<ul>`) mixed with complex Liquid `{% raw %}{% for %}{% endraw %}` loops. Mixing HTML heavily in markdown hurts the readability for both you and scraping agents.
   _Action:_ Use pure markdown or simple Jekyll includes. Instead of inline loops in markdown, extract the loop logic to an `_includes/project_list.html` and inject it cleanly.

---

## Comprehensive Pillar Review

### 1. Simplicity & UX
- **Mobile-First Design:** You are using "Desktop-First" scaling (`@media all and (max-width: 960px)`). While it works, mobile-first design (scaling up from smallest viewports) ensures fewer overrides and smaller base CSS for mobile users who operate on constrained networks and processors.
- **Frictionless Navigation:** The layout of the `jekyll-uno` theme serves well as a digital business card. The navigation links inside the central cover work perfectly on desktop. However, the mobile trigger (`mobile-menu-button`) spans almost the whole top edge, which can cause mis-clicks if scrolling rapidly on mobile. A dedicated, tap-targeted button (min `44x44` pixels) placed in the corner provides better UX friction. 
- **Visual Hierarchy:** Excellent. Large, well-sized `width="200" height="200"` profile shot immediately conveys who you are, followed sharply by what you do. 

### 2. Code Quality & Standard Adherence
- **Semantic HTML:** The wrapper using `<div class="content-wrapper">` misses an opportunity to outline the document semantic shape properly via `<main>`. 
- **CSS Architecture:** [uno.scss](file:///Users/rmerolle/repos/ryanmerolle.github.io/_sass/uno.scss) has some severe aging. It's using deprecated resets (Meyer 2011) and absolute sizes alongside fixed pixels rather than scalable `rem`. There is overriding happening constantly in [main.scss](file:///Users/rmerolle/repos/ryanmerolle.github.io/css/main.scss) purely because [uno.scss](file:///Users/rmerolle/repos/ryanmerolle.github.io/_sass/uno.scss) is too rigid.
- **Accessibility:** 
  - [header.html](file:///Users/rmerolle/repos/ryanmerolle.github.io/_includes/header.html) uses `<span>` as a menu toggle, losing default keyboard focus mappings.
  - The social link loops insert `<i>` Font Awesome icons but the link wrapper `<a title="...">` holds the descriptor text. It's better to explicitly add `aria-label` to the `<a>` tag or add a `.sr-only` span so screen readers reliably describe the link target without relying solely on title tooltip behavior.

### 3. Modern Approach & Architecture
- **Agent/LLM Readability:** Using markdown heavily helps agents quickly parse the document structure context. But as observed in [links_projects.md](file:///Users/rmerolle/repos/ryanmerolle.github.io/_pages/links_projects.md), writing raw `<h3>`, `<ul>`, and `<li>` mixed with logic harms the markdown tree semantics. Extract data loops to Liquid partials (`_includes`) so your markdown source remains pure writing.
- **Responsive Typography:** Fonts are mapped via `em`, which cascades exponentially in unexpected ways if a parent font size shifts. Modern stacks prefer `rem` (Root EM) for typography boundaries and `clamp()` for fluid font sizing scaling automatically with the viewport (`font-size: clamp(1rem, 2.5vw, 1.5rem);`).
- **Variables Usage:** No CSS custom variables (`--vars`) detected in use. You use color hardcoding (`#e25440`, `#333333`) extensively. This makes dark mode implementation nearly impossible without complete rewrites.

### 4. Performance & Core Web Vitals
- **Asset Optimization:** Amazing! You are leveraging `.webp` images heavily (`profile.webp`, `background-cover.webp`). Excellent utilization of standard dimensions `width="200" height="200"`, mitigating Cumulative Layout Shift (CLS). You even have `preconnect` meta hints toward Google Fonts and jsdelivr.
- **Render-Blocking:** 
  - Loading `@hotwired/turbo` synchronously in `<head>` blocks First Contentful Paint.
  - FontAwesome CSS is loaded synchronously.

### 5. SEO & Open Web Standards
- **Meta & Open Graph:** Fully supported via `{% raw %}{% seo %}{% endraw %}` jekyll plugin. Fantastic choice.
- **RSS Auto-Discovery:** Excellent. `<link rel="alternate" type="application/rss+xml">` is correctly defined.
- **Robots / Sitemap:** Implemented thoroughly. You have even [humans.txt](file:///Users/rmerolle/repos/ryanmerolle.github.io/humans.txt).
- **Favicons:** Handled robustly with `favicon.ico`, `.png` manifest, and `xml/svg` versions. Perfect.
