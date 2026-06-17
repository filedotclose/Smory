"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { revalidatePath } from "next/cache";

export async function getProfileStats() {
  const user = await getCurrentUser();
  if (!user) return { logsCount: 0, streak: 0, badgesCount: 0, brandCounts: {} };

  const userId = user.id;

  // 1. Get logs count
  const logsCount = await prisma.log.count({
    where: { userId }
  });

  // 2. Get unique brands logged and their counts
  const uniqueBrands = await prisma.log.groupBy({
    by: ['brand'],
    where: { userId },
    _count: {
      brand: true
    }
  });
  
  const brandCounts: Record<string, number> = {};
  uniqueBrands.forEach(item => {
    brandCounts[item.brand] = item._count.brand;
  });
  const badgesCount = uniqueBrands.length;

  // 3. Calculate Streak
  const logs = await prisma.log.findMany({
    where: { userId },
    select: { timestamp: true },
    orderBy: { timestamp: "desc" }
  });

  let streak = 0;
  if (logs.length > 0) {
    const dates = logs.map(l => {
      const d = new Date(l.timestamp);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    });
    
    // Deduplicate dates
    const uniqueDates = Array.from(new Set(dates));
    
    // Helper to check if two string dates are consecutive days
    const isConsecutive = (d1Str: string, d2Str: string) => {
      const d1 = new Date(d1Str);
      const d2 = new Date(d2Str);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 1;
    };

    const todayStr = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    })();

    const yesterdayStr = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    })();

    // Check if they logged today or yesterday to continue streak
    if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
      streak = 1;
      for (let i = 0; i < uniqueDates.length - 1; i++) {
        if (isConsecutive(uniqueDates[i], uniqueDates[i + 1])) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    logsCount,
    streak,
    badgesCount,
    brandCounts
  };
}

export async function updateProfileSettings(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const username = formData.get("username") as string;
    const species = formData.get("species") as string;
    const displayName = formData.get("displayName") as string;

    if (!username || username.trim().length < 3) {
      return { error: "Username must be at least 3 characters" };
    }

    // Check if username is already taken by someone else
    const existing = await prisma.user.findFirst({
      where: {
        anonymous_username: username.trim(),
        NOT: { id: user.id }
      }
    });

    if (existing) {
      return { error: "Username is already taken" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        anonymous_username: username.trim(),
        avatar_species: species,
        display_name: displayName ? displayName.trim() : null
      }
    });

    revalidatePath("/profile");
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: error.message || "Failed to update profile settings" };
  }
}
