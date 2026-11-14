const CACHE = 'snam-qms-v170';
const ASSETS = [
  './', './index.html', './assets/styles.css', './assets/app.js', './assets/seed.js',
  './assets/vendor/qrcode.js', './manifest.webmanifest',
  './assets/brand/snam-logo-gold.png', './assets/brand/snam-logo-white.png',
  './assets/brand/icon-192.png', './assets/brand/icon-512.png', './assets/brand/apple-touch-icon.png',
  './assets/brand/favicon.png'
];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  const isDoc = e.request.mode === 'navigate' || url.pathname.endsWith('.html');

  if (isDoc) {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(h => h || caches.match('./index.html'))));
    return;
  }

  e.respondWith(caches.match(e.request).then(hit => {
    const network = fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => hit);
    return hit || network;
  }));
});
