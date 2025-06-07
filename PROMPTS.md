## Phase 1: Multi-Language Support (Days 1–4)

### Day 3
- Update the existing templates to fetch and render text content using translations.
- Add a locale-aware layout wrapper to handle RTL and LTR rendering logic in all templates.
- Plan and document the structure and components of two new templates: “Minimalist” and “Portfolio Grid”.

### Day 4
- Update Supabase schema to store localized fields for each product (e.g., `title_en`, `title_ar`).
- Migrate current English-only product content to the new bilingual structure.
- Update frontend queries and template logic to display the correct language version based on locale.

---

## Phase 2: Template System Improvements (Days 5–9)

### Day 5
- Refactor how template settings are stored by moving configuration to a normalized JSON schema.
- Add versioning support to the template data model (e.g., `templateVersion: number`).
- Optimize Supabase queries used for rendering templates to improve speed and clarity.

### Day 6
- Design and build a new “Minimalist” template with clean typography and large section padding.
- Add it as an option in the dashboard template picker and ensure it integrates with the translation system.
- Define and add necessary keys for Minimalist to `en.json` and `ar.json`.

### Day 7
- Design and implement a “Portfolio Grid” template with card-style layout and support for multiple sections.
- Add this template to the template selection menu in the dashboard.
- Define and add all relevant translation keys for this new template.

### Day 8
- Build a full-screen template editor page with real-time preview and customization controls.
- Implement drag-and-drop for reordering sections inside a template.
- Enable live preview updates as the user edits content or structure.

### Day 9
- Test all four templates end-to-end, including language switching, layout correctness, and content rendering.
- Fix RTL or responsive issues that appear in Arabic layout or mobile view.
- Perform UI polishing passes for visual consistency across templates.

---

## Phase 3: Performance & UX Optimization (Days 10–13)

### Day 10
- Run a mobile layout audit for the homepage, dashboard, and public product pages.
- Fix layout breakpoints, button sizes, and touch zones for mobile usability.
- Improve mobile menu navigation and scroll behavior for long content.

### Day 11
- Enable code splitting by converting heavy components to dynamic imports.
- Optimize image usage by using `next/image` with appropriate `sizes` and lazy loading.
- Set up basic caching headers for static assets and explore browser cache options.

### Day 12
- Use a tool like `webpack-bundle-analyzer` to reduce JavaScript bundle size.
- Enable route prefetching for key navigation links using `next/link`.
- Run Lighthouse or similar tool to identify remaining performance issues.

### Day 13
- Optimize Supabase queries by indexing fields used in template rendering.
- If available, set up edge caching (Vercel, Cloudflare, etc.) for public product pages.
- Add skeleton loaders or spinners for key loading states across dashboard and product pages.

---

## Phase 4: SEO & Analytics (Days 14–16)

### Day 14
- Add meta titles and descriptions for each major route using `next/head` or a central SEO component.
- Add structured data (JSON-LD) to public product pages to support Google Rich Results.
- Implement sitemap generation and make sure it's reachable at `/sitemap.xml`.

### Day 15
- Set up Google Analytics or Plausible tracking across all pages.
- Track conversion events such as signups, language changes, or product publication.
- Verify event firing in real-time analytics dashboards.

### Day 16
- Configure `robots.txt` to allow search engines to crawl public product pages.
- Run a full SEO audit using a tool like Ahrefs or Screaming Frog and fix issues.
- QA all analytics and SEO integrations for broken links, missing data, or script errors.

---

## Phase 5: Testing & Quality Assurance (Days 17–19)

### Day 17
- Write unit tests for helper functions like translation utilities and Supabase data processing.
- Add integration tests for flows like product creation, language switching, and template selection.
- Verify translation fallback behavior when certain keys are missing.

### Day 18
- Write end-to-end tests with tools like Playwright or Cypress for sign up → create → publish flow.
- Run performance tests on product pages and dashboard to establish a baseline.
- Add accessibility test passes to catch issues like low contrast or broken keyboard nav.

### Day 19
- Wrap main app and page components with error boundaries that show friendly fallback UIs.
- Integrate basic logging to capture errors and user context (e.g., console logging or Supabase logs).
- Add “retry” or fallback states to any loading UI or failed network request scenarios.

---

## Phase 6: Documentation & Deployment (Days 20–21)

### Day 20
- Write markdown documentation for end users on how to sign up, switch languages, create products, and use templates.
- Create a developer README explaining project structure, setup, and key tech decisions.
- Add inline code comments to complex utilities or config files.

### Day 21
- Write deployment instructions with env variables, Supabase settings, and payment setup (LemonSqueezy).
- Do a dry-run of deployment on a clean machine to ensure steps are complete.
- Push the final build to production and test live URLs for both Arabic and English products.
