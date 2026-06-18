# Visual & Mobile Rendering Audit — wavedigital.com.br

Date: 2026-06-17
Scope: https://wavedigital.com.br/ (single anchor-nav homepage, 2014-era WordPress + Visual Composer "Salient"-family theme). The `www.wavedigital.com.br` subdomain returns a TLS/connectivity error and was excluded from testing, per instructions.

Method: Live DOM/network inspection via Playwright/Chromium (desktop 1920x1080 and mobile 375x812, touch-emulated), cross-checked against the 6 pre-captured breakpoint screenshots in `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/screenshots/` (desktop_1920, desktop_1440, laptop_1366, tablet_768, mobile_390, mobile_375 — above_fold + full_page each).

Severity key: **P0 Critical** (breaks core experience / actively misleading) · **P1 High** (significant UX or SEO harm) · **P2 Medium** (notable but not blocking) · **P3 Low** (polish).

---

## 1. Broken video backgrounds — gray placeholder blocks (P0 — Critical, confirmed)

Confirmed via live network trace. The hero "fullscreen slider" embeds a YouTube background video using the old **Mb.YTPlayer** jQuery plugin (`div.player.video-container.mb_YTVPlayer`), which still calls the long-dead **YouTube Data API v2** endpoint:

```
GET https://gdata.youtube.com/feeds/api/videos/rQNu6-ERezU?v=2&alt=jsonc
→ net::ERR_FAILED
```

This API was shut down by Google in 2015. But the problem is actually two-layered, and worse than "just a dead API call":

1. The dead `gdata.youtube.com` call fails outright (confirmed).
2. Independently, the YouTube video itself (`rQNu6-ERezU`) embedded via the iframe (`https://www.youtube.com/embed/rQNu6-ERezU?...`) is **no longer available on YouTube at all**. Reading the iframe's own document confirms YouTube renders its own error inside the player:
   > "Vídeo indisponível — Este vídeo não está disponível"

   So even if the legacy `gdata` call were fixed/removed, the background video would still fail because the source video has been deleted/privated upstream. This is a permanent, unrecoverable failure, not a transient one.

3. Result: every breakpoint's hero section (confirmed in all 6 screenshots: desktop_1920, desktop_1440, laptop_1366, tablet_768, mobile_390, mobile_375) renders as a flat gray placeholder with a faint pixel-noise/static texture instead of video, with only the slider text and nav overlaid on top.

4. **This is not an isolated incident.** The same `vc_row...parallax` pattern repeats at least twice more down the page (confirmed in full-page screenshots at every breakpoint): a large gray block roughly mid-page (~660–1500px tall depending on breakpoint) and another large gray block just before the footer/contact-form section. These appear to be Visual Composer "parallax" background rows that are also failing to render their intended background imagery/video, compounding the broken-gray-block problem from a single hero issue into a pattern that recurs 3+ times down the full page.

5. There is a **second, separate** video element further down the page — a `wpb_video_widget` embedding `https://www.youtube.com/embed/nDPFyOVyIPE` ("Como começar a anunciar no Google AdWords?" — Google Brasil's official channel). This one **loads and works correctly**. So the failure is specific to the hero's `Mb.YTPlayer` background-video implementation and/or its specific (deleted) source video, not YouTube embeds generally.

**Impact:** The single most prominent visual element on the homepage — the full-viewport hero — is permanently broken for every visitor, on every device, confirmed in every screenshot. On mobile this is especially severe (see §2).

**Fix recommendation:** Remove the Mb.YTPlayer background-video hero entirely (it's an abandoned plugin pattern from ~2014–2015) and replace with a static image or CSS-based background. If video background is desired, use a self-hosted MP4/WebM via native `<video>` with no third-party API dependency.

---

## 2. Above-the-fold content quality (P0 — Critical on mobile, P1 on desktop)

**Desktop (1920/1440/1366):** Above the fold shows: dark nav bar, the broken gray hero block with "ESPECIALIZADOS EM GOOGLE" decorative text + "Somos a Wave Digital" + tiny prev/next carousel arrows, and the top sliver of the navy "BEM-VINDO!" section bleeding in at the bottom edge. There is **no visible primary CTA above the fold** on any desktop breakpoint — the "SAIBA MAIS" / "CONTATO" buttons sit in the BEM-VINDO band, which is only partially visible (a few px on 1920px height, cut off entirely on 1440/1366 unless scrolled).

**Mobile (375/390):** This is more severe. Confirmed directly in `mobile_375_above_fold.png` and `mobile_390_above_fold.png`: the entire viewport above the fold is consumed by the broken gray block. There is no heading text near the top, no CTA, no value proposition visible — only the nav bar, a large empty/gray expanse, and (near the very bottom of the viewport) the decorative "ESPECIALIZADOS EM GOOGLE" text and carousel arrows. A first-time mobile visitor sees what looks like a broken or unfinished page with nothing actionable, and would need to scroll roughly 1.5–2x the viewport height before reaching real content or a CTA ("BEM-VINDO!" / "SAIBA MAIS" / "CONTATO").

**SEO/UX mismatch confirmed:** Live DOM check confirms the H1 used for SEO purposes is `<h1 class="home-fixed-text t-center">Somos a Wave Digital</h1>` — small, low-contrast gray text. The visually dominant, large white text "ESPECIALIZADOS EM GOOGLE" is **not** a heading at all; it's a `<li class="slide white uppercase">` inside `div.text-slider` — purely decorative slider markup with no semantic weight. So the text search engines treat as the page's headline is the least visually prominent text in the hero, while the most visually prominent text carries zero heading semantics. This is a real SEO/UX disconnect: visually, the message a user reads first is "ESPECIALIZADOS EM GOOGLE"; semantically (for crawlers/assistive tech), the page is titled "Somos a Wave Digital."

**Additional finding — multiple/empty H1s (P1, not in prior notes):** The page has far more than one H1. A full H1 sweep returned, among others: `"Somos a Wave Digital"`, `"BEM-VINDO!"`, an H1 reading **`"41 3015.8753"` (the phone number is marked up as a level-1 heading)**, plus several empty `<h1 class="header animated">` elements used purely as scroll-in animation containers for section titles like "Como Funciona" (confirmed populated only once that section scrolls into view). Multiple competing/empty H1 tags is a meaningful on-page SEO defect beyond the single-H1 observation in the prior pass.

---

## 3. Tap target sizing (P1 — High, confirmed and expanded)

| Element | Measured size | Meets 44×44 (WCAG AAA) / 48×48 (Material) guideline? |
|---|---|---|
| Carousel prev/next arrows (`.flex-prev` / `.flex-next`) — desktop | 38 × 38px | No |
| Carousel prev/next arrows — mobile (375px) | 38 × 38px (identical, not enlarged for touch) | No |
| Mobile hamburger menu button (`a.mobile-nav-button.colored`) | 40 × 40px clickable area (icon glyph itself only 21×40px) | No (close, but under both 44 and 48px thresholds) |

The carousel arrows are unchanged between desktop and mobile — confirming the site does not adapt touch targets for touch input at all, it simply reuses the same fixed-pixel UI chrome regardless of input modality. Both items sit within roughly 4–10px of the minimum guideline, so this is a real but moderate fix (not a drastic redesign).

---

## 4. Font legibility (P1 — High, confirmed)

- Live computed styles confirm: `body { font-size: 14px }` on **both desktop (1920px) and mobile (375px) viewports** — identical, meaning there's no responsive type scaling at all.
- `html { font-size: 10px }` — an unusual base (most modern sites use 16px/62.5% rem strategies; this 10px root appears to be a relic of an old rem-based sizing scheme from the original theme).
- Sampled `<p>` tags render at 14–15px across the board.
- 14px body copy is below the commonly cited 16px minimum for comfortable mobile reading (Google's mobile-friendly guidelines / WCAG-adjacent best practice), and critically, **it doesn't even scale up on desktop** where there's no excuse for it — this isn't a mobile-specific compromise, it's a global undersized type system.

**Compounding issue (P2, new finding):** Several Google Fonts requests are failing as **mixed content**, because they're hardcoded to `http://` on a page served over `https://`:
```
http://fonts.googleapis.com/css?family=Raleway&ver=4.0.38            → blocked (mixed-content)
http://fonts.googleapis.com/css?family=Oswald:300,400,600&ver=4.0.38 → blocked (mixed-content)
http://fonts.googleapis.com/css?family=Indie+Flower&ver=4.0.38       → blocked (mixed-content)
http://wavedigital.com.br/wp-content/uploads/js_composer/custom.css?ver=4.3.4 → blocked (mixed-content)
```
Modern browsers silently block these `http://` subresource requests on an `https://` page. This means the three intended Google Fonts (Raleway, Oswald, Indie Flower) are **not loading at all** in current browsers, and the page is falling back to system fonts — and a Visual Composer custom stylesheet (likely containing additional layout/type rules from the original 2014 build) is also being dropped entirely. This is likely an unintentional side effect of the site being moved to HTTPS at some point without updating these hardcoded asset URLs, and may explain some of the layout/spacing oddities noted in §5.

---

## 5. Genuine responsiveness vs. fixed-width-pretending-to-be-responsive (P1 — High)

Verdict: **partially responsive, but with significant fixed-pixel/legacy-theme leakage.**

Evidence for genuine responsiveness:
- Correct `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` is present.
- No horizontal-scroll overflow detected at either 1920px or 375px (`scrollWidth === clientWidth` at both breakpoints) — content does reflow to fit viewport width, it isn't a static desktop layout simply shrunk.
- Mobile nav correctly collapses into a hamburger menu (`fa fa-bars` / `a.mobile-nav-button`), and desktop nav links are correctly hidden (`offsetParent: null`) off-canvas on mobile rather than just visually squeezed.
- Type and section padding do reduce somewhat at narrower breakpoints (visible in the screenshot comparison — text wraps and resizes between 1920/1440/1366/768).

Evidence this is "fixed-width dressed up as responsive" rather than a modern fluid/mobile-first build:
- **`maximum-scale=1` in the viewport meta tag** disables pinch-to-zoom — a deprecated/anti-pattern that actively hurts accessibility for low-vision users, a hallmark of older "responsive" retrofits rather than modern responsive design.
- **Touch targets are not adapted for touch** (carousel arrows identical 38×38px on both desktop and mobile — see §3) — a genuinely mobile-first design would enlarge or replace these controls for touch input; this codebase just reflows the same desktop widget.
- **Font size does not change between breakpoints** (14px body text identical at 1920px and 375px) — true responsive typography typically scales (e.g., via `clamp()` or breakpoint-specific rules); here it's static across all viewports, suggesting the CSS is largely the original fixed-size 2014 stylesheet with a separate, bolted-on mobile media-query layer that primarily handles layout stacking, not typography or touch ergonomics.
- The broken hero video/parallax blocks (§1) reproduce identically at every single breakpoint rather than degrading gracefully (e.g., a modern responsive build would typically swap video for a static poster image on mobile/low-bandwidth; here it just renders the same broken gray block scaled to each viewport).
- The 10px root `html` font-size combined with `rem`-based component sizing (a common 2013–2015-era WordPress theme technique) is a strong technical signature of an old, non-fluid base that's been patched with responsive breakpoints rather than rebuilt mobile-first.

**Conclusion:** The site does technically reflow and avoid horizontal scrolling at all 6 tested breakpoints (so it is not "fake-responsive" in the most literal broken sense), but it exhibits the classic symptoms of a ~2014 desktop-first Visual Composer theme retrofitted with breakpoint-based layout stacking, without any accompanying improvements to touch ergonomics, fluid typography, or zoom accessibility. Functionally responsive, but not designed mobile-first, and several of its "responsive" decisions (disabling zoom, static 14px type, unchanged tap targets) actively work against mobile usability.

---

## 6. Other visual issues observed in full-page screenshots (P2 — Medium, new findings)

- **Large unexplained empty whitespace gaps** appear at every breakpoint between the icon-badge grid section ("Análise de Mercado / Técnicas de Otimização / Controle de Saldo..." etc.) and the footer contact section — visible as a tall blank white gap in `desktop_1920_full_page.png`, `laptop_1366_full_page.png`, and `tablet_768_full_page.png`. This is consistent with a Visual Composer row that has padding/margin set but its content (likely another broken video/image embed, matching the pattern in §1) failing to render, leaving the row's vertical spacing intact but empty.
- A near-identical large gray block (the second parallax/video row referenced in §1.4) sits directly below the "Links Patrocinados / Posicionamento / Palavras-Chave / Valor do Clique / Dúvidas Frequentes" accordion section, on every breakpoint — reinforcing that this is a site-wide template pattern failure, not a one-off.
- The contact section near the footer also has a gray placeholder-style background panel behind the phone number / email / social icon block, visually consistent with the other broken blocks — worth re-checking whether this one is intentional dark styling or another failed background asset (lower confidence than the hero, flagging as P2 for follow-up rather than confirmed-broken).

---

## Summary table

| # | Finding | Severity | Confirmed? |
|---|---|---|---|
| 1 | Hero background video dead at two layers: legacy `gdata.youtube.com` API call fails AND the source YouTube video itself is deleted/unavailable | P0 | Confirmed |
| 1b | Same broken gray block pattern repeats 2–3x down the page, not just in the hero | P0 | Confirmed |
| 2 | No primary CTA above the fold on any breakpoint; on mobile, above-the-fold is 100% the broken gray block with zero usable content | P0 (mobile) / P1 (desktop) | Confirmed |
| 2b | Decorative slide text ("ESPECIALIZADOS EM GOOGLE") visually dominant but not the H1; actual H1 ("Somos a Wave Digital") is small/low-contrast | P1 | Confirmed |
| 2c | Page contains multiple H1 tags, including one wrapping just the phone number, plus several empty H1 placeholders | P1 | Confirmed (new) |
| 3 | Carousel arrows 38×38px (desktop and mobile, unchanged); mobile hamburger 40×40px — all under 44–48px touch guideline | P1 | Confirmed |
| 4 | Body font-size fixed at 14px on both desktop and mobile (no responsive type scaling at all) | P1 | Confirmed |
| 4b | Three Google Fonts + one VC stylesheet fail to load due to hardcoded `http://` mixed-content URLs on an `https://` page | P2 | Confirmed (new) |
| 5 | Site reflows without horizontal scroll at all 6 breakpoints, but disables pinch-zoom, doesn't adapt touch targets or type scale — "responsive" retrofit over a fixed-width 2014 theme rather than mobile-first | P1 | Confirmed |
| 6 | Large unexplained empty whitespace gaps pre-footer at every breakpoint, likely from additional failed embeds | P2 | Confirmed |

---

## Screenshots referenced

All at `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/screenshots/`:
- `desktop_1920_above_fold.png`, `desktop_1920_full_page.png`
- `desktop_1440_above_fold.png`, `desktop_1440_full_page.png`
- `laptop_1366_above_fold.png`, `laptop_1366_full_page.png`
- `tablet_768_above_fold.png`, `tablet_768_full_page.png`
- `mobile_390_above_fold.png`, `mobile_390_full_page.png`
- `mobile_375_above_fold.png`, `mobile_375_full_page.png`
