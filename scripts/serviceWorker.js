const cacheName = "camping-checklist-v1";
const filesToCache = [
  "/",
  "/index.html",
  "/style/designSystem.css",
  "/scripts/main.js",
  "/scripts/categories.js",
  "/scripts/categoryPage.js",
  "/pages/category.html"
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