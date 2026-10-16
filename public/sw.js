/**
 * LOKOJA LIFE — M16: THE SILK SERVICE WORKER
 * -------------------------------------------
 * THE ZERO-DATA / 3-SECOND LAW: the city lives on this phone.
 *
 * LAWS OF THIS FILE:
 *  - THE SHELL is precached ('/', the offline page, the manifest, the
 *    icons): a repeat visit never touches the wire, and a first visit
 *    that finishes once can boot forever after with zero network.
 *  - THE GUEST LOOP is offline-first: the game itself is client-side
 *    (localStorage), so a guest plays with no network at all. The SW
 *    NEVER fakes an API response — /api/ passes straight to the wire,
 *    fails honestly when offline, and the game's own offline queue
 *    (the M15 law) rides it out until the connection appears.
 *  - IMMUTABLE STATIC is cache-first: hashed Next chunks, icons, art
 *    and font files are served from the cache the moment they exist.
 *  - NAVIGATIONS are network-first: a new deploy lands on the next
 *    online visit; offline navigations fall back to the cached shell,
 *    then to the offline page. Nobody ever sees a browser dinosaur.
 *  - THE HMR MERCY LAW: dev-only traffic (webpack-hmr, dev chunks
 *    marked with a ?v= query) passes through untouched — the worker
 *    never fights the dev server.
 *  - THE BUDGET: the runtime cache caps ENTRIES (200) and refuses any
 *    single response over 2 MB — the whole install stays far under
 *    the 30 MB install law.
 *  - VERSIONED CACHES: bumping SW_VERSION strands every old cache,
 *    and activate sweeps the stranded ones the same hour.
 */

/* ------------------------------- the version ------------------------------- */
const SW_VERSION = 'm16.1'
const SHELL_CACHE = `lko-shell-${SW_VERSION}`
const STATIC_CACHE = `lko-static-${SW_VERSION}`
const PAGES_CACHE = `lko-pages-${SW_VERSION}`
const OWN_CACHES = [SHELL_CACHE, STATIC_CACHE, PAGES_CACHE]

/* -------------------------------- the budget ------------------------------- */
const MAX_ENTRIES = 200
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024 // 2 MB — a single response cap

/* ------------------------------ the shell list ------------------------------ */
const PRECACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',
  '/icons/apple-touch-icon.png',
]

/* -------------------------------- the install ------------------------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE)
      // the shell lands one file at a time: one bad response must not
      // strand the whole install (the mercy law of the install path)
      await Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {}),
        ),
      )
      await self.skipWaiting()
    })(),
  )
})

/* -------------------------------- the activate ------------------------------ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      // the stranded-cache sweep: every cache this version does not own dies
      await Promise.all(
        names
          .filter((n) => n.startsWith('lko-') && !OWN_CACHES.includes(n))
          .map((n) => caches.delete(n)),
      )
      await self.clients.claim()
    })(),
  )
})

/* -------------------------------- the helpers ------------------------------- */
const isDevTraffic = (url) =>
  url.pathname.startsWith('/_next/webpack-hmr') ||
  (url.search.includes('v=') && url.pathname.startsWith('/_next/'))

const isApi = (url) => url.pathname.startsWith('/api/')

const isImmutableStatic = (url) => {
  if (url.origin !== self.location.origin) return false
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/art/') ||
    url.pathname.startsWith('/world/') // the geo .bin — content-versioned filename, immutable forever
  )
}

/** Trim a runtime cache to the entry cap (oldest keys die first). */
async function trimCache(cacheName) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length <= MAX_ENTRIES) return
  for (const key of keys.slice(0, keys.length - MAX_ENTRIES)) {
    await cache.delete(key)
  }
}

/** Cache-first serve for immutable static — with the budget law. */
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  try {
    const response = await fetch(request)
    const sameOk = response && (response.ok || response.type === 'opaque')
    const len = Number(response.headers.get('content-length') || '0')
    if (sameOk && len <= MAX_RESPONSE_BYTES) {
      await cache.put(request, response.clone())
      trimCache(STATIC_CACHE) // fire-and-forget — the cap is not worth a stall
    }
    return response
  } catch {
    // a static miss with no network: nothing honest to serve
    return new Response('', { status: 504, statusText: 'offline' })
  }
}

/** Network-first for navigations — fresh wins online, the shell saves offline. */
async function navigationFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(PAGES_CACHE)
    if (response.ok) cache.put(request, response.clone()).then(() => trimCache(PAGES_CACHE))
    return response
  } catch {
    const pages = await caches.open(PAGES_CACHE)
    const cachedPage = (await pages.match(request)) || (await caches.match('/'))
    if (cachedPage) return cachedPage
    const shell = await caches.match('/offline.html')
    if (shell) return shell
    return new Response('<h1>Lokoja Life is offline</h1>', {
      status: 503,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

/* --------------------------------- the fetch -------------------------------- */
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return // POST (cloud push/pull, auth) rides raw

  const url = new URL(request.url)

  // THE MERCY LAWS: dev traffic and the API never touch the cache
  if (isDevTraffic(url)) return
  if (isApi(url)) return // the game's offline queue is the offline authority

  // cross-origin (fonts, CDNs): let the browser handle, cache opaque hits
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('fonts.g')) {
      event.respondWith(cacheFirst(request))
    }
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(navigationFirst(request))
    return
  }
  if (isImmutableStatic(url)) {
    event.respondWith(cacheFirst(request))
    return
  }
  // same-origin public files (logo.svg, offline.html, manifest…): shell cache
  if (url.pathname === '/offline.html' || url.pathname === '/manifest.json') {
    event.respondWith(caches.match(request).then((r) => r || fetch(request)))
  }
})
