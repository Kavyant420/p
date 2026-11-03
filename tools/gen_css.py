#!/usr/bin/env python3
"""Generates the 100 CSS files (ecom + gfx) for NEXVS. Idempotent."""
import os

ROOT = "/workspace"
ECOM = os.path.join(ROOT, "css/ecom")
GFX = os.path.join(ROOT, "css/gfx")
os.makedirs(ECOM, exist_ok=True)
os.makedirs(GFX, exist_ok=True)

E = {}

E["e13-reviews.css"] = """/* e13 — REVIEWS · rating summary bars + review cards */
.reviews{max-width:900px;margin:0 auto;padding:var(--e-sp-8) var(--e-gutter)}
.rev-summary{display:grid;grid-template-columns:auto 1fr;gap:var(--e-sp-6);align-items:center;margin-bottom:var(--e-sp-7)}
.rev-score{text-align:center}
.rev-score b{display:block;font:700 clamp(40px,6vw,64px)/1 'JetBrains Mono',monospace;color:var(--e-ink)}
.rev-score span{font:400 11px/1 'JetBrains Mono',monospace;letter-spacing:.2em;color:var(--e-ink-3)}
.rev-bars{display:flex;flex-direction:column;gap:8px}
.rev-bar{display:grid;grid-template-columns:34px 1fr 40px;gap:12px;align-items:center;font:400 11px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
.rb-track{height:6px;border-radius:3px;background:rgba(255,255,255,.1);overflow:hidden}
.rb-fill{height:100%;background:var(--e-ink);border-radius:3px;transform-origin:left;transform:scaleX(0);transition:transform .8s var(--e-ease-out)}
.rb-fill.on{transform:scaleX(var(--pct,.5))}
.review{border-top:1px solid var(--e-line);padding:var(--e-sp-5) 0}
.rv-head{display:flex;align-items:center;gap:var(--e-sp-3);margin-bottom:var(--e-sp-2)}
.rv-avatar{width:36px;height:36px;border-radius:50%;border:1px solid var(--e-line-strong);display:grid;place-items:center;font:700 13px/1 'JetBrains Mono',monospace;color:var(--e-ink);background:rgba(255,255,255,.05)}
.rv-name{font-size:14px;font-weight:600;color:var(--e-ink)}
.rv-date{margin-left:auto;font:400 10px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
.rv-body{color:var(--e-ink-2);font-size:15px;line-height:1.65;margin:0}
.rv-verified{display:inline-flex;gap:6px;align-items:center;margin-top:10px;font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.16em;color:var(--e-ink-3)}
"""

E["e14-account.css"] = """/* e14 — ACCOUNT · profile hub, order history */
.account{max-width:1100px;margin:0 auto;padding:var(--e-sp-7) var(--e-gutter);display:grid;grid-template-columns:240px 1fr;gap:var(--e-sp-7)}
.acc-nav{display:flex;flex-direction:column;gap:4px;position:sticky;top:96px;align-self:start}
.acc-link{padding:12px 16px;border-radius:var(--e-r-md);color:var(--e-ink-2);text-decoration:none;font-size:14px;border:1px solid transparent;transition:all var(--e-d-fast)}
.acc-link:hover{background:rgba(255,255,255,.05);color:var(--e-ink)}
.acc-link.on{border-color:var(--e-line-strong);background:rgba(255,255,255,.07);color:var(--e-ink);font-weight:600}
.acc-card{border:1px solid var(--e-line);border-radius:var(--e-r-lg);background:rgba(255,255,255,.03);backdrop-filter:blur(18px);padding:var(--e-sp-5);margin-bottom:var(--e-sp-4)}
.order-row{display:grid;grid-template-columns:110px 1fr auto auto;gap:var(--e-sp-4);align-items:center;padding:var(--e-sp-4) 0;border-bottom:1px dashed var(--e-line)}
.order-row:last-child{border-bottom:0}
.or-id{font:700 12px/1 'JetBrains Mono',monospace;color:var(--e-ink)}
.or-sum{font-size:13px;color:var(--e-ink-3)}
.or-status{font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.14em;padding:6px 12px;border-radius:var(--e-r-pill);border:1px solid var(--e-line-strong);color:var(--e-ink)}
.or-price{font:700 14px/1 'JetBrains Mono',monospace;color:var(--e-ink)}
@media(max-width:800px){.account{grid-template-columns:1fr}.acc-nav{position:static;flex-direction:row;overflow-x:auto}}
"""

E["e15-footer-store.css"] = """/* e15 — STORE FOOTER · newsletter + link columns */
.store-foot{border-top:1px solid var(--e-line);background:rgba(2,2,3,.7);backdrop-filter:blur(24px);padding:var(--e-sp-9) var(--e-gutter) calc(var(--e-sp-6) + env(safe-area-inset-bottom));margin-top:var(--e-sp-9)}
.sf-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:var(--e-sp-7);max-width:var(--e-maxw);margin:0 auto}
.sf-news h3{margin:0 0 var(--e-sp-3);font:700 var(--e-fs-h3)/1.2 'Unbounded',sans-serif;color:var(--e-ink)}
.sf-news p{color:var(--e-ink-3);font-size:14px;margin:0 0 var(--e-sp-4)}
.sf-form{display:flex;border:1px solid var(--e-line-strong);border-radius:var(--e-r-pill);overflow:hidden;background:rgba(255,255,255,.04)}
.sf-form input{flex:1;min-width:0;background:none;border:0;outline:none;padding:14px 18px;color:var(--e-ink);font-size:14px}
.sf-form button{border:0;background:var(--e-ink);color:#000;padding:0 22px;font:900 11px/1 'Unbounded',sans-serif;letter-spacing:.14em;cursor:pointer}
.sf-col h4{font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.24em;color:var(--e-ink-3);margin:0 0 var(--e-sp-4)}
.sf-col a{display:block;padding:6px 0;color:var(--e-ink-2);text-decoration:none;font-size:14px;transition:color var(--e-d-fast)}
.sf-col a:hover{color:var(--e-ink)}
.sf-bottom{max-width:var(--e-maxw);margin:var(--e-sp-7) auto 0;padding-top:var(--e-sp-4);border-top:1px solid var(--e-line);display:flex;justify-content:space-between;gap:var(--e-sp-4);flex-wrap:wrap;font:400 11px/1.6 'JetBrains Mono',monospace;color:var(--e-ink-3)}
@media(max-width:900px){.sf-grid{grid-template-columns:1fr 1fr}}
"""

E["e16-toasts.css"] = """/* e16 — TOASTS · glass snack notifications */
.ecom-toasts{position:fixed;bottom:calc(var(--e-sp-6) + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:95;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none;width:min(420px,92vw)}
.etoast{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;border-radius:var(--e-r-pill);border:1px solid var(--e-line-strong);background:rgba(8,8,9,.85);backdrop-filter:blur(26px) saturate(130%);color:var(--e-ink);font-size:13px;box-shadow:var(--e-el-3);animation:et-in var(--e-d-med) var(--e-ease-out)}
.etoast.out{animation:et-out var(--e-d-med) var(--e-ease) forwards}
@keyframes et-in{from{opacity:0;transform:translateY(16px) scale(.96)}}
@keyframes et-out{to{opacity:0;transform:translateY(10px) scale(.97)}}
.et-ic{width:26px;height:26px;border-radius:50%;border:1px solid var(--e-line-strong);display:grid;place-items:center;font-size:12px;flex:none}
.et-act{margin-left:auto;background:none;border:0;color:var(--e-ink);font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.12em;text-decoration:underline;cursor:pointer}
"""

E["e17-skeletons.css"] = """/* e17 — SKELETONS · shimmer placeholders */
.sk{position:relative;overflow:hidden;background:rgba(255,255,255,.06);border-radius:var(--e-r-md)}
.sk::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.09),transparent);animation:sk-shim 1.4s infinite}
@keyframes sk-shim{to{transform:translateX(100%)}}
.sk-card{height:340px;border-radius:var(--e-r-lg)}
.sk-line{height:12px;margin:10px 0}.sk-line.w60{width:60%}.sk-line.w40{width:40%}
.sk-circle{width:44px;height:44px;border-radius:50%}
@media(prefers-reduced-motion:reduce){.sk::after{animation:none}}
"""

E["e18-empty-states.css"] = """/* e18 — EMPTY STATES · editorial zero-data screens */
.empty-state{text-align:center;padding:var(--e-sp-10) var(--e-sp-5);max-width:480px;margin:0 auto}
.es-mark{width:110px;height:110px;margin:0 auto var(--e-sp-5);border-radius:50%;position:relative;border:1px dashed var(--e-line-strong);display:grid;place-items:center}
.es-mark::before{content:"";position:absolute;inset:14px;border-radius:50%;border:1px solid var(--e-line);animation:pulse-ring 3s ease-out infinite}
@keyframes pulse-ring{0%{transform:scale(.7);opacity:1}100%{transform:scale(1.25);opacity:0}}
.es-mark i{font-style:normal;font-size:30px;color:var(--e-ink-3)}
.es-title{margin:0 0 10px;font:700 var(--e-fs-h3)/1.2 'Unbounded',sans-serif;color:var(--e-ink)}
.es-copy{margin:0 0 var(--e-sp-5);color:var(--e-ink-3);font-size:14px;line-height:1.6}
"""

E["e19-promo-modals.css"] = """/* e19 — PROMO MODALS · drop alert gate */
.modal-ov{position:fixed;inset:0;z-index:92;display:grid;place-items:center;padding:var(--e-sp-4);background:rgba(0,0,0,.7);backdrop-filter:blur(18px);opacity:0;pointer-events:none;transition:opacity var(--e-d-med)}
.modal-ov.open{opacity:1;pointer-events:auto}
.modal-card{position:relative;width:min(520px,94vw);border-radius:var(--e-r-xl);border:1px solid var(--e-line-strong);background:rgba(7,7,8,.9);backdrop-filter:blur(30px) saturate(130%);box-shadow:var(--e-el-pop);padding:var(--e-sp-7);text-align:center;transform:translateY(20px) scale(.97);transition:transform var(--e-d-slow) var(--e-ease-out)}
.modal-ov.open .modal-card{transform:none}
.mc-kicker{font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.3em;color:var(--e-ink-3);margin-bottom:var(--e-sp-3)}
.mc-title{margin:0 0 var(--e-sp-3);font:900 clamp(22px,3.4vw,32px)/1.05 'Unbounded',sans-serif;color:var(--e-ink)}
.mc-copy{color:var(--e-ink-2);font-size:14px;line-height:1.6;margin:0 0 var(--e-sp-5)}
.mc-code{display:inline-block;padding:12px 22px;border:1px dashed var(--e-line-strong);border-radius:var(--e-r-md);font:700 16px/1 'JetBrains Mono',monospace;letter-spacing:.3em;color:var(--e-ink);margin-bottom:var(--e-sp-5);cursor:copy}
.mc-actions{display:flex;gap:var(--e-sp-3);justify-content:center;flex-wrap:wrap}
"""

E["e20-sizeguide.css"] = """/* e20 — SIZE GUIDE · table */
.sizeguide{max-width:860px;margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.sg-table{width:100%;border-collapse:collapse;font:400 13px/1 'JetBrains Mono',monospace}
.sg-table th{font-weight:700;letter-spacing:.16em;font-size:10px;color:var(--e-ink-3);text-transform:uppercase;padding:12px;border-bottom:1px solid var(--e-line-strong);text-align:left}
.sg-table td{padding:14px 12px;border-bottom:1px solid var(--e-line);color:var(--e-ink-2)}
.sg-table tr:hover td{background:rgba(255,255,255,.04);color:var(--e-ink)}
.sg-note{margin-top:var(--e-sp-4);font-size:12px;color:var(--e-ink-3);line-height:1.6}
"""

E["e21-trust.css"] = """/* e21 — TRUST STRIP · guarantees band */
.trust-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--e-line);border-top:1px solid var(--e-line);border-bottom:1px solid var(--e-line)}
.ts-cell{background:#000;padding:var(--e-sp-5) var(--e-sp-4);display:flex;flex-direction:column;gap:8px;align-items:center;text-align:center;transition:background var(--e-d-fast)}
.ts-cell:hover{background:rgba(255,255,255,.04)}
.ts-ic{width:34px;height:34px;border-radius:50%;border:1px solid var(--e-line-strong);display:grid;place-items:center;color:var(--e-ink);font-size:14px}
.ts-t{font:700 11px/1.4 'JetBrains Mono',monospace;letter-spacing:.18em;color:var(--e-ink)}
.ts-s{font-size:11px;color:var(--e-ink-3)}
@media(max-width:760px){.trust-strip{grid-template-columns:repeat(2,1fr)}}
"""

E["e22-bestsellers.css"] = """/* e22 — BESTSELLERS · numbered horizontal rail */
.best{padding:var(--e-sp-8) 0;background:rgba(255,255,255,.02);border-top:1px solid var(--e-line);border-bottom:1px solid var(--e-line)}
.best-head{display:flex;align-items:baseline;gap:var(--e-sp-4);padding:0 var(--e-gutter);margin-bottom:var(--e-sp-5)}
.best-head h2{margin:0;font:700 var(--e-fs-h2)/1 'Unbounded',sans-serif;color:var(--e-ink)}
.best-rail{display:flex;gap:var(--e-sp-4);overflow-x:auto;scroll-snap-type:x mandatory;padding:var(--e-sp-2) var(--e-gutter) var(--e-sp-5)}
.best-item{flex:0 0 min(280px,78vw);scroll-snap-align:start;position:relative}
.best-rank{position:absolute;top:-6px;left:-4px;z-index:3;font:900 clamp(48px,6vw,76px)/1 'Unbounded',sans-serif;-webkit-text-stroke:1px rgba(255,255,255,.5);color:transparent;pointer-events:none}
"""

E["e23-category-tiles.css"] = """/* e23 — CATEGORY TILES · shop-by-circle grid */
.cat-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--e-sp-4);padding:var(--e-sp-7) var(--e-gutter);max-width:var(--e-maxw);margin:0 auto}
.cat-tile{position:relative;display:flex;flex-direction:column;gap:10px;align-items:center;text-decoration:none;color:var(--e-ink)}
.ct-ring{width:clamp(88px,12vw,120px);aspect-ratio:1;border-radius:50%;border:1px solid var(--e-line-strong);display:grid;place-items:center;overflow:hidden;transition:transform var(--e-d-med) var(--e-ease),border-color var(--e-d-med);background:var(--e-bg-sunken)}
.cat-tile:hover .ct-ring{transform:scale(1.06);border-color:var(--e-ink)}
.ct-ring img{width:100%;height:100%;object-fit:cover;filter:grayscale(1);transition:transform var(--e-d-slow)}
.cat-tile:hover .ct-ring img{transform:scale(1.12)}
.ct-name{font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.18em;text-transform:uppercase}
.ct-count{font:400 10px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
"""

E["e24-quickview.css"] = """/* e24 — QUICK VIEW · modal product peek */
.qv-ov{position:fixed;inset:0;z-index:91;display:grid;place-items:center;padding:var(--e-sp-4);background:rgba(0,0,0,.66);backdrop-filter:blur(16px);opacity:0;pointer-events:none;transition:opacity var(--e-d-med)}
.qv-ov.open{opacity:1;pointer-events:auto}
.qv-card{display:grid;grid-template-columns:1fr 1fr;gap:var(--e-sp-5);width:min(860px,94vw);max-height:86vh;overflow:auto;border-radius:var(--e-r-xl);border:1px solid var(--e-line-strong);background:rgba(6,6,7,.9);backdrop-filter:blur(30px);box-shadow:var(--e-el-pop);padding:var(--e-sp-5);transform:scale(.96);transition:transform var(--e-d-slow) var(--e-ease-out)}
.qv-ov.open .qv-card{transform:none}
.qv-img{border-radius:var(--e-r-lg);overflow:hidden;aspect-ratio:1/1.1;background:var(--e-bg-sunken)}
.qv-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
.qv-info{display:flex;flex-direction:column;gap:var(--e-sp-3);color:var(--e-ink-2)}
.qv-info h3{margin:0;font:700 var(--e-fs-h3)/1.2 'Unbounded',sans-serif;color:var(--e-ink)}
.qv-x{position:sticky;top:0;align-self:end;background:none;border:1px solid var(--e-line);border-radius:50%;width:34px;height:34px;color:var(--e-ink);cursor:pointer}
@media(max-width:640px){.qv-card{grid-template-columns:1fr}}
"""

E["e25-related.css"] = """/* e25 — RELATED PRODUCTS · rail */
.related{padding:var(--e-sp-7) 0;border-top:1px solid var(--e-line)}
.related h3{margin:0 var(--e-gutter) var(--e-sp-4);font:700 var(--e-fs-h3)/1 'Unbounded',sans-serif;color:var(--e-ink)}
.rel-rail{display:flex;gap:var(--e-sp-4);overflow-x:auto;padding:0 var(--e-gutter) var(--e-sp-3);scroll-snap-type:x proximity}
.rel-rail .pcard{flex:0 0 min(240px,74vw);scroll-snap-align:start}
"""

E["e26-newdrops.css"] = """/* e26 — NEW DROPS · marquee ticker */
.drops-marquee{border-top:1px solid var(--e-line);border-bottom:1px solid var(--e-line);overflow:hidden;background:rgba(255,255,255,.02)}
.dm-track{display:flex;gap:var(--e-sp-7);white-space:nowrap;padding:14px 0;animation:mq-roll 30s linear infinite;width:max-content}
.drops-marquee:hover .dm-track{animation-play-state:paused}
.dm-item{display:inline-flex;align-items:center;gap:10px;font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:var(--e-ink-2)}
.dm-item b{color:var(--e-ink)}
.dm-dot{width:5px;height:5px;border-radius:50%;background:var(--e-ink);opacity:.5}
"""

E["e27-editorial.css"] = """/* e27 — EDITORIAL · lookbook story split with pinned image */
.editorial{display:grid;grid-template-columns:1fr 1fr;min-height:90vh;border-top:1px solid var(--e-line)}
.ed-media{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--e-bg-sunken)}
.ed-media img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.05)}
.ed-copy{padding:var(--e-sp-9) var(--e-gutter)}
.ed-num{font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.3em;color:var(--e-ink-3);margin-bottom:var(--e-sp-4)}
.ed-copy h2{margin:0 0 var(--e-sp-4);font:900 var(--e-fs-h1)/1 'Unbounded',sans-serif;color:var(--e-ink)}
.ed-copy p{color:var(--e-ink-2);font-size:16px;line-height:1.75;max-width:52ch}
@media(max-width:860px){.editorial{grid-template-columns:1fr}.ed-media{position:static;height:56vh}}
"""

E["e28-brandstory.css"] = """/* e28 — BRAND STORY · timeline spine */
.story{max-width:820px;margin:0 auto;padding:var(--e-sp-8) var(--e-gutter);position:relative}
.story::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:1px;background:var(--e-line)}
.st-item{display:grid;grid-template-columns:1fr 60px 1fr;align-items:center;margin-bottom:var(--e-sp-6)}
.st-node{width:12px;height:12px;border-radius:50%;background:var(--e-ink);justify-self:center;box-shadow:0 0 0 6px rgba(255,255,255,.08)}
.st-year{font:700 12px/1 'JetBrains Mono',monospace;letter-spacing:.2em;color:var(--e-ink-3)}
.st-text{font-size:14px;color:var(--e-ink-2);line-height:1.6}
.st-item:nth-child(odd) .st-year{grid-column:1;text-align:right;padding-right:var(--e-sp-4)}
.st-item:nth-child(odd) .st-node{grid-column:2}
.st-item:nth-child(odd) .st-text{grid-column:3;padding-left:var(--e-sp-4)}
.st-item:nth-child(even) .st-text{grid-column:1;text-align:right;padding-right:var(--e-sp-4)}
.st-item:nth-child(even) .st-node{grid-column:2}
.st-item:nth-child(even) .st-year{grid-column:3;padding-left:var(--e-sp-4)}
"""

E["e29-support.css"] = """/* e29 — SUPPORT · FAQ accordion */
.support{max-width:820px;margin:0 auto;padding:var(--e-sp-8) var(--e-gutter)}
.faq{border-bottom:1px solid var(--e-line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:var(--e-sp-4);padding:var(--e-sp-4) 0;font-size:16px;font-weight:600;color:var(--e-ink)}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-family:'JetBrains Mono',monospace;color:var(--e-ink-3);transition:transform var(--e-d-med)}
.faq[open] summary::after{transform:rotate(45deg)}
.faq-body{padding:0 0 var(--e-sp-4);color:var(--e-ink-2);font-size:14px;line-height:1.7}
"""

E["e30-policy.css"] = """/* e30 — POLICY PAGES · legal typography */
.policy{max-width:720px;margin:0 auto;padding:var(--e-sp-8) var(--e-gutter)}
.policy h1{font:900 var(--e-fs-h1)/1.05 'Unbounded',sans-serif;color:var(--e-ink);margin:0 0 var(--e-sp-3)}
.policy h2{font:700 var(--e-fs-h3)/1.2 'Unbounded',sans-serif;color:var(--e-ink);margin:var(--e-sp-7) 0 var(--e-sp-3)}
.policy p{color:var(--e-ink-2);font-size:15px;line-height:1.8;margin:0 0 var(--e-sp-4)}
.policy ul{color:var(--e-ink-2);font-size:15px;line-height:1.9;padding-left:20px}
.policy .stamp{display:inline-block;margin-top:var(--e-sp-6);font:400 11px/1 'JetBrains Mono',monospace;letter-spacing:.2em;color:var(--e-ink-3);border:1px solid var(--e-line);border-radius:var(--e-r-pill);padding:8px 14px}
"""

E["e31-mobile-tabs.css"] = """/* e31 — MOBILE TAB BAR · thumb-zone commerce nav */
.tabbar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:none;justify-content:space-around;padding:8px 8px calc(8px + env(safe-area-inset-bottom));background:rgba(4,4,5,.82);backdrop-filter:blur(30px) saturate(130%);border-top:1px solid var(--e-line-strong)}
.tab-i{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 10px;border-radius:14px;color:var(--e-ink-3);text-decoration:none;font:600 9px/1 'JetBrains Mono',monospace;letter-spacing:.1em;transition:color var(--e-d-fast),background var(--e-d-fast)}
.tab-i svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7}
.tab-i.on{color:var(--e-ink);background:rgba(255,255,255,.07)}
@media(max-width:760px){.tabbar{display:flex}}
"""

E["e32-sale-banner.css"] = """/* e32 — SALE BANNER · inverted slab with diagonal rule */
.sale-slab{position:relative;overflow:hidden;background:var(--e-ink);color:#000;padding:var(--e-sp-6) var(--e-gutter);display:flex;align-items:center;justify-content:space-between;gap:var(--e-sp-4);flex-wrap:wrap}
.sale-slab::before{content:"";position:absolute;inset:-40%;background:repeating-linear-gradient(-45deg,transparent 0 26px,rgba(0,0,0,.06) 26px 28px);pointer-events:none}
.ss-h{margin:0;font:900 clamp(24px,4vw,44px)/1 'Unbounded',sans-serif;letter-spacing:-.01em}
.ss-sub{font:600 12px/1 'JetBrains Mono',monospace;letter-spacing:.2em;margin-top:8px}
.ss-btn{position:relative;padding:14px 26px;border-radius:var(--e-r-pill);background:#000;color:var(--e-ink);border:0;font:900 12px/1 'Unbounded',sans-serif;letter-spacing:.14em;cursor:pointer;transition:transform var(--e-d-fast)}
.ss-btn:hover{transform:translateY(-2px)}
"""

E["e33-order-track.css"] = """/* e33 — ORDER TRACKING · status pipeline */
.track{max-width:860px;margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.tk-pipe{display:flex;align-items:center;margin:var(--e-sp-5) 0}
.tk-stop{display:flex;flex-direction:column;align-items:center;gap:8px;flex:none;width:96px}
.tk-dot{width:14px;height:14px;border-radius:50%;border:1px solid var(--e-line-strong);background:#000}
.tk-stop.done .tk-dot{background:var(--e-ink);border-color:var(--e-ink)}
.tk-stop.now .tk-dot{background:var(--e-ink);animation:pulse-ring 2s ease-out infinite}
.tk-lab{font:600 9px/1.3 'JetBrains Mono',monospace;letter-spacing:.12em;color:var(--e-ink-3);text-align:center}
.tk-stop.done .tk-lab,.tk-stop.now .tk-lab{color:var(--e-ink)}
.tk-seg{flex:1;height:1px;background:var(--e-line);position:relative}
.tk-seg.done{background:var(--e-ink)}
.tk-seg .truck{position:absolute;top:-6px;left:0;width:12px;height:12px;border-radius:50%;background:var(--e-ink);box-shadow:0 0 12px rgba(255,255,255,.6);transition:left 1.2s var(--e-ease-out)}
"""

E["e34-virtualtryon.css"] = """/* e34 — FIT ROOM · AR try-on frame */
.fitroom{position:relative;max-width:520px;margin:0 auto;border-radius:var(--e-r-xl);overflow:hidden;border:1px solid var(--e-line-strong);background:var(--e-bg-sunken);aspect-ratio:3/4;display:grid;place-items:center}
.fr-guide{position:absolute;inset:12%;border:1px dashed rgba(255,255,255,.35);border-radius:50% 50% 42% 42%}
.fr-corner{position:absolute;width:26px;height:26px;border:solid var(--e-ink)}
.fr-corner.tl{top:14px;left:14px;border-width:2px 0 0 2px;border-radius:6px 0 0 0}
.fr-corner.tr{top:14px;right:14px;border-width:2px 2px 0 0;border-radius:0 6px 0 0}
.fr-corner.bl{bottom:14px;left:14px;border-width:0 0 2px 2px;border-radius:0 0 0 6px}
.fr-corner.br{bottom:14px;right:14px;border-width:0 2px 2px 0;border-radius:0 0 6px 0}
.fr-scan{position:absolute;left:8%;right:8%;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent);animation:fr-sweep 2.6s ease-in-out infinite}
@keyframes fr-sweep{0%,100%{top:12%}50%{top:86%}}
.fr-cta{position:relative;z-index:2;padding:14px 26px;border-radius:var(--e-r-pill);border:1px solid var(--e-ink);background:rgba(0,0,0,.5);backdrop-filter:blur(10px);color:var(--e-ink);font:900 12px/1 'Unbounded',sans-serif;letter-spacing:.14em;cursor:pointer}
"""

E["e35-gift.css"] = """/* e35 — GIFT OPTIONS · wrap selector + note */
.gift-box{border:1px solid var(--e-line);border-radius:var(--e-r-lg);padding:var(--e-sp-5);background:rgba(255,255,255,.03)}
.gb-title{margin:0 0 var(--e-sp-4);font:700 13px/1 'Unbounded',sans-serif;letter-spacing:.14em;color:var(--e-ink)}
.wrap-row{display:flex;gap:10px;margin-bottom:var(--e-sp-4)}
.wrap-opt{width:52px;height:52px;border-radius:14px;border:1px solid var(--e-line);cursor:pointer;position:relative;transition:border-color var(--e-d-fast);background:rgba(255,255,255,.05)}
.wrap-opt.on{border-color:var(--e-ink)}
.wrap-opt.on::after{content:"";position:absolute;inset:6px;border:1px solid var(--e-ink);border-radius:8px}
.gift-note{width:100%;min-height:84px;resize:vertical;border-radius:var(--e-r-md);border:1px solid var(--e-line);background:rgba(255,255,255,.04);color:var(--e-ink);padding:12px;font:400 14px/1.5 'Space Grotesk',sans-serif;outline:none}
.gift-note:focus{border-color:var(--e-ink)}
"""

E["e36-compare.css"] = """/* e36 — COMPARE TRAY + table */
.cmp-tray{position:fixed;left:50%;transform:translate(-50%,140%);bottom:calc(var(--e-sp-5) + env(safe-area-inset-bottom));z-index:78;display:flex;align-items:center;gap:var(--e-sp-3);padding:12px 16px;border-radius:var(--e-r-pill);border:1px solid var(--e-line-strong);background:rgba(6,6,7,.85);backdrop-filter:blur(28px);box-shadow:var(--e-el-3);transition:transform var(--e-d-slow) var(--e-ease-out)}
.cmp-tray.show{transform:translate(-50%,0)}
.cmp-slot{width:46px;height:54px;border-radius:10px;border:1px dashed var(--e-line-strong);overflow:hidden;background:var(--e-bg-sunken)}
.cmp-slot img{width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
.cmp-go{padding:10px 18px;border-radius:var(--e-r-pill);border:1px solid var(--e-ink);background:var(--e-ink);color:#000;font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.14em;cursor:pointer}
.cmp-table{width:100%;border-collapse:collapse;font-size:13px;color:var(--e-ink-2)}
.cmp-table th{font:700 10px/1 'JetBrains Mono',monospace;letter-spacing:.2em;color:var(--e-ink-3);text-align:left;padding:12px;border-bottom:1px solid var(--e-line-strong)}
.cmp-table td{padding:12px;border-bottom:1px solid var(--e-line)}
"""

E["e37-recently-viewed.css"] = """/* e37 — RECENTLY VIEWED · memory strip */
.recent{padding:var(--e-sp-6) var(--e-gutter);border-top:1px solid var(--e-line)}
.recent h4{margin:0 0 var(--e-sp-4);font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.26em;color:var(--e-ink-3)}
.rc-rail{display:flex;gap:var(--e-sp-3);overflow-x:auto;padding-bottom:6px}
.rc-chip{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:var(--e-r-pill);border:1px solid var(--e-line);background:rgba(255,255,255,.03);color:var(--e-ink-2);text-decoration:none;font-size:12px;transition:border-color var(--e-d-fast)}
.rc-chip:hover{border-color:var(--e-line-strong);color:var(--e-ink)}
.rc-chip img{width:34px;height:34px;border-radius:50%;object-fit:cover;filter:grayscale(1)}
"""

E["e38-stock-indicator.css"] = """/* e38 — STOCK INDICATOR · low-stock meter */
.stock-meter{margin:var(--e-sp-3) 0}
.sm-track{height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden}
.sm-fill{height:100%;background:var(--e-ink);transition:width .6s var(--e-ease-out)}
.sm-label{display:flex;justify-content:space-between;margin-top:8px;font:600 10px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:var(--e-ink-3)}
.sm-label.low{color:var(--e-ink)}
.live-viewers{display:inline-flex;align-items:center;gap:8px;font:400 11px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
.lv-dot{width:7px;height:7px;border-radius:50%;background:var(--e-ink);animation:lv-blip 1.6s infinite}
@keyframes lv-blip{0%,100%{opacity:1}50%{opacity:.25}}
"""

E["e39-nprogress.css"] = """/* e39 — SCROLL PROGRESS · beam + section dots */
.scroll-beam{position:fixed;top:0;left:0;height:2px;width:100%;z-index:99;background:transparent;pointer-events:none}
.sb-fill{height:100%;background:var(--e-ink);transform-origin:left;transform:scaleX(var(--sp,0));box-shadow:0 0 12px rgba(255,255,255,.5)}
.sec-dots{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:58;display:flex;flex-direction:column;gap:12px}
.sec-dot{width:8px;height:8px;border-radius:50%;border:1px solid var(--e-line-strong);background:transparent;cursor:pointer;transition:all var(--e-d-med)}
.sec-dot.on{background:var(--e-ink);transform:scale(1.3);box-shadow:0 0 10px rgba(255,255,255,.5)}
@media(max-width:760px){.sec-dots{display:none}}
"""

E["e40-checkout-done.css"] = """/* e40 — ORDER CONFIRMED · success screen */
.confirm{max-width:560px;margin:0 auto;padding:var(--e-sp-9) var(--e-gutter);text-align:center}
.cf-seal{width:120px;height:120px;margin:0 auto var(--e-sp-5);border-radius:50%;border:1px solid var(--e-ink);display:grid;place-items:center;position:relative;animation:cf-in .7s var(--e-ease-out)}
.cf-seal::before{content:"";position:absolute;inset:-10px;border-radius:50%;border:1px dashed var(--e-line-strong);animation:banner-spin 18s linear infinite}
.cf-seal svg{width:44px;height:44px;fill:none;stroke:var(--e-ink);stroke-width:2;stroke-dasharray:60;stroke-dashoffset:60;animation:cf-draw .8s .3s var(--e-ease-out) forwards}
@keyframes cf-in{from{transform:scale(.6);opacity:0}}
@keyframes cf-draw{to{stroke-dashoffset:0}}
.cf-title{margin:0 0 10px;font:900 var(--e-fs-h2)/1 'Unbounded',sans-serif;color:var(--e-ink)}
.cf-copy{color:var(--e-ink-2);font-size:15px;line-height:1.6;margin:0 0 var(--e-sp-5)}
.cf-id{display:inline-block;font:700 13px/1 'JetBrains Mono',monospace;letter-spacing:.2em;border:1px dashed var(--e-line-strong);border-radius:var(--e-r-md);padding:12px 18px;color:var(--e-ink);margin-bottom:var(--e-sp-6)}
"""

for name, body in E.items():
    with open(os.path.join(ECOM, name), "w") as f:
        f.write(body)
print("ecom written:", len(E))
