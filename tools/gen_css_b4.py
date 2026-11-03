#!/usr/bin/env python3
"""Batch 4: gfx26-gfx50 graphics / 3D / scroll-event CSS."""
import os
GFX = "/workspace/css/gfx"
G = {}

G["gfx26-liquid-metal.css"] = """/* gfx26 — LIQUID METAL · mercury blob with flowing specular band */
.liquid-metal{position:relative;width:min(240px,40vw);aspect-ratio:1;border-radius:50%;overflow:hidden;
  background:radial-gradient(circle at 32% 28%,#fff 0%,#cfcfcf 18%,#6d6d6d 42%,#171717 72%,#000 100%);
  box-shadow:inset -18px -22px 40px rgba(0,0,0,.7),inset 10px 12px 30px rgba(255,255,255,.35),0 24px 60px rgba(0,0,0,.8)}
.lm-band{position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent 0 40%,rgba(255,255,255,.7) 50%,transparent 60% 100%);
  animation:lm-swirl 6s linear infinite;mix-blend-mode:overlay}
@keyframes lm-swirl{to{transform:rotate(360deg)}}
"""

G["gfx27-hex-tessellate.css"] = """/* gfx27 — HEX TESSELLATE · clip-path hex tiles that light up per scroll row */
.hexgrid{position:fixed;right:-2%;top:0;bottom:0;width:min(300px,30vw);z-index:0;pointer-events:none;opacity:.5;
  display:grid;grid-template-columns:repeat(6,44px);grid-auto-rows:50px;gap:4px;mask-image:linear-gradient(90deg,#000,transparent 85%)}
.hx{clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);background:rgba(255,255,255,.05);
  border:0;transition:background .5s ease-out,transform .5s ease-out}
.hx.lit{background:rgba(255,255,255,.4);transform:scale(1.08)}
@media(max-width:760px){.hexgrid{display:none}}
"""

G["gfx28-ascii-clouds.css"] = """/* gfx28 — ASCII STRATA · monospace noise bands drifting horizontally */
.ascii-strata{position:fixed;left:0;right:0;top:8%;z-index:0;pointer-events:none;font:400 11px/1.35 'JetBrains Mono',monospace;
  color:rgba(255,255,255,.14);white-space:pre;overflow:hidden;height:60vh;text-align:center}
.as-line{animation:as-slide var(--sd,40s) linear infinite;display:block;will-change:transform}
.as-line:nth-child(even){animation-direction:reverse}
@keyframes as-slide{from{transform:translateX(-12%)}to{transform:translateX(12%)}}
"""

G["gfx29-beam-sweep.css"] = """/* gfx29 — BEAM SWEEP · radar line crossing the viewport on section change */
.beam{position:fixed;left:0;right:0;top:0;height:1px;z-index:2;pointer-events:none;opacity:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent)}
.beam.fire{animation:bm-cross .9s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes bm-cross{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(100vh)}}
"""

G["gfx30-section-snap.css"] = """/* gfx30 — SECTION SNAP RAIL · magnetic side rail with active slot glow */
.snap-rail{position:fixed;left:18px;top:50%;transform:translateY(-50%);z-index:58;display:flex;flex-direction:column;gap:14px}
.sr-slot{width:26px;height:3px;background:rgba(255,255,255,.18);border-radius:2px;cursor:pointer;transition:all var(--e-d-med,var(--e-ease,cubic-bezier(.2,.8,.2,1)))}
.sr-slot.on{width:44px;background:#fff;box-shadow:0 0 14px rgba(255,255,255,.6)}
html.rail-snap{scroll-snap-type:y proximity}
.rail-target{scroll-snap-align:start}
@media(max-width:760px){.snap-rail{display:none}}
"""

G["gfx31-staggered-curtain.css"] = """/* gfx31 — CURTAIN REVEAL · column slats wipe away as a section enters */
.curtain{display:grid;grid-template-columns:repeat(var(--n,8),1fr);position:relative}
.ct-col{position:absolute;inset:0;background:#000;transform-origin:top;transition:transform .7s cubic-bezier(.7,0,.2,1);transition-delay:calc(var(--i,0)*45ms);z-index:5}
.in .ct-col{transform:scaleY(0)}
"""

G["gfx32-text-scramble.css"] = """/* gfx32 — TEXT SCRAMBLE · decode-in headings (cipher → plaintext) */
.scramble{font-family:'JetBrains Mono',monospace}
.scramble .ch-jit{opacity:.7;color:rgba(255,255,255,.5)}
.scramble .ch-set{animation:ch-lock .3s ease-out}
@keyframes ch-lock{from{transform:translateY(-3px);opacity:.3}to{transform:none;opacity:1}}
"""

G["gfx33-mask-wipe.css"] = """/* gfx33 — MASK WIPE · gradient text reveal following scroll position */
.mask-wipe{background:linear-gradient(rgba(255,255,255,.96),rgba(255,255,255,.96)) no-repeat,
  linear-gradient(rgba(255,255,255,.12),rgba(255,255,255,.12));
  -webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;
  background-size:calc(var(--wipe,0)*100%) 100%,100% 100%;transition:background-size .1s linear}
"""

G["gfx34-ken-burns.css"] = """/* gfx34 — KEN BURNS · slow zoom/pan on media tied to scroll direction */
.kb{overflow:hidden}
.kb img{width:100%;height:100%;object-fit:cover;filter:grayscale(1);will-change:transform;
  transform:scale(calc(1.06 + var(--kb,0)*.08)) translate(calc(var(--kb,0)*-2%),calc(var(--kb,0)*-1.5%));
  transition:transform .3s linear}
"""

G["gfx35-marquee-stack.css"] = """/* gfx35 — MARQUEE STACK · counter-rotating word rings in perspective */
.wordring{position:relative;height:220px;perspective:600px;overflow:hidden;pointer-events:none}
.wr-row{position:absolute;left:0;right:0;white-space:nowrap;font:900 clamp(28px,5vw,60px)/1 'Unbounded',sans-serif;
  color:rgba(255,255,255,.16);transform:rotateX(var(--rx,0)) translateZ(var(--tz,-120px));will-change:transform}
.wr-row b{margin:0 26px}
.wr-row i{font-style:normal;-webkit-text-stroke:1px rgba(255,255,255,.3);color:transparent}
.wr-a{animation:wrm-l 26s linear infinite}.wr-b{animation:wrm-r 34s linear infinite}
@keyframes wrm-l{to{transform:translateX(-50%) rotateX(var(--rx,0))}}}
"""

G["gfx36-sticky-pin.css"] = """/* gfx36 — STICKY PIN FX · pinned stage dims siblings while active */
.pin-stage{position:sticky;top:0;height:100vh;display:grid;place-items:center}
body.pinning .dim-others{opacity:.25;filter:blur(3px);transition:opacity .4s,filter .4s}
.dim-others{transition:opacity .4s,filter .4s}
"""

G["gfx37-counter-roll.css"] = """/* gfx37 — COUNTER ROLL · odometer digits for stats */
.odometer{display:inline-flex;gap:2px;font:700 clamp(28px,5vw,56px)/1 'JetBrains Mono',monospace;color:#fff}
.odo-cell{width:1ch;overflow:hidden;height:1em;position:relative}
.odo-strip{position:absolute;left:0;top:0;transition:transform .8s cubic-bezier(.3,.9,.3,1);will-change:transform}
.odo-strip span{display:block;height:1em;line-height:1em;text-align:center}
"""

G["gfx38-split-flap.css"] = """/* gfx38 — SPLIT FLAP · departure-board tiles for drop announcements */
.flap{display:inline-flex;gap:4px}
.fp-tile{width:34px;height:44px;perspective:260px;position:relative;font:700 22px/44px 'JetBrains Mono',monospace;
  color:#000;background:#fff;border-radius:4px;text-align:center;overflow:hidden}
.fp-tile::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(0,0,0,.35)}
.fp-tile.turn{animation:fp-flip .3s ease-in-out}
@keyframes fp-flip{50%{transform:rotateX(-80deg);filter:brightness(.7)}}
"""

G["gfx39-isometric-city.css"] = """/* gfx39 — ISOMETRIC CITY · extruded blocks skyline built with transforms */
.iso-city{position:fixed;left:0;right:0;bottom:0;height:34vh;z-index:0;pointer-events:none;opacity:.3;
  transform:rotateX(58deg) rotateZ(45deg);transform-origin:bottom center;perspective:1200px;
  mask-image:linear-gradient(to top,#000 20%,transparent)}
.ic-block{position:absolute;bottom:0;left:var(--x,10%);width:var(--w,40px);height:var(--h,90px);
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.3);
  box-shadow:14px -14px 0 rgba(255,255,255,.05),15px -15px 0 rgba(255,255,255,.22);
  transform:translateZ(var(--z,0px));transition:transform .6s var(--e-ease-out,cubic-bezier(.16,1,.3,1))}
.ascended .ic-block{transform:translateZ(calc(var(--z,0px) + 26px))}
@media(max-width:760px){.iso-city{display:none}}
"""

G["gfx40-spotlight-follow.css"] = """/* gfx40 — SPOTLIGHT FOLLOW · radial mask tracking pointer over dark art */
.spot-mask{position:relative}
.spot-mask::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(220px circle at var(--mxp,50%) var(--myp,50%),transparent 0%,rgba(0,0,0,.55) 100%)}
"""

G["gfx41-magnetic-hover.css"] = """/* gfx41 — MAGNETIC HOVER · buttons lean toward cursor */
.magnet{transition:transform .25s cubic-bezier(.2,.8,.2,1)}
.magnet:hover{transform:translate(var(--mgx,0px),var(--mgy,0px))}
"""

G["gfx42-elastic-drag.css"] = """/* gfx42 — ELASTIC DRAG · rubber-band skew during fast interactions */
.elastic{transition:transform .5s cubic-bezier(.2,1.6,.4,1)}
.elastic.dragging{transition:none;transform:skewX(var(--sk,-6deg)) scaleX(1.02)}
"""

G["gfx43-perspective-scroll.css"] = """/* gfx43 — PERSPECTIVE SCROLL · cards bank into Z as they pass the focal line */
.psp{perspective:1200px}
.psp-card{transform:rotateX(calc((var(--bank,0)) * -16deg)) translateZ(calc(abs(var(--bank,0)) * -60px));
  transition:transform .15s linear;transform-style:preserve-3d}
.psp-card::after{content:"";position:absolute;inset:0;background:#000;opacity:calc(abs(var(--bank,0))*.4);pointer-events:none}
"""

G["gfx44-fade-canvas.css"] = """/* gfx44 — CANVAS FADE · WebGL/canvas layer fade+scale on milestone events */
#bg-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;
  opacity:calc(.35 + var(--heat,0)*.5);transform:scale(calc(1 + var(--heat,0)*.05));transition:opacity .3s,transform .3s;
  will-change:opacity,transform}
"""

G["gfx45-gpu-tiers.css"] = """/* gfx45 — GPU TIERS · quality switches driven by Rust perf probe */
html.gpu-low .cb-petal-face{backdrop-filter:none}
html.gpu-low #term-rain,html.gpu-low .wf-inner,html.gpu-low .cloudfield{display:none}
html.gpu-low .grain{opacity:.02}
html.gpu-mid .tr-col:nth-child(odd){display:none}
html.gpu-high .cb-petal-face{backdrop-filter:blur(6px)}
html.perf-eco *{animation-duration:calc(var(--mult,3)*1s)!important;animation-timing-function:linear!important}
"""

G["gfx46-reduced-motion.css"] = """/* gfx46 — REDUCED MOTION FALLBACKS · every fx has a calm twin */
@media(prefers-reduced-motion:reduce){
  .beam,.gb-shred,.glitch-band,.spark,.dr{display:none!important}
  .morph,.wf-cube,.lt-core,.co-ring,.dm-track,.u-track,.gf-plane,.ls-shaft,.as-line,.cloud,.crt-sweep{animation:none!important}
  [data-rv],.rv-stagger>*{opacity:1!important;transform:none!important}
  #codebloom .cb-stem{transition:none}
  .mask-wipe{background-size:100% 100%!important}
}
"""

G["gfx47-print-store.css"] = """/* gfx47 — PRINT SHEET · clean print stylesheet for orders/PDP */
@media print{
  .crt,.grain,#term-rain,#syntax-draft,#codebloom,.tabbar,.consent,.chat-launch,.chat-sheet,.sec-dots,.snap-rail,.beam{display:none!important}
  body{background:#fff!important;color:#000!important}
  .pcard,.acc-card,.modal-card{border:1px solid #999!important;backdrop-filter:none!important;box-shadow:none!important}
  .price,.pdp-price{color:#000!important}
  a{text-decoration:none;color:#000}
}
"""

G["gfx48-touch-targets.css"] = """/* gfx48 — TOUCH SAFETY · 44px minimum targets on coarse pointers */
@media(hover:none),(pointer:coarse){
  .add-btn,.sort-chip,.fchip,.so-hint,.shop-tool,.swatch{min-height:44px;min-width:44px}
  .pcard-quick,.pcard-wish{opacity:1;transform:none}
  .merch-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
"""

G["gfx49-forced-colors.css"] = """/* gfx49 — FORCED COLORS (Windows high contrast) */
@media(forced-colors:active){
  .pcard,.acc-card,.cd-panel,.fd-panel,.holo,.modal-card,.qv-card{border:1px solid CanvasText}
  .sb-fill,.rb-fill,.sm-fill{background:Highlight}
  .cb-petal-face,.cb-core{border-color:CanvasText;background:Canvas}
  .crt,.grain,.beam{display:none}
}
"""

G["gfx50-perf-containment.css"] = """/* gfx50 — CONTAINMENT · paint/layout isolation for smooth 120Hz scrolling */
#codebloom,#syntax-dust,#term-rain,.ripple-host,.light-scy,.hexgrid,.ascii-strata,.cloudfield,.grid-floor,.lattice,.wf-mesh{contain:layout style paint}
.cb-petal,.sd-token,.hx,.spark,.dr,.tr-col,.ls-shaft{will-change:transform}
.sd-token[data-idle="1"],.hx:not(.lit){will-change:auto}
main{content-visibility:auto;contain-intrinsic-size:auto 1200px}
section.near-zero{content-visibility:auto;contain-intrinsic-size:auto 600px}
"""

for name, body in G.items():
    with open(os.path.join(GFX, name), "w") as f:
        f.write(body)
print("batch4 written:", len(G))
