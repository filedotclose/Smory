"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { getFriends } from "@/server/friends/actions";
import { revalidatePath } from "next/cache";

export async function getFeed() {
  const user = await getCurrentUser();
  let friendIds: string[] = [];

  if (user) {
    const friends = await getFriends();
    friendIds = friends.map((f: any) => f.id);
  }

  return prisma.post.findMany({
    where: {
      OR: [
        { audience: "PUBLIC" },
        { 
          audience: "FRIENDS", 
          authorId: user ? { in: [...friendIds, user.id] } : undefined 
        }
      ]
    },
    include: {
      author: true,
      puffs: true,
      insightReactions: true,
      replies: true
    },
    orderBy: { created_at: 'desc' },
    take: 20
  });
}

export async function createPost(content: string, audience: "PUBLIC" | "FRIENDS" = "PUBLIC") {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to make a post." };
    }

    if (!content || content.trim().length === 0) {
      return { error: "Post content cannot be empty." };
    }

    if (content.length > 280) {
      return { error: "Post cannot exceed 280 characters." };
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        audience: audience,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error: any) {
    console.error("Failed to create post Server Action:", error);
    return { error: error.message || "Failed to create post." };
  }
}

