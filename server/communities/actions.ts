"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { revalidatePath } from "next/cache";

export async function getCommunities() {
  try {
    const user = await getCurrentUser();
    
    const communities = await prisma.community.findMany({
      include: {
        _count: {
          select: { members: true }
        },
        members: user ? {
          where: { userId: user.id }
        } : false
      },
      orderBy: { name: 'asc' }
    });
    
    return communities;
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    return [];
  }
}

export async function getCommunity(id: string) {
  try {
    return await prisma.community.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error("Failed to fetch community:", error);
    return null;
  }
}

export async function toggleCommunityMembership(communityId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: user.id, communityId } }
    });

    if (membership) {
      await prisma.communityMember.delete({
        where: { id: membership.id }
      });
      revalidatePath("/communities");
      return { success: true, joined: false };
    } else {
      await prisma.communityMember.create({
        data: { userId: user.id, communityId }
      });
      revalidatePath("/communities");
      return { success: true, joined: true };
    }
  } catch (error: any) {
    console.error("Toggle Membership Error:", error);
    return { error: error.message };
  }
}

export async function getMessages(communityId: string) {
  try {
    return await prisma.message.findMany({
      where: { communityId },
      include: {
        user: true
      },
      orderBy: { created_at: 'asc' },
      take: 100
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return [];
  }
}

export async function sendMessage(communityId: string, content: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    if (!content.trim()) return { error: "Message cannot be empty" };
    if (content.length > 500) return { error: "Message cannot exceed 500 characters" };

    // Verify membership
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: user.id, communityId } }
    });

    if (!membership) return { error: "You must join the community to chat." };

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: user.id,
        communityId
      },
      include: {
        user: true
      }
    });

    return { success: true, message };
  } catch (error: any) {
    console.error("Send Message Error:", error);
    return { error: error.message };
  }
}
