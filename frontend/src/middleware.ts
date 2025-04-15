import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const publicPaths = ["/login", "/signup", "/"];
  const isPublic = publicPaths.includes(req.nextUrl.pathname);

  const isProtected =
    req.nextUrl.pathname.startsWith("/home") ||
    req.nextUrl.pathname.startsWith("/favorites");

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/favorites/:path*", "/login", "/signup", "/"],
};
