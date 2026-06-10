/* Service worker de Mapa de Apps · estrategia network-first para contenido propio,
   con caché de respaldo para uso offline. La API de GitHub y recursos externos
   van siempre a la red (no se cachean). */
const CACHE = 'mapa-apps-v2';
const CORE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Solo gestionamos el mismo origen; GitHub API y CDNs van directos a la red.
  if (url.origin !== self.location.origin) return;
  // Network-first: si hay red, contenido fresco (y se actualiza la caché);
  // sin red, se sirve desde la caché; si no está, fallback al index.
  e.respondWith(
    fetch(req)
      .then(res => {
        // solo cacheamos respuestas correctas (no un 404/500, que envenenaría la caché)
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => {
        if (hit) return hit;
        // sin red y sin caché: solo las navegaciones caen al index; un asset suelto NO recibe HTML
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'Sin conexión' });
      }))
  );
});
