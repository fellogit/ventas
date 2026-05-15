// sw.js
const CACHE_NAME = 'v1_cache_sistema_pwa';
const urlsToCache = [
  'index.html',
  'manifest.json'
];

// Evento de instalación: guarda los archivos esenciales en la caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting());
      })
      .catch(err => console.log('Fallo en el registro de caché', err))
  );
});

// Evento de activación: limpia cachés obsoletas
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento fetch: estrategia Cache-First con caída a red para soporte offline estable
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          return res;
        }
        return fetch(e.request);
      })
  );
});