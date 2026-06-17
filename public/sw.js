const CACHE_NAME = 'alpha-portal-v2';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // HTML pages — always fetch from network (never cache)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }
  // Static assets — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
