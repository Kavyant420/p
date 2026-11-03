#!/usr/bin/env python3
"""Batch 3: gfx01-gfx50 graphics / 3D / scroll-event CSS."""
import os
GFX = "/workspace/css/gfx"
os.makedirs(GFX, exist_ok=True)
G = {}

G["gfx01-code-bloom-scene.css"] = """/* gfx01 — CODE BLOOM SCENE · master layer for the scroll-driven syntax garden.
   When the user scrolls, a wireframe flower built from code tokens grows and blooms. */
#codebloom{position:fixed;inset:0;z-index:1;pointer-events:none;contain:strict}
.cb-field{position:absolute;inset:0;opacity:.5;
  background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);
  background-size:64px 64px;mask-image:radial-gradient(ellipse 80% 70% at 50% 45%,#000 30%,transparent 75%)}
.cb-stem{position:absolute;left:50%;bottom:-4%;width:2px;height:0;margin-left:-1px;transform-origin:bottom center;
  background:linear-gradient(to top,rgba(255,255,255,.9),rgba(255,255,255,.05));
  box-shadow:0 0 18px rgba(255,255,255,.28);transition:height .1s linear;border-radius:2px}
.cb-node{position:absolute;width:9px;height:9px;margin:-4.5px;border-radius:50%;background:#000;
  border:1.5px solid rgba(255,255,255,.85);box-shadow:0 0 14px rgba(255,255,255,.4);opacity:0;
  transition:opacity .4s var(--e-ease-out,cubic-bezier(.16,1,.3,1)),transform .4s cubic-bezier(.16,1,.3,1);transform:scale(.2)}
.cb-node.on{opacity:1;transform:scale(1)}
.cb-node.git{border-radius:2px;transform:rotate(45deg) scale(.2)}
.cb-node.git.on{transform:rotate(45deg) scale(1)}
"""

G["gfx02-petal-3d.css"] = """/* gfx02 — 3D PETALS · perspective petals that unfurl with scroll progress */
.cb-flower{position:absolute;left:50%;top:26%;width:0;height:0;perspective:900px;transform-style:preserve-3d}
.cb-petal{position:absolute;left:-34px;top:-52px;width:68px;height:104px;transform-style:preserve-3d;
  transform-origin:50% 100%;transform:rotateZ(var(--a,0deg)) rotateX(var(--closed,72deg)) scale(var(--s,.4));
  transition:transform .12s linear,opacity .3s linear;opacity:var(--op,0)}
.cb-petal-face{position:absolute;inset:0;border-radius:60% 60% 34% 34%/72% 72% 26% 26%;
  border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.05);backdrop-filter:blur(6px);
  box-shadow:inset 0 0 26px rgba(255,255,255,.14),0 6px 30px rgba(0,0,0,.6)}
.cb-petal-face::before{content:"";position:absolute;left:50%;top:12%;bottom:8%;width:1px;background:rgba(255,255,255,.35)}
.cb-petal-face::after{content:"";position:absolute;inset:0;border-radius:inherit;
  background:repeating-linear-gradient(-38deg,transparent 0 9px,rgba(255,255,255,.05) 9px 10px)}
.cb-petal.back .cb-petal-face{filter:brightness(.55);border-color:rgba(255,255,255,.28)}
.cb-core{position:absolute;left:-16px;top:-16px;width:32px;height:32px;border-radius:50%;
  border:1px solid rgba(255,255,255,.8);background:radial-gradient(circle at 40% 35%,rgba(255,255,255,.35),transparent 60%),#000;
  display:grid;place-items:center;font:700 9px/1 'JetBrains Mono',monospace;color:#fff;letter-spacing:.02em;
  box-shadow:0 0 24px rgba(255,255,255,.35);opacity:var(--op,0);transition:opacity .3s linear}
"""

G["gfx03-syntax-particles.css"] = """/* gfx03 — SYNTAX PARTICLES · floating code glyphs reacting to scroll velocity */
#syntax-dust{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;contain:strict}
.sd-token{position:absolute;font-family:'JetBrains Mono',monospace;font-weight:700;color:rgba(255,255,255,.5);
  will-change:transform,opacity;text-shadow:0 0 12px rgba(255,255,255,.2);user-select:none;
  transform:translate3d(var(--x,0),var(--y,0),0) rotate(var(--r,0deg));opacity:var(--o,.5);font-size:var(--fs,14px)}
.sd-token.brace{color:rgba(255,255,255,.75)}
.sd-token.op{color:rgba(255,255,255,.4)}
.sd-token.kw{letter-spacing:.08em}
"""

G["gfx04-terminal-rain.css"] = """/* gfx04 — TERMINAL RAIN · faint compiler-stream columns behind content */
#term-rain{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.16;contain:strict;
  mask-image:linear-gradient(to bottom,transparent,#000 12%,#000 82%,transparent)}
.tr-col{position:absolute;top:0;bottom:0;width:1.2em;font:400 12px/1.5 'JetBrains Mono',monospace;color:#fff;
  writing-mode:vertical-rl;white-space:nowrap;overflow:hidden;animation:tr-fall var(--dur,14s) linear infinite;
  animation-delay:var(--dl,0s);opacity:.5}
@keyframes tr-fall{from{transform:translateY(-100%)}to{transform:translateY(100%)}}
@media(prefers-reduced-motion:reduce){.tr-col{animation-duration:60s}}
"""

G["gfx05-wireframe-mesh.css"] = """/* gfx05 — WIREFRAME MESH · rotating low-poly construct in deep bg */
.wf-mesh{position:fixed;left:6%;top:18%;width:min(300px,34vw);aspect-ratio:1;z-index:0;pointer-events:none;
  perspective:760px;opacity:.35}
.wf-cube{position:absolute;inset:18%;transform-style:preserve-3d;animation:wf-spin 34s linear infinite}
.wf-face{position:absolute;inset:0;border:1px solid rgba(255,255,255,.34);background:rgba(255,255,255,.015)}
.wf-face:nth-child(1){transform:translateZ(calc(min(300px,34vw)*.18))}
.wf-face:nth-child(2){transform:rotateY(180deg) translateZ(calc(min(300px,34vw)*.18))}
.wf-face:nth-child(3){transform:rotateY(90deg) translateZ(calc(min(300px,34vw)*.18))}
.wf-face:nth-child(4){transform:rotateY(-90deg) translateZ(calc(min(300px,34vw)*.18))}
.wf-face:nth-child(5){transform:rotateX(90deg) translateZ(calc(min(300px,34vw)*.18))}
.wf-face:nth-child(6){transform:rotateX(-90deg) translateZ(calc(min(300px,34vw)*.18))}
.wf-inner{position:absolute;inset:34%;transform-style:preserve-3d;animation:wf-spin 22s linear infinite reverse}
.wf-inner .wf-face{border-color:rgba(255,255,255,.5)}
@keyframes wf-spin{from{transform:rotateX(24deg) rotateY(0)}to{transform:rotateX(24deg) rotateY(360deg)}}
@media(max-width:760px){.wf-mesh{display:none}}
"""

G["gfx06-orbit-rings.css"] = """/* gfx06 — ORBIT RINGS · satellite dots circling the bloom core, scroll-tilted */
.cb-orbit{position:absolute;left:50%;top:26%;width:0;height:0;transform-style:preserve-3d;pointer-events:none;
  transform:rotateX(var(--tilt,60deg))}
.co-ring{position:absolute;border:1px dashed rgba(255,255,255,.2);border-radius:50%;
  left:calc(var(--d)/-2);top:calc(var(--d)/-2);width:var(--d);height:var(--d);
  animation:co-turn var(--sp,20s) linear infinite;transform-style:preserve-3d}
@keyframes co-turn{to{transform:rotateZ(360deg)}}
.co-sat{position:absolute;top:-4px;left:calc(50% - 4px);width:8px;height:8px;border-radius:50%;
  background:#fff;box-shadow:0 0 12px rgba(255,255,255,.7)}
"""

G["gfx07-glitch-ribbon.css"] = """/* gfx07 — GLITCH RIBBON · RGB-free monochrome glitch band crossing on milestones */
.glitch-band{position:fixed;left:-10%;right:-10%;top:38%;height:2px;z-index:2;pointer-events:none;opacity:0;
  background:rgba(255,255,255,.85);mix-blend-mode:screen}
.gb-shred{position:absolute;left:0;right:0;height:9px;top:-4px;opacity:0;
  background:repeating-linear-gradient(90deg,rgba(255,255,255,.5) 0 3px,transparent 3px 9px,rgba(255,255,255,.25) 9px 11px,transparent 11px 26px);
  clip-path:inset(0 100% 0 0)}
.firing .glitch-band{animation:gb-flash .5s steps(3) forwards}
.firing .gb-shred{animation:gb-tear .5s steps(6) forwards}
@keyframes gb-flash{0%{opacity:1;transform:scaleY(6)}40%{opacity:.6;transform:scaleY(1) translateX(8px)}100%{opacity:0}}
@keyframes gb-tear{0%{opacity:.9;clip-path:inset(0 0 0 0);transform:translateX(-14px)}100%{opacity:0;clip-path:inset(0 0 0 100%);transform:translateX(14px)}}
"""

G["gfx08-depth-parallax.css"] = """/* gfx08 — DEPTH PARALLAX · data-driven layers driven by --scrollp (0..1) */
[data-depth]{will-change:transform}
.layer-far{transform:translate3d(0,calc(var(--scrollp,0) * -4vh),0)}
.layer-mid{transform:translate3d(0,calc(var(--scrollp,0) * -9vh),0)}
.layer-near{transform:translate3d(0,calc(var(--scrollp,0) * -16vh),0) scale(calc(1 + var(--scrollp,0)*.04))}
.px-card{transition:transform .2s var(--e-ease-out,cubic-bezier(.16,1,.3,1))}
@media(prefers-reduced-motion:reduce){[data-depth],.layer-far,.layer-mid,.layer-near{transform:none!important}}
"""

G["gfx09-hologram-card.css"] = """/* gfx09 — HOLOGRAM CARD · tilt-reactive glass panel with scanline sheen */
.holo{position:relative;border-radius:var(--e-r-lg,22px);overflow:hidden;border:1px solid rgba(255,255,255,.22);
  background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.02) 40%,rgba(255,255,255,.06));
  backdrop-filter:blur(22px) saturate(125%);transform-style:preserve-3d;
  transform:perspective(900px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg));
  transition:transform .18s ease-out,box-shadow .3s;box-shadow:0 18px 50px rgba(0,0,0,.7)}
.holo:hover{box-shadow:0 26px 70px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.3)}
.holo-sheen{position:absolute;inset:-40%;pointer-events:none;
  background:repeating-linear-gradient(115deg,transparent 0 22px,rgba(255,255,255,.045) 22px 24px);
  transform:translateX(var(--sheen,-30%));transition:transform .3s ease-out;mix-blend-mode:screen}
.holo-edge{position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -1px 0 rgba(255,255,255,.08)}
.holo > *{transform:translateZ(24px)}
"""

G["gfx10-neon-grid-floor.css"] = """/* gfx10 — GRID FLOOR · receding wireframe plane under the footer */
.grid-floor{position:fixed;left:-50%;right:-50%;bottom:-10vh;height:52vh;z-index:0;pointer-events:none;
  perspective:340px;perspective-origin:50% 0;opacity:.4;mask-image:linear-gradient(to top,#000,transparent 88%)}
.gf-plane{position:absolute;inset:0;transform:rotateX(74deg);transform-origin:top center;
  background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);
  background-size:60px 60px;animation:gf-run 5.5s linear infinite}
@keyframes gf-run{to{background-position:0 60px}}
@media(prefers-reduced-motion:reduce){.gf-plane{animation-duration:22s}}
"""

G["gfx11-light-sculpture.css"] = """/* gfx11 — LIGHT SCULPTURE · volumetric shafts sweeping the stage */
.light-scy{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;contain:strict}
.ls-shaft{position:absolute;top:-30%;left:var(--l,20%);width:2px;height:160%;
  background:linear-gradient(to bottom,transparent,rgba(255,255,255,.5),transparent);
  filter:blur(1px);transform:rotate(var(--ang,14deg));animation:ls-sway var(--sd,9s) ease-in-out infinite alternate;
  opacity:.28}
.ls-shaft.wide{width:44px;filter:blur(26px);opacity:.1}
@keyframes ls-sway{to{transform:rotate(calc(var(--ang,14deg)*-1)) translateX(30px)}}
"""

G["gfx12-fluid-morph.css"] = """/* gfx12 — FLUID MORPH · SVG-blob-free CSS morph disc behind hero */
.morph{position:fixed;left:50%;top:40%;width:min(640px,90vw);aspect-ratio:1;transform:translate(-50%,-50%);
  z-index:0;pointer-events:none;border:1px solid rgba(255,255,255,.16);opacity:.5;
  animation:morph-turn 16s ease-in-out infinite;
  border-radius:42% 58% 63% 37%/45% 42% 58% 55%;
  box-shadow:inset 0 0 120px rgba(255,255,255,.05)}
@keyframes morph-turn{
  0%,100%{border-radius:42% 58% 63% 37%/45% 42% 58% 55%;transform:translate(-50%,-50%) rotate(0)}
  33%{border-radius:60% 40% 34% 66%/52% 61% 39% 48%;transform:translate(-50%,-50%) rotate(6deg)}
  66%{border-radius:38% 62% 55% 45%/63% 38% 62% 37%;transform:translate(-50%,-50%) rotate(-5deg)}}
"""

G["gfx13-particle-attractor.css"] = """/* gfx13 — ATTRACTOR FIELD · tokens pulled toward cursor with spring physics */
.attract{transition:transform .1s linear}
.attract.hot{color:rgba(255,255,255,.95)!important;text-shadow:0 0 18px rgba(255,255,255,.55)}
.field-cross{position:fixed;width:1px;height:1px;z-index:1;pointer-events:none;left:var(--mx,50%);top:var(--my,50%)}
.fc-ring{position:absolute;left:-30px;top:-30px;width:60px;height:60px;border-radius:50%;
  border:1px solid rgba(255,255,255,.12);animation:fc-breathe 2.4s ease-in-out infinite}
@keyframes fc-breathe{50%{transform:scale(1.25);opacity:.5}}
"""

G["gfx14-scroll-timeline-vine.css"] = """/* gfx14 — GIT VINE · commit-graph stem drawn along scroll (the coding analogue of a growing vine) */
.vine-svg{position:fixed;left:calc(50% - 1px);top:0;bottom:0;width:2px;z-index:1;pointer-events:none;overflow:visible}
.vine-path{stroke:rgba(255,255,255,.8);stroke-width:2;fill:none;stroke-linecap:round;
  stroke-dasharray:var(--len,2000);stroke-dashoffset:calc(var(--len,2000) * (1 - var(--scrollp,0)));
  filter:drop-shadow(0 0 8px rgba(255,255,255,.35))}
.vine-dot{fill:#000;stroke:rgba(255,255,255,.9);stroke-width:2;opacity:0;transition:opacity .3s,r .3s}
.vine-dot.pop{opacity:1;r:5}
"""

G["gfx15-constellation.css"] = """/* gfx15 — CONSTELLATION LINES · links drawn between nodes as scroll crosses them */
.constell{position:fixed;inset:0;z-index:1;pointer-events:none}
.cx-link{stroke:rgba(255,255,255,.35);stroke-width:1;stroke-dasharray:var(--ll,200);stroke-dashoffset:var(--ll,200);
  transition:stroke-dashoffset .8s var(--e-ease-out,cubic-bezier(.16,1,.3,1))}
.cx-link.drawn{stroke-dashoffset:0}
"""

G["gfx16-data-ripples.css"] = """/* gfx16 — DATA RIPPLES · expanding rings emitted on scroll milestones */
.ripple-host{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.dr{position:absolute;left:var(--rx,50%);top:var(--ry,50%);width:10px;height:10px;margin:-5px;border-radius:50%;
  border:1px solid rgba(255,255,255,.6);animation:dr-out 1.4s var(--e-ease-out,cubic-bezier(.16,1,.3,1)) forwards}
@keyframes dr-out{to{transform:scale(28);opacity:0;border-color:rgba(255,255,255,.05)}}
"""

G["gfx17-chromatic-edge.css"] = """/* gfx17 — CHROMATIC EDGE · grayscale dispersion fringe on headings during fast scroll */
.disperse{transition:text-shadow .2s ease-out}
.fast-scroll .disperse{text-shadow:-1.5px 0 rgba(255,255,255,.5),1.5px 0 rgba(255,255,255,.28);
  letter-spacing:.01em}
.fast-scroll .disperse b{transform:translateX(1px)}
"""

G["gfx18-depth-of-field.css"] = """/* gfx18 — DEPTH OF FIELD · bg art blurs as foreground content sharpens in */
.dof-far{filter:blur(calc((1 - var(--focus,0)) * 6px));transition:filter .3s linear;opacity:calc(.35 + var(--focus,0)*.4)}
.dof-near{filter:blur(calc(var(--focus,0) * -1px + (1 - var(--focus,0)) * 2px))}
body.reading .dof-far{filter:blur(7px);opacity:.25}
"""

G["gfx19-ascent-clouds.css"] = """/* gfx19 — ASCENT CLOUDS · drifting fog banks that part while scrolling up */
.cloudfield{position:fixed;inset:auto 0 -6% 0;height:44vh;z-index:0;pointer-events:none;overflow:hidden;
  opacity:calc(1 - var(--ascent,0)*.9);transition:opacity .3s linear}
.cloud{position:absolute;bottom:var(--cb,0);left:var(--cl,10%);width:var(--cw,420px);height:120px;border-radius:50%;
  background:radial-gradient(closest-side,rgba(255,255,255,.14),transparent);filter:blur(22px);
  animation:cl-drift var(--cs,30s) linear infinite}
@keyframes cl-drift{from{transform:translateX(-30%)}to{transform:translateX(130vw)}}
"""

G["gfx20-build-sparks.css"] = """/* gfx20 — BUILD SPARKS · spark burst when a section compiles into view */
.spark{position:fixed;z-index:2;width:3px;height:3px;border-radius:50%;background:#fff;pointer-events:none;
  box-shadow:0 0 8px rgba(255,255,255,.9);animation:spk-fly var(--life,.8s) ease-out forwards}
@keyframes spk-fly{to{transform:translate3d(var(--dx,20px),var(--dy,-30px),0) scale(.2);opacity:0}}
.compile-flash{animation:cmpf .5s ease-out}
@keyframes cmpf{0%{box-shadow:0 0 0 1px rgba(255,255,255,.7),0 0 40px rgba(255,255,255,.25) inset}100%{box-shadow:none}}
"""

G["gfx21-lattice-crystal.css"] = """/* gfx21 — LATTICE CRYSTAL · isometric crystal lattice rotating in far bg */
.lattice{position:fixed;right:4%;top:12%;width:min(260px,30vw);aspect-ratio:1;z-index:0;pointer-events:none;
  perspective:640px;opacity:.3}
.lt-core{position:absolute;inset:0;transform-style:preserve-3d;animation:lt-tumble 40s linear infinite}
.lt-pt{position:absolute;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.85);
  left:calc(50% + var(--x,0)*40% - 2.5px);top:calc(50% + var(--y,0)*40% - 2.5px);
  transform:translateZ(calc(var(--z,0)*40%));box-shadow:0 0 10px rgba(255,255,255,.5)}
.lt-bar{position:absolute;left:50%;top:50%;height:1px;background:rgba(255,255,255,.25);transform-origin:0 0;
  transform:rotateX(var(--rx,0)) rotateZ(var(--rz,0)) scaleX(var(--ln,1))}
@keyframes lt-tumble{from{transform:rotateX(18deg) rotateY(0) }to{transform:rotateX(18deg) rotateY(360deg)}}
@media(max-width:760px){.lattice{display:none}}
"""

G["gfx22-scanline-crt.css"] = """/* gfx22 — SCANLINE CRT · subtle terminal texture over the whole viewport */
.crt{position:fixed;inset:0;z-index:3;pointer-events:none;opacity:.05;
  background:repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 3px);mix-blend-mode:overlay}
.crt::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,#000 130%)}
.crt-sweep{position:absolute;left:0;right:0;height:120px;top:-120px;
  background:linear-gradient(to bottom,transparent,rgba(255,255,255,.05),transparent);animation:crt-sw 7s linear infinite}
@keyframes crt-sw{to{top:110%}}
"""

G["gfx23-noise-grain.css"] = """/* gfx23 — FILM GRAIN · animated dither grain, AMOLED-safe */
.grain{position:fixed;inset:-50%;z-index:4;pointer-events:none;opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  animation:gr-jit .4s steps(2) infinite}
@keyframes gr-jit{0%{transform:translate(0)}50%{transform:translate(-12px,8px)}100%{transform:translate(6px,-6px)}}
@media(prefers-reduced-motion:reduce){.grain{animation:none}}
"""

G["gfx24-progressive-blur.css"] = """/* gfx24 — PROGRESSIVE BLUR · layered blur mask that clears with scroll */
.pblur{position:fixed;inset:0;z-index:2;pointer-events:none;backdrop-filter:blur(calc((1 - var(--reveal,0)) * 14px));
  -webkit-backdrop-filter:blur(calc((1 - var(--reveal,0)) * 14px));
  mask-image:linear-gradient(to bottom,#000,transparent calc(var(--reveal,0)*120%));transition:backdrop-filter .2s linear}
"""

G["gfx25-variable-font-axis.css"] = """/* gfx25 — VARIABLE AXIS TYPE · weight/optical expansion tied to scroll velocity */
.axis-type{font-variation-settings:"wght" var(--wght,700),"opsz" var(--opsz,72);transition:font-variation-settings .25s ease-out}
.axis-type.rush{--wght:900;letter-spacing:-.015em}
.axis-meta{font-variation-settings:"wght" var(--wght,500);letter-spacing:.2em}
"""

for name, body in G.items():
    with open(os.path.join(GFX, name), "w") as f:
        f.write(body)
print("batch3 written:", len(G))
