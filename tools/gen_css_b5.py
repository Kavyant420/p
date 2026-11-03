#!/usr/bin/env python3
"""Batch 5: gfx51-gfx52 extra graphics CSS + fix gfx35 stray brace."""
import os
GFX = "/workspace/css/gfx"

# fix accidental double-brace in gfx35 keyframes
p = os.path.join(GFX, "gfx35-marquee-stack.css")
if os.path.exists(p):
    s = open(p).read().replace("}}}\n", "}\n")
    open(p, "w").write(s)

G = {}

G["gfx51-dof-zstack.css"] = """/* gfx51 — Z-STACK · layered translateZ composition for true 3D depth scenes */
.zscene{position:relative;transform-style:preserve-3d;perspective:1000px}
.zlayer{position:absolute;inset:0;transform:translateZ(var(--z,0px)) scale(calc(1 + var(--z,0)/1000));
  transition:transform .4s cubic-bezier(.16,1,.3,1);pointer-events:none}
.zscene:hover .zlayer[data-lift]{transform:translateZ(calc(var(--z,0px) + 40px)) scale(calc(1 + (var(--z,0) + 40)/1000))}
"""

G["gfx52-cursor-comet.css"] = """/* gfx52 — CURSOR COMET · trailing glyph streak that reacts to scroll velocity */
.comet{position:fixed;left:var(--cx,50%);top:var(--cy,50%);z-index:3;pointer-events:none;width:8px;height:8px;
  border-radius:50%;background:#fff;box-shadow:0 0 16px rgba(255,255,255,.7);transform:translate(-50%,-50%) scale(var(--cs,1));
  transition:transform .15s ease-out;mix-blend-mode:screen}
.comet-tail{position:fixed;z-index:3;pointer-events:none;font:700 12px/1 'JetBrains Mono',monospace;color:rgba(255,255,255,.5);
  left:var(--tx,0);top:var(--ty,0);transform:translate(-50%,-50%) scale(var(--ts,.6));opacity:var(--to,0)}
@media(hover:none){.comet,.comet-tail{display:none}}
"""

for name, body in G.items():
    with open(os.path.join(GFX, name), "w") as f:
        f.write(body)
print("batch5 written:", len(G))
