import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reverseGeocode } from "@/lib/geocode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { message: "Latitude dan longitude harus diisi" },
        { status: 400 }
      );
    }

    // Reverse geocode to get city and province
    const { city, province } = await reverseGeocode(latitude, longitude);

    // Update user location in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        latitude,
        longitude,
        city,
        province,
      },
      select: {
        city: true,
        province: true,
        latitude: true,
        longitude: true,
      },
    });

    return NextResponse.json({
      message: "Lokasi berhasil diupdate",
      location: updatedUser,
    });
  } catch (error) {
    console.error("Location error:", error);
    return NextResponse.json(
      { message: "Terjadi error server" },
      { status: 500 }
    );
  }
}
