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

  // 3. Get streak from login_streak
  const streak = user.login_streak;

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

export async function completeOnboarding() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    await prisma.user.update({
      where: { id: user.id },
      data: { has_completed_onboarding: true }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Complete onboarding error:", error);
    return { error: error.message || "Failed to complete onboarding" };
  }
}
