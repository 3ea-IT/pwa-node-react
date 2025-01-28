const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/static/js/bundle.js",
  "/static/js/0.chunk.js",
  "/static/js/main.chunk.js",
  // add other assets you want to cache
];

/* eslint-disable no-restricted-globals */
self.addEventListener("push", function (event) {
  if (event.data) {
    var msg = event.data.text();
    var aray = msg.split("|");
    const title = aray[0];
    const options = {
      body: aray[1],
      icon: "/logo192.png",
      badge: "/logo192.png",
      image: aray[2],
      tag: "renotify",
      renotify: true,
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(`${process.env.REACT_APP_API_URL}?q=webPush`)
  );
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (response) {
        return response || fetch(event.request);
      })
      .catch(function () {
        return caches.match(OFFLINE_URL);
      })
  );
});

/* eslint-enable no-restricted-globals */
