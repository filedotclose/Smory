"use server";

import prisma from "@/lib/prisma";

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
