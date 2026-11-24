/* Network-only app: never cache member pages, provider calls or private records. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const name of await caches.keys())await caches.delete(name);
  await self.clients.claim();
})()));
