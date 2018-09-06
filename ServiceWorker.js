let getCache = () => caches.open('mux').catch(console.error);

self.addEventListener('install', function(event) {
  console.log('installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('activate');
  event.waitUntil(clients.claim());
  getCache().then((c) => {
    c.keys().then((k) => k.forEach((e) => c.delete(e))).catch(console.error);
  });
});

self.addEventListener('fetch', function(event) {
  let request = event.request;
  if (request.method !== 'GET') {
    // anything besides GET does not make sense to cache
    return;
  }
  
  let url = request.url;
  if (url.match(/\/api\//i)) {
    // all api calls are cached using the repository module
    return;
  }
  
  event.respondWith(getCache().then((c) => {
    return c.match(event.request).
      then((d) => {
        return d || fetch(event.request).
          then((r) => {
            c.put(event.request, r.clone());
            return r;
          });
      });
  }));
});
