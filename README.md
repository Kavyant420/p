# LIQUID CORE — on-device Qwen3 0.6B agent

Premium black & white, 3D **liquid-glass** interface for an AI that runs
**entirely inside the browser** (desktop + Android). Base model: **Qwen3 0.6B**
(`onnx-community/Qwen3-0.6B-ONNX`) via transformers.js — WebGPU with WASM fallback.
After one download everything works **offline / airplane mode** (service worker
caches shell + weights).

## What it does
- **Agent tasks**: alarms, timers ("wake me in 20 minutes"), notes, tasks, time/date —
  executed on device with real notifications + vibration (IndexedDB persisted).
- **Wake word**: user picks any prefix — say **"hey \<name\>"** and the assistant rises
  (Web Speech API, keyword spotting local to the page).
- **Summon hooks (Android)**: install as PWA → bind **long-press power key** or the
  **Accessibility shortcut** to open `index.html?cmd=wake` (Tasker/Pointer+ example:
  `am start -a android.intent.action.VIEW -d "https://…/index.html?cmd=wake"`).
  On PC: hold **Alt** (power-key proxy) to raise the orb.
- **Workspace**: notes/tasks panel doubles as the model's local memory digest.

## Files
| file | role |
|---|---|
| `index.html` | main app (marketing site + working console + workspace + voice overlay) |
| `styles.css` | monochrome liquid-glass design system |
| `scene.js` | three.js background: liquid chrome orb + refracted glass shards + post FX |
| `app.js` | engine loader, rule agent, wake word, alarms/timers, IndexedDB, PWA glue |
| `sw.js` | offline cache (shell + model blobs) |
| `manifest.webmanifest` | Android/desktop install metadata |

Run locally: `python3 -m http.server` → open `http://localhost:8000`.
GitHub Pages also works (everything is static).
