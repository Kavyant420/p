/* ============================================================
   LIQUID CORE · ui.js — the interaction layer that makes every
   stylesheet above actually run:
     • pointer spotlight (--mx/--my), cursor lens, tilt cards
     • ripple + magnetic buttons + haptics
     • scroll reveal observer + rail auto-hide + active nav
     • Android native detection (Capacitor/standalone) + safe-area
       sync + keyboard inset (--kbh) via visualViewport
     • battery saver → low-power class; GPU probe → weak-gpu class
     • long-press power simulation on the phone mock (--lp ring)
     • wake-word "ear" keeper: survives backgrounding while the
       APK/PWA is alive (rolling energy gate over mic stream)
     • offline status classes for 10-android-native.css
   Loaded with `defer` from index.html. Zero dependencies.
   ============================================================ */

(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  const root = doc.documentElement;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const raf = window.requestAnimationFrame.bind(window);

  /* ---------- boot state (09-motion.css boot-in) ---------- */
  body.classList.add('booting');
  addEventListener('load', () => setTimeout(() => body.classList.remove('booting'), 1400), { once: true });

  /* ---------- preferences mirror ---------- */
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const applyPrefs = () => {
    if (mqReduce.matches) body.classList.add('reduce-motion');
    else body.classList.remove('reduce-motion');
    try {
      const saved = JSON.parse(localStorage.getItem('lc.prefs') || '{}');
      body.classList.toggle('high-contrast', !!saved.contrast);
      body.classList.toggle('large-text', !!saved.largeText);
    } catch (e) {}
  };
  mqReduce.addEventListener?.('change', applyPrefs);
  applyPrefs();

  /* ---------- Android / installed-app detection (10-android-native.css) ---------- */
  const standalone = matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true;
  const isAndroid = /android/i.test(navigator.userAgent);
  const hasCapacitor = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  if (hasCapacitor || (standalone && isAndroid)) body.classList.add('native-app');
  if (!hasCapacitor) body.classList.add('no-native-gestures'); // show gesture alternatives

  /* ---------- safe-area sync (native insets may exceed env()) ---------- */
  function syncSafeAreas() {
    if (!hasCapacitor) return;
    try {
      const w = window.Capacitor?.Plugins?.StatusBar;
      w?.getInfo?.().then?.((info) => {
        if (info?.height != null) root.style.setProperty('--safe-top', info.height + 'px');
      }).catch(() => {});
    } catch (e) {}
  }
  syncSafeAreas();

  /* ---------- soft-keyboard inset for chat/dock lift ---------- */
  if (window.visualViewport) {
    let lastH = visualViewport.height;
    visualViewport.addEventListener('resize', () => {
      const shrink = innerHeight - visualViewport.height - visualViewport.offsetTop;
      if (shrink > 80) {
        root.style.setProperty('--kbh', shrink + 'px');
        body.classList.add('kb-open');
      } else if (lastH !== visualViewport.height) {
        body.classList.remove('kb-open');
        root.style.removeProperty('--kbh');
      }
      lastH = visualViewport.height;
    }, { passive: true });
  }

  /* ---------- offline badge classes ---------- */
  const setNet = () => {
    body.classList.toggle('is-offline', !navigator.onLine);
    const dot = doc.getElementById('netDot');
    const lbl = doc.getElementById('netLabel');
    if (dot) dot.classList.toggle('offline', !navigator.onLine);
    if (lbl) lbl.textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
  };
  addEventListener('online', setNet); addEventListener('offline', setNet); setNet();

  /* ---------- GPU probe → weak-gpu degradation ---------- */
  (function probeGPU() {
    try {
      const c = doc.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) { body.classList.add('weak-gpu'); return; }
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const r = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      if (/Mali-4|Adreno\s(3|4)\d{2}|PowerVR|SwiftShader/i.test(r)) body.classList.add('weak-gpu');
    } catch (e) { body.classList.add('weak-gpu'); }
  })();

  /* ---------- battery saver → low-power mode ---------- */
  if (navigator.getBattery) {
    navigator.getBattery().then((b) => {
      const apply = () => body.classList.toggle('low-power', b.level < 0.15);
      apply();
      b.addEventListener('levelchange', apply);
      b.addEventListener('chargingchange', apply);
    }).catch(() => {});
  }

  /* ---------- pointer spotlight on glass (--mx/--my) ---------- */
  let spotRaf = 0;
  doc.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (spotRaf) return;
    spotRaf = raf(() => {
      spotRaf = 0;
      const el = e.target.closest?.('.glass');
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }
      if (body.classList.contains('lens-on')) {
        root.style.setProperty('--lens-x', e.clientX + 'px');
        root.style.setProperty('--lens-y', e.clientY + 'px');
      }
    });
  }, { passive: true });

  // enable lens only on capable desktops
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !body.classList.contains('weak-gpu')) {
    body.classList.add('lens-on');
    doc.addEventListener('pointerleave', () => { root.style.setProperty('--lens-x', '-999px'); root.style.setProperty('--lens-y', '-999px'); });
  }

  /* ---------- 3D tilt cards (.tilt) ---------- */
  doc.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  /* ---------- ripple + haptic on all buttons ---------- */
  const buzz = (ms = 8) => { try { navigator.vibrate?.(ms); } catch (e) {} };
  doc.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest?.('.btn, .liquid-btn, .tile, .dock button, .task-box');
    if (!btn) return;
    if (isAndroid) buzz(6);
    if (body.classList.contains('reduce-motion')) return;
    const sp = doc.createElement('span');
    sp.className = 'ripple';
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    sp.style.width = sp.style.height = size + 'px';
    sp.style.left = (e.clientX - r.left - size / 2) + 'px';
    sp.style.top = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(sp);
    setTimeout(() => sp.remove(), 640);
  }, { passive: true });

  /* ---------- magnetic hero CTA ---------- */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    doc.querySelectorAll('.liquid-btn, #btnBoot').forEach((b) => {
      b.classList.add('magnetic');
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px');
        b.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px');
      }, { passive: true });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
    });
  }

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  doc.querySelectorAll('[data-reveal]').forEach((el, i) => {
    if (el.parentElement?.hasAttribute('data-reveal-group')) el.style.setProperty('--i', i % 8);
    io.observe(el);
  });

  /* ---------- rail auto-hide on scroll down + active nav ---------- */
  const rail = doc.getElementById('topRail');
  let lastY = scrollY, ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    raf(() => {
      const y = scrollY;
      if (rail) rail.classList.toggle('hidden-up', y > lastY + 8 && y > 240);
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  const navLinks = [...doc.querySelectorAll('.rn, .mob-drawer a')];
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = '#' + en.target.id;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  }, { threshold: 0.4 });
  doc.querySelectorAll('section[id]').forEach((s) => secIO.observe(s));

  /* ---------- hamburger drawer ---------- */
  const burger = doc.getElementById('hamburger');
  const drawer = doc.getElementById('mobDrawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      buzz();
    });
    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') { drawer.classList.remove('open'); burger.classList.remove('open'); }
    });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') { drawer.classList.remove('open'); burger.classList.remove('open'); } });
  }

  /* ---------- phone mock: long-press power ring (--lp) ---------- */
  const pw = doc.getElementById('phPower');
  const phone = doc.getElementById('phoneMock');
  if (pw && phone) {
    let lpTimer = null, lpStart = 0;
    const stop = () => { clearTimeout(lpTimer); lpTimer = null; pw.classList.remove('pressed'); pw.style.setProperty('--lp', 0); };
    const tick = () => {
      const p = clamp((performance.now() - lpStart) / 1200 * 100, 0, 100);
      pw.style.setProperty('--lp', p.toFixed(0));
      if (p >= 100) {
        phone.classList.add('assistant-open', 'listening');
        buzz([20, 40, 20]);
        doc.dispatchEvent(new CustomEvent('lc:power-summon'));
        setTimeout(() => phone.classList.remove('listening'), 2400);
        stop();
      } else { lpTimer = setTimeout(tick, 40); }
    };
    pw.addEventListener('pointerdown', (e) => { e.preventDefault(); pw.classList.add('pressed'); lpStart = performance.now(); tick(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => pw.addEventListener(ev, stop));
  }

  /* ---------- wake prefix input (index.html #wakePrefix) ---------- */
  const wakeInput = doc.getElementById('wakePrefix');
  if (wakeInput) {
    wakeInput.addEventListener('change', () => {
      const v = wakeInput.value.trim().toLowerCase().replace(/[^a-z0-9 _-]/g, '').slice(0, 14);
      if (v && window.Voice) { Voice.prefix = v; try { localStorage.setItem('lc.prefix', v); } catch (e) {} }
      if (v) WakeEar.setPrefix(v);
    });
  }

  /* ---------- power-summon event → also open the voice overlay ---------- */
  doc.addEventListener('lc:power-summon', () => {
    // app.js listens for this too; ui.js just mirrors state on the mock
    phone?.classList.add('assistant-open');
  });

  /* ---------- toast API used by app.js ---------- */
  let stack = doc.querySelector('.toast-stack');
  if (!stack) { stack = doc.createElement('div'); stack.className = 'toast-stack'; body.appendChild(stack); }
  window.LCUI = {
    toast(msg, kind = '') {
      const t = doc.createElement('div');
      t.className = 'toast glass pressable ' + kind;
      t.setAttribute('role', 'status');
      t.textContent = msg;
      stack.appendChild(t);
      if (isAndroid) buzz();
      setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3200);
    },
    buzz,
    announce(text) {  // screen-reader live region
      let live = doc.querySelector('.live-announce');
      if (!live) {
        live = doc.createElement('div');
        live.className = 'live-announce';
        live.setAttribute('aria-live', 'assertive');
        body.appendChild(live);
      }
      live.textContent = '';
      setTimeout(() => { live.textContent = text; }, 30);
    }
  };

  /* ============================================================
     BACKGROUND WAKE EAR — keeps "hey {name}" alive while the
     APK/PWA sits in the background (as long as the process lives;
     Doze can still cut it — the UI surfaces a doze-card hint).
     Energy-gated so it costs ~nothing when idle.
     ============================================================ */
  const WakeEar = {
    ctx: null, stream: null, analyser: null,
    running: false,
    prefix: (localStorage.getItem('lc.wake') || 'nova').toLowerCase(),
    listeners: [],

    async arm() {
      if (this.running) return true;
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      } catch (e) {
        window.LCUI?.toast('Microphone permission needed for the wake ear', 'err');
        return false;
      }
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = this.ctx.createMediaStreamSource(this.stream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      src.connect(this.analyser);

      // lightweight loop: sample RMS at 10Hz — near-zero CPU
      const buf = new Float32Array(this.analyser.fftSize);
      const poll = () => {
        if (!this.running) return;
        this.analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 0.012) this._fire('voice-activity', rms);   // hand off to STT pass
        setTimeout(poll, 100);
      };
      this.running = true;
      poll();
      this._fire('armed');
      return true;
    },

    disarm() {
      this.running = false;
      this.stream?.getTracks().forEach((t) => t.stop());
      this.ctx?.close?.().catch(() => {});
      this.stream = this.ctx = null;
      this._fire('disarmed');
    },

    setPrefix(p) {
      this.prefix = String(p || '').trim().toLowerCase() || 'nova';
      localStorage.setItem('lc.wake', this.prefix);
      this._fire('prefix-change', this.prefix);
    },

    /** Called by app.js when SpeechRecognition transcribes something. */
    checkTranscript(text) {
      const t = String(text).toLowerCase();
      const idx = t.indexOf('hey ' + this.prefix);
      if (idx !== -1) {
        const rest = t.slice(idx + 4 + this.prefix.length).replace(/^[,.!?\s]+/, '');
        this._fire('wake', rest);
        return rest;
      }
      return null;
    },

    on(ev, fn) { this.listeners.push({ ev, fn }); },
    _fire(ev, data) { this.listeners.filter((l) => l.ev === ev || l.ev === '*').forEach((l) => { try { l.fn(data); } catch (e) { console.warn(e); } }); }
  };
  window.WakeEar = WakeEar;

  // keep the AudioContext alive through tab switches on the APK
  doc.addEventListener('visibilitychange', () => {
    if (doc.visibilityState === 'visible' && WakeEar.ctx?.state === 'suspended') WakeEar.ctx.resume().catch(() => {});
  });

  /* ---------- wire the existing page controls to the ear ---------- */
  const micState = doc.getElementById('micState');
  const btnArm = doc.getElementById('btnArmMic');
  const armLabel = () => 'ARM EAR ▸ “hey ' + WakeEar.prefix + '”';
  WakeEar.on('armed', () => {
    if (micState) { micState.textContent = 'EAR: ARMED — SAY “HEY ' + WakeEar.prefix.toUpperCase() + '”'; micState.classList.add('armed'); }
    if (btnArm) btnArm.textContent = 'DISARM EAR';
    doc.querySelector('.bg-live')?.classList.add('on');
  });
  WakeEar.on('disarmed', () => {
    if (micState) { micState.textContent = 'EAR: DISARMED'; micState.classList.remove('armed'); }
    if (btnArm) btnArm.textContent = armLabel();
    doc.querySelector('.bg-live')?.classList.remove('on');
  });
  WakeEar.on('prefix-change', (p) => {
    doc.querySelectorAll('#armEcho, #prefixEcho').forEach((el) => el.textContent = p);
    if (btnArm && !WakeEar.running) btnArm.textContent = armLabel();
  });
  btnArm?.addEventListener('click', async () => {
    if (WakeEar.running) { WakeEar.disarm(); }
    else {
      if (btnArm) btnArm.textContent = 'LISTENING…';
      const ok = await WakeEar.arm();
      if (!ok && btnArm) btnArm.textContent = armLabel();
    }
  });

  /* ---------- service worker registration (offline engine) ---------- */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
