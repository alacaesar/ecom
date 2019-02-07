var CACHE_NAME = "ECOM_V2";
var urlsToCache = ["/", "../css/style.css", "scripts.js"];

self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      //console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        //console.log('fetched from sw');
        return response;
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          //console.log('new fetch');
          return response;
        }

        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          //console.log('added to sw');
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
