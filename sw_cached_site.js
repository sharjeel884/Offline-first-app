const cacheName = "v2";

// call installed event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
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

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // make a copy response
        const resClone = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
