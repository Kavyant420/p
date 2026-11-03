/* ============================================================
   LIQUID CORE — offline service worker
   Caches the app shell + model blobs so everything runs
   with the network fully dead.
   ============================================================ */
const VERSION = 'liquid-core-v3';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './js/ui.js',
  './js/learn.js',
  './js/background.js',
  './privacy.html',
  './css/00-tokens.css',
  './css/01-base.css',
  './css/02-liquid-glass.css',
  './css/03-layout.css',
  './css/04-components.css',
  './css/05-chat-console.css',
  './css/06-voice-wake.css',
  './css/07-android.css',
  './css/08-workspace.css',
  './css/09-motion.css',
  './css/10-android-native.css',
  './css/11-accessibility.css',
  './css/12-tablet-desktop.css',
  './css/13-widgets.css',
  './css/14-integration.css',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isModel = /huggingface\.co|jsdelivr\.net|registry\.js\.org|fonts\.g(oogleapis|static)\.com/.test(url.host);

  // Navigation requests: offline → cached app shell (works like a native cold boot)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html').then((hit) => hit || Response.error()))
    );
    return;
  }

  // Model / library blobs: cache-first, then background fill.
  if (isModel) {
    e.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req)
          .then((res) => {
            if (res && (res.status === 200 || res.status === 0)) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // App shell: stale-while-revalidate.
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});

// ---- background alarm scheduler (works even when the page is closed,
//      while the SW process survives; PeriodicSync re-sweeps on OS wake) --
let alarmTimers = [];
function scheduleAlarms(alarms){
  alarmTimers.forEach(clearTimeout); alarmTimers = [];
  const now = Date.now();
  for (const a of alarms || []){
    const t = new Date(a.time).getTime();
    if (!t || a.fired) continue;
    const delay = t - now;
    if (delay <= 0){ fireAlarm(a, true); continue; }
    if (delay > 2147483647) continue; // >24 days: rely on periodic sweep instead
    alarmTimers.push(setTimeout(() => fireAlarm(a), delay));
  }
}
function fireAlarm(a, overdue){
  self.registration.showNotification('⏰ Liquid Core · ' + (a.label || 'Alarm'), {
    body: (overdue ? 'Came due at ' : '') + new Date(a.time).toLocaleTimeString() +
          ' — tap to open the core.',
    icon: './icons/icon-192.png',
    tag: 'lc-alarm-' + a.id,
    vibrate: [500, 200, 500, 200, 900],
    requireInteraction: true,
    data: { openUrl: './index.html?cmd=alarms' }
  });
  // mark fired in DB (SW can't touch IndexedDB store used by page? it can—same origin)
  indexedDB.open('liquid-core', 2).onsuccess = (ev) => {
    const db = ev.target.result;
    try {
      const t = db.transaction('alarms', 'readwrite');
      const rq = t.objectStore('alarms').get(a.id);
      rq.onsuccess = () => { if (rq.result) t.objectStore('alarms').put({ ...rq.result, fired: true }); };
    } catch (e) {}
  };
}

self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'local-notification') {
    self.registration.showNotification(d.title || 'Liquid Core', {
      body: d.body || '',
      icon: './icons/icon-192.png',
      tag: d.tag || 'liquid-core',
      vibrate: d.vibrate || [180, 90, 180],
      data: { openUrl: './index.html' }
    });
  }
  if (d.type === 'schedule-alarms') scheduleAlarms(d.alarms);
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.openUrl) || './index.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list){
        if ('focus' in c){ return c.focus(); }
      }
      return clients.openWindow(url);
    })
  );
});

// ---- OS-level wakeups: Background Sync + Periodic Sync sweeps alarms ----
async function sweepFromDB(){
  try {
    const db = await new Promise((res, rej) => {
      const rq = indexedDB.open('liquid-core', 2);
      rq.onupgradeneeded = () => { const d = rq.result;
        ['notes','tasks','alarms'].forEach(s => { if (!d.objectStoreNames.contains(s))
          d.createObjectStore(s, { keyPath:'id', autoIncrement:true }); }); };
      rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
    });
    const alarms = await new Promise((res) => {
      const r = db.transaction('alarms','readonly').objectStore('alarms').getAll();
      r.onsuccess = () => res(r.result||[]); r.onerror = () => res([]);
    });
    scheduleAlarms(alarms);
  } catch (e) {}
}
self.addEventListener('sync', (e) => {
  if (e.tag === 'lc-alarm-sweep'){
    e.waitUntil(sweepFromDB());
  }
});
self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'lc-alarm-sweep'){
    e.waitUntil(sweepFromDB());
  }
});
