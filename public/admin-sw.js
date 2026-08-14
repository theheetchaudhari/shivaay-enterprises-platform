// Shivaay Enterprises Admin Service Worker
const CACHE_NAME = 'shivaay-admin-v1';
const PRECACHE_ASSETS = [
  '/',
  '/admin.html',
  '/admin-manifest.json',
  '/admin-icon-192.png',
  '/admin-icon-512.png',
  '/tab-logo.png'
];

// Install event - Precache basic shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Continue even if some assets fail to precache during development
      });
    })
  );
  self.skipWaiting();
});

// Activate event - Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network-first strategy for admin panel to always serve fresh data
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip Supabase API / auth requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Bypass Supabase API calls, extensions, and external APIs
  if (url.origin !== self.location.origin || url.pathname.includes('/rest/v1/') || url.pathname.includes('/auth/v1/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If response is valid, clone it to cache for static assets (images, css, js)
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        // If network fails (offline), try cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If HTML navigation fails, fallback to cached root
        if (event.request.mode === 'navigate') {
          return caches.match('/') || caches.match('/admin.html');
        }
      })
  );
});
