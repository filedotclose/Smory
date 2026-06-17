"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import webpush from "web-push";

// Initialize web-push with VAPID keys only if they exist (prevents build crashes)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:admin@smory.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID keys not found in environment. Push notifications will be disabled.");
}

export async function saveSubscription(subscription: any) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    const { endpoint, keys } = subscription;

    await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId: user.id,
          endpoint: endpoint,
        },
      },
      create: {
        userId: user.id,
        endpoint: endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save push subscription:", error);
    return { error: "Failed to save subscription" };
  }
}

export async function removeSubscription(endpoint: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Unauthorized" };

    await prisma.pushSubscription.delete({
      where: {
        userId_endpoint: {
          userId: user.id,
          endpoint: endpoint,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to remove push subscription:", error);
    return { error: "Failed to remove subscription" };
  }
}

export async function sendPushNotification(userId: string, payload: { title: string; body: string; url?: string }) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) return;

    const notifications = subscriptions.map((sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush.sendNotification(pushSubscription, JSON.stringify(payload)).catch((error) => {
        if (error.statusCode === 404 || error.statusCode === 410) {
          console.log("Subscription has expired or is no longer valid: ", error);
          return prisma.pushSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error("Error sending push notification:", error);
        }
      });
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error("Failed to broadcast push notifications:", error);
  }
}
