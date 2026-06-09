import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateDistance } from "@/lib/distance";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { updatedAt: new Date() },
      select: { id: true, latitude: true, longitude: true, age: true, gender: true, city: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Require profile setup before discovering
    if (!currentUser.age || !currentUser.gender) {
      return NextResponse.json({ requireProfileSetup: true });
    }

    // Get IDs of users already liked/disliked
    const alreadySwiped = await prisma.like.findMany({
      where: { fromUserId: currentUser.id },
      select: { toUserId: true },
    });

    const swipedIds = alreadySwiped.map((l) => l.toUserId);

    // Get matches involving current user
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: currentUser.id },
          { user2Id: currentUser.id },
        ],
      },
      select: { user1Id: true, user2Id: true },
    });
    const matchedIds = matches.map((m) => m.user1Id === currentUser.id ? m.user2Id : m.user1Id);

    // Excluded users: self, already swiped, and already matched
    const excludeIds = Array.from(new Set([currentUser.id, ...swipedIds, ...matchedIds]));

    // Determine target opposite gender (MVP: MALE <-> FEMALE)
    // Future ready: can easily be extended for interestedIn preferences (Male, Female, Everyone)
    const targetGender = currentUser.gender === "MALE" ? "FEMALE" : "MALE";

    // Get potential matches of the opposite gender
    const users = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        name: { not: null },
        gender: targetGender,
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        bio: true,
        image: true,
        city: true,
        province: true,
        latitude: true,
        longitude: true,
      },
      take: 20,
    });

    // Calculate distances and sort
    const usersWithDistance = users.map((user) => {
      let distance: number | null = null;
      if (
        currentUser.latitude &&
        currentUser.longitude &&
        user.latitude &&
        user.longitude
      ) {
        distance = calculateDistance(
          currentUser.latitude,
          currentUser.longitude,
          user.latitude,
          user.longitude
        );
      }
      return { ...user, distance };
    });

    // Filter by distance (<= 100km) or same city
    const filteredUsers = usersWithDistance.filter((u) => {
      // If same city, include them
      if (currentUser.city && u.city?.toLowerCase() === currentUser.city.toLowerCase()) {
        return true;
      }
      // If distance is calculated and <= 100km, include them
      if (u.distance !== null && u.distance <= 100) {
        return true;
      }
      // Otherwise, exclude them
      return false;
    });

    // Sort by distance (nearest first), users without location go last
    filteredUsers.sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
