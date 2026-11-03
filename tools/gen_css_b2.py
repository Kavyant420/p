#!/usr/bin/env python3
"""Batch 2: e41-e50 ecommerce CSS."""
import os
ECOM = "/workspace/css/ecom"
E = {}

E["e41-storefront-seo.css"] = """/* e41 — SEO META UI · hreflang pills, canonical chips, JSON-LD badge */
.seo-bar{display:flex;gap:8px;flex-wrap:wrap;padding:var(--e-sp-4) var(--e-gutter);border-top:1px solid var(--e-line)}
.seo-chip{font:600 10px/1 'JetBrains Mono',monospace;letter-spacing:.16em;color:var(--e-ink-3);border:1px solid var(--e-line);border-radius:var(--e-r-pill);padding:7px 12px}
.seo-chip b{color:var(--e-ink)}
"""

E["e42-mini-cart-badge.css"] = """/* e42 — MINI CART PULSE · bump animation on add */
.cart-bump{animation:cb-pop .45s var(--e-ease-out)}
@keyframes cb-pop{30%{transform:scale(1.25) rotate(-6deg)}}
.fly-item{position:fixed;z-index:96;width:44px;height:52px;border-radius:8px;overflow:hidden;border:1px solid var(--e-line-strong);pointer-events:none;transition:transform .6s cubic-bezier(.5,-.3,.6,1),opacity .6s}
.fly-item img{width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
"""

E["e43-price-hold.css"] = """/* e43 — PRICE HOLD · locked price ribbon */
.hold-ribbon{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:var(--e-r-pill);border:1px dashed var(--e-line-strong);font:600 10px/1 'JetBrains Mono',monospace;letter-spacing:.16em;color:var(--e-ink-2)}
.hr-timer{font-weight:700;color:var(--e-ink)}
"""

E["e44-bundle-builder.css"] = """/* e44 — BUNDLE BUILDER · build-your-kit slots */
.bundle{max-width:var(--e-maxw);margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.bd-slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--e-sp-4);margin:var(--e-sp-5) 0}
.bd-slot{aspect-ratio:1;border-radius:var(--e-r-lg);border:1px dashed var(--e-line-strong);display:grid;place-items:center;background:rgba(255,255,255,.02);cursor:pointer;transition:border-color var(--e-d-fast),background var(--e-d-fast);overflow:hidden}
.bd-slot:hover{border-color:var(--e-ink)}
.bd-slot.filled{border-style:solid;background:var(--e-bg-sunken)}
.bd-slot img{width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
.bd-plus{font:300 30px/1 'JetBrains Mono',monospace;color:var(--e-ink-3)}
.bd-save{text-align:center;font:700 13px/1 'JetBrains Mono',monospace;letter-spacing:.14em;color:var(--e-ink);border:1px solid var(--e-ink);border-radius:var(--e-r-pill);padding:12px 20px;display:inline-block}
"""

E["e45-affiliate.css"] = """/* e45 — REFERRAL · share-a-link card */
.refer{max-width:640px;margin:0 auto;padding:var(--e-sp-7) var(--e-gutter);text-align:center}
.rf-link{display:flex;gap:8px;margin:var(--e-sp-4) 0}
.rf-link input{flex:1;min-width:0;background:rgba(255,255,255,.05);border:1px solid var(--e-line-strong);border-radius:var(--e-r-md);padding:12px;color:var(--e-ink);font:400 12px/1 'JetBrains Mono',monospace}
.rf-copy{border:1px solid var(--e-ink);background:var(--e-ink);color:#000;border-radius:var(--e-r-md);padding:0 18px;font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.14em;cursor:pointer}
"""

E["e46-storelocator.css"] = """/* e46 — STORE LOCATOR · map frame + list */
.locator{display:grid;grid-template-columns:1.2fr .8fr;gap:var(--e-sp-5);max-width:var(--e-maxw);margin:0 auto;padding:var(--e-sp-7) var(--e-gutter)}
.map-frame{border-radius:var(--e-r-xl);border:1px solid var(--e-line-strong);background:repeating-linear-gradient(0deg,transparent 0 39px,rgba(255,255,255,.05) 39px 40px),repeating-linear-gradient(90deg,transparent 0 39px,rgba(255,255,255,.05) 39px 40px);min-height:420px;position:relative;overflow:hidden}
.pin{position:absolute;width:14px;height:14px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--e-ink);box-shadow:0 0 0 6px rgba(255,255,255,.12);animation:pin-drop .5s var(--e-ease-out)}
@keyframes pin-drop{from{transform:rotate(-45deg) translateY(-30px);opacity:0}}
.store-list{display:flex;flex-direction:column;gap:var(--e-sp-3);max-height:420px;overflow-y:auto}
.st-row{border:1px solid var(--e-line);border-radius:var(--e-r-md);padding:var(--e-sp-4);cursor:pointer;transition:border-color var(--e-d-fast)}
.st-row:hover{border-color:var(--e-line-strong)}
@media(max-width:860px){.locator{grid-template-columns:1fr}}
"""

E["e47-livechat.css"] = """/* e47 — LIVE SUPPORT · launcher bubble + thread sheet */
.chat-launch{position:fixed;right:20px;bottom:calc(20px + env(safe-area-inset-bottom));z-index:74;width:56px;height:56px;border-radius:50%;border:1px solid var(--e-line-strong);background:rgba(6,6,7,.85);backdrop-filter:blur(22px);color:var(--e-ink);display:grid;place-items:center;cursor:pointer;box-shadow:var(--e-el-2);transition:transform var(--e-d-fast)}
.chat-launch:hover{transform:scale(1.06)}
.chat-sheet{position:fixed;right:20px;bottom:calc(88px + env(safe-area-inset-bottom));z-index:74;width:min(340px,92vw);border-radius:var(--e-r-lg);border:1px solid var(--e-line-strong);background:rgba(6,6,7,.92);backdrop-filter:blur(30px);box-shadow:var(--e-el-pop);transform:translateY(16px) scale(.97);opacity:0;pointer-events:none;transition:all var(--e-d-med) var(--e-ease-out);overflow:hidden}
.chat-sheet.open{transform:none;opacity:1;pointer-events:auto}
.ch-head{padding:14px 16px;border-bottom:1px solid var(--e-line);font:700 12px/1 'JetBrains Mono',monospace;letter-spacing:.16em;color:var(--e-ink)}
.ch-body{padding:14px;display:flex;flex-direction:column;gap:10px;max-height:280px;overflow-y:auto}
.bubble{max-width:80%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.5}
.bubble.them{align-self:flex-start;background:rgba(255,255,255,.07);color:var(--e-ink-2);border-bottom-left-radius:4px}
.bubble.me{align-self:flex-end;background:var(--e-ink);color:#000;border-bottom-right-radius:4px}
.ch-input{display:flex;border-top:1px solid var(--e-line)}
.ch-input input{flex:1;min-width:0;background:none;border:0;outline:none;padding:14px;color:var(--e-ink);font-size:13px}
.ch-input button{border:0;background:none;color:var(--e-ink);padding:0 16px;cursor:pointer;font:700 11px/1 'JetBrains Mono',monospace}
"""

E["e48-cookiebar.css"] = """/* e48 — CONSENT BAR · bottom glass cookie strip */
.consent{position:fixed;left:var(--e-gutter);right:var(--e-gutter);bottom:calc(var(--e-sp-4) + env(safe-area-inset-bottom));z-index:76;display:flex;align-items:center;gap:var(--e-sp-4);flex-wrap:wrap;padding:14px 18px;border-radius:var(--e-r-lg);border:1px solid var(--e-line-strong);background:rgba(6,6,7,.88);backdrop-filter:blur(28px);box-shadow:var(--e-el-3);transform:translateY(150%);transition:transform var(--e-d-slow) var(--e-ease-out)}
.consent.show{transform:none}
.cs-txt{flex:1;min-width:220px;font-size:13px;color:var(--e-ink-2);line-height:1.5}
.cs-btn{padding:10px 18px;border-radius:var(--e-r-pill);font:700 11px/1 'JetBrains Mono',monospace;letter-spacing:.12em;cursor:pointer;border:1px solid var(--e-line-strong);background:transparent;color:var(--e-ink);transition:all var(--e-d-fast)}
.cs-btn.primary{background:var(--e-ink);color:#000;border-color:var(--e-ink)}
"""

E["e49-backtotop.css"] = """/* e49 — BACK TO TOP · scroll-reactive orb */
.b2t{position:fixed;right:20px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:64;width:46px;height:46px;border-radius:50%;border:1px solid var(--e-line-strong);background:rgba(5,5,6,.7);backdrop-filter:blur(16px);color:var(--e-ink);display:grid;place-items:center;cursor:pointer;opacity:0;transform:translateY(12px);pointer-events:none;transition:all var(--e-d-med) var(--e-ease)}
.b2t.show{opacity:1;transform:none;pointer-events:auto}
.b2t:hover{background:var(--e-ink);color:#000}
.b2t svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2}
"""

E["e50-scroll-reveal.css"] = """/* e50 — SCROLL REVEAL · section entrance primitives */
[data-rv]{opacity:0;transform:translateY(28px);transition:opacity .7s var(--e-ease-out),transform .7s var(--e-ease-out)}
[data-rv].rv-on{opacity:1;transform:none}
[data-rv="fade"]{transform:none}
[data-rv="left"]{transform:translateX(-36px)}
[data-rv="right"]{transform:translateX(36px)}
[data-rv="zoom"]{transform:scale(.92)}
[data-rv="flip"]{transform:perspective(900px) rotateX(14deg);transform-origin:top}
[data-rv].rv-on{transform:none}
.rv-stagger>*{opacity:0;transform:translateY(22px);transition:opacity .6s var(--e-ease-out),transform .6s var(--e-ease-out)}
.rv-stagger.rv-on>*{opacity:1;transform:none}
.rv-stagger.rv-on>*:nth-child(2){transition-delay:.08s}
.rv-stagger.rv-on>*:nth-child(3){transition-delay:.16s}
.rv-stagger.rv-on>*:nth-child(4){transition-delay:.24s}
.rv-stagger.rv-on>*:nth-child(5){transition-delay:.32s}
.rv-stagger.rv-on>*:nth-child(6){transition-delay:.4s}
@media(prefers-reduced-motion:reduce){[data-rv],.rv-stagger>*{opacity:1!important;transform:none!important;transition:none!important}}
"""

for name, body in E.items():
    with open(os.path.join(ECOM, name), "w") as f:
        f.write(body)
print("batch2 written:", len(E))
