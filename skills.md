# PIK INC. / LIQUID CORE — DESIGN & ENGINEERING ARCHITECTURE MANUAL (skills.md)

> **Document Classification**: Permanent Technical & Aesthetic Architecture Standard  
> **Target Audience**: Future AI Agents, Senior Systems Architects, Creative Technologists  
> **Project Identity**: Liquid Core (PIK Inc.) — On-Device Intelligence & Glassmorphic Spatial System  
> **Repository**: [https://github.com/Kavyant420/p](https://github.com/Kavyant420/p)

---

## 1. DESIGN PHILOSOPHY

Liquid Core rejects the ephemeral trends of flat corporate minimalism, neon clutter, and pseudo-futuristic ornamentation. Our core philosophy is anchored in **Physicality, Intrinsic Utility, and True Offline Sovereignty**.

The interface adheres to seven immutable axioms:

1. **Physical Materiality over Abstract Decoration**:
   Every visual surface behaves according to optical physics. We employ multi-layer refractive depth, caustics, variable Fresnel reflections, and SVG displacement maps. Glass panels do not merely feature a flat CSS `blur()`; they scatter incident light, produce specular highlights aligned with pointer coordinates, and project subtle ambient shadows.

2. **Show the Real Product Immediately**:
   Never gate functionality behind decorative landing marketing abstractions or promotional fluff. The AI console, engine telemetry, local model boot state, and workspace memory are tangible, interactive, and functional on initial frame load.

3. **Strong Typography and Strict Spatial Rhythms**:
   Visual hierarchy is enforced through contrast, generous negative space, and disciplined typographic scaling. Fluid typography using CSS `clamp()` and strict proportional leading guarantees readability from 320px mobile displays to 4K desktop environments.

4. **Monochrome Sovereignty with Purposeful Chromatic Accents**:
   Our visual foundation is AMOLED `#000000` and high-purity neutral grays (`#050505` through `#f4f4f2`). Color is restricted to telemetry status, physical hardware alerts, and critical state feedback (`#58e08a` for active sync, `#ff5a52` for hardware interrupt/danger, `#ffc247` for thermal/resource throttle).

5. **Motion as Spatial Explanation, Never Decoration**:
   Animations exist to communicate state changes, physical spatial origin, and directional momentum. We never hijack native scrolling or introduce animations that block user interaction. Every transition is bound to an active spring curve or liquid cubic-bezier.

6. **Zero-Cloud Sovereignty as an Aesthetic**:
   The entire experience conveys local machine privacy. Status chips, disk utilization gauges, offline indicators, and memory state counters are front-and-center, reinforcing user ownership of their own computation and data.

7. **Tactile Delight without Cognitive Load**:
   Every button, slider, and interactive chip provides responsive feedback through micro-scale transforms, fluid liquid fill expansion, and haptic vibration pulses on supporting Android hardware.

---

## 2. UI/UX INSPIRATION PRINCIPLES

Our aesthetic emerges from the intersection of three industry-defining SaaS paradigms fused with the cinematic dynamism of high-end interactive digital installations.

### 2.1 Linear-Style Principles
- **Dark, Focused Surfaces**: True AMOLED black backing eliminates optical fatigue and maximizes OLED display battery efficiency.
- **Precision Keyboard & Gesture Navigation**: Keyboard accessibility is treated as a first-class citizen. Modals, search drawers, and command overlays respond immediately to shortcuts (`Esc`, `Enter`, `Alt` power-key hold).
- **Hairline Borders and Subtle Specular Highlights**: Surfaces are defined by 1px translucent borders (`rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.34)`) rather than heavy dropshadows or opaque bevels.
- **Micro-Interactions**: Hover states trigger instant feedback with sub-200ms ease-out transitions.
- **Zero Visual Clutter**: Elements without immediate functional or orientation value are removed. Information density is managed via clear typography and generous padding.

### 2.2 Stripe-Style Principles
- **Modular Information Bento Grids**: Multi-column technical specifications, hardware statistics, and feature cards are organized into structured, modular grids that adapt seamlessly across viewport sizes.
- **Hierarchical Density**: Complex telemetry (such as WebGPU tensor rates, RAM cache saturation, and LoRA adaptation cycles) is structured into clear tiers of scannable primary metrics and secondary monospace diagnostics.
- **Optical Balance**: Visual weight is distributed deliberately; heavy typography is paired with delicate hairline dividers and semi-transparent badges.
- **Depth Layers**: Multi-layered surfaces establish a clear stacking hierarchy where elevated panels cast physical, soft-spread shadows onto underlying planes.

### 2.3 Vercel-Style Principles
- **Monochrome Technical Minimalism**: The palette relies primarily on black, white, and gray tones, establishing a clean, developer-centric authority.
- **Subsecond Performance Priority**: Visual sophistication must never impede frame rates. CSS containment, paint isolation, and lightweight DOM footprints take precedence over complex multi-pass effects on low-power devices.
- **Precision Typography**: Generous tracking on uppercase technical labels paired with tight, high-impact headings creates an unmistakable engineering-driven aesthetic.
- **Edge Micro-Bevels**: Components feature hairline specular rims that accentuate geometric precision under directional illumination.

### 2.4 Premium Interactive Installations
- **Cinematic Depth**: Three-dimensional background scenes provide spatial grounding without overwhelming foreground interactive surfaces.
- **Organic Fluid Dynamics**: The central Three.js liquid chrome sphere pulses rhythmically with user interactions and speech synthesis events, establishing a living, reactive presence.
- **Audio-Reactive & Gesture-Driven Visuals**: Ambient code blooms and refractive lenses respond to pointer movement, scroll velocity, and voice activity in real time.
- **Procedural Grain & Atmosphere**: Ultra-fine SVG noise textures and subtle scanlines lend a tactile filmic texture to digital screens, preventing flat, sterile rendering.

---

## 3. 3D AND MOTION RULES

Motion and 3D graphics in Liquid Core must adhere to rigorous architectural constraints to ensure cinematic beauty without performance degradation.

### 3.1 Three.js & WebGL Guidelines
1. **Target Budget**: WebGL execution must consume less than 3.5ms per frame on typical mobile hardware, sustaining 60fps minimum (120fps on high-refresh ProMotion screens).
2. **Object Pooling & Memory Allocation**:
   - Never instantiate objects (`THREE.Vector3`, `THREE.Color`, `THREE.Matrix4`) inside `requestAnimationFrame` loops.
   - Cache all target vectors, projection matrices, and transformation caches in persistent module scope.
3. **Procedural Lighting over Heavy Assets**:
   - Avoid external HDR environment map files that require multi-megabyte network requests.
   - Use procedural PMREM generation (`THREE.PMREMGenerator`) using geometric light strips inside a low-poly room to achieve crisp specular reflections at zero bandwidth cost.
4. **Custom Shaders via onBeforeCompile**:
   - Inject custom GLSL vertex and fragment transformations into native Three.js materials (`MeshPhysicalMaterial`) rather than creating custom `RawShaderMaterial` instances from scratch. This preserves native engine lighting, shadow handling, and tone mapping.
5. **Dynamic Degradation Matrix**:
   - Detect GPU tiers via `navigator.gpu` or `gl.getParameter(gl.RENDERER)`.
   - On low-end or battery-saver profiles (`body.low-power`), throttle renderer pixel ratio to `1.0`, disable post-processing passes (EffectComposer), and deactivate background vertex displacement.

### 3.2 CSS Animation & Motion Guidelines
1. **Transform and Opacity Only**:
   All dynamic animations must strictly operate on `transform` and `opacity`. Never animate `top`, `left`, `margin`, `padding`, `width`, or `height`, which trigger layout recalculation and paint cycles.
2. **Standard Liquid Easing Curves**:
   - Liquid Spring: `cubic-bezier(0.2, 0.9, 0.3, 1.2)`
   - Liquid Snap: `cubic-bezier(0.16, 0.84, 0.24, 1)`
   - Material Glide: `cubic-bezier(0.4, 0.0, 0.2, 1)`
   - Subtle Drift: `cubic-bezier(0.65, 0.0, 0.35, 1)`
3. **Reduced-Motion Respect**:
   When `prefers-reduced-motion: reduce` is detected or toggled, all animation durations are clamped to `0.001ms`, CSS scroll behavior is set to `auto`, and Three.js orbit motions are locked to static resting poses.

---

## 4. VISUAL SYSTEM SPECIFICATION

All interface elements must consume variables exclusively from the design token registry defined in `css/00-tokens.css` and extended across modular styles.

### 4.1 Color System Tokens
```css
--amoled:        #000000;   /* Pixel-off black for AMOLED efficiency */
--black-2:       #050505;   /* Level 1 raised surface backing */
--black-3:       #0b0b0c;   /* Level 2 container surface backing */
--black-4:       #121214;   /* Sunken wells, input fields, code chips */
--ink:           #f4f4f2;   /* Level 1 primary typography */
--ink-2:         #c9c9c6;   /* Level 2 secondary body typography */
--ink-3:         #8e8e8a;   /* Level 3 metadata, muted labels */
--ink-4:         #5c5c59;   /* Disabled states, inactive icons */
--ink-5:         #2b2b29;   /* Subtle divider hairlines */
--chrome:        #dfe3e6;   /* Specular reflection highlights */
--glow:          rgba(255, 255, 255, 0.14);
--glow-strong:   rgba(255, 255, 255, 0.30);
--danger:        #ff5a52;   /* Destructive actions, hardware exceptions */
--success:       #58e08a;   /* Active model resident, engine online */
--warn:          #ffc247;   /* Storage threshold alerts */
```

### 4.2 Liquid Glass Tokens
```css
--glass-blur:    22px;
--glass-satur:   150%;
--glass-fill:    rgba(255, 255, 255, 0.055);
--glass-fill-hi: rgba(255, 255, 255, 0.10);
--glass-line:    rgba(255, 255, 255, 0.14);
--glass-line-hi: rgba(255, 255, 255, 0.34);
--glass-shadow:  0 24px 60px -18px rgba(0, 0, 0, 0.85),
                 0 2px 10px -2px rgba(0, 0, 0, 0.60);
--glass-inner:   inset 0 1px 0 var(--glass-line-hi),
                 inset 0 -1px 0 rgba(255, 255, 255, 0.05),
                 inset 0 0 34px rgba(255, 255, 255, 0.028);
--glass-spec:    linear-gradient(168deg,
                   rgba(255, 255, 255, 0.16) 0%,
                   rgba(255, 255, 255, 0.05) 26%,
                   rgba(255, 255, 255, 0.015) 55%,
                   rgba(255, 255, 255, 0.05) 100%);
```

### 4.3 Typography Scale
- **Display 1 (Hero)**: `clamp(2.6rem, 7.2vw, 5.6rem)` | Unbounded 900 | Line-height `0.92`
- **Display 2 (Section)**: `clamp(1.9rem, 4.4vw, 3.4rem)` | Unbounded 700 | Line-height `1.04`
- **Title (Card Header)**: `clamp(1.35rem, 2.6vw, 2.1rem)` | Space Grotesk 600 | Line-height `1.28`
- **Subtitle / Deck**: `clamp(1.02rem, 1.6vw, 1.28rem)` | Space Grotesk 400 | Line-height `1.45`
- **Body Regular**: `0.98rem` (15.6px) | Space Grotesk 300 | Line-height `1.62`
- **Small Body**: `0.83rem` (13.2px) | Space Grotesk 400 | Line-height `1.50`
- **Technical Monospace**: `0.82rem` (13.1px) | JetBrains Mono 400/700 | Tracking `0.08em`
- **Micro Badge / Label**: `0.72rem` (11.5px) | JetBrains Mono 700 | Tracking `0.18em`

### 4.4 Spatial Grid & Border Radii
- **Rhythm**: 4pt / 8pt base grid (`--sp-1: 4px` through `--sp-10: 120px`).
- **Radii System**:
  - Micro-chips: `--r-xs: 6px`
  - Form inputs & buttons: `--r-sm: 10px`
  - Secondary containers: `--r-md: 16px`
  - Primary glass cards: `--r-lg: 24px`
  - High-depth modals & phone stage: `--r-xl: 34px`
  - Floating pill rails & dock: `--r-pill: 999px`

---

## 5. RESPONSIVE DESIGN SPECIFICATIONS

Liquid Core supports four explicit viewport tiers with bespoke ergonomic layout adjustments:

### 5.1 Mobile Tier (<680px)
- **Top Rail**: Collapses into compact brand logo, install badge, and quick-action menu button.
- **Mobile Dock Navigation**: Activated at bottom viewport (`--z-rail: 55`). Dock items (`Voice`, `Work`, `Talk`, `Alarms`, `Tasks`) feature 48px minimum touch targets with safe-area inset accommodation:
  `bottom: calc(14px + env(safe-area-inset-bottom))`.
- **Card Grids**: Single-column vertical flow with full-width responsive padding.
- **Glass Blur Budget**: `--glass-blur` reduced from `22px` to `14px` to preserve GPU bandwidth on mobile silicon.
- **Phone Mockup**: Scales fluidly using `width: min(330px, 84vw)` with hardware power-button trigger highlighted.
- **Bottom Overlays**: Sheets occupy 90% vertical viewport with pull-to-dismiss handles.

### 5.2 Tablet Tier (681px - 1080px)
- **Top Rail**: Persistent brand and status chip, simplified navigation links.
- **Hero & Console**: Dual column stacked layout (`1fr` / `1fr`) with console pinned beneath copy.
- **Feature Grid**: 2-column bento configuration with tilt perspective enabled.
- **Dock**: Suppressed in favor of full header navigation.
- **Workspace Sheets**: Present as centered spatial modals with `max-width: 680px`.

### 5.3 Desktop Tier (1081px - 1440px)
- **Hero Section**: 1.15fr to 0.85fr grid alignment with active floating glass console alongside display copy.
- **Full Navigation Rail**: 1240px centered floating glass pill with live engine/network status dots.
- **Interactive Cursor Comet**: Pointer-tracked SVG lens distortion active across all glass layers.
- **Console Height**: Fixed 560px viewport height with internal smooth scrolling chat ledger.

### 5.4 Ultra-Wide Tier (>1440px)
- **Max Content Containment**: All primary grids bounded at `1280px` maximum width to preserve visual focus and prevent excessive eye-travel distances.
- **Parallax Accent Depth**: Background glass shards float across outer margins with expanded z-depth.

---

## 6. ACCESSIBILITY STANDARDS (WCAG 2.1 AA+)

1. **Contrast Compliance**:
   - Primary text (`#f4f4f2`) on AMOLED black (`#000000`) delivers a `17.4:1` contrast ratio, far surpassing the WCAG AAA threshold of `7.0:1`.
   - Secondary labels (`#8e8e8a`) deliver a `4.8:1` contrast ratio, meeting AA requirements for small text.
2. **Focus States**:
   - All interactive elements exhibit an unmistakable dual-ring focus outline:
     `outline: none; box-shadow: 0 0 0 2px var(--amoled), 0 0 0 4px rgba(255, 255, 255, 0.65)`.
3. **Screen Reader Semantic Architecture**:
   - All decorative visual elements (`#scene`, `.fx-grain`, `.scanline`, `.orbit-badge`) are marked with `aria-hidden="true"`.
   - Live console updates, engine boot percentages, and voice transcripts utilize `aria-live="polite"` regions.
   - Sheets and modals enforce keyboard focus trapping and respond to the `Escape` key.
4. **Touch Target Dimensions**:
   - All buttons, chips, and dock items strictly honor the minimum `48x48px` interactive bounding box on touch interfaces.
5. **Zoom & Scalability**:
   - Viewport meta tags permit user scaling (`maximum-scale=5.0, user-scalable=yes`) to ensure visually impaired users can zoom comfortably.

---

## 7. PERFORMANCE & RUNTIME STANDARDS

1. **Zero Uncaught Exceptions Contract**:
   Every async promise and runtime invocation must be shielded with comprehensive try-catch wrappers and fault containment (`reportFault`), preventing console errors from surfacing to the user.
2. **Network Payload Budget**:
   - Initial shell load must complete with zero server requests after PWA caching.
   - Total non-model asset payload (HTML, CSS, JS, fonts) must remain under `650KB` uncompressed.
3. **Model Weight Caching Strategy**:
   - Transformers.js weights (`onnx-community/Qwen3-0.6B-ONNX`) are persisted in the browser Cache Storage API via `useBrowserCache: true`.
   - Engine downloads provide granular byte-level progress reporting and gracefully recover from interrupted connections.
4. **Rendering Performance**:
   - CSS properties triggering reflows (`layout shifts`) are prohibited during transitions.
   - Complex background textures utilize CSS `will-change: transform` and `contain: layout paint style` on heavy cards.
5. **Memory Management**:
   - IndexedDB object stores enforce quota limits to avoid exhausting client device disk storage.
   - Audio synthesis utterances are canceled before initializing new speech calls to prevent memory leaks in mobile WebViews.

---

## 8. CODE QUALITY & SYSTEM ARCHITECTURE

Liquid Core operates on a modular, decoupled architecture:

```
┌──────────────────────────────────────────────────────────────┐
│                  index.html (Semantic Shell)                 │
└──────┬───────────────────────┬───────────────────────┬───────┘
       │                       │                       │
┌──────▼────────┐       ┌──────▼────────┐       ┌──────▼────────┐
│  styles.css   │       │    app.js     │       │   scene.js    │
│  (Base Glass) │       │ (Brain Core)  │       │ (Three.js 3D) │
└──────┬────────┘       └──────┬────────┘       └───────────────┘
       │                       │
┌──────▼────────┐       ┌──────▼────────┐
│ CSS Modules   │       │  Sub-systems  │
│ 00-tokens     │       │ - learn.js    │
│ 01-base ...   │       │ - codebloom.js│
│ 19-hyper ...  │       │ - background  │
│ 22-kinetic... │       │ - ui.js       │
└───────────────┘       └───────────────┘
```

### 8.1 Module Contracts
- **`app.js`**: Core brain. Exposes `window.LC` containing `{ Engine, Voice, DB, handleUserCommand, raiseAssistant, pulse3D }`. Manages IndexedDB CRUD for notes, tasks, and alarms.
- **`scene.js`**: Pure Three.js background module. Listens for `lc-pulse` custom events and smoothly scales/distorts the liquid chrome orb and floating glass shards.
- **`js/codebloom.js`**: Ambient generative visualizer. Renders real-time syntax flow particles, audio-reactive ripples, and futuristic telemetry diagnostics.
- **`js/learn.js`**: On-device personalization engine. Leverages local associative memory and gradient adaptation without sending telemetry.
- **`js/background.js`**: PWA service worker communication, wake alarms, and background sync keeper.
- **`js/ui.js`**: DOM binding, tilt-card perspective calculation, sheet open/close states, and tactile button feedback.

### 8.2 Coding Standards & Guardrails
- **Strict Mode**: Every JavaScript module must declare `'use strict';` and execute within an IIFE or ES module sandbox.
- **State Serialization**: All `localStorage` interactions must utilize safe try-catch serialization wrappers (`LS.get`, `LS.set`).
- **DOM Queries**: Avoid repeated queries inside loops; cache references during module initialization.
- **No Inline Styles for Animations**: Dynamic animations must toggle CSS classes or modify CSS variables rather than overwriting inline styling attributes.

---

## 9. VOICE & AGENT COMMAND GRAMMAR

The on-device rule engine (`ruleAgent`) intercepts user intents instantly before querying the neural model. Future agents must preserve and extend this grammar table:

| Intent Category | Voice / Text Syntax Pattern | Target Handler | Fallback Mode |
|:---|:---|:---|:---|
| **Alarms** | `alarm (at)? <time> [label]` | `DB.add('alarms')` + SW Alarm | Speech feedback |
| **Timers** | `timer <N> (min\|sec\|hr)` | `Timer.start()` + countdown | Audio pulse |
| **Notes** | `note:? <text>` | `DB.add('notes')` | Monospace toast |
| **Tasks** | `(todo\|task):? <text>` | `DB.add('tasks')` | Workspace sync |
| **Summon** | `hey <prefix>` \| Long-press Power | `raiseAssistant()` | Voice overlay |
| **Time/Date**| `what time is it?` \| `date` | System clock interpolation | Voice synthesis |
| **General Q&A**| Natural language query | `Engine.generate()` | Rule fallback |

---

## 10. STEP-BY-STEP ENHANCEMENT ROADMAP FOR FUTURE AGENTS

When enhancing or modifying this repository:

1. **Verify Asset Integrity**: Ensure all scripts referenced in `index.html` exist in `js/` with zero 404 errors.
2. **Preserve Offline Execution**: Never introduce external API dependencies for core functionality (voice recognition, model inference, storage).
3. **Maintain AMOLED Strictness**: Do not introduce tinted background colors or non-monochrome palettes without explicit architectural review.
4. **Profile GPU Memory**: Test Three.js canvas resizes across mobile and desktop to prevent WebGL context loss.
5. **Verify PWA Installation**: Validate `manifest.webmanifest` and `sw.js` cache-first strategies after any HTML/CSS modification.
6. **Benchmark Token Generation**: Verify token generation metrics remain stable when modifying memory digestion logic in `app.js`.
7. **Test Hardware Triggers**: Simulate power-key hold via `Alt` key and verify assistant surfaces seamlessly.

---

## 11. SECURITY & DATA PRIVACY INVARIANTS

Future developers and automated coding agents must never breach the following security invariants:

1. **Zero Outbound Telemetry**:
   No analytics packets, pingbacks, error tracking pings (e.g., Sentry, Google Analytics), or model logs may be transmitted over network sockets.
2. **Local Key Protection**:
   Never store plaintext passwords, private access tokens, or sensitive API keys inside repository files or client-side web storage.
3. **Microphone Isolation**:
   Continuous speech recognition buffers must be cleared immediately after keyword parsing. Raw audio data is never written to disk or transmitted.
4. **Sandboxed Service Worker**:
   The service worker (`sw.js`) must only intercept origin requests and cached CDN dependencies. It must never proxy external unauthorized endpoints.
5. **DOM Sanitization**:
   All user-supplied content (note titles, task labels, chat queries) rendered into DOM nodes must be safely escaped via `esc()` or assigned strictly to `textContent`.

---

## 12. ECOMMERCE & GRAPHICS MODULE EXPANSION PROTOCOLS

The repository contains modular CSS suites under `css/ecom/` (52 files) and `css/gfx/` (52 files) representing a complete ecommerce design kit and procedural graphic effects:

### 12.1 E-Commerce Subsystem Architecture (`css/ecom/`)
- Tokens (`e00-store-tokens.css`): Dedicated store primitives matching AMOLED dark-mode luxury aesthetics.
- Navigation & Storefront (`e01-shop-nav.css` through `e05-filters.css`): Liquid-glass navigation bars, responsive PLP grid layouts, interactive facet filter drawers.
- Conversion Funnel (`e06-pdp.css` through `e08-checkout.css`): High-conversion product display pages, sliding off-canvas cart drawers, and local-tokenized checkout flows.
- Loyalty & Engagement (`e10-wishlist.css` through `e14-account.css`): Client-persisted wishlists, customer reviews with sentiment tags, and account security management.
- Micro-Interactions & Trust (`e16-toasts.css` through `e21-trust.css`): Shimmering skeleton placeholders, empty-state illustrations, sizing guides, and trust seals.

### 12.2 Visual FX Subsystem Architecture (`css/gfx/`)
- Volumetric Shading (`gfx01-code-bloom-scene.css`, `gfx02-petal-3d.css`): CSS 3D perspective scenes simulating spatial particle fields and floral algorithmic blooms.
- Sci-Fi Terminal & Matrix Rain (`gfx04-terminal-rain.css`): Monospace data streams with phosphor scanline decays.
- Parallax & Depth (`gfx08-depth-parallax.css`, `gfx18-depth-of-field.css`): Layered z-stack transformations keyed to pointer coordinates and scroll offsets.
- Optical Caustics (`gfx26-liquid-metal.css`): Dynamic liquid metal shaders utilizing SVG filters and CSS background-clip techniques.
- Performance & Accessibility (`gfx45-gpu-tiers.css`, `gfx46-reduced-motion.css`): Automated degradation for legacy GPUs and forced-color mode compatibility for high-contrast accessibility.

---

## 13. ON-DEVICE CONTINUOUS LEARNING PIPELINE

The `js/learn.js` module executes on-device reinforcement and adaptation through three distinct tiers:

1. **Associative Memory Vector Store**:
   - High-frequency query patterns and accepted agent task outputs are hashed into local sparse feature vectors stored in IndexedDB.
   - Queries are evaluated using cosine similarity against historical exemplars.
2. **LoRA-Lite Gradient Adaptation**:
   - When TensorFlow.js is available and the client device is charging or idle, backpropagation updates a low-rank adapter matrix fused into the inference pipeline.
3. **Privacy Scrubbing & Erasure**:
   - The user retains total sovereignty. The "Forget Everything" trigger executes an atomic purge of the associative memory database and resets adapter weights to baseline distribution in under 20 milliseconds.

---

## 14. MULTI-SPECIALIST TEAM OPERATING MODEL

Every major architectural alteration to the Liquid Core codebase must pass review by the simulated internal specialist panel:

1. **Lead Architect**: Verifies structural cohesion, modular boundaries, zero-breaking changes, and minimal DOM pollution.
2. **Senior Frontend Engineer**: Confirms modern ES6+ idiomatic JavaScript, modular CSS structure, fluid clamp values, and zero layout thrashing.
3. **UI/UX Designer**: Enforces optical balance, typography scale ratios, generous tap targets, and consistent monochrome palette fidelity.
4. **Creative 3D Designer**: Audits Three.js memory allocations, shader performance, procedural textures, and smooth orbital transitions.
5. **Performance Engineer**: Validates 60fps frame rates, tests GPU memory containment, inspects bundle sizes, and eliminates render-blocking bottlenecks.
6. **Accessibility & QA Engineer**: Checks keyboard traps, WCAG AA color contrast, screen reader aria announcements, and reduced-motion fallbacks.
7. **Security & Code Review Engineer**: Ensures zero telemetry, prevents secret exposure, eliminates unsafe innerHTML injection, and validates service worker offline boundaries.

---

## 15. PRE-RELEASE VALIDATION CHECKLIST

Before pushing any commit or release tag to the repository:

- [ ] All JavaScript files execute with zero syntax errors (`node -c <file>` or browser console validation).
- [ ] No 404 network errors for local assets referenced in `index.html`.
- [ ] Speech recognition handlers properly index `e.results[i][0].transcript`.
- [ ] Three.js animation loop does not allocate objects in tick frames.
- [ ] Mobile dock displays properly below 680px and remains hidden on desktop.
- [ ] Service worker registers and precaches offline assets.
- [ ] Reduced-motion media query completely silences animations.
- [ ] IndexedDB initializes cleanly on a fresh profile without errors.
- [ ] No API keys, tokens, or credentials exist in the commit tree.

---
*Liquid Core Architecture Standard — PIK Inc. — Permanent Agent Engineering Manual*


---

## 16. CORE API REFERENCE & EVENT CONTRACTS

Liquid Core facilitates decoupled inter-module coordination through the global `window.LC` bridge and standard browser CustomEvent dispatches.

### 16.1 Global `window.LC` Interface Definition
```typescript
interface LiquidCoreBridge {
  Engine: {
    status: 'idle' | 'loading' | 'ready' | 'failed';
    busy: boolean;
    load: () => Promise<void>;
    generate: (prompt: string, history: Array<{role: string, content: string}>) => Promise<string | null>;
  };
  Voice: {
    prefix: string;
    armed: boolean;
    speak: (text: string) => void;
    arm: () => void;
    disarm: () => void;
    toggle: () => void;
  };
  DB: {
    add: (store: 'notes' | 'tasks' | 'alarms', item: object) => Promise<number>;
    all: (store: 'notes' | 'tasks' | 'alarms') => Promise<Array<object>>;
    del: (store: 'notes' | 'tasks' | 'alarms', id: number) => Promise<void>;
    up: (store: 'notes' | 'tasks' | 'alarms', item: object) => Promise<void>;
  };
  handleUserCommand: (rawInput: string, options?: { voice?: boolean }) => Promise<void>;
  raiseAssistant: (spokenFragment?: string) => void;
  sysMsg: (text: string) => void;
  pulse3D: () => void;
}
```

### 16.2 Custom Event Protocol
- **`lc-pulse`**: Dispatched to request an instant optical refraction pulse across the Three.js liquid chrome sphere and ambient glass materials.
- **`lc:wake`**: Dispatched when the wake-word listener spotter matches `hey <prefix>`. Detail payload: `{ text: string }`.
- **`lc:power-summon`**: Dispatched on physical Android power button long-press or desktop `Alt` key emulation.
- **`lc:sheet-toggle`**: Dispatched when workspace sheets open or close to coordinate canvas framerate throttling.

---

## 17. GLOSSARY OF ARCHITECTURAL TERMS

- **AMOLED Invariant**: The design mandate that background surfaces evaluate to strict `#000000`, enabling organic light-emitting pixels to physically deactivate, saving power and creating infinite optical contrast.
- **Caustic Refraction**: Procedural simulation of light rays focused through curved transparent surfaces, realized in Liquid Core via SVG turbulence displacement filters.
- **Cold-Boot Alarm Sweep**: The initialization routine in `app.js` and `sw.js` that scans IndexedDB on startup to fire any notifications or alarms that matured while the application process was suspended.
- **Edge Specular**: A hairline highlight positioned along the top or active edge of an element, creating the illusion of a polished physical glass bevel under overhead lighting.
- **Micro-Grain**: Fine-grain dynamic noise synthesized via procedural SVG filters, animated across randomized frames to provide physical tactility and prevent visual banding in dark gradient fields.
- **Offline Sovereignty**: The core technical requirement that zero remote network calls are needed for intelligence, storage, speech, or computation once the initial application shell and model weights are cached.
