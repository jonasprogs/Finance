// Basic offline cache for the Finance PWA
const CACHE = 'finance-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request).then(resp=>{
      // put a copy in cache (best-effort)
      const copy = resp.clone();
      caches.open(CACHE).then(c=> c.put(e.request, copy));
      return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});
