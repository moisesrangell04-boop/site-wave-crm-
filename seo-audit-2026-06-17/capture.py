import json
from playwright.sync_api import sync_playwright

URL = "http://wavedigital.com.br/"  # using HTTP: HTTPS has cert mismatch (cert issued for *.websiteseguro.com)
OUT = "/Users/moisesrangel/Documents/wave crm/seo-audit-2026-06-17/screenshots"

VIEWPORTS = {
    "desktop_1440": (1440, 900),
    "desktop_1920": (1920, 1080),
    "laptop_1366": (1366, 768),
    "tablet_768": (768, 1024),
    "mobile_390": (390, 844),
    "mobile_375": (375, 812),
}

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch()

    for name, (w, h) in VIEWPORTS.items():
        page = browser.new_page(viewport={"width": w, "height": h})
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        failed_requests = []
        page.on("requestfailed", lambda req: failed_requests.append(req.url))

        try:
            page.goto(URL, wait_until="networkidle", timeout=45000)
        except Exception as e:
            results[name] = {"error": str(e)}
            page.close()
            continue

        # Above the fold screenshot (viewport only)
        page.screenshot(path=f"{OUT}/{name}_above_fold.png", full_page=False)
        # Full page screenshot
        page.screenshot(path=f"{OUT}/{name}_full_page.png", full_page=True)

        data = {}

        # viewport meta tag
        viewport_meta = page.eval_on_selector("meta[name='viewport']", "el => el ? el.getAttribute('content') : null") if page.query_selector("meta[name='viewport']") else None
        data["viewport_meta"] = viewport_meta

        # document/body widths vs horizontal scroll detection
        data["window_inner_width"] = page.evaluate("window.innerWidth")
        data["document_scroll_width"] = page.evaluate("document.documentElement.scrollWidth")
        data["body_scroll_width"] = page.evaluate("document.body.scrollWidth")
        data["has_horizontal_scroll"] = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")

        # body / html computed widths (fixed px?)
        data["body_computed_width"] = page.evaluate("getComputedStyle(document.body).width")
        data["html_computed_width"] = page.evaluate("getComputedStyle(document.documentElement).width")

        # find widest fixed-width elements
        widest = page.evaluate("""
        () => {
            const els = document.querySelectorAll('body *');
            const out = [];
            for (const el of els) {
                const rect = el.getBoundingClientRect();
                if (rect.width > window.innerWidth + 5) {
                    out.push({
                        tag: el.tagName,
                        id: el.id,
                        cls: (el.className+'').slice(0,80),
                        width: Math.round(rect.width),
                        left: Math.round(rect.left)
                    });
                }
            }
            out.sort((a,b)=>b.width-a.width);
            return out.slice(0,15);
        }
        """)
        data["overflowing_elements"] = widest

        # H1 presence and visibility
        h1 = page.query_selector("h1")
        if h1:
            box = h1.bounding_box()
            data["h1_text"] = (h1.inner_text() or "")[:200]
            data["h1_box"] = box
            data["h1_in_viewport"] = bool(box and box["y"] < h)
        else:
            data["h1_text"] = None

        # nav menu detection - is there a hamburger / mobile menu toggle visible
        nav_info = page.evaluate("""
        () => {
            const candidates = Array.from(document.querySelectorAll('nav, .nav, .menu, .navbar, header'));
            return candidates.slice(0,5).map(el => {
                const rect = el.getBoundingClientRect();
                const style = getComputedStyle(el);
                return {
                    tag: el.tagName,
                    cls: (el.className+'').slice(0,80),
                    width: Math.round(rect.width),
                    display: style.display,
                    visible: rect.width > 0 && rect.height > 0
                };
            });
        }
        """)
        data["nav_elements"] = nav_info

        # hamburger icon detection
        hamburger = page.evaluate("""
        () => {
            const sel = ['.hamburger','.menu-toggle','.navbar-toggle','[class*=\"burger\"]','[class*=\"toggle\"]','.mobile-menu','[class*=\"mobile-nav\"]'];
            const found = [];
            sel.forEach(s => {
                document.querySelectorAll(s).forEach(el => {
                    const r = el.getBoundingClientRect();
                    found.push({sel: s, width: Math.round(r.width), height: Math.round(r.height), visible: r.width>0 && r.height>0});
                });
            });
            return found;
        }
        """)
        data["hamburger_candidates"] = hamburger

        # font sizes sample (body, p, common text)
        font_info = page.evaluate("""
        () => {
            const sample = [];
            const tags = ['body','p','a','li','h1','h2','h3'];
            tags.forEach(t => {
                const el = document.querySelector(t);
                if (el) {
                    const s = getComputedStyle(el);
                    sample.push({tag: t, fontSize: s.fontSize, lineHeight: s.lineHeight});
                }
            });
            return sample;
        }
        """)
        data["font_samples"] = font_info

        # tap target sizing - measure links/buttons in first viewport height
        tap_targets = page.evaluate("""
        (vh) => {
            const els = Array.from(document.querySelectorAll('a, button, input[type=submit]'));
            const out = [];
            for (const el of els) {
                const rect = el.getBoundingClientRect();
                if (rect.top >= 0 && rect.top < vh && rect.width > 0 && rect.height > 0) {
                    out.push({
                        text: (el.innerText||el.value||'').trim().slice(0,30),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    });
                }
            }
            return out.slice(0,40);
        }
        """, h)
        data["tap_targets_above_fold"] = tap_targets
        small_targets = [t for t in tap_targets if (t["width"] < 44 or t["height"] < 44) and t["text"]]
        data["small_tap_targets_count"] = len(small_targets)
        data["small_tap_targets_sample"] = small_targets[:10]

        data["console_errors"] = console_errors[:20]
        data["failed_requests"] = failed_requests[:20]

        # page title & meta description for reference
        data["title"] = page.title()

        results[name] = data
        page.close()

    browser.close()

with open(f"{OUT}/../findings/raw_data.json", "w") as f:
    json.dump(results, f, indent=2)

print("DONE")
print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk in ('viewport_meta','has_horizontal_scroll','document_scroll_width','window_inner_width','overflowing_elements','small_tap_targets_count')} for k, v in results.items()}, indent=2))
