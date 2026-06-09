import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reportedUserId, reason } = body;

    if (!reportedUserId || !reason || !reason.trim()) {
      return NextResponse.json(
        { message: "reportedUserId dan reason harus diisi" },
        { status: 400 }
      );
    }

    // Prevent reporting oneself
    if (reportedUserId === session.user.id) {
      return NextResponse.json(
        { message: "Tidak dapat melaporkan diri sendiri" },
        { status: 400 }
      );
    }

    // Check if reported user exists
    const reportedUser = await prisma.user.findUnique({
      where: { id: reportedUserId },
    });

    if (!reportedUser) {
      return NextResponse.json(
        { message: "User yang dilaporkan tidak ditemukan" },
        { status: 404 }
      );
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        reportedUserId,
        reason: reason.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json({
      message: "Laporan berhasil dikirim",
      report,
    });
  } catch (error) {
    console.error("Report POST error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
