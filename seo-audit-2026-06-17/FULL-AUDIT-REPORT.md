# Full SEO Audit — wavedigital.com.br

**Audit date:** 2026-06-17
**Primary URL audited:** https://wavedigital.com.br/ (live production site)
**Also tested:** https://www.wavedigital.com.br/ (broken — see below)
**Compared against:** an unreleased redesign (`index.html` + legal pages) sitting in a local repo, not yet deployed
**Business type:** Digital marketing agency (live site: Google Ads/"links patrocinados" management retainer, Curitiba/PR); the unreleased redesign repositions the brand as a broader CRM/automation/web agency serving Campos dos Goytacazes, RJ

---

## Overall SEO Health Score: 14 / 100 — Critical

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 8/100 | 1.8 |
| Content Quality | 23% | 22/100 | 5.1 |
| On-Page SEO | 20% | 10/100 | 2.0 |
| Schema / Structured Data | 10% | 0/100 | 0.0 |
| Performance (CWV) | 10% | ~32/100 (estimated) | 3.2 |
| AI Search Readiness (GEO) | 10% | 9/100 | 0.9 |
| Images | 5% | 30/100 | 1.5 |
| **Total** | 100% | — | **~14/100** |

This is not a site with isolated SEO problems. It is a **2014-era WordPress installation, left unmaintained for roughly a decade, on a hosting account whose SSL/vhost configuration is now broken**. Every subagent in this audit independently surfaced the same root cause (TLS certificate mismatch, EOL software, zero structured data, decade-old content) from a different angle. The technical case for replacing this site — not patching it — is overwhelming, and a redesign already exists in a separate, undeployed local repo.

---

## Executive Summary

### Top 5 Critical Issues
1. **TLS certificate doesn't match the domain, on both hostnames.** `wavedigital.com.br` and `www.wavedigital.com.br` both serve a cert issued for `*.websiteseguro.com` (a generic Locaweb shared-hosting wildcard). Every standards-compliant browser shows a hard "connection not private" error to every visitor. AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended) that enforce HTTPS validation cannot reach the site at all.
2. **`robots.txt`, `sitemap.xml`, and `llms.txt` are all broken** — they return a Locaweb "domain not configured" hosting error page (HTTP 404), not real content. This is a server-routing failure, not a missing file, and it blocks structured discovery/crawling.
3. **The stack is a decade past end-of-life**: WordPress 4.0.38 (2014), PHP 5.3.29 (EOL since 2014), Revolution Slider 4.6.0 (the exact plugin/version tied to the 2014-2015 mass "SoakSoak" WordPress compromise campaign). No security headers exist at all (no HSTS, CSP, X-Frame-Options).
4. **Zero structured data, zero meta description, zero Open Graph tags**, and a severely broken heading hierarchy (11 `<h1>` tags on one page — including pricing values and the phone number tagged as H1).
5. **The primary lead-gen CTA is dead.** The "Monte seu Briefing" button links to a Google Form that returns HTTP 404 — anyone ready to convert hits a dead end.

### Top 5 Quick Wins (once the TLS/hosting issue is fixed)
1. Ship the ready-to-use `ProfessionalService` + `WebSite` JSON-LD already drafted in this audit (see Schema section) — pure markup, no redesign needed.
2. Fix the heading hierarchy (one real H1, proper H2/H3 nesting) — a CSS/template-only fix, no content rewrite required.
3. Add a real `<title>` and `<meta name="description">` — currently `<title>Wave Digital</title>` and nothing else.
4. Remove the dead `gdata.youtube.com` API call and replace the broken hero video (the deleted source video makes this unfixable in place — needs a new asset).
5. Restructure the existing FAQ-shaped copy (CPC explanation, contract minimum, migration policy) into explicit question-headed blocks — the content already exists, it just needs headings.

### The Decision This Audit Surfaces
Every specialist independently arrived at the same recommendation: **do not invest incremental fixes into this WordPress instance.** The redesign project already underway (separate, undeployed repo) is the correct path, provided the issues below — especially the NAP/identity conflict — are resolved before cutover.

---

## 1. Technical SEO — Score: 8/100 (Critical)

**Full findings:** `findings/technical.md`

- **SSL/TLS (Critical):** Both `wavedigital.com.br` and `www.wavedigital.com.br` fail real certificate validation (`curl: SSL: no alternative certificate subject name matches target host name`). Cert is `CN=*.websiteseguro.com`, a Locaweb shared-hosting wildcard never bound to this domain via SNI.
- **robots.txt / sitemap.xml (Critical):** Both return an identical Locaweb hosting error page, not real content. Confirmed to be a server-level routing failure (even raw WordPress query-string permalinks 404 the same way) — not a content gap.
- **Homepage indexability: Pass.** No noindex meta tag, no X-Robots-Tag header, correct self-referencing canonical. The one clean pass in this audit.
- **Security headers (Critical):** Zero of HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy are present. `X-Powered-By: PHP/5.3.29` actively discloses an EOL runtime to scanners. `/wp-content/plugins/` returns 200 (potential directory listing exposure).
- **WordPress 4.0.38 / plugin stack (Critical):** Revolution Slider 4.6.0 (tied to the historic SoakSoak mass-compromise campaign), Visual Composer 4.3.4, Contact Form 7 4.0.1, jQuery 1.11.1 — all over a decade unpatched, running on PHP 5.3.29 (EOL 2014).
- **URL/permalink routing (High):** Only `/`, `/wp-admin/`, and `/wp-login.php` resolve. Every other path (`/sobre/`, `/contato/`, `/feed/`, `/wp-json/`) returns the same generic hosting error, not a real 404 — any historical backlinks to former subpages are now silently dead.
- **Core Web Vitals risk flags (High):** 18 render-blocking stylesheets (3 over mixed-content HTTP), 22 synchronous scripts, an unsized logo image (CLS risk), and a confirmed dead third-party call to the long-shut-down YouTube Data API v2 firing on every page load.
- **Mobile viewport (Medium):** `maximum-scale=1` disables pinch-zoom — an accessibility anti-pattern, though the responsive layout itself passes (no horizontal scroll at any of 6 tested breakpoints).

## 2. Content Quality / E-E-A-T — Score: 22/100 (Critical)

**Full findings:** `findings/content.md`

- **Trustworthiness (9/30):** TLS mismatch (see above) is the dominant trust killer. Plus: dead lead-gen Google Form (404), no physical address anywhere, no privacy policy/LGPD notice despite collecting personal data via Contact Form 7 and a Zopim chat widget, footer reads "Wave Digital 2014," and Google Analytics is Universal Analytics — a property type Google stopped processing in July 2024, meaning **no traffic data has been collected in roughly two years.**
- **Experience/Expertise (18/45 combined):** No client logos, no testimonials, no named results, no team bios, and — for an agency whose entire pitch is managing Google Ads spend — **no Google Partner badge.**
- **Authoritativeness (5/25):** Zero press mentions, zero schema, only one social channel (Facebook), no LinkedIn/Instagram presence.
- **Content depth:** ~1,157 words total, covering exactly one service (Google Ads) despite the hero claiming broader "social media, portals, search engines" capability that's never substantiated elsewhere on the page.
- **Heading abuse:** 13 `<h1>` tags on a single page, including four pricing figures and the phone number.
- A live, indexed spelling error: "acertividade" (should be "assertividade").

## 3. On-Page SEO — Score: ~10/100 (Critical)

Derived from technical/content/schema findings (no dedicated subagent ran for this category, but findings recur across all of them):
- `<title>Wave Digital</title>` — the bare WordPress default, no keyword, no location, no service descriptor.
- **No meta description at all** — not short, entirely absent.
- 11-13 `<h1>` tags, no real H1→H2→H3 hierarchy anywhere.
- Zero internal links (single page, anchor nav only) — no link equity distribution across topics.
- No dedicated URLs per service/topic — everything lives on one undifferentiated page, which (per the SXO findings) is the wrong page type for what ranks in this market.

## 4. Schema & Structured Data — Score: 0/100 (Critical)

**Full findings:** `findings/schema.md`

Zero JSON-LD, zero microdata, zero RDFa, zero Open Graph/Twitter Card tags exist anywhere on the page. No SEO plugin (Yoast, Rank Math, etc.) is installed to manage any of this.

**Ready-to-implement fix** (drafted in full in `findings/schema.md`): a `ProfessionalService` + `WebSite` + `WebPage` JSON-LD `@graph` block, built from data actually present on the page (phone, email, Facebook). Placeholders are clearly marked for the still-missing street address, CEP, and confirmed logo URL — **do not publish without filling these in.** `FAQPage` and `HowTo` were correctly *not* recommended (Google restricts FAQ rich results to gov/health sites; HowTo rich results were removed entirely in Sept 2023).

## 5. Performance (Core Web Vitals) — Score: ~25-40/100 (estimated, Critical)

**Full findings:** `findings/performance.md`

No Lighthouse/PSI/CrUX data was available in this pass — figures below are curl-measured or estimated, clearly labeled.

- **TTFB (measured, Critical):** 0.53s–2.68s across consecutive requests — a 5x swing indicating an unstable/overloaded origin (PHP 5.3.29, likely cold PHP-FPM pool, no opcode/page caching).
- **Compression (measured, Critical):** Zero `content-encoding` despite the client requesting gzip/br. 42KB HTML served uncompressed; gzip would typically cut this 70-80%.
- **Render-blocking resources (measured, High):** 27 `<script>` + 26 `<link>` tags, none deferred/async — consistent with the unoptimized Visual Composer/Revolution Slider/jQuery stack.
- **Estimated CWV status:** LCP likely Poor (~4-6s+), INP likely Needs Improvement/Poor, CLS indeterminate but at-risk (slider/video layout shift is a known pattern for this plugin stack).
- One confirmed positive: static assets carry far-future cache headers.

## 6. Images — Score: ~30/100

- 9 `<img>` tags, all carry non-empty `alt` text — but every value is a raw filename fragment (`alt="badges-05"`), not descriptive content. Near-zero value for accessibility or AI image understanding.
- The site logo has no `width`/`height` attributes — a direct CLS risk on one of the most prominent above-the-fold elements.
- All image assets are dated 2014 (`/wp-content/uploads/2014/...`) — no refreshed visual content in over a decade.

## 7. AI Search Readiness (GEO) — Score: 9/100 (Critical)

**Full findings:** `findings/geo.md`

- **AI crawler access is the dominant blocker**, upstream of every content fix: GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and Google-Extended all enforce standard HTTPS validation by default, and the TLS mismatch (affecting both hostnames) means **none of them can reliably reach this site at all.**
- `llms.txt`: confirmed absent (same broken routing as robots.txt/sitemap.xml).
- **Passage-level citability: 0% of extracted passages fall in the optimal 134-167 word citation range** — 70% are under 40 words, reading as disconnected ad-copy fragments rather than self-contained, quotable answers.
- Authority signals are almost entirely missing (no LinkedIn, no Wikipedia entity, no `sameAs` markup, no authorship/date signals).
- One genuine positive: the page is fully server-rendered with no JS-rendering dependency — once TLS/routing are fixed, the content underneath is trivially crawlable.

## 8. Search Experience (SXO) — SXO Gap Score: 21/100 (Critical)

**Full findings:** `findings/sxo.md`

The single highest-leverage structural finding in this audit: **the page itself is the wrong type for what ranks.** Live SERP checks against realistic queries ("agência de google ads curitiba," "gestão de google ads curitiba") show every visible competitor (BKM Agency, DIVIA, and others) ranking a **dedicated service page** with methodology sections, named case studies, quantified testimonials, a Google Partner badge, and FAQ schema. Wave Digital has one undifferentiated anchor-nav page with zero case studies, zero testimonials, zero schema, and a "© Wave Digital 2014" footer. Even with the TLS issue fixed, this page cannot compete on relevance or trust against rivals running deep, evidence-backed service pages.

Weakest persona: "Trust/legitimacy verifier" scores 24/100 — lands on a security warning, then finds a 2014 copyright date and zero third-party proof.

## 9. Local SEO — Score: ~4/100 (live) / ~24/100 (redesign)

**Full findings:** `findings/local.md`

**Headline finding, separate from and more urgent than any standard local-SEO gap:** the live site (Curitiba, area code 41) and the unreleased redesign (Campos dos Goytacazes, RJ — real area code 22) describe **two different cities**, and the redesign itself is internally inconsistent (it keeps the Curitiba-area-code phone number while every other signal — meta tags, schema, geo-coordinates, FAQ copy — declares Campos dos Goytacazes). Every NAP element (name casing, phone, email, social platform) differs between the live site and the redesign. **This must be resolved — and any existing Google Business Profile located and reconciled — before the redesign launches**, or the new site risks creating a direct NAP conflict against whatever GBP listing (if any) currently exists.

Neither version embeds a Google Map, links to a GBP listing, or shows any reviews/ratings. The redesign has a `LocalBusiness` schema block (missing `streetAddress`/`postalCode`, using the generic type instead of the more specific `ProfessionalService`); the live site has none at all.

## 10. Backlink Profile — Insufficient Data (Tier 0 only)

**Full findings:** `findings/backlinks.md`

No Moz/Bing/DataForSEO credentials are configured. The only available free source, Common Crawl, has **no record of this domain at all** in either the current release or one from late 2024 — correctly reported as "no usable signal," not as "zero authority" (these are not equivalent). No numeric backlink score is reported since fewer than 4 of 7 scoring factors have any data. Recommendation: configure free Moz/Bing credentials, and check the Wayback Machine for any pre-2020 backlink history tied to the original 2014-era business.

---

## Files in this audit

- `findings/technical.md` — full technical SEO findings
- `findings/content.md` — full E-E-A-T / content quality findings
- `findings/schema.md` — full structured-data findings + ready-to-use JSON-LD
- `findings/performance.md` — full performance findings
- `findings/visual.md` — full visual/mobile rendering findings
- `findings/geo.md` — full AI search readiness findings
- `findings/sxo.md` — full search-experience findings
- `findings/local.md` — full local SEO findings
- `findings/backlinks.md` — full backlink profile findings
- `screenshots/` — desktop/laptop/tablet/mobile screenshots at 6 breakpoints (above-fold + full-page)
- `ACTION-PLAN.md` — consolidated, prioritized action plan
