const STATIC_CACHE_NAME = 'static-cache-v1.1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';

function cleanCache(cacheName, numberItems) {
    caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            //console.log(keys);
            if (keys.length > numberItems) {
                cache.delete(keys[0])
                    .then(cleanCache(cacheName, numberItems));
            }
        });
    })
}
self.addEventListener('install', (event) => {
    console.log('SW: Instalado');
    //En el static entran los recusos de la appshell propios sobre los cuales tengo el control
    const promiseCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
        //addAll es una promesa
        return cache.addAll(
            [
                './',
                './index.html',
                './js/app.js',
                './img/cena.jpg'
            ]
        );
    });

    const promiseCacHeInmutable = caches
        .open(INMUTABLE_CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js',
            ]);
        });

        //Ahora tengo dos promesas por lo cual debo esperar ambas con promiseAll

    event.waitUntil(Promise.all([promiseCache, promiseCacHeInmutable]));
});

self.addEventListener('fetch', (event) => {
        const respCache = caches.match(event.request);
        event.respondWith(respCache);
    
})