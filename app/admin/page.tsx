export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

function getOneDayAgo(): Date {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export default async function AdminDashboard() {
  const oneDayAgo = getOneDayAgo();

  // Run all queries IN PARALLEL for maximum speed
  const [totalUsers, totalMatches, totalChats, activeToday] = await Promise.all([
    prisma.user.count(),
    prisma.match.count(),
    prisma.message.count(),
    prisma.user.count({ where: { updatedAt: { gte: oneDayAgo } } }),
  ]);

  return <DashboardClient data={{ totalUsers, totalMatches, totalChats, activeToday }} />;
}
