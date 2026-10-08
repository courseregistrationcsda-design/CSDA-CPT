/* CSDA Pricing Toolkit — offline service worker.
 *
 * The app is a single self-contained page, so the cache only has to hold that page
 * plus its icons. Strategy:
 *   navigations  → network first, fall back to the cached page when offline
 *   same-origin  → cache first (icons and the manifest never change within a release)
 *
 * Bump CACHE on every deploy; old caches are dropped on activate.
 */

var CACHE = 'csda-toolkit-94c377171628';

var PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/modules/backup-engine.js',
  '/modules/lifecycle-audit.js',
  '/modules/admin-interface.js',
  '/modules/enrollment.js',
  '/modules/data-store.js',
  '/modules/accessibility.js',
  '/modules/domain-rules.js',
  '/modules/guide-search.js',
  '/favicon.ico',
  '/icons/icon-192.webp',
  '/icons/icon-512.webp',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) {
        // one failed asset must not sink the whole install
        return Promise.all(PRECACHE.map(function (url) {
          return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  // Page loads: prefer the network so a new deploy is picked up immediately.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put('/index.html', copy); });
          return res;
        })
        .catch(function () {
          return caches.match('/index.html').then(function (hit) {
            return hit || caches.match('/');
          });
        })
    );
    return;
  }

  // Everything else: serve from cache, refresh in the background.
  event.respondWith(
    caches.match(req).then(function (hit) {
      var live = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || live;
    })
  );
});

// Lets the page trigger an immediate update after a deploy.
self.addEventListener('message', function (event) {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
