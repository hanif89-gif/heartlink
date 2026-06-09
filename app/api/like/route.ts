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
    const { toUserId, isLike } = body;

    if (!toUserId || isLike === undefined) {
      return NextResponse.json(
        { message: "toUserId dan isLike harus diisi" },
        { status: 400 }
      );
    }

    // Prevent self-like
    if (toUserId === session.user.id) {
      return NextResponse.json(
        { message: "Tidak bisa like diri sendiri" },
        { status: 400 }
      );
    }

    // Create or update the like
    await prisma.like.upsert({
      where: {
        fromUserId_toUserId: {
          fromUserId: session.user.id,
          toUserId,
        },
      },
      update: { isLike },
      create: {
        fromUserId: session.user.id,
        toUserId,
        isLike,
      },
    });

    // If it's a like, check for mutual like (match)
    if (isLike) {
      const mutualLike = await prisma.like.findFirst({
        where: {
          fromUserId: toUserId,
          toUserId: session.user.id,
          isLike: true,
        },
      });

      if (mutualLike) {
        // Create match (ensure consistent ordering)
        const [user1Id, user2Id] =
          session.user.id < toUserId
            ? [session.user.id, toUserId]
            : [toUserId, session.user.id];

        const existingMatch = await prisma.match.findUnique({
          where: {
            user1Id_user2Id: { user1Id, user2Id },
          },
        });

        if (!existingMatch) {
          const match = await prisma.match.create({
            data: { user1Id, user2Id },
            include: {
              user1: { select: { id: true, name: true, image: true } },
              user2: { select: { id: true, name: true, image: true } },
            },
          });

          return NextResponse.json({
            matched: true,
            match,
            message: "It's a Match! 🎉",
          });
        }
      }
    }

    return NextResponse.json({
      matched: false,
      message: isLike ? "Liked! ❤️" : "Passed",
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
