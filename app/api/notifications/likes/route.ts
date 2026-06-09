import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // Find all likes received by current user that are active (isLike = true)
    const receivedLikes = await prisma.like.findMany({
      where: {
        toUserId: currentUserId,
        isLike: true,
      },
      select: {
        fromUserId: true,
      },
    });

    const potentialLikerIds = receivedLikes.map((l) => l.fromUserId);

    if (potentialLikerIds.length === 0) {
      return NextResponse.json({ pendingLikes: [] });
    }

    // Find all users the current user has already swiped on
    const alreadySwiped = await prisma.like.findMany({
      where: {
        fromUserId: currentUserId,
        toUserId: { in: potentialLikerIds },
      },
      select: {
        toUserId: true,
      },
    });

    const swipedUserIds = alreadySwiped.map((l) => l.toUserId);

    // Filter out users who have already been swiped on
    const pendingLikerIds = potentialLikerIds.filter(
      (id) => !swipedUserIds.includes(id)
    );

    if (pendingLikerIds.length === 0) {
      return NextResponse.json({ pendingLikes: [] });
    }

    // Fetch details of those pending users
    const pendingLikes = await prisma.user.findMany({
      where: {
        id: { in: pendingLikerIds },
      },
      select: {
        id: true,
        name: true,
        age: true,
        bio: true,
        image: true,
        city: true,
      },
    });

    return NextResponse.json({ pendingLikes });
  } catch (error) {
    console.error("Pending likes fetch error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
