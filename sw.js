// Simple Service Worker for Mobile Performance
const CACHE_NAME = 'puter-chatbot-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/js/puterApp.js',
    '/js/puterChatManager.js',
    '/js/puterUIManager.js',
    '/js/puterVisionHandler.js',
    '/js/puterModelConfig.js',
    '/js/puterModelCapabilities.js',
    '/js/puterSidebarManager.js',
    '/js/puterChatMemory.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            }
        )
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});