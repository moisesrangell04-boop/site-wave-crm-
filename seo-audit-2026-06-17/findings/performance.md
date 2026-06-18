# Performance Audit — wavedigital.com.br

**Date:** 2026-06-17
**URL audited:** https://wavedigital.com.br/
**Method:** Server-side `curl` checks (TTFB, headers, payload size). No Lighthouse/PageSpeed Insights API or browser-based run was performed in this pass — see Methodology Note at the end. Core Web Vitals figures below are **estimated** from server/markup signals, not measured from real Chrome user data (CrUX) or a Lighthouse trace.

---

## Performance Score (Estimate)

**Estimated Lighthouse Performance Score: 25-40 / 100** (estimate, not measured)

Basis for estimate: very slow/inconsistent TTFB, zero HTTP compression, a 2014-era jQuery-dependent plugin stack (Visual Composer, Revolution Slider 4.6.0, Mb.YTPlayer) known to ship large render-blocking JS/CSS bundles, and a confirmed broken third-party request. No field (CrUX) data was queried in this pass, so this score should be treated as directional only.

---

## Core Web Vitals Status (Estimated)

| Metric | Estimated Status | Estimated Value | Confidence |
|---|---|---|---|
| LCP | **Likely Poor** | ~4-6s+ | Estimate — slow TTFB alone consumes 0.5-2.7s of the LCP budget before any rendering starts; render-blocking slider/CSS stack adds more |
| INP | **Likely Needs Improvement / Poor** | ~250-600ms on interaction | Estimate — jQuery + Visual Composer + Revolution Slider main-thread cost is historically heavy |
| CLS | **Indeterminate, risk of Needs Improvement** | Unknown | Estimate — Revolution Slider and late-loading slider/video content are common CLS sources, but not measured directly |

None of these are confirmed against CrUX or Lighthouse; they are inferred from the server response and known plugin behavior.

---

## Confirmed Findings (re-verified this session via curl)

### 1. TTFB / Server Response Time — **Critical**
Re-ran `curl -sk -o /dev/null -w "%{time_starttransfer}\n" https://wavedigital.com.br/` three times just now:

```
Run 1: TTFB 1.647s  (total 1.855s)
Run 2: TTFB 2.677s  (total 2.885s)
Run 3: TTFB 0.535s  (total 0.743s)
```

This is **worse and far more volatile** than the previously reported 600-810ms range. TTFB alone ranged from 0.53s to 2.68s across three consecutive requests — a >5x swing — indicating an unstable/overloaded origin server (PHP 5.3.29 + nginx 1.22.1, likely shared hosting with no opcode/object caching or a cold PHP-FPM pool). Since LCP cannot start rendering until the document arrives, this single issue can by itself push LCP into "Poor" territory (>4s) even before CSS/JS/image loading is considered.

**Impact:** Critical — directly inflates LCP and is the single highest-leverage fix available.

### 2. Missing HTTP Compression — **Critical**
Re-checked response headers with `Accept-Encoding: gzip, br` sent:

```
server: nginx/1.22.1
x-powered-by: PHP/5.3.29
```

No `content-encoding` header was returned at all — confirming the document is served **uncompressed** despite the client explicitly requesting gzip/br. HTML payload size was measured at **42,326 bytes** uncompressed; with gzip this would typically drop to ~8-12KB (70-80% reduction), shaving meaningful time off both TTFB-adjacent transfer time and parse start.

**Impact:** Critical — free, server-config-only fix (enable gzip/brotli in nginx) with no code risk.

### 3. Render-Blocking Resource Count — **High**
`grep -c` against the fetched HTML found:
- **27** `<script>` tags
- **26** `<link>` tags (mostly stylesheets, given the Visual Composer/Revolution Slider stack)

53 combined script/link references on a single-page site is high for 2026 standards, especially when most originate from jQuery-era plugins (Visual Composer, Revolution Slider 4.6.0, Mb.YTPlayer) that load synchronously in the `<head>` by default and are not natively deferred/async. This is consistent with — though not a full substitute for — a WebPageTest/Lighthouse request waterfall.

**Impact:** High — each blocking `<link>`/`<script>` in `<head>` delays first paint and pushes out LCP; jQuery dependency chains also commonly produce long main-thread tasks that hurt INP.

### 4. Broken Third-Party Video Embed — **Medium**
Confirmed by prior pass (not re-verified this session, but consistent with Mb.YTPlayer/legacy embed pattern): a dead call to `gdata.youtube.com` (the deprecated YouTube Data API v2, shut down by Google years ago). Every page load attempts this request, waits for it to fail/timeout, and only then continues — adding dead-weight latency and an extra failed network request that contributes nothing but delay, particularly relevant to INP/load completion if any JS blocks on its response or retries.

**Impact:** Medium — low effort to remove, removes guaranteed-failing overhead.

### 5. Caching Headers — Good (carried over, not re-verified this session)
Static assets reported with far-future `Cache-Control` headers by the prior pass. This is good practice and does not need remediation. Not independently re-checked in this session.

### 6. Legacy Plugin Stack — **High**
WordPress 4.0.38 (current WP is in the 6.x line — this install is roughly 10+ major versions behind) running Visual Composer, Revolution Slider 4.6.0, and Mb.YTPlayer, all jQuery-dependent. These plugins are well-documented for:
- Shipping their own full jQuery + jQuery UI + animation libraries (often duplicated across plugins)
- Large, unminified or poorly-minified CSS bundles
- Inline `document.write` or synchronous script injection patterns common to that plugin generation
- Slider plugins specifically being one of the most common sources of CLS (layout shift while slider JS initializes and resizes slides) and INP regressions (heavy init routines running on `DOMContentLoaded`)

This is reported by the prior pass's plugin identification, not re-verified line-by-line in this session, but the 27 scripts / 26 stylesheets confirmed above is consistent with this stack being present and largely unoptimized.

**Impact:** High — this is the root cause underlying both the LCP render-blocking issue and the INP risk; fixing TTFB/compression alone will not fix this.

---

## Likely Core Web Vitals Impact Summary (Estimated)

| Issue | LCP Impact | INP Impact | CLS Impact |
|---|---|---|---|
| Slow/unstable TTFB (0.5-2.7s) | Critical — directly delays LCP start | Indirect (delays when JS can even begin executing) | None |
| No compression | High — larger bytes to parse before render | Low | None |
| 53 blocking script/link tags | High — delays CSSOM/render | Medium — parser-blocking JS can compete with input handling | Low-Medium |
| Revolution Slider / Visual Composer | High (often the page's LCP element if it's a hero slider) | Medium-High — heavy init scripts on load | Medium-High — common slider-resize shift pattern |
| Broken gdata.youtube.com call | Low-Medium | Low-Medium if anything blocks on it | None expected |
| jQuery dependency chain | Medium | Medium-High — long tasks during hydration/init | Low |

---

## Prioritized Recommendations

### Critical (do first — server/infra, no code risk)
1. **Stabilize and reduce TTFB.** Investigate why TTFB swings from 0.53s to 2.68s on consecutive requests — check PHP-FPM pool sizing/cold starts, enable an opcode cache (OPcache) if not already on, add a full-page cache layer (e.g., WP Super Cache/W3 Total Cache equivalent, or better, a reverse proxy/edge cache), and consider moving off PHP 5.3.29 / outdated hosting entirely. Target: consistent TTFB <200ms.
2. **Enable gzip or brotli compression in nginx** for HTML, CSS, JS, and JSON responses. This is a one-line nginx config change (`gzip on;` plus `gzip_types`) and should yield an immediate ~70% reduction in transferred HTML/CSS/JS bytes with zero functional risk.

### High (biggest LCP/INP lever after the above)
3. **Audit and reduce the 53 render-blocking script/link tags.** Defer or async non-critical JS, inline/extract critical CSS for above-the-fold content, and eliminate duplicate jQuery/jQuery UI instances if multiple plugins each ship their own copy.
4. **Replace or modernize Revolution Slider / Visual Composer.** If the hero slider is the LCP element (likely, given it's the visual centerpiece on a single-page layout), migrating to a lightweight CSS-only hero or a modern, lazy-initialized slider would directly reduce LCP, INP, and CLS simultaneously. At minimum, ensure slider dimensions are reserved in CSS before JS executes to prevent layout shift.
5. **Update WordPress core and PHP.** WP 4.0.38 / PHP 5.3.29 are both years past end-of-life, carry security risk, and miss a decade of PHP performance improvements (PHP 5.3 to PHP 8.x is roughly a 3-5x performance difference on equivalent code).

### Medium
6. **Remove the dead `gdata.youtube.com` call.** Replace with a current YouTube embed (iframe API or `youtube-nocookie.com` lazy-loaded facade) to eliminate the guaranteed-failing request.
7. **Preload the LCP hero image/slide** (`<link rel="preload" as="image">`) once the slider/hero element is identified, and serve it in WebP/AVIF if not already.

### Low
8. **Verify font loading strategy** (`font-display: swap` or preloaded web fonts) to avoid FOIT contributing to CLS/LCP — not directly observed in this session but worth checking given the plugin stack's era.
9. Continue leveraging the already-good far-future cache headers on static assets; no action needed there.

---

## Methodology Note

This audit was produced primarily from `curl`-based checks (TTFB timing across 3 runs, response headers, HTML byte size, script/link tag counts) due to a budget constraint on this pass. It does **not** include:
- A Lighthouse or PageSpeed Insights API run (no field/lab Core Web Vitals data was pulled)
- CrUX field data (75th-percentile real-user LCP/INP/CLS)
- A browser-rendered waterfall (actual request count/weight including images, fonts, third-party scripts beyond what's referenced in the raw HTML)

The Core Web Vitals figures in this report are therefore **estimates inferred from server and markup signals**, clearly labeled as such throughout. For a measured (not estimated) CWV assessment, run:
```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://wavedigital.com.br/&key=API_KEY"
```
or `npx lighthouse https://wavedigital.com.br/ --output json` in a follow-up pass, and cross-check against CrUX Vis (https://cruxvis.withgoogle.com) if the site has sufficient Chrome UX Report traffic.
