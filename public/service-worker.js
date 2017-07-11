self.addEventListener('install', event =>{
  event.waitUntil(
    //update the cache name everytime something is changed.
    caches.open('assets-v1').then((cache) =>{
      return cache.addAll([
        '/',
        '/index.js',
        '/style.css',
        '/joanna-kosinska-129039.jpg',
        '/folder-icon.svg'
      ])
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>{
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('activate', event =>{
  let cacheWhitelist = ['assets-v1'];

  event.waitUntil(
    caches.keys().then(keyList =>{
      return Promise.all(keyList.map((key) =>{
        if(cacheWhitelist.indexOf(key) ===  -1){
          return caches.delete(key);
        }
      }));
    })
  );
});
