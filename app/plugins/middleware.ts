import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")?.value;

  if (request.nextUrl.pathname.startsWith("/users") && authCookie !== "true") {
    return NextResponse.redirect(new URL("/login", request.url)); // or wherever your login page is
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/users/:path*", // protect /users and subpaths
};