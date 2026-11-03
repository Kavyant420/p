#!/usr/bin/env python3
"""Batch 1: e05-e12 ecommerce CSS."""
import os
ECOM = "/workspace/css/ecom"
E = {}

E["e05-filters.css"] = """/* e05 — FILTER DRAWER · glass side panel, facet chips */
.filter-fab{position:fixed;left:var(--e-gutter);bottom:calc(var(--e-sp-5) + env(safe-area-inset-bottom));z-index:55;display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:var(--e-r-pill);border:1px solid var(--e-line-strong);background:rgba(5,5,6,.7);backdrop-filter:blur(18px);color:var(--e-ink);font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.18em;cursor:pointer;box-shadow:var(--e-el-2)}
.filter-drawer{position:fixed;inset:0;z-index:80;pointer-events:none}
.fd-scrim{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity var(--e-d-med);backdrop-filter:blur(4px)}
.fd-panel{position:absolute;top:0;left:0;bottom:0;width:min(360px,88vw);overflow-y:auto;padding:var(--e-sp-5);background:rgba(6,6,7,.86);backdrop-filter:blur(34px) saturate(130%);border-right:1px solid var(--e-line-strong);transform:translateX(-102%);transition:transform var(--e-d-slow) var(--e-ease-out);box-shadow:var(--e-el-pop)}
.filter-drawer.open{pointer-events:auto}.filter-drawer.open .fd-scrim{opacity:1}
.filter-drawer.open .fd-panel{transform:none}
.fd-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--e-sp-5)}
.fd-head h3{margin:0;font:900 15px/1 'Unbounded',sans-serif;letter-spacing:.12em;color:var(--e-ink)}
.facet{border-bottom:1px solid var(--e-line);padding:var(--e-sp-4) 0}
.facet summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font:700 12px/1 'JetBrains Mono',monospace;letter-spacing:.2em;color:var(--e-ink)}
.facet summary::-webkit-details-marker{display:none}
.facet summary::after{content:"+";color:var(--e-ink-3)}
.facet[open] summary::after{content:"\\2212"}
.facet-body{padding-top:var(--e-sp-3);display:flex;flex-wrap:wrap;gap:8px}
.fchip{padding:8px 14px;border-radius:var(--e-r-pill);border:1px solid var(--e-line);background:transparent;color:var(--e-ink-3);font-size:12px;cursor:pointer;transition:all var(--e-d-fast)}
.fchip.on{background:var(--e-ink);color:#000;border-color:var(--e-ink)}
.range{width:100%;accent-color:#fff;margin-top:var(--e-sp-2)}
.fd-actions{display:flex;gap:var(--e-sp-3);margin-top:var(--e-sp-5)}
"""

E["e06-pdp.css"] = """/* e06 — PRODUCT DETAIL PAGE · gallery, variants, buy bar */
.pdp{display:grid;grid-template-columns:1.05fr .95fr;gap:var(--e-sp-8);max-width:var(--e-maxw);margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.pdp-gallery{position:sticky;top:96px;align-self:start;border-radius:var(--e-r-xl);overflow:hidden;border:1px solid var(--e-line);background:var(--e-bg-sunken)}
.pdp-stage{position:relative;aspect-ratio:1/1.05}
.pdp-stage img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06)}
.pdp-thumbs{display:flex;gap:8px;padding:var(--e-sp-3);border-top:1px solid var(--e-line)}
.pdp-thumb{width:56px;height:56px;border-radius:10px;overflow:hidden;border:1px solid var(--e-line);cursor:pointer;opacity:.55;transition:all var(--e-d-fast)}
.pdp-thumb.on{opacity:1;border-color:var(--e-ink)}
.pdp-thumb img{width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
.pdp-info h1{font-family:'Unbounded',sans-serif;font-weight:700;font-size:var(--e-fs-h2);margin:var(--e-sp-2) 0;color:var(--e-ink)}
.pdp-price-row{display:flex;align-items:baseline;gap:var(--e-sp-3);margin:var(--e-sp-4) 0}
.pdp-price{font:700 clamp(26px,3vw,38px)/1 'JetBrains Mono',monospace;color:var(--e-ink)}
.pdp-compare{font-size:14px;color:var(--e-ink-3);text-decoration:line-through}
.variant-set{margin:var(--e-sp-5) 0}
.variant-lab{font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.24em;color:var(--e-ink-3);margin-bottom:var(--e-sp-3)}
.variant-row{display:flex;gap:10px;flex-wrap:wrap}
.swatch{min-width:44px;height:44px;padding:0 12px;border-radius:12px;border:1px solid var(--e-line);background:rgba(255,255,255,.04);color:var(--e-ink-2);cursor:pointer;font:600 12px/1 'JetBrains Mono',monospace;display:grid;place-items:center;transition:all var(--e-d-fast)}
.swatch.on{border-color:var(--e-ink);background:var(--e-ink);color:#000}
.qty-stepper{display:inline-flex;align-items:center;border:1px solid var(--e-line-strong);border-radius:var(--e-r-pill)}
.qty-stepper button{width:40px;height:40px;background:none;border:0;color:var(--e-ink);font-size:16px;cursor:pointer}
.qty-stepper output{width:36px;text-align:center;font:700 14px/1 'JetBrains Mono',monospace;color:var(--e-ink)}
.pdp-buy{display:flex;gap:var(--e-sp-3);margin:var(--e-sp-6) 0;flex-wrap:wrap}
.btn-buy{flex:1;min-width:220px;padding:16px;border-radius:var(--e-r-pill);border:1px solid var(--e-ink);background:var(--e-ink);color:#000;font:900 13px/1 'Unbounded',sans-serif;letter-spacing:.14em;cursor:pointer;transition:transform var(--e-d-fast),box-shadow var(--e-d-fast)}
.btn-buy:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(255,255,255,.12)}
.btn-buy.ghost{background:transparent;color:var(--e-ink)}
.pdp-meta{border-top:1px solid var(--e-line);margin-top:var(--e-sp-5);padding-top:var(--e-sp-4)}
.pdp-meta dl{display:grid;grid-template-columns:auto 1fr;gap:8px var(--e-sp-5);font-size:13px;margin:0;color:var(--e-ink-2)}
.pdp-meta dt{color:var(--e-ink-3);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em}
.pdp-meta dd{margin:0}
@media(max-width:960px){.pdp{grid-template-columns:1fr}.pdp-gallery{position:static}}
"""

E["e07-cart-drawer.css"] = """/* e07 — CART DRAWER · slide-in glass cart */
.cart-drawer{position:fixed;inset:0;z-index:85;pointer-events:none}
.cd-scrim{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity var(--e-d-med);backdrop-filter:blur(4px)}
.cd-panel{position:absolute;top:0;right:0;bottom:0;width:min(420px,92vw);display:flex;flex-direction:column;background:rgba(6,6,7,.88);backdrop-filter:blur(36px) saturate(130%);border-left:1px solid var(--e-line-strong);transform:translateX(102%);transition:transform var(--e-d-slow) var(--e-ease-out);box-shadow:var(--e-el-pop)}
.cart-drawer.open{pointer-events:auto}.cart-drawer.open .cd-scrim{opacity:1}
.cart-drawer.open .cd-panel{transform:none}
.cd-head{display:flex;justify-content:space-between;align-items:center;padding:var(--e-sp-4) var(--e-sp-5);border-bottom:1px solid var(--e-line)}
.cd-head h3{margin:0;font:900 14px/1 'Unbounded',sans-serif;letter-spacing:.14em;color:var(--e-ink)}
.cd-items{flex:1;overflow-y:auto;padding:var(--e-sp-4) var(--e-sp-5);display:flex;flex-direction:column;gap:var(--e-sp-4)}
.line-item{display:grid;grid-template-columns:64px 1fr auto;gap:var(--e-sp-3);align-items:center;padding-bottom:var(--e-sp-4);border-bottom:1px dashed var(--e-line);animation:li-in var(--e-d-med) var(--e-ease-out)}
@keyframes li-in{from{opacity:0;transform:translateY(8px)}}
.li-thumb{width:64px;height:72px;border-radius:10px;overflow:hidden;border:1px solid var(--e-line);background:var(--e-bg-sunken)}
.li-thumb img{width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
.li-name{font-size:13px;font-weight:600;color:var(--e-ink);line-height:1.3}
.li-meta{font:400 10px/1.4 'JetBrains Mono',monospace;color:var(--e-ink-3);letter-spacing:.1em;margin-top:4px}
.li-price{font:700 13px/1 'JetBrains Mono',monospace;color:var(--e-ink);text-align:right}
.li-x{background:none;border:0;color:var(--e-ink-3);cursor:pointer;font-size:14px;padding:4px}
.li-x:hover{color:var(--e-ink)}
.cd-empty{flex:1;display:grid;place-items:center;color:var(--e-ink-3);font:400 12px/1.6 'JetBrains Mono',monospace;text-align:center;padding:var(--e-sp-6)}
.cd-foot{border-top:1px solid var(--e-line-strong);padding:var(--e-sp-4) var(--e-sp-5) calc(var(--e-sp-4) + env(safe-area-inset-bottom))}
.cd-row{display:flex;justify-content:space-between;font-size:13px;color:var(--e-ink-2);margin-bottom:8px}
.cd-row.total{font:700 17px/1 'JetBrains Mono',monospace;color:var(--e-ink);margin:var(--e-sp-3) 0}
.cd-checkout{width:100%;padding:15px;border-radius:var(--e-r-pill);border:1px solid var(--e-ink);background:var(--e-ink);color:#000;font:900 12px/1 'Unbounded',sans-serif;letter-spacing:.16em;cursor:pointer;transition:opacity var(--e-d-fast)}
.cd-checkout:hover{opacity:.85}
"""

E["e08-checkout.css"] = """/* e08 — CHECKOUT · stepped form + summary rail */
.checkout{display:grid;grid-template-columns:1.2fr .8fr;gap:var(--e-sp-8);max-width:1200px;margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.co-steps{display:flex;gap:var(--e-sp-4);margin-bottom:var(--e-sp-6)}
.co-step{display:flex;align-items:center;gap:10px;font:600 11px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:var(--e-ink-4)}
.co-step b{width:26px;height:26px;border-radius:50%;border:1px solid var(--e-line);display:grid;place-items:center;font-weight:700}
.co-step.on{color:var(--e-ink)}.co-step.on b{background:var(--e-ink);color:#000;border-color:var(--e-ink)}
.co-step.done b{border-color:var(--e-ink);color:var(--e-ink)}
.co-form{display:flex;flex-direction:column;gap:var(--e-sp-4)}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.22em;color:var(--e-ink-3)}
.field input,.field select{padding:14px 16px;border-radius:var(--e-r-md);border:1px solid var(--e-line);background:rgba(255,255,255,.04);color:var(--e-ink);font:400 15px/1.2 'Space Grotesk',sans-serif;outline:none;transition:border-color var(--e-d-fast),background var(--e-d-fast)}
.field input:focus,.field select:focus{border-color:var(--e-ink);background:rgba(255,255,255,.07)}
.field input::placeholder{color:var(--e-ink-4)}
.field.err input{border-color:rgba(255,255,255,.9);animation:shake .3s}
@keyframes shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.field .hint{font-size:11px;color:var(--e-ink-3)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:var(--e-sp-3)}
.co-summary{position:sticky;top:96px;align-self:start;border-radius:var(--e-r-lg);border:1px solid var(--e-line-strong);background:rgba(255,255,255,.04);backdrop-filter:blur(24px);padding:var(--e-sp-5)}
.co-summary h4{margin:0 0 var(--e-sp-4);font:900 13px/1 'Unbounded',sans-serif;letter-spacing:.16em;color:var(--e-ink)}
.pay-brands{display:flex;gap:8px;margin-top:var(--e-sp-3)}
.pay-brand{padding:6px 10px;border:1px solid var(--e-line);border-radius:8px;font:700 10px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
@media(max-width:900px){.checkout{grid-template-columns:1fr}.co-summary{position:static}}
"""

E["e09-search-overlay.css"] = """/* e09 — SEARCH OVERLAY · command-palette search */
.search-ov{position:fixed;inset:0;z-index:90;display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.72);backdrop-filter:blur(28px) saturate(120%);opacity:0;pointer-events:none;transition:opacity var(--e-d-med)}
.search-ov.open{opacity:1;pointer-events:auto}
.so-box{width:min(680px,92vw);margin-top:12vh}
.so-input-row{display:flex;align-items:center;gap:var(--e-sp-3);padding:var(--e-sp-4);border-radius:var(--e-r-lg);border:1px solid var(--e-line-strong);background:rgba(255,255,255,.05)}
.so-input-row svg{width:20px;height:20px;stroke:var(--e-ink-3);fill:none;stroke-width:1.8;flex:none}
.so-input{flex:1;background:none;border:0;outline:none;color:var(--e-ink);font:400 clamp(18px,3vw,26px)/1.2 'Space Grotesk',sans-serif}
.so-input::placeholder{color:var(--e-ink-4)}
.so-kbd{font:700 10px/1 'JetBrains Mono',monospace;color:var(--e-ink-3);border:1px solid var(--e-line);border-radius:6px;padding:5px 8px}
.so-hints{margin-top:var(--e-sp-4);display:flex;flex-wrap:wrap;gap:8px}
.so-hint{padding:8px 14px;border-radius:var(--e-r-pill);border:1px solid var(--e-line);color:var(--e-ink-2);font-size:13px;cursor:pointer;transition:all var(--e-d-fast)}
.so-hint:hover{background:var(--e-ink);color:#000}
.so-results{margin-top:var(--e-sp-4);border:1px solid var(--e-line);border-radius:var(--e-r-lg);overflow:hidden auto;background:rgba(8,8,9,.6);max-height:46vh}
.so-res{display:flex;align-items:center;gap:var(--e-sp-3);padding:var(--e-sp-3) var(--e-sp-4);cursor:pointer;border-bottom:1px solid var(--e-line);transition:background var(--e-d-fast)}
.so-res:last-child{border-bottom:0}
.so-res:hover,.so-res.sel{background:rgba(255,255,255,.07)}
.so-res img{width:40px;height:40px;border-radius:8px;object-fit:cover;filter:grayscale(1)}
.so-res .rname{flex:1;font-size:14px;color:var(--e-ink)}
.so-res .rprice{font:700 13px/1 'JetBrains Mono',monospace;color:var(--e-ink-2)}
.so-none{padding:var(--e-sp-5);text-align:center;color:var(--e-ink-3);font:400 12px/1.6 'JetBrains Mono',monospace}
"""

E["e10-wishlist.css"] = """/* e10 — WISHLIST · saved items board */
.wish-board{max-width:var(--e-maxw);margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.wish-head{display:flex;align-items:baseline;gap:var(--e-sp-4);margin-bottom:var(--e-sp-6)}
.wish-head h2{margin:0;font:700 var(--e-fs-h2)/1 'Unbounded',sans-serif;color:var(--e-ink)}
.wish-head span{font:400 12px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
.wish-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:var(--e-sp-4)}
.wish-move.moving{animation:wish-fly var(--e-d-med) var(--e-ease-out)}
@keyframes wish-fly{40%{transform:translateY(-10px) scale(.96);opacity:.6}}
.wish-empty{text-align:center;padding:var(--e-sp-10) var(--e-sp-5);color:var(--e-ink-3)}
.wish-empty .we-orb{width:84px;height:84px;margin:0 auto var(--e-sp-4);border-radius:50%;border:1px dashed var(--e-line-strong);display:grid;place-items:center;font-size:26px;color:var(--e-ink-4);animation:banner-spin 24s linear infinite}
"""

E["e11-collection.css"] = """/* e11 — COLLECTIONS · editorial split banners + lookbook */
.collections{max-width:var(--e-maxw);margin:0 auto;padding:var(--e-sp-8) var(--e-gutter);display:grid;grid-template-columns:repeat(12,1fr);gap:var(--e-sp-4)}
.coll{position:relative;grid-column:span 6;min-height:340px;border-radius:var(--e-r-xl);overflow:hidden;border:1px solid var(--e-line);background:var(--e-bg-sunken);display:flex;align-items:flex-end;text-decoration:none;transition:border-color var(--e-d-med),transform var(--e-d-med) var(--e-ease)}
.coll:hover{border-color:var(--e-line-strong);transform:translateY(-4px)}
.coll.tall{grid-column:span 4;min-height:460px}
.coll.wide{grid-column:span 8}
.coll-bg{position:absolute;inset:0;filter:grayscale(1) contrast(1.1) brightness(.55);transition:transform var(--e-d-slow) var(--e-ease-out),filter var(--e-d-med)}
.coll:hover .coll-bg{transform:scale(1.05);filter:grayscale(1) contrast(1.15) brightness(.7)}
.coll-copy{position:relative;padding:var(--e-sp-5);z-index:2}
.coll-kicker{font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.3em;color:var(--e-ink-3);margin-bottom:10px}
.coll-title{margin:0;font:700 var(--e-fs-h3)/1.1 'Unbounded',sans-serif;color:var(--e-ink)}
.coll-arrow{position:absolute;top:var(--e-sp-4);right:var(--e-sp-4);width:40px;height:40px;border-radius:50%;border:1px solid var(--e-line-strong);display:grid;place-items:center;color:var(--e-ink);transition:background var(--e-d-fast),color var(--e-d-fast);z-index:2;text-decoration:none}
.coll:hover .coll-arrow{background:var(--e-ink);color:#000}
.lookbook{grid-column:1/-1;display:flex;gap:var(--e-sp-3);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:var(--e-sp-2)}
.lb-item{flex:0 0 min(300px,72vw);scroll-snap-align:start;border-radius:var(--e-r-lg);overflow:hidden;border:1px solid var(--e-line);aspect-ratio:3/4;background:var(--e-bg-sunken)}
.lb-item img{width:100%;height:100%;object-fit:cover;filter:grayscale(1);transition:transform var(--e-d-slow)}
.lb-item:hover img{transform:scale(1.06)}
@media(max-width:800px){.coll,.coll.tall,.coll.wide{grid-column:1/-1;min-height:280px}}
"""

E["e12-promo-timer.css"] = """/* e12 — PROMO · countdown flip cells + ticker */
.promo-bar{display:flex;align-items:center;justify-content:center;gap:var(--e-sp-4);flex-wrap:wrap;padding:10px var(--e-gutter);border-bottom:1px solid var(--e-line);background:rgba(255,255,255,.04);backdrop-filter:blur(16px);font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:var(--e-ink-2)}
.promo-flip{display:inline-flex;gap:4px;align-items:center}
.pf-cell{min-width:30px;padding:6px;border-radius:8px;background:var(--e-ink);color:#000;font:700 14px/1 'JetBrains Mono',monospace;text-align:center;perspective:200px}
.pf-cell.tick{animation:pf-flip .5s var(--e-ease)}
@keyframes pf-flip{50%{transform:rotateX(70deg)}}
.pf-sep{color:var(--e-ink-3)}
.promo-link{color:var(--e-ink);text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.urgency{position:relative;overflow:hidden;border:1px solid var(--e-line);border-radius:var(--e-r-pill);padding:10px 18px}
.urgency .u-track{display:flex;gap:var(--e-sp-6);white-space:nowrap;animation:mq-roll 18s linear infinite}
@keyframes mq-roll{to{transform:translateX(-50%)}}
"""

for name, body in E.items():
    with open(os.path.join(ECOM, name), "w") as f:
        f.write(body)
print("batch1 written:", len(E))
