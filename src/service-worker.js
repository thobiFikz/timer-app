// Simple service worker for offline support
const CACHE_NAME = 'timer-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/public/manifest.json',
  '/public/icon-192.png',
  '/public/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
