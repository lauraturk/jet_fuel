self.addEventListener('install', event =>{
  event.waitUntil(
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
