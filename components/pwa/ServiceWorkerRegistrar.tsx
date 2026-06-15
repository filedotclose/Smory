"use client";

import { useEffect } from "react";

/**
 * Registers the service worker on mount.
 * This is a client component that should be placed in the root layout.
 * It silently registers the SW — no UI.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[Smory] Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.warn("[Smory] Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}
