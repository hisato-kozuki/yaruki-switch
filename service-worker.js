const CACHE_NAME = "pwa-button-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./main.js",
  "./manifest.json"
];

// インストール時にキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log("Service Worker installed");
});

// リクエストをキャッシュから返す（オフライン対応）
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});