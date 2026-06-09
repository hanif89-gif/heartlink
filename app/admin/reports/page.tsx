export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import ReportsClient from "./ReportsClient";

export default async function AdminReports() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: {
        select: { id: true, name: true, email: true, image: true }
      },
      reportedUser: {
        select: { id: true, name: true, email: true, image: true }
      }
    }
  });

  return <ReportsClient initialReports={reports} />;
}
