"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { sendPushNotification } from "./push-actions";

export async function createNotification(
  userId: string, // Receiver
  type: "PUFF" | "INSIGHT" | "REPLY" | "FRIEND_REQUEST" | "SYSTEM",
  content?: string,
  relatedPostId?: string
) {
  try {
    const actor = await getCurrentUser();
    if (!actor) return;
    
    // Don't notify yourself
    if (userId === actor.id) return;

    await prisma.notification.create({
      data: {
        userId,
        actorId: actor.id,
        type,
        content,
        relatedPostId
      }
    });

    // Send Web Push
    let title = "New Interaction";
    let body = "Someone interacted with your case.";
    let url = "/notifications";

    if (type === "PUFF") {
      title = "🔥 Log Puffed!";
      body = `${actor.anonymous_username} is hyping up your recent post.`;
    } else if (type === "INSIGHT") {
      title = "✨ Big Brain Moment";
      body = `${actor.anonymous_username} found your log insightful!`;
    } else if (type === "REPLY") {
      title = "💬 Incoming Transmission";
      body = `${actor.anonymous_username} replied: "${content?.substring(0, 40) || ''}..."`;
    } else if (type === "FRIEND_REQUEST") {
      title = "🎫 New Challenger Approaching";
      body = `${actor.anonymous_username} wants to join your crew.`;
      url = "/profile";
    }

    await sendPushNotification(userId, { title, body, url });

  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function getNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { created_at: "desc" },
      include: {
        actor: {
          select: { anonymous_username: true, avatar_species: true }
        },
        post: {
          select: { content: true }
        }
      },
      take: 50
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function markNotificationsAsRead() {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true }
    });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
}

export async function getUnreadNotificationCount() {
  try {
    const user = await getCurrentUser();
    if (!user) return 0;

    return await prisma.notification.count({
      where: { userId: user.id, isRead: false }
    });
  } catch (error) {
    console.error("Failed to get unread notification count:", error);
    return 0;
  }
}
