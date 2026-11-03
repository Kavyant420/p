/* ============================================================
   LIQUID CORE — offline service worker
   Caches the app shell + model blobs so everything runs
   with the network fully dead.
   ============================================================ */
const VERSION = 'liquid-core-v1';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
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
  const isModel = /huggingface\.co|jsdelivr\.net|registry\.js\.org/.test(url.host);

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

// Push-style local notifications coming from the agent side.
self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'local-notification') {
    self.registration.showNotification(d.title || 'Liquid Core', {
      body: d.body || '',
      icon: './icons/icon-192.png',
      tag: d.tag || 'liquid-core',
      vibrate: d.vibrate || [180, 90, 180]
    });
  }
});
