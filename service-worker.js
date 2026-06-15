// DSTS Club Service Worker
// Versioned cache name: update on each deployment
const CACHE_NAME = 'dsts-club-app-v2026-06-15-001';

// Static shell assets (cache-first)
const STATIC_SHELL = [
  '/app/index.html',
  '/app/app.css',
  '/app/app.js',
  '/manifest.webmanifest',
  '/offline.html',
  '/assets/icons/icon-72.png',
  '/assets/icons/icon-96.png',
  '/assets/icons/icon-128.png',
  '/assets/icons/icon-144.png',
  '/assets/icons/icon-152.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-384.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png'
];

// Private API routes (network-only, never cache)
const PRIVATE_API = [
  '/api/wallet',
  '/api/account',
  '/api/subscriptions',
  '/api/orders',
  '/api/payments',
  '/api/referrals',
  '/api/creator',
  '/api/admin'
];

// Install event: cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event: routing strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Private API: network-only
  if (PRIVATE_API.some(path => url.pathname.startsWith(path))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static shell: cache-first
  if (STATIC_SHELL.some(path => url.pathname === path || url.pathname.endsWith(path))) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
    return;
  }

  // Public API: stale-while-revalidate
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              // Cache successful responses
              if (response.ok) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, clone);
                });
              }
              return response;
            });
          return cached || fetchPromise;
        })
    );
    return;
  }

  // Offline fallback for HTML navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful HTML responses
          if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page for navigation failures
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Default: network-first for other assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Try cache as fallback
        return caches.match(event.request);
      })
  );
});

// Message event: handle cache clearing on logout
self.addEventListener('message', (event) => {
  if (event.data === 'clear-user-cache') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          // Clear all cached API responses
          return cache.keys()
            .then((keys) => {
              return Promise.all(
                keys
                  .filter((request) => request.url.includes('/api/'))
                  .map((request) => cache.delete(request))
              );
            });
        })
    );
  }
});
