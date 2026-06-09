import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Update current user's activity (online status)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { updatedAt: new Date() },
    });

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: session.user.id },
          { user2Id: session.user.id },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            image: true,
            age: true,
            bio: true,
            city: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            image: true,
            age: true,
            bio: true,
            city: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to show the "other" user
    const transformedMatches = matches.map((match) => {
      const otherUser =
        match.user1.id === session.user!.id ? match.user2 : match.user1;
      const lastMessage = match.messages[0] || null;

      return {
        id: match.id,
        otherUser,
        lastMessage,
        createdAt: match.createdAt,
      };
    });

    return NextResponse.json({ matches: transformedMatches });
  } catch (error) {
    console.error("Matches error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
