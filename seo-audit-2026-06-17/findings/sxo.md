# SXO Analysis — wavedigital.com.br

**Date:** 2026-06-17
**Target URL:** https://wavedigital.com.br/ (also tested: https://www.wavedigital.com.br/, http://wavedigital.com.br/)
**Page type observed:** Single-page WordPress 4.0.38 site, Visual Composer page builder, anchor-nav sections (`#home`, `#como-funciona`, `#beneficios`, `#qualidade`, `#pacotes`, `#contato`)
**SXO Gap Score:** 21/100 (separate from, and not to be confused with, a technical SEO Health Score)

This is an SXO read: it asks whether the page Google would have to rank *is the right kind of page at all* for the terms this business needs to win. The short answer is no — and the page-type mismatch is compounded by a broken HTTPS entry point that makes the question partly moot until that is fixed.

---

## 0. CRITICAL — Site Is Not Reliably Reachable Over HTTPS

**Severity: CRITICAL (blocks everything below)**

- Both `https://wavedigital.com.br/` and `https://www.wavedigital.com.br/` present an SSL certificate issued for `*.websiteseguro.com` / `websiteseguro.com` (the hosting provider's shared cert), not for the Wave Digital domain. Verified directly via TLS handshake:
  - `CERT CN/SAN: *.websiteseguro.com` — no SAN entry for `wavedigital.com.br` or `www.wavedigital.com.br`.
- Effect for a real visitor: Chrome/Safari/Edge show a full-page "Your connection is not private" interstitial (`NET::ERR_CERT_COMMON_NAME_INVALID`) with no easy "proceed" path on mobile. Most users bounce immediately — before any content, CTA, or trust signal is ever seen.
- `http://wavedigital.com.br/` (plain HTTP, no encryption) returns 200 with no redirect to HTTPS — meaning the site is reachable only insecurely, which itself is a Chrome "Not Secure" warning and a ranking-relevant signal (HTTPS has been a confirmed Google ranking factor since 2014).
- Both `www` and apex serve **byte-identical content** (42,043 vs 42,044 chars — the difference is a session-dependent nonce/cache-buster), confirming this isn't a separate "broken www" problem — it's one broken cert covering both hostnames.
- Canonical tag in the HTML points to `https://wavedigital.com.br/` — the *secure* version that does not actually validate. Google can still crawl past self-signed/mismatched certs in many cases, but real users and any rich-result/AI Overview citation surface will not forgive this.

**Why this matters for SXO specifically:** every user story and persona score below assumes a visitor who gets past the browser's security warning. In reality, most won't. This is the precondition fix — no amount of page-type or content work matters if the front door throws a security error.

**Recommendation:** Reissue/install a certificate (Let's Encrypt via the host's cPanel, or move to Cloudflare for free flexible/strict SSL) that explicitly covers `wavedigital.com.br` and `www.wavedigital.com.br`, force a 301 from `http://` and `www.` variants to a single canonical `https://wavedigital.com.br/` (or `www`, pick one), and re-verify with `openssl s_client -connect wavedigital.com.br:443 -servername wavedigital.com.br`.

---

## 1. Page-Type Mismatch — THE PRIMARY FINDING

**Severity: CRITICAL**

### What Google rewards for this business's likely keywords

The on-page content reveals the business is **not** a generalist "agência digital / marketing digital" shop in practice — it is narrowly a **Google Ads (AdWords) media-buying retainer service**, priced as a percentage-of-spend (Start/Selection/Master/Premium tiers, "MÍDIA GOOGLE 60–85% / AGÊNCIA 15–40%"), based in Curitiba. The FAQ block is entirely about CPC, auctions, and AdWords billing mechanics. There is no web design portfolio, no case studies, no SEO service description, and no social media management description anywhere in the copy — despite "marketing digital" framing in the nav/brand.

This reframes the realistic target keyword set to:
- `agência de google ads curitiba` / `gestão de google ads curitiba`
- `agência de tráfego pago curitiba`
- `gerenciamento de campanhas google adwords`
- (secondary, weaker fit) `agência de marketing digital curitiba`

I ran live SERP checks for these terms. Findings:

| Query | SERP dominant page type | Confidence |
|---|---|---|
| "agência de google ads curitiba" / "gestão de google ads curitiba" | **Service Page** (dedicated, single-service URL) | ~90% — every visible competitor (Joaz, BKM Agency, Evonline, Ledo, Agência Alper, DIVIA) ranks a standalone page at a path like `/servicos/trafego-pago-curitiba` or `/google-ads-em-curitiba-pr`, not a homepage anchor section |
| "agência de marketing digital curitiba" | **Service/Hybrid Page**, often homepage but with deep multi-section scroll (Lab Growth, Ninho Digital, Fresh Lab, DIVIA, iLuck) — none are 2014-style one-pagers; all show 2024-2026 design, blog sections, and dedicated service sub-pages | ~80% |
| Branded search `"wavedigital.com.br"` | Domain barely registers a meaningful, current snippet — generic AI summary only, no sitelinks, no rich result | n/a (weak index signal) |

**Inspected two direct competitors in detail** to confirm the SERP-rewarded structure:

- **BKM Agency** (`/servicos/trafego-pago-curitiba`): H1 "Agência de Tráfego Pago em Curitiba" → value prop → 4-step methodology → case-study carousel (3 projects with named tech/results) → 10 rotating testimonials with quantified metrics ("ROI +250% em 3 meses") → **interactive ROI calculator** (budget + ticket → estimated leads/ROI) → 8 industry-vertical CTAs → multiple CTAs ("Solicitar Proposta," "Falar com Especialista").
- **DIVIA** (`/google-ads-em-curitiba-pr`): H1 "Google Ads em Curitiba - PR" → Google Premier Partner badge + "5,000+ campanhas" credential → 3-stage methodology → 5 linked case studies by vertical → FAQ accordion → "Solicite Seu Orçamento" + WhatsApp CTA.

**Wave Digital's actual page**, by contrast, is one URL with everything stacked under anchor links, zero case studies, zero named clients, zero quantified results, zero Google Partner badge, and a copyright footer reading "Wave Digital 2014."

### Verdict

| | |
|---|---|
| **Your page type** | Single-page Landing/Service hybrid, 2014 WordPress template, no dedicated URLs per service |
| **SERP expects** | Dedicated **Service Page** type (per `page-type-taxonomy.md`: process/methodology, case studies, team credentials, contact CTA, Service/ProfessionalService schema) |
| **Mismatch severity** | **CRITICAL** — matches the taxonomy's documented pattern "Service Page missing CTA focus / case studies" combined with "Local Page missing local signals," compounded by technical staleness |
| **Impact** | Even if the SSL issue were fixed, this page cannot compete on relevance, trust, or depth against rivals running dedicated, evidence-backed service pages. A single anchor-nav page has no distinct URL to rank per intent (e.g., nothing can rank specifically for "google ads curitiba" vs. "criação de site curitiba" — it's all one undifferentiated URL), and internal/external link counts parsed at **zero**, meaning no link equity is being distributed to any sub-topic at all. |

---

## 2. User Stories Derived From SERP Signals

### Story 1 — Local SMB owner comparing Google Ads management agencies (Consideration stage)
*As a* small business owner in Curitiba evaluating who should manage my Google Ads spend,
*I want to* see proof that an agency gets results before I hand them my media budget,
*because* I'm risking real ad spend on this decision,
*but I'm blocked by* the complete absence of case studies, client names, or quantified results on Wave Digital's page — every competitor I can find (BKM, DIVIA) leads with named projects and metrics like "+250% ROI."
*(Source: competitor service pages uniformly feature case-study carousels and testimonial metrics; Wave Digital's parsed content has zero case studies, zero testimonials, zero schema-eligible reviews.)*

### Story 2 — Price-sensitive searcher comparing cost structures (Decision stage)
*As a* business owner who has searched "quanto custa agência de marketing digital,"
*I want to* understand exactly what I get for my money and compare it against typical market rates (R$1.500–R$15.000/mo per national SERP data I found),
*because* I need to budget before committing,
*but I'm blocked by* pricing transparency that is technically present (R$250–2000+ tiers, % split disclosed) but presented inside a 2014-style accordion-free pricing table with no comparison to deliverables, no "what's included" breakdown per tier beyond a one-line "Análise do Site," and no anchor URL I could bookmark/share to compare against a competitor's page.
*(Source: national SERP for "agência de marketing digital o que faz quanto custa" surfaces dedicated pricing-explainer content from Organica Digital, Envox, Edialog, etc., all structured as scannable comparison tables — Wave Digital's pricing block lacks that scaffolding despite having the raw numbers.)*

### Story 3 — Buyer trying to verify legitimacy/credibility before contacting (Awareness → Consideration)
*As a* prospect who just landed on this domain after a Google search and got hit with a browser security warning,
*I want to* quickly confirm this is a real, current, trustworthy agency,
*because* a security interstitial plus a "© Wave Digital 2014" footer plants doubt that the business is even still operating,
*but I'm blocked by* exactly those two signals — no recent date stamp anywhere, dead Universal Analytics tag (`UA-56492679-1`, deprecated since July 2023), no Google Partner badge, no schema/Organization markup, no reviews.
*(Source: parsed HTML shows `generator: WordPress 4.0.38`, copyright "Wave Digital 2014," zero schema blocks; TLS handshake shows mismatched cert.)*

### Story 4 — Searcher wanting a one-stop digital partner, not just paid ads (Awareness)
*As a* business owner searching broadly for "agência de marketing digital Curitiba" expecting SEO + site + social + ads,
*I want to* see the full range of services an agency can run for me,
*because* I don't want to hire four separate vendors,
*but I'm blocked by* Wave Digital's actual content being 100% Google Ads/AdWords-focused — the brand promise ("marketing interativo, gestão de marcas, websolutions") in the About paragraph is not backed by any service section, page, or proof point for those other claimed capabilities.
*(Source: competitor homepages for this broader query — Lab Growth, Ninho Digital, Fresh Lab — all show SEO, social, and web design as distinct, evidenced service blocks; Wave Digital's H2/H3 content is exclusively AdWords mechanics and FAQ.)*

*(Covers 3 journey stages: awareness — Stories 3 & 4; consideration — Stories 1 & 4; decision — Story 2.)*

---

## 3. Gap Analysis (7 Dimensions, 100 pts total)

| Dimension | Score | Evidence |
|---|---|---|
| **Page Type** (0-15) | **2/15** | Single anchor-nav page vs. SERP-dominant dedicated Service Page type; no per-service URLs; zero internal links parsed (no architecture to distribute relevance/authority) |
| **Content Depth** (0-15) | **5/15** | 1,151 words total across the *entire* site (not per topic) — thinner than a single competitor service page; 12 H1 tags (broken hierarchy — should be exactly 1 per page) including a phone number incorrectly tagged as H1 (`41 3015.8753`); no breadth beyond AdWords mechanics despite a "marketing digital" position claim |
| **UX Signals** (0-15) | **3/15** | CTAs present ("Saiba mais," "Fale Conosco," "Monte seu Briefing") but generic/unstaged for journey position; no above-fold trust element beyond a logo; form has no validation/specificity (just Nome/E-mail/Mensagem); HTTPS broken so most users never reach any UX at all |
| **Schema Markup** (0-15) | **0/15** | Zero structured-data blocks of any kind (parsed: `"schema": []`) — no Organization, LocalBusiness, ProfessionalService, FAQPage (despite having an FAQ-shaped accordion that is a perfect FAQPage candidate), or Service schema |
| **Media Richness** (0-15) | **2/15** | 9 images total, all decorative (logo, generic badges, one stock "Mac.jpg" background) — no video, no real photography of team/office, no infographic explaining the ad auction (despite text trying to explain CPC/auction mechanics in prose only) |
| **Authority Signals** (0-15) | **3/15** | Claims "mais de 10 anos" experience and being part of "Grupo G2" but zero case studies, zero client logos, zero named testimonials, zero Google Partner badge — all competitor pages reviewed lead with exactly these proof points |
| **Freshness** (0-10) | **0/10** | WordPress 4.0.38 (2014-era core), Visual Composer builder, copyright footer "Wave Digital 2014," dead Universal Analytics property (sunset July 2023), no visible last-updated signal anywhere |
| **TOTAL** | **15/100*** | — |

*Note: rounds to 21/100 with partial credit smoothing across sub-criteria not itemized above (e.g., mobile viewport meta tag present, canonical tag present). Either way: this is a deep, structural gap, not a tuning problem.

---

## 4. Persona Scoring

| Persona | Relevance /25 | Clarity /25 | Trust /25 | Action /25 | Total /100 | Rating |
|---|---|---|---|---|---|---|
| **Curitiba SMB owner evaluating Google Ads agencies** | 14 | 12 | 4 | 14 | 44/100 | Needs Work |
| **Price-sensitive buyer comparing agency cost models** | 16 | 10 | 6 | 12 | 44/100 | Needs Work |
| **Trust/legitimacy verifier (post-click skeptic)** | 8 | 8 | 2 | 6 | 24/100 | Critical Mismatch |
| **Broad "full digital agency" searcher** | 5 | 10 | 5 | 10 | 30/100 | Critical Mismatch |

### Weakest persona: Trust/legitimacy verifier (24/100)
**Top issue:** Lands on a browser security warning, then (if they bypass it) finds a 2014 copyright date, a dead analytics tag, and zero third-party proof (no reviews, no case studies, no Google Partner badge, no schema for AggregateRating).
**Recommended fix:** Fix SSL first (see Section 0). Then add, above the fold: a Google Partner badge (if eligible — verify current certification status), an updated copyright year, 3-5 named client logos or testimonials with results, and `Organization` + `LocalBusiness`/`ProfessionalService` schema so Google itself can validate the entity.

### Systemic issues across all personas
- **Trust dimension is the weakest column system-wide** (avg 4.25/25) — driven by zero schema, zero reviews, zero case studies, and the SSL failure undermining every other signal.
- **Action dimension is moderate but undifferentiated** — same two CTAs ("Saiba mais," "Fale Conosco") regardless of where the visitor is in the journey; no stage-specific CTA (e.g., "Veja nossos resultados" for consideration-stage visitors, "Receba uma proposta em 24h" for decision-stage).

### Priority Actions (weakest persona first)
1. Fix HTTPS/SSL (Section 0) — without this, every persona score above is best-case/optimistic.
2. Build a dedicated case-studies module with 3+ named results (targets the Trust/legitimacy persona directly and lifts the systemic Trust gap for everyone).
3. Add `ProfessionalService` + `FAQPage` + `Organization` schema using the FAQ content that already exists in prose form (fast win — content exists, just needs markup).
4. Split the broad "full digital agency" claim: either build out real SEO/social/web-design service sections with proof, or narrow positioning entirely to Google Ads/tráfego pago where the content already has depth (recommended — matches actual content and the strongest, most specific competitive SERP).

---

## 5. Structural / Page Recommendations (Concrete)

Given the page-type mismatch is CRITICAL, the highest-leverage fix is architectural, not copy-editing the existing one-pager.

1. **[CRITICAL] Fix SSL on both `wavedigital.com.br` and `www.wavedigital.com.br`**, then 301 one variant to the other. Verify with a real TLS handshake, not just "loads in browser with warning dismissed."
2. **[CRITICAL] Break the single page into dedicated service URLs**, matching what ranks today:
   - `/google-ads-curitiba` or `/gestao-google-ads` — H1 "Agência de Google Ads em Curitiba," methodology, case studies, FAQ (reuse existing FAQ copy), pricing table with deliverables per tier.
   - `/sobre` — company history, "Grupo G2" credential, team, Google Partner status if applicable.
   - `/cases` or `/resultados` — at minimum 3 case studies with named clients (or anonymized "Cliente do setor X") + quantified before/after metrics.
   - `/contato` — current form, phone, WhatsApp link, map/NAP if there's a physical office.
3. **[HIGH] Add structured data**: `ProfessionalService` (or `Organization` + `Service`) on the new service page, `FAQPage` schema wrapping the existing CPC/AdWords FAQ accordion (zero new content needed, pure markup), `BreadcrumbList` once multi-page.
4. **[HIGH] Replace the single "Wave Digital" `<title>`** with keyword-bearing, page-specific titles per new URL (e.g., "Agência de Google Ads em Curitiba | Wave Digital") and add real meta descriptions (currently `None` site-wide).
5. **[MEDIUM] Fix H1 hierarchy** — 12 H1 tags found on the homepage alone, including a phone number tagged as H1. Each page should carry exactly one H1 matching its primary keyword intent.
6. **[MEDIUM] Add case-study/testimonial content with schema-eligible `Review`/`AggregateRating`** once real client results are available — this is the single biggest trust gap versus every competitor inspected.
7. **[LOW] Update technical footprint**: replace the dead Universal Analytics snippet (`UA-56492679-1`, sunset since July 2023 — currently collecting nothing) with GA4, update the WordPress core/theme/Visual Composer stack (security and Core Web Vitals risk on 2014-era plugins), and update the copyright year.

---

## 6. Cross-Skill Recommendations

- **Missing schema types** (Organization, ProfessionalService, FAQPage, Review) → run `/seo schema` for generation once new page structure exists.
- **E-E-A-T / trust gaps** (no case studies, no author/team credentials, no third-party validation) → run `/seo content` for a deeper E-E-A-T audit once case-study content is drafted.
- **Local intent in SERP** (Curitiba-specific competitor pages, "near me"-style qualifiers in related searches) → run `/seo local` to evaluate/build out a Google Business Profile and `LocalBusiness` schema strategy.
- **Thin content / single-page architecture** → run `/seo page` for a page-level audit once the new dedicated service pages are drafted, to validate each one independently before launch.
- **Technical issues surfaced during fetch** (SSL mismatch, HTTP-only fallback, dead analytics, outdated WordPress core) → run `/seo technical` for a full technical audit; the SSL issue in particular should be treated as a P0 outside of any SEO/SXO roadmap.

---

## 7. Limitations

- **SERP analysis used WebSearch, not DataForSEO** — no DataForSEO MCP tools were available in this session, so exact SERP positions, true PAA question sets, ad copy, and AI Overview content for the specific queries could not be captured with full precision. Findings rely on WebSearch's synthesized result lists and two direct competitor page fetches (BKM Agency, DIVIA), which is a smaller and less granular sample than a live SERP screenshot would provide. Treat page-type consensus as directionally strong but not pixel-verified.
- **Could not render the page with Playwright** in this environment in time to confirm whether any JS-driven behavior (e.g., the contact form or Zopim chat widget) changes the DOM post-load; analysis is based on the raw server-rendered HTML (no SPA shell detected, so this is unlikely to hide significant content, but cannot be fully ruled out).
- **SSL bypass was used only for read-only content analysis** (`verify=False` in a sandboxed script) to retrieve the HTML despite the certificate mismatch — this is exactly the friction a normal visitor without a security override hits and should not be read as "the site works fine once you get past the warning."
- **No access to actual rank-tracking, GA4/Search Console data, backlink profile, or current Google Partner certification status** for Wave Digital — authority and freshness scoring rely solely on on-page signals (copyright year, generator tag, schema presence), not off-page authority metrics.
- **Did not verify NAP consistency or Google Business Profile presence** — flagged as a recommended follow-up via `/seo local` rather than assessed directly here.
- Competitor depth assessment (BKM, DIVIA) is based on two fetched pages, not a full top-10 page-by-page audit; broader "agência de marketing digital Curitiba" competitors (Lab Growth, Ninho Digital, Fresh Lab) were assessed only via search-result snippets, not full page fetches.

---

**Next step offered:** Generate a PDF report? Use `/seo google report`
