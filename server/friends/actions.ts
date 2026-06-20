"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { createNotification } from "@/server/notifications/actions";
import { revalidatePath } from "next/cache";

export async function sendFriendRequest(receiverId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    if (user.id === receiverId) return { error: "Cannot add yourself" };

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId },
          { senderId: receiverId, receiverId: user.id }
        ]
      }
    });

    if (existing) {
      return { error: "Friendship or request already exists" };
    }

    const request = await prisma.friendship.create({
      data: {
        senderId: user.id,
        receiverId,
        status: "PENDING"
      }
    });

    await createNotification(receiverId, "FRIEND_REQUEST", "sent you a friend request");
    
    revalidatePath("/profile");
    return { success: true, request };
  } catch (error: any) {
    console.error("Send Friend Request Error:", error);
    return { error: error.message };
  }
}

export async function acceptFriendRequest(requestId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const request = await prisma.friendship.findUnique({ where: { id: requestId } });
    if (!request) return { error: "Request not found" };

    if (request.receiverId !== user.id) return { error: "Not authorized" };

    await prisma.friendship.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" }
    });

    await createNotification(request.senderId, "SYSTEM", "accepted your friend request");

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Accept Friend Request Error:", error);
    return { error: error.message };
  }
}

export async function rejectFriendRequest(requestId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const request = await prisma.friendship.findUnique({ where: { id: requestId } });
    if (!request) return { error: "Request not found" };

    if (request.receiverId !== user.id) return { error: "Not authorized" };

    await prisma.friendship.delete({
      where: { id: requestId }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Reject Friend Request Error:", error);
    return { error: error.message };
  }
}

export async function removeFriend(friendId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: friendId, status: "ACCEPTED" },
          { senderId: friendId, receiverId: user.id, status: "ACCEPTED" }
        ]
      }
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Remove Friend Error:", error);
    return { error: error.message };
  }
}

export async function getFriends() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { receiverId: user.id, status: "ACCEPTED" }
        ]
      },
      include: {
        sender: true,
        receiver: true
      }
    });

    return friendships.map(f => f.senderId === user.id ? f.receiver : f.sender);
  } catch (error) {
    console.error("Get Friends Error:", error);
    return [];
  }
}

export async function getPendingRequests() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    return await prisma.friendship.findMany({
      where: { receiverId: user.id, status: "PENDING" },
      include: { sender: true }
    });
  } catch (error) {
    console.error("Get Pending Requests Error:", error);
    return [];
  }
}

export async function searchUser(username: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !username.trim()) return null;

    const users = await prisma.user.findMany({
      where: {
        anonymous_username: {
          contains: username.trim(),
          mode: "insensitive"
        },
        id: { not: user.id }
      },
      select: { id: true, anonymous_username: true, avatar_species: true },
      take: 5
    });
    
    return users.length > 0 ? users : null;
  } catch (error) {
    console.error("Search User Error:", error);
    return null;
  }
}

