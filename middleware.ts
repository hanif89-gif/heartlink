import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = pathname.startsWith("/api/auth");
  const isApiRegister = pathname === "/api/register";

  if (isPublicRoute || isAuthRoute || isApiRegister) {
    return NextResponse.next();
  }

  // Protected routes — redirect to login if not authenticated
  if (!req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect against banned users
  if (req.auth && (req.auth.user as any)?.role === "BANNED") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "Banned");
    return NextResponse.redirect(loginUrl);
  }

  // Profile setup check — redirect to profile if age or gender is missing
  // Exempt admin users, API routes, and the profile page itself
  const user = req.auth?.user as any;
  const isProfilePage = pathname === "/profile";
  const isAdmin = user?.role === "ADMIN";
  const isApiRoute = pathname.startsWith("/api");

  if (req.auth && !isAdmin && !isProfilePage && !isApiRoute) {
    if (!user?.age || !user?.gender) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    // If authenticated but not an ADMIN, redirect to discover
    if ((req.auth.user as any)?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/discover", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export const runtime = "nodejs";
