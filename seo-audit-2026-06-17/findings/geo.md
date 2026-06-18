# Generative Engine Optimization (GEO) Audit — wavedigital.com.br

**Audited URL:** https://wavedigital.com.br/ (non-www only; `www.wavedigital.com.br` is excluded from this assessment — see Known Context below)
**Audit date:** 2026-06-17
**Page type:** Single-page WordPress 4.0.38 site (Visual Composer / "north" theme), pt-BR, digital marketing agency offering Google Ads ("links patrocinados") management retainers priced as a percentage of ad spend, serving the Curitiba (PR) market.

## Correction to known context before scoring

The audit brief stated only the `www` subdomain has a broken SSL cert. **That is not accurate — verified directly in this pass.** Both hostnames resolve to the same A record (`186.202.153.129`) and both fail real TLS hostname validation:

```
curl https://wavedigital.com.br/
SSL: no alternative certificate subject name matches target host name 'wavedigital.com.br'
Certificate subject: CN=*.websiteseguro.com  (Locaweb shared-hosting wildcard cert)
```

This matters directly for GEO: it means **every HTTPS-only AI crawler hitting the canonical apex domain over standard TLS validation will also fail**, not just on `www`. This is consistent with `technical.md`'s finding in this same audit (Section 1), which independently confirms the apex is affected. The plain-HTTP version (`http://wavedigital.com.br/`) does return real content (HTTP 200), which is how this audit was able to retrieve and analyze the page at all — but AI crawlers that enforce HTTPS-only fetching (most major ones do, by default) will not fall back to HTTP.

---

## GEO Readiness Score: 9 / 100

| Dimension | Weight | Score (0-100) | Weighted |
|---|---|---|---|
| Citability | 25% | 8 | 2.0 |
| Structural Readability | 20% | 10 | 2.0 |
| Multi-Modal Content | 15% | 15 | 2.25 |
| Authority & Brand Signals | 20% | 5 | 1.0 |
| Technical Accessibility | 20% | 8 | 1.6 |
| **Total** | 100% | — | **~9 / 100** |

This is a near-floor score. The site is not merely unoptimized for AI search — it is largely **unreachable** by standards-compliant AI crawlers due to the TLS issue, and what little content exists is structured in a way that actively resists extraction (single oversized page, heading-tag abuse, no passage of optimal length, zero entity markup).

---

## 1. AI Crawler Access Status — [Critical]

| Crawler | robots.txt rule | Can actually fetch via HTTPS? | Status |
|---|---|---|---|
| GPTBot | N/A — robots.txt itself returns Locaweb 404, not real rules | **No** — TLS hostname mismatch blocks standard HTTPS fetch | **Blocked (infrastructure)** |
| OAI-SearchBot | Same | **No** | **Blocked (infrastructure)** |
| ClaudeBot | Same | **No** | **Blocked (infrastructure)** |
| PerplexityBot | Same | **No** | **Blocked (infrastructure)** |
| Google-Extended | Same | **No** | **Blocked (infrastructure)** |
| CCBot / anthropic-ai / cohere-ai (training crawlers) | Same | **No** | Also blocked, but this is moot — see below |

**Verified directly in this pass:**

```
curl -k https://wavedigital.com.br/robots.txt
HTTP 404
<title>Hospedagem Locaweb</title>  <!-- "404 Service Unavailable" -- not a WordPress 404, not real robots.txt -->
```

There is no actual `Disallow`/`Allow` directive for any of these crawlers — the file does not exist in any retrievable form. This is functionally equivalent to "no robots.txt," which under the REP (Robots Exclusion Protocol) standard means **crawling is technically permitted by default** — but that permissive default is irrelevant here because of the TLS issue layered on top: **a crawler can't reach far enough to even read the (broken) robots.txt, let alone the homepage, if it enforces certificate validation on the HTTPS endpoint, which is the default and near-universal behavior for production AI crawlers in 2026.**

Two independent failure modes are stacked on this domain:
1. **TLS layer (apex + www):** standards-compliant HTTPS clients hard-fail before any HTTP response is even read.
2. **Application-routing layer (root static files only):** `/robots.txt`, `/sitemap.xml`, and `/llms.txt` all hit a Locaweb edge "domain not configured" page instead of WordPress, even when TLS validation is bypassed. Dynamic WordPress routes (e.g., `/?feed=rss2`) and static asset paths (e.g., `/wp-content/uploads/...`) work fine over both HTTP and bypassed-HTTPS — so this is specifically a routing gap for literal root-level filenames, not a wholesale server outage.

**Net effect:** AI crawlers operating in their default, standards-compliant mode cannot reliably retrieve this site at all over HTTPS. Any GEO work on content/schema/structure is moot until this is fixed, because the content underneath is currently inaccessible to the exact systems this audit is meant to optimize for.

**Severity: Critical — this is the single highest-priority blocker in the entire GEO assessment, and it sits upstream of every other recommendation in this file.**

---

## 2. llms.txt Status — [High] Missing (confirmed by direct check, not assumption)

```
curl -k -o /dev/null -w "%{http_code}" https://wavedigital.com.br/llms.txt   -> 404
curl    -o /dev/null -w "%{http_code}" http://wavedigital.com.br/llms.txt    -> 404
```

Both return the same Locaweb "domain not configured" error page as robots.txt and sitemap.xml — confirming this falls into the same root-level static-file routing gap, not a separate problem. **`llms.txt` is genuinely absent**, as predicted in the audit brief.

`llms.txt` adoption is still optional/emerging and not a confirmed ranking or citation factor for any major AI engine as of this audit's knowledge — so this is correctly scoped as **High, not Critical**. For a single-page local business site, a minimal `llms.txt` is low-effort once the routing issue is fixed (see Section 6, Recommendation #5) and costs little to add as a hedge, but it should not be prioritized ahead of the TLS/routing fix or basic content restructuring.

RSL 1.0 (Really Simple Licensing) — not present and not applicable at this stage; this is a content-licensing signal relevant primarily to publishers wanting to control AI training reuse. A one-page lead-gen site for a paid-media agency has no editorial content worth licensing-gating; **not recommended for this site.**

---

## 3. Passage-Level Citability Analysis — [Critical]

Extracted via trafilatura (boilerplate-stripped body text, navigation/footer chrome excluded) against the homepage HTML fetched at `http://wavedigital.com.br/`. Total extractable body content: **545 words across 23 paragraphs** (note: this is the boilerplate-stripped figure measured by this tool; it is lower than the ~1,157-word "total visible content" figure cited in the audit brief, which likely included headings, button labels, and pricing-table micro-copy that trafilatura correctly excludes as non-prose. Both figures point to the same conclusion: this is very little content for an AI engine to draw from.)

**Passage word-count distribution against the optimal 134-167 word citation range:**

| Word count band | Count | % of passages |
|---|---|---|
| Optimal (134-167 words) | **0** | **0%** |
| Acceptable (40-133 words) | 5 | 22% |
| Too short (under 40 words) | 16 | 70% |
| Long (168+ words) | 0 | 0% |
| Empty/heading-only | 2 | 8% |

**Zero passages on the entire page fall into the optimal citation length.** The longest passage on the page is 52 words — roughly a third of the minimum optimal length. The majority (70%) are single-sentence fragments (4-37 words) such as:

> "Segmentação do seu público-alvo." (4 words)
> "A exposição da sua marca é sem custo." (8 words)
> "Você acompanha todo o desempenho através de relatórios." (8 words)

These read as bullet-point ad copy, not self-contained, extractable answer blocks. An AI engine summarizing "how does Wave Digital's Google Ads pricing work" or "what does a Curitiba PPC agency charge" has no single passage on this page long enough to quote as a complete, context-independent answer — it would need to stitch together fragments from 3-4 different short paragraphs, which is exactly the failure mode AI answer engines try to avoid (they strongly prefer one clean, quotable block).

**Direct-answer positioning:** None of the page's question-shaped content (e.g., "Não, sua conta não será migrada para a Wave Digital..." — answering an implicit "can I migrate my existing AdWords account?" question) is preceded by an explicit question-form heading. The page has no FAQ-structured Q&A block at all, despite containing several answer-shaped paragraphs that read like FAQ responses (migration policy, contract minimums, CPC explanation, campaign definition). This is a **missed structural opportunity**, not a content-creation problem — the answers already exist in the copy; they are just not wrapped in question headings.

**Heading structure for question-based H2/H3:** Zero question-phrased headings exist anywhere on the page (see Section 4 for full heading inventory). All headings are short noun phrases ("Benefícios," "Pacotes," "Qualificação") or, worse, mis-tagged numeric/contact values.

**Severity: Critical** — this is squarely within the highest-weighted dimension (Citability, 25%) and the page currently has no content shaped to be cited.

---

## 4. Structural Readability — [Critical]

Full heading inventory extracted directly from page source (in document order):

```
H1: Somos a Wave Digital
H1: BEM-VINDO!
H1: Como Funciona
H2: ADWORDS: LINKS PATROCINADOS GOOGLE
H1: (empty)
H2: Imagine sua empresa, produto ou serviço presente no momento de necessidade...
H1: Benefícios
H2: SUCESSO DE FAZER PUBLICIDADE NO GOOGLE:
H1: Qualificação
H2: Descubra com o nosso time se você está fazendo o melhor uso...
H1: Pacotes
H2: As campanhas são estudadas de forma otimizada...
H1: R$250 à R$600          <-- pricing value tagged as H1
H3: Start
H1: R$601 à R$1000         <-- pricing value tagged as H1
H3: Selection
H1: R$1001 à R$2000        <-- pricing value tagged as H1
H3: Master
H1: Acima de R$2001        <-- pricing value tagged as H1
H3: Premium
H1: Fale Conosco
H2: A Wave Digital nasceu da vontade de profissionais do mercado de Curitiba...
H1: 41 3015.8753           <-- phone number tagged as H1
H2: (empty)
```

**Findings:**

- **`<h1>` appears 11 times on a single page**, including on a phone number and four currency values. There is no semantic hierarchy — H1/H2/H3 are being used purely for visual styling (this is a known Visual Composer / theme-builder anti-pattern from the 2014 era, where heading tags were chosen for font size, not document structure).
- This actively harms both classic SEO heading-weight signals and AI parsers that use heading hierarchy to segment a page into addressable sections. An AI crawler trying to build a table-of-contents-style mental model of this page (a common pre-processing step before citation) has no reliable signal for what is a top-level section versus a numeric data point.
- One H2 is also a full marketing paragraph used as a heading ("Imagine sua empresa, produto ou serviço presente no momento de necessidade de compra do seu cliente...") — headings should be short labels, not full sentences; this further blurs the heading/body distinction.
- No `<nav>`-equivalent table of contents exists, and because this is a true one-page site with only anchor-link navigation (`#beneficios`, `#como-funciona`, `#pacotes`, `#qualidade`, `#contato`), there are no real subpages for an AI engine to navigate to or index separately — every topic (pricing, methodology, "about," contact) lives in one giant, undifferentiated HTML document.
- No lists (`<ul>`/`<ol>`) appear to be used for the benefit bullets shown in the extracted text ("Segmentação do seu público-alvo," "Aumento de vendas em progressão geométrica," etc.) — these read like list items but several arrived in the extraction as bare paragraphs, suggesting they may be rendered as styled `<div>`/`<p>` blocks rather than semantic `<ul><li>` markup. This reduces machine-readability of what is otherwise a clean, scannable benefit list.

**Severity: Critical** — heading-tag misuse at this scale (11 H1s, numeric/phone values as H1) is a structural-readability failure that affects both classic crawlers and AI parsers, and is independent of the TLS/routing issues.

---

## 5. Multi-Modal Content — [Medium]

- **9 `<img>` tags found**, all carry a non-empty `alt` attribute (technically passes a baseline accessibility check), but every alt value is a raw filename fragment, not descriptive text: `alt="badges-05"`, `alt="badge_Artboard-5"`, `alt="badges_Artboard-7"`. These give an AI image-understanding pass essentially zero usable context — "badges-05" tells a model nothing about what the badge depicts or why it matters (likely a "Google Partner"-style trust badge, based on context, but this is not stated anywhere in text or alt).
- **One YouTube video embedded** (`youtube.com/embed/nDPFyOVyIPE`), confirmed still live (HTTP 200 on the embed URL). This is a positive signal in principle — video content correlates with AI citation likelihood — but it is not surfaced as a real `youtube.com/watch` or channel link anywhere in the page's link graph, has no surrounding caption/transcript text tying it to a specific claim, and has no `VideoObject` schema (also flagged in `schema.md`). An AI engine cannot currently associate "Wave Digital has a YouTube presence" with this embed in any structured way — it would need to parse the iframe `src` directly, which most engines don't prioritize.
- No other multi-modal assets (no podcast embeds, no downloadable PDF/case-study assets, no data visualizations/infographics) were found.
- All image upload paths date to **2014** (`/wp-content/uploads/2014/09/`, `/2014/10/`) — confirming, alongside the WordPress 4.0.38 core version, that no visual content has been refreshed in over a decade. This is a freshness signal AI engines weight when assessing content currency for time-sensitive queries (e.g., "best Google Ads agency Curitiba 2026" type prompts).

**Severity: Medium** — not the worst dimension on this page (the video embed and universally-present alt attributes give it a non-zero floor), but materially weak and easy to improve relative to the other Critical findings.

---

## 6. Authority & Brand Signals — [Critical]

| Signal | Found? | Detail |
|---|---|---|
| YouTube mentions/presence (~0.737 correlation — strongest signal) | **Partial** | One embedded video exists, but no channel link, no `sameAs`, no surrounding text context. Cannot currently be credited as a "YouTube presence" signal by an AI engine doing entity research — it would need to independently discover and connect the dots. |
| Reddit presence | **None found** | No mentions, no backlinks discoverable from on-page signals (this audit did not run live Reddit search; flagging as "not found on-page," consistent with `backlinks.md` if it covers off-site mentions). |
| Wikipedia entity | **None found** | No Wikipedia page exists for "Wave Digital" as an entity (expected for a business this size — not a deficiency unique to this site, but confirms zero Knowledge-Graph-style third-party validation exists). |
| LinkedIn | **None found** | No LinkedIn company page link anywhere on the page. For a B2B services agency, this is a notable gap — LinkedIn presence is a common authority signal AI engines cross-reference for company legitimacy. |
| Facebook | **Found** | `https://www.facebook.com/wavedigitalmedia` — the only verified social profile on the entire page, linked as a plain `<a>` tag with no `rel="me"` or schema `sameAs` annotation. |
| Domain Rating / backlinks (~0.266 correlation — weak signal) | Not assessed in this pass | See `backlinks.md` in this same findings folder for the dedicated backlink analysis; weak correlation in any case, so not a priority lever here regardless of result. |
| Authorship / byline signals | **None found** | No author meta tag, no "written by," no named team member bios on the page. The about-section copy refers only to "nosso time" (our team) and "profissionais do mercado de Curitiba" — collective, anonymous framing throughout. |
| Date signals (published/modified) | **None found** | No `datePublished`/`dateModified` meta or visible date anywhere. `publication_date` extraction (htmldate) returned `None` when run against this page in this audit. Combined with 2014-dated asset URLs, there is no freshness signal at all for AI engines that weight content recency. |
| Entity presence / brand consistency (NAP) | **Weak/Inconsistent** | Phone number present (`41 3015.8753`) but street address field is template-present and literally blank on the live page (also flagged in `schema.md`). City ("Curitiba") is mentioned once in prose, not as structured NAP. No CNPJ (Brazilian business registration number) found anywhere — a real-world trust/legitimacy signal commonly expected for Brazilian commercial sites and increasingly referenced by AI engines assessing business legitimacy. |
| Citations/external references in copy | **None found** | The page makes several factual-sounding claims about how Google Ads/CPC works with zero source attribution or external citation — purely first-party, unverifiable assertions. AI engines preferentially cite content that itself models good citation behavior or can be cross-verified against other sources. |

**This is the second-worst-scoring dimension after Technical Accessibility, and arguably the hardest to fix quickly** — brand authority signals (LinkedIn presence, Reddit mentions, third-party validation) are not pure on-page fixes; they require off-site work over time. However, several sub-signals here (NAP consistency, `sameAs` markup, named team bios, CNPJ disclosure) are cheap on-page fixes that compound the authority story even before off-site work pays off.

**Severity: Critical** on the on-page-fixable sub-signals (NAP, sameAs, authorship); **High/longer-horizon** on the off-site sub-signals (LinkedIn, Reddit, Wikipedia, Domain Rating).

---

## 7. Technical Accessibility for AI Crawlers — [Critical]

- **SSR vs CSR:** This is a fully server-side-rendered, static WordPress page — `render_page.py` confirmed `is_spa: false` and the `raw` (pre-JavaScript) fetch mode was sufficient to retrieve all content; no client-side rendering dependency exists. **This is the one genuinely positive technical-accessibility signal on the entire site** — there is no JavaScript-rendering barrier of the kind that blocks many modern SPA sites from AI crawlers. If the TLS/routing issues were fixed, the content underneath would be trivially crawlable.
- **TLS certificate mismatch (apex + www):** covered in depth above (Section "Correction to known context"). This is the dominant technical-accessibility blocker and sits above everything else in this section.
- **robots.txt / sitemap.xml / llms.txt all return a non-standard error page** (Locaweb "domain not configured," HTTP 404) instead of either real content or a clean, standard 404. A 404 on `robots.txt` is itself tolerated short-term by most crawlers (default-to-allow), but a **persistent, server-level routing failure** (not a transient error) risks crawlers eventually treating the domain as unreliable or under-maintained, which is a soft trust signal independent of the explicit allow/disallow question.
- **No sitemap = no discovery manifest.** Largely moot for a one-page site today, but forecloses future expansion (e.g., if the client later adds a blog or service-specific landing pages) without first fixing the routing layer.
- **Page weight / load behavior:** not separately re-measured in this pass (covered in `technical.md`/Core Web Vitals context elsewhere in this audit); flagging only that AI crawlers generally have more generous timeout tolerances than user-facing rendering, so this is a lower-priority concern relative to the hard TLS blocker.
- **WordPress 4.0.38 / PHP 5.3.29 / Visual Composer 4.3.4** — all confirmed EOL software (also flagged in `schema.md` and `technical.md`). Not a direct AI-crawler-access issue, but relevant context: this stack cannot run modern SEO/AI-optimization plugins (e.g., anything that would auto-generate `llms.txt`, JSON-LD, or OG tags) without a platform upgrade first.

**Severity: Critical.**

---

## Platform-Specific GEO Scores (estimated, qualitative)

These are directional estimates based on the technical/content findings above, not live API measurements (no DataForSEO MCP tools were available/used in this pass — see note below).

| Platform | Estimated score (0-100) | Rationale |
|---|---|---|
| Google AI Overviews | 10 | Google's indexing crawler is somewhat more tolerant of cert issues than browsers, and the homepage is technically indexable (no meta-robots block) per `technical.md` — but zero structured data, no optimal-length passages, and heading chaos mean even if crawled, there is very little for AIO to confidently extract and cite. |
| ChatGPT (browsing/search) | 5 | OAI-SearchBot enforces standard HTTPS; the TLS mismatch is the dominant blocker here. Even disregarding that, the lack of any optimal-length passage or FAQ structure gives ChatGPT little to quote directly. |
| Perplexity | 8 | Similar TLS blocker via PerplexityBot. Perplexity tends to favor sites with clear, well-cited factual claims and recent dates — this page has neither. |
| Bing Copilot | 12 | Slightly higher only because Bing/Microsoft's crawling infrastructure has historically been somewhat more fault-tolerant of TLS edge cases in some configurations, and Bing still places some residual weight on classic on-page signals (title tag, headings) that at least exist here, even if poorly structured. Not a confident estimate — treat as a rough floor, not a verified figure. |

**Note on DataForSEO:** No DataForSEO MCP tools (`ai_optimization_chat_gpt_scraper`, `ai_opt_llm_ment_search`) were available in this environment for this pass. If those tools become available, re-running live ChatGPT-visibility and LLM-mention checks against "Wave Digital," "gestão de Google Ads Curitiba," and "agência de links patrocinados Curitiba" would replace the qualitative estimates above with real citation data and should be prioritized as a fast follow-up once the TLS fix ships (no point measuring live citations against a domain that's currently unreachable by the crawlers being measured).

---

## Top 5 Highest-Impact Changes (prioritized, sized for a single-page local-business site)

### 1. Fix the TLS certificate binding for both `wavedigital.com.br` and `www.wavedigital.com.br` — [Critical] [Effort: Low-Medium, hosting-provider ticket]
This is a Locaweb-side SNI/vhost binding issue, not a code change — almost certainly resolvable via a support ticket to re-issue/re-bind a certificate that actually covers `wavedigital.com.br` (e.g., a free Let's Encrypt cert provisioned correctly per-hostname, replacing the generic `*.websiteseguro.com` shared cert currently being served). **Nothing else in this report matters until this ships** — every AI crawler enforcing standard HTTPS validation is currently unable to reach the site at all. Estimated effort: a few hours of hosting-provider support time, no development work required. This is the single highest-leverage fix available, full stop.

### 2. Fix root-level static file routing so `/robots.txt`, `/sitemap.xml`, and `/llms.txt` resolve through WordPress instead of hitting Locaweb's "domain not configured" page — [Critical] [Effort: Low, likely a vhost/document-root config fix]
Once TLS is fixed, this is the next blocker. Confirmed in this pass that dynamic WP routes and static asset *subpaths* (`/wp-content/uploads/...`) work fine — the gap is specific to literal root-level filenames. This is likely a quick fix once support engages (could be the same underlying misconfiguration as #1, worth raising in the same ticket). After this is fixed: add a real `robots.txt` explicitly allowing GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot (even though absence currently defaults to allow, an explicit, real, fetchable file removes ambiguity and stops the "persistent fetch failure" trust-erosion risk noted in Section 7), and add a minimal real `sitemap.xml` (trivial for a one-page site, but signals a maintained, healthy domain).

### 3. Fix heading hierarchy — stop using `<h1>` for pricing values and the phone number; establish one real H1 and a clean H2/H3 nesting per section — [Critical] [Effort: Low, CSS/template fix, no content rewrite needed]
This is purely a markup fix, not a copywriting project: the existing text content can stay almost entirely as-is. Re-tag the 11 current H1s down to a single page H1 (e.g., "Wave Digital — Gestão de Google Ads em Curitiba") with H2s for each real section (Benefícios, Como Funciona, Pacotes, Qualificação, Fale Conosco) and H3s for sub-items (Start/Selection/Master/Premium tiers). Apply the current H1 *font sizes* via CSS classes instead of semantic tags, so the visual design doesn't need to change at all — only the underlying tags. This single fix meaningfully improves both classic SEO heading-weight and AI page-segmentation parsing, for a few hours of theme-template work.

### 4. Restructure the existing FAQ-shaped answers into explicit question-headed, optimal-length (134-167 word) blocks — [High] [Effort: Medium, content editing, no new research needed]
The raw material already exists in the current copy (CPC explanation, campaign-definition explanation, account-migration policy, 3-month minimum rationale) — it just needs to be: (a) given an explicit question-form heading ("Posso migrar minha conta atual do Google Ads para a Wave Digital?", "Quanto tempo leva para ver resultados com uma campanha de Google Ads?"), and (b) expanded from the current 24-52 word fragments up into the 134-167 word optimal-citation range by adding the concrete specificity AI engines favor (a sentence of context, a number, a brief example) without padding. Given there are already 5-6 natural Q&A candidates in the existing text, this is a half-day to one-day content task, not a rewrite of the site.

### 5. Add the `ProfessionalService`/`Organization` JSON-LD already specified in `schema.md`, plus a minimal `llms.txt`, plus `sameAs` entity linking — [High] [Effort: Low once TLS/routing are fixed]
This GEO audit defers to `schema.md` for the exact JSON-LD payload (already drafted, including the `ProfessionalService` + `WebSite` + `WebPage` `@graph` block) — implement that as-is once items #1-#2 are resolved. In addition, for GEO specifically: (a) ship a short `llms.txt` at the root once routing is fixed, listing the site name, one-line description, and links to the homepage's key sections (a few lines is sufficient for a one-page site — this is not an enterprise content-licensing exercise); (b) add the missing real street address and CNPJ to both the visible page and the JSON-LD `address` block (currently blank on-page per `schema.md` Section 2); (c) add a LinkedIn company page link if one exists or is created, and wire it into `sameAs` alongside the existing Facebook link — LinkedIn presence is a meaningfully stronger authority signal for a B2B services agency than the current Facebook-only profile.

---

## Severity-Tagged Findings Summary

- **[Critical]** TLS certificate mismatch affects **both** `wavedigital.com.br` and `www.wavedigital.com.br` (correction to the audit brief, which described this as a www-only issue) — blocks standards-compliant HTTPS fetching for essentially all major AI crawlers by default.
- **[Critical]** `robots.txt`, `sitemap.xml`, and `llms.txt` all return a Locaweb "domain not configured" error page (HTTP 404) rather than real content — a server-routing failure specific to root-level static filenames, confirmed distinct from a general server outage.
- **[Critical]** Zero passages on the homepage fall within the 134-167 word optimal AI-citation range; 70% of extracted passages are under 40 words and read as disconnected ad-copy fragments rather than self-contained, quotable answers.
- **[Critical]** Heading hierarchy is severely broken: 11 `<h1>` tags on a single page, including four pricing values and a phone number tagged as H1 — no real H1→H2→H3 semantic structure exists anywhere on the page.
- **[Critical]** No authorship, no date signals (`publication_date` extraction returned None; no visible or meta-level dates anywhere), and asset URLs dated 2014 — zero freshness signal for AI engines that weight content recency.
- **[High]** `llms.txt` confirmed absent via direct check (not assumption) — returns the same routing-layer error as robots.txt/sitemap.xml.
- **[High]** Authority/brand signals are almost entirely missing: no LinkedIn, no Wikipedia entity, no Reddit presence found, and the one social profile present (Facebook) lacks `sameAs`/`rel="me"` machine-readable linking. The single YouTube video embed is not connected to any channel/profile signal.
- **[High]** No FAQ-structured Q&A content despite the existing copy already containing 5-6 natural, answer-shaped paragraphs (CPC explanation, account-migration policy, contract-minimum rationale) that simply lack question-form headings.
- **[Medium]** Image alt text is universally present but consists of raw filenames ("badges-05," "badge_Artboard-5") rather than descriptive text — near-zero value for AI multi-modal content understanding.
- **[Medium]** NAP (Name/Address/Phone) is incomplete and unstructured: phone number present in text, but street address field is template-present and blank on the live page; city mentioned only once in prose, not as structured data; no CNPJ disclosed anywhere.
- **[Info/Positive]** The page is fully server-side rendered with no SPA/client-side-rendering dependency (`is_spa: false` confirmed via `render_page.py`) — once the TLS and routing issues are fixed, the underlying content is trivially crawlable with no JavaScript-rendering barrier. This is the one clean positive finding in the entire technical-accessibility dimension.
- **[Info]** No DataForSEO MCP tools were available in this environment for live ChatGPT-visibility or LLM-mention measurement; platform-specific scores in this report are qualitative estimates based on technical/content findings, not live API data. Re-run with DataForSEO once the TLS fix ships, since there is no value in measuring live citations against a domain the target crawlers currently cannot reach.

---

## Files referenced

- This findings file: `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/findings/geo.md`
- Cross-referenced: `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/findings/schema.md` (JSON-LD recommendation reused by reference in Section/Recommendation #5)
- Cross-referenced: `/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/findings/technical.md` (TLS and robots.txt/sitemap findings independently corroborated)
- Raw fetched HTML used for this audit: `/tmp/wave_raw.html` (temporary; re-fetch with `curl http://wavedigital.com.br/` or `python3 /Users/moisesrangel/.claude/skills/seo/scripts/render_page.py http://wavedigital.com.br/ --mode auto --json` to reproduce — note the **http**, not https, scheme is required to retrieve content directly given the TLS mismatch)
- Render metadata JSON: `/tmp/wave_render.json`
