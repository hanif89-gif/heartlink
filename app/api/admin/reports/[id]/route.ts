import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, suspendUser, reportedUserId } = body;

    // Execute in a transaction if we are suspending the user as well
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update report status if provided
      const report = await tx.report.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
        },
      });

      // 2. If suspendUser is true, update the reported user's role to BANNED
      if (suspendUser && reportedUserId) {
        await tx.user.update({
          where: { id: reportedUserId },
          data: { role: "BANNED" },
        });
      }

      return report;
    });

    return NextResponse.json({ report: result });
  } catch (error: any) {
    console.error("Admin report update error:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi error server" },
      { status: 500 }
    );
  }
}
