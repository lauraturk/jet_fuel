self.addEventListener('install', event =>{
  event.waitUntil(
    caches.open('assets-v1').then((cache) =>{
      return cache.addAll([
        '/joanna-kosinska-129039.jpg',
        '/folder-icon.svg',
        '/style.css',
        '/index.js'
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
