const CACHE_NAME = "birinci-vites-c53bfac9575e";
const APP_SHELL = ["/birinci-vites/_expo/static/js/web/index-32f4c33f1bdd0da6a54c50f8fd055a4f.js","/birinci-vites/apple-touch-icon.png","/birinci-vites/assets/assets/brand/logo-horizontal.494a81ffcc4c80ecaa4bb04d227076eb.png","/birinci-vites/assets/assets/meb-guide/page-01.8a7b00875183dd2e3098888c7e1094bc.jpg","/birinci-vites/assets/assets/meb-guide/page-02.35790d2015fbaf5518cd9b1e00746fca.jpg","/birinci-vites/assets/assets/meb-guide/page-03.6563888e04716b1a543854ea97ecf761.jpg","/birinci-vites/assets/assets/meb-guide/page-04.810a2cc36a73b3929eb2da6736c429fa.jpg","/birinci-vites/assets/assets/meb-guide/page-05.82c225d05f8bdd9699dc084fc92cc54e.jpg","/birinci-vites/assets/assets/meb-guide/page-06.22e61eb251aa0ae549276d398c37b4d1.jpg","/birinci-vites/assets/assets/meb-guide/page-07.b5a7d4098330c5867dd57d0d5ab0c195.jpg","/birinci-vites/assets/assets/meb-guide/page-08.63d54ac101048e765eb41bcb623802c2.jpg","/birinci-vites/assets/assets/meb-guide/page-09.7eea90872b161e034cb62a4b00651351.jpg","/birinci-vites/assets/assets/meb-guide/page-10.01dec40de3b1ef06a167a4f417c7da99.jpg","/birinci-vites/assets/assets/meb-guide/page-11.fabbd195a5a7012914b5dd3621aaefc7.jpg","/birinci-vites/assets/assets/meb-guide/page-12.884a5e2403bdca6f5917591c0de7c96e.jpg","/birinci-vites/assets/assets/meb-guide/page-13.2186873719e965c163e9da20b4e4158b.jpg","/birinci-vites/assets/assets/meb-guide/page-14.18f0ffb6cfaedb19432d9a9df8f24767.jpg","/birinci-vites/assets/assets/meb-guide/page-15.44967c7e93dc2745a3bf15f7206fd184.jpg","/birinci-vites/assets/assets/meb-guide/page-16.7c7c650ef6cdfd838378ba6f7cc3fa85.jpg","/birinci-vites/assets/assets/meb-guide/page-17.a7f37230d0577e04f11c41de0acec1af.jpg","/birinci-vites/favicon.ico","/birinci-vites/index.html","/birinci-vites/manifest.json","/birinci-vites/metadata.json","/birinci-vites/pwa-icon-192.png","/birinci-vites/pwa-icon-512.png","/birinci-vites/pwa-maskable-512.png"];
const HOME = "/birinci-vites/index.html";

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('birinci-vites-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith("/birinci-vites/")) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(HOME)));
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
