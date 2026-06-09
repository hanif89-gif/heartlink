import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const count = await prisma.message.count({
      where: {
        senderId: { not: session.user.id },
        read: false,
        match: {
          OR: [
            { user1Id: session.user.id },
            { user2Id: session.user.id },
          ],
        },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Unread count GET error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
