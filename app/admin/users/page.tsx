export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      city: true,
      role: true,
      age: true,
      gender: true,
      bio: true,
      province: true,
      latitude: true,
      longitude: true,
      createdAt: true,
    }
  });

  return <UsersClient initialUsers={users} />;
}
