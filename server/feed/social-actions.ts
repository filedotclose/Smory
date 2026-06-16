"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { createNotification } from "@/server/notifications/actions";
import { revalidatePath } from "next/cache";

export async function togglePuff(postId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const existingPuff = await prisma.puff.findUnique({
      where: { userId_postId: { userId: user.id, postId } }
    });

    if (existingPuff) {
      await prisma.puff.delete({
        where: { id: existingPuff.id }
      });
      return { success: true, puffed: false };
    } else {
      await prisma.puff.create({
        data: { userId: user.id, postId }
      });

      // Notify post author
      const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
      if (post && post.authorId !== user.id) {
        await createNotification(post.authorId, "PUFF", null, postId);
      }

      return { success: true, puffed: true };
    }
  } catch (error: any) {
    console.error("Toggle Puff Error:", error);
    return { error: error.message };
  }
}

export async function toggleInsight(postId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const existingInsight = await prisma.insightReaction.findUnique({
      where: { userId_postId: { userId: user.id, postId } }
    });

    if (existingInsight) {
      await prisma.insightReaction.delete({
        where: { id: existingInsight.id }
      });
      return { success: true, insighted: false };
    } else {
      await prisma.insightReaction.create({
        data: { userId: user.id, postId }
      });

      // Notify post author
      const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
      if (post && post.authorId !== user.id) {
        await createNotification(post.authorId, "INSIGHT", null, postId);
      }

      return { success: true, insighted: true };
    }
  } catch (error: any) {
    console.error("Toggle Insight Error:", error);
    return { error: error.message };
  }
}

export async function createReply(postId: string, content: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    if (!content.trim()) return { error: "Reply cannot be empty" };

    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        userId: user.id,
        postId
      },
      include: {
        user: true
      }
    });

    // Notify post author
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (post && post.authorId !== user.id) {
      await createNotification(post.authorId, "REPLY", content, postId);
    }

    revalidatePath("/");
    return { success: true, reply };
  } catch (error: any) {
    console.error("Create Reply Error:", error);
    return { error: error.message };
  }
}

export async function deleteReply(replyId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const reply = await prisma.reply.findUnique({ where: { id: replyId } });
    if (!reply) return { error: "Reply not found" };

    if (reply.userId !== user.id) return { error: "Not authorized to delete this reply" };

    await prisma.reply.delete({ where: { id: replyId } });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Reply Error:", error);
    return { error: error.message };
  }
}

export async function getReplies(postId: string) {
  try {
    return await prisma.reply.findMany({
      where: { postId },
      include: {
        user: true
      },
      orderBy: { created_at: "asc" }
    });
  } catch (error) {
    console.error("Get Replies Error:", error);
    return [];
  }
}
