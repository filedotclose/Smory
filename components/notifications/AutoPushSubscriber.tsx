"use client";

import { useEffect } from "react";
import { saveSubscription } from "@/server/notifications/push-actions";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function AutoPushSubscriber() {
  useEffect(() => {
    // Run after a slight delay to let the page load smoothly
    const timer = setTimeout(() => {
      autoSubscribe();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const autoSubscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }

    try {
      // 1. Check current permission status
      const permission = Notification.permission;

      // If they explicitly denied, do not ask or spam them
      if (permission === "denied") {
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSub = await registration.pushManager.getSubscription();

      // 2. If already subscribed, ensure server is up to date (failsafe)
      if (existingSub) {
        await saveSubscription(JSON.parse(JSON.stringify(existingSub)));
        return;
      }

      // 3. Request permission if not yet decided (or automatically prompt since they just logged in)
      const newPermission = await Notification.requestPermission();
      if (newPermission !== "granted") {
        return;
      }

      // 4. Subscribe
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.error("VAPID public key is missing in environment");
        return;
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      // 5. Save subscription to database
      await saveSubscription(JSON.parse(JSON.stringify(sub)));
      console.log("Successfully subscribed user to push alerts in background");
    } catch (err) {
      console.error("Auto push subscription error:", err);
    }
  };

  return null; // Silent background component
}
