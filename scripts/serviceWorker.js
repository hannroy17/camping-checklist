const cacheName = "camping-checklist-v1";
const filesToCache = [
  "/camping-checklist/",
  "/camping-checklist/index.html",
  "/camping-checklist/style/designSystem.css",
  "/camping-checklist/scripts/main.js",
  "/camping-checklist/scripts/categories.js",
  "/camping-checklist/scripts/categoryPage.js",
  "/camping-checklist/scripts/serviceWorker.js",
  "/camping-checklist/pages/category.html",
  "/camping-checklist/icon-192.png",
  "/camping-checklist/icon-512.png",
  "/camping-checklist/manifest.json"
];

// Installation
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

// Activation
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});