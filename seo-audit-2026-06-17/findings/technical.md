# Technical SEO Audit — wavedigital.com.br

**Audit date:** 2026-06-17
**Domain audited:** wavedigital.com.br (apex) and www.wavedigital.com.br (subdomain)
**Method:** Direct HTTP/TLS inspection (curl, openssl s_client, dig) against the live production host. Headless rendering data cross-referenced from `raw_data.json` in this same findings folder.

## Executive summary

This is not a site with isolated SEO issues — it is a 2014-era WordPress installation that has been left running unmaintained on a Locaweb shared-hosting account whose virtual-host/SSL configuration is now broken for at least one of its two canonical hostnames. The combination of an EOL WordPress core (4.0.38), EOL PHP (5.3.29), a wildcard certificate that does not cover either `wavedigital.com.br` or `www.wavedigital.com.br`, fully non-functional `robots.txt`/`sitemap.xml`/permalink routing, and zero structured data or meta-description coverage means the domain is operating with significant security exposure and materially impaired discoverability. **Recommendation that should carry through to the rest of this audit: do not invest in incremental SEO fixes on this WordPress instance — replace it.** The redesign project already in progress (separate repo) is the correct path; this report should be read as the security/SEO case for prioritizing that migration and decommissioning this host.

**Overall Technical Score: 8/100**

---

## 1. SSL/TLS Status — CRITICAL

**Finding (verified, and worse than initially briefed):** The certificate mismatch is not limited to the `www` subdomain — it affects the apex domain too. Both hostnames fail browser-grade certificate validation.

```
Certificate subject: CN=*.websiteseguro.com
Certificate SAN:      DNS:*.websiteseguro.com, DNS:websiteseguro.com
Issuer:               GlobalSign GCC R6 AlphaSSL CA 2025
Validity:             2026-03-29 to 2026-10-14
```

Direct verification:
- `curl https://wavedigital.com.br/` (no `-k` flag, i.e. standard certificate validation as any browser would perform it) **fails outright**: `curl: (60) SSL: no alternative certificate subject name matches target host name 'wavedigital.com.br'`. This is a hard TLS validation failure, not a warning — every standards-compliant browser and bot will refuse or hard-block this connection by default.
- `curl https://www.wavedigital.com.br/` also fails the same validation and additionally returns an HTTP 301 redirect (when cert checks are bypassed) pointing back to the apex domain — so even if a user click-through-warnings on `www`, they're redirected into the same broken certificate on the apex.
- DNS: both `wavedigital.com.br` and `www.wavedigital.com.br` resolve to the same A record (`186.202.153.129`), confirming this is a server-side vhost/TLS-SNI misconfiguration on the Locaweb host, not a DNS-level split.
- The certificate is a generic Locaweb shared-hosting wildcard (`*.websiteseguro.com`) that was apparently never properly bound to this customer's domain via SNI, or the binding was lost/never completed after a plan change.

**SEO/business impact:**
- Any real browser (Chrome, Firefox, Safari, Edge) will show a full-page "Your connection is not private" / `NET::ERR_CERT_COMMON_NAME_INVALID` interstitial for **every visitor** on both hostnames. There is no "soft" degraded experience here — this blocks organic traffic conversion entirely for users who don't manually click through an advanced-bypass warning.
- Googlebot and other crawlers generally still index pages behind invalid certs (Google's indexing crawler tolerates cert errors more than Chrome's user-facing renderer does), but Google's site-quality and Core Web Vitals/UX signals, plus Chrome's Safe Browsing / Search Console "HTTPS issues" reporting, will flag this. If Search Console has been verified for this property, expect manual or automated security warnings.
- This actively damages brand trust and may trigger anti-phishing heuristics in some security software, since the page presents itself as `wavedigital.com.br` while serving a certificate for an unrelated domain.
- HTTP→HTTPS is also not safely enforceable: plain `http://wavedigital.com.br/` returns 200 directly (no forced upgrade), so there's no HSTS-driven protection layered on top of the broken cert situation either (see Section 4).

**Severity: CRITICAL**

---

## 2. robots.txt and sitemap.xml — CRITICAL

Both verified directly (TLS validation bypassed only to inspect content, since neither hostname passes real validation):

```
GET https://wavedigital.com.br/robots.txt   -> HTTP/2 404
GET https://wavedigital.com.br/sitemap.xml  -> HTTP/2 404
GET https://wavedigital.com.br/sitemap_index.xml -> HTTP/2 404
GET https://wavedigital.com.br/page-sitemap.xml  -> HTTP/2 404
```

All four return an **identical 1090-byte Locaweb hosting-platform error page** (`<title>Hospedagem Locaweb</title>`, "404 Service Unavailable" / "Página não disponível"), not a WordPress-generated 404 and not real robots.txt/sitemap content. This is a hosting-platform-level routing failure, distinct from "file doesn't exist" — the request isn't even reaching WordPress's virtual robots.txt handler or rewrite engine.

Confirming this is a broader routing failure and not specific to these two files: `https://wavedigital.com.br/?p=1` (raw WordPress query-string permalink, which bypasses `.htaccess` rewrite rules entirely) **also returns 404** from the same Locaweb error page. This means the breakage is at the web-server/vhost layer, upstream of WordPress's own routing — WordPress itself is likely never being invoked for these paths.

**Indexing impact:**
- **No sitemap = no structured discovery path for Google/Bing/Yandex.** Google can still discover and index the homepage via links and prior crawl history, but any pages beyond the homepage (if they exist) have no machine-readable manifest. Combined with the single-page/anchor-link structure (Section 6), this isn't currently a large loss, but it forecloses any future expansion of the site without a fix.
- **A 404/error response on `robots.txt` is itself a signal.** Per Google's documented behavior, if `robots.txt` is unreachable due to a server error, Googlebot will treat repeated robots.txt fetch failures cautiously: short-term unavailability is tolerated (Google falls back to the last-known-good robots.txt or assumes full access), but **sustained inaccessibility (this appears to be a long-standing, not transient, configuration state) can suppress crawling entirely** until the file becomes available again. There is no way to know how long Google has been hitting this 404 without Search Console access, but the architecture (Locaweb error page, not WP 404) suggests this has been broken since whatever change broke the vhost — possibly since initial setup.
- No way to submit/maintain an XML sitemap also blocks any IndexNow integration (Section 9) and Search Console sitemap submission.

**Severity: CRITICAL**

---

## 3. Homepage Indexability — PASS (with caveats)

Verified directly against homepage HTML source and response headers:

- **No `<meta name="robots">` tag present in `<head>`** — confirmed via direct grep of source; tag is absent entirely (not even a permissive `index,follow` — it's just not there, which defaults to indexable).
- **No `X-Robots-Tag` HTTP response header** — confirmed via full header dump on `https://wavedigital.com.br/`. No robots-related header of any kind is sent.
- **Canonical tag is present and correct**: `<link rel='canonical' href='https://wavedigital.com.br/' />` — self-referencing, no errant cross-domain or paginated canonical issues found.
- Page returns clean HTTP 200 with `text/html; charset=UTF-8`.

**Conclusion:** the homepage itself is technically indexable — there is no on-page or header-level block. This is the one area of the audit that passes cleanly. However, "indexable" does not mean "healthy" — see Sections 1 and 2 for why actual indexing/ranking performance is still severely compromised in practice.

**Severity: N/A (Pass)** — flagging only as a positive control point against the other findings.

---

## 4. Security Headers — CRITICAL

Full response header dump from the homepage (both HTTP and HTTPS, both hostnames — identical pattern):

```
HTTP/2 200
server: nginx/1.22.1
date: ...
content-type: text/html; charset=UTF-8
x-powered-by: PHP/5.3.29
x-pingback: https://wavedigital.com.br/xmlrpc.php
link: <https://wavedigital.com.br/>; rel=shortlink
x-cache: MISS
lw-x-id: ...
```

**Headers confirmed absent:**
- `Strict-Transport-Security` (HSTS) — absent. Combined with the cert mismatch (Section 1) and the fact that plain `http://` is served without a forced redirect to HTTPS, there is no protection against protocol downgrade or SSL-stripping attacks.
- `Content-Security-Policy` — absent. No mitigation against XSS/injection given the dated plugin stack (Section 5).
- `X-Frame-Options` / `frame-ancestors` — absent. Site is clickjacking-vulnerable.
- `X-Content-Type-Options: nosniff` — absent.
- `Referrer-Policy` — absent.
- `Permissions-Policy` — absent.

**Headers present that are themselves red flags:**
- `X-Powered-By: PHP/5.3.29` — actively discloses an EOL PHP runtime version to any client/scanner (PHP 5.3 reached end-of-life in **August 2014**; this is roughly 12 years past EOL with zero security patches since). This is reconnaissance information that materially aids an attacker and should never be exposed in production regardless of the PHP version's age.
- `X-Pingback: https://wavedigital.com.br/xmlrpc.php` — confirms `xmlrpc.php` is live and advertised. XML-RPC pingback functionality is a well-known vector for DDoS amplification (pingback abuse) and brute-force login attempts against WordPress, and is recommended to be disabled if not actively used.

**Additional exposure found during this audit:**
- `/wp-login.php` returns HTTP 200 with no apparent rate-limiting, CAPTCHA, or IP restriction visible at the HTTP layer — standard brute-force target.
- `/wp-content/plugins/` returns HTTP 200 (directory is accessible rather than returning 403/404), which on many misconfigured Apache/nginx WordPress setups exposes a raw directory listing of installed plugins and their versions to unauthenticated visitors — useful reconnaissance for an attacker fingerprinting exploitable plugin versions. (Index file blocking should be verified/added regardless.)
- `xmlrpc.php` itself returns HTTP 403 to a direct unauthenticated POST in this test, suggesting *some* WAF/hosting-level rule is blocking direct abuse — but the endpoint is still advertised via the pingback header and RSD link (`<link rel="EditURI" ... href=".../xmlrpc.php?rsd" />`), so it has not been cleanly disabled, only partially gated.

**Severity: CRITICAL**

---

## 5. WordPress 4.0.38 / Plugin Stack Vulnerability Exposure — CRITICAL

Confirmed via `<meta name="generator">` tags and asset version query strings in page source:

```html
<meta name="generator" content="WordPress 4.0.38" />
<meta name="generator" content="Powered by Visual Composer - drag and drop page builder for WordPress."/>
```

WordPress 4.0 was released in **September 2014**. Version 4.0.38 is a minor-branch security backport, but the 4.0.x line itself stopped receiving any security maintenance years ago (WordPress core security support is generally limited to a small number of recent major versions). Running a core version this old means the site has been unpatched against **well over a decade of cumulative WordPress core vulnerability disclosures** — privilege escalation, SQL injection, stored XSS, and authentication-bypass classes of bugs that have been found and fixed across the many major versions released since 4.0. This is a "risk class" statement, not a specific-CVE claim, per the audit scope.

**Plugin/theme stack identified in page source, all pinned to versions contemporaneous with the 2014 install:**

| Component | Version found in source | Risk note |
|---|---|---|
| Revolution Slider (`revslider`) | rev=4.6.0 / ver=4.0.38 | This exact plugin and version range was the vector for one of the most widely exploited WordPress vulnerabilities in history (mass file-upload/RCE exploitation circa 2014–2015, associated with the SoakSoak malware campaign that compromised hundreds of thousands of sites). Any RevSlider build from this era should be treated as a confirmed critical risk, not a theoretical one. |
| Visual Composer (`js_composer`) | ver=4.3.4 | Multiple historical XSS/permission vulnerabilities across early 4.x releases of this builder. |
| Contact Form 7 | ver=4.0.1 (CSS) / 3.51.0-2014.06.20 (JS) | Old enough that current spam/validation hardening present in modern CF7 releases is absent; less severe than RevSlider but still stale. |
| Theme: "North" | ver=4.0.38 (bundled, theme version tracks core) | Custom/marketplace theme, no independent patching visible; bundled jQuery plugins (isotope, superslides, owl.carousel, parallax, YTPlayer, etc.) are all 2014-era forks with no subsequent maintenance. |
| jQuery | 1.11.1 (+ jquery-migrate 1.2.1) | jQuery 1.11 is over a decade old; not itself a direct "vulnerability" but indicates nothing in the front-end stack has been touched since launch. |

**Compounding factor:** PHP 5.3.29 (Section 4) is the actual script-execution runtime underneath all of this. A code-execution vulnerability in any of the above plugins, combined with a PHP runtime with no security patches since 2014, removes any of the mitigations modern PHP versions (memory safety improvements, hardened serialization, etc.) would otherwise provide.

**Recommendation:** This is not a "patch and continue" situation — the version gap is too large for incremental updates to be a responsible path (jumping WordPress core from 4.0 to current, on PHP 5.3, with these specific plugins, risks breaking the site as badly as leaving it, and still leaves a likely-compromised box history unaddressed). Treat this installation as a candidate for full replacement (consistent with the redesign project already underway in the separate repo) rather than an in-place upgrade. If the site must stay live in the interim, at minimum: take it behind a WAF, disable `xmlrpc.php` entirely, remove or disable Revolution Slider immediately, and audit for existing compromise (the SoakSoak-era RevSlider exploit was mass-automated and indiscriminate — any public-facing install of this vintage should be assumed possibly already compromised until checked).

**Severity: CRITICAL**

---

## 6. URL / Permalink Structure — HIGH

Verified path-by-path:

| Path | Result |
|---|---|
| `/` | 200 (real WordPress page) |
| `/sobre/` | 404 (Locaweb error page) |
| `/contato/` | 404 (Locaweb error page) |
| `/feed/` | 404 (Locaweb error page) |
| `/?p=1` (raw query-string permalink) | 404 (Locaweb error page) |
| `/wp-admin/` | 302 → `/wp-login.php?redirect_to=...` (WordPress is alive here) |
| `/wp-login.php` | 200 (WordPress is alive here) |
| `/wp-json/` | 404 |
| `/robots.txt`, `/sitemap.xml` | 404 (see Section 2) |

The pattern is consistent: **only the literal document root and the `/wp-admin/`/`/wp-login.php` admin paths are reachable.** Every other path tested — pretty permalinks, raw query-string permalinks, virtual files WordPress normally generates dynamically (`robots.txt`, feeds), and the REST API root — returns the same generic Locaweb platform 404, not a WordPress-generated 404. This strongly suggests the nginx/Locaweb vhost only has a rewrite/proxy rule wired up for the root path and the `wp-admin`/`wp-login` entry points, with everything else falling through to the platform's catch-all "domain not configured" handler.

The live page itself is a single-page design using in-page anchor links (`#home`, `#beneficios`, `#qualificacao`, `#pacotes`, `#contato`, confirmed via `id="..."` attributes in the rendered DOM) rather than true subpages — so in the current state there may not be much real content "missing" from the broken paths, but the routing layer is broken regardless of content scope, which:
- Blocks any future content expansion (blog posts, service pages, a real `/contato/` page) without first fixing the underlying vhost/rewrite configuration.
- Means any inbound backlinks or old indexed URLs pointing at former subpages (the favicon path alone confirms an October 2014 WordPress upload history, implying the site likely had more page structure historically) now 404 via a non-standard, non-descriptive error page rather than a proper 404 or 301 redirect — link equity from any historical backlinks to those paths is lost.

**Severity: HIGH**

---

## 7. Server Response Headers — HIGH

Beyond the security-specific gaps in Section 4, the following infrastructure details were directly observed and are worth flagging as platform-health red flags independent of any single vulnerability:

- `X-Powered-By: PHP/5.3.29` — PHP 5.3 reached end-of-life in August 2014 (security support ended even earlier for the 5.3 branch specifically — single-digit years of support total). No version of PHP this old has received a security patch in roughly a decade. This single header confirms the entire server-side execution environment is unsupported.
- `Server: nginx/1.22.1` — nginx is acting as a reverse proxy/cache in front of the actual Apache+PHP origin (the `X-Powered-By` and Locaweb-specific `Lw-X-Id` header indicate a Locaweb shared-hosting edge layer). nginx 1.22.1 itself is a reasonably recent build, so the platform layer is patched even though the application layer behind it is not — this is a useful distinction: the *hosting platform* is maintained, the *customer's WordPress install* is not.
- `X-Cache: MISS` on every test request — caching layer exists but nothing was being served from cache during this audit; not itself an SEO issue but worth noting if performance/TTFB is investigated further downstream.
- No `Vary`, no `ETag`/`Last-Modified` observed on the HTML response — minor, but means conditional GET / 304 support for the HTML document itself is not in place, so repeat crawls/visits always pull a full fresh response.

**Severity: HIGH**

---

## 8. Mobile-Friendliness — PASS (with one Medium-severity note)

Cross-referenced from this audit's own header/source inspection plus the rendered-DOM data already captured in `raw_data.json` (headless browser measurements at 6 breakpoints: 375/390/768/1366/1440/1920px).

- Viewport meta tag present and correctly scoped: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`.
- No horizontal scroll or overflowing elements detected at any tested breakpoint (375 through 1920px) — `has_horizontal_scroll: false` and `overflowing_elements: []` across all six device profiles in `raw_data.json`.
- A mobile hamburger-menu element (`[class*="mobile-nav"]`) correctly appears (becomes visible, 40x40px) at the 375px mobile breakpoint while the desktop nav `<ul>` collapses to 0 width — responsive navigation pattern is functioning correctly.
- **Medium-severity issue: `maximum-scale=1` in the viewport meta tag disables user pinch-zoom.** This is a WCAG/mobile-usability anti-pattern flagged by Lighthouse and Google's own mobile-friendliness guidance — it should be removed (use `width=device-width, initial-scale=1` only) so visually impaired users or anyone needing to zoom text can do so. This does not block mobile-friendly indexing but is a known accessibility/UX regression worth fixing in any rebuild.
- Two tap targets below the commonly recommended ~44–48px minimum were found at every breakpoint: the carousel "Previous"/"Next" controls at 38x38px. Minor — Low severity given they're auxiliary carousel controls, not primary navigation/CTA elements.

**Severity: Medium** (for the zoom-blocking viewport directive only — everything else in this category passes)

---

## 9. Core Web Vitals — Source-Level Risk Flags — HIGH

No live CrUX/Lighthouse run was performed as part of this pass (out of scope for a source-inspection audit), but the following structural issues found directly in the page source are well-established predictors of CWV failures:

**LCP risk factors:**
- **18 separate `<link rel="stylesheet">` tags** loaded render-blocking in `<head>`, including three separate Google Fonts requests (`fonts.googleapis.com`) **served over plain HTTP on an HTTPS page** (mixed content — see below) plus 14 theme/plugin CSS files, none bundled or deferred. This is a heavy render-blocking CSS chain that will delay First Contentful Paint and LCP, especially over mobile networks.
- **22 separate `<script src>` tags**, all synchronous (no `async`/`defer` observed on any of them), including jQuery 1.11.1, jQuery Migrate, and the full Revolution Slider + Visual Composer + theme JS bundle (isotope, superslides, owl.carousel, parallax, YTPlayer, etc.) — a substantial render-blocking JS chain on top of the CSS chain above.
- Revolution Slider specifically is historically one of the heaviest LCP offenders in the WordPress ecosystem (large hero images/video, animated caption engine, multiple dependent JS libraries) — and it is confirmed present and active on this homepage.

**CLS risk factors:**
- **Mixed image sizing discipline**: most `<img>` tags in the page do carry explicit `width`/`height` attributes (good — this reserves layout space and reduces CLS), but the site logo image is a notable exception: `<img class="site_logo" src="...logo1.png" alt="Wave Digital">` has **no `width`/`height` attributes at all**, which is a direct CLS risk for one of the most prominent above-the-fold elements (rendered in the nav/header on every view).
- Revolution Slider's caption/animation engine is itself a common source of layout shift as captions and slide elements animate into position after initial paint.

**INP risk factors:**
- The combined 22-script, jQuery-1.11-era JS payload (plus Revolution Slider's animation/tooltip engine) represents meaningful main-thread work that can delay interactivity responsiveness, particularly on lower-end mobile devices.
- A confirmed broken third-party call was observed during headless rendering (captured in `raw_data.json`): a request to `http://gdata.youtube.com/feeds/api/videos/...` — **the legacy YouTube Data API v2, which Google shut down in 2015** — fails with both a CORS error and `net::ERR_FAILED` on every page load. This is dead code making a network request to a domain that no longer resolves/serves correctly, on every single page view, adding wasted main-thread/network time and a console error on every load. It should simply be removed.

**Severity: HIGH** (compounding render-blocking resources + confirmed dead third-party network call + unsized logo image)

---

## 10. Structured Data — HIGH

Direct source inspection found **zero structured data of any kind**:
- `application/ld+json` blocks: 0 found.
- Microdata (`itemscope`/`itemtype`): 0 found.
- RDFa: 0 found.
- No `schema.org` reference anywhere in source.

Additionally, **no Open Graph tags** (`og:title`, `og:description`, `og:image`, etc.) and **no Twitter Card tags** were found — meaning social shares of this URL will render with no preview image/description on Facebook, LinkedIn, WhatsApp (highly relevant for a Brazilian business audience), or X/Twitter. There is also **no `<meta name="description">` tag at all** in the page source — Google will be forced to auto-generate a snippet from page body text for every SERP listing, with no control over messaging.

No SEO plugin (Yoast, Rank Math, All in One SEO, or similar) signature was found in the source, which is consistent with there being no meta description, no OG tags, and no structured data — none of the standard mechanisms for adding any of this exist on the install.

For a local-business digital agency, the complete absence of `LocalBusiness`/`Organization` schema (NAP — name, address, phone — markup) is a missed opportunity independent of all the other issues, and notably this also means there is no structured-data-level confirmation of which phone number/location is canonical, consistent with the broader stale-content concern (area-code-41/Curitiba number on a page that may predate a relocation to Campos dos Goytacazes, RJ, per the redesign project context).

**Severity: HIGH**

---

## 11. JavaScript Rendering — PASS

- Homepage content is fully server-side rendered: H1 text ("Somos a Wave Digital"), navigation, and all visible section content are present directly in the raw HTML response, not injected client-side. Confirmed by direct diff between raw HTML source and rendered DOM — no SPA shell, no client-side-only content gap.
- `<noscript>` fallback count is 0, but this is irrelevant here since there is no CSR dependency to begin with — content does not require JavaScript execution to be crawlable.
- This means Googlebot's standard (non-rendering) crawl pass can already see full page content; the JS payload is used for visual/interactive enhancement (slider, animations, smooth scroll) rather than content delivery. From a pure crawlability standpoint this is a non-issue.

**Severity: N/A (Pass)**

---

## 12. IndexNow Protocol — N/A / Not Applicable Given Current State

- No IndexNow key file found (`/indexnow.txt` returns the same Locaweb 404 as everything else, consistent with Section 2's findings — this path was not expected to work and didn't).
- Given that `sitemap.xml` itself is inaccessible and the CMS has no SEO plugin or custom integration layer, there is no current mechanism (plugin-based or otherwise) for pushing IndexNow notifications to Bing/Yandex/Naver on content changes.
- This is not an independent issue so much as a downstream consequence of Sections 2 and 5 — IndexNow adoption is not a meaningful next step until the underlying CMS/hosting/routing problems are resolved. No action needed here beyond noting it should be part of the rebuild's launch checklist (most modern SEO plugins, or a small custom webhook, can wire this up cheaply once a working sitemap exists).

**Severity: Low** (deprioritized — blocked by upstream Critical issues, not a standalone gap worth fixing on the current stack)

---

## Issue Summary by Severity

**CRITICAL**
1. TLS certificate mismatch on both `wavedigital.com.br` and `www.wavedigital.com.br` (cert issued for `*.websiteseguro.com`) — hard validation failure in all standards-compliant browsers.
2. `robots.txt` and `sitemap.xml` both return Locaweb platform 404s, not real content — no machine-readable crawl/discovery manifest exists.
3. Zero security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all absent); PHP version actively disclosed via `X-Powered-By`.
4. WordPress 4.0.38 core + Revolution Slider 4.6.0/ws-4.0.38 + Visual Composer 4.3.4, all running on PHP 5.3.29 — over a decade of unpatched vulnerability exposure across the full stack, including a plugin (RevSlider) tied to one of the largest historical mass-WordPress-compromise campaigns.

**HIGH**
5. Permalink/routing layer broken at the server level for every path except `/`, `/wp-admin/`, `/wp-login.php` — blocks content expansion and orphans any historical backlinks to former subpages.
6. PHP 5.3.29 (EOL since 2014) confirmed via response header; nginx edge layer is current but does not mitigate the unpatched application runtime behind it.
7. Multiple Core Web Vitals risk factors: 18 render-blocking stylesheets, 22 synchronous scripts, unsized logo image (CLS), confirmed dead third-party network call to defunct YouTube Data API v2 firing on every page load.
8. No structured data of any kind (no JSON-LD/microdata/RDFa), no Open Graph/Twitter Card tags, no meta description — no SEO plugin present to manage any of this.

**MEDIUM**
9. Viewport meta tag sets `maximum-scale=1`, disabling pinch-zoom — accessibility/mobile-usability anti-pattern.
10. `xmlrpc.php` not cleanly disabled — still advertised via `X-Pingback` header and RSD `<link>` tag even though direct POST is currently 403'd at the edge.
11. `/wp-content/plugins/` returns HTTP 200 rather than 403/404 — potential directory-listing/version-fingerprinting exposure (listing contents not confirmed empty in this pass; recommend explicit verification and an index-blocking rule regardless).

**LOW**
12. Two carousel control elements (Previous/Next, 38x38px) fall slightly below recommended tap-target sizing — minor, non-primary UI.
13. IndexNow not implemented — correctly deprioritized given no working sitemap/SEO-plugin layer exists yet to support it.

---

## Files referenced
- `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/findings/raw_data.json` — headless-browser viewport/DOM measurements (6 breakpoints) cross-referenced in Sections 8–9 of this report.
