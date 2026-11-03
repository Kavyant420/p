#!/usr/bin/env python3
"""Batch 6: e51-e52 ecommerce CSS (fills gap to reach exactly 104 new files)."""
import os
ECOM = "/workspace/css/ecom"
E = {}

E["e51-store-modes.css"] = """/* e51 — STORE MODES · density + focus toggles for the storefront */
body.store-compact .pcard-media{aspect-ratio:1/1}
body.store-compact .merch-grid{gap:var(--e-sp-3)}
body.store-compact .pcard-body{padding:var(--e-sp-3)}
body.focus-read .shop-header,body.focus-read .promo-bar{opacity:.4;transition:opacity .3s}
body.focus-read .shop-header:hover{opacity:1}
.mode-pill{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:var(--e-r-pill);
  border:1px solid var(--e-line);background:transparent;color:var(--e-ink-2);cursor:pointer;
  font:600 10px/1 'JetBrains Mono',monospace;letter-spacing:.16em;transition:all var(--e-d-fast)}
.mode-pill.on{border-color:var(--e-ink);color:var(--e-ink);background:rgba(255,255,255,.07)}
"""

E["e52-a11y-storefront.css"] = """/* e52 — A11Y PASS · skip links, focus rings, reduced chrome for commerce flows */
.skip-link{position:fixed;top:-48px;left:16px;z-index:120;padding:12px 18px;border-radius:0 0 12px 12px;
  background:#fff;color:#000;font:700 12px/1 'JetBrains Mono',monospace;text-decoration:none;transition:top .2s}
.skip-link:focus{top:0}
:where(button,a,input,select,[tabindex]):focus-visible{outline:2px solid #fff;outline-offset:3px;border-radius:6px}
.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
@media(prefers-reduced-motion:reduce){.etoast,.modal-card,.qv-card{animation:none!important;transition:none!important}}
[aria-live]{pointer-events:none}
"""

for name, body in E.items():
    with open(os.path.join(ECOM, name), "w") as f:
        f.write(body)
print("batch6 written:", len(E))
