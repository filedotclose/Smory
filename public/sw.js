/// Service Worker for Smory PWA
/// Provides offline caching and installability

const CACHE_NAME = "smory-v1";
const OFFLINE_URL = "/welcome";

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  "/",
  "/welcome",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
];

// Install: pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately, don't wait for old SW to die
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch: network-first strategy with offline fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API/auth requests — always go to network
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/_next/")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response and cache it
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If it's a navigation request, show offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});

// ── Web Push Notifications ────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "New Notification";
    const options = {
      body: data.body || "You have a new update.",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("Error processing push event:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          if (windowClient.url === urlToOpen) {
            matchingClient = windowClient;
            break;
          }
        }

        if (matchingClient) {
          return matchingClient.focus();
        } else {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
