const cacheName = "v1";

const cacheAssets = ["index.html", "/js/app.js"];

// call installed event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// call Activated event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");

  //   Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service worker clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("Service worker: fetching");

  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
