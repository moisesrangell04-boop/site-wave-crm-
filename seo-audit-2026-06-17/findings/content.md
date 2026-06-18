# Content Quality / E-E-A-T Audit — wavedigital.com.br

**Audited URL:** https://wavedigital.com.br/
**Audit date:** 2026-06-17
**Method:** Direct HTTP fetch of raw HTML + manual extraction of visible text (Playwright render not required — page is static server-rendered WordPress; no SPA shell detected). Page metadata: `WordPress 4.0.38`, theme `north`, page builder `Visual Composer 4.3.4`, page template `template-onepager.php`, `X-Powered-By: PHP/5.3.29`, server `nginx/1.22.1` behind Locaweb hosting.

This is a **single page** (`page_id=978`) with in-page anchors (`#home`, `#como-funciona`, `#beneficios`, `#qualidade`, `#pacotes`, `#contato`). There is no blog, no service subpages, no about page, no case studies page. All other top-level paths (`/sobre`, `/blog`, `/servicos`, `/feed/`) return Locaweb's generic hosting-provider 404 page, not even a custom WordPress 404 — confirming these sections of the site do not exist and never resolved as WordPress routes.

---

## Overall Content Quality Score: 22 / 100

This page reads as a 2014-era WordPress landing page for a single product (Google AdWords/links patrocinados management) that has not been substantively updated since launch, frozen in time with broken/dead conversion paths and effectively zero topical depth beyond one offer.

---

## 1. E-E-A-T Breakdown

### Experience — 8 / 20 (Critical gap)
- **No first-hand experience signals anywhere on the page.** No client logos, no before/after performance data, no campaign screenshots, no named results ("aumentamos X% as vendas do cliente Y").
- The only experience claim is generic and unverifiable: *"A Wave Digital nasceu da vontade de profissionais do mercado de Curitiba com experiência em marketing interativo, gestão de marcas, websolutions e largo conhecimento em gestão de links patrocinados no Google. É uma empresa do Grupo G2 que já atua há mais de 10 anos nessa área."* — **Severity: High.** This sentence asserts ">10 years" of experience via a parent company ("Grupo G2") that is never named again, linked, or substantiated anywhere on the page or via external citation.
- "A Wave agradece as dezenas de clientes que desde o começo acreditaram..." ("Wave thanks the dozens of clients who believed in us since the beginning") is a vague trust statement with **zero testimonials, zero client names, zero logos, zero star ratings, zero review platform embeds (no Google Business Profile reviews, no Trustpilot, no clutch.co)**. — **Severity: High.**
- One embedded YouTube video (`nDPFyOVyIPE`) sits next to the "Como Funciona" accordion but is generic explainer content about how Google Ads auctions work, not an original case study or branded walkthrough. — **Severity: Medium.**

### Expertise — 10 / 25 (Critical gap)
- **No author byline, no team bios, no individual credentials anywhere on the page.** There is no "Sobre" / "Quem somos" / team section. The only entity named is "Wave Digital" and unverifiable "Grupo G2."
- No certifications displayed (no Google Partner / Google Premier Partner badge, no Meta Business Partner badge) despite the entire business model being built around managing Google Ads spend on behalf of clients. For an agency whose core pitch is Google Ads expertise, the **absence of a Google Partner badge is a glaring credibility gap** — Severity: **Critical**.
- The "Como Funciona" FAQ/accordion content (links patrocinados, leilão de palavras-chave, CPC, etc.) is accurate at a generic, 101-level — it correctly explains how Google Ads auctions and CPC work — but it is textbook-level information freely available on Google's own Ads Help Center, not differentiated expert insight. No unique methodology, framework, or proprietary process is described.
- Pricing/commission structure is disclosed in percentage bands (e.g., "MÍDIA GOOGLE - 60% / AGÊNCIA - 40%" for the R$250–600 tier, sliding to 85%/15% above R$2001) — this is unusually transparent for the industry and is a positive, but it sits alongside a broken funnel (see Trust section) which undermines the credibility of the structured offer.

### Authoritativeness — 5 / 25 (Critical gap)
- **Zero external recognition signals.** No press mentions, no awards, no industry association membership, no guest content, no backlink-worthy original research/data.
- Single social proof channel: a Facebook page link (`facebook.com/wavedigitalmedia`, confirmed reachable, HTTP 200) — but it is the **only** social channel; no Instagram, LinkedIn, or other modern channels are linked, which is itself an authority/freshness red flag for a "digital agency" in 2026.
- No schema.org/JSON-LD structured data anywhere in the document (`<script type="application/ld+json">` absent, no microdata, no `schema.org` references at all). No `Organization`, `LocalBusiness`, or `FAQPage` schema despite the page literally containing an FAQ accordion ("DÚVIDAS FREQUENTES") that is a perfect `FAQPage` schema candidate. — **Severity: High** (missed authority + AI-citation opportunity).
- No Open Graph or Twitter Card meta tags at all (`og:*`, `twitter:*` entirely absent), meaning shared links on social/messaging platforms render with no title, description, or image preview — undermines off-site authority building. — **Severity: Medium.**

### Trustworthiness — 9 / 30 (Critical gap — lowest-scoring, highest-weighted factor)
- **TLS certificate mismatch:** `https://wavedigital.com.br/` serves a certificate issued to `CN=*.websiteseguro.com` (GlobalSign AlphaSSL), not to `wavedigital.com.br`. Standard browsers/clients reject this with a hostname-mismatch SSL error (confirmed: Python `requests` and `render_page.py` both failed with `SSLError(CertificateError("hostname 'wavedigital.com.br' doesn't match..."))`; only succeeded with certificate verification explicitly disabled). **Any visitor using a security-conscious browser, corporate proxy, or even default settings is likely to see a "Your connection is not private" warning before they ever read the content.** This is the single most damaging trust signal found and overrides essentially every other E-E-A-T strength the page might have. — **Severity: Critical.**
- **Primary lead-generation CTA is broken.** The "Monte seu Briefing" ("Build your Briefing") button — the higher-intent conversion path positioned next to pricing — links to `https://docs.google.com/forms/d/1C798BA6EBLeAH8szdGY4lnKjzpeKnXPAmA_XeQodMI0/viewform`, which returns **HTTP 404** (form deleted/expired). A prospect ready to convert on the pricing section hits a dead end. — **Severity: Critical.**
- **No physical address anywhere on the page.** Only a phone number (`41 3015.8753`, Curitiba/PR area code) and an email (`CONTATO@WAVEDIGITAL.COM.BR`) are shown in the contact section. No street address, no Google Maps embed, no CNPJ/company registration number — unusual for a Brazilian business page and a missed trust + local SEO signal. — **Severity: High.**
- **No privacy policy, no terms of service, no LGPD (Lei Geral de Proteção de Dados) compliance statement or cookie consent notice** anywhere on the page, despite the page running a Contact Form 7 form that collects name/email/message and a live-chat widget (Zopim) that would also capture visitor data. For a Brazilian business operating since at least 2018 (when LGPD was enacted) this is a notable compliance gap. — **Severity: High.**
- **Copyright footer reads "Wave Digital 2014 - Todos os direitos reservados."** — a literal, unmodified 2014 copyright year with no subsequent update, 12 years stale as of this 2026 audit. This is the clearest, most easily-fixed freshness/trust red flag on the page. — **Severity: High.**
- Third-party live chat widget (Zopim, loaded via `v2.zopim.com`) — Zopim was rebranded to "Zendesk Chat" years ago; the script is loaded from the legacy `zopim.com` domain/snippet, another stale-integration signal. Unclear if the chat actually still routes to a live agent. — **Severity: Medium.**
- Google Analytics is **Universal Analytics** (`ga('create', 'UA-56492679-1', 'auto')` / `analytics.js`), a property type and tracking script **Google fully sunset and stopped processing data for in July 2024.** This means the site's analytics have been collecting no data for roughly two years; the business may not even have current traffic/conversion visibility for this page. — **Severity: Critical** (separate from on-page content but materially relevant to "freshness" and to whether anyone is monitoring this page's performance at all).

---

## 2. Content Depth and Thinness

- **Total visible body word count: ~1,157 words** across the entire single page (all sections combined: hero, como-funciona/FAQ accordion, benefícios, qualificação, pacotes, contato).
- Mapped against the page-type minimums in the brief: this single page is functionally serving as **homepage + service page** simultaneously. As a homepage (min. 500 words) it clears the floor only because the FAQ accordion padding inflates the count. As a service page for "Google Ads management" (min. 800 words) it is borderline, but the content is **narrow, not deep** — it covers exactly one service (Google Ads / links patrocinados) and never mentions any other "digital agency" capability (no SEO, no social media management, no web design, no content marketing) despite the homepage hero claiming the company does "mídias sociais, portais e buscadores" (social media, portals, search engines) — a claim the rest of the page never substantiates with corresponding sections, proof, or pricing. **Severity: High** — the page over-promises broad "digital solution" positioning in one sentence and then delivers a single-service pricing page.
- The FAQ/accordion section ("DÚVIDAS FREQUENTES," 11 question-answer pairs) is the single largest and most substantive content block on the page — genuinely useful, correctly explains CPC, campaign structure, billing mechanics, minimum commitment (3 months), and click economics with a worked example (R$28/week budget ÷ R$0.50/click ≈ 56 clicks/week). This is the only block demonstrating real subject-matter explanation rather than marketing copy.
- Everything else is templated marketing boilerplate typical of Visual Composer "agency" themes circa 2014: icon-box benefit grids ("O Google apresenta seus produtos... no momento de decisão de compra"), badge/qualification icons with one-line captions, and a 4-tier pricing table differentiated only by ad-spend percentage splits — no differentiation in actual deliverables, reporting cadence detail, or service-level commitments between tiers beyond the revenue share %.
- **No blog, no articles, no resources, no glossary, no downloadable guides.** For a "digital agency" this is a significant content-marketing and topical-authority gap; there is nothing for Google (or an AI answer engine) to crawl beyond this one page to establish topical depth on Google Ads management, SEO, or social media — the three areas the homepage claims to cover.

## 3. Readability (Portuguese)

- Sentence length in the FAQ section is generally short-to-medium and conversational, appropriate for a B2B Brazilian SME audience (e.g., "Imediatamente após o início da campanha, seus anúncios vão começar a aparecer nas buscas do Google, e após 15 dias já será possível obter parâmetros de comparação e resultados sólidos." — ~30 words, single comma break, easy to follow).
- A few run-on/compound sentences exceed comfortable reading length, e.g. the "Fale Conosco" intro: *"A Wave Digital nasceu da vontade de profissionais do mercado de Curitiba com experiência em marketing interativo, gestão de marcas, websolutions e largo conhecimento em gestão de links patrocinados no Google."* — one sentence, ~30 words, three appositive noun-phrase clauses strung together; reads as a run-on "about us" sentence trying to cram positioning, geography, and credibility into a single breath. **Severity: Low** (minor, but emblematic of the page never having had a "Sobre" section to properly unpack this).
- Jargon usage is **acceptable for the audience** but undefined for newcomers: terms like "leilão de palavras-chave," "CPC," "briefing," and "acertividade" (note: "acertividade" is **not a standard Portuguese word** — the correct term is "assertividade"; this is a typo/spelling error in live, indexed content) appear without a glossary. **Severity: Medium** for the spelling error specifically — a published typo on a digital marketing agency's own site undermines the expertise claim around language/content quality, which is itself part of the service offering implied by "mídias sociais."
- Visual structure relies heavily on short icon-caption fragments rather than full paragraphs (e.g., "Defina quanto quer investir por mês ou por dia." / "Controle tudo através de relatórios detalhados.") — easy to skim but contributes to shallow, fragmentary content rather than substantive explanation.
- No subheading hierarchy logic: the page emits **13 `<h1>` tags** in a single document (`Somos a Wave Digital`, `BEM-VINDO!`, `Como Funciona`, `Benefícios`, `Qualificação`, `Pacotes`, four pricing-tier price tags as `<h1>` e.g. `R$250 à R$600`, `Fale Conosco`, and even the phone number `41 3015.8753` as an `<h1>`). This is a severe heading-hierarchy violation — `<h1>` should appear once per page identifying the primary topic; pricing figures and phone numbers being marked up as top-level headings confuses both accessibility tooling and any algorithm (search or LLM) trying to parse document structure/importance. **Severity: High.**

## 4. Duplicate / Boilerplate Content Patterns (Page-Builder Template Artifacts)

- Classic Visual Composer/Themeforest "north" theme fingerprints throughout: `vc_row`, `wpb_wrapper`, `vntd-icon-box`, `vntd-special-heading`, `vntd-pricing-box` class names, inline `vc_custom_XXXXXXXXXX` timestamp-named CSS rules (e.g. `.vc_custom_1414871069534{...}`) generated automatically by the page builder — these are unmodified template scaffolding, not custom-coded content, confirming the page has not been rebuilt or modernized since the original 2014 build.
- Icon-box benefit sections ("Benefícios" and "Qualificação") are structurally identical repeating patterns: icon + one-sentence caption, repeated 9 times across two sections with near-identical messaging ("Defina a região e os melhores dias..." in Benefícios vs. "Você define a região e os melhores dias..." in Qualificação) — the same claim (audience/schedule targeting control) is restated with minor rewording in two different sections of the same page. **Severity: Medium** — this is internal redundancy/keyword padding rather than genuinely new information, the kind of repetitive structure the Sept 2025 QRG flags as a low-quality-AI-content marker even though this content predates AI generation (it's a human-authored template-padding pattern with the same net effect).
- Pricing tier cards (Start/Selection/Master/Premium) are 100% structurally duplicated markup with only the price band, tier name, and percentage-split numbers changed — no unique value description per tier beyond the revenue-split percentage. There's no indication of what additional service, support level, or reporting frequency a "Premium" client receives versus "Start" beyond a better media/agency fee split.
- Title tag is the bare minimum: `<title>Wave Digital</title>` — no keyword, no location, no service descriptor, identical to what a default WordPress install would generate on first activation if never customized. **Severity: High** for SEO, also a freshness/effort signal — a page actively maintained for 12 years would very likely have had its title tag iterated on at least once.
- **No meta description tag at all** in the `<head>` — confirmed by direct regex search of the raw HTML; this isn't just an empty/short description, the tag is entirely absent. **Severity: High.**

## 5. Freshness Signals (or Lack Thereof)

This page exhibits more 2014-era staleness markers than any single audit typically finds on one URL:

| Signal | Observed value | Implication |
|---|---|---|
| Footer copyright | "Wave Digital **2014** - Todos os direitos reservados." | Literal, unedited 2014 timestamp, 12 years old |
| WordPress core version | `4.0.38` (`<meta name="generator" content="WordPress 4.0.38">`) | WP 4.0 released Sept 2014; current WP is in the 6.x line — **over a decade of missed core updates**, severe security exposure |
| Visual Composer plugin | `js_composer` v4.3.4 | Contemporaneous 2014/2015-era plugin version |
| PHP version | `X-Powered-By: PHP/5.3.29` | PHP 5.3 reached end-of-life Aug 2014; **running an EOL runtime for ~12 years**, no security patches received in over a decade |
| Asset upload paths | `/wp-content/uploads/2014/09/...`, `/wp-content/uploads/2014/10/...` | All images (logo, badges, background images) dated 2014, no newer media folders (no `2015/`, `2020/`, `2024/`, etc. found in any asset path) |
| Google Analytics property type | Universal Analytics (`analytics.js`, `UA-56492679-1`) | **GA discontinued processing UA data in July 2024** — analytics on this page have not recorded any traffic for ~2 years |
| Lead-gen Google Form | Returns HTTP 404 | Form deleted/expired, presumably long ago, never noticed/fixed |
| Live chat widget | Zopim snippet (legacy branding pre-Zendesk-Chat rename) | Suggests integration untouched since well before Zopim's 2014–2016-era rebrand |
| jQuery version | 1.11.1 (2014) | Matches theme-era bundling, never upgraded |
| Phone number area code | 41 (Curitiba, PR) | Consistent with the "nasceu... no mercado de Curitiba" claim in-page, but per the brief this may not match the business's current operating identity/location — worth verifying against current NAP (Name/Address/Phone) used elsewhere (Google Business Profile, current marketing) |

**Severity: Critical (compounding).** Individually any one of these (old copyright year, EOL PHP, UA analytics) would be a notable flag; together they describe a site that has had **zero substantive maintenance for roughly a decade**, which is consistent with — and explains — essentially every other content/trust gap identified above (broken form, no schema, no privacy policy, SSL cert mismatch from a generic shared-hosting wildcard cert rather than a domain-specific cert).

## 6. AI Citation Readiness — Score: 15 / 100

- **No structured data of any kind.** Zero JSON-LD, zero microdata/RDFa, zero `schema.org` vocabulary anywhere in the document. No `Organization`, `LocalBusiness`, `Service`, `FAQPage`, `Product`, `AggregateRating`, or `BreadcrumbList` markup. This is the single biggest AI-citation gap: the FAQ accordion content (11 well-formed Q&A pairs covering CPC, campaign structure, minimum commitment period, billing mechanics) is **exactly** the kind of content `FAQPage` schema is designed for, and it is completely unmarked. An AI answer engine has to rely on raw text-pattern matching rather than explicit semantic structure to extract these answers. **Severity: Critical.**
- **No Open Graph or Twitter Card metadata** — when this URL is shared or referenced, platforms have no title/description/image to draw from, reducing both human click-through and machine-readable summarization context.
- **13 `<h1>` tags with no real hierarchy** (see Readability section) actively work against AI parsers' ability to identify the page's primary topic and subtopic structure — an LLM-based crawler attempting to build a hierarchical outline of the page would see "41 3015.8753" (a phone number) marked with the same semantic weight as "Como Funciona" (a major section heading).
- **Quotable, well-defined facts do exist** in the FAQ accordion and are a genuine strength to build on: e.g., the CPC definition ("Custo Por Clique é o valor pago por cada clique que seu anúncio recebe"), the minimum-commitment answer ("recomendamos o uso por no mínimo de 3 meses... no caso de cancelamento não há cobrança de multa"), and the worked pricing example ("investimento semanal de R$ 28,00... clique de R$ 0,50... até 56 cliques"). These are concrete, extractable, citable claims — but they sit inside an `<a data-toggle="collapse">` accordion that is collapsed by default (content hidden until JS interaction), which historically has caused some crawlers/extractors to under-weight or miss accordion-hidden content, depending on render method. **Severity: Medium** — worth confirming the content is present in server-rendered HTML (confirmed it is, in raw HTML, so traditional crawlers can read it) but accordion UX is still not the most AI/snippet-friendly presentation versus a flat, always-visible FAQ list.
- **No author/byline, no dateline, no "last updated" timestamp anywhere on the page** — AI systems increasingly weight recency/provenance signals for E-E-A-T-sensitive queries (e.g., anything cost/pricing related, like the R$ pricing tiers shown here); a page with no visible update date for pricing that could easily be stale (and given every other freshness signal, almost certainly is stale) is a poor citation candidate for "how much does Google Ads management cost" type queries.
- Pricing tables are presented as plain HTML (not schema `Offer`/`PriceSpecification`), so even though the prices are visually clear to a human, they are not machine-tagged as offers, currency, or billing period — an AI engine cannot confidently cite "Wave Digital's Start plan begins at R$250" with a structured-data-backed confidence the way it could if `Offer` schema were present.

---

## Summary of Findings by Severity

**Critical**
1. TLS certificate is issued to `*.websiteseguro.com`, not `wavedigital.com.br` — triggers browser security warnings on every visit.
2. Primary lead-generation CTA ("Monte seu Briefing") links to a Google Form returning HTTP 404.
3. Site has had no substantive technical maintenance in ~10–12 years: WordPress 4.0.38 (2014), PHP 5.3.29 (EOL 2014), Universal Analytics (sunset July 2024, so currently collecting no data).
4. Zero structured data (no JSON-LD/schema.org) despite having FAQ content that is an ideal `FAQPage` candidate — severely limits AI citation readiness.
5. No Google Partner/certification badge despite the entire business model being built on managing Google Ads spend — core expertise claim unsubstantiated.

**High**
1. No testimonials, client names, logos, or case studies anywhere — Experience/Authoritativeness signals are entirely absent.
2. Unverifiable, unlinked "Grupo G2, mais de 10 anos" experience claim with no corroborating evidence.
3. No physical address, no CNPJ, no privacy policy/LGPD notice on a page that actively collects personal data via Contact Form 7 and a chat widget.
4. Footer copyright frozen at "2014" — most visible, easiest-to-fix staleness signal on the page.
5. Title tag (`Wave Digital`) and meta description (absent entirely) are both effectively unoptimized defaults.
6. 13 `<h1>` tags on one page, including pricing figures and a phone number marked as top-level headings — breaks both accessibility and machine-parsed document hierarchy.
7. Homepage hero claims broad "digital agency" scope (social media, portals, search engines) that the rest of the page never substantiates — only one service (Google Ads) is actually described, priced, or supported with content.

**Medium**
1. Spelling error "acertividade" (should be "assertividade") in live, indexed marketing copy.
2. Redundant/near-duplicate benefit claims restated across "Benefícios" and "Qualificação" sections with minor rewording.
3. FAQ content is collapsed-by-default (accordion), which is suboptimal for snippet/AI extraction even though it is present in raw server-rendered HTML.
4. Zopim live-chat widget loaded from legacy branding/domain — unclear if still actively staffed.
5. No Open Graph/Twitter Card tags — link sharing produces no preview.

**Low**
1. One run-on "about us" sentence in the Fale Conosco section crams geography/positioning/credibility into a single 30-word sentence that would benefit from being split across a proper About section.

---

## Files Referenced
- Raw fetched HTML saved at `/tmp/wave_raw2.html` (not part of repo; regenerate via `python3 -c "import requests; open('/tmp/wave_raw2.html','wb').write(requests.get('https://wavedigital.com.br/', verify=False).content)"` if re-verification is needed).
- `render_page.py` location used for initial fetch attempt: `/Users/moisesrangel/.claude/skills/seo/scripts/render_page.py` (raw-fetch mode failed due to the SSL hostname mismatch documented above — this failure is itself evidence supporting Critical Finding #1).
