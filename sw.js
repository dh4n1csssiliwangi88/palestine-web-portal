// Service Worker for Palestine News Hub - Always Online
const CACHE_NAME = 'palestine-news-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => {
                // If both cache and network fail, return offline page
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Background sync for news updates
self.addEventListener('sync', event => {
    if (event.tag === 'news-sync') {
        event.waitUntil(syncNews());
    }
});

// Function to sync news in background
async function syncNews() {
    try {
        // This would connect to actual news APIs
        console.log('Background sync completed');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', event => {
        if (event.tag === 'news-update') {
            event.waitUntil(syncNews());
        }
    });
}

// Push notifications (if implemented)
self.addEventListener('push', event => {
    const options = {
        body: 'Berita terbaru dari Palestina telah tersedia!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Lihat Berita',
                icon: '/checkmark.png'
            },
            {
                action: 'close',
                title: 'Tutup',
                icon: '/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Palestine News Update', options)
    );
});
