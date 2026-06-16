"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";

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
