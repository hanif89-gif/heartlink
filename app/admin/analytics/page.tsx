export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";

export default async function AdminAnalytics() {
  // Fetch real stats in parallel
  const [totalUsers, totalMatches, totalMessages] = await Promise.all([
    prisma.user.count(),
    prisma.match.count(),
    prisma.message.count(),
  ]);

  // Calculate user growth for last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const usersInPeriod = await prisma.user.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });

  // Group users by month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const growthMap: Record<string, number> = {};

  // Initialize all 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    growthMap[key] = 0;
  }

  // Count users per month
  for (const user of usersInPeriod) {
    const d = new Date(user.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (growthMap[key] !== undefined) {
      growthMap[key]++;
    }
  }

  // Build final growth data array
  const growthData = Object.entries(growthMap).map(([key, count]) => {
    const [year, month] = key.split("-").map(Number);
    return { month: monthNames[month], users: count };
  });

  // Calculate growth percentage (compare last month vs month before)
  const lastMonth = growthData[growthData.length - 1]?.users || 0;
  const prevMonth = growthData[growthData.length - 2]?.users || 0;
  const growthPercent = prevMonth > 0
    ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100)
    : 0;

  return (
    <AnalyticsClient
      growthData={growthData}
      growthPercent={growthPercent}
      totalUsers={totalUsers}
      totalMatches={totalMatches}
      totalMessages={totalMessages}
    />
  );
}
