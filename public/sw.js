const CACHE_NAME = 'geo-presensi-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Memaksa SW baru untuk segera aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - Hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Mengambil kendali client segera
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Strategi Network-First untuk navigasi (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request) || caches.match('/index.html');
        })
    );
    return;
  }

  // Strategi Cache-First untuk aset statis lainnya
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Jangan cache API calls atau request non-GET
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic' || event.request.method !== 'GET') {
          return fetchResponse;
        }

        // Cache file aset baru (seperti JS/CSS hasil build baru)
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return fetchResponse;
      });
    })
  );
});

