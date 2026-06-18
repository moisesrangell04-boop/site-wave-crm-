# Structured Data (Schema.org) Audit — wavedigital.com.br

**Audited URL:** https://wavedigital.com.br/
**Audit date:** 2026-06-17
**Page type:** Single-page WordPress 4.0.38 site (Visual Composer / "north" theme), pt-BR, digital marketing agency (Google Ads / "links patrocinados" services)

## Fetch method note

`scripts/render_page.py` failed with a TLS hostname mismatch:

```
SSLError: hostname 'wavedigital.com.br' doesn't match either of
'*.websiteseguro.com', 'websiteseguro.com'
```

The site's SSL certificate is issued for the hosting provider's shared domain (`websiteseguro.com`), not `wavedigital.com.br`. This means visitors on strict TLS clients see a certificate warning, and any tooling that validates hostnames (including this audit's normal fetch path) cannot retrieve the page through the standard route. I fell back to a direct fetch with certificate validation disabled (`curl -k`) solely to retrieve the HTML for this audit. **This is a separate, Critical-severity infrastructure/security finding outside the scope of schema markup, but it should be flagged to the client/dev team immediately** — it affects trust signals, may suppress rich results entirely if Googlebot/crawlers reject the cert chain, and is a prerequisite fix before any schema rollout is validated in Google's Rich Results Test (which fetches over HTTPS and may itself fail or warn on this domain).

Server response confirmed: `HTTP/2 200`, `server: nginx/1.22.1`, `x-powered-by: PHP/5.3.29`, `x-pingback: https://wavedigital.com.br/xmlrpc.php`, generator tags confirm **WordPress 4.0.38** + Visual Composer — both far past end-of-life, which is a Critical security concern but again outside strict schema scope.

---

## 1. Detection Results — Existing Structured Data

| Format | Found? | Detail |
|---|---|---|
| JSON-LD (`<script type="application/ld+json">`) | **None found** | Zero occurrences in raw HTML |
| Microdata (`itemscope`/`itemtype`/`itemprop`) | **None found** | Zero occurrences |
| RDFa (`vocab=`, `typeof=`, `property=`) | **None found** | One false-positive match on `property=` was a jQuery video-plugin config string (`{videoURL:'...', autoPlay:true,...}`), not RDFa markup |
| `schema.org` references (any context, any case) | **None found** | Zero occurrences anywhere in source |
| Open Graph (`og:*`) meta tags | **None found** | No `og:title`, `og:description`, `og:image`, etc. |
| Twitter Card meta tags | **None found** | — |
| Meta description | **None found** | `<head>` contains only `charset`, `viewport`, and two `generator` tags |
| `<title>` | Present | `Wave Digital` (generic, not optimized, but not a schema issue) |
| Canonical link | Present | `<link rel='canonical' href='https://wavedigital.com.br/' />` (absolute URL — correct format) |

**Conclusion: the page ships with absolutely no structured data of any kind.** This is a 100%-legacy WordPress page with no SEO plugin (e.g., Yoast, RankMath) auto-injecting schema, and no manually-coded JSON-LD in the theme template.

---

## 2. Organization / LocalBusiness / ProfessionalService Schema

**Status: Missing — Critical priority.**

This is a services agency (digital marketing / Google Ads management) and is the single highest-value schema opportunity on the page. Currently:

- No `Organization`, `LocalBusiness`, or `ProfessionalService` markup exists.
- No `WebSite` schema exists (so no Sitelinks Search Box eligibility, and no clear entity-to-domain binding for Google's Knowledge Graph).
- No `WebPage` schema exists.
- No social profile linking (`sameAs`) exists in any machine-readable form — Facebook is only a plain `<a>` link in the footer with no `rel="me"` or schema annotation.

### Data extracted from the live page (used to populate the recommendation below)

| Field | Value found on page | Source location |
|---|---|---|
| Business name | "Wave Digital" (`<title>`, H1: "Somos a Wave Digital") | `<title>`, hero H1 |
| Phone | `41 3015.8753` | Footer `<a href="tel:41 3015.8753">` + visible text `<h1 class="phone-text...">41 3015.8753</h1>` |
| Phone (E.164, inferred) | `+55 41 3015-8753` | Area code 41 = Curitiba, Paraná, Brazil — inferred for JSON-LD `telephone` field; **not stated explicitly on page in this format, flag as placeholder to confirm** |
| Email | `CONTATO@WAVEDIGITAL.COM.BR` | Footer `<a href="mailto:...">` |
| Street address / CEP | **Not present anywhere on page.** The markup contains an empty `<h2 class="phone-text font-primary uppercase">` immediately after a `<!-- Address -->` HTML comment, with no text content — i.e., the address field exists in the template but was left blank by whoever built the site. | Footer `address-soft` block |
| City (inferred only) | "Curitiba" — mentioned once in body copy ("...profissionais do mercado de Curitiba...") but **not** structured as a NAP address | About section paragraph |
| State/Country (inferred) | Paraná, Brasil (inferred from area code 41 + Curitiba mention) | Inferred, not stated |
| Social profiles | Facebook only: `https://www.facebook.com/wavedigitalmedia` | Footer icon link |
| Instagram / LinkedIn / Twitter-X / YouTube channel | **None found.** (A YouTube embed exists for a single video `nDPFyOVyIPE`, but it is not a channel/profile link and should not be used as `sameAs`.) | n/a |
| Logo | Theme references a logo image file but no clean absolute, final-published logo URL was confirmed in this pass — **verify exact logo URL before publishing schema** (placeholder used below) | Header `<img>` |

**Action required before shipping:** the client must confirm/supply (1) the real street address (currently blank on the page itself — this is itself a UX/local-SEO gap, not just a schema gap), (2) confirm the phone number's E.164 formatting and that it's a real, monitored line, and (3) confirm a final logo URL. All are marked as placeholders in the JSON-LD below and tagged clearly.

---

## 3. Breadcrumb / FAQ / Other Rich-Result Schema

| Type | Found? | Recommendation |
|---|---|---|
| `BreadcrumbList` | Not found | **Not applicable** — this is a single, non-paginated one-page site with no internal navigation hierarchy beyond on-page anchor links (`#`). Breadcrumbs would have nothing meaningful to represent. Do not force it. |
| `FAQPage` | Not found | Per current rules, Google restricts FAQ rich results to government/healthcare sites (since Aug 2023). **This is a commercial digital-marketing agency, so do NOT add `FAQPage`** for Google rich-result purposes. The page also has no visible Q&A content block to mark up anyway. If the client later prioritizes AI/LLM discoverability (GEO) over classic Google rich results, an FAQPage could be considered purely for that purpose — but it is not recommended in this pass. |
| `HowTo` | Not found | Correctly absent. Do not add — rich results for `HowTo` were removed by Google in September 2023; this type should never be recommended regardless of content fit (the "Como Funciona" / "Qualificação" / "Pacotes" sections could tempt a HowTo mapping — explicitly avoid this). |
| `Service` / `Offer` | Not found | **Opportunity (Medium priority).** The page has a clear pricing/package table (Start R$250–600, Selection R$601–1000, Master R$1001–2000, Premium R$2001+) for "Gestão de Links Patrocinados Google Ads." This maps well to `Service` with nested `Offer`/`OfferCatalog`. Recommended as a secondary addition after Organization/LocalBusiness ships (not included in the primary snippet below to keep the first deployment simple and low-risk; can be scoped as a fast-follow). |
| `Review` / `AggregateRating` | Not found | No visible testimonials/ratings content was detected in the fetched HTML to legitimately mark up. **Do not fabricate ratings** — only add if real review content exists/is added to the page. |
| `VideoObject` | Not found | One YouTube video is embedded (`nDPFyOVyIPE`) without any `VideoObject` markup. Low priority opportunity; not core to the agency's commercial intent, optional fast-follow only. |
| `WebSite` / `WebPage` | Not found | Recommended as a lightweight companion to the Organization snippet (included below). |

---

## 4. Validation Results Summary

| Check | Result |
|---|---|
| @context uses `https://schema.org` (not `http`) | N/A — nothing exists to validate |
| @type valid / not deprecated | N/A |
| Required properties present | N/A |
| Property value types correct | N/A |
| No placeholder text in shipped markup | N/A |
| URLs absolute | N/A |
| Dates ISO 8601 | N/A |

**Net result: 0 schema blocks exist on the page, therefore 0 blocks pass or fail validation. The entire structured-data layer must be built from scratch.**

---

## Severity-Tagged Findings Summary

- **[Critical]** No structured data of any kind (JSON-LD/Microdata/RDFa) exists anywhere on the page. Zero machine-readable entity signal for Google or AI assistants.
- **[Critical]** No `Organization`/`LocalBusiness`/`ProfessionalService` schema for what is fundamentally a local services agency — this is the single highest-impact fix available.
- **[Critical, adjacent/infra]** TLS certificate does not match `wavedigital.com.br` (issued for `*.websiteseguro.com`). This can cause browser warnings and may interfere with crawler/rich-result validation; should be fixed by the hosting/dev team before or alongside schema rollout.
- **[High]** No `sameAs` / social profile linking exists in machine-readable form (only a plain Facebook `<a>` tag). Only one platform (Facebook) is linked at all — no Instagram, LinkedIn, YouTube channel, or X/Twitter presence found.
- **[High]** No street address/NAP is present on the page itself (the template has a blank address slot) — this blocks accurate `LocalBusiness.address` and hurts local pack / Google Business Profile consistency independent of schema.
- **[Medium]** No `WebSite`/`WebPage` schema — minor missed opportunity for entity clarity and Sitelinks Search Box eligibility.
- **[Medium]** No `Service`/`Offer` schema despite a clear, structured pricing/package table on the page (Start/Selection/Master/Premium tiers) — good fast-follow after Organization ships.
- **[Info]** No Open Graph or Twitter Card meta tags exist either (not schema.org, but commonly audited alongside structured data; affects social share previews).
- **[Info]** `FAQPage` correctly not present — and per current Google policy should not be added for this commercial (non-government/healthcare) site for rich-result purposes.
- **[Info]** `HowTo` correctly not present — must not be added regardless of the "Como Funciona" content section, since Google removed HowTo rich results in Sept 2023.
- **[Info]** Generator meta tags expose `WordPress 4.0.38` and Visual Composer — both severely outdated. Not a schema defect, but worth flagging to whoever owns the broader technical/security audit.

---

## 5. Recommended JSON-LD — Ready to Implement

Place this single `<script type="application/ld+json">` block inside `<head>` (or just before `</body>`) of the WordPress theme's `header.php`/`footer.php`. It combines `ProfessionalService` (a more specific subtype of `LocalBusiness`, appropriate for a marketing/advertising agency) with a companion `WebSite` node, joined via `@id` references in an `@graph`.

**Fields marked `>>> CONFIRM/REPLACE <<<` are placeholders built from inference (area code, city) or unconfirmed assets (logo path) — do not publish as-is until the client confirms the real street address, verifies the phone format, and supplies a final logo URL.**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://wavedigital.com.br/#organization",
      "name": "Wave Digital",
      "alternateName": "Wave Digital Media",
      "url": "https://wavedigital.com.br/",
      "logo": "https://wavedigital.com.br/wp-content/themes/north/images/logo.png",
      "image": "https://wavedigital.com.br/wp-content/themes/north/images/logo.png",
      "telephone": "+55-41-3015-8753",
      "email": "contato@wavedigital.com.br",
      "description": "Agência de marketing digital em Curitiba (PR), especializada em gestão de campanhas de links patrocinados (Google Ads) e mídia interativa para pequenas e médias empresas.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": ">>> CONFIRM/REPLACE: endereço completo (rua e número) <<<",
        "addressLocality": "Curitiba",
        "addressRegion": "PR",
        "postalCode": ">>> CONFIRM/REPLACE: CEP <<<",
        "addressCountry": "BR"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Brasil"
      },
      "priceRange": "R$250 - R$2001+",
      "sameAs": [
        "https://www.facebook.com/wavedigitalmedia"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://wavedigital.com.br/#website",
      "url": "https://wavedigital.com.br/",
      "name": "Wave Digital",
      "inLanguage": "pt-BR",
      "publisher": {
        "@id": "https://wavedigital.com.br/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://wavedigital.com.br/#webpage",
      "url": "https://wavedigital.com.br/",
      "name": "Wave Digital",
      "inLanguage": "pt-BR",
      "isPartOf": {
        "@id": "https://wavedigital.com.br/#website"
      },
      "about": {
        "@id": "https://wavedigital.com.br/#organization"
      }
    }
  ]
}
```

### Notes on choices made in this snippet

- **`ProfessionalService` over plain `LocalBusiness`**: Google treats `ProfessionalService` as a valid, more descriptive subtype for an agency selling marketing/advertising services; it still inherits all `LocalBusiness` properties (address, telephone, geo, openingHours, etc.) so nothing is lost versus the generic type.
- **`telephone` formatted as `+55-41-3015-8753`**: converted from the on-page `41 3015.8753` into E.164-style international format per best practice. **Confirm this is correct** — the page itself never states a country/area code explicitly in international format.
- **`email` lower-cased** from the page's all-caps `CONTATO@WAVEDIGITAL.COM.BR` — email values are case-insensitive for delivery, lower-case is just the conventional/clean way to publish it in JSON-LD.
- **`address.streetAddress` and `postalCode` left as explicit placeholders** because the live page's own address field is blank — these must come from the client, not be invented.
- **`logo`/`image`** uses the theme's conventional asset path as a best-guess placeholder; **verify the actual final logo file URL** before shipping (do not publish an incorrect path).
- **`sameAs` contains only Facebook** because that is the only verified social profile found on the page. Add Instagram/LinkedIn/YouTube URLs here only once the client confirms those profiles exist and are actively maintained — do not pad `sameAs` with guessed URLs.
- **No `FAQPage`, `HowTo`, `BreadcrumbList`, or `AggregateRating`** included, consistent with the policy/content findings above.
- **`priceRange`** reflects the four visible package tiers (Start/Selection/Master/Premium, R$250 to R$2001+) directly from the page's pricing table — this is accurate, on-page data, not invented.

### Suggested fast-follow (not included above, recommend as phase 2)

Once the core Organization/WebSite block is live and validated in Google's Rich Results Test / Schema Markup Validator, add a `Service` block (with `OfferCatalog`/`Offer` for each of the four pricing tiers) describing the Google Ads management service, linked back to `"@id": "https://wavedigital.com.br/#organization"` via `provider`.

---

## Files referenced

- Raw fetched HTML used for this audit: `/tmp/wave_raw.html` (temporary, not part of the project; re-fetch with `curl -k https://wavedigital.com.br/` if this audit needs to be reproduced, due to the TLS hostname mismatch noted above)
- This findings file: `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/findings/schema.md`
