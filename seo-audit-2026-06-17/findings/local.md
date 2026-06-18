# Local SEO Audit — Wave Digital (wavedigital.com.br)

**Audit date:** 2026-06-17
**Live URL audited:** https://wavedigital.com.br/
**Comparison source:** unreleased redesign at `/Users/moisesrangel/Documents/wave crm/index.html` (local repo, not deployed)
**Business type (live site):** Hybrid-leaning SAB — agency named after a city ("Curitiba") with no visible street address, phone with Curitiba/PR area code
**Business type (redesign):** SAB (service-area business) — explicitly geo-targets Campos dos Goytacazes, RJ and the "Norte Fluminense" region
**Industry vertical:** Local Service / B2B digital marketing agency (closest schema fit: `LocalBusiness` or `ProfessionalService`, not a Whitespark/Google-supported specific subtype — see Schema section)

---

## Severity legend
**[CRITICAL]** blocks launch / actively damages rankings or trust · **[HIGH]** fix before/at launch · **[MEDIUM]** fix soon after launch · **[LOW]** polish / nice-to-have

---

## 1. Headline Finding: Area Code / City Mismatch (Curitiba vs. Campos dos Goytacazes)

**[CRITICAL]**

This is the single most important issue in this audit and must be resolved before the redesign goes live.

| Source | Phone | Implied city/region | Schema city/region |
|---|---|---|---|
| **Live site** (wavedigital.com.br, current) | `41 3015.8753` (landline, area code 41 = Curitiba/PR) | Curitiba, PR (confirmed in body copy: *"A Wave Digital nasceu da vontade de profissionais do mercado de **Curitiba**..."*) | No schema present |
| **Redesign** (local repo, not deployed) | `+55 41 99116-4890` (mobile, **area code 41 = Curitiba/PR**) | Body copy and meta tags explicitly say **Campos dos Goytacazes, RJ** (area code for Campos dos Goytacazes is **22**, not 41) | `LocalBusiness.address.addressLocality = "Campos dos Goytacazes"`, `addressRegion = "RJ"` |

Findings:
- The **live site** is self-consistent: Curitiba phone number + Curitiba city claim in body copy. This is very likely either (a) the original, legitimate "Wave Digital" agency that has existed since 2014 (footer: "Wave Digital 2014"), or (b) an abandoned/legacy business still squatting on the domain.
- The **redesign** is **internally inconsistent**: it keeps a **41-area-code phone number** (Curitiba/Paraná) while every other geo signal — title tag, meta description, `geo.placename`, `geo.position` coordinates (-21.7549, -41.3247, which do correctly resolve to Campos dos Goytacazes/RJ), `areaServed`, hero badge copy, FAQ copy — declares **Campos dos Goytacazes, RJ**. Campos dos Goytacazes' real telephone area code is **22**, not 41. A Curitiba-area-code number tied to an RJ-based local business is the kind of mismatch that actively confuses both users (who may assume long-distance call costs or distrust the listing) and Google's entity-matching for NAP consistency.
- There is no indication in either codebase of what the *current, real* GBP listing (if one exists) says for name/address/phone. If a live Google Business Profile exists under the old Curitiba identity, relaunching with Campos dos Goytacazes content and the same phone number will create a direct NAP conflict between the website and GBP — a well-documented ranking suppressor.
- Three plausible scenarios, all requiring action before launch:
  1. **Relocation/rebrand**: Wave Digital genuinely moved from Curitiba to Campos dos Goytacazes and is being repositioned as a new niche agency (CRM/automação) — in which case the phone number needs to be reissued as a local 22-area-code number (or clearly disclosed as a national/WhatsApp-only line) and the **existing GBP listing must be claimed, edited, or merged**, not orphaned.
  2. **Same owner, new sub-brand**: if this is a new, separate offering under common ownership, it should get its **own** NAP and its own GBP listing distinct from the Curitiba "Wave Digital Media" listing tied to `facebook.com/wavedigitalmedia`.
  3. **Abandoned domain reuse**: if the live Curitiba business is unrelated/defunct and the domain was repurposed, all legacy citations (Facebook page, any directory listings, backlinks under the old NAP) will continue pointing to a now-incorrect identity and must be audited/updated or disavowed — and the redesign must not silently inherit an unrelated entity's link equity without reconciling NAP everywhere.
- **Action required before launch:** Determine ground truth (does a GBP exist? under which city/name?), decide on one canonical city + matching local phone number, and update either the website copy or the GBP/citations so all three (site, schema, GBP) agree exactly.

---

## 2. NAP Audit — Live Site (wavedigital.com.br, current production)

| Field | Visible HTML | Schema (JSON-LD) | Meta tags | Consistent? |
|---|---|---|---|---|
| Name | "Wave Digital" (title, logo alt, footer) | **Absent — no LocalBusiness/Organization schema on page** | `<title>Wave Digital</title>` only | N/A (single source) |
| Address (street) | **Not present anywhere on page.** The "Address" `<h2>` heading in the contact section is rendered empty (`<h2 class="phone-text font-primary uppercase"></h2>`) — a placeholder that was apparently never filled in. | Absent | Absent | **[HIGH]** No address shown at all |
| City | Implied only via prose: "profissionais do mercado de Curitiba" | Absent | Absent | Weak/indirect signal only |
| Phone | `41 3015.8753`, also `tel:41 3015.8753` (landline format, not E.164) | Absent | Absent | Single source, but malformatted `tel:` link |
| Email | `CONTATO@WAVEDIGITAL.COM.BR` (rendered uppercase; mailto matches) | Absent | Absent | Consistent within itself |
| Social | Facebook only: `facebook.com/wavedigitalmedia` | Absent | Absent | No Instagram/LinkedIn/Google links found |

**[HIGH]** No physical address is displayed anywhere on the live homepage — not in visible HTML, not in schema, not in a footer. For a business whose own copy claims geographic identity ("nasceu... do mercado de Curitiba"), the complete absence of a street address (or even just city/state in structured text) is a significant local SEO and trust gap. This also makes it impossible to verify NAP consistency against any GBP listing from on-page data alone.

**[MEDIUM]** Phone number is not in click-to-call-safe E.164 format consistently — `tel:41 3015.8753` includes a space and period, which some mobile dialers may mis-parse.

**[MEDIUM]** Email is hard-coded in uppercase in both link text and `href` — cosmetic but inconsistent with normal casing conventions used in citations; if any directory has it lowercase, that's a trivial but real micro-inconsistency.

---

## 3. NAP Audit — Redesign (local repo, not yet deployed)

| Field | Visible HTML | Schema (JSON-LD `LocalBusiness`) | Meta tags | Consistent? |
|---|---|---|---|---|
| Name | "WAVE Digital" (title, logo alt) | `"name": "WAVE Digital"` | Title: "WAVE Digital \| Agência de Soluções Digitais em Campos dos Goytacazes - RJ" | Consistent (capitalization of "WAVE" vs. live site's "Wave" — **[LOW]** minor brand-casing drift) |
| Address (street) | **Not present** — only city/region badges ("Campos dos Goytacazes · Norte Fluminense · RJ") | `addressLocality: "Campos dos Goytacazes"`, `addressRegion: "RJ"`, `addressCountry: "BR"` — **no `streetAddress`, no `postalCode`** | `geo.placename: "Campos dos Goytacazes"`, `geo.region: "BR-RJ"` | City-level consistent; street-level **absent everywhere** |
| Phone | `+5541991164890` used in WhatsApp deep links (`wa.me/5541991164890`) throughout the page | `"telephone": "+5541991164890"` | Not in meta | Internally consistent format, but **see Section 1 — wrong area code for stated city** |
| Email | Not found in visible body copy (lead form likely posts elsewhere) | `"email": "wavecrm.business@gmail.com"` | Not in meta | **[HIGH]** Generic Gmail address used as business contact in schema, not a `@wavedigital.com.br` domain address — undermines credibility/trust signal and differs entirely from live site's `contato@wavedigital.com.br` |
| Social | Instagram only: `instagram.com/wave.crm` | `"sameAs": ["https://www.instagram.com/wave.crm/"]` | — | Consistent within redesign, but **completely different** from live site's Facebook (`wavedigitalmedia`) — **[HIGH]**, see Section 4 |

**[CRITICAL]** Cross-version NAP comparison (live vs. redesign): name casing differs ("Wave" vs "WAVE"), phone number differs entirely (3015.8753 landline vs. 991164890 mobile — same area code, different number), email differs entirely (`contato@wavedigital.com.br` vs. `wavecrm.business@gmail.com`), social platform differs entirely (Facebook `wavedigitalmedia` vs. Instagram `wave.crm`), and declared city differs (Curitiba vs. Campos dos Goytacazes). **Every single NAP element changes between the live site and the redesign.** If any directory, backlink, or GBP listing currently points to the live-site NAP, launching the redesign as-is will create a full NAP discontinuity, not just a partial inconsistency — this is the highest-risk pattern for local ranking loss/confusion.

**[HIGH]** No `streetAddress` or `postalCode` in either version's structured data (live has none at all; redesign has city/state only). At minimum the redesign should include a real street address or, if deliberately not disclosing a physical location (pure SAB), should omit `address` city/region from `LocalBusiness` and instead lean on `areaServed` only — mixing a partial PostalAddress with no street creates a "fake/incomplete" LocalBusiness schema pattern that Google's structured-data guidelines flag as insufficient.

**[MEDIUM]** Business email domain mismatch: using `@gmail.com` instead of `@wavedigital.com.br` (or a Campos-specific domain) in the schema/contact reduces perceived legitimacy and is inconsistent with having a fully custom domain and branded site.

---

## 4. Google Business Profile (GBP) Signals Detectable From the Page

| Signal | Live site | Redesign |
|---|---|---|
| Embedded Google Map / iframe | **Not found** | **Not found** |
| "Get Directions" link | **Not found** | **Not found** |
| GBP / Maps place link or CID reference | **Not found** | **Not found** |
| Review widget / embedded GBP reviews | **Not found** | **Not found** |
| Google Posts indicators | **Not found** | **Not found** |
| Photo evidence tied to a specific premises | **Not found** (only stock-style imagery/badges) | **Not found** |
| Click-to-call | Yes (`tel:` link, malformatted) | Yes, via WhatsApp deep links (`wa.me/...`), not a `tel:` link |
| Social profile link(s) | Facebook (`wavedigitalmedia`) | Instagram (`wave.crm`) |

**[HIGH]** Neither version of the site embeds a Google Map, links to a Google Maps/Business Profile listing, or shows any other on-page evidence of an active, claimed GBP. Combined with the area-code/city conflict in Section 1, this strongly suggests either no GBP currently exists for this entity, or an existing GBP (likely under the Curitiba identity/old Facebook page) is not being referenced or reconciled by the redesign at all. Per Whitespark 2026, primary GBP category correctness is the #1 local ranking factor — none of that can be assessed without confirming whether a profile exists and what category/NAP it currently uses. This must be resolved as part of (not after) the redesign launch plan.

**[MEDIUM]** Redesign relies entirely on WhatsApp (`wa.me`) links for contact rather than a standard `tel:` click-to-call link. WhatsApp-first contact is common and effective in the Brazilian market, but it should be paired with — not replace — a standard `tel:` link and a visible phone number in plain text, both for accessibility/crawlability and because GBP-driven calls typically dial the number directly rather than opening WhatsApp.

---

## 5. Reviews & Reputation Signals

**[HIGH]** No testimonials, review widgets, star ratings, `aggregateRating`/`review` schema, or any third-party review embeds were found on either the live site or the redesign. The redesign's "Cases de Sucesso" section shows client logos and prose case summaries (e.g., Virtua Corretora de Seguros, Nação Basquete de Rua) — this is useful social proof but is not equivalent to a review/rating signal and carries no structured markup.

- Review velocity, average rating, response rate, and date of most recent review **cannot be assessed at all** from the page — this requires direct GBP/Yelp-equivalent data (see Limitations).
- Given the "18-day rule" (Sterling Sky) — rankings can fall off a cliff after 3 weeks without a new review — this is a high-priority blind spot to fill via direct GBP inspection before/at launch.

**Recommendation:** Add at least 3-5 short client testimonials with `Review` schema nested under whatever LocalBusiness/ProfessionalService type is chosen, and pursue an active post-launch review-generation cadence tied to the actual GBP listing.

---

## 6. Local Schema Markup Validation

### Live site
**[CRITICAL]** No `LocalBusiness` (or any local/organization) schema of any kind is present on the live homepage. No `application/ld+json` block exists at all. This is a complete absence, not a partial implementation.

### Redesign
A `LocalBusiness` block exists. Validation against required/recommended properties:

| Property | Status | Note |
|---|---|---|
| `name` | Present | "WAVE Digital" |
| `address` (required) | **Partial** | Has `addressLocality`, `addressRegion`, `addressCountry` — missing `streetAddress` and `postalCode`. Borderline-valid for a SAB that doesn't disclose a precise address, but mixing `PostalAddress` with missing street is not best practice. |
| `geo` (recommended, 5-decimal precision) | **Absent from schema** — coordinates exist only as page `<meta>` tags (`geo.position`, `ICBM`), **not** as a `GeoCoordinates` object inside the JSON-LD. Should be added directly to schema. The meta-tag coordinates (`-21.7549, -41.3247`) only carry 4 decimal places, short of the recommended 5 (~11m vs ~1.1m precision). |
| `openingHoursSpecification` (recommended) | **Absent** |
| `telephone` (recommended) | Present, but flagged for area-code/city mismatch (Section 1) |
| `url` (recommended) | Present (`https://www.wavedigital.com.br`) — note: this is the `www` form; confirm it matches the actual canonical (live site's `<link rel="canonical">` uses the non-`www` form `https://wavedigital.com.br/`) — **[MEDIUM]** potential canonical/WWW mismatch between schema `url` and the rest of the site's canonical tags if not resolved before launch. |
| `priceRange` | Absent |
| `image` | Absent from schema (logo only referenced via `og:image`, not inside LocalBusiness) |
| `aggregateRating` / `review` | Absent (matches Section 5 finding — no reviews exist to mark up yet) |
| `areaServed` | Present — good SAB practice (`Campos dos Goytacazes`, `Macaé`, `São João da Barra`, `Rio de Janeiro` state) but **not** decorated with `sameAs` links to Wikipedia/Wikidata entries as recommended for SABs |
| `hasOfferCatalog` | Present — lists 5 services (CRM, automations, custom systems, websites, landing pages) — good entity-understanding signal |
| `sameAs` | Present but contains only Instagram; should also include Facebook, LinkedIn, GBP URL, and (if reconciled) the legacy `wavedigitalmedia` Facebook page or its replacement |

**[HIGH] Wrong/generic schema subtype.** `LocalBusiness` is the generic fallback type. Per the local-schema-types reference, a digital agency offering CRM/automation/web development is best modeled as `ProfessionalService` (or, if leaning fully into "no physical storefront, comes to client digitally," `LocalBusiness` + strong `areaServed` is acceptable, but `ProfessionalService` is the more specific, Google-recognized parent type for B2B service firms and should be preferred over the bare generic type). This is not one of the named verticals in the reference doc (restaurant/healthcare/legal/home-services/real-estate/automotive), so there is no single "correct" subtype mandate, but using the most specific applicable type is still the documented best practice. Recommend `ProfessionalService` (or a custom-but-valid combination of `ProfessionalService` + `additionalType` referencing a more specific marketing-agency entity if one is later defined on Schema.org/Wikidata).

---

## 7. Local On-Page SEO (Industry-Specific: B2B Agency / Local Service)

- **[HIGH]** No dedicated service pages detected in the redesign's single-page (`index.html`) structure — all services (CRM, automação, sistemas, sites, landing pages) are presented as sections within one long homepage rather than as individual indexable URLs. Per the brief's "Critical Ranking Factors" reference, dedicated service pages are the **#1 local organic ranking factor and #2 AI-visibility factor**. Converting each "Solução" into its own page (e.g., `/crm`, `/automacoes`, `/sites`) with unique, expanded content would materially improve both classic local rankings and AI-overview/answer-engine visibility.
- **[MEDIUM]** Geographic keyword usage in the redesign is strong and consistent in title, meta description, H1/H2 copy, and FAQ ("Vocês atendem presencialmente em Campos dos Goytacazes?") — this is good practice for a SAB *once the underlying NAP conflict in Section 1 is resolved*. Right now this strength is undermined by the phone-number inconsistency.
- **[LOW]** The live site's local signal is comparatively much weaker — Curitiba is mentioned exactly once, in a single paragraph, with no repetition in title, meta description (none exists at all), or headings.
- **[HIGH]** Live site has **no `<meta name="description">` tag at all** in the HTML head — a basic on-page SEO gap independent of the local-specific findings, but compounding the lack of any geo-signal in metadata.
- **[MEDIUM]** Neither site lists service-area cities individually as visible on-page text outside of the redesign's "Para quem" section — the redesign at least names Campos dos Goytacazes, Macaé, and São João da Barra in both schema and body copy, which is good; the live site names no cities anywhere outside the single Curitiba mention.

---

## 8. Citation Presence (Tier 1 Directories)

**[LOW — Limitation, not a finding]** Live `site:`-style search queries and direct API checks against Yelp/BBB/Brazilian-equivalent directories (e.g., Reclame Aqui, Guia Mais) could not be executed in this environment (no search engine or directory API access available). What could be checked directly:

- `facebook.com/wavedigitalmedia` (linked from the live site) returns as a real, reachable handle reference on-page; could not verify its current content/activity status from this audit (no Facebook scraping performed).
- `instagram.com/wave.crm` (linked from the redesign) — same limitation, link present but content/activity not verified.
- No Yelp, Google Maps place page, BBB, Reclame Aqui, or other directory links/badges were found embedded on either version of the site.

**Recommendation:** Manually verify, via direct browser/logged-in search, whether "Wave Digital" + Curitiba and "Wave Digital"/"WAVE Digital" + Campos dos Goytacazes return separate or conflicting GBP/Maps/Facebook/directory entries. This is the single most important follow-up action and cannot be substituted by this page-level audit.

---

## 9. Technical Findings That Affect Local Trust Signals

**[CRITICAL — discovered during fetch, not directly "local SEO" but materially affects trust/EEAT and crawlability]**
- The live site's SSL certificate is a generic shared-hosting wildcard cert (`CN=*.websiteseguro.com`, issued by GlobalSign, valid through Oct 2026) that **does not match the `wavedigital.com.br` hostname**. Browsers will show a certificate-mismatch warning to visitors landing directly on `https://wavedigital.com.br/`. This is a severe trust/conversion issue independent of local SEO scoring, but it directly undermines any local trust/NAP-verification efforts since a security-warning page erodes user and crawler confidence simultaneously.
- `robots.txt` on the live domain does not return a valid robots file — it returns the hosting provider's (Locaweb) generic 404/error page ("Hospedagem Locaweb"), and `/sitemap.xml` returns HTTP 404. This indicates either DNS/hosting misconfiguration or that the domain is not fully under active technical management.
- Response headers show `X-Powered-By: PHP/5.3.29` (end-of-life since 2015) and `<meta name="generator" content="WordPress 4.0.38" />` (WordPress 4.0, released 2014, over a decade out of date and well past security support). This is a clear abandonment/neglect signal for the live site and reinforces the likelihood that it is a legacy build not actively maintained — consistent with the "abandoned former business" hypothesis in Section 1.

These findings should be communicated to whoever owns the hosting/DNS for `wavedigital.com.br`, since none of the redesign's local SEO improvements can take effect safely until the certificate and hosting issues are also resolved at cutover.

---

## Local SEO Score

Scoring the **redesign** (since that's the asset intended to launch); live-site score shown for contrast.

| Dimension | Weight | Redesign Score | Live Site Score | Notes |
|---|---|---|---|---|
| GBP Signals | 25% | 5 / 100 | 0 / 100 | No map embed, no GBP link/reference, no verifiable claimed listing on either |
| Reviews & Reputation | 20% | 10 / 100 | 0 / 100 | Redesign has case studies but no reviews/ratings/schema; live has nothing |
| Local On-Page SEO | 20% | 55 / 100 | 5 / 100 | Redesign has strong geo-keyword usage and area-served copy but no dedicated service pages; live has almost no local signal and no meta description |
| NAP Consistency & Citations | 15% | 10 / 100 | 15 / 100 | Both penalized hard; redesign's internal phone/city mismatch and total NAP divergence from live site is the dominant negative factor |
| Local Schema Markup | 10% | 45 / 100 | 0 / 100 | Redesign has a real but incomplete `LocalBusiness` block; live has none at all |
| Local Link & Authority Signals | 10% | 20 / 100 | 10 / 100 | Redesign has outbound case-study links (modest authority signal); live has only a Facebook link of unknown activity status |

**Weighted Local SEO Score — Redesign: ~24 / 100**
**Weighted Local SEO Score — Live site: ~4 / 100**

Both scores are low in absolute terms, which is expected and acceptable pre-launch — the redesign shows clear directional improvement in on-page and schema fundamentals, but is currently capped by the unresolved NAP/area-code conflict and the complete absence of verifiable GBP signals, which together account for 40% of the scoring weight.

---

## Top 10 Prioritized Actions

1. **[CRITICAL]** Resolve the area-code/city identity conflict before launch: confirm whether Wave Digital is relocating, rebranding, or replacing an unrelated legacy business at this domain, and choose one canonical city + locally-correct phone number (or clearly justified national/mobile number) reflected identically across site copy, schema, and any GBP listing.
2. **[CRITICAL]** Locate and audit any existing Google Business Profile tied to this domain/phone/Facebook handle before launch; claim, update, or formally close/merge it so the new site does not orphan or conflict with a live GBP listing.
3. **[CRITICAL]** Add a complete `LocalBusiness`/`ProfessionalService` JSON-LD block with `streetAddress`/`postalCode` (or a deliberate, documented SAB-only `areaServed` pattern if no public address will be disclosed), a `GeoCoordinates` object at 5-decimal precision, and `telephone`/`url` matching the finalized NAP from Action #1.
4. **[HIGH]** Fix the SSL certificate mismatch on the live domain (currently presents `*.websiteseguro.com`, not `wavedigital.com.br`) before or simultaneously with redesign cutover — this is actively showing browser security warnings to current visitors.
5. **[HIGH]** Reconcile all NAP elements (name casing, phone, email domain, social platform) between whatever is decided as canonical and every external citation/listing (Facebook `wavedigitalmedia`, any directories, any backlinks) — do not let the new Instagram-only social profile silently replace an active Facebook presence without a redirect/cross-link strategy.
6. **[HIGH]** Replace the placeholder Gmail address (`wavecrm.business@gmail.com`) in schema/contact with a domain-matching business email (e.g., `contato@wavedigital.com.br` or a Campos-specific equivalent) for credibility and consistency.
7. **[HIGH]** Convert the five "Soluções" sections into dedicated, individually indexable service pages (CRM, automações, sistemas, sites, landing pages) — this is the #1 local-organic and #2 AI-visibility ranking factor per current research and is currently entirely missing.
8. **[HIGH]** Add an embedded Google Map and a direct "ver no Google Maps"/GBP link once the canonical address/listing is finalized, plus add a standard `tel:` click-to-call link alongside the WhatsApp deep links.
9. **[MEDIUM]** Add `aggregateRating`/`review` schema and visible testimonials with star ratings once at least a handful of genuine reviews exist on the finalized GBP; establish a recurring review-request cadence to avoid the 18-day "no new reviews" ranking cliff post-launch.
10. **[MEDIUM]** Resolve the `www` vs. non-`www` and canonical URL inconsistency between the redesign's schema `url` (`https://www.wavedigital.com.br`) and the live site's canonical tag (`https://wavedigital.com.br/`), and add a proper `<meta name="description">` (missing entirely on the live site) as a baseline on-page fix independent of the local-specific items above.

---

## Limitations Disclaimer

- This audit was performed by fetching the live homepage HTML directly (via `curl`, SSL verification disabled due to the certificate mismatch noted above) and by reading the unreleased redesign's source files from the local repository. No JavaScript-rendered content beyond what ships in static HTML was evaluated, as Playwright-based rendering failed at the SSL-handshake stage on the live site (certificate hostname mismatch) before any page content could load; the static HTML retrieved via `curl` is what was analyzed instead and matches what a real browser/crawler would receive once past (or bypassing) the certificate warning.
- No DataForSEO or other paid/live-data MCP tools were available in this environment, so the following could **not** be directly verified and remain open items: actual GBP existence, claim status, primary/secondary category, current review count/rating/velocity, local pack rankings/positions, and live citation presence/accuracy on Yelp, BBB, Reclame Aqui, Google Maps, or other directories.
- Proximity (55.2% of ranking-variance per the Search Atlas ML study cited in the brief) is outside the control of any on-page or schema fix and is not assessed here.
- Facebook (`facebook.com/wavedigitalmedia`) and Instagram (`instagram.com/wave.crm`) account activity, follower counts, and content recency were not independently verified — only their presence as outbound links was confirmed.
- Scoring above is a structured estimate based on detectable on-page/schema signals only, consistent with the dimension weights in the audit framework; it is not a substitute for live GBP/citation data once available.

---

## Files Referenced

- Live homepage HTML (fetched, SSL-bypassed): `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/live_homepage.html`
- Redesign source (not yet deployed): `/Users/moisesrangel/Documents/wave crm/index.html`
- Local schema reference used for validation: `/Users/moisesrangel/.claude/skills/seo/references/local-schema-types.md`
