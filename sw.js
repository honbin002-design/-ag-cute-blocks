const CACHE='ag-cute-blocks-v043-art';
const CORE=['./','./index.html','./app-v042.js','./character-models.js','./animal-models.js','./crop-models.js','./economy-system.js','./farming-system.js','./wildlife-models.js','./manifest.webmanifest','https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(url)))));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});return response}).catch(()=>caches.match('./index.html'))))});
