import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await params;

    // Update current user's activity (Online status)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { updatedAt: new Date() },
    });

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: session.user.id },
          { user2Id: session.user.id },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, image: true, updatedAt: true } },
        user2: { select: { id: true, name: true, image: true, updatedAt: true } },
      },
    });

    if (!match) {
      return NextResponse.json(
        { message: "Match tidak ditemukan" },
        { status: 404 }
      );
    }

    // Mark messages in this match sent by other user as read
    await prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: session.user.id },
        read: false,
      },
      data: {
        read: true,
      },
    });

    const messages = await prisma.message.findMany({
      where: { matchId },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const otherUser =
      match.user1.id === session.user.id ? match.user2 : match.user1;

    return NextResponse.json({ messages, otherUser, match });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: "Pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Update current user's activity
    await prisma.user.update({
      where: { id: session.user.id },
      data: { updatedAt: new Date() },
    });

    // Verify user is part of this match
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { user1Id: session.user.id },
          { user2Id: session.user.id },
        ],
      },
    });

    if (!match) {
      return NextResponse.json(
        { message: "Match tidak ditemukan" },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: session.user.id,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
