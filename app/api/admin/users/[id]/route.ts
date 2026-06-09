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
    const { name, email, city, role } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        city,
        role,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi error server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent deleting oneself
    if (id === session.user.id) {
      return NextResponse.json(
        { message: "Tidak dapat menghapus akun admin Anda sendiri" },
        { status: 400 }
      );
    }

    // Execute cascading deletes in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete all Likes where user is fromUserId or toUserId
      await tx.like.deleteMany({
        where: {
          OR: [
            { fromUserId: id },
            { toUserId: id },
          ],
        },
      });

      // 2. Find all Matches involving this user
      const userMatches = await tx.match.findMany({
        where: {
          OR: [
            { user1Id: id },
            { user2Id: id },
          ],
        },
        select: { id: true },
      });
      const matchIds = userMatches.map((m) => m.id);

      if (matchIds.length > 0) {
        // 3. Delete Messages in those Matches
        await tx.message.deleteMany({
          where: {
            matchId: { in: matchIds },
          },
        });

        // 4. Delete the Matches themselves
        await tx.match.deleteMany({
          where: {
            id: { in: matchIds },
          },
        });
      }

      // Also delete any messages sent by user directly (just in case)
      await tx.message.deleteMany({
        where: { senderId: id },
      });

      // 5. Delete Reports where user is reporter or reportedUser
      await tx.report.deleteMany({
        where: {
          OR: [
            { reporterId: id },
            { reportedUserId: id },
          ],
        },
      });

      // 6. Delete Accounts and Sessions associated with user
      await tx.account.deleteMany({
        where: { userId: id },
      });
      await tx.session.deleteMany({
        where: { userId: id },
      });

      // 7. Finally delete the user
      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error: any) {
    console.error("Admin user delete error:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi error server" },
      { status: 500 }
    );
  }
}
