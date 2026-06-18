# Backlink Profile Analysis — wavedigital.com.br

**Date:** 2026-06-17
**Tier:** 0 (Common Crawl + verification crawler only — no Moz/Bing/DataForSEO credentials configured)

## Credential Check

Ran `backlinks_auth.py --check`. Result: **Tier 0**.

| Source | Available | Confidence if used |
|---|---|---|
| Common Crawl Web Graph | Yes (public, no auth) | 0.50 |
| Verification crawler | Yes (no auth) | 0.95 — but no known-backlink list was supplied, so nothing to verify |
| Moz API | **No** — `MOZ_API_KEY` not set, no config at `~/.config/claude-seo/backlinks-api.json` | n/a |
| Bing Webmaster Tools | **No** — `BING_WEBMASTER_API_KEY` not set | n/a |
| DataForSEO | **No** — not installed/configured | n/a |

**Bottom line up front: only Common Crawl domain-level signals were available, and Common Crawl returned no data at all for this domain.** Everything below is either (a) a direct, real data point from a free source, or (b) explicitly labeled as a live-site observation made via direct HTTP/HTML inspection (not a backlink-API source). No anchor text, no toxic-link scoring, and no referring-domain counts are available from any source at this tier — see Insufficient Data section.

## Common Crawl Domain Graph Results (Source: Common Crawl, confidence: 0.50)

Queried `commoncrawl_graph.py wavedigital.com.br --json` against two releases:

| Release | In Crawl? | In Rankings? | PageRank | Harmonic Centrality | Referring Domains |
|---|---|---|---|---|---|
| cc-main-2026-jan-feb-mar (latest) | No | No | null | null | 0 found |
| cc-main-2024-oct-nov-dec | No | No | null | null | 0 found |

**Real data point:** `wavedigital.com.br` is **absent from the Common Crawl host/domain web graph** in both the current release and a release from late 2024. This is a genuine finding, not an estimate.

**Correct interpretation (per validator guidance — do not over-read this):** absence from Common Crawl does **not** mean "zero backlinks" or "zero authority." CC's graph is a sample of the crawlable web; small, low-traffic, or rarely-relinked sites frequently fall outside it even when they have some real-world backlinks. It does mean: there is no link graph evidence of any meaningful, currently-crawled site pointing to wavedigital.com.br with enough consistency/volume to register in CC's sample across two non-adjacent crawl periods. Combined with the live-site context below, this is consistent with (but does not prove) a domain that has had little to no active link-building or fresh inbound linking activity in recent years.

**Severity: Low / FYI** — Not flagging this as a defect by itself; flagging the *absence of usable backlink signal* as a data gap that blocks scoring (see below).

## Live-Site Corroborating Observations (Source: direct HTTP/HTML fetch, confidence: 0.95 — directly observed, not inferred)

These are not backlink data, but they explain *why* the backlink profile is hard to assess and corroborate the brief's description of a dormant/legacy domain:

| Observation | Evidence | Severity |
|---|---|---|
| Apex domain (`http://wavedigital.com.br`) resolves and returns HTTP 200 | `curl` to apex domain | Info |
| Site is running a 2014-era WordPress build | HTML contains `wp-content/uploads/2014/10/favicon.png` and multiple asset query strings `?ver=4.0.38` (WP core/theme version marker) | **High** — outdated, unmaintained CMS on a live, indexable domain is a security and credibility risk independent of backlinks |
| `www` subdomain is broken via HTTPS | `https://www.wavedigital.com.br` returns SSL error: certificate is for `*.websiteseguro.com` (a shared-hosting wildcard cert), not the requested host — `subjectAltName does not match` | **High** — any backlinks pointing at the `www` variant over HTTPS will fail for visitors and likely fail or get flagged by crawlers/security software |
| Outbound homepage links (directly parsed) | Only 5 external `href`s found on homepage: 3 Google Fonts CSS requests, 1 Google Forms link, 1 Facebook page link (`facebook.com/wavedigitalmedia`) | Info — no reciprocal-link risk detected (no overlap between these 5 outbound domains and any inbound source, since no inbound data exists to compare) |
| DNS | Both apex and `www` resolve to the same IP (186.202.153.129) — a Brazilian shared-hosting IP range consistent with `websiteseguro.com`-branded hosting | Info |

These observations support the audit brief's framing: this looks like a domain that may have changed hands or gone dormant after an initial mid-2010s buildout, with hosting/cert hygiene that has not been touched since.

## Referring Domains, Anchor Text, Toxic Links — INSUFFICIENT DATA

Per the scoring framework, fewer than 4 of the 7 weighted factors have any data source at Tier 0. Only 1 factor (referring domain count) has even a partial, real-but-empty data point from Common Crawl; the rest have **zero** sources:

| Factor | Weight | Status |
|---|---|---|
| Referring domain count | 20% | CC returned 0 — but CC absence ≠ confirmed zero (see caveat above). **No reliable count available.** |
| Domain quality distribution | 20% | **No source** (requires Moz/DataForSEO) |
| Anchor text naturalness | 15% | **No source** (requires Moz/Bing/DataForSEO) |
| Toxic link ratio | 20% | **No source** (requires Moz spam score or DataForSEO; verify-crawler needs a known-link list, none supplied) |
| Link velocity trend | 10% | **No source** (DataForSEO only) |
| Follow/nofollow ratio | 5% | **No source** (requires Bing/DataForSEO) |
| Geographic relevance | 10% | **No source** (requires Bing/DataForSEO) |

**No numeric Backlink Health Score is being reported.** Producing a number (e.g., "15/100") from this data would imply false precision and could be misread as "confirmed weak backlink profile" when the honest finding is "no measurement instrument available at this tier, and the one free instrument that exists (Common Crawl) has no record either way." This was checked against `validate_backlink_report.py`, which explicitly flags numeric scores built on fewer than 4 populated factors as misleading — confirmed PASS only because no score was generated.

**Toxic/spammy links: cannot be assessed.** No toxic-link data source is active at Tier 0 beyond the verification crawler, which requires a pre-existing list of known backlink URLs to check (none was provided/found in the project). If you have any known inbound links (e.g., from an old directory listing, a partner site, or a previous SEO report), supply them and I can run `verify_backlinks.py` to check they still resolve and capture real anchor text/rel attributes (confidence 0.95, since it's direct observation rather than an index sample).

## Recommendations

1. **Critical/High (non-backlink, but discovered during this check and worth flagging to the broader audit):** Fix the `www` SSL certificate mismatch and the outdated WordPress 4.0.38 core/theme. Any historical backlinks pointing to `https://www.wavedigital.com.br` are currently failing for users on that protocol/host combination, which silently destroys their value even if the link itself still exists on the linking page.
2. **Medium:** To get any real referring-domain, anchor-text, or toxic-link numbers, configure free credentials:
   - Moz API (free signup, 2,500 rows/month): set `MOZ_API_KEY` or add `moz_api_key` to `~/.config/claude-seo/backlinks-api.json` — unlocks DA/PA, spam score, anchor text.
   - Bing Webmaster Tools (free, but requires verifying the site in Bing first — may be blocked until the `www`/SSL issue above is fixed): unlocks inbound link list with anchor text and discovery dates.
3. **Low/FYI:** If this domain is confirmed to have changed hands or been dormant, consider checking the **Wayback Machine** and any legacy SEO tool exports (Ahrefs/Semrush historical snapshots, even free trial exports) for pre-2020 backlink data — Common Crawl's web graph snapshots used here only go back to late 2024, so anything from the 2014-era version of the business would not show up in this analysis regardless of whether it's real.
4. **Low/FYI:** Once any inbound links are identified (via Moz, Bing, or manual research), run `verify_backlinks.py --target https://wavedigital.com.br --links <file>` to get high-confidence (0.95) binary verification of which links are still live versus lost.
5. Per scope: this report does not cover on-page E-E-A-T (`/seo content <url>`) or crawlability/technical health (`/seo technical <url>`) — both are recommended given the outdated WordPress/SSL findings surfaced incidentally above.

## Data Freshness Notes

- Common Crawl: quarterly releases; checked cc-main-2026-jan-feb-mar (current) and cc-main-2024-oct-nov-dec (~18 months prior) — domain absent from both.
- Live-site HTTP/HTML observations: real-time, captured 2026-06-17.
- No Moz (∼3-day lag) or Bing (near-real-time) data included — not configured.
