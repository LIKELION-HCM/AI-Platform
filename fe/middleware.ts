import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEV_MODE = process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";

export function middleware(req: NextRequest) {
  if (DEV_MODE) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // Check REFRESH TOKEN instead (which IS in httpOnly cookie)
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/scan")) {
    if (!refreshToken) {
      console.log('[Middleware] No refresh token, redirecting to login');
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Already logged in - redirect to dashboard
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scan/:path*",
    "/",
    "/login",
    "/signup"
  ],
};