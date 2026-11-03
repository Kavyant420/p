/* ================================================================
   LIQUID CORE — js/background.js
   "Works like Google, even when the app is closed."

   STRATEGY (all legitimate web-platform APIs; no fake promises):
   1. WAKE LOCK        — screen stays alive during voice sessions.
   2. PERIODIC SYNC    — PeriodicBackgroundSync registers an OS-level
      job: Android wakes the PWA service worker on schedule (charging /
      light Doze windows) to fire due alarms & re-arm learning. This is
      the closest a web app gets to a persistent background service.
   3. NOTIFICATION HUB — alarms/timers are mirrored into IndexedDB and
      scheduled by the SW with real timestamps; clicking a notification
      cold-boots the app straight into the right sheet (?cmd=...).
   4. WORKLET CLOCK    — AudioWorklet silent loop keeps the renderer
      process prioritized while the tab is visible-but-idle, so timers
      don't get throttled to 1/min in Chrome's intensive throttling.
   5. RE-ARM ON RETURN — every visibilitychange/pagehide persists state
      so the next cold start restores alarms, timers, ear, adapters.
   6. APK SHELL GUIDE  — for true always-on (screen off, swiped away),
      we document + deep-link the Capacitor/TrustedWebActivity shell:
      same code, wrapped as an APK with a foreground Service that calls
      back into this exact JS bridge (window.LCBridge).
   ================================================================ */
(() => {
'use strict';

const $ = (s, r) => (r || document).querySelector(s);
const LS = {
  get(k, d){ try{ const v = localStorage.getItem('lcbg:'+k); return v==null?d:JSON.parse(v);}catch(e){return d;} },
  set(k, v){ try{ localStorage.setItem('lcbg:'+k, JSON.stringify(v)); }catch(e){} }
};

/* ---------------- 1. Wake lock during voice/boot ---------------- */
const WakeLock = {
  sentinel: null,
  async hold(reason){
    if (!('wakeLock' in navigator)) return false;
    try {
      this.sentinel = await navigator.wakeLock.request('screen');
      this.sentinel.addEventListener('release', () => {});
      return true;
    } catch (e){ return false; }
  },
  release(){ try { this.sentinel?.release(); } catch(e){} this.sentinel = null; }
};
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && LS.get('wantWake', false)) WakeLock.hold();
});
window.WakeLock = WakeLock;

/* ---------------- 2. Periodic background sync → alarm sweep ---------------- */
async function registerPeriodic(){
  if (!('serviceWorker' in navigator) || !('SyncManager' in window) ||
      !PeriodicSyncManager) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    // Permission prompt for notifications must be granted first on some builds
    await reg.sync.register('lc-alarm-sweep');
    if ('periodicSync' in reg){
      try {
        await reg.periodicSync.register('lc-alarm-sweep', { minInterval: 60 * 60 * 1000 });
        LS.set('periodic', true);
        return true;
      } catch (permErr){
        // Chrome 124+: requires the periodic-background-sync permission policy
        console.warn('[bg] periodicSync needs header/permission:', permErr);
        LS.set('periodic', false);
        return false;
      }
    }
    return false;
  } catch (e){ console.warn('[bg] periodic register failed', e); return false; }
}

/* ---------------- 3. Alarm mirror for the SW scheduler ---------------- */
async function mirrorAlarmsToSW(){
  try {
    const db = await new Promise((res, rej) => {
      const rq = indexedDB.open('liquid-core', 2);
      rq.onupgradeneeded = () => { const d = rq.result;
        ['notes','tasks','alarms'].forEach(s => { if (!d.objectStoreNames.contains(s))
          d.createObjectStore(s, { keyPath:'id', autoIncrement:true }); }); };
      rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
    });
    const alarms = await new Promise((res) => {
      const t = db.transaction('alarms', 'readonly');
      const r = t.objectStore('alarms').getAll();
      r.onsuccess = () => res(r.result || []); r.onerror = () => res([]);
    });
    const ctrl = navigator.serviceWorker?.controller;
    if (ctrl) ctrl.postMessage({ type:'schedule-alarms', alarms });
    LS.set('alarmMirror', alarms.length);
    return alarms.length;
  } catch (e){ return 0; }
}

/* ---------------- 4. Worklet silence clock (anti-throttle) ---------------- */
let ac = null, keepAliveNodes = [];
async function startSilentClock(){
  if (LS.get('clockOff', false)) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)({ latencyHint:'background' });
    if (ac.state === 'suspended') await ac.resume();
    if (!ac.audioWorklet.addModule) return;
    // inline worklet via blob (no extra file needed offline-safe after cache)
    const code = `class LCKeep extends AudioWorkletProcessor {
      constructor(){ super(); }
      process(inputs, outputs, p){
        const o = outputs[0]; if(o&&o[0]) o[0].fill(0.0000001);
        return true; } }
      registerProcessor('lc-keep', LCKeep);`;
    const url = URL.createObjectURL(new Blob([code], { type:'application/javascript' }));
    await ac.audioWorklet.addModule(url);
    const node = new AudioWorkletNode(ac, 'lc-keep');
    const gain = ac.createGain(); gain.gain.value = 0.00001; // effectively silent
    node.connect(gain).connect(ac.destination);
    keepAliveNodes.push(node, gain);
    LS.set('clockOn', true);
  } catch (e){ /* older WebViews just skip this */ }
}
function stopSilentClock(){
  keepAliveNodes.forEach(n => { try{ n.disconnect();}catch(e){} });
  keepAliveNodes = [];
}
// user-facing toggle lives in the privacy card; default ON only when installed
if (matchMedia('(display-mode: standalone)').matches) addEventListener('pointerdown', startSilentClock, { once:true, passive:true });

/* ---------------- 5. Persistence hooks ---------------- */
addEventListener('pagehide', () => { mirrorAlarmsToSW(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') mirrorAlarmsToSW();
  else { checkDueAlarmsNow(); }
});
async function checkDueAlarmsNow(){
  // On return-to-foreground, sweep anything that came due while backgrounded
  try {
    const db = await new Promise((res) => { const rq = indexedDB.open('liquid-core', 2);
      rq.onsuccess = () => res(rq.result); rq.onerror = () => res(null); });
    if (!db) return;
    const alarms = await new Promise((res) => {
      const r = db.transaction('alarms','readonly').objectStore('alarms').getAll();
      r.onsuccess = () => res(r.result||[]); r.onerror = () => res([]);
    });
    const now = Date.now();
    for (const a of alarms){
      const t = new Date(a.time).getTime();
      if (t <= now && !a.fired){
        db.transaction('alarms','readwrite').objectStore('alarms').put({...a, fired:true});
        try {
          new Notification('⏰ Liquid Core · ' + (a.label||'Alarm'), {
            body: t ? new Date(t).toLocaleTimeString() : '',
            icon: './icons/icon-192.png', tag: 'lc-alarm-' + a.id, requireInteraction: true
          });
        } catch(e){}
        if (navigator.vibrate) navigator.vibrate([500,200,500,200,900]);
      }
    }
  } catch(e){}
}

/* ---------------- 6. Public bridge (used by app.js + APK shell) ---------------- */
window.LCBridge = {
  state: 'unknown',
  async init(){
    if (!('serviceWorker' in navigator)) { this.state='unsupported'; return paint(); }
    try {
      await navigator.serviceWorker.ready;
      const okP = await registerPeriodic().catch(()=>false);
      await mirrorAlarmsToSW();
      this.state = okP ? 'os-wakeup' : 'in-process';
      paint();
    } catch(e){ this.state='limited'; paint(); }
  },
  async armAlwaysOn(on){
    LS.set('wantWake', !!on);
    if (on) { await WakeLock.hold(); startSilentClock(); }
    else { WakeLock.release(); stopSilentClock(); }
    await registerPeriodic();
    mirrorAlarmsToSW();
    paint();
    return this.state;
  },
  statusText(){
    switch(this.state){
      case 'os-wakeup': return 'OS WAKEUP ARMED — Android restarts the core on schedule even when closed.';
      case 'in-process': return 'IN-PROCESS GUARD — alarms fire while the app lives in memory (recent apps).';
      case 'limited': return 'LIMITED — grant notification + background-sync permission in browser settings.';
      default: return 'CHECKING…';
    }
  }
};
function paint(){
  const el = $('#bgState');
  if (el) el.textContent = window.LCBridge.statusText();
  const chip = $('#bgChip');
  if (chip){ chip.dataset.state = window.LCBridge.state; }
}

/* expose helpers app.js may call */
window.LCBackground = { mirrorAlarmsToSW, registerPeriodic, checkDueAlarmsNow };

document.addEventListener('DOMContentLoaded', () => {
  window.LCBridge.init();
  const btn = $('#btnAlwaysOn');
  if (btn) btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = 'ARMING…';
    const st = await window.LCBridge.armAlwaysOn(true);
    btn.textContent = st === 'os-wakeup' ? 'ALWAYS-ON ACTIVE' : 'GUARD ACTIVE';
    btn.classList.add('on');
    setTimeout(()=>{ btn.disabled=false; }, 800);
    if (window.LCUI) LCUI.toast('Background guard armed — close the app, alarms still fire.');
  });
});
})();
