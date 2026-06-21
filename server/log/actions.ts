"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/actions";
import { revalidatePath } from "next/cache";

export async function createLog(brand: string, trigger: string, intensity: number, photo_url?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const log = await prisma.log.create({
      data: {
        userId: user.id,
        brand,
        trigger,
        intensity,
        photo_url,
      }
    });

    // Milestone logic
    const logCount = await prisma.log.count({ where: { userId: user.id } });
    if (logCount === 1) {
      await prisma.notification.create({
        data: { userId: user.id, type: "SYSTEM", content: "Unlocked: First Smoke! 🔓" }
      });
    } else if (logCount === 10) {
      await prisma.notification.create({
        data: { userId: user.id, type: "SYSTEM", content: "Unlocked: Pattern Recognition! 🔓" }
      });
    }

    revalidatePath("/insights");
    revalidatePath("/profile");

    return { success: true, log };
  } catch (error: any) {
    console.error("Create Log Error:", error);
    return { error: error.message };
  }
}

export async function getAnalytics() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const logs = await prisma.log.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: "asc" }
    });

    if (logs.length === 0) {
      return { 
        empty: true,
        nodes: [
          { id: "1", status: "available" },
          { id: "2", status: "locked" },
          { id: "3", status: "locked" },
          { id: "4", status: "locked" },
          { id: "5", status: "locked" },
        ]
      };
    }

    // Calculate daily average
    const firstLog = logs[0].timestamp;
    const daysSinceFirst = Math.max(1, Math.ceil((Date.now() - firstLog.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAvg = (logs.length / daysSinceFirst).toFixed(1);

    // Top trigger
    const triggerCounts = logs.reduce((acc, l) => {
      acc[l.trigger] = (acc[l.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topTriggerId = Object.keys(triggerCounts).reduce((a, b) => triggerCounts[a] > triggerCounts[b] ? a : b);
    const topTrigger = topTriggerId.charAt(0).toUpperCase() + topTriggerId.slice(1);

    // Tree Nodes State
    const distinctTriggers = Object.keys(triggerCounts).length;
    
    const nodes = [
      { id: "1", status: "unlocked" },
      { id: "2", status: user.login_streak >= 7 ? "unlocked" : "locked" },
      { id: "3", status: logs.length >= 10 ? "unlocked" : "locked" },
      { id: "4", status: distinctTriggers >= 3 ? "unlocked" : "locked" },
    ];
    
    // Zen mode is unlocked if 1-4 are unlocked
    const allOthersUnlocked = nodes.every(n => n.status === "unlocked");
    nodes.push({ id: "5", status: allOthersUnlocked ? "unlocked" : "locked" });

    // Handle "available" states for visual pulsing
    // If node is locked, but its prerequisite is unlocked, it should be available.
    // 1 -> 2
    // 2 -> 3, 4
    // 3, 4 -> 5
    if (nodes[1].status === "locked" && nodes[0].status === "unlocked") nodes[1].status = "available";
    if (nodes[2].status === "locked" && nodes[1].status === "unlocked") nodes[2].status = "available";
    if (nodes[3].status === "locked" && nodes[1].status === "unlocked") nodes[3].status = "available";
    if (nodes[4].status === "locked" && nodes[2].status === "unlocked" && nodes[3].status === "unlocked") nodes[4].status = "available";

    return {
      empty: false,
      dailyAvg,
      timestamps: logs.map(l => l.timestamp.toISOString()), // Return raw timestamps for client timezone calculation
      topTrigger,
      currentStreak: user.login_streak,
      nodes
    };
  } catch (error: any) {
    console.error("Get Analytics Error:", error);
    return { error: error.message };
  }
}
