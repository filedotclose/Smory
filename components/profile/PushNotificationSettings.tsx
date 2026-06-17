"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveSubscription, removeSubscription } from "@/server/notifications/push-actions";

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

export function PushNotificationSettings() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setIsSubscribed(true);
        setSubscription(sub);
      }
    } catch (error) {
      console.error("Error checking push subscription", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("You blocked notifications. Please allow them in your browser settings.");
        setIsLoading(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string),
      });

      const response = await saveSubscription(JSON.parse(JSON.stringify(sub)));
      if (response.error) {
        toast.error(response.error);
      } else {
        setIsSubscribed(true);
        setSubscription(sub);
        toast.success("Native push notifications enabled!");
      }
    } catch (error: any) {
      console.error("Failed to subscribe:", error);
      toast.error("Failed to enable notifications. Are you on a secure context or installed app?");
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        await removeSubscription(subscription.endpoint);
        setIsSubscribed(false);
        setSubscription(null);
        toast.success("Push notifications disabled.");
      }
    } catch (error) {
      console.error("Failed to unsubscribe", error);
      toast.error("Failed to disable notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-paper-white border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] p-4 sm:p-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-ash-gray">
          Push Notifications not supported on this device/browser.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-paper-white border-[3px] border-ink-black shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink-black uppercase tracking-tight mb-1 flex items-center gap-2">
            Native Push Alerts {isSubscribed ? <Bell size={20} className="text-marlboro-red" /> : <BellOff size={20} />}
          </h2>
          <p className="text-sm text-ash-gray font-medium">
            Get pinged when someone puffs your post, replies, or sends a friend request even when the app is closed.
          </p>
        </div>
        
        <button
          onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
          disabled={isLoading}
          className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-xs border-[3px] border-ink-black transition-all ${
            isSubscribed 
              ? "bg-paper-white text-marlboro-red"
              : "bg-marlboro-red text-paper-white shadow-[4px_4px_0px_0px_rgba(11,11,15,1)] active:translate-y-1 active:shadow-none"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : (isSubscribed ? "Disable Push" : "Enable Push")}
        </button>
      </div>
    </div>
  );
}
