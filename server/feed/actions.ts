"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { revalidatePath } from "next/cache";

export async function getFeed() {
  return prisma.post.findMany({
    include: {
      author: true,
      community: true
    },
    orderBy: { created_at: 'desc' },
    take: 20
  });
}

export async function getCommunities() {
  try {
    return await prisma.community.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    return [];
  }
}

export async function createPost(content: string, communityId: string) {
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

    if (!communityId) {
      return { error: "Please select a community for your post." };
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: user.id,
        communityId: communityId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error: any) {
    console.error("Failed to create post Server Action:", error);
    return { error: error.message || "Failed to create post." };
  }
}
