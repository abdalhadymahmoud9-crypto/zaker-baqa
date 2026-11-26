const C="zb-cache-1";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim())});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  const versioned=/[?&]v=/.test(r.url);
  e.respondWith(versioned
    ? caches.match(r).then(h=>h||fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c));return x}))
    : fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r)));
});
