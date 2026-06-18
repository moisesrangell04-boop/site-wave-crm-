# Action Plan — wavedigital.com.br

Consolidated from all 9 audit findings. Ordered by priority; within each tier, roughly by leverage (fixes that unblock other fixes come first).

**Read this first:** Items 1-3 are infrastructure/identity problems that sit upstream of nearly everything else in this plan. Schema, content, and on-page fixes are close to useless to ship until the site is reachable and the business identity is reconciled.

---

## CRITICAL — Fix immediately (blocks indexing, trust, or active campaigns)

1. **Fix the TLS certificate binding for `wavedigital.com.br` AND `www.wavedigital.com.br`.** Both currently serve a generic Locaweb shared-hosting cert (`*.websiteseguro.com`) that doesn't match either hostname — a hard validation failure for every browser and every standards-compliant AI crawler (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended). This is almost certainly a hosting-support ticket (re-bind/re-issue a Let's Encrypt or proper cert via SNI), not a code change. *Nothing else in this plan matters until this ships.*
   — Source: technical.md, content.md, schema.md, geo.md, sxo.md, local.md, backlinks.md (independently confirmed by every subagent)

2. **Resolve the business-identity conflict before any redesign launch.** The live site (Curitiba, area code 41) and the unreleased redesign (Campos dos Goytacazes, RJ — real area code 22) describe two different cities, and the redesign itself is internally inconsistent (Curitiba phone number, RJ everything else). Determine ground truth: relocation, rebrand, or unrelated domain reuse — then locate any existing Google Business Profile and reconcile it. Every NAP element (name, phone, email, social platform) currently differs between live site and redesign; launching as-is risks a full NAP conflict against any existing GBP/citations.
   — Source: local.md

3. **Fix root-level static file routing** so `/robots.txt`, `/sitemap.xml`, and `/llms.txt` resolve through WordPress (or the new site) instead of hitting Locaweb's "domain not configured" error page. Confirmed to be a server/vhost-layer issue, not a missing file — dynamic routes and asset subpaths work fine. Likely the same ticket as #1.
   — Source: technical.md, geo.md

4. **Treat the current WordPress install as compromised-until-checked, not just outdated.** WordPress 4.0.38 + PHP 5.3.29 (both ~12 years past EOL) + Revolution Slider 4.6.0 — the exact plugin/version tied to the 2014-2015 SoakSoak mass-compromise campaign. Audit for existing compromise; do not attempt an in-place core upgrade (the version gap is too large to be safe). This reinforces replacing the site rather than patching it.
   — Source: technical.md

5. **Fix the dead lead-generation CTA.** "Monte seu Briefing" links to a Google Form returning HTTP 404 — the highest-intent conversion path on the page is currently a dead end.
   — Source: content.md

6. **Add zero security headers → add HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.** Currently none exist. Also stop exposing `X-Powered-By: PHP/5.3.29` and fully disable `xmlrpc.php` (currently only partially gated).
   — Source: technical.md

7. **Fix the heading hierarchy.** 11-13 `<h1>` tags on one page, including four pricing values and the phone number tagged as H1. Re-tag to one real H1 per page with proper H2/H3 nesting — pure markup change, current visual design/CSS classes can stay.
   — Source: technical.md, content.md, geo.md, sxo.md, visual.md (all five independently flagged this)

8. **Ship structured data.** Zero JSON-LD exists anywhere. Use the ready-to-implement `ProfessionalService` + `WebSite` + `WebPage` JSON-LD drafted in `findings/schema.md` — but only after filling in the placeholders (real street address, confirmed phone format, final logo URL) and after the identity conflict (#2) is resolved, since the schema's NAP fields depend on that decision.
   — Source: schema.md, content.md, local.md, sxo.md, geo.md

9. **Stop the YouTube Data API v2 call and replace the broken hero video.** The `gdata.youtube.com` call fails (API shut down 2015) *and* the underlying source video has been independently deleted from YouTube — this is unfixable in place and needs a new video/image asset. The same broken-gray-block pattern repeats 2-3 more times down the page; audit all Visual Composer parallax/video rows, not just the hero.
   — Source: visual.md, technical.md

10. **Restore real CWV-relevant fixes: stabilize TTFB and enable compression.** TTFB measured 0.53s-2.68s (unstable, likely cold PHP-FPM/no caching layer) and zero gzip/brotli compression on the HTML document despite the client requesting it — both are server-config fixes with no code risk and the highest-leverage performance wins available.
    — Source: performance.md

---

## HIGH — Fix before/at launch

11. **Replace the single anchor-nav page with dedicated, indexable service pages.** SERP analysis shows every real competitor for this market ("agência de google ads curitiba") ranks a standalone service page with methodology, case studies, and testimonials — not a one-page anchor-nav site. Split into `/google-ads-curitiba` (or equivalent), `/sobre`, `/cases`, `/contato`. This is the single highest-leverage SXO fix and also the #1 local-ranking and #2 AI-visibility factor per the local audit.
    — Source: sxo.md, local.md

12. **Add real `<title>` and `<meta name="description">` tags.** Currently `<title>Wave Digital</title>` with no meta description at all — keyword-bearing, page-specific titles needed once dedicated pages exist (#11).
    — Source: content.md, sxo.md, local.md

13. **Add case studies, named testimonials, and a Google Partner badge.** Zero client names, logos, or quantified results exist anywhere — for an agency whose entire pitch is managing Google Ads spend, the missing Google Partner badge is a glaring credibility gap. This is the dimension scoring weakest across both the content (E-E-A-T) and SXO persona analyses.
    — Source: content.md, sxo.md

14. **Restructure existing FAQ-shaped copy into explicit, question-headed answer blocks (134-167 words each).** The raw material already exists (CPC explanation, contract-minimum rationale, account-migration policy) — it just needs question-form headings and modest expansion to hit the optimal AI-citation length. No new research required.
    — Source: geo.md, content.md

15. **Add a complete `LocalBusiness`/`ProfessionalService` schema** with `streetAddress`/`postalCode` (or a deliberate, documented SAB-only `areaServed` pattern), a proper `GeoCoordinates` object, and NAP fields matching whatever is decided in #2. Also fix the `www` vs. non-`www` mismatch between the redesign's schema `url` and the site's canonical tag.
    — Source: local.md, schema.md

16. **Replace the placeholder Gmail contact address** (`wavecrm.business@gmail.com` in the redesign's schema) with a domain-matching business email.
    — Source: local.md

17. **Locate/embed the Google Business Profile.** Neither the live site nor the redesign embeds a map, links to a GBP listing, or shows reviews. Add an embedded map and a standard `tel:` click-to-call link alongside the redesign's WhatsApp deep links.
    — Source: local.md

18. **Audit and reduce the 53 render-blocking script/link tags**, and reduce/replace the Visual Composer + Revolution Slider stack (historically one of the heaviest LCP/CLS offenders in the WordPress ecosystem).
    — Source: performance.md

19. **Fix mixed-content asset URLs.** Three Google Fonts requests and one Visual Composer stylesheet are hardcoded to `http://` on an HTTPS page and are silently blocked by modern browsers — fonts are falling back to system defaults site-wide.
    — Source: visual.md

20. **Increase body font size from 14px to 16px+ and adapt tap targets for touch** (carousel arrows at 38×38px, mobile hamburger at 40×40px — both under the 44-48px guideline, and unchanged between desktop and mobile).
    — Source: visual.md

21. **Add `sameAs` / social profile linking and reconcile the social platform change.** The redesign drops the live site's Facebook (`wavedigitalmedia`) for Instagram (`wave.crm`) with no cross-link or redirect strategy — don't silently orphan the existing channel. Add LinkedIn if one exists; it's a stronger B2B authority signal than Facebook/Instagram alone.
    — Source: local.md, geo.md

---

## MEDIUM — Fix within a month

22. Remove `maximum-scale=1` from the viewport meta tag (disables pinch-zoom, an accessibility anti-pattern) — keep `width=device-width, initial-scale=1` only.
    — Source: technical.md, visual.md

23. Add descriptive `alt` text to all images — currently raw filenames (`alt="badges-05"`), near-zero value for accessibility or AI image understanding.
    — Source: geo.md

24. Add `width`/`height` attributes to the site logo image (currently the one unsized image on the page — a CLS risk on a prominent above-the-fold element).
    — Source: technical.md

25. Update the Universal Analytics tag (sunset by Google in July 2024 — currently collecting zero data) to GA4.
    — Source: content.md, sxo.md

26. Fix the "acertividade" → "assertividade" spelling error in live pricing copy.
    — Source: content.md

27. Add `Review`/`AggregateRating` schema once real testimonials exist; establish a recurring review-request cadence post-launch to avoid ranking drop-off from review inactivity.
    — Source: local.md

28. Add `Service`/`Offer` schema for the four pricing tiers (fast-follow after the core Organization/WebSite block ships).
    — Source: schema.md

29. Update the footer copyright year (currently frozen at "2014").
    — Source: content.md

---

## LOW — Backlog / polish

30. Implement IndexNow once a working sitemap exists (not worth doing before the routing fix in #3).
    — Source: technical.md

31. Configure free Moz/Bing Webmaster Tools credentials to get real referring-domain/anchor-text/toxic-link data — current backlink analysis has no usable signal beyond "absent from Common Crawl," which is not the same as "zero backlinks."
    — Source: backlinks.md

32. Check the Wayback Machine and any legacy SEO tool exports for pre-2020 backlink history tied to the original 2014-era business, since Common Crawl's own graph only extends to late 2024.
    — Source: backlinks.md

33. Add `VideoObject` schema to the one working YouTube embed (low priority, optional).
    — Source: schema.md

---

## Sequencing note

Roughly: **(1, 3) hosting/TLS fixes → (2) identity/NAP decision → (4-10) remaining Criticals → (11-21) High-priority redesign/content work → (22-29) Medium polish → (30-33) Low/backlog.** Items 7 and 8 (heading hierarchy, schema) can ship in parallel with the TLS fix since they're pure markup changes, but the schema's NAP fields are blocked on the identity decision (#2).
