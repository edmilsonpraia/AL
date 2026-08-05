const CACHE_NAME = 'la-wedding-v1';
const CORE_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './supabase-config.js',
    './manifest.json',
    './logo.png',
    './logo-white-t.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            cache.addAll(CORE_ASSETS).catch(() => {})
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    // Never cache Supabase / API calls or ranged media requests
    if (url.hostname.includes('supabase.co') || req.headers.has('range')) {
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => {
            const network = fetch(req).then((res) => {
                if (res && res.status === 200 && res.type === 'basic') {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                }
                return res;
            }).catch(() => cached);
            return cached || network;
        })
    );
});
